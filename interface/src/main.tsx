//import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { I18nextProvider } from "react-i18next";
import i18n from "../../interface/src/language/i18n.ts"
import { NotificationProvider } from "./components/header/NotificationContext.tsx";
createRoot(document.getElementById("root")!).render(
  //<StrictMode>
    <ThemeProvider>
      <AppWrapper>
      <I18nextProvider i18n={i18n}>
        <NotificationProvider>
        <App />
        </NotificationProvider>
    
  </I18nextProvider>,
      </AppWrapper>
    </ThemeProvider>
  //</StrictMode>,
);
