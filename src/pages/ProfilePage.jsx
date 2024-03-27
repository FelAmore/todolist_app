import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/authContext';
import defaultProfilePicture from '../assets/pfp.jpeg';
import { FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
    const { currentUser, userLoggedIn } = useAuth();
    const [syncMethod, setSyncMethod] = useState('');

    useEffect(() => {
        if (userLoggedIn) {
            // Update sync method based on the user's authentication provider
            const providerData = currentUser.providerData[0];
            if (providerData.providerId === 'password') {
                setSyncMethod('Email');
            } else if (providerData.providerId === 'google.com') {
                setSyncMethod('Google');
            }
        }
    }, [currentUser, userLoggedIn]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* Back Icon */}
            <Link to="/home" className="absolute top-2 left-2 m-4 flex items-center text-[#509be1] hover:text-[#72afe7]">
                <FiArrowLeft size={24} />
                <span className="ml-1 text-[#509be1] hover:text-[#72afe7]">Back to Homepage</span>
            </Link>

            {/* Display user profile information */}
            {userLoggedIn && (
                <div className="text-center space-y-6 p-12 shadow-xl border rounded-xl bg-[#fbf7f4] border-[#ffa0ad]">
                    {/* User's Profile Picture */}
                    <img
                        src={currentUser.photoURL || defaultProfilePicture} // Fallback to a default picture if none
                        alt="Profile"
                        className="mx-auto rounded-full w-20 h-20 object-cover"
                    />

                    {/* User's Email as Username */}
                    <h1 className="text-2xl font-semibold text-[#509be1]">User: {currentUser.email}</h1>

                    {/* Sync Method */}
                    <p className="text-2xl font-semibold text-[#509be1]">
                        Sync: <span className="font-semibold text-[#509be1]">{syncMethod}</span>
                    </p>
                </div>
            )}
        </div>

    );
};

export default ProfilePage;


