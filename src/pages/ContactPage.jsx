import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Instagram, Clock, Send } from 'lucide-react';
import { settingsAPI } from '../utils/api';

const ContactPage = () => {
  const [settings, setSettings] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Redirect to WhatsApp with form data
    const phoneNumber = settings.phone || '+62 811-1111-1412';
    const formattedPhone = formatPhoneNumber(phoneNumber);

    // Create WhatsApp message with form data
    const message = `Hi! I'm ${formData.name} (${formData.email}).

Subject: ${formData.subject}

Message: ${formData.message}

I'm interested in learning more about Menggeris products. Could you please provide more information?`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset form and loading state
    setFormData({ name: '', email: '', subject: '', message: '' });
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatPhoneNumber = (phoneNumber) => {
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
    
    return formattedPhone;
  };

  const handleWhatsAppRedirect = () => {
    const phoneNumber = settings.phone || '+62 811-1111-1412';
    const formattedPhone = formatPhoneNumber(phoneNumber);

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
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Header */}
      <section 
        className="relative h-96 text-white py-16 bg-cover bg-center bg-no-repeat"
        
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-wood-dark"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-3xl mx-auto">
            Get in touch with us. We&apos;d love to hear from you and help you find 
            the perfect wooden timepiece.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-cream-100 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
              
              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-wood-maroon mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Phone</h3>
                    <button 
                      onClick={handleWhatsAppRedirect}
                      className="text-wood-maroon hover:text-wood-dark transition-colors cursor-pointer"
                    >
                      {settings.phone || '+62 811-1111-1412'}
                    </button>
                    <p className="text-xs text-gray-500 mt-1">Click to chat on WhatsApp</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-wood-maroon mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">
                      {settings.email || 'menggerisofficial@gmail.com'}
                    </p>
                    <p className="text-gray-600">hello@menggeris.com</p>
                  </div>
                </div>

                {/* Office Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-wood-maroon mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Workshop and store</h3>
                    <p className="text-gray-600">
                      {settings.address || 'Bumi Sempaja City, Block CD No.22, Samarinda – East Borneo, Indonesia'}
                    </p>
                  </div>
                </div>

                {/* Warehouse Address */}
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-wood-maroon mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Warehouse Address</h3>
                    <p className="text-gray-600">
                      {settings.warehouse_address || 'Jl.M.T Haryono No.50, RT.01, Desa Loh Sumber, Kec. Loa Kulu, Kutai Kartanegara75571'}
                    </p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-wood-maroon mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start space-x-4">
                  <Instagram className="h-6 w-6 text-wood-maroon mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Follow Us</h3>
                    <a 
                      href="https://instagram.com/menggeris_official"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-wood-maroon hover:text-wood-dark transition-colors"
                    >
                      @menggeris_official
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-cream-100 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wood-maroon focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-wood-dark text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-wood-DEFAULT transition-colors flex items-center justify-center disabled:opacity-50"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Send via WhatsApp
                    </>
                  )}
                </button>
                
                <p className="text-sm text-gray-500 text-center mt-3">
                  Your message will be sent via WhatsApp to our customer service team.
                </p>
              </form>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {settings.maps && (
          <div className="mt-12">
            <div className="bg-cream-100 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Us</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <div 
                  dangerouslySetInnerHTML={{ __html: settings.maps }}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactPage;