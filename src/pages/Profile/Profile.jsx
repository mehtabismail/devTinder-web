import React, { useState, useEffect } from "react";
import { useAuthState } from "../../hooks/useAuthState";
import { useToast } from "../../hooks/useToast";
import { useUpdateProfile } from "../../hooks/useAuth";
import { useDispatch } from "react-redux";
import { updateUser } from "../../store/authSlice";
import { FaQuoteLeft } from "react-icons/fa";
import { cloudinary } from "../../config";

export default function Profile() {
  const { user, isAuthenticated } = useAuthState();
  const [editData, setEditData] = useState({
    age: user?.age || "",
    gender: user?.gender || "",
    location: user?.location || "",
    skills: Array.isArray(user?.skills) ? user.skills : [],
    about: user?.about || "",
    photoUrl: user?.photoUrl || "",
  });

  const dispatch = useDispatch();
  const { success, error } = useToast();
  const updateProfileMutation = useUpdateProfile();

  // Add this state for tag-style skills input
  const [skillInput, setSkillInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);

  useEffect(() => {
    if (updateProfileMutation.isSuccess) {
      console.log(updateProfileMutation.data.user);
      dispatch(updateUser(updateProfileMutation.data?.user));
      success("Profile updated successfully!");
    }
    if (updateProfileMutation.isError) {
      // error(updateProfileMutation.error);
      error(updateProfileMutation?.error?.response?.data?.error);
    }
    // eslint-disable-next-line
  }, [
    updateProfileMutation.isSuccess,
    updateProfileMutation.isError,
    updateProfileMutation.data,
    updateProfileMutation.error,
  ]);

  if (!isAuthenticated) {
    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-6'>Profile</h1>
        <div className='alert alert-info'>Not logged in</div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for skills input
  const handleSkillInputChange = (e) => setSkillInput(e.target.value);
  const handleAddSkill = () => {
    const skill = skillInput.trim();
    if (skill && !editData.skills.includes(skill)) {
      setEditData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
    setSkillInput("");
  };
  const handleSkillKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };
  const handleRemoveSkill = (skill) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  // Image upload functions
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "devtinder_preset");
    formData.append("folder", "devTinder/profile");

    try {
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

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file for later upload
      setSelectedImageFile(file);

      // Show preview immediately
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditData((prev) => ({ ...prev, photoUrl: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Update save logic to send skills as array
  const handleSave = async () => {
    setIsUploading(true);

    try {
      let finalPhotoUrl = editData.photoUrl;

      // If there's a new image file, upload it first
      if (selectedImageFile) {
        const imageUrl = await uploadToCloudinary(selectedImageFile);
        finalPhotoUrl = imageUrl;
        setSelectedImageFile(null);
      }

      const payload = {
        age: editData.age,
        gender: editData.gender,
        location: editData.location,
        skills: editData.skills,
        about: editData.about,
        photoUrl: finalPhotoUrl,
      };

      updateProfileMutation.mutate({ userId: user._id, data: payload });
    } catch (error) {
      error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      {/* Full Screen Loader Overlay */}
      {(isUploading || updateProfileMutation.isPending) && (
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center'>
          <div className='bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center space-y-4'>
            <div className='loading loading-spinner loading-lg text-primary'></div>
            <div className='text-center'>
              <h3 className='text-lg font-semibold text-gray-800 mb-2'>
                {isUploading && !updateProfileMutation.isPending
                  ? "Uploading Image..."
                  : "Updating Your Profile"}
              </h3>
              <p className='text-gray-600 text-sm'>
                {isUploading && !updateProfileMutation.isPending
                  ? "Please wait while we upload your image..."
                  : "Please wait while we save your changes..."}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className='container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Card 2: Edit user details */}
        <div className='bg-[#181B23] rounded-3xl shadow-2xl px-4 sm:px-8 pt-8 pb-8 max-w-lg w-full mx-auto border border-[#282C37]'>
          <h2 className='text-2xl font-extrabold text-white mb-6 text-center tracking-tight'>
            Edit Profile
          </h2>
          <div className='space-y-5'>
            <div>
              <label className='label font-medium text-gray-300'>Age</label>
              <input
                className='input input-bordered w-full rounded-xl bg-[#23263A] text-white border-[#282C37] focus:ring-2 focus:ring-purple-500'
                name='age'
                value={editData.age}
                onChange={handleChange}
                type='number'
                min='0'
              />
            </div>
            <div>
              <label className='label font-medium text-gray-300'>Gender</label>
              <select
                className='select select-bordered w-full rounded-xl bg-[#23263A] text-white border-[#282C37] focus:ring-2 focus:ring-purple-500'
                name='gender'
                value={editData.gender}
                onChange={handleChange}
              >
                <option value=''>Select gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>
            <div>
              <label className='label font-medium text-gray-300'>
                Location
              </label>
              <input
                className='input input-bordered w-full rounded-xl bg-[#23263A] text-white border-[#282C37] focus:ring-2 focus:ring-purple-500'
                name='location'
                value={editData.location}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className='label font-medium text-gray-300'>Skills</label>
              <div className='flex gap-2 mb-2'>
                <input
                  className='input input-bordered flex-1 rounded-xl bg-[#23263A] text-white border-[#282C37] focus:ring-2 focus:ring-purple-500'
                  name='skillInput'
                  value={skillInput}
                  onChange={handleSkillInputChange}
                  onKeyDown={handleSkillKeyDown}
                  placeholder='Add a skill and press Enter'
                />
                <button
                  className='btn btn-primary'
                  type='button'
                  onClick={handleAddSkill}
                  disabled={!skillInput.trim()}
                >
                  Add
                </button>
              </div>
              <div className='flex flex-wrap gap-2'>
                {editData.skills.map((skill, idx) => (
                  <span
                    key={skill + idx}
                    className='badge badge-outline flex items-center gap-1 px-2 py-1 border-purple-500 text-purple-200 bg-[#23263A]'
                  >
                    {skill}
                    <button
                      type='button'
                      className='ml-1 text-error'
                      onClick={() => handleRemoveSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className='label font-medium text-gray-300'>Bio</label>
              <textarea
                className='textarea textarea-bordered w-full rounded-xl bg-[#23263A] text-white border-[#282C37] focus:ring-2 focus:ring-purple-500'
                name='about'
                value={editData.about}
                onChange={handleChange}
                rows={3}
              />
            </div>
            <div>
              <label className='label font-medium text-gray-300'>
                Profile Image
              </label>
              <div className='space-y-3'>
                {/* File Input */}
                <input
                  type='file'
                  accept='image/*'
                  onChange={handleImageSelect}
                  className='file-input file-input-bordered w-full rounded-xl bg-[#23263A] text-white border-[#282C37] focus:ring-2 focus:ring-purple-500 file:bg-purple-500 file:border-0 file:text-white'
                />
              </div>
            </div>
            <button
              className={`btn w-full mt-6 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold text-lg shadow-lg border-0 hover:scale-105 transition ${
                updateProfileMutation.isPending ? "loading" : ""
              }`}
              onClick={handleSave}
              disabled={updateProfileMutation.isPending || isUploading}
            >
              {updateProfileMutation.isPending ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>

        {/* Card 1: Show user details */}
        <div className='bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl px-4 sm:px-8 pt-8 pb-8 max-w-lg w-full mx-auto border border-purple-100 max-h-[90vh] overflow-y-auto'>
          {/* Profile image */}
          <div className='flex justify-center mb-4'>
            <div className='rounded-full bg-gradient-to-tr from-purple-400 to-indigo-400 p-1 shadow-lg'>
              <img
                className='w-32 h-32 rounded-full object-cover border-4 border-white'
                src={
                  editData.photoUrl ||
                  "https://via.placeholder.com/300x300?text=User"
                }
                alt={user?.first_name || "User"}
              />
            </div>
          </div>
          {/* Name and email */}
          <div className='text-center'>
            <h2 className='text-3xl font-extrabold text-gray-900'>
              {user?.first_name
                ? `${user.first_name} ${user.last_name}`
                : "N/A"}
            </h2>
            <p className='text-indigo-500 font-medium'>
              {user?.email || "N/A"}
            </p>
          </div>
          {/* ID, Age, Gender, Location */}
          <div className='flex flex-col items-center mt-4 space-y-1'>
            <span className='px-3 py-1 rounded-full border border-indigo-300 text-xs text-indigo-700 bg-indigo-50 mb-2'>
              ID: {user?._id || "N/A"}
            </span>
            <div className='flex gap-4 text-gray-700 font-semibold'>
              {editData.age && (
                <span>
                  <span className='font-bold'>Age:</span> {editData.age}
                </span>
              )}
              {editData.gender && (
                <span>
                  <span className='font-bold'>Gender:</span> {editData.gender}
                </span>
              )}
            </div>
            {editData.location && (
              <div className='text-gray-500'>
                <span className='font-bold'>Location:</span> {editData.location}
              </div>
            )}
          </div>
          {/* Skills */}
          {editData.skills &&
            Array.isArray(editData.skills) &&
            editData.skills.length > 0 && (
              <div className='flex flex-wrap justify-center gap-2 mt-4'>
                {editData.skills.map((skill, idx) => (
                  <span
                    key={skill + idx}
                    className='bg-gradient-to-r from-purple-400 to-indigo-400 text-white px-3 py-1 rounded-full text-xs font-semibold shadow'
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          {/* About */}
          {editData.about && (
            <div className='mt-6 px-2 pb-2 text-center'>
              <div className='flex justify-center mb-2 text-purple-400'>
                <FaQuoteLeft size={20} />
              </div>
              <p className='italic text-gray-600 text-base leading-relaxed'>
                {editData.about}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
