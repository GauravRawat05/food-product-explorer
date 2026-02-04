import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { ProductCard } from '../components/features/ProductCard';
import { Loader } from '../components/shared/Loader';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';
import { Filter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useSearchParams } from 'react-router-dom';

export function Home() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search') || '';

    // Filters
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [sortBy, setSortBy] = useState('popularity'); // popularity, name_asc, name_desc, grade_asc
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    // Fetch Categories on mount
    useEffect(() => {
        api.getCategories().then(data => {
            // Take top 20 categories for the sidebar
            if (data.tags) {
                setCategories(data.tags.slice(0, 20).map(c => ({
                    id: c.id,
                    name: c.name
                })));
            }
        }).catch(err => console.error(err));
    }, []);

    // Fetch Products
    const fetchProducts = useCallback(async (reset = false) => {
        if (loading) return;
        setLoading(true);

        try {
            const currentPage = reset ? 1 : page;
            let data;

            if (selectedCategory) {
                data = await api.getProductsByCategory(selectedCategory, currentPage);
            } else {
                // Default search if no category (e.g. "snack" or general)
                // If query exists use it, else generic search
                data = await api.searchProducts(searchQuery || 'snack', currentPage);
            }

            if (data.products && data.products.length > 0) {
                setProducts(prev => reset ? data.products : [...prev, ...data.products]);
                setPage(currentPage + 1);
                // If less than page size (24), no more data
                if (data.products.length < 24) setHasMore(false);
                else setHasMore(true);
            } else {
                setHasMore(false);
                if (reset) setProducts([]);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [page, selectedCategory, searchQuery, loading]); // Added loading to deps to satisfy lint

    // Initial Load & Filter Change
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);

        const timeout = setTimeout(() => { // Debounce slightly
            const load = async () => {
                setLoading(true);
                try {
                    let data;
                    if (selectedCategory) {
                        data = await api.getProductsByCategory(selectedCategory, 1);
                    } else {
                        data = await api.searchProducts(searchQuery || 'snack', 1);
                    }

                    if (data.products) {
                        setProducts(data.products);
                        setPage(2);
                        setHasMore(data.products.length === 24);
                    }
                } catch (e) { console.error(e); }
                finally { setLoading(false); }
            };
            load();
        }, 300);

        return () => clearTimeout(timeout);

    }, [selectedCategory, searchQuery]);

    // Infinite Scroll Trigger
    const lastProductRef = useInfiniteScroll(() => {
        if (hasMore && !loading) {
            fetchProducts(false);
        }
    }, loading);

    // Sort Logic (Client Side for now as API sort is limited in free tier for specific fields)
    const sortedProducts = [...products].sort((a, b) => {
        if (sortBy === 'name_asc') return (a.product_name || '').localeCompare(b.product_name || '');
        if (sortBy === 'name_desc') return (b.product_name || '').localeCompare(a.product_name || '');
        if (sortBy === 'grade') return (a.nutrition_grades || 'z').localeCompare(b.nutrition_grades || 'z');
        return 0; // Default (popularity/relevance from API)
    });

    return (
        <div className="container mx-auto px-4 py-8 flex gap-8 relative">

            {/* Sidebar Rail (Desktop) */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 256 : 56 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex flex-col shrink-0 sticky top-24 h-[calc(100vh-6rem)] border-r border-border/50 overflow-hidden bg-white/50 dark:bg-card/50 backdrop-blur-sm rounded-2xl"
            >
                {/* Toggle & Header */}
                <div className={`flex items-center p-3 mb-2 ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                    {isSidebarOpen && (
                        <motion.h3
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-bold text-xl flex items-center gap-2 whitespace-nowrap"
                        >
                            <Filter size={20} /> Categories
                        </motion.h3>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
                        title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isSidebarOpen ? <ChevronLeft size={20} /> : <Filter size={20} />}
                    </button>
                </div>

                {/* Categories Scroll Layout */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-2 space-y-2">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors whitespace-nowrap ${!selectedCategory ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground'}`}
                        title="All Products"
                    >
                        <div className="min-w-[1.25rem] flex justify-center"><Filter size={16} /></div>
                        {isSidebarOpen && <span className="truncate">All Products</span>}
                    </button>

                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors whitespace-nowrap ${selectedCategory === cat.id ? 'bg-primary text-primary-foreground font-bold' : 'hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground opacity-80 hover:opacity-100'}`}
                            title={cat.name}
                        >
                            <div className="min-w-[1.25rem] flex justify-center text-xs font-bold border border-current rounded h-5 w-5 items-center">{cat.name.charAt(0).toUpperCase()}</div>
                            {isSidebarOpen && <span className="truncate">{cat.name}</span>}
                        </button>
                    ))}
                </div>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0 relative">

                {/* Mobile Filter Toggle (Keep for mobile users, hide on desktop) */}
                <div className="md:hidden mb-4 overflow-x-auto flex gap-2 pb-2">
                    <button
                        onClick={() => setSelectedCategory('')}
                        className={`whitespace-nowrap px-4 py-2 rounded-full border ${!selectedCategory ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-white/20'}`}
                    >
                        All
                    </button>
                    {categories.slice(0, 5).map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`whitespace-nowrap px-4 py-2 rounded-full border ${selectedCategory === cat.id ? 'bg-primary text-white border-primary' : 'border-gray-300 dark:border-white/20'}`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>



                {/* Header & Sort */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h2 className="text-3xl font-bold">
                        {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name || 'Category' : 'Discover'}
                    </h2>

                    <div className="relative group z-10">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none bg-white dark:bg-card border border-gray-200 dark:border-white/10 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
                        >
                            <option value="popularity">Relevance</option>
                            <option value="name_asc">Name (A-Z)</option>
                            <option value="name_desc">Name (Z-A)</option>
                            <option value="grade">Nutrition Grade</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" size={16} />
                    </div>
                </div>

                {/* Product Grid */}
                {products.length === 0 && !loading ? (
                    <div className="text-center py-20 opacity-50">
                        <p className="text-xl">No products found.</p>
                        <button onClick={() => { setSelectedCategory(''); setSearchParams({}) }} className="mt-4 text-primary underline">Clear Filters</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map((product, index) => {
                            // Ref for last element to trigger infinite scroll
                            if (index === sortedProducts.length - 1) {
                                return <div ref={lastProductRef} key={product.code + index}><ProductCard product={product} /></div>;
                            }
                            return <ProductCard key={product.code + index} product={product} />;
                        })}
                    </div>
                )}

                {/* Loading Spinner */}
                {loading && <Loader />}

                {!hasMore && products.length > 0 && (
                    <p className="text-center py-8 opacity-50 italic">You've reached the end of the pantry.</p>
                )}

            </div>

        </div>
    );
}
