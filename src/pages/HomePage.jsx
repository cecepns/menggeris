import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Award, Leaf, Clock } from "lucide-react";
import { productAPI } from "../utils/api";
import Banner from '../assets/1.png';
import Pattern from '../assets/pattern.png';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll(1, "", "");
      setFeaturedProducts(response.data.data.slice(0, 3));
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section 
        className="text-white py-20 relative"
        style={{
          backgroundImage: `url(${Pattern})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'auto',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h1 className="text-slate-800 text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 leading-tight">
                Timepieces Crafted from
                <span className="text-wood-dark"> Nature&apos;s Finest</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Experience the world&apos;s first wooden automatic skeleton watch,
                handcrafted from the rare Kompassia excelsa wood of East
                Kalimantan.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-wood-dark text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center group hover:bg-wood-DEFAULT transition-all duration-300 ease-in-out"
                >
                  Explore Collections
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
            <div data-aos="fade-left" className="relative">
              <div className="relative z-10 h-96 md:h-[500px] w-full overlfow-hidden">
                <img
                  src={Banner}
                  alt="Menggeris Wooden Watch"
                  className="rounded-lg shadow-2xl w-full h-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-wood-light/20 to-transparent rounded-lg transform rotate-6"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Menggeris?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover what makes our wooden timepieces unique and exceptional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="h-12 w-12 text-wood-maroon" />,
                title: "World's First",
                description:
                  "The first wooden automatic skeleton watch combining Seiko movement with rare Kompassia excelsa wood",
              },
              {
                icon: <Leaf className="h-12 w-12 text-wood-maroon" />,
                title: "Sustainable",
                description:
                  "SVLK-certified sustainable production practices protecting East Kalimantan's biodiversity",
              },
              {
                icon: <Star className="h-12 w-12 text-wood-maroon" />,
                title: "Handcrafted",
                description:
                  "Each piece is meticulously handmade by skilled artisans with attention to every detail",
              },
              {
                icon: <Clock className="h-12 w-12 text-wood-maroon" />,
                title: "Premium Quality",
                description:
                  "Seiko Automatic Skeleton Movement ensures precision and reliability for years to come",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-lg bg-white hover:bg-cream-50 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <div
                  dangerouslySetInnerHTML={{ __html: feature.description }}
                  className="text-gray-600"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our handpicked selection of premium wooden timepieces
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-maroon"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-cream-100 rounded-lg shadow-md overflow-hidden hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        product.images?.[0]
                          ? `https://api-inventory.isavralabel.com/menggeris/uploads-menggaris/${product.images[0]}`
                          : "https://images.pexels.com/photos/1697214/pexels-photo-1697214.jpeg?auto=compress&cs=tinysrgb&w=400"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: product.description }}
                      className="text-gray-600 mb-4 line-clamp-2"
                    />
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-wood-maroon">
                        ${product.price?.toLocaleString()}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="bg-wood-dark text-white px-4 py-2 rounded-lg hover:bg-wood-DEFAULT transition-all duration-300 ease-in-out hover:scale-105"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12" data-aos="fade-up">
            <Link
              to="/products"
              className="inline-flex items-center bg-wood-dark text-white px-8 py-3 rounded-lg font-semibold hover:bg-wood-DEFAULT transition-all duration-300 ease-in-out hover:scale-105 group"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-wood-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Own a Piece of East Kalimantan?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Join collectors worldwide who appreciate the finest in wooden
            craftsmanship. Each Menggeris timepiece tells a story of tradition,
            sustainability, and precision.
          </p>
          <Link
            to="/contact"
            className="bg-wood-light text-wood-dark px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white transition-all duration-300 ease-in-out hover:scale-105 inline-flex items-center group"
          >
            Get In Touch
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
