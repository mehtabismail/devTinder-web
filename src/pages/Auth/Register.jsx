import React, { useState, useEffect } from "react";
import { useSignup } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/authSlice";
import { useToast } from "../../hooks/useToast";
import { useNavigate } from "react-router-dom";
import { cloudinary } from "../../config";

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    gender: "male",
    age: 18,
    location: "",
    photoUrl: "",
    about: "",
    skills: [],
  });
  const [tempSkill, setTempSkill] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const { success, error: showError } = useToast();

  // Handle signup success/error
  useEffect(() => {
    afterApiCalled();
  }, [
    signupMutation.isSuccess,
    signupMutation.isError,
    signupMutation.data,
    signupMutation.error,
  ]);

  const afterApiCalled = () => {
    if (signupMutation.isSuccess) {
      console.log("Signup successful:", signupMutation.data);
      setIsSubmitting(false);
      // If the API returns user data (auto-login), handle it
      if (signupMutation.data) {
        dispatch(loginSuccess(signupMutation.data));
        success(`Account created successfully! Welcome to Dev Tinder!`);
        navigate("/");
      }
    }

    if (signupMutation.isError) {
      setIsSubmitting(false);
      const errorMsg =
        signupMutation.error?.response?.data?.message ||
        signupMutation.error?.message ||
        "Signup failed. Please try again.";
      showError(errorMsg);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview("");
    // Reset the file input value so the same file can be selected again
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "devtinder_preset"); // You'll need to set this up in your Cloudinary account
    formData.append("folder", "devTinder/profile");

    try {
      // TODO: Replace 'YOUR_CLOUD_NAME' with your actual Cloudinary cloud name
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinary.CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      throw new Error("Failed to upload image");
    }
  };

  const addSkill = () => {
    if (tempSkill.trim() && !formData.skills.includes(tempSkill.trim())) {
      if (formData.skills.length >= 5) {
        showError("You can only add up to 5 skills.");
        return;
      }
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, tempSkill.trim()],
      }));
      setTempSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const validateStep1 = () => {
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.email ||
      !formData.password
    ) {
      showError("Please fill in all required fields.");
      return false;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters long.");
      return false;
    }

    return true;
  };

  const handleStep1Submit = (e) => {
    e.preventDefault();
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleStep2Submit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      showError("Please select a profile image.");
      return;
    }

    if (formData.skills.length === 0) {
      showError("Please add at least one skill.");
      return;
    }

    if (!formData.about.trim()) {
      showError("Please write something about yourself.");
      return;
    }

    if (!formData.location.trim()) {
      showError("Please enter your location.");
      return;
    }

    if (formData.age < 13) {
      showError("You must be at least 13 years old to register.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Upload image to Cloudinary
      const imageUrl = await uploadToCloudinary(selectedImage);

      // Prepare final data for signup
      const signupData = {
        ...formData,
        photoUrl: imageUrl,
      };

      signupMutation.mutate(signupData);
    } catch {
      showError("Failed to upload image. Please try again.");
      setIsSubmitting(false);
    }
  };

  const goBackToStep1 = () => {
    setStep(1);
  };

  return (
    <>
      {/* Full Screen Loader Overlay */}
      {(signupMutation.isPending || isSubmitting) && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4'>
            <div className='loading loading-spinner loading-lg text-primary'></div>
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                Creating Your Account
              </h3>
              <p className='text-gray-600 text-sm'>
                Please wait while we set up your profile...
              </p>
            </div>
          </div>
        </div>
      )}

      <div className='min-h-screen bg-gradient-to-br from-primary/20 via-secondary/10 to-accent/20 flex items-center justify-center p-4'>
        <div className='card w-full max-w-md bg-base-100 shadow-2xl'>
          <div className='card-body'>
            {/* Logo and Title */}
            <div className='text-center mb-6'>
              <div className='text-4xl mb-2'>👨🏻‍💻</div>
              <h1 className='text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
                Dev Tinder
              </h1>
              <p className='text-base-content/60 mt-2'>
                {step === 1
                  ? "Join the developer community"
                  : "Complete your profile"}
              </p>

              {/* Step Indicator */}
              <div className='flex justify-center items-center mt-4 space-x-2'>
                <div
                  className={`w-3 h-3 rounded-full ${
                    step === 1 ? "bg-primary" : "bg-primary/30"
                  }`}
                ></div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    step === 2 ? "bg-primary" : "bg-primary/30"
                  }`}
                ></div>
              </div>
            </div>

            {step === 1 ? (
              /* Step 1: Basic Information */
              <form onSubmit={handleStep1Submit} className='space-y-4'>
                {/* Name Fields */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text font-medium'>First Name</span>
                    </label>
                    <input
                      type='text'
                      name='first_name'
                      placeholder='John'
                      className='input input-bordered w-full focus:input-primary'
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text font-medium'>Last Name</span>
                    </label>
                    <input
                      type='text'
                      name='last_name'
                      placeholder='Doe'
                      className='input input-bordered w-full focus:input-primary'
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>Email</span>
                  </label>
                  <input
                    type='email'
                    name='email'
                    placeholder='developer@example.com'
                    className='input input-bordered w-full focus:input-primary'
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>Password</span>
                  </label>
                  <input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    className='input input-bordered w-full focus:input-primary'
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                  <label className='label'>
                    <span className='label-text-alt text-base-content/60'>
                      Must be at least 6 characters
                    </span>
                  </label>
                </div>

                {/* Gender */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>Gender</span>
                  </label>
                  <select
                    name='gender'
                    className='select select-bordered w-full focus:select-primary'
                    value={formData.gender}
                    onChange={handleInputChange}
                    required
                  >
                    <option value='male'>Male</option>
                    <option value='female'>Female</option>
                    <option value='other'>Other</option>
                  </select>
                </div>

                <div className='form-control mt-6'>
                  <button type='submit' className='btn btn-primary w-full'>
                    Next Step
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Profile Details */
              <form onSubmit={handleStep2Submit} className='space-y-4'>
                {/* Image Upload */}
                <div className='form-control'>
                  <div className='flex flex-col items-center space-y-4'>
                    {imagePreview ? (
                      <div className='relative'>
                        <img
                          src={imagePreview}
                          alt='Preview'
                          className='w-32 h-32 rounded-full object-cover border-4 border-primary/20'
                        />
                        <button
                          type='button'
                          onClick={removeImage}
                          className='absolute -top-2 -right-2 btn btn-circle btn-xs btn-error'
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className='w-32 h-32 rounded-full border-4 border-dashed border-primary/30 flex items-center justify-center bg-base-200'>
                        <span className='text-primary/60 text-sm text-center'>
                          No image selected
                        </span>
                      </div>
                    )}
                    <input
                      type='file'
                      accept='image/*'
                      onChange={handleImageSelect}
                      className='file-input file-input-bordered file-input-primary w-full max-w-xs'
                      required
                    />
                  </div>
                </div>

                {/* Skills Input */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>Skills</span>
                  </label>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      placeholder={
                        formData.skills.length >= 5
                          ? "Maximum 5 skills reached"
                          : "Add a skill (press Enter)"
                      }
                      className='input input-bordered flex-1 focus:input-primary'
                      value={tempSkill}
                      onChange={(e) => setTempSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={formData.skills.length >= 5}
                    />
                    <button
                      type='button'
                      onClick={addSkill}
                      className='btn btn-primary'
                      disabled={
                        !tempSkill.trim() || formData.skills.length >= 5
                      }
                    >
                      Add
                    </button>
                  </div>
                  {/* Skills Tags */}
                  {formData.skills.length > 0 && (
                    <div className='flex flex-wrap gap-2 mt-3'>
                      {formData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className='badge badge-outline flex items-center gap-1 px-2 py-1 border-primary text-primary bg-transparent'
                        >
                          {skill}
                          <button
                            type='button'
                            onClick={() => removeSkill(skill)}
                            className='ml-1 text-error bg-transparent border-0 p-0 focus:outline-none cursor-pointer'
                          >
                            &times;
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Age and Location */}
                <div className='grid grid-cols-2 gap-3'>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text font-medium'>Age</span>
                    </label>
                    <input
                      type='number'
                      name='age'
                      min='13'
                      max='100'
                      placeholder='25'
                      className='input input-bordered w-full focus:input-primary'
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className='form-control'>
                    <label className='label'>
                      <span className='label-text font-medium'>Location</span>
                    </label>
                    <input
                      type='text'
                      name='location'
                      placeholder='New York, NY'
                      className='input input-bordered w-full focus:input-primary'
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                {/* About Section */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text font-medium'>
                      About Yourself
                    </span>
                  </label>
                  <textarea
                    name='about'
                    placeholder="Tell us about yourself, your interests, and what you're looking for..."
                    className='textarea textarea-bordered h-24 focus:textarea-primary w-full'
                    value={formData.about}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Navigation Buttons */}
                <div className='flex gap-3 mt-6'>
                  <button
                    type='button'
                    onClick={(e) => {
                      e.preventDefault();
                      goBackToStep1();
                    }}
                    className='btn btn-outline flex-1'
                  >
                    Back
                  </button>
                  <button
                    type='submit'
                    className='btn btn-primary flex-1'
                    disabled={signupMutation.isPending || isSubmitting}
                  >
                    Create Account
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Link */}
            <div className='text-center mt-6'>
              <span className='text-base-content/60'>
                Already have an account?{" "}
              </span>
              <a
                href='#'
                className='link link-primary font-medium'
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/login");
                }}
              >
                Sign in to Dev Tinder
              </a>
            </div>

            {/* Footer */}
            <div className='text-center mt-4'>
              <p className='text-xs text-base-content/40'>
                By creating an account, you agree to our Terms of Service and
                Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
