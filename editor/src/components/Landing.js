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
import OutputWindow from "./OutputWindow";
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

const ExampleClass = `
import java.util.ArrayList;
import java.util.List;

public class ByteArrayHashMap<T>
{
    /**
     * The default initial capacity - MUST be a power of two.
     */
    static final int DEFAULT_INITIAL_CAPACITY = 16;

    /**
     * The maximum capacity, used if a higher value is implicitly specified
     * by either of the constructors with arguments.
     * MUST be a power of two <= 1<<30.
     */
    static final int MAXIMUM_CAPACITY = 1 << 30;

  
    static final float DEFAULT_LOAD_FACTOR = 0.75f;

 
    protected Entry<T>[] table;
    protected int size;
    private int threshold;
    final float loadFactor;

  
    @SuppressWarnings("unchecked")
	public ByteArrayHashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);

        // Find a power of 2 >= initialCapacity
        int capacity = 1;
        while (capacity < initialCapacity) 
            capacity <<= 1;
    
        this.loadFactor = loadFactor;
        threshold = (int)(capacity * loadFactor);
        table = new Entry[capacity];
    }
  
  
    public ByteArrayHashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }

    @SuppressWarnings("unchecked")
    public ByteArrayHashMap() {
        this.loadFactor = DEFAULT_LOAD_FACTOR;
        threshold = (int)(DEFAULT_INITIAL_CAPACITY * DEFAULT_LOAD_FACTOR);
        table = new Entry[DEFAULT_INITIAL_CAPACITY];
    }


 
    public int size() {
        return size;
    }
  
  
    public boolean isEmpty() {
        return size == 0;
    }

    public T get(byte[] key, int offset, int len )
    {
    	byte[]	k = new byte[len];
    	System.arraycopy( key, offset, k, 0, len );
    	return( get( k ));
    }
    
    public T get(byte[] key) {
        
        int hash = hash(key);
        int i = indexFor(hash, table.length);
        Entry<T> e = table[i]; 
        while (true) {
            if (e == null)
                return null;
            if (e.hash == hash && eq(key, e.key)) 
                return e.value;
            e = e.next;
        }
    }
 
    public boolean
    containsKey(
    	byte[]	key )
    {
        int hash = hash(key);
        int i = indexFor(hash, table.length);
        Entry<T> e = table[i]; 
        while (true) {
            if (e == null)
                return( false );
            if (e.hash == hash && eq(key, e.key)) 
                return( true );
            e = e.next;
        }
    }
    
    public T put(byte[] key, T value) {
        int hash = hash(key);
        int i = indexFor(hash, table.length);

        for (Entry<T> e = table[i]; e != null; e = e.next) {
            if (e.hash == hash && eq(key, e.key)) {
                T oldValue = e.value;
                e.value = value;
              
                return oldValue;
            }
        }

        addEntry(hash, key, value, i);
        return null;
    }

 
    public T remove(byte[] key) {
        Entry<T> e = removeEntryForKey(key);
        return (e == null ? null : e.value);
    }


    public void clear() {
      
        Entry<T> tab[] = table;
        for (int i = 0; i < tab.length; i++) 
            tab[i] = null;
        size = 0;
    }
    
    public List<byte[]> keys() {
    	List<byte[]>	res = new ArrayList<byte[]>();
    	
        for (int j = 0; j < table.length; j++) {
	         Entry<T> e = table[j];
	         while( e != null ){
               	res.add( e.key );
                	
                 e = e.next;
	        }
	    }
        
        return( res );
    }
    
    public List<T> values() {
    	List<T>	res = new ArrayList<T>();
    	
        for (int j = 0; j < table.length; j++) {
	         Entry<T> e = table[j];
	         while( e != null ){
               	res.add( e.value );
                	
                e = e.next;
	        }
	    }
        
        return( res );
    }

    /**
     * Bit inefficient at the moment
     * @return
     */    
    public ByteArrayHashMap<T> duplicate() {
    	ByteArrayHashMap<T>	res = new ByteArrayHashMap<T>(size,loadFactor);
    	
        for (int j = 0; j < table.length; j++) {
	         Entry<T> e = table[j];
	         while( e != null ){
              	res.put( e.key, e.value );
               	
               e = e.next;
	        }
	    }
       
       return( res );
    }
    
    
    @SuppressWarnings("unchecked")
    void resize(int newCapacity) {
        Entry<T>[] oldTable = table;
        int oldCapacity = oldTable.length;
        if (oldCapacity == MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return;
        }

        Entry<T>[] newTable = new Entry[newCapacity];
        transfer(newTable);
        table = newTable;
        threshold = (int)(newCapacity * loadFactor);
    }

  
    void transfer(Entry<T>[] newTable) {
        Entry<T>[] src = table;
        int newCapacity = newTable.length;
        for (int j = 0; j < src.length; j++) {
            Entry<T> e = src[j];
            if (e != null) {
                src[j] = null;
                do {
                    Entry<T> next = e.next;
                    int i = indexFor(e.hash, newCapacity);  
                    e.next = newTable[i];
                    newTable[i] = e;
                    e = next;
                } while (e != null);
            }
        }
    }

 
    Entry<T> removeEntryForKey(byte[] key) {
        int hash = hash(key);
        int i = indexFor(hash, table.length);
        Entry<T> prev = table[i];
        Entry<T> e = prev;

        while (e != null) {
            Entry<T> next = e.next;
            if (e.hash == hash && eq(key, e.key)) {
               
                size--;
                if (prev == e) 
                    table[i] = next;
                else
                    prev.next = next;
       
                return e;
            }
            prev = e;
            e = next;
        }
   
        return e;
    }

 

    protected static class Entry<S>{
    	public final byte[] key;
        public S value;
        public final int hash;
        public Entry<S> next;

        /**
         * Create new entry.
         */
        Entry(int h, byte[] k, S v, Entry<S> n) { 
            value = v; 
            next = n;
            key = k;
            hash = h;
        }

        public byte[] getKey() {
            return key;
        }

        public S getValue() {
            return value;
        }

    }

 
    void addEntry(int hash, byte[] key, T value, int bucketIndex) {
        table[bucketIndex] = new Entry<T>(hash, key, value, table[bucketIndex]);
        if (size++ >= threshold) 
            resize(2 * table.length);
    }

 
    void createEntry(int hash, byte[] key, T value, int bucketIndex) {
        table[bucketIndex] = new Entry<T>(hash, key, value, table[bucketIndex]);
        size++;
    }
    
    private static final int hash(byte[] x) {	
    	int	hash = 0;
    	
    	int	len = x.length;
    	
        for (int i = 0; i < len; i++){
      
        	hash = 31*hash + x[i];
        }
        
        return( hash );
    }

  
    private static final boolean eq(byte[] x, byte[] y) 
    {
        if ( x == y ){
        	return( true );
        }
        
        int	len = x.length;
        
        if ( len != y.length ){
        	return( false );
        }
        
        for (int i=0;i<len;i++){
        	if ( x[i] != y[i] ){
        		return( false );
        	}
        }
        
        return( true );
    }

  
    private static final int indexFor(int h, int length) 
    {
        return h & (length-1);
    }
 
  
}`;


