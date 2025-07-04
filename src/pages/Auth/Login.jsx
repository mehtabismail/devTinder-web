import React, { useState, useEffect } from "react";
import { useLogin } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("mehtab.16465@gmail.com");
  const [password, setPassword] = useState("Abcd@123");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const { success, error: showError } = useToast();

  // Handle login success/error
  useEffect(() => {
    afterApiCalled();
  }, [
    loginMutation.isSuccess,
    loginMutation.isError,
    loginMutation.data,
    loginMutation.error,
  ]);

  const afterApiCalled = () => {
    if (loginMutation.isSuccess) {
      console.log("Login successful:", loginMutation.data);
      dispatch(loginSuccess(loginMutation.data));
      success(`Login successful! Welcome back!`);
      navigate("/");
      // You can redirect here or show success message
      // window.location.href = '/dashboard';
    }

    if (loginMutation.isError) {
      const errorMsg =
        loginMutation.error?.response?.data?.message ||
        loginMutation.error?.message ||
        "Login failed. Please try again.";
      showError(errorMsg);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center p-4 '>
      <div className='card w-full max-w-md bg-base-100 shadow-2xl'>
        <div className='card-body'>
          {/* Logo and Title */}
          <div className='text-center mb-6'>
            <div className='text-4xl mb-2'>👨🏻‍💻</div>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              Dev Tinder
            </h1>
            <p className='text-base-content/60 mt-2'>
              Connect with developers worldwide
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className='space-y-4'>
            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Email</span>
              </label>
              <input
                type='email'
                placeholder='developer@example.com'
                className='input input-bordered w-full focus:input-primary'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className='form-control'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <input
                type='password'
                placeholder='Enter your password'
                className='input input-bordered w-full focus:input-primary'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label className='label'>
                <a
                  href='#'
                  className='label-text-alt link link-hover link-primary'
                >
                  Forgot password?
                </a>
              </label>
            </div>

            <div className='form-control mt-6'>
              <button
                type='submit'
                className={`btn btn-primary w-full ${
                  loginMutation.isPending ? "loading" : ""
                }`}
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Divider */}
          {/* <div className='divider'>OR</div> */}

          {/* Social Login Options */}
          {/* <div className='space-y-3'>
            <button className='btn btn-outline w-full'>
              <svg className='w-5 h-5 mr-2' viewBox='0 0 24 24'>
                <path
                  fill='currentColor'
                  d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                />
                <path
                  fill='currentColor'
                  d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                />
                <path
                  fill='currentColor'
                  d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                />
                <path
                  fill='currentColor'
                  d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                />
              </svg>
              Continue with Google
            </button>

            <button className='btn btn-outline w-full'>
              <svg
                className='w-5 h-5 mr-2'
                fill='currentColor'
                viewBox='0 0 24 24'
              >
                <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z' />
              </svg>
              Continue with GitHub
            </button>
          </div> */}

          {/* Sign Up Link */}
          <div className='text-center mt-6'>
            <span className='text-base-content/60'>
              Don't have an account?{" "}
            </span>
            <a
              onClick={() => navigate("/register")}
              className='link link-primary font-medium'
            >
              Sign up for Dev Tinder
            </a>
          </div>

          {/* Footer */}
          <div className='text-center mt-4'>
            <p className='text-xs text-base-content/40'>
              By signing in, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
