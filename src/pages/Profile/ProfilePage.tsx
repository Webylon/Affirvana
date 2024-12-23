import React from 'react';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import ProfileSettings from '../../components/Profile/ProfileSettings';
import InvoiceSection from '../../components/Profile/InvoiceSection';

const ProfilePage: React.FC = () => {
  return (
    <div className="container max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="grid gap-4 sm:gap-6">
        {/* Profile Header Section */}
        <div className="w-full">
          <ProfileHeader />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Invoice Section - Full width on mobile, left column on desktop */}
          <div className="lg:col-span-2">
            <InvoiceSection />
          </div>

          {/* Settings Section - Full width on mobile, right column on desktop */}
          <div className="lg:col-span-2">
            <ProfileSettings />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;