export const MIN_INTERESTS = 3;

export type FilterableInterest = {
  label: string;
  category: string;
};

export function canContinueWithInterests(selected: string[], minimum = MIN_INTERESTS) {
  return selected.length >= minimum;
}

export function toggleInterestSelection(selected: string[], label: string) {
  return selected.includes(label)
    ? selected.filter((item) => item !== label)
    : [...selected, label];
}

export function filterInterests<T extends FilterableInterest>(
  interests: T[],
  category: string,
  query: string,
) {
  const normalizedQuery = query.trim().toLowerCase();
  return interests.filter((interest) => {
    const matchesCategory = category === "All" || interest.category === category;
    const matchesQuery = interest.label.toLowerCase().includes(normalizedQuery);
    return matchesCategory && matchesQuery;
  });
}
