import React from "react";

const ItemOverviewContent = ({ items, gridTemplate, gridGap, handleEditItem, handleDeleteItem, setShowAddItemModal }) => {
  return (
    <>
      {/* Add Item Button */}
      <div className="flex justify-end items-center mb-6">
        <button 
          onClick={() => {
            setShowAddItemModal(true);
          }}
          className="px-6 py-3 bg-[#BF7000] text-white font-bold rounded-lg hover:bg-[#a66500] transition shadow-md whitespace-nowrap cursor-pointer"
        >
          + Add New Item
        </button>
      </div>
      
      <div className="bg-[#141D30] rounded-lg p-5">
        
        {/* Table Headers */}
        <div className={`grid ${gridTemplate} ${gridGap} mb-4 text-center border-b border-white/20 pb-3`}>
          <h1 className="text-lg font-bold text-white"></h1>
          <h2 className="text-lg font-bold font-[Arial] text-white whitespace-nowrap">Image</h2>
          <h3 className="text-lg font-bold font-[Arial] text-white whitespace-nowrap">Name</h3>
          <h4 className="text-lg font-bold font-[Arial] text-white">Quantity</h4>
          <h5 className="text-lg font-bold font-[Arial] text-white">Price (₱)</h5>
          <h6 className="text-lg font-bold font-[Arial] text-white">Status</h6>
          <h7 className="text-lg font-bold text-white">Action</h7>
        </div>

        {/* Item Rows */}
        <div className="overflow-y-auto max-h-[400px] space-y-2">
          {items.length === 0 ? (
            <p className="text-white/70 text-center py-5">
              No items in the inventory. Click "+ Add New Item" to begin.
            </p>
          ) : (
            items.map((item, idx) => (
              <div
                key={idx}
                className={`grid ${gridTemplate} ${gridGap} text-white text-base items-center text-center p-2 rounded hover:bg-[#1f2c45] transition`}
              >
                {/* 🗑️ Delete Icon */}
                <div
                  onClick={() => handleDeleteItem(idx)}
                  className="cursor-pointer text-red-500 hover:text-red-700 flex justify-center"
                  title="Delete Item"
                >
                  <span className="text-lg">🗑️</span>
                </div>

                {/* Item Image */}
                <div className="truncate text-white/80">{item.image?.name || "N/A"}</div>

                {/* Item Name */}
                <div className="truncate font-medium text-center">{item.name}</div>

                {/* Quantity */}
                <div className="font-mono">{item.quantity}</div>

                {/* Price */}
                <div className="font-mono font-bold">₱{item.price.toFixed(2)}</div>

                {/* Status Badge */}
                <div className="whitespace-nowrap flex justify-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.quantity > 0 && item.status
                      ? "bg-green-500 text-white" 
                      : "bg-red-500 text-white"
                  }`}>
                    {item.quantity > 0 && item.status ? "Available" : "Out of Stock"}
                  </span>
                </div>

                {/* ✍️ Edit Icon */}
                <div
                  onClick={() => handleEditItem(item, idx)}
                  className="cursor-pointer text-[#FCA311] hover:text-[#e0910e] flex justify-center"
                  title="Edit Item"
                >
                  <span className="text-lg">✏️</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ItemOverviewContent;