import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Auth0Provider
      domain="dev-qc07t4k5n8zq8trx.us.auth0.com"
      clientId="qVVAXeVlzuWtMBLXFPMv9TJMLM7Wg30k"
      authorizationParams={{
        redirect_uri: "http://localhost:5173/"
      }}
      audience = "http://localhost:8000/"
      scope="openid profile email"
    >
      <App />
    </Auth0Provider>
  </React.StrictMode>
);
