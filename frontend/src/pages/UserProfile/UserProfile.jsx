import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    genderID: '',
    nationalityID: '',
    placeOfBirthID: '',
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('userProfile'));
    if (stored) setUser(stored);
    else {
      setUser({
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '2000-07-12',
        genderID: 'Female',
        nationalityID: 'New Zealande',
        placeOfBirthID: 'New Zealande',
      });
    }
  }, []);

  const handleEdit = () => navigate('/profile/edit');
  return (
    <div className="bg-gradient-to-br from-yellow-100 via-pink-100 to-green-100 rounded-2xl border-2 border-white py-12 px-6 lg:px-8 font-sans">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-xl p-10 lg:p-16 w-full">
          <h1 className="text-4xl lg:text-5xl font-bold text-purple-600 mb-8 text-center">
            Profile Information
          </h1>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-gray-700 text-lg">
            <div className="flex flex-col">
              <dt className="font-medium text-gray-500">First Name</dt>
              <dd className="mt-1 text-gray-800">{user.firstName}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-gray-500">Last Name</dt>
              <dd className="mt-1 text-gray-800">{user.lastName}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-gray-500">Date of Birth</dt>
              <dd className="mt-1 text-gray-800">{user.dateOfBirth}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-gray-500">Gender</dt>
              <dd className="mt-1 text-gray-800">{user.genderID}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-gray-500">Nationality</dt>
              <dd className="mt-1 text-gray-800">{user.nationalityID}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-gray-500">Place of Birth</dt>
              <dd className="mt-1 text-gray-800">{user.placeOfBirthID}</dd>
            </div>
          </dl>

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleEdit}
              className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg text-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
