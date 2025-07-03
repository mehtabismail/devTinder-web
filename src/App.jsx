import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Profile } from "./pages/INDEX.JS";
import Body from "./Body.jsx";
import { QueryProvider } from "./providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter basename='/'>
        <Routes>
          <Route path='/' element={<Body />}>
            <Route path='/login' element={<Login />} />
            <Route path='/profile' element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
