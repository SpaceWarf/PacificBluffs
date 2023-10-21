import { SyntheticEvent, useState } from "react";
import { Dropdown } from "semantic-ui-react";

export interface DropdownOption {
  key: string;
  text: string;
  value: any;
}

interface InputProps {
  placeholder: string,
  multiple?: boolean,
  disabled?: boolean,
  readonly?: boolean,
  options: DropdownOption[],
  value: string | string[],
  onChange: (e: SyntheticEvent, data: any) => void;
}

function Input({
  placeholder,
  multiple,
  disabled,
  readonly,
  options,
  value,
  onChange,
}: InputProps) {
  const [showCopyLabel, setShowCopyLabel] = useState(false);

  function handleClick() {
    if (readonly) {
      let copyValue = '';

      if (typeof value === 'string') {
        const selectedOption = options.find(option => option.key === value);
        if (selectedOption) {
          copyValue = selectedOption.text;
        }
      } else {
        console.log(options, value)
        const selectedOptions = options
          .filter(option => value.indexOf(option.key) >= 0)
          .map(option => option.text);
        if (selectedOptions.length > 0) {
          console.log(selectedOptions)
          copyValue = selectedOptions.join(', ');
        }
      }

      navigator.clipboard.writeText(copyValue);
      setShowCopyLabel(true);
      setTimeout(() => { setShowCopyLabel(false); }, 2000);
    }
  }

  return (
    <div
      className={`dropdown field ${disabled ? 'disabled' : ''} ${readonly ? 'readonly' : ''}`}
      onClick={handleClick}
    >
      <p className={`field-label ${value.length ? 'resized' : ''}`}>{placeholder}</p>
      <Dropdown
        fluid
        selection
        search
        multiple={multiple}
        clearable={!disabled && !readonly}
        disabled={disabled || readonly}
        options={options}
        value={value}
        onChange={onChange}
      />
      {showCopyLabel &&
        <div className="ui left pointing green basic label CopyLabel">
          Copied!
        </div>
      }
    </div>
  );
}

export default Input;