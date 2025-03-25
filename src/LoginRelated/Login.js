import React, { useState } from "react"
import './Login.css';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../Configuration";
import { toast } from 'react-toastify';
function Login()
{
        const [Email,setEmail]=useState("")
          const [Password,setPassword]=useState("") 
        

    const handleSubmit=async (e)=>{
        console.log("")
       // console.log(Email,Password);
        e.preventDefault();
        try{
           await signInWithEmailAndPassword(auth,Email,Password);
            console.log("created successfully");
             toast.success("Login Successfully",{position:'top-center'})
             setInterval(() => {
                window.location.href="/Dashboard/Profile";
             }, 1000);
           
        }
        catch(error)
        {
               console.log(error.message);
             toast.error(error.message,{position:'top-center'})
        }
    };
    return(
        <>
   <div class="login-container">
    <h2>Login Form</h2>
        <form onSubmit={handleSubmit} method="POST">
         
            <label for="username">Email:</label>
            <input type="text" id="username" name="username" value={Email} onChange={(e)=>setEmail(e.target.value)} placeholder="Enter your email" required></input>
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" value={Password} onChange={(e)=>setPassword(e.target.value)} placeholder="Enter your password" required></input>
            <button type="submit" className="lb">Login</button>
            <p className="forgot-password text-right">
                New user <a href="/LoginRelated/register">Register Here</a>
            </p>
        </form>
     </div>
        </>
    )
}

export default  Login