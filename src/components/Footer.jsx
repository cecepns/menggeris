import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Instagram } from 'lucide-react';
import { settingsAPI } from '../utils/api';

const Footer = () => {
  const [settings, setSettings] = useState({ phone: '+62 811-1111-1412' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = settings.phone || '+62 811-1111-1412';
    
    // Format phone number (remove spaces, dashes, and ensure it starts with country code)
    let formattedPhone = phoneNumber.replace(/[\s\-()]/g, '');
    
    // If phone number doesn't start with country code, assume it's Indonesian (+62)
    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+62' + formattedPhone.substring(1);
      } else if (!formattedPhone.startsWith('62')) {
        formattedPhone = '+62' + formattedPhone;
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }

    // Create WhatsApp message
    const message = `Hi! I'm interested in learning more about Menggeris products. Could you please provide more information?`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };
  return (
    <footer className="bg-green-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-display font-bold mb-4">Menggeris</h3>
            <p className="text-gray-300 mb-4 text-sm leading-relaxed">
              Rooted in the rich biodiversity heritage of East Kalimantan, Menggeris stands as a 
              manifestation of harmony between nature, tradition, and modern design. Our collections 
              are crafted from the rare buttress wood of Kompassia excelsa.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://instagram.com/menggeris_official" 
                className="text-gray-300 hover:text-white transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-wood-light mt-0.5 flex-shrink-0" />
                <button 
                  onClick={handleWhatsAppRedirect}
                  className="text-gray-300 hover:text-white transition-colors cursor-pointer"
                >
                  {settings.phone || '+62 811-1111-1412'}
                </button>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-wood-light mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <div>menggerisofficial@gmail.com</div>
                  <div>hello@menggeris.com</div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Address</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-wood-light mt-0.5 flex-shrink-0" />
                <div className="text-gray-300">
                  <div className="font-medium">Workshop & Store:</div>
                  <div>Bumi Sempaja City, Block CD No.22</div>
                  <div>Samarinda – East Borneo, Indonesia</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2025 Menggeris. All rights reserved. | Crafted with love from East Kalimantan</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;