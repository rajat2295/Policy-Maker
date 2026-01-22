/**
 * [HELPER]: isValid
 * Functionality: Returns true only if the input is a non-empty string,
 * a number, or a populated array.
 * Prevents "blank" options from appearing in filter dropdowns.
 */
export const isValid = (val) => {
  // 1. Check for null or undefined
  if (val === null || val === undefined) return false;

  // 2. Check for strings (remove whitespace)
  if (typeof val === "string") return val.trim() !== "";

  // 3. Check for arrays (ensure they have at least one item)
  if (Array.isArray(val)) return val.length > 0;

  // 4. Numbers are considered valid (even 0)
  if (typeof val === "number") return true;

  return false;
};
