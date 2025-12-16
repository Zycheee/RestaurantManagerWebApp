import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Waiter from "./pages/WaiterPage/Waiter.jsx";
import Manager from "./pages/ManagerPage/Manager.jsx";
import Kitchen from "./pages/KitchenPage/Kitchen.jsx";
import Cashier from "./pages/CashierPage/Cashier.jsx";
function App() {
  return (
    <div className="bg-[#101e3c]">
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/manager"/>} />

          <Route path="/manager" element={<Manager />} />
          <Route path="/waiter" element={<Waiter />} />
          <Route path="/kitchen" element={<Kitchen />} />
          <Route path="/cashier" element={<Cashier />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;