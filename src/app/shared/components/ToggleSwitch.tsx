// src/app/shared/components/ToggleSwitch.tsx
import { useId } from "react";

type Props = {
  checked: boolean;
  onChange: () => void;
  label: string;
};

export function ToggleSwitch({ checked, onChange, label }: Props) {
  const labelId = useId();

  return (
    <div className="toggle-switch">
      <span id={labelId} className="toggle-switch__label">
        {label}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={labelId}
        className="toggle-switch__track"
        onClick={onChange}
      >
        <span className="toggle-switch__thumb" aria-hidden="true" />
      </button>
    </div>
  );
}