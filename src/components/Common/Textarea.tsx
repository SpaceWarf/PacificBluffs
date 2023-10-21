import { ChangeEvent, KeyboardEvent, useState } from "react";

interface TextareaProps {
  name: string;
  placeholder: string;
  value: string;
  onChange?: (e: string) => void;
  disabled?: boolean;
  readonly?: boolean;
  onBlur?: () => void;
  error?: boolean | string;
  onSubmit?: () => void;
}

function Textarea({
  name,
  placeholder,
  value,
  onChange,
  disabled,
  readonly,
  onBlur,
  error,
  onSubmit
}: TextareaProps) {
  const [showCopyLabel, setShowCopyLabel] = useState(false);

  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    if (onChange) {
      onChange(e.target.value);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
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
      className={`textarea field ${disabled ? 'disabled' : ''} ${error ? 'error' : ''} ${readonly ? 'readonly' : ''}`}
      onClick={handleClick}
    >
      <p className={`field-label ${value.length ? 'resized' : ''}`}>{placeholder}</p>
      <textarea
        className='ui textarea'
        rows={4}
        cols={50}
        name={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={onBlur}
        onFocus={e => { if (readonly) e.target.blur(); }}
        disabled={disabled}
        autoComplete="off"
        value={value}
      />
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

export default Textarea;