import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { GridItem } from "../components/GridItem";
import { BarGraph } from "../components/BarGraph";
import { useAuthContext } from "../hooks/useAuthContext";
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
import { AverageRankBarGraph } from "../components/AverageRankBarGraph";

// Configuration for all charts with IDs for scrolling
const ALL_GRAPHS = [
  {
    id: "learn-freq",
    tab: 0,
    title: "How often policymakers learn about academic economic research",
    component: (data) => (
      <BarGraph
        customOrder={FREQUENCY_ORDER}
        data={data}
        column="how_often_learn"
      />
    ),
    caption:
      "How often would you say you learn about a piece of academic economic research?",
  },
  {
    id: "comm-methods",
    tab: 0,
    title: "Preferred communication methods for research",
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="communication" />,
    caption:
      "Rank the following in terms of the most (1) to least (7) effective approaches economists might use to communicate results.",
  },
  {
    id: "topic-usefulness",
    tab: 0,
    title: "Usefulness of research on different topics",
    component: (data) => (
      <BarGraph
        data={data}
        column="reach_out"
        customOrder={USEFULNESS_FREQUENCY_ORDER}
      />
    ),
    caption:
      "Do you think it would be useful if there was more research on [topic] produced by academic economists?",
  },
  {
    id: "policy-pref",
    tab: 0,
    title: "Policymaker preferences for research on new vs existing policies",
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
    caption: "Preferences for research on existing policies vs new policies.",
  },
  {
    id: "learn-freq-tab1",
    tab: 1,
    title: "How often policymakers learn about academic economic research",
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
    title: "How often policymakers use academic economic research",
    component: (data) => (
      <BarGraph
        customOrder={FREQUENCY_ORDER}
        data={data}
        column="how_often_use"
      />
    ),
    caption: "Frequency of using academic research in policy work.",
  },
  {
    id: "open-mind",
    tab: 1,
    title: "How often policymakers can engage open-mindedly",
    component: (data) => (
      <BarGraph
        customOrder={OCCASION_FREQUENCY}
        data={data}
        column="foregone_conclusion"
      />
    ),
    caption:
      "Frequency of being expected to find research supporting a particular conclusion.",
  },
  {
    id: "engagement-reasons",
    tab: 1,
    title: "Most Important reasons for not reading academic research.",
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="engagement" />,
    caption: "Ranking reasons for not reading more research.",
  },
  {
    id: "comm-rank-tab2",
    tab: 2,
    title: "Preferred communication methods for research",
    size: "large",
    component: (data) => <StackedGraph data={data} graphType="communication" />,
    caption: "Most effective communication methods ranking.",
  },
  {
    id: "reach-out-tab2",
    tab: 2,
    title: "Policymakers preferences for academic economists to reach out",
    component: (data) => (
      <BarGraph
        data={data}
        column="reach_out"
        customOrder={USEFULNESS_FREQUENCY_ORDER}
      />
    ),
    caption: "Desire for economists to reach out directly.",
  },
  {
    id: "new-existing-tab3",
    tab: 3,
    title: "Policymaker preferences for research on new vs existing policies",
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
    caption: "Preference for research on implementation vs innovation.",
  },
  {
    id: "interdisciplinary",
    tab: 3,
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
    caption: "Economics-only research vs multidisciplinary collaboration.",
  },
  {
    id: "meta-analysis",
    tab: 3,
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
    caption: "Preference for summarization vs new primary research.",
  },
  {
    id: "non-work-reasons",
    tab: 3,
    size: "xl",
    title: "Reasons to not read more academic economics research",
    component: (data) => (
      <AverageRankBarGraph data={data} keyPrefix="rank_nowork_" />
    ),
    caption: "Valuable research areas for those not currently working in them.",
  },
  {
    id: "useful-factors",
    tab: 3,
    title: "What makes academic economics research useful to policymakers",
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
    caption: "Factors determining the usefulness of research.",
  },
  {
    id: "treatment-effect",
    tab: 3,
    title: "Policymaker self-assessed ‘treatment effect’ on engagement",
    size: "xl",
    component: (data) => <BubbleGraph data={data} />,
    caption: "Engagement change if research matched type preferences.",
  },
];

const filterConfig = [
  { key: "country_final", label: "Country" },
  { key: "years_gov", label: "Years in Government" },
  { key: "elected", label: "Elected?" },
  { key: "derived_sector", label: "Working In" },
];

