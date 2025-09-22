import { useEffect, useRef, useState } from "react";
import { Globe } from "lucide-react";

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const retryTimerRef = useRef(null);
  const selectListenerRef = useRef(null);
  const ensureInitInFlightRef = useRef(null);

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

  // Sync selectedLanguage from cookie or select after load, and listen to changes
  useEffect(() => {
    if (!isLoaded) return;

    const getCookie = (name) => {
      const cookies = document.cookie.split("; ").map((c) => c.trim());
      const row = cookies.find((c) => c.startsWith(name + "="));
      return row
        ? decodeURIComponent(row.split("=").slice(1).join("="))
        : undefined;
    };

    const seedFromState = () => {
      const cookie = getCookie("googtrans");
      if (cookie && typeof cookie === "string") {
        const parts = cookie.split("/").filter(Boolean);
        if (parts.length >= 2) {
          setSelectedLanguage(parts[1]);
          return;
        }
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

  const tryDispatchChange = (languageCode, attemptsLeft = 10) => {
    if (!attemptsLeft) return;
    const selectElement = document.querySelector(".goog-te-combo");
    if (selectElement) {
      selectElement.value = languageCode;

      // Trigger the actual translation by dispatching a proper change event
      const changeEvent = new Event("change", { bubbles: true });
      selectElement.dispatchEvent(changeEvent);

      // Also trigger a custom event that Google Translate listens for
      const customEvent = new CustomEvent("google-translate-change", {
        detail: { value: languageCode },
      });
      selectElement.dispatchEvent(customEvent);

      // If it already reflects the desired value, stop retrying
      if (selectElement.value === languageCode) {
        if (retryTimerRef.current) {
          window.clearTimeout(retryTimerRef.current);
          retryTimerRef.current = null;
        }
        return;
      }
    } else {
      // If select not ready yet, just retry shortly without re-initializing
    }
    // Try again after a short delay to ensure Google applies translation
    retryTimerRef.current = window.setTimeout(
      () => tryDispatchChange(languageCode, attemptsLeft - 1),
      200
    );
  };

  const ensureTranslateReady = () => {
    if (ensureInitInFlightRef.current) return ensureInitInFlightRef.current;
    ensureInitInFlightRef.current = new Promise((resolve) => {
      const finishIfReady = () => {
        const select = document.querySelector(".goog-te-combo");
        if (window.google && window.google.translate && select) {
          resolve();
          return true;
        }
        return false;
      };
      if (finishIfReady()) return;
      // Do not reinitialize here; index.html already initialized it
      // Wait until select appears
      const start = Date.now();
      const tick = () => {
        if (finishIfReady()) return;
        if (Date.now() - start > 4000) {
          // give up after 4s but resolve to not block UI
          resolve();
          return;
        }
        setTimeout(tick, 150);
      };
      tick();
    }).finally(() => {
      ensureInitInFlightRef.current = null;
    });
    return ensureInitInFlightRef.current;
  };

  const forceTranslation = (languageCode) => {
    // Force Google Translate to apply translation immediately
    if (
      window.google &&
      window.google.translate &&
      window.google.translate.TranslateElement
    ) {
      try {
        // Get the translate element instance
        const translateElement = document.querySelector(
          "#google_translate_element"
        );
        if (
          translateElement &&
          translateElement.querySelector(".goog-te-combo")
        ) {
          const selectElement =
            translateElement.querySelector(".goog-te-combo");

          // Set the value and trigger translation
          selectElement.value = languageCode;

          // Create and dispatch the proper change event
          const event = new Event("change", {
            bubbles: true,
            cancelable: true,
          });
          selectElement.dispatchEvent(event);

          // Try multiple approaches to force translation
          // Method 1: Direct API call if available
          if (
            window.google.translate.TranslateElement.prototype.translatePage
          ) {
            try {
              window.google.translate.TranslateElement.prototype.translatePage(
                languageCode
              );
            } catch {
              // Fallback to other methods
            }
          }

          // Method 2: Trigger Google's internal translation mechanism
          setTimeout(() => {
            // Remove notranslate class and add translation classes
            document.body.classList.remove("notranslate");
            document.body.classList.add("translated-ltr");

            // Force re-evaluation of translatable elements
            const translatableElements = document.querySelectorAll(
              "p, h1, h2, h3, h4, h5, h6, span, div, a, button, li, td, th"
            );
            translatableElements.forEach((el) => {
              if (!el.classList.contains("notranslate")) {
                el.setAttribute("data-original-text", el.textContent || "");
              }
            });
          }, 100);

          // Method 3: Trigger window event that Google Translate listens to
          setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("google-translate-change", {
                detail: { language: languageCode },
              })
            );
          }, 200);
        }
      } catch (error) {
        console.warn("Error forcing translation:", error);
      }
    }
  };

  const handleLanguageChange = (languageCode) => {
    // Persist across reloads by setting googtrans cookie
    try {
      document.cookie = `googtrans=/en/${languageCode}; path=/`;
      const hostname = window.location.hostname;
      if (hostname && hostname.includes(".")) {
        document.cookie = `googtrans=/en/${languageCode}; path=/; domain=.${hostname}`;
      } else {
        // For localhost or single-label hosts, set without domain
        document.cookie = `googtrans=/en/${languageCode}; path=/`;
      }
      // Do not reload the page; trigger translation immediately via the widget APIs
    } catch {
      // ignore cookie write errors
    }

    // Update state immediately for UI responsiveness
    setSelectedLanguage(languageCode);
    setIsOpen(false);

    // Use the global function to change language immediately
    ensureTranslateReady().then(() => {
      if (window.google && window.google.translate) {
        // Try the global function first (most reliable)
        if (typeof window.changeGoogleLanguage === "function") {
          window.changeGoogleLanguage(languageCode);
        } else {
          // Fallback to the old method
          tryDispatchChange(languageCode);
          setTimeout(() => forceTranslation(languageCode), 100);
        }
      }
    });
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
          className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isLoaded
              ? "text-gray-700 hover:bg-wood-dark hover:text-white"
              : "text-gray-400 cursor-not-allowed"
          }`}
          aria-disabled={!isLoaded}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find((l) => l.code === selectedLanguage)?.flag || "🌐"}{" "}
            {languages.find((l) => l.code === selectedLanguage)?.name ||
              "Language"}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
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
