import { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query,deleteDoc, doc, updateDoc ,getDoc,setDoc} from "firebase/firestore";
import { auth ,db} from "../Configuration";
import  {toast} from "react-toastify"; 
import Profile from "./Profile";    
import { useLocation } from "react-router-dom";
function AddNewProb() {

    let [isshowpopup,setshowpopup]=useState(false)
    let [isshowpopupDiff,setshowpopupDiff]=useState(false)
    
    let [isshowpopupTopic,setshowpopupTopic]=useState(false)
    let [UserId,setUserId]=useState("0")
    let [AddNewProbModel,setAddNewProbModel]=useState(
        {
            ProblemName:"",
            Difficulty:"",
            Platform:"",
            Link:"",
            Topic:""
        }
    )
    const location=useLocation()
    const qp=new URLSearchParams(location.search);
    const  problemid=qp.get('id');
    const [loading, setLoading] = useState(true);
     // Function to load problem data by ID
     const loadProblemById = async () => {
        if (problemid) {
            console.log("Fetching problem with ID:", problemid);

            const problemDoc = doc(db, "Problems", problemid);
            const getData = await getDoc(problemDoc);

            if (getData.exists()) {
                console.log("Problem data fetched:", getData.data());
                setAddNewProbModel(getData.data().AddNewProbModel);
                console.log("data",AddNewProbModel)
            } else {
                console.log("No problem found with this ID");
            }
         
            setLoading(false); // Stop loading after data is fetched
        } else {
            setLoading(false);
        }
    };
    const fetchUserData = async()=>{
        
            auth.onAuthStateChanged(async(user)=>{
                console.log(user);
                if(user!=null)
                {
                setUserId(user.uid);
                console.log("userid exist");
                }
            });
    };
    const dbAddProb = collection(db, 'Problems');
    const handleSubmit=async(event)=>{
        event.preventDefault();
        try{
            console.log("handlesubmit calling....")
            if(problemid)
            {
                console.log("update call ")
                await setDoc(doc(db, "Problems", problemid), {
                         AddNewProbModel
                        });
                    console.log("Updated Successfully");
                    toast.success("Updated Successfully",{position:'top-center'})
            }
            else{
            const decref=await addDoc(dbAddProb,{AddNewProbModel});
            console.log("Created Successfully");
            toast.success("Created Successfully",{position:'top-center'})
            }
            setInterval(() => {
                window.location.href="/Role/RoleDashboard";
            }, 500);
            setAddNewProbModel({
                ProblemName: "",
                Difficulty: "",
                Platform: "",
                Link: "",
                Topic: ""
            });
        }
        catch(error)
        {
            console.log("Created failed");
        }
           

    };
   
    const fetchDDPlatform = async()=>{
        try {
            const querySnapshot = await getDocs(query(dbPlatform)); 
            const platformList = querySnapshot.docs.map(doc => ({
                Value: doc.id,
                Lable: doc.data().PlatformModel.PlatFormName  
            }));
            const uniquePlatforms = Array.from(new Map(platformList.map(item => [item.Lable, item])).values());
            console.log("Fetched Platforms:", uniquePlatforms); 
            setPlatformDd(uniquePlatforms);
        } catch (error) {
            console.error("Error fetching platforms:", error);
        }
    };
    
   



    //platform

    let [PlatformModel,setPlatformModel]=useState({
        PlatFormName:"",
        Link:"",
        CreatedBy:""
    }) 
    const [PlatformDD,setPlatformDd]=useState([]);
    const dbPlatform = collection(db, 'Platform');
    const handlePlatForm=async ()=>{
        try {
            console.log(UserId);
            setPlatformModel({...PlatformModel,CreatedBy:UserId})
            const docRef = await addDoc(dbPlatform, {PlatformModel});
            console.log("Created Successfully");
             toast.success("Created Successfully",{position:'top-center'})
             await fetchDDPlatform();
           
        } catch (e) {
            console.error('Error adding document:', e);
            toast.error(e,{position:'top-center'})
        }
        setshowpopup(false);
    }
    
     const handlePlatformDD=(e)=>{
        const { name, value } = e.target;
        console.log(name,value);
        setAddNewProbModel(AddNewProbModel=>({...AddNewProbModel,Platform:value}))
        
     };


     //difficulty
      
    let [DifficultyModel,setDifficultyModel]=useState({
        DifficultyName:"",
        CreatedBy:""
    }) 
    const [DifficultyDD,setDifficultyDd]=useState([]);
    const dbDifficulty = collection(db, 'Difficulty');
    const fetchDDDiff = async()=>{
        try {
            const querySnapshot = await getDocs(query(dbDifficulty)); 
            const DiffList = querySnapshot.docs.map(doc => ({
                Value: doc.id,
                Lable: doc.data().DifficultyModel.DifficultyName  
            }));
            const uniqueDiff = Array.from(new Map(DiffList.map(item => [item.Lable, item])).values());
            console.log("Fetched difficulty:", uniqueDiff); 
            setDifficultyDd(uniqueDiff);
        } catch (error) {
            console.error("Error fetching platforms:", error);
        }
    };

    const handleDifficulty=async ()=>{
        try {
            console.log(UserId);
            setDifficultyModel({...DifficultyModel,CreatedBy:UserId})
            const docRef = await addDoc(dbDifficulty, {DifficultyModel});
            console.log("Created Successfully");
             toast.success("Created Successfully",{position:'top-center'})
             await fetchDDDiff();
           
        } catch (e) {
            console.error('Error adding document:', e);
            toast.error(e,{position:'top-center'})
        }
        setshowpopupDiff(false);
    }
    
     const handleDifficultyDD=(e)=>{
        const { name, value } = e.target;
        console.log(name,value);
        setAddNewProbModel(AddNewProbModel=>({...AddNewProbModel,Difficulty:value}))
        
     };

  //Topic
     let [TopicModel,setTopicModel]=useState({
        TopicName:"",
        CreatedBy:""
    }) 
    const [TopicDD,setTopicDd]=useState([]);
    const dbTopic = collection(db, 'Topic');
    const handleTopic=async ()=>{
        try {
            console.log(UserId);
            setTopicModel({...TopicModel,CreatedBy:UserId})
            const docRef = await addDoc(dbTopic, {TopicModel});
            console.log("Created Successfully");
             toast.success("Created Successfully",{position:'top-center'})
             await fetchDDTopic();
           
        } catch (e) {
            console.error('Error adding document:', e);
            toast.error(e,{position:'top-center'})
        }
        setshowpopupTopic(false);
    }
    
     const handleTopicDD=(e)=>{
        const { name, value } = e.target;
        console.log(name,value);
        setAddNewProbModel(AddNewProbModel=>({...AddNewProbModel,Topic:value}))
        
     };

     const fetchDDTopic = async()=>{
        try {
            const querySnapshot = await getDocs(query(dbTopic)); 
            const TopicList = querySnapshot.docs.map(doc => ({
                Value: doc.id,
                Lable: doc.data().TopicModel.TopicName  
            }));
            const uniqueTopic = Array.from(new Map(TopicList.map(item => [item.Lable, item])).values());
            console.log("Fetched Topic:", uniqueTopic); 
            setTopicDd(uniqueTopic);
        } catch (error) {
            console.error("Error fetching Topic:", error);
        }
    };



     const DDLoad= async ()=>{
        await fetchDDPlatform();
        await fetchDDDiff();
        await fetchDDTopic();
    }
     useEffect(()=>{
        fetchUserData();
        DDLoad();
        loadProblemById();
        //console.log("Updated AddNewProbModel:", AddNewProbModel);
    },[])
    return (
        <>
            

                <div className="login-container">
                    <h2>{problemid ? (<>Edit Problem</>):(<>New Problem</>)}</h2>
                    <form >
                        <label htmlFor="username">Problem Name:</label>
                        <input type="text" id="username" name="username"  value={AddNewProbModel.ProblemName} 
                         onChange={(e)=>{setAddNewProbModel({...AddNewProbModel,ProblemName:e.target.value})}}
                          placeholder="Enter Problem Name" required />

                        {/* Topic Dropdown with + Button */}
                        <label htmlFor="Topic">Topic:</label>
                        <div className="dropdown-container">
                            <select name="Topic" id="Topic" required  value={AddNewProbModel.Topic}   onChange={handleTopicDD}>
                            <option>Select</option>
                                {TopicDD.length > 0 ? (
                                    TopicDD.map(top => (
                                        <option key={top.Value} value={top.Value}>{top.Lable}</option>
                                    ))
                                ) : (
                                    <option value="">Loading...</option>
                                )}
                            </select>
                            <button type="button" className="ab"  onClick={()=>{
                                console.log(isshowpopupTopic);
                                setshowpopupTopic(true)}}>+</button>
                        </div>

                        {/* Difficulty Dropdown with + Button */}
                        <label htmlFor="Difficulty">Difficulty:</label>
                        <div className="dropdown-container">
                            <select name="Difficulty" id="Difficulty" required  value={AddNewProbModel.Difficulty}   onChange={handleDifficultyDD}>
                                <option>Select</option>
                                {DifficultyDD.length > 0 ? (
                                    DifficultyDD.map(dif => (
                                        <option key={dif.Value} value={dif.Value}>{dif.Lable}</option>
                                    ))
                                ) : (
                                    <option value="">Loading...</option>
                                )}
                            </select>
                            <button type="button" className="ab"  onClick={()=>{
                                console.log(isshowpopupDiff);
                                setshowpopupDiff(true)}}>+</button>
                        </div>

                        {/* Platform Dropdown with + Button */}
                        <label htmlFor="Platform">Platform:</label>
                        <div className="dropdown-container">
                        <select name="Platform" id="Platform"  value={AddNewProbModel.Platform}  required onChange={handlePlatformDD}>
                                <option>Select</option>
                                {PlatformDD.length > 0 ? (
                                    PlatformDD.map(pvm => (
                                        <option key={pvm.Value} value={pvm.Value}>{pvm.Lable}</option>
                                    ))
                                ) : (
                                    <option value="">Loading...</option>
                                )}
                            </select>

                            <button type="button" className="ab" onClick={()=>{
                                console.log(isshowpopup);
                                setshowpopup(true)}}>+</button>
                        </div>
                        <label htmlFor="username">Problem Link:</label>
                        <input type="text" id="username" name="username" value={AddNewProbModel.Link} 
                         onChange={(e)=>{setAddNewProbModel({...AddNewProbModel,Link:e.target.value})}}  placeholder="Enter Problem Link" required />
                       <button type="button" className="lb" onClick={handleSubmit}>
                            Submit
                        </button>
                    </form>
                </div>


                        {isshowpopup && (
                            <div className="popup-overlay">
                                <div className="popup-form">
                                    <h2>Add New Platform</h2>
                                    <label htmlFor="platform-name">Platform Name:</label>
                                    <input type="text" id="platform-name" value={PlatformModel.PlatFormName} onChange={(e)=>{
                                        setPlatformModel({...PlatformModel,PlatFormName:e.target.value})
                                    }} placeholder="Enter Platform Name" required />

                                    <label htmlFor="platform-link">Platform Link:</label>
                                    <input type="url" id="platform-link" value={PlatformModel.Link} onChange={(e)=>{
                                        setPlatformModel({...PlatformModel,Link:e.target.value})
                                    }} placeholder="Enter Platform Link" required />

                                    <div className="popup-buttons">
                                        <button className="add-btn" onClick={handlePlatForm}>Add</button>
                                        <button className="close-btn" onClick={()=>setshowpopup(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {isshowpopupDiff && (
                            <div className="popup-overlay">
                                <div className="popup-form">
                                    <h2>Add New Difficulty Level</h2>
                                    <label htmlFor="platform-name">Difficulty Name:</label>
                                    <input type="text" id="platform-name" value={DifficultyModel.DifficultyName} onChange={(e)=>{
                                        setDifficultyModel({...DifficultyModel,DifficultyName:e.target.value})
                                    }} placeholder="Enter Difficulty Name" required />
                                    <div className="popup-buttons">
                                        <button className="add-btn" onClick={handleDifficulty}>Add</button>
                                        <button className="close-btn" onClick={()=>setshowpopupDiff(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )} 


                         {isshowpopupTopic && (
                            <div className="popup-overlay">
                                <div className="popup-form">
                                    <h2>Add New Topic</h2>
                                    <label htmlFor="platform-name">Topic Name:</label>
                                    <input type="text" id="platform-name" value={PlatformModel.TopicName} onChange={(e)=>{
                                        setTopicModel({...TopicModel,TopicName:e.target.value})
                                    }} placeholder="Enter Platform Name" required />

                                    <div className="popup-buttons">
                                        <button className="add-btn" onClick={handleTopic}>Add</button>
                                        <button className="close-btn" onClick={()=>setshowpopupTopic(false)}>Cancel</button>
                                    </div>
                                </div>
                            </div>
                        )}         
        </>
    );
}
export default AddNewProb;