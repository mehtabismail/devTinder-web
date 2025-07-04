import React from "react";
import devTinderLogo from "../assets/logo.png";
import { useAuthState } from "../hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export default function NavBar() {
  const { user, isAuthenticated, logout } = useAuthState();

  const navigate = useNavigate();

  const logoutHandler = async () => {
    await authService.logout();
    navigate("/login");
    logout();
  };
  return (
    <div className='navbar bg-base-300'>
      <div className='flex-1'>
        <a
          onClick={() => {
            navigate("/");
            document.activeElement.blur();
          }}
          className='btn btn-ghost text-xl border-none hover:border-none hover:bg-transparent active:bg-transparent focus:outline-none shadow-none'
        >
          <div className='w-36 mt-2'>
            <img src={devTinderLogo} alt='Dev Tinder logo' />
          </div>
        </a>
      </div>
      <div className='flex gap-2'>
        <div className='dropdown dropdown-end mx-5'>
          {isAuthenticated && (
            <div className='flex items-center'>
              <p className='mr-2'>Welcome, {user?.first_name}</p>
              <div
                tabIndex={0}
                role='button'
                className='btn btn-ghost btn-circle avatar'
              >
                <div className='w-10 rounded-full'>
                  <img
                    alt='Tailwind CSS Navbar component'
                    src={user?.photoUrl || "https://via.placeholder.com/150"}
                  />
                </div>
              </div>
            </div>
          )}
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow'
          >
            {/* <li>
              <a className='justify-between'>Profile</a>
            </li> */}
            <li>
              <a
                onClick={() => {
                  navigate("/profile");
                  document.activeElement.blur();
                }}
              >
                Profile
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/connections");
                  document.activeElement.blur();
                }}
              >
                Connections
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  navigate("/requests");
                  document.activeElement.blur();
                }}
              >
                Requests
              </a>
            </li>
            <li>
              <a
                onClick={() => {
                  logoutHandler();
                  document.activeElement.blur();
                }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
