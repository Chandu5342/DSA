import { useState } from "react"
import AddNewProb from "../Dashboard/AddNewProb"
import Profile from "../Dashboard/Profile"
import "./RoleDashboard.css"
import Problems from "../Dashboard/Problems";
import ProblemsR from "./ProblemsR";
import AddNewTeamMem from "./AddNewTeamMem";
function RoleDashboard(){
     const [Page,setPage]=useState("");
     
    return(
        <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="logo">BlazorApp2</h2>
        <button className="sidebar-button" onClick={()=>{setPage('0')}}>ProblemList</button>
        <button className="sidebar-button"  onClick={()=>{setPage('1')}}>Add New Role</button>
       
      </div>
      
      <div className="main-section">
          {/* Top Navigation Bar */}
          <div className="top-nav">
          <a href="#" className="nav-link">About</a>
        </div>
        <div className="content-area">
          {  Page==0 && 
          <>  
          <button className="add-button" onClick={()=>{
           setPage('2');
           }}>Add New Problem</button>
           <ProblemsR></ProblemsR></>}
          {Page==1 &&  <AddNewTeamMem></AddNewTeamMem>} 
          {Page==2 && <AddNewProb></AddNewProb>} 
        </div>
      </div>
    </div>
    )
}
export default RoleDashboard