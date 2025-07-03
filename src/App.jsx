import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Profile } from "./pages/INDEX.JS";
import Body from "./Body.jsx";
import { QueryProvider } from "./providers/QueryProvider";
import { ReduxProvider } from "./providers/ReduxProvider";

function App() {
  return (
    <ReduxProvider>
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
    </ReduxProvider>
  );
}

export default App;
