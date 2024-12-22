import React from 'react';
import { User, Settings, Bell, Palette } from 'lucide-react';
import ProfileSettings from '../../components/Profile/ProfileSettings';
import ProfileHeader from './ProfileHeader';
import InvoiceSection from './InvoiceSection';

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