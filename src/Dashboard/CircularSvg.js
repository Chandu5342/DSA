import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"]; // Green, Yellow, Red

const ThinArcChart = ({ easy, medium, hard, easySolved, mediumSolved, hardSolved }) => {
  const radius = 70;
  const innerRadius = 60; // Thin Arc
  const startAngle = 210; // Start from the left
  const endAngle = -30; // Ends on the right

  // Calculate total problems and total solved
  const totalProblems = easy + medium + hard;
  const totalSolved = easySolved + mediumSolved + hardSolved;

  // Define total problems per section
  const totalData = [
    { name: "Easy", value: easy, color: "#ddd" },
    { name: "Medium", value: medium, color: "#ddd" },
    { name: "Hard", value: hard, color: "#ddd" },
  ];

  // Define solved problems per section
  const solvedData = [
    { name: "Easy", value: easySolved, color: COLORS[0] },
    { name: "Medium", value: mediumSolved, color: COLORS[1] },
    { name: "Hard", value: hardSolved, color: COLORS[2] },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {/* Arc Chart */}
      <div style={{ position: "relative", width: "200px", height: "200px" }}>
        <PieChart width={200} height={200}>
          {/* Background Arc */}
          <Pie
            data={totalData}
            cx="50%"
            cy="50%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={radius}
            fill="#ddd"
            dataKey="value"
            stroke="none"
          />

          {/* Solved Progress Arc */}
          <Pie
            data={solvedData}
            cx="50%"
            cy="50%"
            startAngle={startAngle}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={radius}
            dataKey="value"
            stroke="none"
          >
            {solvedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
        </PieChart>

        {/* Centered Text for Progress */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          {totalSolved}/{totalProblems}
        </div>
      </div>

      {/* Side Progress Details */}
      <div style={{ color: "#fff", fontSize: "14px" }}>
        <div style={{ color: COLORS[0] }} className="lab">🟢 Easy: {easySolved}/{easy}</div>
        <div style={{ color: COLORS[1] }} className="lab">🟡 Medium: {mediumSolved}/{medium}</div>
        <div style={{ color: COLORS[2] }} className="lab">🔴 Hard: {hardSolved}/{hard}</div>
        <div style={{ fontWeight: "bold" }} className="lab">⚡ Total: {totalSolved}/{totalProblems}</div>
      </div>
    </div>
  );
};

export default ThinArcChart;
