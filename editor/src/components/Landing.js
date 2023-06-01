import React, { useEffect, useState } from "react";
import CodeEditorWindow from "./CodeEditorWindow";
import axios from "axios";
import { classnames } from "../utils/general";
import { languageOptions } from "../constants/languageOptions";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { defineTheme } from "../lib/defineTheme";
import useKeyPress from "../hooks/useKeyPress";
import Footer from "./Footer";
//import OutputWindow from "./OutputWindow";
import CustomInput from "./CustomInput";
import OutputDetails from "./OutputDetails";
import ClassTest from "./ClassTest";
//import ClassWindow from "./ClassWindow";
import ThemeDropdown from "./ThemeDropdown";
import LanguagesDropdown from "./LanguagesDropdown";
import App from "../App";
import { waitFor } from "@testing-library/react";

import Editor from '@monaco-editor/react';
import '../index.css'
import { Range } from 'monaco-editor';
import parse from 'html-react-parser';

const urlCoverageServer = "http://localhost:3001/";
const urlClassServer = "http://localhost:3002/";
const urlTestsServer = "http://localhost:3003/";
const fileNameDefault = "test.java";

const template = `
import static org.junit.Assert.assertEquals;
import org.junit.Test;

public class AppTest{
  @After
  public void tearDown(){

  }

  @AfterClass
  public static void tearDownClass(){

  }

  @Before
  public void setUp(){

  }

  @BeforeClass
  public static void setUpClass(){

  }

  @Test
  public void test(){
    assertEquals(2,1+1);
  }
}
`;

const ClassEditor = ({code, language, theme, editorDidMount}) => {
    return (
    <div id="Class-Window" className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor 
          height="50vh"
          width={`100%`}
          language={language}
          value={code}
          //path={value}
          theme={theme}
          defaultValue="// some comment"
          options={{readOnly: true}} // rendiamo la classe da testare non modificabile
          onMount={editorDidMount}
      />
    </div>
    );
};

const ClassEditorCoverage = ({code, language, theme, editorDidMount}) => {
  return (
  <div id="Class-Window" className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
    <Editor 
        height="50vh"
        width={`100%`}
        language={language}
        value={code}
        //path={value}
        theme={theme}
        defaultValue="// some comment"
        options={{readOnly: true}} // rendiamo la classe da testare non modificabile
        onMount={editorDidMount} // applichiamo le decorations
    />
  </div>
  );
};

const CoverageWindow = ({code, url}) => {
    /*/ restituisce la coverage da request html
    return (
    <div id="Coverage-Window" className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl"> 
      <iframe srcdoc={code} height={380} width={570}> 
      </iframe>
    </div>
    ); //*/

    // restituisce la coverage da url
    return (
      <div id="Coverage-Window" className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl"> 
        <iframe src={url} height={380} width={570}> 
        </iframe>
      </div>
      ); //*/
};

const ClassWindow = ({coverageDisplay, code, language, url, theme, editorDidMount, editorDidMountE}) => {
    if (!coverageDisplay) {
        return <ClassEditor theme={theme} code={code} language={language} editorDidMount={editorDidMountE}/>;
    }
    /*/ restituiamo la coverage come pagina html
    else
    {
        return <CoverageWindow url={url} code={code}/>;
    } //*/
    // restituiamo la coverage all'interno dell'editor
    else
    {
        return <ClassEditorCoverage theme={theme} code={code} language={language} editorDidMount={editorDidMount}/>;
    } //*/
};

const OutputNull = ({}) => {
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        
      </div>
    </>
  ); 
}

const OutputCoverage = ({html}) => {
  /*class MyComponent extends React.Component {  render() {    
    // HTML da parsare    
    //const html = '<div><h1>Title</h1><p>Paragraph</p></div>';    
    // Effettua il parsing dell'HTML in componenti React    
    const parsedHTML = parse(html);    
    return <div>{parsedHTML}</div>;  }}*/
    return (
      <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
          Output
      </h1>
      <pre className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        Il test ha coperto 2 righe di codice.
      </pre>
      </>
    );
  /*return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
          Output
      </h1>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto"
      dangerouslySetInnerHTML={{ __html: html }}></div>
    </>
    );//*/
}


const OutputWindow = ({coverageDisplay, parsedXml}) => {
  if (!coverageDisplay) {
      return <OutputNull  />;
  }
  /*/ restituiamo la coverage come pagina html
  else
  {
      return <CoverageWindow url={url} code={code}/>;
  } //*/
  // restituiamo la coverage all'interno dell'editor
  else
  {
      return <OutputCoverage html={parsedXml}/>;
  } //*/
};


