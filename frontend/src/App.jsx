import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import PlansPage from "./pages/PlansPage";
import TrainersPage from "./pages/TrainersPage";
import PaymentsPage from "./pages/PaymentsPage";

function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/plans" element={<PlansPage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;