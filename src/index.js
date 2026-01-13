import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import AdminApp from "./AdminApp";
import "./index.css";

function Root() {
  const [lang, setLang] = useState("en"); // default English

  return <AdminApp lang={lang} setLang={setLang} />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
