import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Building2 } from 'lucide-react';
import Spinner from '../../components/ui/Spinner';

const Financials = () => {
  const { userRole } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'incoming', // or 'outgoing'
    category: 'Sponsorship', // Dues, Equipment, Concessions, etc.
    date: new Date().toISOString().split('T')[0]
  });

  // 1. Fetch Transactions & Listen for Updates
  useEffect(() => {
    const q = query(collection(db, "financials"), orderBy("date", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTransactions(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. Calculate Totals
  const totalBalance = transactions.reduce((acc, curr) => {
    return curr.type === 'incoming' ? acc + Number(curr.amount) : acc - Number(curr.amount);
  }, 0);

  const totalIncome = transactions
    .filter(t => t.type === 'incoming')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'outgoing')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  // 3. Handle Add Transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.description || !formData.amount) return;

    try {
      await addDoc(collection(db, "financials"), {
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date()
      });
      setShowForm(false);
      setFormData({ description: '', amount: '', type: 'incoming', category: 'Sponsorship', date: new Date().toISOString().split('T')[0] });
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // 4. Handle Delete (Admin Only)
  const handleDelete = async (id) => {
    if (confirm("Delete this transaction record?")) {
      await deleteDoc(doc(db, "financials", id));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-end border-b border-brand-grey/20 pb-4">
        <div>
          <h2 className="font-titles text-3xl text-brand-white">FINANCIAL LEDGER</h2>
          <p className="text-brand-grey text-sm">Track team funds, sponsorships, and expenses</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-brand-red text-white px-4 py-2 rounded font-bold hover:bg-brand-darkRed transition flex items-center gap-2"
        >
          {showForm ? 'CANCEL' : 'ADD ENTRY'} <Plus size={20} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111] p-6 rounded-xl border border-brand-grey/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-grey text-xs font-bold uppercase">Current Balance</p>
              <h3 className={`font-titles text-3xl mt-1 ${totalBalance >= 0 ? 'text-brand-green' : 'text-brand-red'}`}>
                ${totalBalance.toFixed(2)}
              </h3>
            </div>
            <div className="p-3 bg-brand-grey/10 rounded-full text-brand-white"><DollarSign size={24} /></div>
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-brand-grey/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-grey text-xs font-bold uppercase">Total Income</p>
              <h3 className="font-titles text-3xl mt-1 text-brand-yellow">+${totalIncome.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-brand-yellow/10 rounded-full text-brand-yellow"><TrendingUp size={24} /></div>
          </div>
        </div>

        <div className="bg-[#111] p-6 rounded-xl border border-brand-grey/20">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-grey text-xs font-bold uppercase">Total Expenses</p>
              <h3 className="font-titles text-3xl mt-1 text-brand-red">-${totalExpenses.toFixed(2)}</h3>
            </div>
            <div className="p-3 bg-brand-red/10 rounded-full text-brand-red"><TrendingDown size={24} /></div>
          </div>
        </div>
      </div>

      {/* Transaction Form */}
      {showForm && (
        <div className="bg-[#111] p-6 rounded-xl border border-brand-grey/30 animate-fade-in">
          <h3 className="font-titles text-xl mb-4 text-brand-white">NEW TRANSACTION</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              type="text" placeholder="Description (e.g., Check from El Nopal)" 
              className="md:col-span-2 bg-brand-black border border-brand-grey/30 p-3 rounded text-white"
              value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
            />
            <div className="flex gap-4">
               <select 
                className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white flex-1"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
              >
                <option value="incoming">Incoming (+ Credit)</option>
                <option value="outgoing">Outgoing (- Debit)</option>
              </select>
              <input 
                type="number" step="0.01" placeholder="Amount" 
                className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white flex-1"
                value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})}
              />
            </div>
            <div className="flex gap-4">
              <select 
                className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white flex-1"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Sponsorship">Sponsorship</option>
                <option value="Player Dues">Player Dues</option>
                <option value="Equipment">Equipment</option>
                <option value="Concessions">Concessions</option>
                <option value="Merch">Merchandise</option>
                <option value="Travel">Travel/Bus</option>
                <option value="Other">Other</option>
              </select>
              <input 
                type="date" 
                className="bg-brand-black border border-brand-grey/30 p-3 rounded text-white flex-1"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <button className="md:col-span-2 bg-brand-green text-white font-bold p-3 rounded hover:bg-green-600 transition">
              LOG TRANSACTION
            </button>
          </form>
        </div>
      )}

      {/* Ledger Table */}
      <div className="bg-brand-black border border-brand-grey/20 rounded-xl overflow-hidden">
        {loading ? <div className="p-8"><Spinner /></div> : (
          <table className="w-full text-left">
            <thead className="bg-[#111] text-brand-grey text-xs uppercase font-bold border-b border-brand-grey/20">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-grey/10 text-sm text-brand-white">
              {transactions.map(t => (
                <tr key={t.id} className="hover:bg-white/5 transition">
                  <td className="p-4 text-brand-grey">{t.date}</td>
                  <td className="p-4 font-bold">{t.description}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 rounded-full text-[10px] bg-brand-grey/10 border border-brand-grey/20 text-brand-grey uppercase">
                      {t.category}
                    </span>
                  </td>
                  <td className={`p-4 text-right font-titles text-lg ${t.type === 'incoming' ? 'text-brand-green' : 'text-brand-red'}`}>
                    {t.type === 'incoming' ? '+' : '-'}${Number(t.amount).toFixed(2)}
                  </td>
                  <td className="p-4 text-center">
                    {(userRole === 'admin') && (
                      <button onClick={() => handleDelete(t.id)} className="text-brand-grey hover:text-brand-red">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {transactions.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-brand-grey italic">No transactions recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

    </div>
  );
};

export default Financials;