import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Calendar, Clock, MapPin, Phone, Instagram, Facebook, 
  ChevronRight, Sparkles, Check, User, Info, Scissors, Heart, Send, Bot, Award, Droplets, Target, Star, HelpCircle, ArrowRight
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { GoogleGenAI } from "@google/genai";

// --- Constants & Types ---

const COLORS = {
  gold: '#D4AF37',
  cream: '#FDFBF7',
  charcoal: '#1A1A1A',
  mutedGold: '#B59431'
};

const TEAM_MEMBERS = [
  {
    name: "Elena Ross",
    role: "Master Stylist & Founder",
    specialty: "Editorial Color & Precision Cuts",
    experience: "15 Years",
    image: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Marcus Thorne",
    role: "Lead Esthetician",
    specialty: "Advanced Skin Therapy & Peels",
    experience: "10 Years",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600"
  },
  {
    name: "Sofia Mendez",
    role: "Nail Artist",
    specialty: "Intricate Nail Art & 3D Design",
    experience: "8 Years",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
  }
];

const FAQS = [
  {
    q: "How early should I arrive for my appointment?",
    a: "We recommend arriving 15 minutes prior to your scheduled time to relax with a complimentary beverage and complete any necessary consultation forms."
  },
  {
    q: "What is your cancellation policy?",
    a: "We require 24 hours notice for any cancellations or rescheduling. Cancellations with less than 24 hours notice may incur a 50% service charge."
  },
  {
    q: "Do you offer group bookings or bridal parties?",
    a: "Yes, we specialize in luxury bridal and group experiences. Please contact our concierge directly for bespoke package pricing."
  },
  {
    q: "Which products do you use?",
    a: "We exclusively use Oribe, Skinceuticals, and our own signature organic line—all paraben-free, cruelty-free, and ethically sourced."
  }
];

const BRAND_VALUES = [
  {
    icon: <Award className="w-6 h-6" />,
    title: "Artisanal Excellence",
    description: "Every stroke, cut, and treatment is treated as a unique work of art tailored specifically to your features."
  },
  {
    icon: <Droplets className="w-6 h-6" />,
    title: "Clean Luxury",
    description: "We exclusively use premium, cruelty-free, and paraben-free products that are as kind to the earth as they are to you."
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Bespoke Care",
    description: "We don't believe in templates. Your beauty journey begins with a deep consultation to understand your unique needs."
  }
];

const SERVICES = [
  {
    id: 'hair',
    title: 'Hair Design',
    icon: <Scissors className="w-6 h-6" />,
    items: [
      { name: 'Signature Haircut', price: 'R850+', duration: '60 min' },
      { name: 'Balayage & Glow', price: 'R2200+', duration: '180 min' },
      { name: 'Keratin Treatment', price: 'R3000+', duration: '120 min' },
    ]
  },
  {
    id: 'skin',
    title: 'Skin Therapy',
    icon: <Sparkles className="w-6 h-6" />,
    items: [
      { name: 'HydraFacial Glow', price: 'R1500+', duration: '45 min' },
      { name: 'Chemical Peel', price: 'R1200+', duration: '60 min' },
      { name: 'Anti-Aging Facial', price: 'R1800+', duration: '90 min' },
    ]
  },
  {
    id: 'nails',
    title: 'Nail Artistry',
    icon: <Heart className="w-6 h-6" />,
    items: [
      { name: 'Gel Manicure', price: 'R550+', duration: '60 min' },
      { name: 'Luxury Pedicure', price: 'R750+', duration: '75 min' },
      { name: 'Nail Art Design', price: 'R200+', duration: '30 min' },
    ]
  }
];

// --- Components ---

