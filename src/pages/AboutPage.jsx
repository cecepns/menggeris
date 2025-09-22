import { MapPin, Calendar, Users, Globe } from 'lucide-react';
import Founder from '../assets/founder.jpeg';
import Sertifikat from '../assets/sertifikat.jpg';

const AboutPage = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
  
      <section 
        className="relative h-96 text-white py-16 bg-cover bg-center bg-no-repeat"
        
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-wood-dark"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-center mb-4">
            Our Story
          </h1>
          <p className="text-xl text-gray-200 text-center max-w-3xl mx-auto">
            Assalamualaikum Warahmatullahi Wabarakatuh. Discover the journey of Menggeris, 
            from the rich forests of East Borneo to the world stage.
          </p>
        </div>
      </section>

      {/* Owner Section */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gray-900" data-aos="fade-up">
            Our Founder
          </h2>
          <div className="grid md:grid-cols-2 gap-8" data-aos="fade-up">
            <div className="w-full h-96 overflow-hidden rounded-tl-3xl rounded-br-3xl">
              <img 
                src={Founder}
                alt="Dr. Iendy Zelviean Adhari, M.M., M.E." 
                className="w-full h-full object-cover shadow-lg border-2 border-wood-maroon"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">
                Dr. Iendy Zelviean Adhari, M.M., M.E.
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                The visionary founder of Menggeris, Dr. Iendy Zelviean Adhari brings together 
                academic excellence and entrepreneurial spirit to create Indonesia&apos;s first 
                automatic skeleton wooden watch. With his expertise in engineering and management, 
                he has transformed the rare buttress wood of Kompassia excelsa into world-class 
                timepieces that represent the natural beauty and cultural heritage of East Borneo.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mt-4">
                Under his leadership, Menggeris has successfully exported exclusive wooden watches 
                to international markets, establishing the brand as a symbol of Indonesian craftsmanship 
                and innovation in the global luxury accessories market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Description */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none" data-aos="fade-up">
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Rooted in the rich biodiversity heritage of East Borneo, Menggeris stands as a 
              manifestation of harmony between nature, tradition, and modern design. Our collections 
              are crafted from the rare buttress wood of Kompassia excelsa, a material admired for 
              its natural strength, captivating grain patterns, and graceful maroon tones.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mb-8">
              Each handmade creation is more than just an accessory; it is a symbol of refined 
              simplicity and timeless natural beauty. With great pride, Menggeris presents the 
              world&apos;s first wooden timepiece that unites Level-1 hardwood with the Seiko Automatic 
              Skeleton Movement a masterpiece born in the land of East Borneo.
            </p>
          </div>
        </div>
      </section>

      {/* SVLK Certificate Section */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gray-900" data-aos="fade-up">
            Forest Product Legality Certificate (SVLK)
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="w-full" data-aos="fade-right">
              <img 
                src={Sertifikat} 
                alt="Forest Product Legality Certificate (SVLK) - Menggeris" 
                className="w-full h-auto rounded-lg shadow-lg border-2 border-wood-maroon"
              />
            </div>
            <div data-aos="fade-left">
              <p className="text-lg text-gray-700 leading-relaxed">
                Menggeris is committed to legal and sustainable forestry practices. Our products are
                supported by the SVLK (Forest Product Legality Certificate), ensuring timber materials
                come from lawful, traceable sources and comply with national standards to promote
                responsible trade.
              </p>
              <ul className="mt-6 space-y-3 text-lg text-gray-700">
                <li>• Legally sourced and sustainable timber</li>
                <li>• Supply chain traceability and regulatory compliance</li>
                <li>• Supports export readiness and responsible forest management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-16 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gray-900" data-aos="fade-up">
            Company Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Calendar className="h-12 w-12 text-wood-maroon" />,
                title: "Established",
                description: "January 10, 2024"
              },
              {
                icon: <Users className="h-12 w-12 text-wood-maroon" />,
                title: "Team Size",
                description: "7 Skilled Artisans"
              },
              {
                icon: <Globe className="h-12 w-12 text-wood-maroon" />,
                title: "Export Markets",
                description: "America, Asia, Europe"
              },
              {
                icon: <MapPin className="h-12 w-12 text-wood-maroon" />,
                title: "Location",
                description: "East Borneo, Indonesia"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="text-center p-6 bg-cream-100 rounded-lg shadow-md"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="mb-4 flex justify-center">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-16 bg-cream-100">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 text-gray-900" data-aos="fade-up">
            Company History
          </h2>
          <div className="prose prose-lg max-w-none" data-aos="fade-up">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Menggeris (Watches & Eyewear) is a craft industry specializing in the creation of 
              wooden watches, eyewear, and other accessories made from the buttress wood of 
              Kompassia excelsa (the Menggeris tree). Founded by Dr. Iendy Zelviean Adhari, M.E., M.M, 
              on January 10, 2024, the company was born in Loh Sumber Village, Loa Kulu District, 
              Kutai Kartanegara Regency, Indonesia.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Menggeris proudly stands as the pioneer of the world&apos;s first automatic skeleton wooden 
              watch, combining the precision of Seiko Automatic movement with the refined beauty of 
              tropical hardwood grains. Beyond timepieces, Menggeris also produces wooden eyewear, 
              card holders, Apple Watch straps, and a range of wooden-based accessories, all crafted 
              with handmade artistry.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              As a driver of Indonesia&apos;s craft product downstreaming, Menggeris upholds export 
              standards while delivering high-value and globally competitive creations. To date, 
              around 20 exclusive Menggeris timepieces have reached buyers in America, Asia, and 
              Europe, making the brand a symbol of authentic souvenirs from East Borneo and 
              the new capital city, IKN Nusantara.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div data-aos="fade-right">
              <h2 className="text-3xl font-display font-bold mb-6 text-gray-900">Our Vision</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                To become a symbol of Indonesian pride in the high-quality souvenir industry, 
                introducing the natural and cultural wealth of East Borneo to the global 
                stage through exclusive and sustainable wooden watches and eyewear.
              </p>
            </div>
            <div data-aos="fade-left">
              <h2 className="text-3xl font-display font-bold mb-6 text-gray-900">Our Mission</h2>
              <ul className="space-y-4 text-lg text-gray-700">
                <li>• Produce exclusive, authentic, and meaningful wooden watches and eyewear</li>
                <li>• Enhance local competitiveness through creative works with high added value</li>
                <li>• Preserve the environment through sustainable, SVLK-certified practices</li>
                <li>• Empower local artisans and village communities in an eco-friendly ecosystem</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Closing Message */}
      <section className="py-16 bg-wood-dark text-white">
        <div className="max-w-4xl mx-auto px-4 text-center" data-aos="fade-up">
          <blockquote className="text-xl italic leading-relaxed">
            &ldquo;Menggeris is a story of time, born from the roots of a village, pulsing with the 
            lush forests of East Borneo, and stepping onto the world stage. Every grain of wood 
            carries a prayer for harmony, every tick of the movement resonates as poetry of life. 
            From the humble land of Loa Kulu, we present a creation of high innovation and 
            sustainability, hoped to become a heritage not only to be worn, but also to be 
            remembered—a symbol of love for nature, the beauty of culture, and the homeland of Indonesia.&rdquo;
          </blockquote>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;