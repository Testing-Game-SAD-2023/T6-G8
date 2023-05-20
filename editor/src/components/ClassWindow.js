//import React from "react";

import React, { useState } from "react";

import Editor from "@monaco-editor/react";

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const ClassWindow = ({ onChange, language, code, theme }) => {
  const [value, setValue] = useState(code || "");

  var markers = [{
    severity: monaco.MarkerSeverity.Warning,
    message: "Some warning",
    startLineNumber: 1,
    startColumn: 1,
    endLineNumber: 10,
    //endColumn: monaco.editor.getModel().getLineLength(1) + 1
    endColumn: 10
  }];
  //var markers;
  

  return (
      <div id="Class-Window" className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
        <Editor 
            height="50vh"
            width={`100%`}
            language={language}
            value={value}
            //path={value}
            theme={theme}
            defaultValue="// some comment"
            onChange={null}
            options={{readOnly: true}} // rendiamo la classe da testare non modificabile
            onValidate={markers}
        />
      </div>
  );
};
export default ClassWindow;


/*const ClassWindow = ({ classTest }) => {
    const getClass = () => {

    }
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Class Under Test
      </h1>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {classTest ? <>{getClass()}</> : null}
      </div>
    </>
  );
};

export default ClassWindow;*/