const Landing = () => {
  const [code, setCode] = useState(template);
  const [classCode, setClassCode] = useState('');
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [classTest, setClassTest] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [processing_saveAs, setProcessingSaveAs] = useState(null);
  const [processing_save, setProcessingSave] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [coverageDisplay, setCoverageDisplay] = useState(false);
  const [url, setUrl] = useState('');

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const [vars, setVars] = useState({});
  const [decorations, setDecorations] = useState([]);
  const { monacoEditor, monaco } = vars;

  const [varsE, setVarsE] = useState({});
  const { monacoEditorE, monacoE } = varsE;

  const [htmlContent, setHtmlContent] = useState('');
  const [parsedXml, setParsedXml] = useState('');

  async function handleEditorDidMount(monacoEditor, monaco) {
    setVars({ monacoEditor, monaco });
  }

  async function handleEditorDidMountE(monacoEditorE, monacoE) {
    setVarsE({ monacoEditorE, monacoE }); 
  }

  useEffect(() => {
    if (!monacoEditorE || !monacoE) {
        return;
    }

    fetch(urlClassServer)
    .then(response => {
    if (response.ok) {
        return response.text();
    } else {
        throw new Error('Errore nella richiesta GET al server.');
    }
    })
    .then(data => {
    console.log('classe caricata correttamente');
    setClassCode(data);
    })
    .catch(error => {
    console.error('Errore:', error);
    });

  }, [monacoEditorE, monacoE]);

  useEffect(() => {
    if (!monacoEditor || !monaco) {
        return;
    } 

    const ids = monacoEditor.deltaDecorations([],decorations);

    return () => monacoEditor.deltaDecorations(ids, []);
  }, [monacoEditor, monaco]);

  const onSelectChange = (sl) => {
    console.log("selected Option...", sl);
    setLanguage(sl);
  };

  useEffect(() => {
    if (enterPress && ctrlPress) {
      console.log("enterPress", enterPress);
      console.log("ctrlPress", ctrlPress);
      handleCompile();
    }
  }, [ctrlPress, enterPress]);

  const onChange = (action, data) => {
    setCode(data);
    console.log(code);
    console.log("action = ", action)
    console.log("data = ", data)
  };

  const handleSave = () => {
    setProcessingSave(true);
    const fileName = window.prompt('Inserisci il nome del file', fileNameDefault);
    if (fileName){
        // Invia il codice al server
        const msg={
            name:fileName,
            code:code
        }
    
        fetch(urlTestsServer, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(msg),
        }).then(response => {
            console.log(response);
            if (response.ok) {
                console.log('File inviato correttamente al server.');
                window.alert('File salvato con successo in remoto');
                //setIsModalOpen(true);
            } else {
                console.error('Errore durante l\'invio del file al server.');
                window.alert('Errore durante il salvataggio del test');
            }
        })
        .catch(error => {
            console.error('Errore durante l\'invio della richiesta al server:', error);
            window.alert('Errore durante il salvataggio del test');
        });
    }
    setProcessingSave(false);
  };
  const handleSaveAs = () => {
    setProcessingSaveAs(true);
    const fileName = window.prompt('Inserisci il nome del file', 'test.java');
    if (fileName) {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();

        // Rilascia l'URL creato dopo il download
        URL.revokeObjectURL(url);

    }
    setProcessingSaveAs(false);
  };

  const handleCompile = () => {
    setProcessing(true);
    
    // Invia il codice al server
    const msg={
        name:fileNameDefault,
        code:code
    }

    fetch(urlCoverageServer, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify(msg),
    }).then(response => response.json())
    .then(data => {
      setHtmlContent(data.html);
      //var iframe = document.getElementById('output');
      //document.open();
      //document.write(data.html);
      //var iframedoc = iframe.contentDocument || iframe.contentWindow.document;
      //iframedoc.body.innerHTML = data.html;

      /*const div = document.createElement('div');        
      div.innerHTML = data.html;        
      // Estrai il testo        
      const text = div.textContent;        
      // Visualizza il testo nell'elemento di output        
      const outputElement = document.getElementById('output');        
      outputElement.textContent = text;*/

     
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(data.xml, 'text/xml');
      console.log(xmlDoc);
      parseJacocoCoverage(xmlDoc);
      setCoverageDisplay(true);
      // Puoi accedere al documento XML tramite xmlDoc e lavorare con i suoi elementi e attributi
    })
    .catch(error => {
        console.error('Errore durante l\'invio della richiesta al server:', error);
    });

    //var doc = document.getElementById('output');
    //console.log(doc);
    //doc.textContent=htmlContent;
    //doc.open();
    //doc.write(htmlContent);
    //doc.close();

setProcessing(false);

