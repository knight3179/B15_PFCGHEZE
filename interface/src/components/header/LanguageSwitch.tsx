import React from "react";
import { useTranslation } from "react-i18next";

const LanguageSwitch: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "fr" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang); // Save chosen language
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleLanguage}
        className="relative inline-flex items-center h-6 w-12 rounded-full bg-gray-300 dark:bg-gray-600 transition-colors duration-300"
        aria-label="Toggle language"
      >
        <span
          className={`inline-block w-5 h-5 transform bg-white rounded-full shadow-md transition-transform duration-300 ${
            i18n.language === "fr" ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-sm text-gray-700 dark:text-gray-200 uppercase">
        {i18n.language === "fr" ? "FR" : "EN"}
      </span>
    </div>
  );
};

export default LanguageSwitch;
