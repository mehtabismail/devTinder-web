import React from "react";
import { useAuthState } from "../hooks/useAuthState";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import { authService } from "../services/auth.service";
import { FaQuoteLeft } from "react-icons/fa";

export default function UserInfo() {
  const { user, isAuthenticated, logout } = useAuthState();
  const { success, error } = useToast();
  const navigate = useNavigate();

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
    <div className='max-w-md mx-auto bg-white/90 rounded-3xl shadow-2xl overflow-hidden p-0'>
      {/* Header with gradient and wavy divider */}
      <div className='relative h-32 bg-gradient-to-r from-purple-500 to-indigo-500'>
        <svg
          className='absolute bottom-0 left-0 w-full'
          viewBox='0 0 500 50'
          preserveAspectRatio='none'
        >
          <path d='M0,0 Q250,50 500,0 L500,50 L0,50 Z' fill='#fff' />
        </svg>
      </div>
      {/* Profile image */}
      <div className='flex justify-center -mt-16'>
        <img
          className='w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-200'
          src={user.photoUrl || "https://via.placeholder.com/300x300?text=User"}
          alt={user.first_name || "User"}
        />
      </div>
      {/* Name and email */}
      <div className='text-center mt-2 px-6'>
        <h2 className='text-3xl font-extrabold text-gray-900'>
          {user.first_name} {user.last_name}
        </h2>
        <p className='text-indigo-500 font-medium'>{user.email}</p>
      </div>
      {/* ID, Age, Gender, Location */}
      <div className='flex flex-col items-center mt-4 space-y-1 px-6'>
        <span className='px-3 py-1 rounded-full border border-indigo-300 text-xs text-indigo-700 bg-indigo-50 mb-2'>
          ID: {user._id}
        </span>
        <div className='flex gap-4 text-gray-700 font-semibold'>
          <span>
            <span className='font-bold'>Age:</span> {user.age}
          </span>
          <span>
            <span className='font-bold'>Gender:</span> {user.gender}
          </span>
        </div>
        <div className='text-gray-500'>
          <span className='font-bold'>Location:</span> {user.location}
        </div>
      </div>
      {/* Skills */}
      <div className='flex flex-wrap justify-center gap-2 mt-4 px-6'>
        {user.skills &&
          user.skills.map((skill, idx) => (
            <span
              key={skill + idx}
              className='bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow'
            >
              {skill}
            </span>
          ))}
      </div>
      {/* About */}
      {user.about && (
        <div className='mt-6 px-8 pb-8 text-center'>
          <div className='flex justify-center mb-2 text-purple-400'>
            <FaQuoteLeft size={20} />
          </div>
          <p className='italic text-gray-600 text-base leading-relaxed'>
            {user.about}
          </p>
        </div>
      )}
      {/* Logout button */}
      <div className='flex justify-center pb-6'>
        <button
          className='btn btn-error btn-sm mt-2'
          onClick={async () => {
            try {
              await authService.logout();
              logout();
              success("Logged out successfully");
              navigate("/login");
            } catch {
              error("Logout failed");
            }
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
