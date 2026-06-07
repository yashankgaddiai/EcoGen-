import React from 'react';
import BookingWidget from '../components/BookingWidget';
import RevealSection from '../components/RevealSection';

const BookingPage: React.FC = () => {
  return (
    <div className="bg-sand/10 py-24 md:py-40 px-6 lg:px-20 min-h-screen animate-in fade-in duration-700">
      <RevealSection>
        <div className="max-w-4xl mx-auto text-center mb-16 md:mb-20 mt-12">
          <h2 className="italic text-5xl md:text-9xl mb-6 font-serif text-charcoal">Availability</h2>
          <p className="text-lg md:text-2xl font-subtitle italic text-gray-500">The entire sanctuary, exclusively yours.</p>
        </div>
      </RevealSection>
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        <RevealSection>
          <div className="space-y-8 md:space-y-12">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-50">
              <h3 className="font-serif text-2xl md:text-3xl italic font-bold mb-6 md:mb-8 text-charcoal">Direct Booking Perks</h3>
              <ul className="space-y-6 font-black uppercase tracking-widest text-[10px] md:text-[11px] text-charcoal/60 font-sans">
                <li className="flex items-center gap-6"><span className="w-10 h-10 bg-forest/5 text-forest rounded-full flex items-center justify-center font-black">01</span> Best Rate Guarantee</li>
                <li className="flex items-center gap-6"><span className="w-10 h-10 bg-forest/5 text-forest rounded-full flex items-center justify-center font-black">02</span> Complimentary Fire-Camp Setup</li>
              </ul>
            </div>
            <div className="bg-[#111111] text-white p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-2xl">
              <h3 className="font-serif text-3xl md:text-4xl italic font-bold mb-4">Need Help?</h3>
              <p className="opacity-70 mb-8 italic text-base md:text-lg leading-relaxed">Our team is ready to curate your specific requests.</p>
              <a href="tel:+918106935999" className="text-3xl md:text-5xl font-bold italic tracking-tighter border-b border-white/20 pb-4 inline-block hover:text-gold transition-colors">+91 8106935999</a>
            </div>
          </div>
        </RevealSection>
        <RevealSection delay={200}>
          <BookingWidget className="w-full min-h-[500px]" />
        </RevealSection>
      </div>
    </div>
  );
};

export default BookingPage;