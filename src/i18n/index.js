import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./languages/en.json";
import ka from "./languages/kn.json";
import hi from "./languages/hi.json";
import ta from "./languages/ta.json";
import te from "./languages/te.json";

i18n
.use(initReactI18next)
.init({
    resources: {
        en: {
            translation: en,
        },
        ka: {
            translation: ka,
        },
        hi: {
            translation: hi,
        },
        ta: {
            translation: ta,
        },
        te: {
            translation: te,
        },
    },

    fallbackLng: "en",

    interpolatation: {
        escapeValue: false,
    },
});

export default i18n;