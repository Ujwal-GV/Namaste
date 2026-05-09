import React from 'react'
import { useUpdateLanguage } from '../hooks/useLanguage';
import i18n from '../i18n';

export default function LanguageSelector() {
    const { mutate, isPending } = useUpdateLanguage();

    const handleChange = (lang) => {

    i18n.changeLanguage(lang);

    mutate(lang, {
      onSuccess: () => {
        toast.success("Language updated");
      },
    });
  };

  return (
    <div>
      <select
        value={i18n.language}
        disabled={isPending}
        onChange={(e) =>
            handleChange(e.target.value)
        }
        className="border px-3 py-2 rounded-lg bg-white text-sm"
        >
        <option value="en">
            English
        </option>

        <option value="hi">
            हिन्दी
        </option>

        <option value="ta">
            தமிழ்
        </option>

        <option value="ka">
            ಕನ್ನಡ
        </option>

        <option value="te">
            తెలుగు 
        </option>
        </select>
    </div>
  )
}
