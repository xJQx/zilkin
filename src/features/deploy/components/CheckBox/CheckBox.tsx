import React from 'react';

export const CheckBox = ({
  option,
  checked,
  onChange,
}: {
  option: string;
  checked: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" key={option}>
        <input
          type="checkbox"
          id="mint"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 text-brand-green-default bg-brand-green-default rounded border-brand-green-default accent-brand-green-default"
        />
        <label htmlFor="mint" className="text-white text-sm font-medium">
          {option}
        </label>
      </div>
    </div>
  );
};
