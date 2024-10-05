import logo from "./logo.svg";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

function App() {
  const serverUrlRef = useRef("https://localhost:32770/");

  const [res, setRes] = useState([]);

  const fetch = async () => {
    try {
      const res = await axios.get(`${serverUrlRef.current}values/get-values`);

      console.log(res.data)
      setRes(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetch().then();
  }, [])

  return (
    <div className="App">
      {res.map((x) => (
        <div>{x}</div>
      ))}
    </div>
  );
}

export default App;
