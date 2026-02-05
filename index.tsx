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
      { name: 'Signature Haircut', price: '$85+', duration: '60 min' },
      { name: 'Balayage & Glow', price: '$220+', duration: '180 min' },
      { name: 'Keratin Treatment', price: '$300+', duration: '120 min' },
    ]
  },
  {
    id: 'skin',
    title: 'Skin Therapy',
    icon: <Sparkles className="w-6 h-6" />,
    items: [
      { name: 'HydraFacial Glow', price: '$150+', duration: '45 min' },
      { name: 'Chemical Peel', price: '$120+', duration: '60 min' },
      { name: 'Anti-Aging Facial', price: '$180+', duration: '90 min' },
    ]
  },
  {
    id: 'nails',
    title: 'Nail Artistry',
    icon: <Heart className="w-6 h-6" />,
    items: [
      { name: 'Gel Manicure', price: '$55+', duration: '60 min' },
      { name: 'Luxury Pedicure', price: '$75+', duration: '75 min' },
      { name: 'Nail Art Design', price: '$20+', duration: '30 min' },
    ]
  }
];

// --- Components ---

const Navbar = ({ onOpenBooking }: { onOpenBooking: () => void }) => {
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

      {/* Luxury Welcome Grid */}
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

      {/* Path to Radiance */}
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
      {/* Contact Header */}
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

      {/* FAQ & Atmosphere */}
      <div className="bg-[#FDFBF7] py-24">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-20">
            <div className="lg:w-1/2">
              <span className="text-[#D4AF37] font-bold tracking-[0.3em] text-xs mb-4 block uppercase">Help Center</span>
              <h3 className="text-4xl font-serif mb-12 text-[#1A1A1A]">Common Inquiries</h3>
              <div className="space-y-4">
                {FAQS.map((faq, i) => (
                  <div key={i} className="border-b border-gray-200">
                    <button onClick={() => setActiveFaq(activeFaq === i ? null : i)} className="w-full flex justify-between items-center py-6 text-left group">
                      <span className={`text-lg transition-colors ${activeFaq === i ? 'text-[#D4AF37] font-bold' : 'text-[#1A1A1A]'}`}>{faq.q}</span>
                      <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${activeFaq === i ? 'rotate-90 text-[#D4AF37]' : 'text-gray-300'}`} />
                    </button>
                    <AnimatePresence>
                      {activeFaq === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <p className="pb-6 text-gray-500 font-light leading-relaxed">{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="sticky top-24">
                  <div className="relative rounded-[2.5rem] overflow-hidden group">
                    <img src="https://images.unsplash.com/photo-1596178065887-11386141a1e0?auto=format&fit=crop&q=80&w=800" alt="Salon Atmosphere" className="w-full h-[500px] object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center p-8">
                        <Star className="w-10 h-10 text-[#D4AF37] mx-auto mb-4" />
                        <h4 className="text-white text-2xl font-serif">Visit the Sanctuary</h4>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <Instagram className="w-6 h-6 text-[#D4AF37] mb-3" />
                      <p className="text-sm font-bold">@thebeautycorner</p>
                      <p className="text-xs text-gray-400">Join 50k+ followers</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                      <Facebook className="w-6 h-6 text-[#D4AF37] mb-3" />
                      <p className="text-sm font-bold">Beauty Corner HQ</p>
                      <p className="text-xs text-gray-400">Updates & Community</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ... (AboutSection, AIConcierge, BookingModal, ServicesSection remain identical or slightly styled) ...
// (Retained existing components for brevity, logic remains same)

const AIConcierge = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: "Hello! I'm your Beauty Concierge. Describe your mood or skin concerns, and I'll recommend the perfect treatment for you." }
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages]);

  const handleAsk = async () => {
    if (!query.trim()) return;
    const userText = query;
    setQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `You are a professional luxury beauty salon concierge. Based on this request: "${userText}", recommend one of our services (Haircut, Balayage, HydraFacial, Anti-Aging Facial, Gel Manicure, etc.) and explain why it fits their needs. Keep it concise, friendly, and elegant.`,
      });
      setMessages(prev => [...prev, { role: 'ai', text: response.text || "I'm sorry, I couldn't process that. Try asking about a relaxing facial or a new hairstyle!" }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: "I'm having a little trouble connecting. Feel free to browse our menu!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#D4AF37]/20">
      <div className="bg-[#D4AF37] p-4 text-white flex items-center gap-3">
        <Bot className="w-6 h-6" />
        <div><h4 className="font-bold leading-none">AI Beauty Consultant</h4><span className="text-[10px] uppercase tracking-widest opacity-80">Online & Ready</span></div>
      </div>
      <div ref={chatRef} className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-[#D4AF37] text-white rounded-tr-none' : 'bg-white border text-gray-800 rounded-tl-none'}`}>{m.text}</div>
          </div>
        ))}
        {loading && <div className="flex justify-start"><div className="bg-white border p-3 rounded-2xl rounded-tl-none flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce"></div><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.2s]"></div><div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:0.4s]"></div></div></div>}
      </div>
      <div className="p-4 border-t flex gap-2 bg-white">
        <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAsk()} placeholder="Ask for a recommendation..." className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none" />
        <button onClick={handleAsk} className="bg-[#D4AF37] text-white p-2 rounded-full hover:scale-105 transition-transform"><Send className="w-4 h-4" /></button>
      </div>
    </div>
  );
};

const BookingModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  if (!isOpen) return null;
  const reset = () => { setStep(1); setSelectedService(null); setSelectedDate(''); setSelectedTime(''); onClose(); };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={reset} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden">
        <button onClick={reset} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"><X className="w-6 h-6" /></button>
        <div className="flex flex-col md:flex-row min-h-[500px]">
          <div className="md:w-1/3 bg-[#1A1A1A] p-8 text-white">
            <h3 className="text-2xl font-serif mb-8 text-[#D4AF37]">Your Visit</h3>
            <div className="space-y-6 text-sm">
              <div className="flex gap-3"><Check className={`w-5 h-5 ${selectedService ? 'text-[#D4AF37]' : 'text-gray-600'}`} /><div><p className="opacity-50 uppercase tracking-widest text-[10px]">Service</p><p className="font-medium">{selectedService?.name || 'Not selected'}</p></div></div>
              <div className="flex gap-3"><Calendar className={`w-5 h-5 ${selectedDate ? 'text-[#D4AF37]' : 'text-gray-600'}`} /><div><p className="opacity-50 uppercase tracking-widest text-[10px]">Date</p><p className="font-medium">{selectedDate || 'Not selected'}</p></div></div>
              <div className="flex gap-3"><Clock className={`w-5 h-5 ${selectedTime ? 'text-[#D4AF37]' : 'text-gray-600'}`} /><div><p className="opacity-50 uppercase tracking-widest text-[10px]">Time</p><p className="font-medium">{selectedTime || 'Not selected'}</p></div></div>
            </div>
          </div>
          <div className="flex-1 p-8 overflow-y-auto">
            <h4 className="text-xl font-serif mb-6">{step === 1 ? 'Choose Service' : step === 2 ? 'Date & Time' : 'Confirm'}</h4>
            {step === 1 && (
              <div className="space-y-3">
                {SERVICES.flatMap(c => c.items).map((item, idx) => (
                  <button key={idx} onClick={() => { setSelectedService(item); setStep(2); }} className="w-full text-left p-4 rounded-xl border border-gray-100 hover:border-[#D4AF37] transition-all flex justify-between items-center group">
                    <div><p className="font-medium group-hover:text-[#D4AF37]">{item.name}</p><p className="text-xs text-gray-500">{item.duration}</p></div>
                    <p className="font-serif text-[#D4AF37]">{item.price}</p>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div className="space-y-6">
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full p-4 rounded-xl border border-gray-100" />
                <div className="grid grid-cols-3 gap-2">
                  {['09:00', '11:00', '13:00', '15:00', '17:00'].map(t => (
                    <button key={t} onClick={() => setSelectedTime(t)} className={`p-2 rounded-lg border text-sm ${selectedTime === t ? 'bg-[#D4AF37] text-white border-[#D4AF37]' : 'border-gray-100 hover:border-[#D4AF37]'}`}>{t}</button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-gray-400">Back</button>
                  <button disabled={!selectedDate || !selectedTime} onClick={() => setStep(3)} className="flex-[2] bg-[#D4AF37] text-white py-4 rounded-xl font-bold disabled:opacity-50">Next</button>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-4 rounded-xl border border-gray-100" />
                <input type="email" placeholder="Email" className="w-full p-4 rounded-xl border border-gray-100" />
                <button onClick={() => { alert('Confirmed!'); reset(); }} className="w-full bg-[#D4AF37] text-white py-4 rounded-xl font-bold uppercase tracking-widest">Confirm Booking</button>
                <button onClick={() => setStep(2)} className="w-full py-2 text-gray-400 text-sm">Back to timing</button>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const ServicesSection = () => (
  <section id="services" className="py-24 bg-[#FDFBF7] scroll-mt-20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-serif mb-4">Curated Treatments</h2>
        <div className="w-20 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-xl mx-auto">Explore our menu of award-winning beauty services.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {SERVICES.map((cat, idx) => (
          <motion.div key={cat.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }} className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-2xl transition-all">
            <div className="bg-[#D4AF37]/10 w-14 h-14 flex items-center justify-center rounded-2xl text-[#D4AF37] mb-8 group-hover:bg-[#D4AF37] group-hover:text-white transition-all">{cat.icon}</div>
            <h3 className="text-2xl font-serif mb-8">{cat.title}</h3>
            <div className="space-y-6">
              {cat.items.map((item, i) => (
                <div key={i} className="flex justify-between items-end border-b border-dashed border-gray-200 pb-3">
                  <div><h4 className="font-medium text-[#1A1A1A]">{item.name}</h4><span className="text-xs text-gray-400 uppercase tracking-widest">{item.duration}</span></div>
                  <span className="font-serif text-[#D4AF37]">{item.price}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const AboutSection = () => (
  <section id="about" className="bg-white overflow-hidden scroll-mt-20 py-24">
    <div className="container mx-auto px-6">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2 relative">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative z-10">
            <img src="https://images.unsplash.com/photo-1595475241949-0f05b1adce0f?auto=format&fit=crop&q=80&w=800" alt="Elena" className="rounded-[3rem] shadow-2xl" />
            <div className="absolute -bottom-10 -right-10 bg-[#1A1A1A] text-white p-10 rounded-3xl hidden md:block border-l-4 border-[#D4AF37]"><p className="text-5xl font-serif mb-1">12+</p><p className="text-xs uppercase tracking-widest text-[#D4AF37]">Years Excellence</p></div>
          </motion.div>
        </div>
        <div className="lg:w-1/2">
          <span className="text-[#D4AF37] font-bold tracking-[0.4em] text-xs mb-4 block">OUR STORY</span>
          <h2 className="text-5xl font-serif mb-8 text-[#1A1A1A]">Legacy of Elegance</h2>
          <p className="text-gray-600 text-lg font-light leading-relaxed mb-6">Founded on the principle that beauty is an individualized art form, The Beauty Corner has defined Beverly Hills luxury for over a decade. Elena Ross started with a single chair and a vision for a cleaner, more personalized salon experience.</p>
          <p className="text-gray-600 text-lg font-light leading-relaxed mb-8">Today, we are a global destination for those who seek the exceptional.</p>
          <div className="grid grid-cols-2 gap-8 border-t border-gray-100 pt-8">
            {[{t: 'Master Artists', v: '15+'}, {t: 'Clean Products', v: '100%'}].map(s => (<div key={s.t}><h4 className="text-2xl font-serif text-[#D4AF37]">{s.v}</h4><p className="text-xs uppercase tracking-widest text-gray-400">{s.t}</p></div>))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const App = () => {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  return (
    <div className="relative min-h-screen">
      <Navbar onOpenBooking={() => setIsBookingOpen(true)} />
      <main>
        <HomeSection onOpenBooking={() => setIsBookingOpen(true)} />
        <div className="fixed bottom-8 right-8 z-40 w-full max-w-[350px] px-4 sm:px-0"><AIConcierge /></div>
        <ServicesSection />
        <AboutSection />
        <ContactSection />
      </main>
      <footer className="py-20 bg-[#141414] text-gray-500 border-t border-white/5 text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-white font-serif text-2xl mb-8">The BEAUTY CORNER</h2>
          <div className="flex justify-center gap-8 mb-12">
            {[Instagram, Facebook, Target].map((Icon, i) => (<Icon key={i} className="w-5 h-5 hover:text-[#D4AF37] cursor-pointer transition-colors" />))}
          </div>
          <p className="text-xs tracking-widest uppercase">© {new Date().getFullYear()} THE BEAUTY CORNER. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
      <AnimatePresence>{isBookingOpen && <BookingModal isOpen={isBookingOpen} onClose={() => setIsBookingOpen(false)} />}</AnimatePresence>
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) createRoot(rootElement).render(<App />);