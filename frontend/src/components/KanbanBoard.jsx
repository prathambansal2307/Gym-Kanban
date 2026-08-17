import { useState } from "react";
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
import mockSubscribers from "../data/mockSubscribers";
import { applyAutoStatus } from "../utils/statusUtils";
import SubscriberDetailsPanel from "./SubscriberDetailsPanel";

const statusColumns = [
  { key: "new", title: "New / Paid" },
  { key: "onboarding", title: "Onboarding" },
  { key: "active", title: "Active" },
  { key: "onhold", title: "On Hold / Frozen" },
  { key: "expiringsoon", title: "Expiring Soon" },
  { key: "renewaldue", title: "Renewal Due" },
  { key: "expired", title: "Expired" },
];

function KanbanBoard({ searchTerm, planFilter, statusFilter, sortBy }) {
  const [subscribers, setSubscribers] = useState(() =>
    applyAutoStatus(mockSubscribers)
  );
  const [activeSubscriber, setActiveSubscriber] = useState(null);
  const [selectedSubscriberId, setSelectedSubscriberId] = useState(null);
  const [pendingStatus, setPendingStatus] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  function handleView(subscriber) {
  setSelectedSubscriberId(subscriber._id);
  setPendingStatus(subscriber.status);
}

function handleClosePanel() {
  setSelectedSubscriberId(null);
  setPendingStatus(null);
}

function handleSaveStatus() {
  setSubscribers((prev) =>
    prev.map((subscriber) =>
      subscriber._id === selectedSubscriberId
        ? { ...subscriber, status: pendingStatus }
        : subscriber
    )
  );
}

  function handleDragStart(event) {
    const subscriber = subscribers.find((s) => s._id === event.active.id);
    setActiveSubscriber(subscriber);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveSubscriber(null);

    if (!over) return;

    const subscriberId = active.id;
    const newStatus = over.id;

    setSubscribers((prev) =>
      prev.map((subscriber) =>
        subscriber._id === subscriberId
          ? { ...subscriber, status: newStatus }
          : subscriber
      )
    );
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

  return (
  <DndContext
    sensors={sensors}
    collisionDetection={closestCorners}
    onDragStart={handleDragStart}
    onDragEnd={handleDragEnd}
  >
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
      />
    </div>

    <DragOverlay>
      {activeSubscriber ? (
        <div className="w-72">
          <SubscriberCard subscriber={activeSubscriber} />
        </div>
      ) : null}
    </DragOverlay>
  </DndContext>
);
}

export default KanbanBoard;