export function sortExpenses(expenses, sortType) {
  const sorted = [...expenses];

  switch (sortType) {
    case "date-newest":
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));

    case "date-oldest":
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));

    case "alpha-asc":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));

    case "alpha-desc":
      return sorted.sort((a, b) => b.title.localeCompare(a.title));

    case "amount-low":
      return sorted.sort((a, b) => a.amount - b.amount);

    case "amount-high":
      return sorted.sort((a, b) => b.amount - a.amount);

    default:
      return expenses;
  }
}
