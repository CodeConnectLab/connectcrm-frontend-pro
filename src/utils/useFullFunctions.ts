export const isWithinNext24Hours = (date: Date): boolean => {
  const now = new Date();
  const future = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  return date > now && date <= future;
};

export const isWithinPast24Hours = (date: Date): boolean => {
  const now = new Date();
  // const past = new Date(now.getTime() - 48 * 60 * 60 * 1000);
  return date < now;
};
