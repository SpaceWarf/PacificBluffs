import './Profile.scss';
import PasswordCard from './PasswordCard/PasswordCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import ProfileCard from '../Common/ProfileCard';

function Profile() {
  const profile = useSelector((state: RootState) => state.profile.info);
  return (
    <div className="Profile">
      <ProfileCard profile={profile} editable />
      <PasswordCard />
    </div>
  );
}

export default Profile;