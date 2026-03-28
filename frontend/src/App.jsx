import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import FlipCardSection from './components/FlipCardSection';
import UserForm from './components/UserForm';
import SuccessScreen from './components/SuccessScreen';
import AdminLogin from './components/admin/AdminLogin';
import AdminDashboard from './components/admin/AdminDashboard';
import { loadCards } from './cardData';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

export default function App() {
  const [section, setSection] = useState('hero');
  // selectedCards is a 2-slot array: [slot1CardId | null, slot2CardId | null]
  const [selectedCards, setSelectedCards] = useState([null, null]);
  const [cards, setCards] = useState([]);
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem('adminToken'));

  const isAdmin = window.location.pathname.includes('/admin');

  useEffect(() => { setCards(loadCards()); }, []);
  useEffect(() => { if (section === 'cards') setCards(loadCards()); }, [section]);
  useEffect(() => {
    if (adminToken) sessionStorage.setItem('adminToken', adminToken);
    else sessionStorage.removeItem('adminToken');
  }, [adminToken]);

  if (isAdmin) {
    if (!adminToken) return <AdminLogin onLogin={setAdminToken} />;
    return <AdminDashboard onLogout={() => setAdminToken(null)} />;
  }

  return (
    <div style={{ background: '#09090B', minHeight: '100dvh' }}>
      <AnimatePresence mode="wait">
        {section === 'hero' && (
          <motion.div key="hero" {...pageVariants}>
            <HeroSection onStart={() => setSection('cards')} />
          </motion.div>
        )}
        {section === 'cards' && (
          <motion.div key="cards" {...pageVariants}>
            <FlipCardSection
              cards={cards}
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
              onComplete={() => setSection('form')}
            />
          </motion.div>
        )}
        {section === 'form' && (
          <motion.div key="form" {...pageVariants}>
            <UserForm
              selectedCards={selectedCards}
              cards={cards}
              onSuccess={() => setSection('success')}
              onBack={() => setSection('cards')}
            />
          </motion.div>
        )}
        {section === 'success' && (
          <motion.div key="success" {...pageVariants}>
            <SuccessScreen selectedCards={selectedCards} cards={cards} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
