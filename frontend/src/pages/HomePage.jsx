import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { GridItem } from "../components/GridItem";
import { AreaChart } from "../components/AreaChart";
import { BarGraph } from "../components/BarGraph";
import { useAuthContext } from "../hooks/useAuthContext";
import { MultiSelectCountryFilter } from "../components/MultiSelectCountryFilter";
import { MultiSelect } from "../components/MultiSelect";
import { Histogram } from "../components/Histogram";
import { DashboardTabs } from "../components/Tabs";
import { StackedGraph } from "../components/StackedGraph";
import { BubbleGraph } from "../components/BubbleGraph";

// Define the structure of all charts, including their titles and which tab they belong to
const ALL_GRAPHS = [
  // Tab 0: Evidence that policymakers engage with research
  {
    tab: 0,
    title: "How often policy makers learn about academic economic research",
    component: (data) => <BarGraph data={data} column="how_often_learn" />,
    caption:
      "How often would you say you learn about a piece of academic economic research? For example, you hear about some research an economics professor did on a podcast.",
  },
  {
    tab: 0,
    title: "How often policymakers use academic economic research",
    component: (data) => <BarGraph data={data} column="how_often_use" />,
    caption:
      "How often would you say you use a piece of academic economic research as part of your policy work?",
  },
  {
    tab: 0,
    title: "How often policymakers can engage open-mindedly",
    component: (data) => <BarGraph data={data} column="foregone_conclusion" />,
    caption:
      "Think about times when you're tasked with looking up academic economic research as part of your job. How often do you feel you're expected to find research that supports a particular conclusion (e.g. research to back up a policy decision that has already been made)?",
  },
  {
    tab: 0,
    title: "Reasons for not reading academic research",
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="engagement" />,
    caption:
      "Please rank, in order from most to least important, the reasons why you don’t read more academic economics research. Please click on each topic and move it to the preferred position in the ranking.",
  },

  // Tab 1: How to communicate research to policymakers
  {
    tab: 1,
    title: "How effective different communication methods are",
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="communication" />,
    caption:
      "Imagine you only could only learn about an academic economist's research findings via one of the communication methods below. Please rank the following in terms of the most (1) to least (7) effective approaches economists might use to communicate their results to policymakers:",
  },
  {
    tab: 1,
    title: "Policymakers preferences for academic economists to reach out",
    component: (data) => <BarGraph data={data} column="reach_out" />,
    caption:
      "Hypothetically, would you like it if academic economists in relevant fields reached out to you more often to share their research? Please note: your answer will not affect the volume or frequency of emails you get from us or anyone else. We will not share identifiable individual answers with anyone.",
  },

  // Tab 2: The type of research policymakers want
  {
    tab: 2,
    title:
      "Policymaker preferences for research on new/proposed versus existing policies",
    component: (data) => (
      <Histogram
        data={data}
        column="new_existing_1"
        orientation="vertical"
        showReferenceLine
        extremeLeftLabel="Existing policies"
        extremeRightLabel="New policies"
      />
    ),
    caption:
      "Existing or new policies: As a potential consumer of academic economic research, would you prefer that economists produced more research on existing policies that are already in place or new policies that could be implemented in the future?",
  },
  {
    tab: 2,
    title: "Policymaker preferences for interdisciplinary research",
    component: (data) => (
      <Histogram
        data={data}
        orientation="vertical"
        showReferenceLine
        column="less_more_multidisci_6"
        extremeLeftLabel="Multidisciplinary"
        extremeRightLabel="Economics only"
      />
    ),
    caption:
      "Less vs more multidisciplinary: Would you be more likely to use this research if it was written in collaboration with researchers from (relevant) fields outside economics, or if it was written entirely by economists?",
  },
  {
    tab: 2,
    title: "Policymaker preferences for meta-analyses versus original work",
    component: (data) => (
      <Histogram
        data={data}
        orientation="vertical"
        showReferenceLine
        column="meta_novel_ideas_1"
        extremeLeftLabel="Meta-analyses/reviews"
        extremeRightLabel="Novel ideas"
      />
    ),
    caption:
      "Review papers vs novel ideas: As a potential consumer of academic economic research, would you prefer that economists produced more review papers and meta-analyses that summarize existing work or that economists focused more on novel ideas?",
  },
  {
    tab: 2,
    title: "What makes academic economics research useful to policymakers",
    size: "xl",
    component: (data) => (
      <StackedGraph size="large" data={data} graphType="usefulEcon" />
    ),
    caption:
      "Please rank, in order from most to least important, the reasons why you don’t read more academic economics research. Please click on each topic and move it to the preferred position in the ranking.",
  },
  {
    tab: 2,
    title:
      "Policymaker self-assessed ‘treatment effect’ on engagement if research matched their type preferences",
    size: "xl",
    component: (data) => <BubbleGraph data={data} />,
    caption:
      "Policymaker self-assessed ‘treatment effect’ on engagement if research matched their type preferences (i.e. how much more often they’d engage)",
  },
];

const filterConfig = [
  { key: "q106", label: "Country" },
  { key: "years_gov", label: "Years in Government" },
];

