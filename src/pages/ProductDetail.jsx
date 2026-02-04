import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { NutritionChart } from '../components/features/NutritionChart';
import { Loader } from '../components/shared/Loader';
import { ArrowLeft, Plus, Check, Scale, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const NUTRISCORE_COLORS = {
    a: 'bg-emerald-500 shadow-emerald-500/30',
    b: 'bg-lime-500 shadow-lime-500/30',
    c: 'bg-yellow-500 shadow-yellow-500/30',
    d: 'bg-orange-500 shadow-orange-500/30',
    e: 'bg-red-500 shadow-red-500/30',
    unknown: 'bg-gray-400'
};

export function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart, addToCompare, cart } = useShop();

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const data = await api.getProductByBarcode(id);
                if (data.product) setProduct(data.product);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <div className="min-h-screen pt-32 flex justify-center"><Loader /></div>;
    if (!product) return <div className="pt-32 text-center text-xl">Product not found.</div>;

    const isInCart = cart.some(item => item.code === product.code);
    const grade = product.nutrition_grades?.toLowerCase() || 'unknown';

    return (
        <div className="min-h-screen pb-20">
            {/* Immersive Hero Background (Blurred) */}
            <div className="fixed inset-0 z-0 opacity-20 dark:opacity-10 pointer-events-none">
                <img src={product.image_url} className="w-full h-full object-cover blur-3xl scale-110" />
            </div>

            <div className="container mx-auto px-4 pt-10 relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors bg-white/50 dark:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
                    <ArrowLeft size={18} /> Back to Pantry
                </Link>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Product Image & Grade (Hero) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-5 lg:sticky lg:top-24 z-20"
                    >
                        <div className="relative aspect-square rounded-[3rem] bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-md flex items-center justify-center p-8 md:p-12 overflow-hidden group mx-auto max-w-sm lg:max-w-none">
                            {/* Floating Grade */}
                            <div className={`absolute top-6 left-6 md:top-8 md:left-8 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-black text-lg md:text-2xl uppercase shadow-xl ring-4 ring-white/20 backdrop-blur-md z-30 ${NUTRISCORE_COLORS[grade]}`}>
                                {grade}
                            </div>

                            <motion.img
                                src={product.image_url || 'https://placehold.co/600?text=No+Image'}
                                alt={product.product_name}
                                className="w-full h-full object-contain drop-shadow-2xl z-20 group-hover:scale-105 transition-transform duration-700 relative"
                            />

                            {/* Decorative Blob */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-gradient-to-tr from-primary/30 to-secondary/30 rounded-full blur-[100px] z-0" />
                        </div>
                    </motion.div>

                    {/* Right: Data & Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-7 space-y-8"
                    >
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                    {product.brands?.split(',')[0] || 'Generic'}
                                </span>
                                {product.categories_tags?.slice(0, 2).map(tag => (
                                    <span key={tag} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wider">
                                        {tag.replace('en:', '').split(':')[0]}
                                    </span>
                                ))}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black leading-tight text-foreground bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                                {product.product_name}
                            </h1>
                        </div>

                        {/* Action Bar */}
                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={() => addToCart(product)}
                                className={`h-14 px-8 rounded-2xl flex items-center justify-center gap-3 font-bold text-lg transition-all shadow-xl hover:scale-105 active:scale-95 ${isInCart
                                    ? 'bg-primary text-primary-foreground shadow-primary/30'
                                    : 'bg-foreground text-background hover:bg-primary hover:text-white'
                                    }`}
                            >
                                {isInCart ? <><Check /> In Pantry</> : <><Plus /> Add to Pantry</>}
                            </button>

                            <button
                                onClick={() => addToCompare(product)}
                                className="h-14 w-14 rounded-2xl flex items-center justify-center border-2 border-border bg-white/50 dark:bg-white/5 hover:bg-secondary/10 hover:border-secondary hover:text-secondary transition-colors backdrop-blur-sm"
                                title="Compare"
                            >
                                <Scale size={24} />
                            </button>

                            <button className="h-14 w-14 rounded-2xl flex items-center justify-center border-2 border-border bg-white/50 dark:bg-white/5 hover:bg-blue-500/10 hover:border-blue-500 hover:text-blue-500 transition-colors backdrop-blur-sm">
                                <Share2 size={24} />
                            </button>
                        </div>

                        {/* Bento Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Chart Card */}
                            <div className="bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-[2rem] p-6 shadow-sm">
                                <h3 className="text-lg font-bold mb-4 opacity-80">Nutrient Radar</h3>
                                <NutritionChart nutriments={product.nutriments} />
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: 'Energy', value: `${product.nutriments?.['energy-kcal_100g'] || 0} kcal`, icon: '⚡' },
                                    { label: 'Fat', value: `${product.nutriments?.fat_100g || 0}g`, icon: '💧' },
                                    { label: 'Sugar', value: `${product.nutriments?.sugars_100g || 0}g`, icon: '🍬' },
                                    { label: 'Protein', value: `${product.nutriments?.proteins_100g || 0}g`, icon: '💪' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/40 dark:bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-center">
                                        <div className="text-2xl mb-1">{stat.icon}</div>
                                        <div className="text-sm opacity-60 font-medium uppercase tracking-wider">{stat.label}</div>
                                        <div className="text-xl font-black">{stat.value}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Ingredients */}
                        <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-lg border border-white/20 rounded-[2rem] p-8">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                Ingredients List
                                <span className="text-xs font-normal opacity-50 px-2 py-1 bg-black/5 dark:bg-white/10 rounded-full">
                                    {product.ingredients_n || '?'} items
                                </span>
                            </h3>
                            <p className="leading-relaxed opacity-80 text-lg">
                                {product.ingredients_text || 'No ingredients list available.'}
                            </p>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
