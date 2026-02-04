import { Navbar } from './components/layout/Navbar';
import { CartDrawer } from './components/layout/CartDrawer';
import { ShopProvider } from './context/ShopContext';
import { AnimatePresence } from 'framer-motion';
import { useLocation, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Compare } from './pages/Compare';
import { Scale } from 'lucide-react';
import { useShop } from './context/ShopContext';

function FloatingCompareButton() {
  const { compareList } = useShop();
  if (compareList.length === 0) return null;

  return (
    <a href="/compare" className="fixed bottom-6 left-6 z-40 bg-secondary text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center justify-center animate-in slide-in-from-bottom border-4 border-white">
      <Scale size={24} />
      <span className="absolute -top-1 -right-1 bg-black text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
        {compareList.length}
      </span>
    </a>
  );
}

function InnerApp() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans transition-colors duration-300">
      <Navbar />
      <CartDrawer />
      <FloatingCompareButton />
      <main className="flex-1 relative">
        <AnimatePresence mode='wait'>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/compare" element={<Compare />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
}

function App() {
  return (
    <ShopProvider>
      <Router>
        <InnerApp />
      </Router>
    </ShopProvider>
  );
}

export default App;
