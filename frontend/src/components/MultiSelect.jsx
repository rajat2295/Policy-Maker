import React, { useRef, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const MultiSelect = ({
  apiData,
  filteredDataForCounts,
  selectedValues,
  onChange,
  filterKey,
  filterName,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Option structure: {value, total, filtered}
  const getOptions = () => {
    const unique = Array.from(
      new Set(apiData.map((row) => row[filterKey]).filter(Boolean))
    ).sort();
    return unique.map((value) => ({
      value,
      total: apiData.filter((row) => row[filterKey] === value).length,
      filtered: filteredDataForCounts.filter((row) => row[filterKey] === value)
        .length,
    }));
  };
  const options = getOptions();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleValueToggle = (val) => {
    const updated = selectedValues.includes(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val];
    onChange(updated);
  };

  const removeValue = (val) =>
    onChange(selectedValues.filter((v) => v !== val));
  const clearAll = () => onChange([]);

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:border-teal-400 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`${filterName} filter. ${selectedValues.length} selected.`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {selectedValues.length === 0 ? (
              <span className="text-gray-500">
                Select {filterName.toLowerCase()}...
              </span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedValues.slice(0, 2).map((val) => (
                  <span
                    key={val}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-full"
                  >
                    {val}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeValue(val);
                      }}
                      className="ml-2 bg-gray-100 text-teal-600 hover:text-teal-800 hover:bg-teal-100 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded transition-colors"
                      aria-label={`Remove ${val} filter`}
                    >
                      {" "}
                      <XMarkIcon className="w-4 h-4" />{" "}
                    </button>
                  </span>
                ))}
                {selectedValues.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-full">
                    +{selectedValues.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-500 transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </div>
      </button>
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
          role="listbox"
          aria-label={`${filterName} options`}
        >
          {selectedValues.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-800 font-semibold bg-white border border-red-200 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                aria-label={`Clear all ${
                  selectedValues.length
                } selected ${filterName.toLowerCase()}`}
              >
                {" "}
                Clear All ({selectedValues.length}){" "}
              </button>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto">
            {options.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer focus-within:bg-gray-50"
                role="option"
                aria-selected={selectedValues.includes(opt.value)}
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(opt.value)}
                  onChange={() => handleValueToggle(opt.value)}
                  className={`w-4 h-4 border-2 rounded focus:ring-2 focus:ring-teal-400 bg-white ${
                    selectedValues.includes(opt.value)
                      ? "border-teal-600 bg-teal-100 text-teal-600"
                      : "border-gray-400"
                  }`}
                  style={{
                    accentColor: selectedValues.includes(opt.value)
                      ? "#26a69a"
                      : "#B0B0B0",
                  }}
                  aria-describedby={`${opt.value}-count`}
                />
                <span className="ml-3 text-sm text-gray-900 flex-1">
                  {opt.value}
                </span>
                <span
                  id={`${opt.value}-count`}
                  className="text-xs text-gray-500"
                  aria-label={`${opt.filtered} of ${opt.total} responses`}
                >
                  ({opt.filtered} of {opt.total})
                </span>
              </label>
            ))}
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            {selectedValues.length} of {options.length} selected
          </div>
        </div>
      )}
    </div>
  );
};
