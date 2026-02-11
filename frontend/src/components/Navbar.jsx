import React from "react";
import { Link } from "react-router-dom"; // Ensure correct router import
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useNavigate } from "react-router-dom"; // For programmatic navigation
/**
 * [EDITABLE_VALUE]: Navigation Tab Labels
 * Functionality: These labels correspond to the tabs in the DashboardTabs component.
 * Changing a label here only changes the text in the dropdown, not the tab logic.
 */
const NAV_CATEGORIES = [
  { label: "Highlights", id: 0 },
  { label: "Evidence", id: 1 },
  { label: "Communication", id: 2 },
  { label: "Type", id: 3 },
];

/**
 * [GRAPH_REGISTRY_MAP]: Nested Menu Configuration
 * Functionality: Maps each navigation category to a list of specific graphs.
 * The 'id' here MUST match the 'id' of the graph div in HomePage.js for the jump-to logic to work.
 */
const GRAPHS_MAP = {
  0: [
    { id: "learn-freq", title: "Learning Frequency" }, // [CONFIGURABLE_TEXT]
    { id: "comm-methods", title: "Communication Methods" },
    { id: "topic-usefulness", title: "Topic Usefulness" },
    { id: "policy-pref", title: "Policy Preferences" },
  ],
  1: [
    { id: "learn-freq-tab1", title: "Learning Frequency (E)" },
    { id: "use-freq", title: "Usage Frequency" },
    { id: "open-mind", title: "Open-mindedness" },
    { id: "engagement-reasons", title: "Engagement Barriers" },
  ],
  2: [
    { id: "comm-rank-tab2", title: "Effectiveness Ranking" },
    { id: "reach-out-tab2", title: "Economist Outreach" },
  ],
  3: [
    { id: "new-existing-tab3", title: "New vs Existing" },
    { id: "interdisciplinary", title: "Interdisciplinary Prefs" },
    { id: "meta-analysis", title: "Meta-analysis vs Novel" },
    { id: "useful-factors", title: "Usefulness Factors" },
    { id: "treatment-effect", title: "Self-Assessed Effect" },
  ],
};

/**
 * Navbar Component
 * [COMPONENT_DESCRIPTION]: Acts as the global header. It provides:
 * 1. Global search state management for filtering graph titles.
 * 2. Navigation through a "jump-to" event system.
 * 3. User authentication controls (Login/Logout).
 */
export const Navbar = ({ searchTerm, setSearchTerm }) => {
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => logout();

  /**
   * [EVENT_DISPATCH_LOGIC]: goToGraph
   * Functionality: Instead of using standard routing, this dispatches a CustomEvent.
   * The HomePage listens for this event, switches the active tab state, and scrolls
   * the specific element ID into view.
   */
  const goToGraph = (tabId, graphId) => {
    const event = new CustomEvent("jump-to-graph", {
      detail: { tab: tabId, id: graphId },
    });
    window.dispatchEvent(event);
  };

  return (
    <header className="sticky top-0 z-[100] w-full bg-slate-800 text-white shadow-md border-b border-slate-700">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between px-3 py-4 space-y-2 sm:space-y-0">
        {/* [CONFIGURABLE_TEXT]: Brand/Application Title */}
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          What policymakers value
        </h1>

        {/* Functionality: Global Search Input. Updates parent state which filters HomePage graphs. */}
        {user && (
          <div className="w-full md:w-96">
            <input
              className="block w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-slate-500 focus:border-slate-500"
              placeholder="Search graphs by title..." // [CONFIGURABLE_TEXT]
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        <nav className="flex flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Functionality: Dropdown Menu for Graph Navigation */}
          {user && (
            <div className="relative group">
              <button className="px-4 py-1 rounded-full font-medium transition-colors hover:bg-slate-700 flex items-center gap-1 border border-slate-600">
                Graphs {/* [CONFIGURABLE_TEXT] */}
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Functionality: First Level - Categories (Highlights, Evidence, etc.) */}
              <div className="absolute left-0 mt-0 w-48 bg-white text-slate-800 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 border border-slate-200">
                {NAV_CATEGORIES.map((cat) => (
                  <div
                    key={cat.id}
                    className="relative group/item px-4 py-2 hover:bg-emerald-50 cursor-default flex justify-between items-center font-medium"
                  >
                    <span>{cat.label}</span>
                    <svg
                      className="w-3 h-3 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>

                    {/* Functionality: Second Level - Specific Graph Buttons */}
                    <div className="absolute left-full top-0 ml-1 w-64 bg-white text-slate-800 rounded-md shadow-2xl opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible py-2 border border-slate-200">
                      {GRAPHS_MAP[cat.id]?.map((g) => (
                        <button
                          key={g.id}
                          onClick={() => {
                            goToGraph(cat.id, g.id);
                            navigate(`/${cat.label.toLowerCase()}`);
                          }} // [NAV_LOGIC]: Dispatch jump-to event and navigate to the tab route
                          className="w-full text-left px-4 py-2 text-sm hover:bg-emerald-700 hover:text-white transition-colors"
                        >
                          {g.title}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Functionality: User Authentication Links & Logout */}
          {user ? (
            <>
              <span className="hidden lg:inline text-sm text-slate-300">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-1 bg-white text-slate-800 rounded-full font-semibold hover:bg-slate-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1 rounded-full font-medium hover:bg-slate-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1 rounded-full font-medium hover:bg-slate-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
