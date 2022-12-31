import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  label: string;
  href: string;
  secondary?: boolean;
  variant?: 'solid';
  styleClassNames?: string;
}

export const Button = (props: ButtonProps) => {
  const {
    label,
    href,
    secondary = false,
    variant = 'solid',
    styleClassNames,
  } = props;
  const navigate = useNavigate();

  const onClickHandler = () => {
    navigate(href);
  };

  const bgColor = secondary ? 'bg-white' : 'bg-brand-blue-dark';
  const color = secondary ? 'text-brand-blue-dark' : 'text-white';

  let buttonStyles = 'w-max px-12 py-3 rounded-3xl text-xl';

  switch (variant) {
    case 'solid':
      buttonStyles += ' ' + `${bgColor} ${color} hover:scale-110 duration-200`;
      break;
  }

  return (
    <button
      onClick={onClickHandler}
      className={buttonStyles + ' ' + styleClassNames}
    >
      {label}
    </button>
  );
};
