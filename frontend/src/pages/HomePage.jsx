import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { GridItem } from "../components/GridItem";
import { AreaChart } from "../components/AreaChart";
import { BarGraph } from "../components/BarGraph";
import { StackedGraph } from "../components/StackedGraph";

export const HomePage = () => {
  const [surveys, setSurveys] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  useEffect(() => {
    const fetchSurveys = async () => {
      if (loading) setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/surveys");
        const data = res.data;
        console.log(data.surveys);
        setSurveys(data.surveys); // Adjust based on your API response structure
        setLoading(false);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        setLoading(false);
      }
    };
    fetchSurveys();
  }, []);

  return (
    <div className="min-h-screen min-w-full bg-gradient-to-b from-slate-800 to-slate-900 text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Surveys</h1>
        {loading ? (
          <p>Loading surveys...</p>
        ) : surveys.length === 0 ? (
          <p>No surveys available.</p>
        ) : (
          <div className="grid mx-auto grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4  ">
            <GridItem
              title="How often policy makers learn about a piece of academic
economic research?"
            >
              <BarGraph data={surveys} column="how_often_learn" />
            </GridItem>
            <GridItem title="How often policymakers use academic economic research?">
              <BarGraph data={surveys} column="how_often_use" />
            </GridItem>
            <GridItem title="How often policymakers can engage open-mindedly?">
              <BarGraph data={surveys} column="foregone_conclusion" />
            </GridItem>
            <GridItem title="Reasons for not reading academic research?">
              <StackedGraph data={surveys} />
            </GridItem>
          </div>
        )}
      </div>
    </div>
  );
};