export const HomePage = () => {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredSurveyData, setFilteredSurveyData] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGraphTitles, setFilteredGraphTitles] = useState([]);

  const { user } = useAuthContext();
  const MIN_SURVEY_COUNT = 5;

  const [filterSelections, setFilterSelections] = useState(
    filterConfig.reduce((obj, { key }) => ({ ...obj, [key]: [] }), {})
  );

  // --- LISTENER FOR NAVBAR JUMPS ---
  useEffect(() => {
    const handleJump = (e) => {
      const { tab, id } = e.detail;
      setActiveTab(tab);

      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          // 'start' ensures the browser respects the scroll-margin-top
          element.scrollIntoView({ behavior: "smooth", block: "start" });

          // Flash effect to show exactly where we landed
          element.classList.add("ring-4", "ring-emerald-500/20");
          setTimeout(
            () => element.classList.remove("ring-4", "ring-emerald-500/20"),
            2000
          );
        }
      }, 300); // Slight delay to allow the tab content to render first
    };

    window.addEventListener("jump-to-graph", handleJump);
    return () => window.removeEventListener("jump-to-graph", handleJump);
  }, []);

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

  // --- Fetch and Process Data ---
  useEffect(() => {
    const fetchSurveys = async () => {
      if (loading) setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/surveys`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );

        const processed = res.data.surveys.map((survey) => {
          // 1. Process "Working In" Sector
          const workKey = Object.keys(survey).find(
            (key) =>
              key.startsWith("workin_") &&
              (Number(survey[key]) === 1 || survey[key] === "1")
          );
          let sectorLabel = "Unspecified";
          if (workKey) {
            const raw = workKey.replace("workin_", "").replace(/_/g, " ");
            sectorLabel = raw.charAt(0).toUpperCase() + raw.slice(1);
          }

          // 2. Robust Elected Status Binary Check
          const val = survey.elected;
          const isElected =
            val === 1 ||
            val === "1" ||
            val === true ||
            (typeof val === "string" && val.toLowerCase().trim() === "yes");

          return {
            ...survey,
            derived_sector: sectorLabel,
            elected: isElected ? "Yes" : "No",
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

  // --- Filter Helpers ---
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

  const hasEnoughData = filteredSurveyData.length >= MIN_SURVEY_COUNT;

  const currentGraphs = searchTerm
    ? filteredGraphTitles
    : ALL_GRAPHS.filter((graph) => graph.tab === activeTab);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Survey Analysis Dashboard
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Analyze policymaker research engagement patterns with interactive
            filters.
          </p>
        </header>

        {/* Filters Section (Sticky) */}
        <div className="sticky top-[64px] z-30 bg-white pt-4 pb-2 shadow-sm -mx-4 px-4 md:-mx-8 md:px-8 transition-all border-b">
          <section className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Filters
            </h2>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 flex flex-wrap gap-4">
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

          <section className="mb-4">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
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
                  responses
                </p>
              </div>

              <div className="w-full md:w-96">
                <div className="relative">
                  <input
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-slate-500 focus:border-slate-500"
                    placeholder="Search graphs by title..."
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-2">
              <span
                className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-lg border ${
                  hasEnoughData
                    ? "text-emerald-800 bg-emerald-50 border-emerald-200"
                    : "text-amber-800 bg-amber-50 border-amber-200"
                }`}
              >
                {hasEnoughData
                  ? "✓ Sufficient data"
                  : `⚠ Need ${MIN_SURVEY_COUNT}+ responses`}
              </span>
            </div>
          </section>
        </div>

        {loading ? (
          <div className="flex justify-center py-12 text-gray-600">
            Loading surveys...
          </div>
        ) : filteredSurveyData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No data found matching your filters.
          </div>
        ) : (
          <>
            {!searchTerm && (
              <div className="mt-8">
                <DashboardTabs
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                />
              </div>
            )}

            {hasEnoughData ? (
              <section className="mb-12 mt-6">
                <div className="space-y-8">
                  {currentGraphs.map((graph) => (
                    <div
                      key={graph.id}
                      id={graph.id} // ID for Navbar scrolling
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
                  {currentGraphs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      No graphs found for this search.
                    </div>
                  )}
                </div>
              </section>
            ) : (
              <section className="mb-12 mt-8 bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Insufficient Data for Analysis
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};
