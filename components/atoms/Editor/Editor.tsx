import dynamic from 'next/dynamic';
import React, { PropsWithChildren, useState } from 'react';
import { OnChange, OnMount } from '@monaco-editor/react';
import styles from './Editor.module.scss';
import EditorFileExplorer, {
  EditorFileExplorerFile,
  EditorFileExplorerItem,
} from './EditorFileExplorer';

const ControlledEditor = dynamic(import('@monaco-editor/react'));

export const EDITOR_EXTENSION_ASSOCIATION: Record<
  string,
  {
    language: string;
  }
> = {
  '.cpp': {
    language: 'cpp',
  },
  '.hpp': {
    language: 'cpp',
  },
  '.cc': {
    language: 'cpp',
  },
  '.hh': {
    language: 'cpp',
  },
  '.c': {
    language: 'c',
  },
  '.h': {
    language: 'c',
  },
  '.md': {
    language: 'markdown',
  },
  '.js': {
    language: 'javascript',
  },
  '.ts': {
    language: 'typescript',
  },
  '.py': {
    language: 'python',
  },
  '.cs': {
    language: 'csharp',
  },
  '.html': {
    language: 'html',
  },
  '.css': {
    language: 'css',
  },
  '.go': {
    language: 'go',
  },
};

export function setFileCode(
  files: EditorFileExplorerItem[],
  path: string,
  content: string | null,
) {
  let filesCopy = [...files];

  if (content === null) {
    filesCopy = filesCopy.filter(
      (f) => f.path !== path && !f.path.startsWith(`${path}/`),
    );
  } else {
    const file = filesCopy.find(
      (f) => f.path === path,
    ) as EditorFileExplorerFile;

    if (file) {
      file.content = content;
    } else {
      filesCopy.push({
        path,
        type: 'file',
        content,
      });
    }
  }

  return filesCopy;
}

export type EditorOnChange = (path: string, content: string | null) => void;

export default function Editor(
  props: PropsWithChildren<{
    files: EditorFileExplorerItem[];
    defaultCurrentPath?: string;

    height?: string | number;

    onChange?: EditorOnChange;
    onSelect?: (path: string) => void;

    onMount?: OnMount;
  }>,
) {
  const [fileExplorerWidth] = useState(300);
  const [currentPath, setCurrentPath] = useState(
    props.defaultCurrentPath ?? '',
  );

  const onFileSelect = (path: string) => {
    setCurrentPath(path);
    props.onSelect?.(path);
  };

  const onChange: OnChange = (value) => {
    props.onChange?.(currentPath, value ?? '');
  };

  const onCreate = (path: string, value: string) => {
    props.onChange?.(path, value);
  };

  const onRemove = (path: string) => {
    props.onChange?.(path, null);
  };

  const getFileLanguage = (path: string) => {
    const extension = Object.keys(EDITOR_EXTENSION_ASSOCIATION).find(
      (association) => path.endsWith(association),
    );

    if (!extension) {
      return null;
    }

    return EDITOR_EXTENSION_ASSOCIATION[extension].language;
  };

  const getFileCode = (path: string) => {
    const file = props.files.find(
      (f) => f.path === path,
    ) as EditorFileExplorerFile;
    return file?.content ?? '';
  };

  return (
    <div
      className={styles['container']}
      style={{ height: props.height ?? '100%' }}
    >
      <EditorFileExplorer
        width={fileExplorerWidth}
        files={props.files}
        currentPath={currentPath}
        onSelect={onFileSelect}
        onCreate={onCreate}
        onRemove={onRemove}
      />
      <div
        className={styles['editor-container']}
        style={{
          width: `calc(100% - ${fileExplorerWidth}px)`,
        }}
      >
        <ControlledEditor
          height="100%"
          width="100%"
          language={getFileLanguage(currentPath) ?? undefined}
          theme="vs-dark"
          value={getFileCode(currentPath)}
          onChange={onChange}
          onMount={(editor, monaco) => {
            props.onMount?.(editor, monaco);
          }}
        />
      </div>
    </div>
  );
}
