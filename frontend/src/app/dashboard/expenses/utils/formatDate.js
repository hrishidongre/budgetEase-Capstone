/**
 * Format ISO timestamp to readable date string
 * @param {string} isoString - ISO 8601 timestamp (e.g., "2025-12-02T17:36:51.866Z")
 * @returns {string} Formatted date (e.g., "2 Dec 2025")
 */
export function formatDate(isoString) {
  if (!isoString) return "N/A";
  
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
}
