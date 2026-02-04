import { useShop } from '../context/ShopContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Compare() {
    const { compareList, removeFromCompare, addToCart } = useShop();

    if (compareList.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h1 className="text-3xl font-bold mb-4">Comparison is empty</h1>
                <p className="opacity-60 mb-8">Add products from the home page to compare them side-by-side.</p>
                <Link to="/" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                    Go to Search <ArrowRight size={20} />
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <h1 className="text-3xl font-bold mb-8">Product Comparison</h1>

            <div className="min-w-[800px]">
                <div className="grid grid-cols-4 gap-4">

                    {/* Legend Column */}
                    <div className="col-span-1 space-y-4 pt-60 font-bold text-right pr-4 text-sm opacity-60">
                        <div className="h-12 flex items-center justify-end">Grade</div>
                        <div className="h-12 flex items-center justify-end bg-gray-50 dark:bg-white/5 rounded-lg px-2">Energy</div>
                        <div className="h-12 flex items-center justify-end">Fat</div>
                        <div className="h-12 flex items-center justify-end bg-gray-50 dark:bg-white/5 rounded-lg px-2">Carbs</div>
                        <div className="h-12 flex items-center justify-end">Sugars</div>
                        <div className="h-12 flex items-center justify-end bg-gray-50 dark:bg-white/5 rounded-lg px-2">Proteins</div>
                        <div className="h-12 flex items-center justify-end">Salt</div>
                    </div>

                    {/* Product Columns */}
                    <AnimatePresence>
                        {compareList.map(product => (
                            <motion.div
                                key={product.code}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="col-span-1 border border-gray-200 dark:border-white/10 rounded-2xl p-4 bg-white dark:bg-card relative"
                            >
                                <button
                                    onClick={() => removeFromCompare(product.code)}
                                    className="absolute top-2 right-2 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full text-red-400"
                                >
                                    <Trash2 size={18} />
                                </button>

                                <div className="h-40 flex items-center justify-center mb-4">
                                    <img
                                        src={product.image_front_small_url || product.image_url}
                                        alt={product.product_name}
                                        className="max-h-full object-contain"
                                    />
                                </div>

                                <h3 className="font-bold text-lg line-clamp-2 h-14 mb-2">{product.product_name}</h3>

                                <div className="space-y-4 text-center">
                                    <div className="h-12 flex items-center justify-center">
                                        <span className={`px-3 py-1 text-white font-bold rounded uppercase text-sm ${product.nutrition_grades === 'a' ? 'bg-green-500' :
                                            product.nutrition_grades === 'b' ? 'bg-lime-500' :
                                                product.nutrition_grades === 'c' ? 'bg-yellow-500' :
                                                    product.nutrition_grades === 'd' ? 'bg-orange-500' :
                                                        'bg-red-500'
                                            }`}>
                                            {product.nutrition_grades || '?'}
                                        </span>
                                    </div>

                                    <div className="h-12 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-lg">
                                        {product.nutriments?.['energy-kcal_100g']} kcal
                                    </div>
                                    <div className="h-12 flex items-center justify-center">
                                        {product.nutriments?.fat_100g} g
                                    </div>
                                    <div className="h-12 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-lg">
                                        {product.nutriments?.carbohydrates_100g} g
                                    </div>
                                    <div className="h-12 flex items-center justify-center">
                                        {product.nutriments?.sugars_100g} g
                                    </div>
                                    <div className="h-12 flex items-center justify-center bg-gray-50 dark:bg-white/5 rounded-lg">
                                        {product.nutriments?.proteins_100g} g
                                    </div>
                                    <div className="h-12 flex items-center justify-center">
                                        {product.nutriments?.salt_100g} g
                                    </div>

                                    <button
                                        onClick={() => addToCart(product)}
                                        className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg flex items-center justify-center gap-2 hover:opacity-90"
                                    >
                                        <ShoppingCart size={16} /> Add
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Empty Slots */}
                    {[...Array(3 - compareList.length)].map((_, i) => (
                        <div key={i} className="col-span-1 border-2 border-dashed border-gray-200 dark:border-white/5 rounded-2xl flex items-center justify-center opacity-50">
                            <span className="text-sm">Add product to compare</span>
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}
