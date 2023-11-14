import { useContext, useEffect, useState } from "react";
import {Link} from "react-router-dom"
import { UserContext } from "./UserContext";

export default function Header() {
  const [name,setName] = useState("");
  const {setUserInfo,userInfo} = useContext(UserContext)
  useEffect(()=>{
    const fetchData = async () =>{
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/profile`, {
          credentials: "include",
        });
        
        
        if(response.status === 200){
          const userInfo = await response.json();
        setUserInfo(userInfo);
          setName(userInfo?.username)
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    }
    fetchData()
    // fetch("http://localhost:4000/profile",{
    //   credentials:"include"
    // }).then((response)=>{
    //   response.json().then(userInfo =>{
    //     setUserInfo(userInfo)
    //   })
    // })
  },[setUserInfo])


  function logout(){
    fetch(`${process.env.REACT_APP_BASE_URL}/logout`,{
      credentials:"include",
      method:"POST",
    });
    setUserInfo(null);
  }

  const username = userInfo?.username




  return (
    <header>
      <Link to="/" className="logo">
        Blogger
      </Link>
      <nav>
        {username && (
          <>
            {/* <span>Hello ,{username}</span> */}
            <Link to="/create">Create new post</Link>
            <Link onClick={logout}>Logout({name})</Link>
          </>
        )}
        {!username && (
          <>
          <Link to="/login">Login </Link>
          <Link to="/register">Register </Link>
          </>
        )}
        
      </nav>
    </header>
  );
};
