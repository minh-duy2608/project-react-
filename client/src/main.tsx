import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import axios from "axios";
import "antd/dist/reset.css";

axios.defaults.baseURL = "http://localhost:8080";

createRoot(document.getElementById("root")!).render(<App />);
