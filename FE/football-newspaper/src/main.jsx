import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'antd/dist/reset.css'; 
import  './scss/vendors/simplebar.scss';
import './scss/style.scss';
import './scss/examples.scss';
import '@coreui/coreui/dist/css/coreui.min.css';
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import store from "./redux/store.js";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HelmetProvider>
      <UserProvider>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <App />
          </Provider>
        </QueryClientProvider>
      </UserProvider>
    </HelmetProvider>
  </StrictMode>
);
