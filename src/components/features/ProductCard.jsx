import { motion } from 'framer-motion';
import { Plus, Check, ArrowUpRight } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

const NUTRISCORE_COLORS = {
    a: 'bg-emerald-500 shadow-emerald-500/30',
    b: 'bg-lime-500 shadow-lime-500/30',
    c: 'bg-yellow-500 shadow-yellow-500/30',
    d: 'bg-orange-500 shadow-orange-500/30',
    e: 'bg-red-500 shadow-red-500/30',
    unknown: 'bg-gray-400'
};

export function ProductCard({ product }) {
    const { addToCart, cart } = useShop();
    const isInCart = cart.some(item => item.code === product.code);
    const grade = product.nutrition_grades?.toLowerCase() || 'unknown';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            className="group relative bg-card/40 dark:bg-card/40 backdrop-blur-md border border-border/50 hover:border-primary/50 rounded-3xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 h-[420px] flex flex-col"
        >
            {/* Visual Header */}
            <div className="relative h-1/2 p-6 flex items-center justify-center bg-gradient-to-b from-white/50 to-transparent dark:from-white/5">
                <Link to={`/product/${product.code}`} className="w-full h-full flex items-center justify-center relative z-10">
                    <motion.img
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        src={product.image_front_small_url || product.image_url || 'https://placehold.co/300?text=No+Image'}
                        alt={product.product_name}
                        className="h-full w-full object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-xl"
                    />
                </Link>

                {/* Floating Grade Badge */}
                <div className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-white font-black text-xs uppercase shadow-lg ring-2 ring-white/20 backdrop-blur-sm z-20 ${NUTRISCORE_COLORS[grade]}`}>
                    {grade === 'unknown' ? '?' : grade}
                </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-white/30 dark:bg-black/30 backdrop-blur-sm">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground/80">
                            {product.brands?.split(',')[0] || 'Unknown Brand'}
                        </span>
                    </div>

                    <Link to={`/product/${product.code}`} className="block group/title">
                        <h3 className="font-bold text-lg leading-snug line-clamp-2 text-foreground group-hover/title:text-primary transition-colors">
                            {product.product_name || 'Unnamed Product'}
                        </h3>
                    </Link>

                    {/* Tags Pill */}
                    <div className="flex flex-wrap gap-1 mt-3">
                        {product.categories_tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-accent/50 text-accent-foreground border border-accent/20 truncate max-w-[100px]">
                                {tag.replace('en:', '').split(':')[0]}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-3 mt-4">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => addToCart(product)}
                        className={`flex-1 h-10 rounded-xl flex items-center justify-center gap-2 font-semibold text-sm transition-all duration-300 ${isInCart
                            ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                            }`}
                    >
                        {isInCart ? <Check size={16} /> : <Plus size={16} />}
                        {isInCart ? 'Added' : 'Add'}
                    </motion.button>

                    <Link
                        to={`/product/${product.code}`}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                    >
                        <ArrowUpRight size={18} />
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
