import React, { useEffect, useState } from "react";
import axios from "axios";
import { GridItem } from "../components/GridItem";
import { BarGraph } from "../components/BarGraph";
import { useAuthContext } from "../hooks/useAuthContext";
import { AverageRankBarGraph } from "../components/AverageRankBarGraph";
import { MultiSelect } from "../components/MultiSelect";
import { Histogram } from "../components/Histogram";
import { DashboardTabs } from "../components/Tabs";
import { StackedGraph } from "../components/StackedGraph";
import { BubbleGraph } from "../components/BubbleGraph";
import {
  FREQUENCY_ORDER,
  OCCASION_FREQUENCY,
  USEFULNESS_FREQUENCY_ORDER,
} from "../helpers/constants";

// 1. Define Manual Sort Orders for Filters
// Functionality: Ensures categorical data (like years) follows a logical timeline rather than alphabetical order.
const CUSTOM_SORT_ORDERS = {
  years_gov: [
    "0-4 years", // [EDITABLE_VALUE]
    "5-8 years",
    "9-15 years",
    "16-25 years",
    "26-35 years",
  ],
};

// 2. Graph Registry
// Functionality: A master configuration array that maps survey data columns to specific chart components.
// This allows the dashboard to render different types of visuals (Bars, Histograms, Bubbles) based on the question type.
const ALL_GRAPHS = [
  {
    id: "learn-freq",
    tab: 0,
    title: "How often policymakers learn about academic economic research", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <BarGraph
        customOrder={FREQUENCY_ORDER}
        data={data}
        column="how_often_learn"
      />
    ),
    caption:
      "How often would you say you learn about a piece of academic economic research?", // [CONFIGURABLE_TEXT]
  },
  {
    id: "comm-methods",
    tab: 0,
    title: "Preferred communication methods for research", // [CONFIGURABLE_TEXT]
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="communication" />,
    caption:
      "Rank the following in terms of the most (1) to least (7) effective approaches economists might use to communicate results.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "topic-usefulness",
    tab: 0,
    title: "Usefulness of research on different topics", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <BarGraph
        data={data}
        column="reach_out"
        customOrder={USEFULNESS_FREQUENCY_ORDER}
      />
    ),
    caption:
      "Do you think it would be useful if there was more research on [topic] produced by academic economists?", // [CONFIGURABLE_TEXT]
  },
  {
    id: "policy-pref",
    tab: 0,
    title: "Policymaker preferences for research on new vs existing policies", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <Histogram
        data={data}
        column="new_existing_1"
        orientation="vertical"
        showReferenceLine
        extremeLeftLabel="Existing policies" // [CONFIGURABLE_TEXT]
        extremeRightLabel="New policies" // [CONFIGURABLE_TEXT]
      />
    ),
    caption: "Preferences for research on existing policies vs new policies.", // [CONFIGURABLE_TEXT]
  },

  {
    id: "learn-freq-tab1",
    tab: 1,
    title: "How often policymakers learn about academic economic research", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <BarGraph
        customOrder={FREQUENCY_ORDER}
        data={data}
        column="how_often_learn"
      />
    ),
    caption: "Frequency of learning about academic research.",
  },

  {
    id: "use-freq",
    tab: 1,
    title: "How often policymakers use academic economic research", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <BarGraph
        customOrder={FREQUENCY_ORDER}
        data={data}
        column="how_often_use"
      />
    ),
    caption: "Frequency of using academic research in policy work.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "open-mind",
    tab: 1,
    title: "How often policymakers can engage open-mindedly", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <BarGraph
        customOrder={OCCASION_FREQUENCY}
        data={data}
        column="foregone_conclusion"
      />
    ),
    caption:
      "Frequency of being expected to find research supporting a particular conclusion.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "engagement-reasons",
    tab: 1,
    title: "Most Important reasons for not reading academic research.", // [CONFIGURABLE_TEXT]
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="engagement" />,
    caption: "Ranking reasons for not reading more research.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "comm-rank-tab2",
    tab: 2,
    title: "Preferred communication methods for research", // [CONFIGURABLE_TEXT]
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="communication" />,
    caption: "Most effective communication methods ranking.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "reach-out-tab2",
    tab: 2,
    title: "Policymakers preferences for academic economists to reach out", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <BarGraph
        data={data}
        column="reach_out"
        customOrder={USEFULNESS_FREQUENCY_ORDER}
      />
    ),
    caption: "Desire for economists to reach out directly.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "new-existing-tab3",
    tab: 3,
    title: "Policymaker preferences for research on new vs existing policies", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <Histogram
        data={data}
        column="new_existing_1"
        orientation="vertical"
        showReferenceLine
        extremeLeftLabel="Existing policies" // [CONFIGURABLE_TEXT]
        extremeRightLabel="New policies" // [CONFIGURABLE_TEXT]
      />
    ),
    caption: "Preference for research on implementation vs innovation.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "interdisciplinary",
    tab: 3,
    title: "Policymaker preferences for interdisciplinary research", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <Histogram
        data={data}
        orientation="vertical"
        showReferenceLine
        column="less_more_multidisci_6"
        extremeLeftLabel="Multidisciplinary" // [CONFIGURABLE_TEXT]
        extremeRightLabel="Economics only" // [CONFIGURABLE_TEXT]
      />
    ),
    caption: "Economics-only research vs multidisciplinary collaboration.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "meta-analysis",
    tab: 3,
    title: "Policymaker preferences for meta-analyses versus original work", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <Histogram
        data={data}
        orientation="vertical"
        showReferenceLine
        column="meta_novel_ideas_1"
        extremeLeftLabel="Meta-analyses/reviews" // [CONFIGURABLE_TEXT]
        extremeRightLabel="Novel ideas" // [CONFIGURABLE_TEXT]
      />
    ),
    caption: "Preference for summarization vs new primary research.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "non-work-reasons",
    tab: 3,
    size: "xl",
    title: "Reasons to not read more academic economics research", // [CONFIGURABLE_TEXT]
    component: (data) => (
      <AverageRankBarGraph data={data} keyPrefix="rank_nowork_" />
    ),
    caption: "Valuable research areas for those not currently working in them.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "useful-factors",
    tab: 3,
    title: "What makes academic economics research useful to policymakers", // [CONFIGURABLE_TEXT]
    size: "xl",
    component: (data) => (
      <StackedGraph
        size="large"
        data={data}
        graphType="usefulEcon"
        seriesOrder={[
          "Very useful",
          "Somewhat useful",
          "Not very useful",
          "Not useful at all",
        ]}
      />
    ),
    caption: "Factors determining the usefulness of research.", // [CONFIGURABLE_TEXT]
  },
  {
    id: "treatment-effect",
    tab: 3,
    title: "Policymaker self-assessed ‘treatment effect’ on engagement", // [CONFIGURABLE_TEXT]
    size: "xl",
    component: (data) => <BubbleGraph data={data} />,
    caption: "Engagement change if research matched type preferences.", // [CONFIGURABLE_TEXT]
  },
];