export const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSurveyData, setFilteredSurveyData] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGraphTitles, setFilteredGraphTitles] = useState([]);

  const { user } = useAuthContext();
  const MIN_SURVEY_COUNT = 5;

  // --- Search Logic ---
  useEffect(() => {
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      const results = ALL_GRAPHS.filter((graph) =>
        graph.title.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredGraphTitles(results);
    } else {
      setFilteredGraphTitles([]);
    }
  }, [searchTerm]);

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  // --- Existing Logic ---
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

  const [filterSelections, setFilterSelections] = useState(
    filterConfig.reduce((obj, { key }) => ({ ...obj, [key]: [] }), {})
  );

  const applyAllFilters = (data, selections) =>
    data.filter((row) =>
      filterConfig.every(
        ({ key }) =>
          !selections[key].length || selections[key].includes(row[key])
      )
    );

  const getFilteredForFilter = (data, selections, excludeKey) =>
    data.filter((row) =>
      filterConfig.every(
        ({ key }) =>
          key === excludeKey ||
          !selections[key].length ||
          selections[key].includes(row[key])
      )
    );

  const handleMultiFilterChange = (filterKey, newSelection) => {
    setFilterSelections((prev) => {
      const updated = { ...prev, [filterKey]: newSelection };
      setFilteredSurveyData(applyAllFilters(surveys, updated));
      return updated;
    });
  };

  const handleFilterChange = (filteredOriginalRows, selected) => {
    setFilteredSurveyData(filteredOriginalRows);
    setSelectedCountries(selected);
  };

  const hasEnoughData = filteredSurveyData.length >= MIN_SURVEY_COUNT;

  const getGraphsForCurrentTab = () => {
    if (searchTerm && filteredGraphTitles.length > 0) {
      return filteredGraphTitles;
    } else if (!searchTerm) {
      return ALL_GRAPHS.filter((graph) => graph.tab === activeTab);
    } else {
      return [];
    }
  };

  const currentGraphs = getGraphsForCurrentTab();

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

        {/* STICKY WRAPPER */}
        {/* top-0: Sticks to top
            z-30: Ensures it stays above graphs
            bg-white: Prevents content from showing through
            pb-4: Adds padding at the bottom of the sticky area
        */}
        <div className="sticky top-0 z-30 bg-white pt-4 pb-2 shadow-sm -mx-4 px-4 md:-mx-8 md:px-8 transition-all">
          {/* Filter Section */}
          <section className="mb-6" aria-labelledby="filter-heading">
            <h2
              id="filter-heading"
              className="text-2xl font-semibold text-gray-900 mb-4"
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

          {/* Results Summary and Search Bar Container */}
          <section className="mb-4" aria-labelledby="results-heading">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              {/* Left side: Summary */}
              <div className="flex-grow">
                <h2
                  id="results-heading"
                  className="text-xl font-semibold text-gray-900 mb-1"
                >
                  Results Summary
                </h2>
                <p className="text-gray-600 text-sm">
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
                    <span className="block sm:inline sm:ml-2">
                      Filtered by:{" "}
                      <span className="font-medium">
                        {selectedCountries.join(", ")}
                      </span>
                    </span>
                  )}
                </p>
              </div>

              {/* Right side: Search Component */}
              <div className="w-full md:w-96 flex justify-end">
                <div className="relative w-full">
                  <label htmlFor="graph-search" className="sr-only">
                    Search Graphs
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    id="graph-search"
                    name="graph-search"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900"
                    placeholder="Search graphs by title..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Data sufficiency indicator */}
            <div className="flex justify-start mt-2">
              <div className="flex-shrink-0">
                {hasEnoughData ? (
                  <div
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
                    role="status"
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Sufficient data
                  </div>
                ) : (
                  <div
                    className="inline-flex items-center px-3 py-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-lg"
                    role="alert"
                  >
                    <svg
                      className="w-3 h-3 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Need {MIN_SURVEY_COUNT}+ responses
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
        {/* END STICKY WRAPPER */}

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
            {/* Render tabs ONLY if the search term is empty */}
            {!searchTerm && (
              <div className="mt-8">
                <DashboardTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            )}

            {/* Charts Section */}
            {hasEnoughData ? (
              <section className="mb-12 mt-6" aria-labelledby="charts-heading">
                <h2
                  id="charts-heading"
                  className="text-2xl font-semibold text-gray-900 mb-6"
                >
                  {searchTerm
                    ? `Search Results for "${searchTerm}"`
                    : ALL_GRAPHS.find((g) => g.tab === activeTab)
                    ? activeTab === 0
                      ? "Evidence that policymakers engage with research"
                      : activeTab === 1
                      ? "How to communicate research to policymakers"
                      : "The type of research policymakers want"
                    : "Charts"}
                </h2>

                {/* Conditional rendering based on search results */}
                {currentGraphs.length > 0 ? (
                  <div className="space-y-8">
                    {currentGraphs.map((graph, index) => (
                      <div
                        key={`${graph.tab}-${graph.title.replace(
                          /\s/g,
                          "-"
                        )}-${index}`}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <GridItem
                          title={graph.title}
                          caption={graph.caption}
                          size={graph.size}
                        >
                          {/* Execute the component function with the data */}
                          {graph.component(filteredSurveyData)}
                        </GridItem>
                      </div>
                    ))}
                  </div>
                ) : searchTerm ? (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      No graphs found matching **"{searchTerm}"**.
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500">
                      No charts defined for this tab.
                    </div>
                  </div>
                )}
              </section>
            ) : (
              /* Insufficient data message */
              <section
                className="mb-12 mt-8"
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
