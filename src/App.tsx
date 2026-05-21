/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { 
  Coffee, Utensils, MapPin, Clock, Phone, Instagram, 
  Facebook, Twitter, ChevronRight, Star, ArrowRight,
  MessageCircle, ShoppingBag, Calendar, ArrowUpRight, Check
} from 'lucide-react';

// --- SOUND UTILITY ---
const playPremiumTap = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    // Smooth, deep "thud/tick" sound
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (err) {
    // Ignore context errors
  }
};

// --- CART CONTEXT ---
interface CartItem {
  id: number;
  name: string;
  price: string;
  img: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
}

const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {}
});

// --- CONFIG & THEME ---
const THEME = {
  colors: {
    navy: '#0A1128',
    hazelnut: '#8B5A2B',
    beige: '#FAF8F5',
    gold: '#D4AF37',
    espresso: '#1A1110',
    white: '#FFFFFF'
  }
};

// --- MOCK DATA ---
const MENU_CATEGORIES = ['All', 'Coffee', 'Desserts', 'Brunch', 'Mithai'];

const MENU_ITEMS = [
  { id: 1, name: 'Hazelnut Praline Entremet', category: 'Desserts', price: '₹345', img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'Truffle Mushroom Croissant', category: 'Brunch', price: '₹295', img: 'https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'Madagascar Vanilla Flat White', category: 'Coffee', price: '₹225', img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'Artisanal Baklava Box', category: 'Mithai', price: '₹850', img: 'https://images.unsplash.com/photo-1599380753063-e52292f7e841?q=80&w=800&auto=format&fit=crop' },
  { id: 5, name: 'Lotus Biscoff Cheesecake', category: 'Desserts', price: '₹310', img: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=800&auto=format&fit=crop' },
  { id: 6, name: 'Cold Brew Reserve', category: 'Coffee', price: '₹250', img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?q=80&w=800&auto=format&fit=crop' },
];

const REVIEWS = [
  { id: 1, text: "The most aesthetic café in Varanasi! The hazelnut pastry is world-class, and the vibe feels straight out of Europe.", author: "Aanya S.", role: "Food Blogger" },
  { id: 2, text: "Perfect spot for dates or remote work. Their specialty coffee is unmatched in Lanka. Absolute luxury.", author: "Rohan M.", role: "Local Guide" },
  { id: 3, text: "The artisanal mithai boxes are my go-to for Diwali gifting. THF has redefined luxury gifting in UP.", author: "Priya V.", role: "Entrepreneur" }
];

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

// --- TOAST COMPONENT ---
const Toast = ({ message, isVisible }: { message: string, isVisible: boolean }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#D4AF37] text-[#0A1128] px-6 py-3 rounded-full shadow-2xl flex items-center space-x-3 font-medium tracking-wide"
      >
        <div className="bg-[#0A1128] text-[#D4AF37] rounded-full p-1">
          <Check size={14} strokeWidth={3} />
        </div>
        <span>{message}</span>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- COMPONENTS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { cart } = useContext(CartContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-[#0A1128]/90 backdrop-blur-md shadow-lg' : 'py-6 bg-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-serif text-[#D4AF37] font-bold tracking-wider relative group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          THF <span className="text-white text-sm tracking-widest block font-sans font-light">JALGHAR</span>
        </div>
        
        <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest text-white/90">
          {['Home', 'Menu', 'About', 'Gallery', 'Contact'].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[#D4AF37] transition-colors">
              {item}
            </a>
          ))}
        </div>

        <div className="flex space-x-4 items-center">
          <div className="relative group cursor-pointer text-white hover:text-[#D4AF37] transition-colors md:hidden">
            <ShoppingBag size={24} />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#D4AF37] text-[#0A1128] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <div className="relative group cursor-pointer text-white hover:text-[#D4AF37] transition-colors flex items-center space-x-2">
              <ShoppingBag size={20} />
              <span className="text-sm font-medium tracking-wide">Cart</span>
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-[#D4AF37] text-[#0A1128] text-xs font-bold px-1.5 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </div>
            <button className="flex items-center space-x-2 px-5 py-2.5 rounded-full border border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A1128] transition-all text-sm font-medium tracking-wide">
              <Calendar size={16} />
              <span>Reserve</span>
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    
    // Normalize to -1 to 1 based on screen center
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const { scrollY } = useScroll();
  const layer1Y = useTransform(scrollY, [0, 1000], [0, -100]);
  const layer2Y = useTransform(scrollY, [0, 1000], [0, -250]);
  const layer3Y = useTransform(scrollY, [0, 1000], [0, -150]);

  return (
    <section 
      id="home" 
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#0A1128]"
      onMouseMove={handleMouseMove}
      style={{ perspective: 1000 }}
    >
      {/* Background Image with Parallax effect simulation */}
      <motion.div 
        style={{ y: layer1Y }}
        className="absolute inset-0 z-0 h-[120%]"
      >
        <motion.div
           initial={{ scale: 1.1 }}
           animate={{ scale: 1 }}
           transition={{ duration: 1.5, ease: 'easeOut' }}
           className="w-full h-full"
        >
          <img 
            src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop" 
            alt="Luxury Cafe Interior" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] via-transparent to-[#0A1128]/80" />
        </motion.div>
      </motion.div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center mt-20 pointer-events-none">
        <motion.div className="pointer-events-auto">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-[#D4AF37] tracking-[0.3em] text-sm md:text-base uppercase mb-6"
          >
            Lanka • Varanasi
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight mb-8"
          >
            Where Artisanal Luxury <br/> <span className="italic font-light text-white/90">Meets Café Culture</span>
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <a href="#menu" className="px-8 py-4 bg-[#D4AF37] text-[#0A1128] rounded-full hover:bg-white transition-colors duration-300 flex items-center space-x-2 font-medium tracking-wide w-full sm:w-auto justify-center cursor-pointer">
              <ShoppingBag size={18} />
              <span>Order Online</span>
            </a>
            <a href="#menu" className="px-8 py-4 border border-white/30 text-white rounded-full hover:bg-white/10 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto justify-center cursor-pointer">
              View Menu
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div 
        style={{ 
          y: layer2Y,
          x: useTransform(smoothMouseX, [-1, 1], [-40, 40]),
          rotateY: useTransform(smoothMouseX, [-1, 1], [-15, 15]),
          rotateX: useTransform(smoothMouseY, [-1, 1], [15, -15])
        }}
        className="absolute bottom-20 right-20 hidden lg:block w-56 h-72 rounded-2xl overflow-hidden border border-white/10 shadow-2xl z-20 pointer-events-none"
      >
        <img src="https://images.unsplash.com/photo-1582295526604-b10ea9b44122?q=80&w=400&auto=format&fit=crop" alt="Coffee Pour" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div 
        style={{ 
          y: layer3Y,
          x: useTransform(smoothMouseX, [-1, 1], [30, -30]),
          rotateY: useTransform(smoothMouseX, [-1, 1], [10, -10]),
          rotateX: useTransform(smoothMouseY, [-1, 1], [-10, 10])
        }}
        className="absolute top-32 left-16 md:top-40 md:left-24 hidden xl:block w-48 h-48 rounded-full overflow-hidden border-4 border-[#D4AF37]/20 shadow-2xl z-20 pointer-events-none opacity-90"
      >
        <img src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop" alt="Hazelnut Pastry" className="w-full h-full object-cover" />
      </motion.div>

      <motion.div 
        style={{ 
          y: useTransform(scrollY, [0, 1000], [0, -400]),
          x: useTransform(smoothMouseX, [-1, 1], [-20, 20]),
        }}
        className="absolute top-1/2 right-[20%] hidden xl:block w-32 h-32 rounded-full overflow-hidden shadow-xl z-10 pointer-events-none opacity-80 mix-blend-screen"
      >
        <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop" alt="Latte Art" className="w-full h-full object-cover" />
      </motion.div>
    </section>
  );
};

const Experience = () => {
  return (
    <section id="about" className="py-24 bg-[#FAF8F5] text-[#1A1110] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-serif leading-tight text-[#0A1128]">
              A symphony of <br/> <span className="text-[#8B5A2B] italic">taste and aesthetics.</span>
            </h2>
            <p className="text-lg text-[#1A1110]/70 font-light leading-relaxed">
              Step into The Hazelnut Factory Jalghar, where the warmth of modern Indian elegance perfectly blends with high-end European café culture. Nestled in the heart of Varanasi, we craft more than just desserts—we create moments.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div className="space-y-2">
                <Coffee className="text-[#D4AF37]" size={32} />
                <h4 className="font-serif text-xl">Specialty Coffee</h4>
                <p className="text-sm text-[#1A1110]/60">Ethically sourced, masterfully roasted.</p>
              </div>
              <div className="space-y-2">
                <Utensils className="text-[#D4AF37]" size={32} />
                <h4 className="font-serif text-xl">Artisanal Bakes</h4>
                <p className="text-sm text-[#1A1110]/60">Handcrafted pastries & gourmet food.</p>
              </div>
            </div>
            <button className="group flex items-center space-x-2 text-[#0A1128] font-medium pt-4 pb-1 border-b border-[#0A1128]">
              <span>Discover Our Story</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <div className="relative h-[600px] w-full">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 rounded-t-full overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=800&auto=format&fit=crop" 
                alt="Cafe Ambience" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="absolute -bottom-8 -left-8 w-64 h-64 rounded-full border-8 border-[#FAF8F5] overflow-hidden hidden md:block"
            >
              <img 
                src="https://images.unsplash.com/photo-1627586561109-77ab1db2c813?q=80&w=400&auto=format&fit=crop" 
                alt="Dessert Close-up" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const MenuPreview = () => {
  const [activeTab, setActiveTab] = useState('All');
  const { addToCart } = useContext(CartContext);

  const filteredMenu = activeTab === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeTab);

  return (
    <section id="menu" className="py-24 bg-[#0A1128] text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16 space-y-4">
          <p className="text-[#D4AF37] tracking-[0.2em] text-sm uppercase">Curated Offerings</p>
          <h2 className="text-4xl md:text-5xl font-serif">Signature Selection</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {MENU_CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeTab === category 
                  ? 'bg-[#D4AF37] text-[#0A1128]' 
                  : 'border border-white/20 text-white/70 hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 transition-colors"
              >
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={item.img} 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1128] to-transparent opacity-60" />
                </div>
                <div className="p-6 relative">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-xl text-white group-hover:text-[#D4AF37] transition-colors">{item.name}</h3>
                    <span className="text-[#D4AF37] font-medium">{item.price}</span>
                  </div>
                  <p className="text-sm text-white/50 mb-6">{item.category}</p>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                    className="w-full py-3 rounded-xl border border-white/20 text-white/80 hover:bg-[#D4AF37] hover:text-[#0A1128] hover:border-transparent transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
        
        <div className="mt-16 text-center">
          <button className="px-8 py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-[#0A1128] transition-all duration-300 inline-flex items-center space-x-2">
            <span>Explore Full Menu</span>
            <ArrowUpRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

const MithaiGifting = () => {
  return (
    <section className="py-24 bg-[#1A1110] relative overflow-hidden">
      <div className="absolute right-0 top-0 w-1/2 h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 order-2 md:order-1"
        >
          <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-[#D4AF37]/10 aspect-square">
            <img 
              src="https://images.unsplash.com/photo-1605197141384-cb9192eb903f?q=80&w=800&auto=format&fit=crop" 
              alt="Luxury Mithai Box" 
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="w-full md:w-1/2 order-1 md:order-2 space-y-6"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#D4AF37]">
            Artisanal Mithai & <br/> <span className="text-white">Luxury Gifting</span>
          </h2>
          <p className="text-white/70 text-lg font-light leading-relaxed">
            Elevate your celebrations with our handcrafted Indian sweets, reimagined with contemporary flair. Packaged in bespoke luxury boxes, THF mithai is the ultimate expression of love and prestige.
          </p>
          <ul className="space-y-4 pt-4">
            {['Premium Dry Fruit Sweets', 'Signature Baklava Assortments', 'Custom Corporate Gifting', 'Wedding Return Favors'].map((item, i) => (
              <li key={i} className="flex items-center space-x-3 text-white/90">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="pt-6">
            <button className="px-8 py-4 bg-[#D4AF37] text-[#1A1110] font-medium rounded-full hover:bg-white transition-colors duration-300">
              Download Gifting Brochure
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const images = [
    "https://images.unsplash.com/photo-1497935586351-b67a49e012bf",
    "https://images.unsplash.com/photo-1559525839-b184a4d698c7",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587",
    "https://images.unsplash.com/photo-1509042239860-f550ce710b93"
  ];

  return (
    <section id="gallery" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-[#8B5A2B] tracking-[0.2em] text-sm uppercase mb-2">The Aesthetics</p>
            <h2 className="text-4xl md:text-5xl font-serif text-[#0A1128]">Captured Moments</h2>
          </div>
          <button className="hidden md:flex items-center space-x-2 text-[#0A1128] hover:text-[#8B5A2B] transition-colors">
            <Instagram size={20} />
            <span className="font-medium">@thehazelnutfactory</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative overflow-hidden rounded-xl group ${idx === 1 || idx === 2 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}
            >
              <img 
                src={`${img}?q=80&w=800&auto=format&fit=crop`} 
                alt="Gallery" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Reviews = () => {
  return (
    <section className="py-24 bg-[#0A1128] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16 text-[#D4AF37]">
          Whispers of the City
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, idx) => (
            <motion.div 
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:bg-white/10 transition-colors"
            >
              <div>
                <div className="flex space-x-1 text-[#D4AF37] mb-6">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                </div>
                <p className="text-white/80 leading-relaxed font-light mb-8">
                  "{review.text}"
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center text-[#0A1128] font-serif font-bold text-lg">
                  {review.author[0]}
                </div>
                <div>
                  <h4 className="font-medium text-white">{review.author}</h4>
                  <p className="text-xs text-white/50 uppercase tracking-wider">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const VisitUs = () => {
  return (
    <section id="contact" className="py-24 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-[#0A1128] rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center text-white">
            <h2 className="text-4xl font-serif mb-8 text-[#D4AF37]">Plan Your Visit</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-[#D4AF37] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-medium text-lg">Location</h4>
                  <p className="text-white/70 mt-1">The Hazelnut Factory,<br/>Jalghar, Lanka,<br/>Varanasi, UP 221005</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="text-[#D4AF37] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-medium text-lg">Hours</h4>
                  <p className="text-white/70 mt-1">Mon - Sun: 8:00 AM - 11:30 PM</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Phone className="text-[#D4AF37] mt-1 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-medium text-lg">Contact</h4>
                  <p className="text-white/70 mt-1">+91 98765 43210<br/>hello@thehazelnutfactory.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12 flex space-x-4">
              <button className="flex-1 py-3 bg-[#E23744] text-white rounded-xl font-medium hover:bg-opacity-90 transition-all text-sm tracking-wide">
                Order on Zomato
              </button>
              <button className="flex-1 py-3 bg-[#FC8019] text-white rounded-xl font-medium hover:bg-opacity-90 transition-all text-sm tracking-wide">
                Order on Swiggy
              </button>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 min-h-[400px] relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d115408.09799723048!2d82.90870634620573!3d25.320739742468303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2db76febcf4d%3A0x68131710853ff0b5!2sVaranasi%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-80 mix-blend-luminosity hover:grayscale-0 hover:opacity-100 transition-all duration-700"
              title="Google Maps Location"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#050A18] pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl font-serif text-[#D4AF37] font-bold tracking-wider mb-4 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              THF <span className="text-white text-base tracking-widest block font-sans font-light mt-1">JALGHAR</span>
            </h3>
            <p className="text-white/60 font-light leading-relaxed max-w-sm mb-6">
              Where artisanal luxury meets café culture. Premium bakes, specialty coffee, and handcrafted mithai in the heart of Varanasi.
            </p>
            <div className="flex space-x-4">
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A1128] transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Facebook" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A1128] transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Twitter" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#D4AF37] hover:text-[#0A1128] transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['Our Story', 'Full Menu', 'Artisanal Mithai', 'Reservations', 'Franchise'].map(link => (
                <li key={link}>
                  <a href="#" className="text-white/60 hover:text-[#D4AF37] transition-colors text-sm">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium uppercase tracking-widest text-sm mb-6">Newsletter</h4>
            <p className="text-white/60 text-sm mb-4">Join our community for exclusive tasting events and seasonal menus.</p>
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <input type="email" placeholder="Email Address" className="bg-transparent border-none outline-none text-white px-4 text-sm w-full" aria-label="Email Address for newsletter" />
              <button className="bg-[#D4AF37] text-[#0A1128] w-8 h-8 rounded-full flex items-center justify-center hover:bg-white transition-colors" aria-label="Subscribe to newsletter">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/40">
          <p>© {new Date().getFullYear()} The Hazelnut Factory Jalghar. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingWidgets = () => {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-50">
      <motion.button 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-[#1DA851] transition-colors"
      >
        <MessageCircle size={28} />
      </motion.button>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const handleGlobalClick = () => {
      playPremiumTap();
    };
    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => [...prev, item]);
    setToastMessage(`Added ${item.name} to cart`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart }}>
      <div className="bg-[#0A1128] min-h-screen font-sans selection:bg-[#D4AF37] selection:text-[#0A1128]">
        <Navbar />
        <Hero />
        <Experience />
        <MenuPreview />
        <MithaiGifting />
        <Gallery />
        <Reviews />
        <VisitUs />
        <Footer />
        <FloatingWidgets />
        <Toast message={toastMessage} isVisible={showToast} />
      </div>
    </CartContext.Provider>
  );
}
