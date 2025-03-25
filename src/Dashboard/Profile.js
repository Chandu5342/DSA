import { useEffect, useRef, useState } from "react";
import react from "react";
import { auth ,db} from "../Configuration";
import { doc,getDoc } from "firebase/firestore";
import  {toast} from "react-toastify"; 
import './Profile.css';
import Problems from "./Problems";
function Profile()
{
    let [UserDet,SetUserDet]=useState(null);
    const fetchUserData = async()=>{
          auth.onAuthStateChanged(async(user)=>{
              console.log(user);
              if(user!=null)
              {
                const userdoc=doc(db,"User",user.uid);
                const getuser=await getDoc(userdoc);
                if(getuser)
                {
                   SetUserDet({...getuser.data(),id:user.uid});  
                  
                }
              }
              else{
                console.log("User is not Loggdin")
              }
          });
    };
    useEffect(()=>{
       fetchUserData();
       console.log("hel",UserDet);
    },[UserDet])

    async function Logout()
    {
    console.log("hello");
      try{
         await auth.signOut();
         console.log("User Logout Successfully");
         window.location.href="/LoginRelated/login";
        
      }
      catch(error)
      {
           console.log("error.message");
      }
    }

    function log()
    {
        console.log("hai");
    }

 
   return(
  //   UserDet?(
  //          <>
  //             <h3>User Name:{UserDet.firstName}</h3>
  //             <div>
  //                <p>Email:{UserDet.email}</p>
  //                <p>firstname:{UserDet.firstName}</p>
  //                <p>lastname:{UserDet.lastName}</p>
  //             </div>
  //             <button onClick={Logout}>Logout</button>
  //          </>
  //   ):(
  //           <p>Loading......</p>
  //   )
    <>
  
      <div className="header">
            <h1 className="heading" >DSA Dashboard</h1>
            <nav className="navbar">
                <a><li>Home</li></a>
                <a><li>Profile</li></a>
                <a><li>About Us</li></a>
                <a><li>Contact Us</li></a>
                <a onClick={Logout}><li>Logout</li></a>
             
            </nav>
        </div>
        
        {UserDet ?
         <>
         <div className="Probmain">
         <Problems role={UserDet.Role}  id={UserDet.id} /> 
         </div></>: 
          <>
         <p>Loading...</p>
         </>}
    </>
   )

}
export default Profile;