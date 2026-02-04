import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ShoppingCart, ScanBarcode } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { motion } from 'framer-motion';

export function Navbar() {
    const { cart, toggleCart } = useShop();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [barcodeQuery, setBarcodeQuery] = useState('');
    const navigate = useNavigate();

    // Sync local state with URL param on mount/update
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
    }, [searchParams, setSearchQuery]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setSearchParams({ search: searchQuery });
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        } else {
            setSearchParams({});
            navigate('/');
        }
    };

    const handleBarcodeSearch = async (e) => {
        e.preventDefault();
        if (!barcodeQuery.trim()) return;

        try {
            // Direct navigation to product detail if barcode provided
            // We'll let a ProductDetail page handle the fetching or fetch here first?
            // Plan said: "If barcode found, navigate purely to /product/:id"
            // Let's check existence first to be nice, or just nav.
            // checking first is better UX to avoid 404 pages.
            const data = await api.getProductByBarcode(barcodeQuery);
            if (data.status === 1 || data.product) {
                navigate(`/product/${barcodeQuery}`);
                setBarcodeQuery('');
            } else {
                alert('Product not found with this barcode');
            }
        } catch (error) {
            console.error(error);
            alert('Error searching barcode');
        }
    };

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <div className="sticky top-4 z-50 w-full px-4 md:px-6">
            <motion.nav
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="mx-auto max-w-7xl rounded-2xl border border-white/20 bg-white/70 backdrop-blur-xl shadow-lg shadow-black/5"
            >
                <div className="min-h-[4rem] py-2 px-6 flex flex-wrap items-center justify-between gap-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group shrink-0 mr-auto">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-400 flex items-center justify-center text-white font-bold text-lg group-hover:rotate-12 transition-transform shadow-lg shadow-primary/30">
                            F
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight sm:block">
                            FoodExplorer
                        </span>
                    </Link>

                    {/* Actions (Cart) - Moved up for mobile layout */}
                    <div className="flex items-center gap-3 md:order-last">
                        <button
                            onClick={toggleCart}
                            className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors relative"
                        >
                            <ShoppingCart size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ring-2 ring-background">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="flex relative flex-1 max-w-md group w-full order-3 md:order-none md:w-auto">
                        <input
                            type="text"
                            placeholder="Search pantry..."
                            className="w-full bg-secondary/5 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 rounded-xl py-2 pl-12 pr-4 outline-none transition-all duration-300 placeholder:text-muted-foreground/60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </form>

                    {/* Barcode Input */}
                    <form onSubmit={handleBarcodeSearch} className="flex relative w-full md:w-48 group order-4 md:order-none">
                        <input
                            type="text"
                            placeholder="Barcode..."
                            className="w-full bg-secondary/5 border border-transparent focus:border-primary/50 focus:bg-background focus:ring-4 focus:ring-primary/10 rounded-xl py-2 pl-10 pr-4 outline-none transition-all duration-300 placeholder:text-muted-foreground/60"
                            value={barcodeQuery}
                            onChange={(e) => setBarcodeQuery(e.target.value)}
                        />
                        <ScanBarcode size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </form>
                </div>
            </motion.nav>
        </div>
    );
}
