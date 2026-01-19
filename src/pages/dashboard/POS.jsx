import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { ShoppingCart, Trash2, Printer, DollarSign } from 'lucide-react';
import toast from 'react-hot-toast';

// Quick-Add Items for the Concession Stand
const MENU_ITEMS = [
  { id: 1, name: "Soda (Can)", price: 1.00, color: "bg-blue-600" },
  { id: 2, name: "Water", price: 1.00, color: "bg-blue-400" },
  { id: 3, name: "Candy Bar", price: 1.50, color: "bg-orange-500" },
  { id: 4, name: "Chips", price: 1.00, color: "bg-yellow-500" },
  { id: 5, name: "Nachos", price: 3.00, color: "bg-yellow-600" },
  { id: 6, name: "Hot Dog", price: 2.00, color: "bg-red-600" },
  { id: 7, name: "Slice of Pizza", price: 2.50, color: "bg-red-700" },
  { id: 8, name: "Gamer Fuel (Energy)", price: 3.50, color: "bg-purple-600" },
  { id: 9, name: "Admission Ticket", price: 5.00, color: "bg-brand-red" },
];

const POS = () => {
  const { currentUser } = useAuth();
  const [cart, setCart] = useState([]);
  const [processing, setProcessing] = useState(false);

  // 1. Add Item
  const addItem = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  // 2. Remove Item
  const removeItem = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  // 3. Calculate Totals
  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  // 4. Checkout & Print
  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setProcessing(true);

    try {
      // Step A: Print Receipt (Triggers Browser Print Dialog)
      window.print();

      // Step B: Log to Financials Database automatically
      await addDoc(collection(db, "financials"), {
        type: 'incoming',
        category: 'Concessions',
        description: `POS Sale: ${cart.length} items`,
        amount: total,
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date(),
        cashier: currentUser.email
      });

      toast.success("Sale Recorded!");
      setCart([]); // Clear cart for next customer
    } catch (error) {
      console.error("POS Error:", error);
      toast.error("Failed to record sale.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-140px)] gap-6">
      
      {/* LEFT: MENU GRID */}
      <div className="flex-1 bg-[#111] border border-brand-grey/20 rounded-xl p-6 overflow-y-auto print:hidden">
        <h2 className="font-titles text-2xl text-white mb-4 flex items-center gap-2">
          <DollarSign className="text-brand-green" /> CONCESSIONS MENU
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => addItem(item)}
              className={`${item.color} h-32 rounded-xl flex flex-col items-center justify-center p-4 hover:brightness-110 active:scale-95 transition shadow-lg group`}
            >
              <span className="font-titles text-xl text-white drop-shadow-md text-center">{item.name}</span>
              <span className="font-bold text-white/90 bg-black/20 px-3 py-1 rounded-full mt-2">
                ${item.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: REGISTER / RECEIPT */}
      <div className="w-full md:w-96 bg-brand-black border border-brand-grey/20 rounded-xl flex flex-col shadow-2xl overflow-hidden print:w-full print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Receipt Header */}
        <div className="p-6 bg-brand-red text-white text-center print:bg-transparent print:text-black print:p-0 print:mb-4">
          <h2 className="font-titles text-2xl">MJHS ESPORTS</h2>
          <p className="text-sm opacity-80 print:hidden">Current Order</p>
          <p className="hidden print:block text-xs uppercase">Thank you for your support!</p>
        </div>

        {/* Order Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 print:overflow-visible">
          {cart.length === 0 ? (
             <div className="text-center text-brand-grey py-10 print:hidden">Register Empty</div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-brand-grey/10 pb-2 print:border-black/10">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-brand-grey/20 rounded-full flex items-center justify-center text-xs font-bold print:border print:border-black">
                    {item.qty}
                  </div>
                  <span className="font-bold text-white print:text-black">{item.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-white print:text-black">${(item.price * item.qty).toFixed(2)}</span>
                  <button onClick={() => removeItem(item.id)} className="text-brand-red hover:text-white print:hidden">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#111] border-t border-brand-grey/20 print:bg-transparent print:border-t-2 print:border-black">
          <div className="flex justify-between items-end mb-6">
            <span className="text-brand-grey print:text-black">TOTAL</span>
            <span className="font-titles text-4xl text-brand-green print:text-black">${total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            disabled={cart.length === 0 || processing}
            className="w-full bg-brand-green text-white font-titles py-4 rounded-xl hover:bg-green-600 transition flex justify-center items-center gap-2 print:hidden"
          >
             <Printer size={24} /> {processing ? 'PRINTING...' : 'CASH & PRINT'}
          </button>
        </div>

      </div>

      {/* HIDDEN PRINT STYLES */}
      <style>{`
        @media print {
          /* Hide everything except the receipt column */
          body * {
            visibility: hidden;
          }
          /* Target the specific receipt container logic */
          .print\\:block, .print\\:w-full, .print\\:text-black, .print\\:bg-white {
            visibility: visible !important;
          }
          /* Reset position for the receipt to be top-left of paper */
          .print\\:w-full {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          /* Hide Menu & Sidebar elements */
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
};

export default POS;