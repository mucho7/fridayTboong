import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

const rootElement = document.getElementById("root");
if (rootElement !== null) {
  // console.log(firebaseApp);
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}