const javascriptDefault = `
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

const urlDefault = "https://www.eclemma.org/jacoco/trunk/coverage/org.jacoco.examples/org.jacoco.examples/ClassInfo.java.html";

const ClassEditor = ({code, language, theme}) => {
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

const ClassWindow = ({coverageDisplay, code, language, url, theme, editorDidMount}) => {
    if (!coverageDisplay) {
        return <ClassEditor theme={theme} code={code} language={language} />;
    }
    // restituiamo la coverage come pagina html
    else
    {
        return <CoverageWindow url={url} code={code}/>;
    } //*/
    /*/ restituiamo la coverage all'interno dell'editor
    else
    {
        return <ClassEditorCoverage theme={theme} code={code} language={language} editorDidMount={editorDidMount}/>;
    } //*/
};


const Landing = () => {
  const [code, setCode] = useState(javascriptDefault);
  const [classCode, setClassCode] = useState(ExampleClass);
  const [customInput, setCustomInput] = useState("");
  const [outputDetails, setOutputDetails] = useState(null);
  const [classTest, setClassTest] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [processing_saveAs, setProcessingSaveAs] = useState(null);
  const [processing_save, setProcessingSave] = useState(null);
  const [theme, setTheme] = useState("cobalt");
  const [language, setLanguage] = useState(languageOptions[0]);
  const [coverageDisplay, setCoverageDisplay] = useState(false);
  const [url, setUrl] = useState(urlDefault);

  const enterPress = useKeyPress("Enter");
  const ctrlPress = useKeyPress("Control");

  const [vars, setVars] = useState({});
  const [ids, setIds] = useState([]);
  const { monacoEditor, monaco } = vars;

  async function handleEditorDidMount(monacoEditor, monaco) {
    setVars({ monacoEditor, monaco });
  }

  useEffect(() => {
  if (!monacoEditor || !monaco) {
      return;
  }

  const ids = monacoEditor.deltaDecorations(
      [],
      [
      {
          range: new monaco.Range(2, 1, 4, 1),
          options: { inlineClassName: "line.covered" }
      },
      {
          range: new monaco.Range(10, 1, 11, 1),
          options: { inlineClassName: "line.not.covered" }
      },
      {
        range: new monaco.Range(17, 1, 18, 1),
        options: { inlineClassName: "line.not.covered" }
      }
      ]
  );
  setIds(ids);
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
    switch (action) {
      case "code": {
        setCode(data);
        break;
      }
      default: {
        console.warn("case not handled!", action, data);
      }
    }
  };
  const handleSave = () => {
    setProcessingSave(true);
    setTimeout(function(){setProcessingSave(false);},5000); //to do: implementare funzione save
  };
  const handleSaveAs = () => {
    setProcessingSaveAs(true);
    setTimeout(function(){setProcessingSaveAs(false);},5000); //to do: implementare funzione create
  };
  const handleCompile = () => {
    setProcessing(true);

    //setCoverageDisplay(true);

    var xhttp = new XMLHttpRequest();
    //setUrl("./ClassInfo.java.html");
    xhttp.open("GET",url);
    xhttp.send();

    xhttp.onreadystatechange = function(){
        if (this.readyState==4 && this.status==200){
            setUrl(xhttp.responseURL);
            setCoverageDisplay(true);
        }
        else{
        }
    } 

    setOutputDetails("Output...");

    setProcessing(false);


    /******************************************************************************************************************************** */
    /******************************************************************************************************************************** */
    /******************************************************************************************************************************** */


    /*var markers = [{
      severity: monaco.MarkerSeverity.Warning,
      message: "Some warning",
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: monaco.editor.getModel().getLineLength(1) + 1
    }];
    monaco.editor.setModelMarkers(monaco.editor.getModel(), "owner", markers);
    markers[0].severity = monaco.MarkerSeverity.Error; // No effect */
    
    /*var xhttp = new XMLHttpRequest();
    let url = 'https://jsonplaceholder.typicode.com/posts';
    //let url = "https://www.eclemma.org/jacoco/trunk/coverage/org.jacoco.examples/org.jacoco.examples/ClassInfo.java.html";
    xhttp.open("GET",url);
    xhttp.send();
    xhttp.onreadystatechange = function(){
      if (this.readyState==4 && this.status==200){
        //var automobile = JSON.parse(xhttp.responseText);
        //document.getElementById("dati-file").innerHTML = automobile.marca + ' ' +
        //automobile.modello + ' ' + automobile.colore + ' ' + automobile.alimentazione; 
        document.getElementById("Class-Window").innerHTML = this.response;
      }
      else{
        document.getElementById("Class-Window").innerHTML = "niente";
      }
    
    };*/

    /*************************************** */

     /*   <!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs/editor/editor.main.min.css" />
        <style>
            #editor {
                height: 500px;
            }
        </style>
    </head>
    <body>
        <div id="editor"></div>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs/loader.min.js"></script>
        <script>*/
            //require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs' }});
            //require(['vs/editor/editor.main'], function () {
                // Crea l'istanza di Monaco Editor
                
                //var editor = monaco.editor.getModel(document.getElementById('Class-Window'));
    /**/

    //document.getElementById("Class-Window").innerHTML = editor.getValue();

    // Carica il file XML di copertura Jacoco
    /*var xhttp = new XMLHttpRequest();
    //let url = 'https://jsonplaceholder.typicode.com/posts';
    //let url = "https://www.eclemma.org/jacoco/trunk/coverage/org.jacoco.examples/org.jacoco.examples/ClassInfo.java.html";
    let url = "./sample.xml";
    xhttp.open("GET",url);
    xhttp.send();

    

    xhttp.onreadystatechange = function(){
      if (this.readyState==4 && this.status==200){
        //document.getElementById("Class-Window").innerHTML = 'ok';
        var xml = xhttp.responseXML;
        var coverageData = parseJacocoCoverage(xml);
        var coverageText = JSON.stringify(coverageData, null, 2);
        //editor.setValue(coverageText);
        //editor.setValue("modifica");
      }
      else{
        //document.getElementById("Class-Window").innerHTML = xhttp.status + " " + xhttp.readyState;
      }
    }

    /*var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', 'https://jsonplaceholder.typicode.com/posts');
    xmlhttp.send();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            var xml = xmlhttp.responseXML;
            //var coverageData = parseJacocoCoverage(xml);
            //var coverageText = JSON.stringify(coverageData, null, 2);
            //editor.setValue(coverageText);
        }
        else{
          document.getElementById("Class-Window").innerHTML="niente";
        }
    };*/
              

                /*/ Funzione per analizzare il file XML di copertura Jacoco
                function parseJacocoCoverage(xml, editor) {
                  var coverageData = [];
              
                  // Esempio di iterazione su tutti gli elementi "<class>"
                  var classElements = xml.getElementsByTagName('class');
                  for (var i = 0; i < classElements.length; i++) {
                      var classElement = classElements[i];
                      var className = classElement.getAttribute('name');
              
                      // Esempio di estrazione della copertura delle linee di codice
                      var lineCoverageElement = classElement.getElementsByTagName('line')[0];
                      var lineCoverage = parseFloat(lineCoverageElement.getAttribute('coverage'));
              
                      // Esempio di estrazione delle informazioni delle linee di codice
                      var lines = classElement.getElementsByTagName('line');
                      var lineInfo = {};
                      for (var j = 0; j < lines.length; j++) {
                          var line = lines[j];
                          var lineNumber = parseInt(line.getAttribute('nr'));
                          var lineCovered = line.getAttribute('ci') === '1';
              
                          lineInfo[lineNumber] = lineCovered;
                      }
              
                      // Creazione di un oggetto con le informazioni di copertura
                      var coverageInfo = {
                          className: className,
                          lineCoverage: lineCoverage,
                          lines: lineInfo
                      };
              
                      coverageData.push(coverageInfo);
                  }
              
                  // Applica le informazioni di copertura all'editor Monaco
                  applyCoverageToEditor(coverageData, editor);
                  return coverageData;
              }
              
              function applyCoverageToEditor(coverageData, editor) {
                  var model = editor.getModel();
                  var decorations = [];
              
                  for (var i = 0; i < coverageData.length; i++) {
                      var coverageInfo = coverageData[i];
                      var className = coverageInfo.className;
                      var lines = coverageInfo.lines;
              
                      // Esempio di applicazione delle informazioni di copertura alle linee di codice nell'editor Monaco
                      for (var lineNumber in lines) {
                          if (lines.hasOwnProperty(lineNumber)) {
                              var lineCovered = lines[lineNumber];
              
                              // Calcola l'intervallo della linea di codice nel modello
                              var startColumn = 1;
                              var endColumn = model.getLineMaxColumn(lineNumber);
                              var range = new monaco.Range(lineNumber, startColumn, lineNumber, endColumn);
              
                              // Crea un'opzione decorazione per evidenziare la linea di codice coperta o non coperta
                              var decoration = {
                                  range: range,
                                  options: {
                                      isWholeLine: true,
                                      className: lineCovered ? 'covered-line' : 'uncovered-line'
                                  }
                              };
              
                              decorations.push(decoration);
                          }
                      }
                  }
              
                  // Applica le decorazioni all'editor Monaco
                  editor.deltaDecorations([], decorations);
              }
            //});
                
            //});
    //    </script>
    //</body>
    //</html>

    /******************************************* */


    //setProcessing(false);
    /*const formData = {
      language_id: language.id,
      // encode source code in base64
      source_code: btoa(code),
      stdin: btoa(customInput),
    };
    const options = {
      method: "POST",
      url: process.env.REACT_APP_RAPID_API_URL,
      params: { base64_encoded: "true", fields: "*" },
      headers: {
        "content-type": "application/json",
        "Content-Type": "application/json",
        "X-RapidAPI-Host": process.env.REACT_APP_RAPID_API_HOST,
        "X-RapidAPI-Key": process.env.REACT_APP_RAPID_API_KEY,
      },
      data: formData,
    };

    axios
      .request(options)
      .then(function (response) {
        console.log("res.data", response.data);
        const token = response.data.token;
        checkStatus(token);
      })
      .catch((err) => {
        let error = err.response ? err.response.data : err;
        // get error status
        let status = err.response.status;
        console.log("status", status);
        if (status === 429) {
          console.log("too many requests", status);

          showErrorToast(
            `Quota of 100 requests exceeded for the Day! Please read the blog on freeCodeCamp to learn how to setup your own RAPID API Judge0!`,
            10000
          );
        }
        setProcessing(false);
        console.log("catch block...", error);
      });*/
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
          {processing_saveAs? "Saving as..." : "Save as"}
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
            />
          </div>
          <div id = "prova" className = "overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
          </div>
          <OutputWindow outputDetails={outputDetails} />
          <div className="flex flex-col items-end">
          </div>
          {outputDetails && <OutputDetails outputDetails={outputDetails} />}
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
