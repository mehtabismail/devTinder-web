import "./App.css";
import { NavBar, Login } from "./components";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
