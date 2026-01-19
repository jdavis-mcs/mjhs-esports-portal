import { useState } from 'react';
import { ShoppingCart, X, Plus, Minus, CreditCard } from 'lucide-react';

// MOCK DATA (In the future, you fetch this from your 'products' collection)
const MOCK_PRODUCTS = [
  { id: 1, name: "MJHS Official Jersey", price: 45.00, image: "https://placehold.co/400x400/B00C1A/white?text=Jersey", category: "Apparel" },
  { id: 2, name: "Esports Hoodie", price: 35.00, image: "https://placehold.co/400x400/111/white?text=Hoodie", category: "Apparel" },
  { id: 3, name: "Performance Mousepad", price: 20.00, image: "https://placehold.co/400x400/333/white?text=Mousepad", category: "Gear" },
  { id: 4, name: "Team Snapback", price: 25.00, image: "https://placehold.co/400x400/A6464D/white?text=Hat", category: "Apparel" },
];

const Store = () => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cart Logic
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true); // Auto open cart
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="relative h-full">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-brand-grey/20 pb-4 mb-6">
        <div>
          <h2 className="font-titles text-3xl text-brand-white">TEAM STORE</h2>
          <p className="text-brand-grey text-sm">Support the team with official merch</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative bg-brand-white text-brand-black px-4 py-2 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2"
        >
          <ShoppingCart size={20} /> CART
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full border border-brand-black">
              {cart.reduce((a,c) => a + c.qty, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {MOCK_PRODUCTS.map(product => (
          <div key={product.id} className="bg-[#111] border border-brand-grey/20 rounded-xl overflow-hidden group hover:border-brand-red/50 transition">
            <div className="aspect-square bg-brand-black relative overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
              />
              <div className="absolute top-2 right-2 bg-brand-black/80 text-white text-xs px-2 py-1 rounded border border-brand-grey/30">
                {product.category}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-titles text-lg text-white truncate">{product.name}</h3>
              <div className="flex justify-between items-center mt-2">
                <span className="text-brand-yellow font-titles text-xl">${product.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-brand-red text-white p-2 rounded hover:bg-brand-darkRed transition"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-out Cart Sidebar */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-[#0a0a0a] border-l border-brand-grey/30 z-50 shadow-2xl flex flex-col animate-slide-in-right">
            
            <div className="p-6 border-b border-brand-grey/20 flex justify-between items-center bg-brand-red">
              <h2 className="font-titles text-xl text-white flex items-center gap-2">
                <ShoppingCart size={20} /> YOUR CART
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="text-white hover:text-black">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-brand-grey mt-10">Your cart is empty.</div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 bg-[#111] p-3 rounded border border-brand-grey/20">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded object-cover bg-brand-black" />
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-sm">{item.name}</h4>
                      <p className="text-brand-yellow text-sm">${(item.price * item.qty).toFixed(2)}</p>
                      
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQty(item.id, -1)} className="p-1 bg-brand-grey/20 text-white rounded hover:bg-brand-grey/40"><Minus size={12} /></button>
                        <span className="text-xs text-brand-grey">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-1 bg-brand-grey/20 text-white rounded hover:bg-brand-grey/40"><Plus size={12} /></button>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-brand-grey hover:text-brand-red self-start">
                      <X size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t border-brand-grey/20 bg-[#111]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-brand-grey">Subtotal</span>
                <span className="font-titles text-2xl text-white">${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full bg-brand-green text-white font-titles py-4 rounded hover:bg-green-600 transition flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => alert("Stripe Integration requires Backend Cloud Functions. This is a UI Demo.")}
              >
                <CreditCard size={20} /> CHECKOUT NOW
              </button>
            </div>

          </div>
        </>
      )}

    </div>
  );
};

export default Store;