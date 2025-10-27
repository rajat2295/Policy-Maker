import React, { use } from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { GridItem } from "../components/GridItem";
import { AreaChart } from "../components/AreaChart";
import { BarGraph } from "../components/BarGraph";
import { StackedGraph } from "../components/StackedGraph";
import { useAuthContext } from "../hooks/useAuthContext";
import { MultiSelectCountryFilter } from "../components/MultiSelectCountryFilter";
import { MultiSelect } from "../components/MultiSelect";
import { Histogram } from "../components/Histogram";
import { DashboardTabs } from "../components/Tabs";

const filterConfig = [
  { key: "q106", label: "Country" },
  { key: "years_gov", label: "Years in Government" },
  // You can add more here: { key: "sector", label: "Sector" }
];

export const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSurveyData, setFilteredSurveyData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const { user } = useAuthContext();
  const valuable_catagories = {
    category_valuable_9: "Predictive modelling",
    category_valuable_10: "Novel policy ideas",
    category_valuable_11: "Descriptive work",
    category_valuable_12: "Cost-benefit/Welfare analysis",
    category_valuable_13: "Impact on diff. groups",
    category_valuable_14: "Casual effects",
    category_valuable_15: "Unintended consequences",
    category_valuable_16: "Identifying mechanisms",
  };
  // Minimum survey count for displaying graphs
  const MIN_SURVEY_COUNT = 5;

  useEffect(() => {
    const fetchSurveys = async () => {
      if (loading) setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/surveys`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        const data = res.data;
        setSurveys(data.surveys);
        setFilteredSurveyData(data.surveys);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };
    if (user) {
      fetchSurveys();
    }
  }, [user]);

  // One state: selections for all filters
  const [filterSelections, setFilterSelections] = useState(
    filterConfig.reduce((obj, { key }) => ({ ...obj, [key]: [] }), {})
  );

  // Helper: get the intersection of all filter selections
  const applyAllFilters = (data, selections) =>
    data.filter((row) =>
      filterConfig.every(
        ({ key }) =>
          !selections[key].length || selections[key].includes(row[key])
      )
    );
  // For counts in each filter, exclude that filter from selection (so you see what is possible with the other filters applied)
  const getFilteredForFilter = (data, selections, excludeKey) =>
    data.filter((row) =>
      filterConfig.every(
        ({ key }) =>
          key === excludeKey ||
          !selections[key].length ||
          selections[key].includes(row[key])
      )
    );
  // When any filter changes, update setFilteredSurveyData (and UI)
  const handleMultiFilterChange = (filterKey, newSelection) => {
    setFilterSelections((prev) => {
      const updated = { ...prev, [filterKey]: newSelection };
      setFilteredSurveyData(applyAllFilters(surveys, updated));
      return updated;
    });
  };
  // Handle filter changes
  const handleFilterChange = (filteredOriginalRows, selected) => {
    setFilteredSurveyData(filteredOriginalRows);
    setSelectedCountries(selected);
  };
  console.log("Filtered Survey Data:", filteredSurveyData);
  // Check if we have enough data to show graphs
  const hasEnoughData = filteredSurveyData.length >= MIN_SURVEY_COUNT;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Survey Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Analyze policymaker research engagement patterns with interactive
            filters and visualizations.
          </p>
        </header>

        {/* Filter Section */}
        <section className="mb-12" aria-labelledby="filter-heading">
          <h2
            id="filter-heading"
            className="text-2xl font-semibold text-gray-900 mb-6"
          >
            Filter
          </h2>
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-col md:flex-row gap-4">
            {filterConfig.map(({ key, label }) => (
              <MultiSelect
                key={key}
                apiData={surveys}
                filteredDataForCounts={getFilteredForFilter(
                  surveys,
                  filterSelections,
                  key
                )}
                selectedValues={filterSelections[key]}
                onChange={(vals) => handleMultiFilterChange(key, vals)}
                filterKey={key}
                filterName={label}
              />
            ))}
          </div>
        </section>

        {/* Results Summary */}
        <section className="mb-8" aria-labelledby="results-heading">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2
                id="results-heading"
                className="text-2xl font-semibold text-gray-900 mb-2"
              >
                Results Summary
              </h2>
              <p className="text-gray-600">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {filteredSurveyData.length}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {surveys.length}
                </span>{" "}
                survey responses
                {selectedCountries.length > 0 && (
                  <span className="block sm:inline sm:ml-2 text-sm">
                    Filtered by:{" "}
                    <span className="font-medium">
                      {selectedCountries.join(", ")}
                    </span>
                  </span>
                )}
              </p>
            </div>

            {/* Data sufficiency indicator with proper ARIA */}
            <div className="flex-shrink-0">
              {hasEnoughData ? (
                <div
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
                  role="status"
                  aria-label="Data status: sufficient for analysis"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sufficient data ({filteredSurveyData.length} responses)
                </div>
              ) : (
                <div
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg"
                  role="alert"
                  aria-label="Data status: insufficient for reliable analysis"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Need {MIN_SURVEY_COUNT}+ responses (
                  {filteredSurveyData.length} current)
                </div>
              )}
            </div>
          </div>
        </section>

        {loading ? (
          <div
            className="flex justify-center items-center py-12"
            role="status"
            aria-label="Loading surveys"
          >
            <div className="text-gray-600">Loading surveys...</div>
          </div>
        ) : filteredSurveyData.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500">No surveys available.</div>
          </div>
        ) : (
          <>
            <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {/* Charts Section */}
            {hasEnoughData ? (
              <section className="mb-12" aria-labelledby="charts-heading">
                {activeTab === 0 ? (
                  <>
                    <h2
                      id="charts-heading"
                      className="text-2xl font-semibold text-gray-900 mb-6"
                    >
                      Evidence that policymakers engage with research
                    </h2>
                    <div className="space-y-8">
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <GridItem title="How often policy makers learn about academic economic research">
                          <BarGraph
                            data={filteredSurveyData}
                            column="how_often_learn"
                          />
                        </GridItem>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <GridItem title="How often policymakers use academic economic research">
                          <BarGraph
                            data={filteredSurveyData}
                            column="how_often_use"
                          />
                        </GridItem>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <GridItem title="How often policymakers can engage open-mindedly">
                          <BarGraph
                            data={filteredSurveyData}
                            column="foregone_conclusion"
                          />
                        </GridItem>
                      </div>

                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <GridItem
                          size="large"
                          title="Reasons for not reading academic research"
                        >
                          <StackedGraph
                            data={filteredSurveyData}
                            graphType="engagement"
                          />
                        </GridItem>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {activeTab === 1 ? (
                  <>
                    <h2
                      id="charts-heading"
                      className="text-2xl font-semibold text-gray-900 mb-6"
                    >
                      How to communicate research to policymakers
                    </h2>
                    <div className="space-y-8">
                      <GridItem
                        size="large"
                        title="Reasons for not reading academic research"
                      >
                        <StackedGraph
                          data={filteredSurveyData}
                          graphType="communication"
                        />
                      </GridItem>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <GridItem title="Policymakers preferences for academic economists to reach out">
                          <BarGraph
                            data={filteredSurveyData}
                            column="reach_out"
                          />
                        </GridItem>
                      </div>
                    </div>
                  </>
                ) : (
                  ""
                )}
                {activeTab === 2 ? (
                  <>
                    <h2
                      id="charts-heading"
                      className="text-2xl font-semibold text-gray-900 mb-6"
                    >
                      The type of research policymakers want
                    </h2>
                    <div className="space-y-8">
                      <GridItem title="Policymaker preferences for research on new/proposed versus existing policies">
                        <Histogram
                          data={filteredSurveyData}
                          column="new_existing_1"
                          orientation="vertical"
                          showReferenceLine
                          extremeLeftLabel="Existing policies"
                          extremeRightLabel="New policies"
                        />
                      </GridItem>
                      <GridItem title="Policymaker preferences for interdisciplinary research">
                        <Histogram
                          data={filteredSurveyData}
                          orientation="vertical"
                          showReferenceLine
                          column="less_more_multidisci_6"
                          extremeLeftLabel="Multidisciplinary"
                          extremeRightLabel="Economics only"
                        />
                      </GridItem>
                      <GridItem title="Policymaker preferences for meta-analyses versus original work">
                        <Histogram
                          data={filteredSurveyData}
                          orientation="vertical"
                          showReferenceLine
                          column="meta_novel_ideas_1"
                          extremeLeftLabel="Meta-analyses/reviews"
                          extremeRightLabel="Novel ideas"
                        />
                      </GridItem>
                      <GridItem title="Policymaker ratings of how valuable different conceptual categories of research are">
                        <Histogram
                          data={filteredSurveyData}
                          orientation="vertical"
                          showReferenceLine
                          column="new_existing_1"
                        />
                      </GridItem>
                      <GridItem title="Policymaker preferences for research on new/proposed versus existing policies">
                        <BarGraph
                          data={filteredSurveyData}
                          column="new_existing_1"
                        />
                      </GridItem>
                    </div>
                  </>
                ) : (
                  ""
                )}
              </section>
            ) : (
              /* Insufficient data message with proper ARIA */
              <section
                className="mb-12"
                aria-labelledby="insufficient-data-heading"
              >
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400 mb-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3
                      id="insufficient-data-heading"
                      className="text-xl font-semibold text-gray-900 mb-4"
                    >
                      Insufficient Data for Analysis
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      We need at least {MIN_SURVEY_COUNT} survey responses to
                      generate reliable charts and insights. Currently showing{" "}
                      {filteredSurveyData.length} responses.
                    </p>
                    <p className="text-sm text-gray-500">
                      Try selecting different countries or clearing the filter
                      to include more data.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
