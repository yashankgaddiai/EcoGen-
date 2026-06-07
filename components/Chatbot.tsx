import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageCircle, X, Send, Minimize2, User, Phone, CheckCircle, 
  Loader2, Sparkles, AlertTriangle, Wifi, ShieldCheck, Home,
  RotateCcw, IndianRupee, Waves, Calendar, PhoneCall, Mail, ClipboardList
} from 'lucide-react';
import { GOOGLE_SCRIPT_URL } from '../constants';

interface Message {
  id: number;
  type: 'bot' | 'user';
  text: string;
  options?: string[];
}

interface LeadData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type LeadStep = 'none' | 'name' | 'phone' | 'subject' | 'email' | 'message';

const FAQ_KEYWORDS: Record<string, string> = {
  pricing: "The pricing for the entire villa is 15000 rupees per night (up to 15 guests). There is a one-time service fee of ₹2,500 per booking.",
  price: "Our stay is priced at 15000 rupees per night for the full property, plus a ₹2,500 service charge.",
  cost: "It costs 15000 rupees per night to rent the entire EcoGen Retreat.",
  wifi: "Yes! We offer high-speed Wi-Fi throughout the villa and in the outdoor lawn areas, so you can stay connected while you relax.",
  internet: "We provide reliable high-speed Wi-Fi for all our guests during their stay.",
  room: "EcoGen features 5 Premium AC bedrooms, each designed with luxury linens, aesthetic interiors, and attached bathrooms for maximum comfort.",
  stay: "We offer 5 luxury bedrooms, a massive event hall, a private pool, and a fully equipped kitchen for your exclusive use.",
  cancellation: "Our policy: Full refund if cancelled 15 days prior; 50% refund if cancelled 7-14 days before check-in. Cancellations within 7 days of check-in are non-refundable.",
  refund: "Refunds depend on the timing: 50% for cancellations 7+ days out. Less than 7 days is non-refundable.",
  food: "We have a fully functional kitchen for self-catering. We can also recommend premium local catering partners for your events.",
  kitchen: "Our kitchen is modern and fully equipped with a refrigerator, microwave, gas stove, and all necessary cookware.",
  pool: "The private swimming pool is exclusive to your group. We maintain high hygiene standards with regular filtration.",
  location: "Find us in Koheda(V), R.R. District, Telangana, right next to Anjali Film Studios. We are just 10 minutes from Ramoji Film City.",
  capacity: "Overnight stays are perfect for 10-15 guests. For day events like weddings or parties, our lawn can accommodate much larger groups.",
  checkin: "Check-in is at 2:00 PM and Check-out is at 11:00 AM. Early check-in may be possible depending on availability.",
  photoshoot: "EcoGen is a favorite for pre-wedding and lifestyle shoots due to our aesthetic night lighting and lush greenery.",
  alcohol: "Responsible alcohol consumption is allowed. We request guests to maintain decorum and respect the property rules.",
  pet: "Yes, we are pet-friendly! Please inform us in advance if you're bringing your furry friends.",
  attraction: "Nearby: Sanghi Temple (5 mins), Ramoji Film City (10 mins), Wonderla (15 mins), and Koheda Gutta (5 mins).",
  ac: "All 5 of our premium bedrooms are fully air-conditioned for a comfortable stay.",
  electricity: "We have full power backup facilities to ensure your celebration never stops."
};

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessages: Message[] = [
    { 
      id: 1, 
      type: 'bot', 
      text: "Welcome to EcoGen Retreat! I'm here to help you plan your stay. What would you like to know?",
      options: ["Pricing", "Amenities", "Check Availability", "Request Call Back"] 
    }
  ];
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [leadStep, setLeadStep] = useState<LeadStep>('none');
  const [leadData, setLeadData] = useState<LeadData>({ name: '', email: '', phone: '', subject: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setHasError(false);
  };

  const handleRefresh = () => {
    setMessages(initialMessages);
    setLeadStep('none');
    setLeadData({ name: '', email: '', phone: '', subject: '', message: '' });
    setHasError(false);
    setIsSending(false);
  };

  const handleSend = async (text: string = inputText) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setHasError(false);

    setTimeout(() => {
      processResponse(text);
    }, 500);
  };

  const processResponse = async (input: string) => {
    const cleanInput = input.toLowerCase().trim();

    // 1. Check for reset commands
    if (cleanInput === 'cancel' || cleanInput === 'stop' || cleanInput === 'reset') {
      handleRefresh();
      addBotMessage("Chat reset. How can I help you?", ["Amenities", "Pricing", "Location"]);
      return;
    }

    // 2. Handle Lead Capture Flow
    if (leadStep !== 'none') {
      switch (leadStep) {
        case 'name':
          setLeadData(prev => ({ ...prev, name: input }));
          setLeadStep('phone');
          addBotMessage("Thank you! Please share your 10-digit mobile number.");
          break;
        case 'phone':
          const phoneDigits = input.replace(/\D/g, '');
          if (phoneDigits.length < 10) {
            addBotMessage("Please enter a valid 10-digit phone number.");
          } else {
            setLeadData(prev => ({ ...prev, phone: input }));
            setLeadStep('subject');
            addBotMessage("What brings you to EcoGen today?", ["Weekend Stay", "Wedding / Event", "Corporate Retreat", "Other"]);
          }
          break;
        case 'subject':
          setLeadData(prev => ({ ...prev, subject: input }));
          setLeadStep('email');
          addBotMessage("Got it! To send you the details, please provide your Email Address.");
          break;
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
            addBotMessage("That doesn't look like a valid email. Please try again.");
          } else {
            setLeadData(prev => ({ ...prev, email: input }));
            setLeadStep('message');
            addBotMessage("Lastly, please type any specific message or requirements you have.");
          }
          break;
        case 'message':
          const finalLead = { ...leadData, message: input };
          setLeadData(finalLead);
          setLeadStep('none');
          await submitLead(finalLead);
          break;
      }
      return;
    }

    // 3. Check for specific triggers (fixed collision check)
    const isCallbackRequest = 
      cleanInput.includes("callback") || 
      cleanInput.includes("call back") || 
      cleanInput === "request call back" ||
      (cleanInput.includes("call") && (cleanInput.includes("me") || cleanInput.includes("team") || cleanInput.includes("back")));

    if (isCallbackRequest) {
      setLeadStep('name');
      addBotMessage("I'll have our team reach out to you. First, what is your Full Name?");
      return;
    }

    // 4. Check for booking triggers
    if (cleanInput.includes("book") || cleanInput.includes("reserve") || cleanInput.includes("availability")) {
       addBotMessage("You can check dates and book instantly here:", ["Book Now"]);
       return;
    }

    // 5. Check FAQ Keywords with Word Boundaries
    let foundAnswer = null;
    for (const key in FAQ_KEYWORDS) {
      const regex = new RegExp(`\\b${key}\\b`, 'i');
      if (regex.test(cleanInput)) {
        foundAnswer = FAQ_KEYWORDS[key];
        break;
      }
    }

    if (foundAnswer) {
      addBotMessage(foundAnswer, ["Check Availability", "Request Call Back"]);
      return;
    }

    // 6. Fallback
    addBotMessage("I'm still learning! Would you like to request a call back from our team to get more details?", ["Request Call Back", "Amenities", "Pricing"]);
  };

  const addBotMessage = (text: string, options?: string[]) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text, options }]);
  };

  const handleOptionClick = (option: string) => {
    if (option === "Book Now") {
      window.location.hash = "#/booking";
      setIsOpen(false);
      return;
    }
    handleSend(option);
  };

  const getOptionIcon = (option: string) => {
    const opt = option.toLowerCase();
    if (opt.includes('pricing')) return <IndianRupee className="w-3.5 h-3.5" />;
    if (opt.includes('amenities')) return <Waves className="w-3.5 h-3.5" />;
    if (opt.includes('availability') || opt.includes('book')) return <Calendar className="w-3.5 h-3.5" />;
    if (opt.includes('call back')) return <PhoneCall className="w-3.5 h-3.5" />;
    if (opt.includes('stay')) return <Home className="w-3.5 h-3.5" />;
    if (opt.includes('event') || opt.includes('wedding')) return <Sparkles className="w-3.5 h-3.5" />;
    if (opt.includes('retreat')) return <ClipboardList className="w-3.5 h-3.5" />;
    if (opt.includes('other')) return <Mail className="w-3.5 h-3.5" />;
    return <ClipboardList className="w-3.5 h-3.5" />;
  };

  const submitLead = async (data: LeadData) => {
    setIsSending(true);
    setHasError(false);
    
    try {
      const payload = {
        action: 'contact',
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message + "\n\n(Lead captured via Chatbot)"
      };

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) throw new Error('Failed');

      addBotMessage("✅ Excellent! Your details have been submitted. Our team will contact you shortly.");
      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: "Is there anything else I can assist you with today?", options: ["Amenities", "Pricing", "Location"] }]);
    } catch (error) {
      setHasError(true);
      addBotMessage("⚠️ System is currently busy. Please call us directly at +91 8106935999 for immediate assistance.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        aria-label="Open Chat"
        className={`fixed bottom-6 right-6 z-[60] bg-forest text-white p-4 sm:p-5 rounded-full shadow-2xl hover:bg-gold transition-all duration-300 hover:scale-110 flex items-center justify-center group ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full animate-pulse border-2 border-white"></span>
      </button>

      <div 
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-[60] w-full sm:w-[400px] bg-white sm:rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-500 origin-bottom-right flex flex-col border-t sm:border border-gray-100 ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-90 opacity-0 translate-y-10 pointer-events-none'}`} 
        style={{ height: window.innerWidth < 640 ? '100%' : '700px', maxHeight: '100dvh' }}
      >
        <div className="bg-forest p-5 flex justify-between items-center text-white relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-br from-forest via-[#1e2f26] to-midnightForest"></div>
          <div className="relative flex items-center gap-3">
             <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                <Sparkles className="w-6 h-6 text-gold" />
             </div>
             <div>
                <h3 className="font-bold font-serif text-xl tracking-wide">EcoGen Concierge</h3>
                <p className="text-[9px] uppercase tracking-widest opacity-80 flex items-center gap-1.5 font-black">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span> Online
                </p>
             </div>
          </div>
          <div className="flex items-center gap-2 relative">
            <button onClick={handleRefresh} title="Refresh Chat" className="hover:bg-white/10 p-2 rounded-full transition-colors">
              <RotateCcw className="w-5 h-5 opacity-80" />
            </button>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
              {window.innerWidth < 640 ? <X className="w-7 h-7" /> : <Minimize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-5 space-y-5 bg-sand/10 scrollbar-hide">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-3 duration-300`}>
              <div className={`max-w-[88%] p-4 rounded-3xl shadow-sm text-[15px] leading-relaxed font-medium ${
                msg.type === 'user' ? 'bg-forest text-white rounded-tr-none' : 'bg-white text-charcoal border border-gray-100 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {messages.length > 0 && messages[messages.length - 1].options && (
            <div className="flex flex-wrap gap-2.5 mt-2 animate-in fade-in slide-in-from-left-2 duration-500">
              {messages[messages.length - 1].options!.map((opt, idx) => (
                <button 
                  key={idx} 
                  onClick={() => handleOptionClick(opt)}
                  className="bg-white border border-forest/10 text-forest font-bold text-[11px] uppercase tracking-wider px-5 py-3 rounded-2xl hover:bg-gold hover:text-white hover:border-gold transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center gap-2"
                >
                  {getOptionIcon(opt)}
                  {opt}
                </button>
              ))}
            </div>
          )}
          {isSending && (
            <div className="flex justify-start">
               <div className="bg-white p-4 rounded-3xl rounded-tl-none border border-gray-100 flex items-center gap-3 text-xs font-bold text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-gold" /> Submitting...
               </div>
            </div>
          )}
          {hasError && (
             <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 text-xs font-bold">
               <AlertTriangle className="w-4 h-4" /> Connection issue. Please call +91 8106935999.
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-5 bg-white border-t border-gray-100 pb-10 sm:pb-5 shrink-0">
           <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-3 relative">
             <input 
               type="text" 
               className="flex-grow bg-sand/30 border border-transparent rounded-2xl px-6 py-4 focus:border-gold/30 focus:bg-white focus:ring-4 focus:ring-gold/5 outline-none text-charcoal font-semibold placeholder:text-gray-400 transition-all text-[15px]"
               placeholder={
                 leadStep === 'name' ? "Enter Full Name..." : 
                 leadStep === 'phone' ? "Enter Phone Number..." :
                 leadStep === 'subject' ? "Choose Interest..." :
                 leadStep === 'email' ? "Enter Email Address..." :
                 leadStep === 'message' ? "Type your message..." :
                 "Type your question..."
               }
               value={inputText}
               onChange={(e) => setInputText(e.target.value)}
               disabled={isSending}
             />
             <button type="submit" disabled={!inputText.trim() || isSending} className="w-14 h-14 bg-forest text-white rounded-2xl flex items-center justify-center hover:bg-gold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed shrink-0">
               <Send className="w-6 h-6 ml-0.5" />
             </button>
           </form>
           <div className="text-center mt-4">
             <span className="text-[10px] text-gray-300 uppercase tracking-[0.3em] font-black">Powered by EcoGen Concierge</span>
           </div>
        </div>
      </div>
    </>
  );
};

export default Chatbot;