// 3. Filter Configuration
// Functionality: Maps the data property keys to user-friendly labels displayed in the filter dropdowns.
const filterConfig = [
  { key: "country_final", label: "Country" }, // [EDITABLE_VALUE]
  { key: "years_gov", label: "Years in Government" },
  { key: "elected", label: "Elected?" },
  { key: "derived_sector", label: "Working In" },
];

export const HomePage = ({ searchTerm, setSearchTerm }) => {
  // State Functionality:
  // - surveys: The raw/processed data from the database.
  // - filteredSurveyData: The subset of data that matches current user filters.
  // - filterSelections: Tracks which items (countries, sectors, etc.) are currently selected.
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSurveyData, setFilteredSurveyData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [filteredGraphTitles, setFilteredGraphTitles] = useState([]);

  const { user } = useAuthContext();
  const MIN_SURVEY_COUNT = 5; // [EDITABLE_VALUE]: Minimum respondents required to show data for privacy reasons.

  // Initialization: Creates an empty array for each filter key defined in filterConfig.
  const [filterSelections, setFilterSelections] = useState(
    filterConfig.reduce((obj, { key }) => ({ ...obj, [key]: [] }), {})
  );

  // Functionality: Returns true if the user has applied any filtering criteria.
  const hasActiveFilters = Object.values(filterSelections).some(
    (selection) => selection.length > 0
  );

  // Functionality: Resets all filter arrays to empty and restores the full dataset to the view.
  const clearAllFilters = () => {
    const cleared = filterConfig.reduce(
      (obj, { key }) => ({ ...obj, [key]: [] }),
      {}
    );
    setFilterSelections(cleared);
    setFilteredSurveyData(surveys);
  };

  // Functionality: Listens for a custom 'jump-to-graph' event (likely from a sidebar or search result).
  // Automatically switches tabs and scrolls the target graph into view with a highlighting ring.
  useEffect(() => {
    const handleJump = (e) => {
      const { tab, id } = e.detail;
      setActiveTab(tab);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          element.classList.add("ring-4", "ring-emerald-500/20");
          setTimeout(
            () => element.classList.remove("ring-4", "ring-emerald-500/20"),
            2000
          );
        }
      }, 300);
    };
    window.addEventListener("jump-to-graph", handleJump);
    return () => window.removeEventListener("jump-to-graph", handleJump);
  }, []);

  // Functionality: Filters the list of available graphs globally based on the search input string.
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

  // Functionality: The core Data Pipeline.
  // 1. Fetches data from the API.
  // 2. Flattens multi-choice sectors: If a person works in 'Health' and 'Education',
  //    this code creates two separate data rows for that person so they appear in both filter counts.
  // 3. Normalizes 'Elected' status from varied formats (boolean/string) into a standard "Yes/No".
  useEffect(() => {
    const fetchSurveys = async () => {
      if (loading) setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/surveys`,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );

        const processed = res.data.surveys.map((survey) => {
          // 1. Identify active sectors but keep them in an ARRAY
          const activeSectors = Object.keys(survey)
            .filter(
              (key) =>
                key.startsWith("workin_") &&
                (Number(survey[key]) === 1 || survey[key] === "1")
            )
            .map((key) => {
              const raw = key.replace("workin_", "").replace(/_/g, " ");
              return raw.charAt(0).toUpperCase() + raw.slice(1);
            });

          // 2. Normalize Elected status
          const val = survey.elected;
          const isElected =
            val === 1 ||
            val === "1" ||
            val === true ||
            (typeof val === "string" && val.toLowerCase().trim() === "yes")
              ? "Yes"
              : "No";

          // 3. RETURN ONE ROW PER PERSON
          return {
            ...survey,
            derived_sector:
              activeSectors.length > 0 ? activeSectors : ["Unspecified"],
            elected: isElected,
          };
        });

        setSurveys(processed);
        setFilteredSurveyData(processed);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };
    if (user) fetchSurveys();
  }, [user]);

  // Functionality: Logic to filter the survey array by checking if each row matches ALL active filter categories.
  const applyAllFilters = (data, selections) =>
    data.filter((row) =>
      filterConfig.every(({ key }) => {
        const selectedItems = selections[key];
        if (!selectedItems.length) return true;

        const rowValue = row[key];
        // Logic: If the data is an array (sectors), check for intersection
        if (Array.isArray(rowValue)) {
          return rowValue.some((val) => selectedItems.includes(val));
        }
        // Standard match for Country, Years, etc.
        return selectedItems.includes(rowValue);
      })
    );

  // Functionality: Calculates counts for a specific filter while ignoring its own selections.
  // (e.g., while filtering countries, the country dropdown should still show counts for all countries
  // matching the current 'Sector' or 'Years' filters).
  const getFilteredForFilter = (data, selections, excludeKey) =>
    data.filter((row) =>
      filterConfig.every(
        ({ key }) =>
          key === excludeKey ||
          !selections[key].length ||
          selections[key].includes(row[key])
      )
    );

  // Functionality: Updates the state when a user toggles a filter and immediately triggers the re-filtering of data.
  const handleMultiFilterChange = (filterKey, newSelection) => {
    setFilterSelections((prev) => {
      const updated = { ...prev, [filterKey]: newSelection };
      setFilteredSurveyData(applyAllFilters(surveys, updated));
      return updated;
    });
  };

  // Functionality: Statistical calculations to show "Showing X of Y".
  // Uses a Set on IDs to ensure we count unique people, not the "flattened" sector rows.
  const uniqueFilteredCount = new Set(
    filteredSurveyData.map((s) => s.id || s._id)
  ).size;
  const uniqueTotalCount = new Set(surveys.map((s) => s.id || s._id)).size;
  const hasEnoughData = uniqueFilteredCount >= MIN_SURVEY_COUNT;

  // Functionality: Determines which graphs to display (Search results vs Tab selection).
  const currentGraphs = searchTerm
    ? filteredGraphTitles
    : ALL_GRAPHS.filter((graph) => graph.tab === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          {/* Functionality: Dashboard Title and Subtitle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Survey Analysis Dashboard {/* [CONFIGURABLE_TEXT] */}
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl">
                Analyze policymaker research engagement patterns with
                interactive filters. {/* [CONFIGURABLE_TEXT] */}
              </p>
            </div>
            {/* Functionality: Dynamic Statistics Widget */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">
                Results Summary {/* [CONFIGURABLE_TEXT] */}
              </h2>
              <p className="text-gray-600 text-sm">
                Showing{" "}
                <span className="font-medium text-gray-900">
                  {uniqueFilteredCount}
                </span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">
                  {uniqueTotalCount}
                </span>{" "}
                unique responses
              </p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg border ${
                    hasEnoughData
                      ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                      : "text-amber-800 bg-amber-50 border-amber-200"
                  }`}
                >
                  {hasEnoughData
                    ? "✓ Sufficient data" // [CONFIGURABLE_TEXT]
                    : `⚠ Need ${MIN_SURVEY_COUNT}+ responses`}{" "}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Functionality: Sticky Filter Interface */}
        <div className="sticky top-[64px] z-30 bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-wrap items-center gap-4">
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
              customSortOrder={CUSTOM_SORT_ORDERS[key]}
            />
          ))}

          {/* Functionality: Conditional 'Clear All' button (only visible when filters are applied) */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm text-white hover:font-bold bg-red-600 border border-red-200 hover:border-red-600 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Clear All Filters {/* [CONFIGURABLE_TEXT] */}
            </button>
          )}
        </div>

        {/* Functionality: Main View Switcher (Loading vs Empty vs Chart Data) */}
        {loading ? (
          <div className="flex justify-center py-12 text-gray-600">
            Loading surveys... {/* [CONFIGURABLE_TEXT] */}
          </div>
        ) : uniqueFilteredCount === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No data found matching your filters. {/* [CONFIGURABLE_TEXT] */}
          </div>
        ) : (
          <>
            {/* Functionality: Tab Navigation (Hidden when searching) */}
            {!searchTerm && (
              <div className="mt-8">
                <DashboardTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            )}

            {/* Functionality: Conditional Rendering of Charts vs 'Insufficient Data' warning */}
            {hasEnoughData ? (
              <section className="mb-12 mt-6">
                <div className="space-y-8">
                  {currentGraphs.map((graph) => (
                    <div
                      key={graph.id}
                      id={graph.id}
                      className="bg-white border border-gray-200 rounded-lg shadow-sm scroll-mt-64 transition-all duration-500"
                    >
                      <GridItem
                        title={graph.title}
                        caption={graph.caption}
                        size={graph.size}
                      >
                        {graph.component(filteredSurveyData)}
                      </GridItem>
                    </div>
                  ))}
                </div>
              </section>
            ) : (
              <section className="mb-12 mt-8 bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Insufficient Data for Analysis {/* [CONFIGURABLE_TEXT] */}
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.{" "}
                  {/* [CONFIGURABLE_TEXT] */}
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
