import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [planFilter, setPlanFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("expiry");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          planFilter={planFilter}
          onPlanFilterChange={setPlanFilter}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          onAddClick={() => setIsAddModalOpen(true)}
        />
        <KanbanBoard
          searchTerm={searchTerm}
          planFilter={planFilter}
          statusFilter={statusFilter}
          sortBy={sortBy}
          isAddModalOpen={isAddModalOpen}
          onCloseAddModal={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default App;