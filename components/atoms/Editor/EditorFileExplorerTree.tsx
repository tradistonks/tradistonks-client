import React, { PropsWithChildren } from 'react';
import { C, Cpp, Go2, JavaScript, Python, TypeScript } from 'seti-icons-react';
import styles from './EditorFileExplorerTree.module.scss';
import { DefaultFolderOpened } from './icons/DefaultFolderOpened';
import { DeleteSign } from './icons/DeleteSign';

export interface TreeNodeDirectory {
  type: 'directory';
  children: TreeNode[];
}

export interface TreeNodeFile {
  type: 'file';
}

export type TreeNode = (TreeNodeDirectory | TreeNodeFile) & {
  key: string;
  title: string;
};

function getChildrenNodes(node: TreeNode) {
  return node.type === 'directory' ? node.children : [];
}

type FileIconProps = {
  isFolder: boolean;
  filename: string;
};

function FileIcon(props: FileIconProps) {
  if (props.isFolder) {
    return <DefaultFolderOpened />;
  }

  const map = {
    '.c': <C theme="extension/.c" />,
    '.h': <C theme="extension/.h" />,
    '.m': <C theme="extension/.m" />,
    '.cpp': <Cpp theme="extension/.cpp" />,
    '.hpp': <Cpp theme="extension/.hpp" />,
    '.cc': <Cpp theme="extension/.cc" />,
    '.hh': <Cpp theme="extension/.hh" />,
    '.c++': <Cpp theme="extension/.c++" />,
    '.h++': <Cpp theme="extension/.h++" />,
    '.cxx': <Cpp theme="extension/.cxx" />,
    '.hxx': <Cpp theme="extension/.hxx" />,
    '.mm': <Cpp theme="extension/.mm" />,
    '.go': <Go2 theme="extension/.go" />,
    'spec.ts': <TypeScript theme="extension/.spec.ts" />,
    'test.ts': <TypeScript theme="extension/.test.ts" />,
    '.ts': <TypeScript theme="extension/.ts" />,
    'spec.js': <JavaScript theme="extension/.spec.js" />,
    'test.js': <JavaScript theme="extension/.test.js" />,
    '.js': <JavaScript theme="extension/.js" />,
    '.py': <Python theme="extension/.py" />,
  };

  const pair = Object.entries(map).find(([extension]) =>
    props.filename.endsWith(extension),
  );

  return pair?.[1] ?? <React.Fragment />;
}

export function EditorFileExplorerTree(
  props: PropsWithChildren<{
    nodes: TreeNode[];
    currentPath?: string;
    depth?: number;
    onSelect: (path: string) => void;
    onRemove: (path: string) => void;
  }>,
) {
  const getDepth = () => props.depth ?? 0;

  return (
    <>
      {props.nodes.map((node) => (
        <React.Fragment key={node.key}>
          <div
            className={
              styles['node'] +
              (props.currentPath === node.key ? ` ${styles['active']}` : '')
            }
            style={{
              paddingLeft: `${getDepth() * 24}px`,
            }}
            onClick={() => node.type === 'file' && props.onSelect(node.key)}
          >
            <FileIcon
              isFolder={node.type === 'directory'}
              filename={node.key}
            />
            <span>{node.title}</span>
            <DeleteSign
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                props.onRemove?.(node.key);
              }}
            />
          </div>
          <EditorFileExplorerTree
            nodes={getChildrenNodes(node)}
            currentPath={props.currentPath}
            depth={getDepth() + 1}
            onSelect={props.onSelect}
            onRemove={props.onRemove}
          />
        </React.Fragment>
      ))}
    </>
  );
}
