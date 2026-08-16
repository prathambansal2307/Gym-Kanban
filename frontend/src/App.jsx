import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-gray-800">Main content goes here</h1>
      </div>
    </div>
  );
}

export default App;