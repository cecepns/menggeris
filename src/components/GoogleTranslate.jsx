import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const selectListenerRef = useRef(null);

  useEffect(() => {
    // Check if Google Translate is loaded and the gadget select exists
    const checkGoogleTranslate = () => {
      const isGoogleReady = Boolean(window.google && window.google.translate);
      if (isGoogleReady) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleTranslate, 100);
      }
    };

    checkGoogleTranslate();
  }, []);

  // Sync selectedLanguage from localStorage or select after load, and listen to changes
  useEffect(() => {
    if (!isLoaded) return;

    const seedFromState = () => {
      try {
        const stored = window.localStorage.getItem("preferredLanguage");
        if (stored) {
          setSelectedLanguage(stored);
          return;
        }
      } catch {
        // no-op: localStorage unavailable
      }
      const selectElement = document.querySelector(".goog-te-combo");
      if (selectElement && selectElement.value) {
        setSelectedLanguage(selectElement.value);
      }
    };

    // Observe insertion of the select and attach change listener
    const attachListener = () => {
      const selectElement = document.querySelector(".goog-te-combo");
      if (!selectElement) return false;
      const onChange = () => {
        const value = selectElement.value || "en";
        setSelectedLanguage(value);
        try {
          window.localStorage.setItem("preferredLanguage", value);
        } catch {
          // no-op: localStorage write failed
        }
      };
      selectElement.addEventListener("change", onChange);
      selectListenerRef.current = onChange;
      return true;
    };

    seedFromState();
    if (!attachListener()) {
      const observer = new MutationObserver(() => {
        if (attachListener()) {
          observer.disconnect();
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }

    return () => {
      const selectElement = document.querySelector(".goog-te-combo");
      if (selectElement && selectListenerRef.current) {
        selectElement.removeEventListener("change", selectListenerRef.current);
      }
    };
  }, [isLoaded]);

  // Removed heavy force/dispatch helpers to prevent loops and lag

  const handleLanguageChange = (languageCode) => {
    // Align Google's cookie for widget behavior and persist preference in localStorage
    try {
      const hostname = window.location.hostname;
      const secureAttrs = window.location.protocol === 'https:' ? '; Secure; SameSite=Lax' : '';
      const cookieVal = `googtrans=/en/${languageCode}; path=/${secureAttrs}`;
      document.cookie = cookieVal;
      if (hostname && hostname.includes(".")) {
        document.cookie = `${cookieVal}; domain=.${hostname}`;
        document.cookie = `${cookieVal}; domain=${hostname}`;
      }
    } catch {
      // no-op
    }
    // Persist across reloads using localStorage
    try {
      window.localStorage.setItem("preferredLanguage", languageCode);
    } catch {
      // no-op: localStorage write failed
    }

    // Update state immediately for UI responsiveness
    setSelectedLanguage(languageCode);
    setIsOpen(false);

    // Reload shortly after so Google Translate applies across the page reliably
    setTimeout(() => {
      try {
        window.location.reload();
      } catch {
        // ignore reload failures
      }
    }, 100);
  };

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "id", name: "Indonesia", flag: "🇮🇩" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  // Always render control so user can click; show subtle disabled state until ready

  return (
    <div className="relative">
      {/* google_translate_element is now mounted in index.html for stable initialization */}

      {/* Custom Language Selector */}
      <div className="relative">
        <button
          onClick={() => isLoaded && setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors ${
            isLoaded
              ? "text-gray-700"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!isLoaded}
        >
          <Globe className="h-4 w-4" />
          <span>
            {languages.find((l) => l.code === selectedLanguage)?.flag || "🌐"}{" "}
            {languages.find((l) => l.code === selectedLanguage)?.name || "Language"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute md:right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
            <div className="py-1">
              {languages.map((language) => {
                const isSelected = language.code === selectedLanguage;
                return (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`flex items-center w-full px-4 py-2 text-sm transition-colors ${
                      isSelected
                        ? "bg-wood-dark text-white"
                        : "text-gray-700 hover:bg-wood-dark hover:text-white"
                    }`}
                    aria-selected={isSelected}
                  >
                    <span className="mr-3 text-lg">{language.flag}</span>
                    <span className="flex-1 text-left">{language.name}</span>
                    {isSelected && <span className="ml-2">✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default GoogleTranslate;
