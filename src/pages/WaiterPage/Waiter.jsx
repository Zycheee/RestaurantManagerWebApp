import React, { useState, useEffect } from "react";
import Breakfast from "./components/Breakfast.jsx";
import Lunch from "./components/Lunch.jsx";
import Dinner from "./components/Dinner.jsx";

const Waiter = () => {
  const [category, setCategory] = useState("Breakfast");
  const [orders, setOrders] = useState([]);
  const [tableNumber, setTableNumber] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [notification, setNotification] = useState(""); // message
  const [showNotif, setShowNotif] = useState(false); // for animation

  // Show notification with animation
  const showNotification = (msg) => {
    setNotification(msg);
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 2000); // start fade out
    setTimeout(() => setNotification(""), 2500); // clear message
  };

  const handleAddOrder = (item, quantity) => {
    const exists = orders.find((o) => o.id === item.id);
    if (exists) {
      showNotification(`${item.name} is already in the cart!`);
      return;
    }
    setOrders([...orders, { ...item, quantity }]);
    showNotification(`${item.name} added to cart!`);
  };

  const handleRemoveItem = (id) => {
    setOrders(orders.filter((item) => item.id !== id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    setOrders(
      orders.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const handleConfirmOrder = () => {
    if (!tableNumber.trim()) {
      showNotification("Please enter a table number!");
      return;
    }
    if (isNaN(tableNumber)) {
      showNotification("Table number must be numeric!");
      return;
    }
    if (orders.length === 0) {
      showNotification("No items in the cart!");
      return;
    }
    setShowConfirmModal(true);
  };

  const finalizeOrder = () => {
  // Save the order to localStorage before clearing
    const savedOrders = JSON.parse(localStorage.getItem("kitchenOrders") || "[]");
    const newOrders = [...savedOrders, { table: tableNumber, items: orders }];
    localStorage.setItem("kitchenOrders", JSON.stringify(newOrders));

    setOrders([]);
    setTableNumber("");
    setShowConfirmModal(false);
    setCartOpen(false);
    showNotification("Order sent to kitchen!");
  };

  return (
    <div className="p-4 relative">
      {/* CATEGORY BUTTONS */}
      <div className="font-bold text-3xl">Meal Category</div>
      <div className="flex flex-row gap-4 mt-5 text-2xl font-semibold">
        {["Breakfast", "Lunch", "Dinner"].map((cat) => (
          <div
            key={cat}
            onClick={() => setCategory(cat)}
            className={`bg-[#223E7B] flex justify-center items-center h-10 w-full cursor-pointer rounded-[5px] transition-all duration-200 ${
              category === cat
                ? "bg-[#BF7000] text-white"
                : "hover:bg-[#BF7000]"
            }`}
          >
            {cat}
          </div>
        ))}
      </div>

      {/* SELECTED CATEGORY */}
      <div className="flex flex-row gap-5 mt-5 flex-wrap">
        {category === "Breakfast" && <Breakfast onAddOrder={handleAddOrder} />}
        {category === "Lunch" && <Lunch onAddOrder={handleAddOrder} />}
        {category === "Dinner" && <Dinner onAddOrder={handleAddOrder} />}
      </div>

      {/* VIEW ORDER BUTTON */}
      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-5 right-5 bg-[#BF7000] text-white px-4 py-2 rounded-md shadow-lg z-50 hover:bg-[#e07b1f] cursor-pointer transition-all duration-200"
      >
        View Order ({orders.length})
      </button>

      {/* CART MODAL */}
      {cartOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-[#212E4A] rounded-xl p-5 w-96 text-white shadow-lg max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">Your Order</h2>

            {orders.length === 0 && <p>No items in the cart.</p>}

            {orders.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between bg-[#1b2a42] p-2 rounded-md mb-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>₱{item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    className="bg-gray-600 px-2 font-bold flex justify-center rounded-md cursor-pointer hover:bg-gray-500"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    className="bg-gray-600 px-2 font-bold rounded-md cursor-pointer hover:bg-gray-500"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="bg-red-900 px-2 rounded-md ml-2 hover:bg-red-700 cursor-pointer"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}

            {/* TABLE INPUT */}
            <div className="mt-2 flex items-center gap-2">
              <label className="font-semibold">Table Number:</label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Input #"
                className="px-2 py-1 rounded-md text-black bg-white w-24 transition-all duration-200"
              />
            </div>

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setCartOpen(false)}
                className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleConfirmOrder}
                className="bg-[#BF7000] px-4 py-2 rounded-md hover:bg-[#e07b1f] cursor-pointer transition-all duration-200"
              >
                Confirm Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-[#212E4A] rounded-xl p-5 w-80 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-3">Confirm Order</h2>
            <p>Send the order to the kitchen for Table {tableNumber}?</p>
            <div className="flex justify-between mt-5">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="bg-gray-500 px-4 py-2 rounded-md hover:bg-gray-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => finalizeOrder()}
                className="bg-[#BF7000] px-4 py-2 rounded-md hover:bg-[#e07b1f] cursor-pointer"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM CENTER NOTIFICATION WITH ANIMATION */}
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
  );
};

export default Waiter;
