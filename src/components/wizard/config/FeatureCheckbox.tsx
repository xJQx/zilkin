import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

interface FeatureCheckboxProps {
  label: string;
  infoText: string;
  infoHref: string;
  isChecked: boolean;
  setIsChecked: (_value: React.SetStateAction<boolean>) => void;
}

export const FeatureCheckbox = (props: FeatureCheckboxProps) => {
  const { label, infoText, infoHref, isChecked, setIsChecked } = props;

  return (
    <div id="config-feature" className="group flex flex-row items-center">
      <input
        id={`checkbox-${label}`}
        type="checkbox"
        value=""
        name={`checkbox-${label}`}
        className="w-4 h-4 rounded"
        checked={isChecked}
        onChange={() => setIsChecked(prev => !prev)}
      />
      <label
        htmlFor={`checkbox-${label}`}
        className="relative flex justify-between items-center py-2 ml-2 w-full"
      >
        <span>{label}</span>
        <div className="group/info">
          <FaQuestionCircle className="text-slate-400 group-hover:text-slate-500 ml-1" />
          {/* https://www.kindacode.com/article/tailwind-css-how-to-create-tooltips/ */}
          <span className="flex flex-col absolute z-10 hidden group-hover/info:flex translate-y-2 -translate-x-40 sm:-translate-x-1 w-48 px-2 py-1 bg-gray-700 rounded-lg text-white text-sm before:content-[''] before:absolute before:-top-2 before:right-3 sm:before:right-auto sm:before:left-2 before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-gray-700 before:rotate-90">
            <span>
              {infoText}&nbsp;
              <a
                href={infoHref}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-brand-blue-light cursor-pointer"
              >
                Read More
              </a>
            </span>
          </span>
        </div>
      </label>
    </div>
  );
};
