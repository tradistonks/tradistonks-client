import React, { PropsWithChildren } from 'react';
import { C, Cpp, Go2, Python, TypeScript } from 'seti-icons-react';
import styles from './EditorFileExplorerTree.module.scss';

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
  filename: string;
};

function FileIcon(props: FileIconProps) {
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
    depth?: number;
    onSelect: (key: string) => void;
  }>,
) {
  const getDepth = () => props.depth ?? 0;

  return (
    <>
      {props.nodes.map((node) => (
        <React.Fragment key={node.key}>
          <div
            className={styles['node']}
            style={{
              paddingLeft: `${getDepth() * 24}px`,
            }}
            onClick={() => props.onSelect(node.key)}
          >
            <FileIcon filename={node.key} />
            <span>{node.title}</span>
          </div>
          <EditorFileExplorerTree
            depth={getDepth() + 1}
            nodes={getChildrenNodes(node)}
            onSelect={props.onSelect}
          />
        </React.Fragment>
      ))}
    </>
  );
}
