import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { settingsAPI } from '../utils/api';

const WhatsAppButton = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhoneNumber();
  }, []);

  const fetchPhoneNumber = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data && response.data.phone) {
        // Clean phone number - remove spaces, dashes, and ensure it starts with country code
        let cleanPhone = response.data.phone.replace(/[\s\-\(\)]/g, '');
        
        // If phone doesn't start with country code, assume it's Indonesian (+62)
        if (!cleanPhone.startsWith('+')) {
          if (cleanPhone.startsWith('0')) {
            // Remove leading 0 and add +62
            cleanPhone = '+62' + cleanPhone.substring(1);
          } else if (cleanPhone.startsWith('62')) {
            // Add + if missing
            cleanPhone = '+' + cleanPhone;
          } else {
            // Assume it's Indonesian number without country code
            cleanPhone = '+62' + cleanPhone;
          }
        }
        
        setPhoneNumber(cleanPhone);
      }
    } catch (error) {
      console.error('Error fetching phone number:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppClick = () => {
    if (phoneNumber) {
      // Create WhatsApp URL with default message
      const message = encodeURIComponent('Halo, saya tertarik dengan produk Anda. Bisa tolong berikan informasi lebih lanjut?');
      const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  // Don't render if no phone number or still loading
  if (loading || !phoneNumber) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleWhatsAppClick}
        className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl group"
        title="Chat via WhatsApp"
        aria-label="Chat via WhatsApp"
      >
        <MessageCircle className="h-6 w-6" />
        
        {/* Tooltip */}
        <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
          Chat via WhatsApp
          <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
        </div>
      </button>
    </div>
  );
};

export default WhatsAppButton;
