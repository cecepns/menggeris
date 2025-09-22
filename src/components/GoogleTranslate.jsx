import { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
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
      const cookies = document.cookie.split('; ').map((c) => c.trim());
      const row = cookies.find((c) => c.startsWith(name + '='));
      return row ? decodeURIComponent(row.split('=').slice(1).join('=')) : undefined;
    };

    const seedFromState = () => {
      const cookie = getCookie('googtrans');
      if (cookie && typeof cookie === 'string') {
        const parts = cookie.split('/').filter(Boolean);
        if (parts.length >= 2) {
          setSelectedLanguage(parts[1]);
          return;
        }
      }
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement && selectElement.value) {
        setSelectedLanguage(selectElement.value);
      }
    };

    // Observe insertion of the select and attach change listener
    const attachListener = () => {
      const selectElement = document.querySelector('.goog-te-combo');
      if (!selectElement) return false;
      const onChange = () => {
        const value = selectElement.value || 'en';
        setSelectedLanguage(value);
      };
      selectElement.addEventListener('change', onChange);
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
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement && selectListenerRef.current) {
        selectElement.removeEventListener('change', selectListenerRef.current);
      }
    };
  }, [isLoaded]);

  const tryDispatchChange = (languageCode, attemptsLeft = 10) => {
    if (!attemptsLeft) return;
    const selectElement = document.querySelector('.goog-te-combo');
    if (selectElement) {
      selectElement.value = languageCode;
      selectElement.dispatchEvent(new Event('change'));
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
    retryTimerRef.current = window.setTimeout(() => tryDispatchChange(languageCode, attemptsLeft - 1), 200);
  };

  const ensureTranslateReady = () => {
    if (ensureInitInFlightRef.current) return ensureInitInFlightRef.current;
    ensureInitInFlightRef.current = new Promise((resolve) => {
      const finishIfReady = () => {
        const select = document.querySelector('.goog-te-combo');
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

  const handleLanguageChange = (languageCode) => {
    // Persist across reloads by setting googtrans cookie
    try {
      document.cookie = `googtrans=/en/${languageCode}; path=/`;
      const hostname = window.location.hostname;
      if (hostname && hostname.includes('.')) {
        document.cookie = `googtrans=/en/${languageCode}; path=/; domain=.${hostname}`;
      } else {
        // For localhost or single-label hosts, set without domain
        document.cookie = `googtrans=/en/${languageCode}; path=/`;
      }
    } catch {
      // ignore cookie write errors
    }
    ensureTranslateReady().then(() => {
      if (window.google && window.google.translate) {
        tryDispatchChange(languageCode);
      }
    });
    setSelectedLanguage(languageCode);
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' }
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
              ? 'text-gray-700 hover:bg-wood-dark hover:text-white'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          aria-disabled={!isLoaded}
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {languages.find(l => l.code === selectedLanguage)?.flag || '🌐'} {languages.find(l => l.code === selectedLanguage)?.name || 'Language'}
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
                      isSelected ? 'bg-wood-dark text-white' : 'text-gray-700 hover:bg-wood-dark hover:text-white'
                    }`}
                    aria-selected={isSelected}
                  >
                    <span className="mr-3 text-lg">{language.flag}</span>
                    <span className="flex-1 text-left">{language.name}</span>
                    {isSelected && (
                      <span className="ml-2">✓</span>
                    )}
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
