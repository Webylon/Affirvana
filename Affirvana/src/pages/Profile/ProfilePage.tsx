import React from 'react';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileSettings from '../../components/Profile/ProfileSettings';
import InvoiceSection from '../../components/Profile/InvoiceSection';

const ProfilePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <ProfileHeader />
      <InvoiceSection />
      <ProfileSettings />
    </div>
  );
};

export default ProfilePage;