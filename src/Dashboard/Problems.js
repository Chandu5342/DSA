import { useEffect, useState } from "react";
import Profile from "./Profile";
import { auth ,db} from "../Configuration";
import { addDoc, collection, getDocs, query,deleteDoc, doc, updateDoc, where } from "firebase/firestore";
import { data } from "react-router-dom";
import CircularProgress from "./CicularProgress";
import ThinArcChart from "./CircularSvg";


function Problems(props)
{

    const [ProblemList, SetProblemList] = useState([]); 
    const [dupProblemList, SetdupProblemList] = useState([]);
    const [Difficulty, setDifficulty] = useState("");
    const [Topic, setTopic] = useState("");
    const [Platform, setPlatform] = useState("");
    const [progress, setProgress] = useState(0);
    const [EasyT,setEasyT]=useState(0);
    const [MediumT,setMediumT]=useState(0);
    const [HardT,setHardT]=useState(0);
    const [EasyS,setEasyS]=useState(0);
    const [MediumS,setMediumS]=useState(0);
    const [HardS,setHardS]=useState(0);
    
    // Dropdown Data
    const [DifficultyDD, setDifficultyDd] = useState([]);
    const [TopicDD, setTopicDd] = useState([]);
    const [PlatformDD, setPlatformDd] = useState([]);
 // Mapping for Displaying Labels
 const [DifficultyMap, setDifficultyMap] = useState({});
 const [TopicMap, SetTopicMap] = useState({});
 const [PlatformMap, SetPlatformMap] = useState({});

    // Load Dropdowns
    const LoadDifficulty = async () => {
        const res = await getDocs(collection(db, "Difficulty"));
        const diffData = {};
        const diffDropdown = res.docs.map(doc => {
            diffData[doc.id] = doc.data().DifficultyModel.DifficultyName;
            return { value: doc.id, Lable: doc.data().DifficultyModel.DifficultyName };
        });
        setDifficultyDd(diffDropdown);
        setDifficultyMap(diffData);
    };

    const LoadTopic = async () => {
        const res = await getDocs(collection(db, "Topic"));
        const topicData = {};
        const topicDropdown = res.docs.map(doc => {
            topicData[doc.id] = doc.data().TopicModel.TopicName;
            return { value: doc.id, Lable: doc.data().TopicModel.TopicName };
        });
        setTopicDd(topicDropdown);
        SetTopicMap(topicData);
    };

    const LoadPlatform = async () => {
        const res = await getDocs(collection(db, "Platform"));
        const platformData = {};
        const platformDropdown = res.docs.map(doc => {
            platformData[doc.id] = doc.data().PlatformModel.PlatFormName;
            return { value: doc.id, Lable: doc.data().PlatformModel.PlatFormName };
        });
        setPlatformDd(platformDropdown);
        SetPlatformMap(platformData);
    };



    // Handle Filters
    useEffect(() => {
        let filteredList = [...dupProblemList];

        if (Difficulty && Difficulty !== "All") {
            filteredList = filteredList.filter(data => data.Difficulty === Difficulty);
        }

        if (Platform && Platform !== "All") {
            filteredList = filteredList.filter(data => data.Platform === Platform);
        }

        if (Topic && Topic !== "All") {
            filteredList = filteredList.filter(data => data.Topic === Topic);
        }

        SetProblemList(filteredList);
    }, [Difficulty, Platform, Topic]);

    const dbProblem=collection(db,'Problems');
    const LoadProblemList=async ()=>{
        const res=await getDocs(query(dbProblem))
        const TopicList = res.docs.map(doc => ({
            Difficulty:doc.data().AddNewProbModel.Difficulty,
            Link:doc.data().AddNewProbModel.Link,
            Platform:doc.data().AddNewProbModel.Platform,
            ProblemName:doc.data().AddNewProbModel.ProblemName,
            Topic:doc.data().AddNewProbModel.Topic,
            Id:doc.id
        }));
        SetProblemList(TopicList);
        SetdupProblemList(TopicList); // Save a copy of original data
    
        
    }
    

     //load problemstatus
     let dbProbStatus=collection(db,'ProbStatus');
     let [SolvedProblems,SetSolvedProblems] = useState([])

     const handletogglestatus = async (problemid, ischecked) => {
        if (!problemid || !props.id) {
            console.error("Missing problemid or userid", { problemid, userid: props.id });
            return; // Stop execution if values are missing
        }
    
        if (ischecked) {
            try {
                await addDoc(dbProbStatus, {
                    userid: props.id,
                    ProblemId: problemid,
                    Status: true
                });
                SetSolvedProblems(prev => [...prev, problemid]);
                console.log(`✅ Problem ${problemid} marked as solved for user ${props.id}`);
            } catch (error) {
                console.error("Error adding problem status:", error);
            }
        } else {
            try {
                const probstatusres = await getDocs(query(dbProbStatus,
                    where("userid", "==", props.id),
                    where("ProblemId", "==", problemid)
                ));
    
                if (probstatusres.empty) {
                    console.warn(`⚠️ No matching record found for problem ${problemid} and user ${props.id}`);
                    return;
                }
    
                probstatusres.forEach(async (doc) => {
                    await deleteDoc(doc.ref);
                    console.log(`🗑 Deleted problem status for problem ${problemid} and user ${props.id}`);
                });

                SetSolvedProblems(prev => prev.filter(id => id !== problemid));
            } catch (error) {
                console.error("Error deleting problem status:", error);
            }
        }
    };
    
    

     const loadsolvedprob=async()=>{
        const res=await getDocs(query(dbProbStatus,
            where("userid","==",props.id),
            where("Status","==",true)
        ));
        const solvedids=res.docs.map(doc=>doc.data().ProblemId);
        SetSolvedProblems(solvedids);
     }
     const Suffle = () => {
        let unsolvedProblems = dupProblemList.filter(problem => !SolvedProblems.includes(problem.Id));
    
        if (unsolvedProblems.length === 0) {
            console.log("All problems are solved!");
            return;
        }
    
        let randomProblem = unsolvedProblems[Math.floor(Math.random() * unsolvedProblems.length)];
    
        // 👇 Fix applied here
        SetProblemList([randomProblem]);
    };
    
     const ProgressCaluc = () => {
        // Calculate counts first
        const easyTotal = dupProblemList.filter(i => DifficultyMap[i.Difficulty]?.toLowerCase() === "easy").length;
        const mediumTotal = dupProblemList.filter(i => DifficultyMap[i.Difficulty]?.toLowerCase() === "medium").length;
        const hardTotal = dupProblemList.filter(i => DifficultyMap[i.Difficulty]?.toLowerCase() === "hard").length;
    
        const easySolved = dupProblemList.filter(i => SolvedProblems.includes(i.Id) && DifficultyMap[i.Difficulty]?.toLowerCase() === "easy").length;
        const mediumSolved = dupProblemList.filter(i => SolvedProblems.includes(i.Id) && DifficultyMap[i.Difficulty]?.toLowerCase() === "medium").length;
        const hardSolved = dupProblemList.filter(i => SolvedProblems.includes(i.Id) && DifficultyMap[i.Difficulty]?.toLowerCase() === "hard").length;
    
        // Now update state at once
        setEasyT(easyTotal);
        setMediumT(mediumTotal);
        setHardT(hardTotal);
    
        setEasyS(easySolved);
        setMediumS(mediumSolved);
        setHardS(hardSolved);
    };
    
     useEffect(() => {
        
        if (ProblemList.length > 0) {
            setProgress((SolvedProblems.length / dupProblemList.length) * 100);
        }
    }, [SolvedProblems, ProblemList]);
    useEffect(() => {
        ProgressCaluc();  // Runs after `dupProblemList` and `SolvedProblems` update
    }, [dupProblemList, SolvedProblems, DifficultyMap]);
    useEffect(()=>{
           LoadProblemList();
           LoadDifficulty();
           LoadTopic();
           LoadPlatform();
           loadsolvedprob();     
    },[])
 
    return (
        <>
            <div className="progress-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}>
                    {Math.round(progress)}%
                </div>
            </div>
            {props.role === "yes" && (
                <button className="add-button" onClick={() => {
                    window.location.href = "/Role/RoleDashboard";
                }}>Role Mode</button>
            )}
            <div className="probnav">
                <div className="filters">
                    <input type="text" className="filsearch" placeholder="enter" />
                    <label htmlFor="difficulty-filter">Difficulty:</label>
                    <select id="difficulty-filter" onChange={e => setDifficulty(e.target.value)}>
                        <option value="All">All</option>
                        {DifficultyDD.length > 0
                            ? DifficultyDD.map(item => <option key={item.value} value={item.value}>{item.Lable}</option>)
                            : <option>Loading...</option>}
                    </select>
                    <label htmlFor="platform-filter">Platform:</label>
                    <select id="platform-filter" onChange={e => setPlatform(e.target.value)}>
                        <option value="All">All</option>
                        {PlatformDD.length > 0
                            ? PlatformDD.map(item => <option key={item.value} value={item.value}>{item.Lable}</option>)
                            : <option>Loading...</option>}
                    </select>
                    <label htmlFor="topic-filter">Topic:</label>
                    <select id="topic-filter" onChange={e => setTopic(e.target.value)}>
                        <option value="All">All</option>
                        {TopicDD.length > 0
                            ? TopicDD.map(item => <option key={item.value} value={item.value}>{item.Lable}</option>)
                            : <option>Loading...</option>}
                    </select>
                </div>
                <div className="suffleButton" onClick={Suffle}>
                    <span><i className="fa-solid fa-shuffle suffle"></i></span>
                    <span>Pick a problem</span>
                </div>
            </div>
            <div className="problems-container">
                <div className="problems-list">
                    {ProblemList.map((item, index) => (
                        <div className="problem-card" key={item.Id}>
                            <div className="problem-info">
                                <span className="problem-name">{item.ProblemName}</span>
                                <span className="problem-platform">{PlatformMap[item.Platform]}</span>
                                <span className={`difficulty problem-difficulty ${item.Difficulty.toLowerCase()}`}>
                                    {DifficultyMap[item.Difficulty]}
                                </span>
                                <span className="problem-topic">{TopicMap[item.Topic]}</span>
                                <input
                                    type="checkbox"
                                    checked={SolvedProblems.includes(item.Id)}
                                    onChange={(e) => handletogglestatus(item.Id, e.target.checked)}
                                />
                            </div>
                            <a className="solve-link" href={item.Link} target="_blank" rel="noopener noreferrer">
                                Solve →
                            </a>
                        </div>
                    ))}
                </div>
                <div className="sidebarp">
                    <div className="progress-container">
                        <ThinArcChart
                            easy={EasyT} medium={MediumT} hard={HardT}
                            easySolved={EasyS} mediumSolved={MediumS} hardSolved={HardS}
                        />
                    </div>
                    <div className="leaderboard-container">
                        <h3>Leaderboard</h3>
                        <ul className="leaderboard-list">
                            <li className="leaderboard-item">
                                <span>#1 Abhishek Sharma</span>
                                <span>181039</span>
                            </li>
                            <li className="leaderboard-item">
                                <span>#2 Rohan Kumar</span>
                                <span>147520</span>
                            </li>
                            <li className="leaderboard-item">
                                <span>#3 Shaikh Tabrez</span>
                                <span>147475</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Problems