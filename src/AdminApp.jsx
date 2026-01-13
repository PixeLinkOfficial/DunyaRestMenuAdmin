import { useEffect, useState } from "react";
import Login from "./components/Login";
import App from "./App"; // your existing menu app

export default function AdminApp({ lang, setLang }) {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("admin_token") === "ok") setAuthed(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setAuthed(false);
  };

  if (!authed) return <Login onSuccess={() => setAuthed(true)} />;

  return (
    <div style={{fontFamily:"Arial, sans-serif"}}>
      <div 
        style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          padding:"10px 20px",
          background:"#3b6cb7",
          color:"#fff",
          fontWeight:"600",
          boxShadow:"0 2px 6px rgba(0,0,0,0.1)"
        }}
      >
        <span>Admin mode</span>
        <button 
          onClick={handleLogout} 
          style={{
            background:"#fff",
            color:"#3b6cb7",
            border:"none",
            borderRadius:"4px",
            padding:"6px 12px",
            cursor:"pointer",
            fontWeight:"600",
            transition:"background 0.2s ease"
          }}
          onMouseOver={(e)=>e.currentTarget.style.background="#f0f0f0"}
          onMouseOut={(e)=>e.currentTarget.style.background="#fff"}
        >
          Logout
        </button>
      </div>
      <App lang={lang} setLang={setLang} isAdmin />
    </div>
  );
}
