import React from 'react';

interface PageTitleProps {
  title: string;
}

export const PageTitle = (props: PageTitleProps) => {
  const { title } = props;

  return (
    <div className="mb-4 py-1 text-5xl text-center text-transparent bg-clip-text bg-gradient-to-r from-brand-green-default to-brand-blue-dark">
      {title}
    </div>
  );
};
