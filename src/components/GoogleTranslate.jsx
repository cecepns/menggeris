import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';

const GoogleTranslate = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if Google Translate is loaded
    const checkGoogleTranslate = () => {
      if (window.google && window.google.translate) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleTranslate, 100);
      }
    };
    
    checkGoogleTranslate();
  }, []);

  const handleLanguageChange = (languageCode) => {
    if (window.google && window.google.translate) {
      const selectElement = document.querySelector('.goog-te-combo');
      if (selectElement) {
        selectElement.value = languageCode;
        selectElement.dispatchEvent(new Event('change'));
      }
    }
    setIsOpen(false);
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' }
  ];

  if (!isLoaded) {
    return (
      <div className="flex items-center">
        <Globe className="h-5 w-5 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Hidden Google Translate Element */}
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      
      {/* Custom Language Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-wood-dark hover:text-white transition-colors"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Language</span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
            <div className="py-1">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-wood-dark hover:text-white transition-colors"
                >
                  <span className="mr-3 text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                </button>
              ))}
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
