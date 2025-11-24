import { Globe } from "lucide-react";

interface LanguageToggleProps {
  language: "id" | "en";
  onLanguageChange: (lang: "id" | "en") => void;
}

export function LanguageToggle({ language, onLanguageChange }: LanguageToggleProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
      <Globe className="w-4 h-4 text-gray-600 ml-2" />
      <button
        onClick={() => onLanguageChange("id")}
        className={`px-3 py-1 rounded-full transition-all ${
          language === "id"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        ID
      </button>
      <button
        onClick={() => onLanguageChange("en")}
        className={`px-3 py-1 rounded-full transition-all ${
          language === "en"
            ? "bg-white text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        EN
      </button>
    </div>
  );
}



