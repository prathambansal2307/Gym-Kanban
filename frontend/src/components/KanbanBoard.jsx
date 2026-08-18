import { useState, useEffect } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import KanbanColumn from "./KanbanColumn";
import SubscriberCard from "./SubscriberCard";
import SubscriberDetailsPanel from "./SubscriberDetailsPanel";
import AddSubscriberModal from "./AddSubscriberModal";
import { applyAutoStatus } from "../utils/statusUtils";
import {
  getSubscribers,
  createSubscriber,
  updateSubscriberStatus,
  deleteSubscriber,
} from "../services/subscriberService";


const statusColumns = [
  { key: "new", title: "New / Paid" },
  { key: "onboarding", title: "Onboarding" },
  { key: "active", title: "Active" },
  { key: "onhold", title: "On Hold / Frozen" },
  { key: "expiringsoon", title: "Expiring Soon" },
  { key: "renewaldue", title: "Renewal Due" },
  { key: "expired", title: "Expired" },
];

function KanbanBoard({
  searchTerm,
  planFilter,
  statusFilter,
  sortBy,
  isAddModalOpen,
  onCloseAddModal,
}) {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeSubscriber, setActiveSubscriber] = useState(null);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    loadSubscribers();
  }, []);

  async function loadSubscribers() {
    try {
      setLoading(true);
      setError("");
      const data = await getSubscribers();
      setSubscribers(applyAutoStatus(data));
    } catch (err) {
      setError("Failed to load subscribers. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSubscriber(id) {
  const previousSubscribers = subscribers;

  setSubscribers((prev) => prev.filter((subscriber) => subscriber._id !== id));
  handleClosePanel();

  try {
    await deleteSubscriber(id);
  } catch (err) {
    setSubscribers(previousSubscribers);
    setError("Failed to delete subscriber. Please try again.");
  }
}

  function handleView(subscriber) {
    setSelectedSubscriberId(subscriber._id);
    setPendingStatus(subscriber.status);
  }

  function handleClosePanel() {
    setSelectedSubscriberId(null);
    setPendingStatus(null);
  }

  async function handleSaveStatus() {
    const previousSubscribers = subscribers;

    setSubscribers((prev) =>
      prev.map((subscriber) =>
        subscriber._id === selectedSubscriberId
          ? { ...subscriber, status: pendingStatus }
          : subscriber
      )
    );

    try {
      await updateSubscriberStatus(selectedSubscriberId, pendingStatus);
    } catch (err) {
      setSubscribers(previousSubscribers);
      setError("Failed to update status. Please try again.");
    }
  }

  async function handleAddSubscriber(formData) {
    const created = await createSubscriber(formData);
    setSubscribers((prev) => [...prev, created]);
    onCloseAddModal();
  }

  function handleDragStart(event) {
    const subscriber = subscribers.find((s) => s._id === event.active.id);
    setActiveSubscriber(subscriber);
  }

  async function handleDragEnd(event) {
    const { active, over } = event;
    setActiveSubscriber(null);

    if (!over) return;

    const subscriberId = active.id;
    const newStatus = over.id;
    const previousSubscribers = subscribers;

    setSubscribers((prev) =>
      prev.map((subscriber) =>
        subscriber._id === subscriberId
          ? { ...subscriber, status: newStatus }
          : subscriber
      )
    );

    try {
      await updateSubscriberStatus(subscriberId, newStatus);
    } catch (err) {
      setSubscribers(previousSubscribers);
      setError("Failed to update status. Please try again.");
    }
  }

  let filteredSubscribers = subscribers.filter((subscriber) => {
    const matchesSearch = subscriber.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesPlan =
      planFilter === "all" || subscriber.membershipPlan === planFilter;

    const matchesStatus =
      statusFilter === "all" || subscriber.status === statusFilter;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  filteredSubscribers = [...filteredSubscribers].sort((a, b) => {
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return new Date(a.expiryDate) - new Date(b.expiryDate);
  });

  const selectedSubscriber = subscribers.find(
    (subscriber) => subscriber._id === selectedSubscriberId
  );

  if (loading) {
    return <p className="p-6 text-sm text-gray-500">Loading subscribers...</p>;
  }

  if (error && subscribers.length === 0) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600 mb-3">{error}</p>
        <button
          onClick={loadSubscribers}
          className="text-sm text-blue-600 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {error && (
        <div className="mx-4 mt-4 text-sm text-red-700 bg-red-100 px-3 py-2 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex">
        <div className="flex gap-3 overflow-x-auto p-4 h-[calc(100vh-140px)] flex-1">
          {statusColumns.map((column) => {
            const columnSubscribers = filteredSubscribers.filter(
              (subscriber) => subscriber.status === column.key
            );

            return (
              <KanbanColumn
                key={column.key}
                id={column.key}
                title={column.title}
                count={columnSubscribers.length}
                subscribers={columnSubscribers}
                onView={handleView}
              />
            );
          })}
        </div>

        <SubscriberDetailsPanel
          subscriber={selectedSubscriber}
          pendingStatus={pendingStatus}
          onStatusChange={setPendingStatus}
          onSave={handleSaveStatus}
          onClose={handleClosePanel}
          onDelete={handleDeleteSubscriber}

        />
      </div>

      <DragOverlay>
        {activeSubscriber ? (
          <div className="w-72">
            <SubscriberCard subscriber={activeSubscriber} />
          </div>
        ) : null}
      </DragOverlay>

      {isAddModalOpen && (
        <AddSubscriberModal
          onAdd={handleAddSubscriber}
          onClose={onCloseAddModal}
        />
      )}
    </DndContext>
  );
}

export default KanbanBoard;