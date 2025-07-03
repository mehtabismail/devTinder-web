import React from "react";
import { useAuthState } from "../hooks/useAuthState";

export default function UserInfo() {
  const { user, isAuthenticated, logout } = useAuthState();

  if (!isAuthenticated) {
    return (
      <div className='alert alert-info'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          className='stroke-current shrink-0 w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          ></path>
        </svg>
        <span>Not logged in</span>
      </div>
    );
  }

  return (
    <div className='card bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title'>User Information</h2>
        <div className='space-y-2'>
          <p>
            <strong>Name:</strong> {user?.name || "N/A"}
          </p>
          <p>
            <strong>Email:</strong> {user?.email || "N/A"}
          </p>
          <p>
            <strong>ID:</strong> {user?.id || "N/A"}
          </p>
          {user?.bio && (
            <p>
              <strong>Bio:</strong> {user.bio}
            </p>
          )}
          {user?.location && (
            <p>
              <strong>Location:</strong> {user.location}
            </p>
          )}
        </div>
        <div className='card-actions justify-end'>
          <button className='btn btn-error btn-sm' onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
