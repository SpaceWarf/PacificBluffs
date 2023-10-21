import { ChangeEvent, KeyboardEvent, useState } from "react";

interface InputProps {
  type: string;
  name: string;
  placeholder: string;
  icon: string;
  value: string;
  onChange: (e: string) => void;
  disabled?: boolean;
  readonly?: boolean;
  onBlur?: () => void;
  error?: boolean | string;
  onSubmit?: () => void;
}

function Input({
  type,
  name,
  placeholder,
  icon,
  value,
  onChange,
  disabled,
  readonly,
  onBlur,
  error,
  onSubmit
}: InputProps) {
  const [showCopyLabel, setShowCopyLabel] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (onSubmit && e.key === 'Enter') {
      onSubmit();
    }
  }

  function handleClick() {
    if (readonly) {
      navigator.clipboard.writeText(value);
      setShowCopyLabel(true);
      setTimeout(() => { setShowCopyLabel(false); }, 2000);
    }
  }

  return (
    <div
      className={`input field ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${readonly ? 'readonly' : ''}`}
      onClick={handleClick}
    >
      <p className={`field-label ${value.length ? 'resized' : ''}`}>{placeholder}</p>
      <input
        className='ui input'
        type={type}
        name={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onFocus={e => { if (readonly) e.target.blur(); }}
        disabled={disabled}
        autoComplete="off"
        value={value}
      />
      <i className={`${icon} icon`}></i>
      {typeof error === 'string' && error.length > 0 &&
        <div className="ui left pointing red basic label">
          {error}
        </div>
      }
      {showCopyLabel &&
        <div className="ui left pointing green basic label CopyLabel">
          Copied!
        </div>
      }
    </div>
  );
}

export default Input;