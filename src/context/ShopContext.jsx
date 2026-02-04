import { createContext, useContext, useState, useEffect } from "react";

const ShopContext = createContext({
    cart: [],
    compareList: [],
    addToCart: () => { },
    removeFromCart: () => { },
    addToCompare: () => { },
    removeFromCompare: () => { },
    isCartOpen: false,
    toggleCart: () => { },
});

export function ShopProvider({ children }) {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem("cart");
        return saved ? JSON.parse(saved) : [];
    });

    const [compareList, setCompareList] = useState(() => {
        const saved = localStorage.getItem("compare");
        return saved ? JSON.parse(saved) : [];
    });

    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem("compare", JSON.stringify(compareList));
    }, [compareList]);

    const addToCart = (product) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.code === product.code);
            if (existing) {
                return prev.map((item) =>
                    item.code === product.code ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (productCode) => {
        setCart((prev) => prev.filter((item) => item.code !== productCode));
    };

    const addToCompare = (product) => {
        if (compareList.length >= 3) {
            alert("You can only compare up to 3 products.");
            return;
        }
        if (compareList.find((p) => p.code === product.code)) return;
        setCompareList((prev) => [...prev, product]);
    };

    const removeFromCompare = (productCode) => {
        setCompareList((prev) => prev.filter((p) => p.code !== productCode));
    };

    const decreaseQuantity = (productCode) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.code === productCode);
            if (existing && existing.quantity > 1) {
                return prev.map((item) =>
                    item.code === productCode ? { ...item, quantity: item.quantity - 1 } : item
                );
            }
            // Optional: Remove if quantity becomes 0?
            // The plan said "if quantity becomes 0, remove item".
            // So if quantity is 1 and we decrease, we filter it out.
            return prev.filter((item) => item.code !== productCode);
        });
    };

    const toggleCart = () => setIsCartOpen((prev) => !prev);

    const value = {
        cart,
        compareList,
        addToCart,
        decreaseQuantity,
        removeFromCart,
        addToCompare,
        removeFromCompare,
        isCartOpen,
        toggleCart,
    };

    return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => {
    const context = useContext(ShopContext);
    if (context === undefined)
        throw new Error("useShop must be used within a ShopProvider");
    return context;
};
