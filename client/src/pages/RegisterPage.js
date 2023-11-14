import { useState } from "react";
const BASE_URL = "https://blogger-a1rxqtb9o-anu0108.vercel.app/"


export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  async function register(event){
    event.preventDefault();
     const response = await fetch(`${BASE_URL}/register`,{
      method:"POST",
      body:JSON.stringify({username,password}),
      headers:{"Content-Type":"application/json"}
    })
    if(response.status === 200){
      
      alert("Registration Successful")
    }else{
      alert("Registration failed")
    }
  }
  return (
    <form className="register" onSubmit={register}>
      <h1>Register</h1>
      <input
        type="text"
        placeholder="username"
        value={username}
        onChange={(event) =>setUsername(event.target.value)}
      />
      <input
        type="password"
        placeholder="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
      />
      <button>Register</button>
    </form>
  );
}
