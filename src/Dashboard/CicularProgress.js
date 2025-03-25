import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
function CircularProgress()
{
    const solved = 3000;
    const total = 3496;
    const progressPercentage = (solved / total) * 100;
    return(
    <>
        <div style={{ width: 150, height: 150 }}>
            <CircularProgressbar
                value={progressPercentage}
                text={`${solved}/${total}`}
                styles={buildStyles({
                textColor: "#000",
                pathColor: "#fbc02d",
                trailColor: "#ddd",
                })}
            />
            </div>
    
    </>
    )
}
export default CircularProgress