import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login, Profile } from "./pages/INDEX.JS";
import Body from "./Body.jsx";
import { QueryProvider } from "./providers/QueryProvider";
import { ReduxProvider } from "./providers/ReduxProvider";
import ToastContainer from "./components/ToastContainer";
import { Feed, Connections, Register, Requests } from "./pages";
import NotFound from "./components/NotFound.jsx";

function App() {
  return (
    <ReduxProvider>
      <QueryProvider>
        <BrowserRouter basename='/'>
          <Routes>
            <Route path='/' element={<Body />}>
              <Route path='/' element={<Feed />} />
              <Route path='/login' element={<Login />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/register' element={<Register />} />
              <Route path='/connections' element={<Connections />} />
              <Route path='/requests' element={<Requests />} />
              <Route path='*' element={<NotFound />} />
            </Route>
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </QueryProvider>
    </ReduxProvider>
  );
}

export default App;
