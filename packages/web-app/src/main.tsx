import ReactDOM from "react-dom/client";
import App from "./App";

import "./index.css";


const rootDOM = document.getElementById("root");
if (!rootDOM) {
    throw new Error("Root DOM not found");
}

const root = ReactDOM.createRoot(rootDOM);

root.render(
    <App />
);
