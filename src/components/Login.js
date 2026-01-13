import { useState } from "react";

export default function Login({ onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123456789") {
      localStorage.setItem("admin_token", "ok");
      onSuccess();
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f5f5f5"}}>
      <form 
        onSubmit={handleLogin} 
        style={{
          padding: "30px",
          textAlign: "center",
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "300px"
        }}
      >
        <h2 style={{marginBottom:"20px",color:"#333"}}>Admin Login</h2>

        <label style={{display:"block",marginBottom:"6px",fontWeight:"600",color:"#444"}}>Username</label>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{
            display:"block",
            width:"100%",
            padding:"8px",
            marginBottom:"15px",
            border:"1px solid #ccc",
            borderRadius:"4px",
            fontSize:"14px"
          }}
        />

        <label style={{display:"block",marginBottom:"6px",fontWeight:"600",color:"#444"}}>Password</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          style={{
            display:"block",
            width:"100%",
            padding:"8px",
            marginBottom:"20px",
            border:"1px solid #ccc",
            borderRadius:"4px",
            fontSize:"14px"
          }}
        />

        <button 
          type="submit" 
          style={{
            marginTop:"5px",
            borderRadius:"6px",
            padding:"10px 20px",
            background:"#007bff",
            color:"#fff",
            border:"none",
            cursor:"pointer",
            fontWeight:"600",
            fontSize:"14px"
          }}
        >
          Login
        </button>
      </form>
    </div>
  );
}
