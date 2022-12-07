import "./App.css";
import react, { useState, useEffect } from "react";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { pdfjs } from "react-pdf";

function App() {
  const [show, setShow] = useState(false);
  const [currResume, setCurrResume] = useState("");
  const [resumeList, setResumeList] = useState([]);
  const [fileURL, setFileURL] = useState("");
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [query, setQuery] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:8000/resume/", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: query.toLowerCase() }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data.split(/[$]/i));
        setResumeList([...data.data.split(/[$]/i)]);
      })
      .catch((err) => console.log(err));
  };
  const handleShow = async (filepath) => {
    setShow(false);
    await fetch("http://localhost:8000/showfile/", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `url=${filepath}`,
    })
      .then((res) => res.blob())
      .then((data) => {
        const objURL = URL.createObjectURL(data);
        console.log(objURL);
        setFileURL(objURL);
        setShow(true);
        setCurrResume(filepath);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="App">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter query ..."
          onChange={(e) => {
            setQuery(e.target.value);
          }}
          required
        />
        <input type="submit" />
      </form>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div
          style={{
            border: "1px solid rgba(0, 0, 0, 0.3)",
            height: "600px",
            width: "calc(100vw - 180px)",
          }}
        >
          {show && (
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`}
            >
              <Viewer
                fileUrl={fileURL}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          )}
        </div>
        <div
          style={{
            height: "600px",
            width: "160px",
            overflowY: "auto",
            marginLeft: "10px",
          }}
        >
          <h3>List of Resumes</h3>
          {resumeList.length > 0 ? (
            resumeList.map((ele, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    handleShow(ele);
                  }}
                  style={{
                    cursor: "pointer",
                    paddingTop: "5px",
                    paddingBottom: "5px",
                    background: ele === currResume ? "yellow" : "#fff",
                  }}
                >
                  resume {index + 1}
                </div>
              );
            })
          ) : (
            <p>No resume</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
