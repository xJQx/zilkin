import React from 'react';

interface DocsCardProps {
  title: string;
  subTitle?: string;
  description: string;
  href: string;
}

export const DocsCard = (props: DocsCardProps) => {
  const { title, subTitle, description, href } = props;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div
        id="card"
        className="group/card border rounded-lg border-dashed border-2 border-brand-green-default min-h-[12rem] max-w-[24rem] h-full w-full p-4 opacity-50 hover:opacity-100 hover:scale-105 hover:border-solid duration-100 cursor-pointer"
      >
        <div
          id="card-title"
          className="text-lg mb-2 text-brand-green-default group-hover/card:font-bold"
        >
          {title}&nbsp;
          {subTitle && <span className="text-xs">({subTitle})</span>}
        </div>
        <div
          id="card-body"
          className="text-gray-400 group-hover/card:text-white"
        >
          {description}
        </div>
      </div>
    </a>
  );
};
