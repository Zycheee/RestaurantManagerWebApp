import React, { useEffect, useState } from "react";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const storedTransactions = JSON.parse(
      localStorage.getItem("transactionHistory") || "[]"
    );
    setTransactions(storedTransactions);
  }, []);

  const totalProfits = transactions.reduce(
    (sum, t) => sum + t.grandTotal,
    0
  );

  const handleClearAll = () => {
    localStorage.removeItem("transactionHistory");
    setTransactions([]);
  };

  return (
    <div className="p-8 bg-[#141D30] rounded-lg min-h-[400px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-white font-bold text-2xl">Transaction History</h2>
        {transactions.length > 0 && (
          <button
            onClick={handleClearAll}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Clear All Transactions
          </button>
        )}
      </div>

      {transactions.length === 0 ? (
        <p className="text-white/70 text-xl font-bold text-center flex-grow flex items-center justify-center">
          No transactions yet.
        </p>
      ) : (
        <>
          <div className="overflow-y-auto max-h-[400px] mb-6 border border-white/20 rounded">
            <table className="w-full text-white table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border border-white/20 px-3 py-2 text-left">Invoice ID</th>
                  <th className="border border-white/20 px-3 py-2 text-left">Table</th>
                  <th className="border border-white/20 px-3 py-2 text-left">Items</th>
                  <th className="border border-white/20 px-3 py-2 text-right">Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr key={t.invoiceId} className="border border-white/20">
                    <td className="border border-white/20 px-3 py-2">{t.invoiceId}</td>
                    <td className="border border-white/20 px-3 py-2">Table #{t.table}</td>
                    <td className="border border-white/20 px-3 py-2 max-w-xs break-words">
                      {t.items.map((item, idx) => (
                        <div key={idx}>
                          {item.name} x{item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="border border-white/20 px-3 py-2 text-right">
                      ₱{t.grandTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-white font-bold text-xl text-right">
            Total Profits: ₱{totalProfits.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
};

export default TransactionHistory;
