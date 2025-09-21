import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star } from 'lucide-react';
import { productAPI, settingsAPI } from '../utils/api';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [settings, setSettings] = useState({ phone: '' });

  useEffect(() => {
    fetchProduct();
    fetchSettings();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getById(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!settings.phone) {
      alert('Phone number not configured. Please contact administrator.');
      return;
    }

    // Format phone number (remove spaces, dashes, and ensure it starts with country code)
    let phoneNumber = settings.phone.replace(/[\s\-()]/g, '');
    
    // If phone number doesn't start with country code, assume it's Indonesian (+62)
    if (!phoneNumber.startsWith('+')) {
      if (phoneNumber.startsWith('0')) {
        phoneNumber = '+62' + phoneNumber.substring(1);
      } else if (!phoneNumber.startsWith('62')) {
        phoneNumber = '+62' + phoneNumber;
      } else {
        phoneNumber = '+' + phoneNumber;
      }
    }

    // Create WhatsApp message
    const message = `Hi! I'm interested in purchasing "${product.name}" ($${product.price?.toLocaleString()}). Could you please provide more information about this product?`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp URL
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-dark"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <Link to="/products" className="text-wood-dark hover:underline">
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || ['https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=800'];

  return (
    <div className="pt-16 min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link 
            to="/products" 
            className="inline-flex items-center text-wood-dark hover:text-wood-dark transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="aspect-square bg-white rounded-lg overflow-hidden shadow-md mb-4">
              <img 
                src={images[selectedImage]?.startsWith('http') ? images[selectedImage] : `https://api-inventory.isavralabel.com/menggeris/uploads-menggaris/${images[selectedImage]}`}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-wood-maroon' : ''
                    }`}
                  >
                    <img 
                      src={image?.startsWith('http') ? image : `https://api-inventory.isavralabel.com/menggeris/uploads-menggaris/${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-center mb-6">
              <div className="flex items-center mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <span className="text-gray-600">(Based on craftsmanship quality)</span>
            </div>

            <div className="mb-8">
              <span className="text-3xl md:text-4xl font-bold text-wood-dark">
                ${product.price?.toLocaleString()}
              </span>
              <span className="text-gray-600 ml-2">USD</span>
            </div>

            <div className="prose prose-lg max-w-none mb-8">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: product.description || 'No description available.' 
                }}
              />
            </div>

            {/* Features */}
            {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <Truck className="h-8 w-8 text-wood-dark mr-3" />
                <div>
                  <div className="font-semibold">Worldwide Shipping</div>
                  <div className="text-sm text-gray-600">Free shipping on orders over $500</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <Shield className="h-8 w-8 text-wood-dark mr-3" />
                <div>
                  <div className="font-semibold">2 Year Warranty</div>
                  <div className="text-sm text-gray-600">Full warranty coverage</div>
                </div>
              </div>
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <Heart className="h-8 w-8 text-wood-dark mr-3" />
                <div>
                  <div className="font-semibold">Handcrafted</div>
                  <div className="text-sm text-gray-600">Made with love in Indonesia</div>
                </div>
              </div>
            </div> */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleWhatsAppRedirect}
                className="flex-1 bg-wood-dark text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-wood-dark transition-colors"
              >
                Contact to Purchase
              </button>
              <Link 
                to="/contact"
                className="flex-1 border-2 border-wood-dark text-wood-dark py-4 px-8 rounded-lg font-semibold text-lg hover:bg-wood-dark hover:text-white transition-colors text-center"
              >
                Ask Questions
              </Link>
            </div>

            {/* Product Details */}
            {/* <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Product Details</h3>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-semibold">Material:</span>
                    <span className="ml-2">Kompassia excelsa wood</span>
                  </div>
                  <div>
                    <span className="font-semibold">Movement:</span>
                    <span className="ml-2">Seiko Automatic Skeleton</span>
                  </div>
                  <div>
                    <span className="font-semibold">Origin:</span>
                    <span className="ml-2">East Kalimantan, Indonesia</span>
                  </div>
                  <div>
                    <span className="font-semibold">Certification:</span>
                    <span className="ml-2">SVLK Certified</span>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;