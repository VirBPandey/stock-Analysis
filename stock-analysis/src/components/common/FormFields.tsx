import React from 'react';

interface FormInputProps {
  type?: 'text' | 'number' | 'date';
  placeholder: string;
  title: string;
  value: string | number;
  onChange: (value: any) => void;
  step?: string;
  required?: boolean;
  style?: React.CSSProperties;
}

export const FormInput: React.FC<FormInputProps> = ({
  type = 'text',
  placeholder,
  title,
  value,
  onChange,
  step,
  required = false,
  style,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (type === 'number') {
      const val = e.target.value;
      onChange(val === '' ? 0 : parseFloat(val));
    } else {
      onChange(e.target.value);
    }
  };

  return (
    <input
      type={type}
      step={step}
      placeholder={placeholder}
      title={title}
      value={type === 'number' && value === 0 ? '' : value}
      onChange={handleChange}
      required={required}
      style={style}
    />
  );
};

interface FormTextAreaProps {
  placeholder: string;
  title: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  style?: React.CSSProperties;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
  placeholder,
  title,
  value,
  onChange,
  rows = 2,
  style,
}) => {
  return (
    <textarea
      placeholder={placeholder}
      title={title}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      style={style}
    />
  );
};

interface FormSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  title: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  value,
  onChange,
  options,
  title,
}) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      title={title}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};
