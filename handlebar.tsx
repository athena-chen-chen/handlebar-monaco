import React, { useState, useEffect, useRef } from 'react';
import * as handlebars from 'handlebars';
import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import Barhandles from 'barhandles';

interface exampleSchema {
  title: string;
  author: {
    firstName: string;
    lastName: string;
  };
  contentBody: string;
  license: string;
  footnotes: [];
  comments: [{ id: string; title: string; body: string }];
  permalink: string;
}

const HandlerBars = () => {
  const editorRef = useRef(null);
  const monaco = useMonaco();
  const [schema, setSchema] = useState('');
  useEffect(() => {
    if (monaco) {
      monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
      console.log('here is the monaco instance:', monaco);
    }
  }, [monaco]);

  const handleOnChange = (value, event) => {
    validate(value);
  };
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    validate(editorRef.current.getValue());
  }

  function handleEditorWillMount(monaco) {
    console.log('beforeMount: the monaco instance:', monaco);
  }
  function validate(input) {
    const ast = handlebars.parse(input);

    const compile = handlebars.precompile(ast);
    const schemaBar = Barhandles.extractSchema(input);
    setSchema(JSON.stringify(schemaBar, null, '\t'));
    console.log('schema', JSON.stringify(schemaBar));
  }

  return (
    <div>
      <label>Please input handlebars block</label>
      <MonacoEditor
        height={200}
        value=""
        language="handlebars"
        theme="vs-dark"
        onChange={handleOnChange}
        onMount={handleEditorDidMount}
        beforeMount={handleEditorWillMount}
      />
      <label>handlebar schema</label>
      <MonacoEditor height={600} value={schema} language="json" theme="vs-dark" />
    </div>
  );
};

export default HandlerBars;
