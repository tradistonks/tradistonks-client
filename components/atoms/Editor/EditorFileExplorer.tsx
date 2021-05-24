import { Button, Col, Input, Row } from 'antd';
import React, { PropsWithChildren, useState } from 'react';
import styles from './EditorFileExplorer.module.scss';
import { EditorFileExplorerTree, TreeNode } from './EditorFileExplorerTree';

export interface EditorFileExplorerFile {
  path: string;
  type: 'file';
  content: string;
}

export interface EditorFileExplorerDirectory {
  path: string;
  type: 'directory';
}

export type EditorFileExplorerItem =
  | EditorFileExplorerFile
  | EditorFileExplorerDirectory;

export default function EditorFileExplorer(
  props: PropsWithChildren<{
    files: EditorFileExplorerItem[];
    currentPath?: string;
    width: string | number;
    onSelect?: (path: string) => void;
    onRemove: (path: string) => void;
    onCreate: (path: string, value: string) => void;
  }>,
) {
  const [fileName, setFileName] = useState('');

  const transformToObjectTree = (
    files: EditorFileExplorerItem[],
    search = '',
  ) => {
    const nodes: TreeNode[] = [];

    for (const file of files) {
      if (!file.path.includes(search)) {
        continue;
      }

      const segments = file.path.split('/');

      let currentPath = '';
      let cursor = nodes;

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const node = cursor.find((n) => n.title === segment);

        currentPath += `${currentPath.length > 0 ? '/' : ''}${segment}`;

        if (node && node.type === 'directory') {
          cursor = node.children;
        } else {
          const type =
            i === segments.length - 1 && file.type === 'file'
              ? 'file'
              : 'directory';

          const newNode: TreeNode = {
            key: currentPath,
            title: segment,
            type,
            children: [],
          };

          cursor.push(newNode);

          if (newNode.type === 'directory') {
            cursor = newNode.children;
          }
        }
      }
    }

    return nodes;
  };

  const onCreate = (value = '') => {
    if (!fileName) return;

    props.onCreate(fileName, value);
    props.onSelect?.(fileName);

    setFileName('');
  };

  return (
    <div
      className={styles['file-explorer']}
      style={{
        width: props.width,
      }}
    >
      <Row
        justify="space-between"
        align="middle"
        className={styles['filename-container']}
      >
        <Col flex="1">
          <Input
            placeholder="Filename"
            className={styles['filename']}
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();

                onCreate();
              }
            }}
          ></Input>
        </Col>
        <Col>
          <Button type="primary" onClick={() => onCreate()}>
            +
          </Button>
        </Col>
      </Row>
      <EditorFileExplorerTree
        nodes={transformToObjectTree(props.files)}
        currentPath={props.currentPath}
        onSelect={(path) => props.onSelect?.(path)}
        onRemove={(path) => props.onRemove?.(path)}
      />
    </div>
  );
}
