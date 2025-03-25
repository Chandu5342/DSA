import { useEffect, useState } from "react";
import "./ProblemsR.css";
import { db } from "../Configuration";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ProblemsR() {
    const [ProblemList, SetProblemList] = useState([]);
    const [dupProblemList, SetdupProblemList] = useState([]);
    const [showdelete, Setshowdelete] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Dropdown Data
    const [DifficultyDD, setDifficultyDd] = useState([]);
    const [TopicDD, setTopicDd] = useState([]);
    const [PlatformDD, setPlatformDd] = useState([]);

    // Filter State
    const [Difficulty, setDifficulty] = useState("");
    const [Topic, setTopic] = useState("");
    const [Platform, setPlatform] = useState("");

    // Mapping for Displaying Labels
    const [DifficultyMap, setDifficultyMap] = useState({});
    const [TopicMap, SetTopicMap] = useState({});
    const [PlatformMap, SetPlatformMap] = useState({});

    // Load Problems
    const dbProblem = collection(db, "Problems");
    const LoadProblemList = async () => {
        const res = await getDocs(dbProblem);
        const problemList = res.docs.map(doc => ({
            Difficulty: doc.data().AddNewProbModel.Difficulty,
            Link: doc.data().AddNewProbModel.Link,
            Platform: doc.data().AddNewProbModel.Platform,
            ProblemName: doc.data().AddNewProbModel.ProblemName,
            Topic: doc.data().AddNewProbModel.Topic,
            Id: doc.id
        }));
        SetProblemList(problemList);
        SetdupProblemList(problemList); // Save a copy of original data
    };

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

    // Handle Delete
    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "Problems", deleteId));
            Setshowdelete(false);
            toast.success("Deleted Successfully", { position: "top-center" });
            LoadProblemList(); // Reload after deletion
        } catch (error) {
            console.log(error);
        }
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

    // Load Data on Mount
    useEffect(() => {
        LoadProblemList();
        LoadDifficulty();
        LoadTopic();
        LoadPlatform();
    }, []);

    return (
        <>
            <div className="filters">
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

            <table id="problems-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Problem Name</th>
                        <th>Difficulty</th>
                        <th>Platform</th>
                        <th>Topic</th>
                        <th>Link</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ProblemList.map((item, index) => (
                        <tr key={item.Id}>
                            <td>{index + 1}</td>
                            <td>{item.ProblemName}</td>
                            <td>{DifficultyMap[item.Difficulty] || "N/A"}</td>
                            <td>{PlatformMap[item.Platform] || "N/A"}</td>
                            <td>{TopicMap[item.Topic] || "N/A"}</td>
                            <td><a href={item.Link} target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-link"></i></a></td>
                            <td>
                            <span><i class="fa-solid fa-shuffle"></i></span>
                                <Link to={`/Dashboard/AddNewProb?id=${item.Id}`}><i className="fa-solid fa-pen-to-square acic"></i></Link>
                                <i className="fa-solid fa-trash" style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} onClick={() => { setDeleteId(item.Id); Setshowdelete(true); }}></i>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showdelete && (
                <div className="popup-overlay">
                    <div className="popup-form">
                        <h2>Confirm Delete</h2>
                        <p>Are you sure you want to delete this problem?</p>
                        <div className="popup-buttons">
                            <button className="delete-btn" onClick={handleDelete}>Delete</button>
                            <button className="cancel-btn" onClick={() => Setshowdelete(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ProblemsR;