import React, { useEffect, useState } from "react";
import RoleLayout from "../../components/RoleLayout";

function Cashier() {
  const [active, setActive] = React.useState("Cashier");
  const [cashierOrders, setCashierOrders] = useState([]);
  const [notification, setNotification] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const handleCloseReceipt = (index) => {
    const closedOrder = cashierOrders[index];
    const updatedOrders = cashierOrders.filter((_, i) => i !== index);
    setCashierOrders(updatedOrders);
    localStorage.setItem("cashierOrders", JSON.stringify(updatedOrders));
    showNotification("Receipt closed successfully!");

    const subtotal = calculateSubtotal(closedOrder.items);
    const vat = subtotal * VAT_RATE;
    const grandTotal = subtotal + vat;
    const transactionHistory = JSON.parse(localStorage.getItem("transactionHistory") || "[]");

    let newInvoiceId = "00001";
    if (transactionHistory.length > 0) {
      const lastId = transactionHistory[transactionHistory.length - 1].invoiceId;
      newInvoiceId = String(Number(lastId) + 1).padStart(5, "0");
    }

    const newTransaction = {
      invoiceId: newInvoiceId,
      table: closedOrder.table,
      items: closedOrder.items,
      grandTotal,
    };

    localStorage.setItem(
      "transactionHistory",
      JSON.stringify([...transactionHistory, newTransaction])
    );
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("cashierOrders") || "[]");
    setCashierOrders(saved);
  }, []);

  const calculateSubtotal = (items) =>
    items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const VAT_RATE = 0.12;

  const showNotification = (msg) => {
    setNotification(msg);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2000);
    setTimeout(() => setNotification(""), 2500);
  };

  return (
    <RoleLayout activeRole={active} onRoleChange={setActive}>
      <div className="w-full max-w-[90vw] md:max-w-[1580px] min-h-[600px] bg-[#212E4A] rounded-lg shadow-lg mt-10">
        <h1 className="px-7 py-7 md:text-2xl font-bold font-[Arial] text-white">
          Cashier Orders Overview
        </h1>

        {cashierOrders.length === 0 ? (
          <p className="text-white px-7 text-center font-bold">
            No orders to process.
          </p>
        ) : (
          <div className="px-7 pb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {cashierOrders.map((order, idx) => {
              const subtotal = calculateSubtotal(order.items);
              const vat = subtotal * VAT_RATE;
              const total = subtotal + vat;

              return (
                <div
                  key={idx}
                  className="bg-[#18233A] rounded-lg p-5 text-white shadow-md w-full"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                      Table #{order.table}
                    </h2>

                    <button
                      onClick={() => handleCloseReceipt(idx)}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-md transition cursor-pointer"
                    >
                      Close Receipt
                    </button>
                  </div>

                  {/* Header */}
                  <div className="grid grid-cols-4 gap-2 text-sm font-semibold border-b border-white/10 pb-2">
                    <span className="col-span-2">Item</span>
                    <span className="text-right">Qty</span>
                    <span className="text-right">Price</span>
                  </div>

                  {/* Items */}
                  <div className="mt-3 space-y-2">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="grid grid-cols-4 gap-2 text-sm"
                      >
                        <span className="col-span-2 truncate">
                          {item.name}
                        </span>
                        <span className="text-right">
                          {item.quantity}
                        </span>
                        <span className="text-right">
                          ₱{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="mt-4 border-t border-white/10 pt-3 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₱{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>VAT (12%)</span>
                      <span>₱{vat.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-base border-t border-white/10 pt-2">
                      <span>Total</span>
                      <span>₱{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {notification && (
        <div
          className={`fixed bottom-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-md shadow-lg z-50
          transition-all duration-500 transform ${
            showNotif ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {notification}
        </div>
      )}
      </div>
    </RoleLayout>
  );
}

export default Cashier;
