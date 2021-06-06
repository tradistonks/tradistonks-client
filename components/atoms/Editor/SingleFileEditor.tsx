import { OnChange, OnMount } from '@monaco-editor/react';
import dynamic from 'next/dynamic';
import React, { PropsWithChildren } from 'react';
import styles from './SingleFileEditor.module.scss';

const ControlledEditor = dynamic(import('@monaco-editor/react'));

export type SingleFileEditorOnChange = (content: string | null) => void;

export type SingleFileEditorProps = PropsWithChildren<{
  value: string;
  language: string;

  height?: string | number;

  onChange?: SingleFileEditorOnChange;

  onMount?: OnMount;
}>;

export default function SingleFileEditor(props: SingleFileEditorProps) {
  const onChange: OnChange = (value) => {
    props.onChange?.(value ?? '');
  };

  return (
    <div
      className={styles['container']}
      style={{ height: props.height ?? '100%' }}
    >
      <div className={styles['editor-container']}>
        <ControlledEditor
          height="100%"
          width="100%"
          language={props.language}
          theme="vs-dark"
          value={props.value}
          onChange={onChange}
          onMount={(editor, monaco) => {
            props.onMount?.(editor, monaco);
          }}
        />
      </div>
    </div>
  );
}

export type FormEditorProps = Omit<
  SingleFileEditorProps,
  'onChange' | 'value'
> & {
  // Antd handlers
  id?: string;
  value?: string;
  onChange?: (values: unknown) => void;
};

export function SingleFileFormEditor(props: FormEditorProps) {
  const onEditorChange: SingleFileEditorOnChange = (content) => {
    if (props.onChange && props.id) {
      props.onChange(content);
    }
  };

  return (
    <SingleFileEditor
      {...props}
      value={props.value ?? ''}
      onChange={onEditorChange}
    />
  );
}
