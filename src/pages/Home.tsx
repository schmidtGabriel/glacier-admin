// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-4 container mx-auto flex flex-col items-center">
      <h1 className="text-xl font-bold">Logged Page</h1>

      <button
        onClick={() => navigate("/users")}
        className="bg-red-500 text-white p-2 mt-4 rounded cursor-pointer"
      >
        Users
      </button>
      <button
        onClick={() => auth.signOut()}
        className="bg-red-500 text-white p-2 mt-4 rounded cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
