import React from 'react';

export const TextInput = ({
  name,
  value,
  onChange,
  numberInput,
}: {
  name: string;
  value: string | number | string[];
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  numberInput?: boolean;
}) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-3">
      <label htmlFor={name} className="text-sm text-white font-medium">
        {name}
      </label>
      <input
        type={numberInput ? 'number' : 'text'}
        id={name}
        value={value}
        className="bg-brand-green-default/50 border border-transparent text-white text-sm rounded py-1 px-2 focus:border-brand-green-default focus:outline-none"
        required
        onChange={onChange}
      ></input>
    </div>
  );
};
