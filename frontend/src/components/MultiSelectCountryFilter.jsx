import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";

export const MultiSelectCountryFilter = ({ apiData, onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Extract unique countries from API data
  const getUniqueCountries = () => {
    const countries = apiData
      .map((surveyResponse) => surveyResponse.q106)
      .filter((country) => country && country.trim() !== "")
      .filter((country, index, arr) => arr.indexOf(country) === index)
      .sort();
    return countries;
  };

  const availableCountries = getUniqueCountries();

  // Close dropdown when clicking outside or pressing Escape
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

  // Handle country selection
  const handleCountryToggle = (country) => {
    const updatedSelection = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];

    setSelectedCountries(updatedSelection);

    const filteredSurveyRows =
      updatedSelection.length === 0
        ? [...apiData]
        : apiData.filter((surveyRow) =>
            updatedSelection.includes(surveyRow.q106)
          );

    onFilterChange(filteredSurveyRows, updatedSelection);
  };

  // Remove specific country
  const removeCountry = (countryToRemove) => {
    const updatedSelection = selectedCountries.filter(
      (c) => c !== countryToRemove
    );
    setSelectedCountries(updatedSelection);

    const filteredSurveyRows =
      updatedSelection.length === 0
        ? [...apiData]
        : apiData.filter((surveyRow) =>
            updatedSelection.includes(surveyRow.q106)
          );

    onFilterChange(filteredSurveyRows, updatedSelection);
  };

  // Clear all selections
  const clearAll = () => {
    setSelectedCountries([]);
    onFilterChange([...apiData], []);
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      {/* Dropdown Button - WCAG Compliant */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 text-left bg-white border-2 border-gray-300 rounded-lg shadow-sm hover:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:border-teal-400 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={`Country filter. ${selectedCountries.length} countries selected.`}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {selectedCountries.length === 0 ? (
              <span className="text-gray-500">Select countries...</span>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedCountries.slice(0, 2).map((country) => (
                  <span
                    key={country}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-900 bg-gray-100 border border-gray-300 rounded-full"
                  >
                    {country}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCountry(country);
                      }}
                      className="ml-2 bg-gray-100 text-teal-600 hover:text-teal-800 hover:bg-teal-100 focus:outline-none focus:ring-1 focus:ring-teal-500 rounded transition-colors"
                      aria-label={`Remove ${country} filter`}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {selectedCountries.length > 2 && (
                  <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 border border-gray-300 rounded-full">
                    +{selectedCountries.length - 2} more
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

      {/* Dropdown Menu - WCAG Compliant */}
      {isOpen && (
        <div
          className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg"
          role="listbox"
          aria-label="Country options"
        >
          {/* Header with Clear All */}
          {selectedCountries.length > 0 && (
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <button
                onClick={clearAll}
                className="text-sm text-red-600 hover:text-red-800 font-semibold bg-white border border-red-200 px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
                aria-label={`Clear all ${selectedCountries.length} selected countries`}
              >
                Clear All ({selectedCountries.length})
              </button>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-60 overflow-y-auto">
            {availableCountries.map((country) => {
              const isChecked = selectedCountries.includes(country);
              return (
                <label
                  key={country}
                  className="flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer focus-within:bg-gray-50"
                  role="option"
                  aria-selected={isChecked}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleCountryToggle(country)}
                    className={`
                      w-4 h-4 
                      border-2 
                      rounded 
                      focus:ring-2
                      focus:ring-teal-400
                      bg-white
                      ${
                        isChecked
                          ? "border-teal-600 bg-teal-100 text-teal-600"
                          : "border-gray-400"
                      }
                    `}
                    style={{
                      accentColor: isChecked ? "#26a69a" : "#B0B0B0",
                    }}
                    aria-describedby={`${country}-count`}
                  />
                  <span className="ml-3 text-sm text-gray-900 flex-1">
                    {country}
                  </span>
                  <span
                    id={`${country}-count`}
                    className="text-xs text-gray-500"
                    aria-label={`${
                      apiData.filter((item) => item.q106 === country).length
                    } responses`}
                  >
                    ({apiData.filter((item) => item.q106 === country).length})
                  </span>
                </label>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
            {selectedCountries.length} of {availableCountries.length} selected
          </div>
        </div>
      )}
    </div>
  );
};
