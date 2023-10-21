import ProfilePlaceholder from '../../assets/images/profile-placeholder.png';
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useAuth } from '../../contexts/AuthContext';
import { ProfileInfo, setPfpUrl } from '../../redux/reducers/profile';
import { isValidEmail } from '../../utils/email';
import { updateProfileInfo } from '../../utils/firestore';
import Header from './Header';
import Input from './Input';
import ClockedInLabel from './ClockedInLabel';
import { isValidPhone } from '../../utils/phone';
import { deleteProfilePicture, getProfilePictureUrl, uploadProfilePicture } from '../../utils/storage';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { SyntheticEvent } from 'react';
import { isEqual } from 'lodash';
import Dropdown, { DropdownOption } from './Dropdown';

interface ProfileCardProps {
  profile: ProfileInfo;
  editable?: boolean;
  nameAsTitle?: boolean;
}

function ProfileCard({ profile, editable, nameAsTitle }: ProfileCardProps) {
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const pfpUrlFromStore = useSelector((state: RootState) => state.profile.pfpUrl);
  const { roles } = useSelector((state: RootState) => state.roles);
  const { divisions } = useSelector((state: RootState) => state.divisions);

  const [loadedPfpUrl, setLoadedPfpUrl] = useState('');
  const [uploadedPfp, setUploadedPfp] = useState<File | null>(null);

  const [name, setName] = useState(profile.name);
  const [nameError, setNameError] = useState(false);

  const [phone, setPhone] = useState(profile.phone);
  const [phoneError, setPhoneError] = useState(false);

  const [email, setEmail] = useState(profile.email);
  const [emailError, setEmailError] = useState(false);

  const [bleeter, setBleeter] = useState(profile.bleeter);
  const [bleeterError, setBleeterError] = useState(false);

  const [bank, setBank] = useState(profile.bank);
  const [bankError, setBankError] = useState(false);

  const [division, setDivision] = useState(profile.division);
  const [profileRoles, setProfileRoles] = useState(profile.roles);

  const [loading, setLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setNameError(false);
    setPhone(profile.phone);
    setPhoneError(false);
    setEmail(profile.email);
    setEmailError(false);
    setBleeter(profile.bleeter);
    setBleeterError(false);
    setBank(profile.bank);
    setBankError(false);
    setUploadedPfp(null);
    setDivision(profile.division);
    setProfileRoles(profile.roles);

    if (user && user.uid !== profile.id && profile.pfp) {
      getProfilePictureUrl(profile.pfp).then(url => setLoadedPfpUrl(url));
    }
  }, [profile, user]);

  function validateNotEmpty(value: string, errorSetter: Dispatch<SetStateAction<boolean>>) {
    if (editable) {
      errorSetter(!value.length);
    }
  }

  function validateEmail() {
    if (editable) {
      if (!email.length || isValidEmail(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
  }

  function validatePhone() {
    if (editable) {
      if (phone.length && isValidPhone(phone)) {
        setPhoneError(false);
      } else {
        setPhoneError(true);
      }
    }
  }

  function setValue(
    value: string,
    setter: Dispatch<SetStateAction<string>>,
    errorSetter: Dispatch<SetStateAction<boolean>>,
    required = false
  ) {
    setter(value);

    if (required) {
      validateNotEmpty(value, errorSetter);
    }
  }

  function canSave(): boolean {
    return !nameError && !phoneError && !emailError && !bleeterError && !bankError;
  }

  function isDataUpdated(): boolean {
    return name !== profile.name
      || phone !== profile.phone
      || email !== profile.email
      || bleeter !== profile.bleeter
      || bank !== profile.bank
      || division !== profile.division
      || !isEqual(profileRoles, profile.roles)
      || !!uploadedPfp;
  }

  function handleCancel() {
    setName(profile.name);
    setNameError(false);
    setPhone(profile.phone);
    setPhoneError(false);
    setEmail(profile.email);
    setEmailError(false);
    setBleeter(profile.bleeter);
    setBleeterError(false);
    setBank(profile.bank);
    setBankError(false);
    setUploadedPfp(null);
    setDivision(profile.division);
    setProfileRoles(profile.roles);
  }

  async function handleSave() {
    const updatedProfile: ProfileInfo = {
      id: profile.id,
      admin: profile.admin,
      clockedIn: profile.clockedIn,
      name,
      phone,
      email,
      bleeter,
      bank,
      division,
      roles: profileRoles,
      pfp: profile.pfp
    };

    setLoading(true);

    if (uploadedPfp) {
      const extention = uploadedPfp.name.split('.').pop();
      const filename = `${profile.id}.${extention}`;
      updatedProfile.pfp = filename;
      await deleteProfilePicture(profile.pfp);
      await uploadProfilePicture(uploadedPfp, filename);
      dispatch(setPfpUrl(await getProfilePictureUrl(filename)));
    }

    updateProfileInfo(profile.id, updatedProfile);
    setLoading(false);
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 5000);
  }

  function handleSelectImage(files: FileList | null) {
    if (files && files.length) {
      const img = files[0];
      setUploadedPfp(img);
    }
  }

  function getProfilePicture() {
    if (uploadedPfp) {
      return URL.createObjectURL(uploadedPfp);
    } else if (user && user.uid === profile.id && pfpUrlFromStore) {
      return pfpUrlFromStore;
    } if (user && user.uid !== profile.id && loadedPfpUrl) {
      return loadedPfpUrl;
    } else {
      return ProfilePlaceholder;
    }
  }

  function getDivisionDropdownOptions(): DropdownOption[] {
    return divisions.map(division => ({
      key: division.id,
      text: division.name,
      value: division.id,
    }));
  }

  function getRolesDropdownOptions(): DropdownOption[] {
    return roles
      .filter(role => role.division === division)
      .map(role => ({
        key: role.id,
        text: role.name,
        value: role.id,
      }));
  }

  function handleChangeDivision(e: SyntheticEvent, { value }: any) {
    setProfileRoles([]);
    setDivision(value);
  }

  function handleChangeRole(e: SyntheticEvent, { value }: any) {
    setProfileRoles(value);
  }

  return (
    <div className='ProfileCard'>
      <div className="ui card attached">
        <div className="content">
          <div className='ProfilePicture'>
            <img src={getProfilePicture()} alt="Profile" />
            {editable && <div className='UploadOverlay'>
              <i className='upload icon'></i>
            </div>}
            {editable && <input
              className='FileInput'
              type="file"
              accept='.png, .jpg, .jpeg, .gif, .webp'
              name="myImage"
              onChange={event => handleSelectImage(event.target.files)}
            />}
          </div>
          <Header text={nameAsTitle ? profile.name : 'Basic Info'} />
          {!editable && <ClockedInLabel clockedIn={profile.clockedIn} />}
          <div className='ui form'>
            <div className='Row'>
              <Input
                type="text"
                name="name"
                placeholder={editable ? "Name *" : "Name"}
                icon="user"
                value={name}
                onChange={e => setValue(e, setName, setNameError, true)}
                disabled={loading}
                readonly={!editable}
                error={nameError}
              />
              <Input
                type="text"
                name="phone"
                placeholder={editable ? "Phone No. *" : "Phone No."}
                icon="phone"
                value={phone}
                onChange={e => setValue(e, setPhone, setPhoneError, true)}
                onBlur={validatePhone}
                disabled={loading}
                readonly={!editable}
                error={phoneError}
              />
            </div>
            <div className='Row'>
              <Input
                type="text"
                name="bank"
                placeholder={editable ? "Bank Account No. *" : "Bank Account No."}
                icon="money bill alternate"
                value={bank}
                onChange={e => setValue(e, setBank, setBankError, true)}
                disabled={loading}
                readonly={!editable}
                error={bankError}
              />
              <Input
                type="text"
                name="bleeter"
                placeholder="Bleeter"
                icon="comments"
                value={bleeter}
                onChange={e => setValue(e, setBleeter, setBleeterError)}
                disabled={loading}
                readonly={!editable}
                error={bleeterError}
              />
            </div>
            <div className='Row'>
              <Input
                type="text"
                name="email"
                placeholder="Email"
                icon="at"
                value={email}
                onChange={e => setValue(e, setEmail, setEmailError)}
                onBlur={validateEmail}
                disabled={loading}
                readonly={!editable}
                error={emailError}
              />
              <Dropdown
                placeholder='Division'
                disabled={loading}
                readonly={!isAdmin}
                options={getDivisionDropdownOptions()}
                value={division}
                onChange={handleChangeDivision}
              />
            </div>
            <div className='Row'>
              <Dropdown
                placeholder='Roles'
                multiple
                disabled={loading || !division}
                readonly={!isAdmin}
                options={getRolesDropdownOptions()}
                value={profileRoles}
                onChange={handleChangeRole}
              />
            </div>
            {editable && <div className='Row'>
              <button
                className='ui button negative hover-animation'
                disabled={loading || !isDataUpdated()}
                onClick={handleCancel}
              >
                <p className='label contrast'>Reset</p>
                <p className='IconContainer contrast'><i className='close icon'></i></p>
              </button>
              <button
                className='ui button positive hover-animation'
                disabled={loading || !canSave() || !isDataUpdated()}
                onClick={handleSave}
              >
                <p className='label contrast'>Save</p>
                <p className='IconContainer contrast'><i className='check icon'></i></p>
              </button>
            </div>}
          </div>
        </div>
      </div>
      {showSuccessMessage && <div className="ui positive message">
        <div className="header">
          Profile successfully updated.
        </div>
      </div>}
    </div>
  );
}

export default ProfileCard;