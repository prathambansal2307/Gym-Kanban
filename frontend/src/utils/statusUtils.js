export function getDaysRemaining(expiryDate) {
  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry - today;
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
}

const EXPIRING_SOON_THRESHOLD = 7;

const PRE_ATTENTION_STATUSES = ["new", "onboarding", "active", "onhold"];

export function applyAutoStatus(subscribersList) {
  return subscribersList.map((subscriber) => {
    const daysRemaining = getDaysRemaining(subscriber.expiryDate);

    if (!PRE_ATTENTION_STATUSES.includes(subscriber.status)) {
      return subscriber;
    }

    if (daysRemaining < 0) {
      return { ...subscriber, status: "expired" };
    }

    if (daysRemaining <= EXPIRING_SOON_THRESHOLD) {
      return { ...subscriber, status: "expiringsoon" };
    }

    return subscriber;
  });
}