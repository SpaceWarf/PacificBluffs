import './PasswordCard.scss';
import { useState, Dispatch, SetStateAction } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import Header from "../../Common/Header";
import Input from "../../Common/Input";

function PasswordCard() {
  const auth = useAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [currentPasswordError, setCurrentPasswordError] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [updatingPassword, setUpdatingPassword] = useState(false);

  function validateNotEmpty(value: string, errorSetter: Dispatch<SetStateAction<boolean>>) {
    errorSetter(!value.length)
  }

  function setValue(value: string, setter: Dispatch<SetStateAction<string>>, errorSetter: Dispatch<SetStateAction<boolean>>) {
    setter(value);
    validateNotEmpty(value, errorSetter);
  }

  function doPasswordsMatch() {
    return newPassword.length > 0 && newPassword === confirmPassword;
  }

  function validateConfirmPassword() {
    if (doPasswordsMatch()) {
      setConfirmPasswordError(false);
    } else {
      setConfirmPasswordError(true);
    }
  }

  async function handleChangePassword() {
    try {
      setUpdatingPassword(true);
      await auth.setNewPassword(currentPassword, newPassword);
      clearPasswordForm();
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 5000);
      setUpdatingPassword(false);
    } catch (error) {
      console.error(error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 5000);
      setUpdatingPassword(false);
    }
  }

  function clearPasswordForm() {
    setCurrentPassword('');
    setCurrentPasswordError(false);
    setNewPassword('');
    setNewPasswordError(false);
    setConfirmPassword('');
    setConfirmPasswordError(false);
  }

  function canUpdatePassword(): boolean {
    return currentPassword.length > 0 && doPasswordsMatch();
  }
  
  return (
    <div className='PasswordCard ProfileCard'>
      <div className="ui card attached">
        <div className="content">
          <Header text='Password' />
          <div className='ui form'>
            <div className='Row'>
              <Input
                type="password"
                name="current-password"
                placeholder="Current Password *"
                icon="lock"
                value={currentPassword}
                onChange={e => setValue(e, setCurrentPassword, setCurrentPasswordError)}
                onBlur={() => validateNotEmpty(currentPassword, setCurrentPasswordError)}
                disabled={updatingPassword}
                error={currentPasswordError}
              />
            </div>
            <div className='Row'>
              <Input
                type="password"
                name="new-password"
                placeholder="New Password *"
                icon="lock"
                value={newPassword}
                onChange={e => setValue(e, setNewPassword, setNewPasswordError)}
                onBlur={() => validateNotEmpty(newPassword, setNewPasswordError)}
                disabled={updatingPassword}
                error={newPasswordError}
              />
            </div>
            <div className='Row'>
              <Input
                type="password"
                name="confirm-password"
                placeholder="Confirm Password *"
                icon="lock"
                value={confirmPassword}
                onChange={e => setValue(e, setConfirmPassword, setConfirmPasswordError)}
                onBlur={validateConfirmPassword}
                disabled={updatingPassword}
                error={confirmPasswordError}
              />
            </div>
            <div className='Row'>
              <button
                className='ui button positive hover-animation'
                disabled={updatingPassword || !canUpdatePassword()}
                onClick={handleChangePassword}
              >
                <p className='label contrast'>Update Password</p>
                <p className='IconContainer contrast'><i className='check icon'></i></p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {showSuccessMessage && <div className="ui positive message">
        <div className="header">
          Your password was successfully updated.
        </div>
      </div>}
      {showErrorMessage && <div className="ui negative message">
        <div className="header">
          Your current password was invalid. Please validate and try again.
        </div>
      </div>}
    </div>
  );
}

export default PasswordCard;