// Funzione per analizzare il file XML di copertura Jacoco
function parseJacocoCoverage(xml) {
  var coverageData = [];

  // Esempio di iterazione su tutti gli elementi "<sourcefile>"
  var classElements = xml.getElementsByTagName("sourcefile");
  console.log(classElements);
  for (var i = 0; i < classElements.length; i++) {
      var classElement = classElements[i];
      var className = classElement.getAttribute('name');

      // Esempio di estrazione delle informazioni delle linee di codice
      var lines = classElement.getElementsByTagName('line');
      //var lineInfo = {};
      var decs = [];
      for (var j = 0; j < lines.length; j++) {
          var line = lines[j];
          var lineNumber = parseInt(line.getAttribute('nr'));
          var instructionNotCovered = line.getAttribute('mi') != '0';
          var branchNotCovered = line.getAttribute('mb') != '0';

          const range = new Range(lineNumber, 1, lineNumber+1, 1);
          if (instructionNotCovered){
            decs.push({
              range: range,
              options: { inlineClassName: "instruction.not.covered" }
            });
          }
          else if (branchNotCovered){
            decs.push({
              range: range,
              options: { inlineClassName: "branch.not.covered" }
            });
          }
          else {
            decs.push({
              range: range,
              options: { inlineClassName: "line.covered" }
            });
          }

        }

        setDecorations(decs);

    }
  };

  // Funzione per ottenere l'output dal file XML di copertura Jacoco
};

    

  const checkStatus = async (token) => {
    const options = {
      method: "GET",
      url: process.env.REACT_APP_RAPID_API_URL + "/" + token,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
    };
    try {
      let response = await axios.request(options);
      let statusId = response.data.status?.id;

      // Processed - we have a result
      if (statusId === 1 || statusId === 2) {
        // still processing
        setTimeout(() => {
          checkStatus(token);
        }, 2000);
        return;
      } else {
        setProcessing(false);
        setOutputDetails(response.data);
        showSuccessToast(`Compiled Successfully!`);
        console.log("response.data", response.data);
        return;
      }
    } catch (err) {
      console.log("err", err);
      setProcessing(false);
      showErrorToast();
    }
  };

  function handleThemeChange(th) {
    const theme = th;
    console.log("theme...", theme);

    if (["light", "vs-dark"].includes(theme.value)) {
      setTheme(theme);
    } else {
      defineTheme(theme.value).then((_) => setTheme(theme));
    }
  }
  useEffect(() => {
    defineTheme("oceanic-next").then((_) =>
      setTheme({ value: "oceanic-next", label: "Oceanic Next" })
    );
  }, []);

  const showSuccessToast = (msg) => {
    toast.success(msg || `Compiled Successfully!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
  const showErrorToast = (msg, timer) => {
    toast.error(msg || `Something went wrong! Please try again.`, {
      position: "top-right",
      autoClose: timer ? timer : 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };
 
  

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />


      <div className="h-4 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500"></div>
      <div className="flex flex-row space-x-4 items-start px-4 py-4">
        <button 
          onClick={handleSave}
          disabled={!code}
          className={classnames(
            "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2.5 hover:shadow transition duration-200 bg-white flex-shrink-0",
            !code ? "opacity-100" : ""
          )}
        >
          {processing_save? "Saving..." : "Save Test"}
        </button>
        <button 
          onClick={handleSaveAs}
          disabled={!code}
          className={classnames(
            "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-4 py-2.5 hover:shadow transition duration-200 bg-white flex-shrink-0",
            !code ? "opacity-100" : ""
          )}
        >
          {processing_saveAs? "Downloading..." : "Download Test"}
        </button>
        <div className="flex flex-row space-x-4 items-start px-0 py-4">
          <ThemeDropdown handleThemeChange={handleThemeChange} theme={theme} />
        </div>
        <button
          onClick={handleCompile}
          disabled={!code}
          className={classnames(
            "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-12 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
            !code ? "opacity-50" : ""
          )}
        >
          {processing? "Processing..." : "Compile and Execute"}
        </button>
      </div>
      <div className="flex flex-row space-x-4 items-start px-4 py-0">
        <div className="flex flex-col w-full h-full justify-start items-end">
          <CodeEditorWindow
            code={code}
            onChange={onChange}
            language={language?.value}
            theme={theme.value}
          />
        </div>

        <div className="right-container flex flex-shrink-0 w-[40%] flex-col">
          <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
            Class Under Test
          </h1>
          <div className="flex flex-col w-full h-full justify-start items-end">
            <ClassWindow
              code={classCode}
              coverageDisplay={coverageDisplay}
              language={language?.value}
              theme={theme.value}
              url={url}
              editorDidMount={handleEditorDidMount}
              editorDidMountE={handleEditorDidMountE}
            />
          </div>
          <div id = "prova" className = "overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
          </div>
          <OutputWindow coverageDisplay={coverageDisplay} html={htmlContent} />
          <div className="flex flex-col items-end">
          </div>
        </div>
      </div>
    </>
  );

  /*return(
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <button
        onClick={handleCompile}
        disabled={!code}
        className={classnames(
          "mt-4 border-2 border-black z-10 rounded-md shadow-[5px_5px_0px_0px_rgba(0,0,0)] px-12 py-2 hover:shadow transition duration-200 bg-white flex-shrink-0",
          !code ? "opacity-50" : ""
        )}
      >
        {processing? "Processing..." : "Compile and Execute"}
      </button>

      <div id = "prova" className="h-80 w-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      </div>
    </>
  )*/
};
export default Landing;
