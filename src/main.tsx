import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import App from "./app/App";

import "@mantine/core/styles.css";
import {AuthProvider} from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MantineProvider>
      <BrowserRouter>
          {/* AuthProvider로 감싸야 앱 어디서든 로그인 상태를 쓸 수 있다 */}
          <AuthProvider>
              <App />
          </AuthProvider>
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);