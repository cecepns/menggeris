import { useCallback, useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const pendingLanguageRef = useRef(null);
  const isTranslatingRef = useRef(false);
  const waitTimerRef = useRef(null);

  const normalizeLang = useCallback((code) => {
    if (!code) return "en";
    const lower = String(code).toLowerCase();
    // Handle legacy Indonesian code 'in' → 'id'
    if (lower === "in") return "id";
    return lower;
  }, []);

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

  const getLanguageFromCookie = useCallback(() => {
    const match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
    const raw = match?.[1] || "en"; // fallback ke "en"
    return normalizeLang(raw);
  }, [normalizeLang]);

  const waitForCookieToMatch = useCallback((targetCode, { timeoutMs = 6000, intervalMs = 150 } = {}) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const check = () => {
        const current = getLanguageFromCookie();
        if (current === normalizeLang(targetCode)) {
          resolve(true);
          return;
        }
        if (Date.now() - start >= timeoutMs) {
          resolve(false);
          return;
        }
        waitTimerRef.current = window.setTimeout(check, intervalMs);
      };
      check();
    });
  }, [getLanguageFromCookie, normalizeLang]);

  useEffect(() => {
    const langCode = getLanguageFromCookie();
    setSelectedLanguage(langCode);
  }, [getLanguageFromCookie]);

  // Keep selectedLanguage in sync when Google updates the hidden select
  useEffect(() => {
    if (!isLoaded) return;
    const selectElement = document.querySelector(".goog-te-combo");
    if (!selectElement) return;
    const onChange = () => {
      const value = selectElement.value || getLanguageFromCookie() || "en";
      setSelectedLanguage(value);
    };
    selectElement.addEventListener("change", onChange);
    return () => {
      selectElement.removeEventListener("change", onChange);
    };
  }, [isLoaded, getLanguageFromCookie]);

  // // Sync selectedLanguage from localStorage or select after load, and listen to changes
  // useEffect(() => {
  //   if (!isLoaded) return;

  //   const seedFromState = () => {
  //     try {
  //       const stored = window.localStorage.getItem("preferredLanguage");
  //       if (stored) {
  //         setSelectedLanguage(stored);
  //         return;
  //       }
  //     } catch {
  //       // no-op: localStorage unavailable
  //     }
  //     const selectElement = document.querySelector(".goog-te-combo");
  //     if (selectElement && selectElement.value) {
  //       setSelectedLanguage(selectElement.value);
  //     }
  //   };

  //   // Observe insertion of the select and attach change listener
  //   const attachListener = () => {
  //     const selectElement = document.querySelector(".goog-te-combo");
  //     if (!selectElement) return false;
  //     const onChange = () => {
  //       const value = selectElement.value || "en";
  //       setSelectedLanguage(value);
  //       try {
  //         window.localStorage.setItem("preferredLanguage", value);
  //       } catch {
  //         // no-op: localStorage write failed
  //       }
  //     };
  //     selectElement.addEventListener("change", onChange);
  //     selectListenerRef.current = onChange;
  //     return true;
  //   };

  //   seedFromState();
  //   if (!attachListener()) {
  //     const observer = new MutationObserver(() => {
  //       if (attachListener()) {
  //         observer.disconnect();
  //       }
  //     });
  //     observer.observe(document.body, { childList: true, subtree: true });
  //     return () => observer.disconnect();
  //   }

  //   return () => {
  //     const selectElement = document.querySelector(".goog-te-combo");
  //     if (selectElement && selectListenerRef.current) {
  //       selectElement.removeEventListener("change", selectListenerRef.current);
  //     }
  //   };
  // }, [isLoaded]);

  // Removed heavy force/dispatch helpers to prevent loops and lag

  const handleLanguageChange = useCallback(async (languageCode) => {
    const targetCode = normalizeLang(languageCode);
    const select = document.querySelector(".goog-te-combo");
    if (!select) {
      // Defer until select appears
      pendingLanguageRef.current = targetCode;
      return;
    }

    // If a translation is already in progress, queue the latest request
    if (isTranslatingRef.current) {
      pendingLanguageRef.current = targetCode;
      return;
    }

    isTranslatingRef.current = true;
    setIsTranslating(true);
    setIsOpen(false);

    // Attempt translating with small retries if cookie doesn't settle
    let success = false;
    const maxAttempts = 2;
    for (let attempt = 0; attempt < maxAttempts && !success; attempt += 1) {
      // If another request arrived during attempts, break to let queue run later
      if (pendingLanguageRef.current && pendingLanguageRef.current !== targetCode) {
        break;
      }
      // Trigger Google Translate
      select.value = targetCode;
      select.dispatchEvent(new Event("change"));
      // Optimistic UI
      setSelectedLanguage(targetCode);
      success = await waitForCookieToMatch(targetCode);
      if (!success) {
        await new Promise((r) => setTimeout(r, 300));
      }
    }

    try {
      if (!success) {
        // Final wait one more time in case it settled late
        await waitForCookieToMatch(targetCode);
      }
      // Sync UI to final cookie value to avoid drift
      const finalCode = getLanguageFromCookie();
      if (finalCode) {
        setSelectedLanguage(finalCode);
      }
    } finally {
      // Clear any pending poll timer
      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current);
        waitTimerRef.current = null;
      }
      // Mark as idle
      isTranslatingRef.current = false;
      setIsTranslating(false);

      // If another language was requested meanwhile, process it now
      if (pendingLanguageRef.current && pendingLanguageRef.current !== targetCode) {
        const next = pendingLanguageRef.current;
        pendingLanguageRef.current = null;
        // Call recursively but without creating overlapping flows
        handleLanguageChange(next);
      } else {
        pendingLanguageRef.current = null;
      }
    }
  }, [waitForCookieToMatch, getLanguageFromCookie, normalizeLang]);

  // If the select isn't present initially, observe DOM until it appears then flush pending
  useEffect(() => {
    if (!isLoaded) return;
    const tryFlush = () => {
      const select = document.querySelector(".goog-te-combo");
      if (select && pendingLanguageRef.current && !isTranslatingRef.current) {
        const next = pendingLanguageRef.current;
        pendingLanguageRef.current = null;
        handleLanguageChange(next);
        return true;
      }
      return false;
    };
    if (tryFlush()) return;
    const observer = new MutationObserver(() => {
      if (tryFlush()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [isLoaded, handleLanguageChange]);

  // Clear any pending timers on unmount
  useEffect(() => {
    return () => {
      if (waitTimerRef.current) {
        clearTimeout(waitTimerRef.current);
      }
    };
  }, []);

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "id", name: "Indonesia", flag: "🇮🇩" },
    { code: "ja", name: "日本語", flag: "🇯🇵" },
    { code: "ar", name: "العربية", flag: "🇸🇦" },
  ];

  // Always render control so user can click; show subtle disabled state until ready

  return (
    <div className="relative notranslate" translate="no">
      {/* google_translate_element is now mounted in index.html for stable initialization */}

      {/* Custom Language Selector */}
      <div className="relative notranslate" translate="no">
        <button
          onClick={() => isLoaded && !isTranslating && setIsOpen(!isOpen)}
          className={`flex items-center space-x-2 md:px-3 md:py-2 rounded-md text-sm font-medium transition-colors ${
            isLoaded && !isTranslating ? "text-gray-700" : "text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!isLoaded || isTranslating}
        >
          <Globe className="h-4 w-4" />
          <span className="notranslate" translate="no">
            {languages.find((l) => l.code === selectedLanguage)?.flag || "🌐"}{" "}
            {languages.find((l) => l.code === selectedLanguage)?.name ||
              "Language"}
          </span>
        </button>

        {isOpen && (
          <div
            className="absolute md:right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200 notranslate"
            translate="no"
          >
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
                    disabled={isTranslating}
                  >
                    <span className="mr-3 text-lg notranslate" translate="no">
                      {language.flag}
                    </span>
                    <span
                      className="flex-1 text-left notranslate"
                      translate="no"
                    >
                      {language.name}
                    </span>
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
      {/* Optional minimal loading indicator */}
      {isTranslating && (
        <div className="absolute right-0 mt-1 text-xs text-gray-500 select-none">
          Translating...
        </div>
      )}
    </div>
  );
};

export default GoogleTranslate;
