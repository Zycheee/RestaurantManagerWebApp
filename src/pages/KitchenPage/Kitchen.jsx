import React, { useState, useEffect } from "react";
import RoleLayout from "../../components/RoleLayout";

function Kitchen() {
  const [active, setActive] = React.useState("Kitchen");
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [notification, setNotification] = useState("");
  const [showNotif, setShowNotif] = useState(false);

  const showNotification = (msg) => {
    setNotification(msg);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2000);
    setTimeout(() => setNotification(""), 2500);
  };

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("kitchenOrders") || "[]");
    setKitchenOrders(savedOrders);
  }, []);

  const handleFinishOrder = (index) => {
  // 1. Get existing cashier orders
    const cashierOrders =
      JSON.parse(localStorage.getItem("cashierOrders")) || [];

    // 2. Move selected order
    const finishedOrder = kitchenOrders[index];

    // 3. Save to cashier
    localStorage.setItem(
      "cashierOrders",
      JSON.stringify([...cashierOrders, finishedOrder])
    );

    // 4. Remove from kitchen
    const updatedKitchenOrders = kitchenOrders.filter(
      (_, i) => i !== index
    );

    setKitchenOrders(updatedKitchenOrders);

    // 5. Update localStorage
    localStorage.setItem(
      "kitchenOrders",
      JSON.stringify(updatedKitchenOrders)
    );
    showNotification("Order is Finished! Please proceed to Cashier.");
  };

  return (
    <RoleLayout activeRole={active} onRoleChange={setActive}>
      <div className="w-full max-w-[90vw] md:max-w-[1580px] min-h-[600px] bg-[#212E4A] rounded-lg shadow-lg mt-10">
        <h1 className="px-7 py-7 md:text-2xl font-bold font-[Arial] text-white">
          Order Line
        </h1>

        {kitchenOrders.length === 0 ? (
          <p className="text-white px-7 text-center font-bold">No orders yet.</p>
        ) : (
          /* --- Grid Container for Multi-Column Display --- */
          <div className="px-7 pb-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {kitchenOrders.map((order, idx) => (
              /* --- Order Card --- */
              <div
                key={idx}
                className="bg-[#18233A] rounded-lg p-5 text-white shadow-md hover:shadow-xl transition duration-300 w-full"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold font-[Arial]">
                    Table #{order.table}
                  </h2>
                  
                  <button 
                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1 rounded-md transition duration-200 cursor-pointer"
                    onClick={() => handleFinishOrder(idx)}
                  >
                    Finish Order
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-4 text-white font-medium text-sm border-b border-white/10 pb-2">
                  <span className="col-span-2">Name of food</span>
                  <span className="text-right">Quantity</span>
                </div>

                <div className="mt-3 space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 bg-black/50 text-white p-2 rounded-md h-8 flex items-center overflow-hidden">
                        <span className="truncate text-sm">{item.name}</span>
                      </div>
                      
                      <div className="bg-black/50 text-white p-2 rounded-md h-8 flex items-center justify-end">
                        <span className="text-sm">{item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>      
              </div>
            ))}
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

export default Kitchen;