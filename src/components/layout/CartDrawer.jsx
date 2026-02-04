import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export function CartDrawer() {
    const { isCartOpen, toggleCart, cart, addToCart, decreaseQuantity, removeFromCart } = useShop();

    // Simple remove logic (completely remove) vs decrease quantity
    // Context currently supports addToCart (inc) and removeFromCart (complete remove)
    // Let's stick to context for now

    const totalPrice = cart.reduce((acc, item) =>
        // Assuming price is mocked or null since OpenFoodFacts doesn't have prices
        // We will assume a mock price of $5.00 if missing
        acc + (item.quantity * 5.00), 0
    );

    return (
        <AnimatePresence>
            {isCartOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleCart}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-white/10 z-50 shadow-2xl flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
                            <h2 className="text-xl font-bold">Your Pantry</h2>
                            <button onClick={toggleCart} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground opacity-60">
                                    <ShoppingCart size={48} className="mb-4" />
                                    <p>Your pantry is empty.</p>
                                    <p className="text-sm">Start exploring food!</p>
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div key={item.code} className="flex gap-4 p-3 rounded-xl bg-gray-50 border border-transparent hover:border-primary/50 transition-colors">
                                        <img
                                            src={item.image_small_url || item.image_url || 'https://placehold.co/100?text=No+Image'}
                                            alt={item.product_name}
                                            className="w-20 h-20 object-contain bg-white rounded-lg p-1"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold truncate">{item.product_name}</h3>
                                            <p className="text-sm text-gray-500 truncate">{item.brands}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <div className="flex items-center gap-2 bg-gray-200 rounded-lg p-1">
                                                    <button
                                                        onClick={() => decreaseQuantity(item.code)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-primary transition-colors"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => addToCart(item)}
                                                        className="w-6 h-6 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-primary transition-colors"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <span className="text-sm font-medium text-primary">$ {(item.quantity * 5).toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeFromCart(item.code)}
                                            className="text-red-400 hover:text-red-500 p-2"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/20">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-lg font-medium">Total (Mock)</span>
                                <span className="text-2xl font-bold text-primary">${totalPrice.toFixed(2)}</span>
                            </div>
                            <button
                                disabled={cart.length === 0}
                                className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Checkout
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