const Navbar = ({ onOpenBooking, onOpenConsultant }: { onOpenBooking: () => void, onOpenConsultant: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const observerOptions = { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 };
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    ['home', 'services', 'about', 'contact'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => { window.removeEventListener('scroll', handleScroll); observer.disconnect(); };
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Services', href: '#services', id: 'services' },
    { name: 'About', href: '#about', id: 'about' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/95 backdrop-blur-lg shadow-md py-3' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <a href="#home" className={`text-2xl font-serif font-bold tracking-tighter flex items-center gap-2 transition-colors duration-300 ${!isScrolled ? 'text-white' : 'text-black'}`}>
          <span className="text-[#D4AF37]">The</span> BEAUTY CORNER
        </a>
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className={`text-sm uppercase tracking-[0.2em] relative py-1 transition-all duration-300 ${activeSection === link.id ? 'text-[#D4AF37] font-semibold' : !isScrolled ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-black'}`}>
              {link.name}
              {activeSection === link.id && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37]" initial={false} transition={{ type: "spring", stiffness: 380, damping: 30 }} />}
            </a>
          ))}
          
          <button 
            onClick={onOpenConsultant} 
            className={`text-sm uppercase tracking-[0.2em] flex items-center gap-1.5 transition-all duration-300 ${!isScrolled ? 'text-white/80 hover:text-[#D4AF37]' : 'text-gray-600 hover:text-[#D4AF37]'}`}
          >
            Consultant <Sparkles className="w-3.5 h-3.5" />
          </button>

          <button onClick={onOpenBooking} className="bg-[#D4AF37] text-white px-8 py-2.5 rounded-full text-sm uppercase tracking-widest hover:bg-[#B59431] transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-[#D4AF37]/20">
            Book Now
          </button>
        </div>
        <button className={`${!isScrolled && !isMenuOpen ? 'text-white' : 'text-black'} md:hidden p-2`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-2xl">
            <div className="flex flex-col p-8 space-y-6">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className={`text-2xl font-serif transition-colors ${activeSection === link.id ? 'text-[#D4AF37]' : 'text-gray-800'}`}>{link.name}</a>
              ))}
              <button 
                onClick={() => { setIsMenuOpen(false); onOpenConsultant(); }} 
                className="text-2xl font-serif text-left flex items-center gap-2 text-gray-800 hover:text-[#D4AF37]"
              >
                AI Consultant <Sparkles className="w-5 h-5 text-[#D4AF37]" />
              </button>
              <button onClick={() => { setIsMenuOpen(false); onOpenBooking(); }} className="bg-[#D4AF37] text-white py-4 rounded-2xl text-center font-bold uppercase tracking-widest text-sm">Book Online</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const HomeSection = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
  return (
    <section id="home" className="bg-[#FDFBF7]">
      <div className="relative h-screen min-h-[700px] overflow-hidden">
        <Swiper modules={[Navigation, Pagination, Autoplay, EffectFade]} effect="fade" pagination={{ clickable: true }} autoplay={{ delay: 5000 }} loop={true} className="h-full w-full">
          <SwiperSlide>
            <div className="relative h-full flex items-center">
              <div className="absolute inset-0 bg-black/40 z-10" />
              <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1920" alt="Salon Interior" className="absolute inset-0 w-full h-full object-cover" />
              <div className="container mx-auto px-6 relative z-20">
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl text-white">
                  <span className="uppercase tracking-[0.4em] text-sm mb-4 block text-[#D4AF37] font-bold">EST. 2012</span>
                  <h1 className="text-6xl md:text-9xl font-serif mb-8 leading-none">Timeless <br />Artistry.</h1>
                  <p className="text-xl mb-10 font-light text-white/90 leading-relaxed max-w-xl">Step into a realm where high-fashion aesthetics meet holistic wellness. Your journey to impeccable style begins here.</p>
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button onClick={onOpenBooking} className="bg-[#D4AF37] hover:bg-[#B59431] text-white px-12 py-5 rounded-full text-sm uppercase tracking-widest transition-all shadow-xl shadow-[#D4AF37]/30">Explore Bookings</button>
                    <a href="#services" className="border border-white/40 hover:bg-white/10 backdrop-blur-md text-white px-12 py-5 rounded-full text-sm uppercase tracking-widest text-center transition-all">Our Menu</a>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="py-24 container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="lg:w-1/2 grid grid-cols-2 gap-4">
            <motion.img initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} src="https://images.unsplash.com/photo-1522337621169-d2ad5ef945d2?auto=format&fit=crop&q=80&w=400" className="rounded-2xl w-full h-64 object-cover" alt="Detail" />
            <motion.img initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} src="https://images.unsplash.com/photo-1596178065887-11386141a1e0?auto=format&fit=crop&q=80&w=400" className="rounded-2xl w-full h-80 object-cover -mt-16" alt="Detail" />
            <motion.img initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} src="https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=400" className="rounded-2xl w-full h-80 object-cover" alt="Detail" />
            <motion.img initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=400" className="rounded-2xl w-full h-64 object-cover -mt-16" alt="Detail" />
          </div>
          <div className="lg:w-1/2">
            <span className="text-[#D4AF37] font-bold tracking-[0.3em] text-xs block mb-4">THE EXPERIENCE</span>
            <h2 className="text-4xl md:text-5xl font-serif mb-8 text-[#1A1A1A]">A Sanctuary of Sophistication</h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg font-light">At The Beauty Corner, we don’t just offer services; we offer a transformation. From the moment you cross our threshold, the noise of the world fades, replaced by the gentle hum of expert care and premium luxury.</p>
            <div className="flex flex-col gap-4 mb-10">
              {['Award-winning Master Stylists', 'Organic Premium Product Lines', 'Private Consultation Suites'].map((f) => (
                <div key={f} className="flex items-center gap-3 text-[#1A1A1A] font-medium">
                  <Check className="text-[#D4AF37] w-5 h-5" /> {f}
                </div>
              ))}
            </div>
            <button onClick={onOpenBooking} className="group flex items-center gap-2 text-[#D4AF37] font-bold uppercase tracking-widest text-sm hover:translate-x-2 transition-transform">
              Join the Elite <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#1A1A1A] py-24 text-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-serif mb-4">The Journey to You</h3>
            <div className="w-20 h-1 bg-[#D4AF37] mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
            {[
              { step: '01', title: 'Consult', desc: 'A deep dive into your skin type, hair goals, and lifestyle needs.' },
              { step: '02', title: 'Transform', desc: 'Expert application of premium products using advanced techniques.' },
              { step: '03', title: 'Radiate', desc: 'Walk out with confidence and a personalized maintenance plan.' }
            ].map((s, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="relative">
                <span className="text-8xl font-serif text-white/5 absolute -top-10 left-1/2 -translate-x-1/2 z-0">{s.step}</span>
                <div className="relative z-10">
                  <h4 className="text-2xl font-serif mb-4 text-[#D4AF37]">{s.title}</h4>
                  <p className="text-gray-400 font-light leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const ContactSection = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <section id="contact" className="scroll-mt-20">
      <div className="bg-[#1A1A1A] py-24 text-white border-b border-white/5">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[#D4AF37] font-bold tracking-[0.4em] text-xs mb-6 block uppercase">Connect With Us</span>
              <h2 className="text-5xl md:text-7xl font-serif mb-12">Let's Craft Your <br />Artistic Vision.</h2>
              <div className="space-y-10">
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-white/10 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Our Flagship Location</h4>
                    <p className="text-gray-400 font-light text-lg">123 Avenue de Luxe, Beverly Hills<br />California, 90210</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-[#D4AF37] border border-white/10 group-hover:bg-[#D4AF37] group-hover:text-white transition-all duration-500">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold mb-1">Concierge Line</h4>
                    <p className="text-gray-400 font-light text-lg">+1 (555) BEAUTY-00<br />hello@beautycorner.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
              <h3 className="text-3xl font-serif mb-8 text-[#D4AF37]">Request an Inquiry</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="First Name" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#D4AF37] w-full text-white placeholder-gray-500" />
                  <input type="text" placeholder="Last Name" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#D4AF37] w-full text-white placeholder-gray-500" />
                </div>
                <input type="email" placeholder="Email Address" className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#D4AF37] w-full text-white placeholder-gray-500" />
                <select className="bg-[#2A2A2A] border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#D4AF37] w-full text-white">
                  <option>Select Treatment of Interest</option>
                  <option>Bespoke Hair Design</option>
                  <option>Advanced Skin Therapy</option>
                  <option>Bridal Consultation</option>
                </select>
                <textarea placeholder="Tell us more about your beauty goals..." rows={4} className="bg-white/5 border border-white/10 rounded-2xl p-5 focus:outline-none focus:border-[#D4AF37] w-full text-white placeholder-gray-500"></textarea>
                <button className="w-full bg-[#D4AF37] hover:bg-[#B59431] text-white py-5 rounded-2xl font-bold transition-all uppercase tracking-widest text-sm shadow-xl shadow-[#D4AF37]/20 active:scale-95">Inquire Now</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#FDFBF7] py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
              <span className="text-[#D4AF37] font-bold tracking-[0.3em] text-xs mb-4 block uppercase">Help Center</span>
              <h3 className="text-4xl font-serif mb-12 text-[#1A1A1A]">Common Inquiries</h3>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-b border-gray-200">
                    <button onClick={() =>