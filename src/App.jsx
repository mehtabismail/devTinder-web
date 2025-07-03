import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Profile } from "./pages/INDEX.JS";
import Body from "./Body.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
