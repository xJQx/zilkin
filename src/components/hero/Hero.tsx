import React from 'react';

export const Hero = () => {
  return (
    <div id="hero" className="flex flex-col items-center">
      <img
        src="/images/hero.jpg"
        alt="hero"
        className="h-screen w-full object-cover"
      />
      <div className="relative -top-10 text-white text-7xl text-center">
        <div className="">UNLOCK THE</div>
        <div className="pt-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-green-default to-brand-blue-dark">
          METAVERSE
        </div>
      </div>
    </div>
  );
};
