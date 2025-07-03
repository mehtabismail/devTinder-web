import React from "react";

export default function Login() {
  return (
    <div
      className='hero min-h-screen bg-cover bg-center'
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1495616811223-4c6ababd9c6a?auto=format&fit=crop&w=1374&q=80')",
      }}
    >
      <div className='hero-overlay bg-opacity-60'></div>
      <div className='hero-content flex-col text-center text-neutral-content'>
        <h1 className='mb-5 text-5xl font-bold'>Welcome to Dev Tinder</h1>
        <div className='card w-full max-w-sm bg-base-100 shadow-2xl'>
          <form className='card-body'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Email</span>
              </label>
              <input
                type='email'
                placeholder='email'
                className='input input-bordered'
                required
              />
            </div>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Password</span>
              </label>
              <input
                type='password'
                placeholder='password'
                className='input input-bordered'
                required
              />
              <label className='label'>
                <a href='#' className='link-hover label-text-alt link'>
                  Forgot password?
                </a>
              </label>
            </div>
            <div className='form-control mt-6'>
              <button className='btn btn-primary'>Login</button>
            </div>
            <p className='pt-3 text-center text-sm'>
              Don't have an account?{' '}
              <a href='#' className='link-hover link font-semibold'>
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}