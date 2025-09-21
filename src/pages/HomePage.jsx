import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Star,
  Award,
  Leaf,
  Clock,
  MapPin,
  Play,
  Search,
} from "lucide-react";
import { productAPI, settingsAPI } from "../utils/api";
import Banner from "../assets/1.png";
import Pattern from "../assets/pattern.png";
import WonderfullLogo from "../assets/wonderfull.png";
// import Video1 from "../assets/video/Short 1.mp4";
// import Video2 from "../assets/video/Short 4.mp4";
// import Video3 from "../assets/video/Short 5.mp4";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedProducts();
    fetchSettings();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll(1, "", "");
      setFeaturedProducts(response.data.data.slice(0, 4));
    } catch (error) {
      console.error("Error fetching featured products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
  };

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section
        className="text-white py-20 relative"
        style={{
          backgroundImage: `url(${Pattern})`,
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div data-aos="fade-right">
              <h1 className="text-slate-800 text-3xl md:text-4xl font-display font-bold mb-6 leading-tight">
                An Authentic and Exclusive Souvenir from East Borneo, Heart of
                Nusantara -
                <span className="text-wood-dark">
                  {" "}
                  Timelessly Crafted in Indonesia.
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Experience the world&apos;s first wooden automatic skeleton
                watch, handcrafted from the rare Kompassia excelsa wood of East
                Borneo.
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
          <div className="text-center mb-12" data-aos="fade-right">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose Menggeris?
            </h2>
            <p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              data-aos="fade-up"
            >
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
                  "SVLK-certified sustainable production practices protecting East Borneo's biodiversity",
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
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4"
              data-aos="fade-right"
            >
              Featured Collections
            </h2>
            <p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              data-aos="fade-up"
            >
              Explore our handpicked selection of premium wooden timepieces
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-maroon"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg overflow-hidden hover:bg-white hover:shadow-2xl hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer"
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
                    <h3 className="text-md md:text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    <div className="hidden md:block ">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: product.description,
                        }}
                        className="text-gray-600 mb-4 line-clamp-2"
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="hidden md:block text-2xl font-bold text-wood-maroon">
                        ${product.price?.toLocaleString()}
                      </span>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-xs md:text-base text-wood-dark underline rounded-lg hover:bg-wood-DEFAULT transition-all duration-300 ease-in-out hover:scale-105"
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

      {/* Search Product Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div> */}
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 leading-tight text-gray-900">
              Bringing Nature&apos;s Craft
              <br />
              <span className="text-wood-light">to the World</span>
            </h2>
            <p className="text-xl text-slate-800 max-w-2xl mx-auto leading-relaxed">
              Discover our exquisite collection of wooden timepieces crafted
              from the finest East Borneo wood
            </p>
          </div>

          <div
            className="max-w-2xl mx-auto"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <form onSubmit={handleSearch} className="relative">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for wooden watches, collections, or styles..."
                    className="w-full pl-12 pr-4 py-4 border border-[#d4a574] rounded-xl text-slate-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-wood-light focus:border-transparent transition-all duration-300 hover:bg-white/20"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-wood-dark text-white px-8 py-4 rounded-lg font-semibold text-lg flex items-center justify-center group hover:bg-wood-DEFAULT transition-all duration-300 ease-in-out"
                >
                  <Search className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Search
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-wood-light/10 rounded-full blur-2xl animate-pulse"></div>
          <div
            className="absolute bottom-20 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/4 w-16 h-16 bg-wood-light/5 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-wood-dark text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Ready to Own a Piece of East Borneo?
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

      {/* Maps Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12" data-aos="fade-up">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8 text-wood-maroon mr-3" />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
                Find Us
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Visit our location and experience the craftsmanship firsthand
            </p>
          </div>

          {settingsLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-wood-maroon"></div>
            </div>
          ) : settings.maps ? (
            <div className="rounded-lg overflow-hidden" data-aos="fade-up">
              <div
                className="max-w-4xl m-auto w-full h-96 md:h-[500px]"
                dangerouslySetInnerHTML={{ __html: settings.maps }}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                Map location will be available soon
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Proud to be part of Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8">
              Proud to be part of
            </h2>
            <div className="flex justify-center items-center">
              <img
                src={WonderfullLogo}
                alt="Wonderful Indonesia"
                className="h-20 md:h-24 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
