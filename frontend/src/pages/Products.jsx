import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productsAPI, eventAPI, getImageUrl } from '../services/api';
import { Search, SlidersHorizontal, Zap, Shield, HelpCircle, HardDrive, RefreshCw, Play } from 'lucide-react';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCapacity, setSelectedCapacity] = useState('all');
  const [selectedProductDetails, setSelectedProductDetails] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShowroomData = async () => {
      const hardcodedProducts = [
        {
          id: '1',
          name: 'Resources Free Generator',
          kw_capacity: 6,
          badge_text: '6KW - 40KW',
          price: '6000',
          image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
          benefits: [
            'A system which doesn\'t consumes or either needs any other Resources like *solar *water *petroleum *battery *KEB power supply To generate the electricity power.',
            'It runs on its own source which generates electricity also the maintenance is affordable compared to any other generators which are dependent on Resources mentioned above.',
            'Its availability is from 6kw to 100kw output power generation also 90% of load guaranteed on the requirement of output energy.',
            'Applications for: Agriculture',
            'RS . 6000per KW'
          ],
          specifications: {
            availability: '6kw to 100kw output power generation',
            load_guarantee: '90%',
            applications: 'Agriculture',
            type: 'Resource-Free Generator'
          }
        },
        {
          id: '2',
          name: 'Energy Booster System',
          kw_capacity: 40,
          badge_text: '40KW - 1MVA',
          price: '6000',
          image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop', // Vite serves public directory from root '/'
          benefits: [
            'A system which consumes a input power of 10kw from the LT through the output power it distributes about 40kw load.',
            'By consumption of 10kw power it provides about 40kw load the ratio of 1:4 times of power output which the system is known as ENERGY BOOSTER.',
            'Its availability from 40kw to 1000kw output power supply also 90% load guaranteed on the requirement of output power.',
            'Applications for: Commercial industries, Agricultural',
            'RS . 6000per KW'
          ],
          specifications: {
            availability: '40KW to 1000KW output power supply',
            input: '10 KW from LT',
            output: '40 KW Load',
            ratio: '1:4',
            load_guarantee: '90%',
            applications: 'Commercial industries, Agricultural'
          }
        }
      ];

      try {
        const prodRes = await productsAPI.getAll();

        // Use products from database, fallback to hardcoded if none available
        if (prodRes.data && prodRes.data.length > 0) {
          setProducts(prodRes.data);
        } else {
          setProducts(hardcodedProducts);
        }

        const eventRes = await eventAPI.getActive();
        setEvent(eventRes.data);
      } catch (error) {
        console.error('Failed to load showroom data:', error);
        // If API fails, at least show the hardcoded products
        setProducts(hardcodedProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchShowroomData();
  }, []);

  const handleReserve = (productId) => {
    navigate('/booking', { state: { product: productId } });
  };

  // Filter products based on search term and selected capacity
  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCapacity =
      selectedCapacity === 'all' ||
      (selectedCapacity === '6' && prod.kw_capacity <= 6) ||
      (selectedCapacity === '40' && prod.kw_capacity >= 40);

    return matchesSearch && matchesCapacity;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-[#3b82f6] border-r-transparent border-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-white pt-28 pb-20 overflow-hidden">

      {/* Decorative background graphics */}
      <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>
      <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full bg-blue-500/5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-96 h-96 rounded-full bg-purple-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- Header Section --- */}
        <div className="text-center mb-12">
          <h1 className="font-orbitron font-extrabold text-3xl sm:text-5xl text-black mb-4 tracking-wider">
            PRODUCTS
          </h1>
          <p className="text-black text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Browse our K V V Sai electricals Series of commercial-grade zero-point magnetic electricity generators. Secure early priority bookings.
          </p>
        </div>

        {/* --- Search & Filtering Controllers --- */}
        <div className="glass-panel border border-slate-800/80 rounded-xl p-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <input
              type="text"
              placeholder="Search generator models..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-800 rounded-lg text-sm text-black placeholder-slate-500 focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-colors"
            />
          </div>

          {/* Capacity Filters */}
          <div className="flex items-center space-x-2 w-full md:w-auto overflow-x-auto py-1 scroll-none">
            <SlidersHorizontal className="w-4 h-4 text-black shrink-0" />
            <button
              onClick={() => setSelectedCapacity('all')}
              className={`px-4 py-1.5 rounded-full text-xs font-orbitron font-semibold shrink-0 transition-colors ${selectedCapacity === 'all' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'border border-slate-800 text-black hover:text-black'}`}
            >
              ALL CAPACITIES
            </button>
            <button
              onClick={() => setSelectedCapacity('6')}
              className={`px-4 py-1.5 rounded-full text-xs font-orbitron font-semibold shrink-0 transition-colors ${selectedCapacity === '6' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'border border-slate-800 text-black hover:text-black'}`}
            >
              6KW MODEL
            </button>
            <button
              onClick={() => setSelectedCapacity('40')}
              className={`px-4 py-1.5 rounded-full text-xs font-orbitron font-semibold shrink-0 transition-colors ${selectedCapacity === '40' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'border border-slate-800 text-black hover:text-black'}`}
            >
              40KW+ MODEL
            </button>
          </div>
        </div>

        {/* --- Product Grid Catalog --- */}
        <div className="flex flex-wrap justify-center gap-8">
          {filteredProducts.map((prod) => (
            <motion.div
              key={prod.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="glass-panel border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col w-full max-w-[380px]"
            >
              {/* Product Badge */}
              <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded bg-white/85 border border-blue-500/40 font-orbitron text-[10px] font-bold tracking-widest text-blue-600 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-blue-500 fill-blue-500 animate-pulse" />
                <span>{prod.badge_text || (prod.availability_status ? prod.availability_status.toUpperCase() : `${prod.kw_capacity}KW`)}</span>
              </div>

              {/* Product Photo */}
              <div className="relative bg-slate-100 overflow-hidden border-b border-slate-800/80">
                <img
                  src={getImageUrl(prod.image_url)}
                  alt={prod.name}
                  className="w-full h-auto object-contain filter brightness-90 hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/90 via-transparent to-transparent pointer-events-none"></div>
              </div>

              {/* Product details */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="font-orbitron font-bold text-lg text-black tracking-wide mb-2">{prod.name}</h3>
                  <div className="flex items-baseline flex-wrap gap-x-2 gap-y-1 mb-4">
                    <span className="text-xl font-orbitron font-extrabold text-green-600 whitespace-nowrap">Rs. {parseFloat(prod.price).toLocaleString()} Per KW</span>
                    <span className="text-[10px] text-slate-500 font-medium">LAUNCH PREORDER BOOKING FEE</span>
                  </div>

                  {/* Highlights benefits */}
                  <ul className="space-y-2 mb-6 text-xs text-black">
                    {(Array.isArray(prod.benefits) ? prod.benefits : []).slice(0, 3).map((benefit, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800/50">
                  <button
                    onClick={() => setSelectedProductDetails(prod)}
                    className="w-full py-2 bg-slate-100 border border-slate-800 rounded font-orbitron text-xs text-black hover:text-black hover:bg-slate-300 transition-all flex items-center justify-center space-x-1"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>TECHNICAL SPECIFICATIONS</span>
                  </button>

                  <button
                    onClick={() => handleReserve(prod.id)}
                    className="w-full btn-cyber py-2.5 rounded text-xs"
                  >
                    BOOKING GENERATOR
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* --- Empty State --- */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl glass-panel">
            <HelpCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <h3 className="font-orbitron text-base text-black mb-2">NO GENERATOR MODELS FOUND</h3>
            <p className="text-xs text-slate-500">Try modifying your search queries or capacity filter toggles.</p>
          </div>
        )}

        {/* --- Video Demos Section --- */}
        <div className="mt-24 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-orbitron font-extrabold text-2xl sm:text-3xl text-black tracking-wider mb-3">
              SEE THE GENERATORS IN ACTION
            </h2>
            <p className="text-slate-500 text-sm">
              Watch our zero-point magnetic electricity generators running flawlessly without external resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-lg group cursor-pointer" onClick={() => setPlayingVideo('/images/RFG Video.mp4')}>
              {products.length > 0 && (
                <img src={getImageUrl((products.find(p => p.name.toLowerCase().includes('resources free')) || products[0]).image_url)} alt="RFG Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/80 backdrop-blur flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="font-orbitron font-semibold text-white text-lg">Resources Free Generator Running Demo</p>
              </div>
            </div>

            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 shadow-lg group cursor-pointer" onClick={() => setPlayingVideo('/images/EBS1 Video.mp4')}>
              {products.length > 0 && (
                <img src={getImageUrl((products.find(p => p.name.toLowerCase().includes('energy booster')) || products[1] || products[0]).image_url)} alt="EBS Thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-blue-500/80 backdrop-blur flex items-center justify-center shadow-lg shadow-blue-500/50 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <p className="font-orbitron font-semibold text-white text-lg">Energy Booster System in Action</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- Fullscreen Video Modal --- */}
      <AnimatePresence>
        {playingVideo && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm">
            <button
              onClick={() => setPlayingVideo(null)}
              className="absolute top-6 right-6 text-white hover:text-slate-300 z-10 p-2 text-3xl"
            >
              ✕
            </button>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-4xl aspect-video px-4"
            >
              <video
                src={playingVideo}
                controls
                autoPlay
                className="w-full h-full object-contain rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- Technical Specification Modal Overlay --- */}
      <AnimatePresence>
        {selectedProductDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductDetails(null)}
              className="absolute inset-0 bg-white/85 backdrop-blur-md"
            ></motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-slate-50 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl z-10 overflow-hidden"
            >
              {/* Glowing decorative frame */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-orbitron font-extrabold text-xl text-blue-600 tracking-wide text-glow-blue">
                    {selectedProductDetails.name} Technical Schema
                  </h3>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Zero-Point Mechanical Blueprints</p>
                </div>
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="p-1 rounded hover:bg-slate-100 border border-slate-800 hover:border-slate-600 transition-colors text-black hover:text-black"
                >
                  ✕
                </button>
              </div>

              {/* Grid of specs */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-8 text-xs">
                {Object.entries(selectedProductDetails.specifications || {}).map(([key, val]) => (
                  <div key={key} className="p-3 bg-slate-100/50 border border-slate-800/80 rounded-lg">
                    <span className="text-slate-500 font-orbitron block capitalize mb-1">{key.replace('_', ' ')}</span>
                    <span className="text-black font-semibold">{val}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-slate-800/60">
                <button
                  onClick={() => setSelectedProductDetails(null)}
                  className="w-full py-2.5 rounded font-orbitron border border-slate-700 bg-slate-100/20 text-black hover:text-black transition-all text-xs"
                >
                  DISMISS CORE BLUEPRINTS
                </button>
                <button
                  onClick={() => {
                    const id = selectedProductDetails.id;
                    setSelectedProductDetails(null);
                    handleReserve(id);
                  }}
                  className="w-full btn-cyber py-2.5 rounded text-xs"
                >
                  BOOKING GENERATOR
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Products;

