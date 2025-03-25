import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import {auth,db} from '../Configuration'
import {getDoc,setDoc,doc} from 'firebase/firestore'
import { toast } from 'react-toastify';

function Register()
{ 

    const [FName,setFName]=useState("")
    const [LName,setLName]=useState("")
    const [UserName,setUserName]=useState("")
    const [Email,setEmail]=useState("")
    const [Password,setPassword]=useState("") 
  

    const HandleRegister= async (e)=>{
        e.preventDefault();
        try{
         await  createUserWithEmailAndPassword(auth,Email,Password)
          const User=auth.currentUser
          console.log(User)
          if(User)
          {
            await setDoc(doc(db, "User", User.uid), {
                firstName: FName,
                lastName: LName,
                username: UserName,
                email: Email,
                Role:"no",
            });
          }
          console.log("created successfully");
          toast.success("Created Successfully",{position:'top-center'})
        }
        catch(error)
        {
           console.log(error.message);
           toast.error(error.message,{position:'top-center'})
        }
        
  };
    return(
        <>

            <div className="login-container">
                <h2>Sighn Up</h2>
                    <form onSubmit={HandleRegister}>
                        <label htmlFor="username">FirstName:</label>
                        <input type="text" id="username" name="username" value={FName} onChange={(e)=>setFName(e.target.value)} placeholder="FirstName" required></input>
                        <label htmlFor="username">LastName:</label>
                        <input type="text" id="username" name="username" value={LName} onChange={(e)=>setLName(e.target.value)} placeholder="LastName" required></input>
                        <label htmlFor="username">Email:</label>
                        <input type="text" id="username" name="username" value={Email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required></input>
                        <label htmlFor="username">Username:</label>
                        <input type="text" id="username" name="username" value={UserName} onChange={(e)=>setUserName(e.target.value)} placeholder="Enter your username" required></input>
                        <label htmlFor="password">Password:</label>
                        <input type="password" id="password" name="password" value={Password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" required></input>
                        <button type="submit">Submit</button>
                        <p className="forgot-password text-right">
                            Already Login<a href="/LoginRelated/login">Click Here</a>
                        </p>
                    </form>
                </div>
        </>
    )
}

export default Register