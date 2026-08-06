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
    <div className="py-12 px-6 lg:px-8 font-sans">
      <div className="w-full max-w-screen-xl mx-auto">
        <div className="bg-bg/90 backdrop-blur-md border border-ink/12 rounded-2xl shadow-xl p-10 lg:p-16 w-full">
          <h1 className="text-4xl lg:text-5xl font-bold text-core mb-8 text-center">
            Profile Information
          </h1>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8 text-ink/70 text-lg">
            <div className="flex flex-col">
              <dt className="font-medium text-ink/55">First Name</dt>
              <dd className="mt-1 text-ink">{user.firstName}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-ink/55">Last Name</dt>
              <dd className="mt-1 text-ink">{user.lastName}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-ink/55">Date of Birth</dt>
              <dd className="mt-1 text-ink">{user.dateOfBirth}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-ink/55">Gender</dt>
              <dd className="mt-1 text-ink">{user.genderID}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-ink/55">Nationality</dt>
              <dd className="mt-1 text-ink">{user.nationalityID}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="font-medium text-ink/55">Place of Birth</dt>
              <dd className="mt-1 text-ink">{user.placeOfBirthID}</dd>
            </div>
          </dl>

          <div className="mt-12 flex justify-center">
            <button
              onClick={handleEdit}
              className="px-10 py-4 bg-core hover:bg-ink text-bg font-semibold rounded-lg text-lg transition"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
