import React from "react";
import RoleLayout from "../../components/RoleLayout"; 
import AddItemModal from "../../components/AddItemModal"; 
import ItemOverviewContent from "./components/ItemOverviewContent";
import TransactionHistory from "./components/TransactionHistory";


function Manager() {
  const [active, setActive] = React.useState("Manager");
  const [activeTab, setActiveTab] = React.useState("Items"); 
  const [showAddItemModal, setShowAddItemModal] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState(null);
  const [editingIndex, setEditingIndex] = React.useState(null);
  const [items, setItems] = React.useState(() => {
    const saved = localStorage.getItem("managerItems");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("managerItems", JSON.stringify(items));
  }, [items]);

  // --- CRUD Handlers (Keep these in the parent for state management) ---
  const handleSaveItem = (itemData) => {
    let dataToSave = { ...itemData };
    if (dataToSave.image && dataToSave.image instanceof File) {
        dataToSave.image = { name: dataToSave.image.name };
    }

    if (editingIndex !== null) {
      setItems((prev) =>
        prev.map((item, idx) => (idx === editingIndex ? dataToSave : item))
      );
    } else {
      setItems((prev) => [...prev, dataToSave]);
    }

    setShowAddItemModal(false);
    setEditingItem(null);
    setEditingIndex(null);
  };

  const handleEditItem = (item, index) => {
    setEditingItem(item);
    setEditingIndex(index);
    setShowAddItemModal(true);
  };

  const handleDeleteItem = (index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setItems((prev) => prev.filter((_, idx) => idx !== index));
    }
  };

  const gridTemplate = "grid-cols-[20px_repeat(5,1fr)_60px]";
  const gridGap = "gap-x-9";

  // --- Tab Button Component ---
  const TabButton = ({ name }) => (
      <button
          onClick={() => setActiveTab(name)}
          className={`px-6 py-2 md:text-xl font-bold transition-colors duration-200 border-b-4 
              ${activeTab === name 
                  ? "text-white border-[#BF7000]" 
                  : "text-white/50 border-transparent hover:border-white/20" 
              }`
          }
      >
          {name}
      </button>
  );

  return (
    <RoleLayout activeRole={active} onRoleChange={setActive}>
      <div className="w-full max-w-[90vw] md:max-w-[1580px] min-h-[600px] bg-[#212E4A] rounded-lg shadow-lg mt-10 p-7">
        
        {/* --- Tab Navigation Bar --- */}
        <div className="mb-8 border-b border-white/10 flex space-x-6">
            <TabButton name="Items" />
            <TabButton name="Transactions" />
        </div>
        
        {/* --- Content Area (Conditional Rendering) --- */}
        <div className="mt-8">
            {activeTab === "Items" && (
                <ItemOverviewContent 
                    items={items}
                    gridTemplate={gridTemplate}
                    gridGap={gridGap}
                    handleEditItem={handleEditItem}
                    handleDeleteItem={handleDeleteItem}
                    setShowAddItemModal={setShowAddItemModal}
                />
            )}
            {activeTab === "Transactions" && <TransactionHistory />}
        </div>
        
      </div>
      <AddItemModal 
          isOpen={showAddItemModal} 
          onClose={() => {
            setShowAddItemModal(false);
            setEditingItem(null); 
            setEditingIndex(null);
          }} 
          onSubmit={handleSaveItem} 
          initialData={editingItem} 
      />
    </RoleLayout>
  );
}

export default Manager;