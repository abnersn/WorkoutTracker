import { useEffect, useState } from 'react';
import * as translations from '../util/translations';

export default function useTranslation() {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        const navigatorLanguage = window.navigator.language.split('-')[0];
        if (['en', 'pt'].includes(navigatorLanguage)) {
            setLanguage(navigatorLanguage);
        } else {
            setLanguage('en');
        }
    }, []);

    const fallback = translations.en;

    const t = (key) => {
        const translation = translations[language];

        return translation[key] || fallback[key] || key;
    };

    return { t, language };
}