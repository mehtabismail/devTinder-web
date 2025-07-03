import React from "react";
import UserInfo from "../../components/UserInfo";

export default function Profile() {
  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Profile</h1>
      <UserInfo />
    </div>
  );
}
