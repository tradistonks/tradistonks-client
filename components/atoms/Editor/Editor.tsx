import { OnChange, OnMount } from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import React, { PropsWithChildren } from 'react';

const ControlledEditor = dynamic(import('@monaco-editor/react'));

export type EditorProps = PropsWithChildren<{
  language: string;
  value: string;
  height?: string | number;

  onChange?: OnChange;
  onMount?: OnMount;
}>;

export default function Editor(props: EditorProps) {
  return (
    <ControlledEditor
      height={props.height ?? '100%'}
      language={props.language}
      theme="vs-dark"
      value={props.value}
      onChange={props.onChange}
      onMount={(editor, monaco) => {
        props.onMount?.(editor, monaco);
      }}
    />
  );
}
