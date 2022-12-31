import React from 'react';
import { Button } from '../button';

export const Hero = () => {
  return (
    <div id="hero" className="flex flex-col items-center">
      {/* Hero Image */}
      <img
        src="/images/hero.jpg"
        alt="hero"
        className="h-screen w-full object-cover"
      />

      <div className="flex flex-col px-5">
        {/* Title */}
        <div
          id="title"
          role="title"
          className="relative -top-5 sm:-top-6 lg:-top-10 text-white text-center text-3xl sm:text-5xl lg:text-7xl"
        >
          <div className="">DEPLOY YOUR</div>
          <div className="pt-2 sm:pt-4 text-transparent bg-clip-text bg-gradient-to-r from-brand-green-default to-brand-blue-dark">
            SCILLA CONTRACTS
          </div>
        </div>

        {/* Description */}
        <div className="self-center text-white text-center w-10/12 sm:w-9/12 lg:w-1/2">
          ZilKin is a{' '}
          <b className="text-brand-green-default">
            Scilla Contracts Deployment Tool
          </b>{' '}
          that empowers you to deploy your Scilla contracts via{' '}
          <b className="text-brand-green-default">
            a) iteractive code generator{' '}
          </b>
          or{' '}
          <b className="text-brand-green-default">
            b) our automatic deployment contract.
          </b>
        </div>

        <div className="flex flex-col sm:flex-row justify-center items-center py-8">
          <Button label="Start Now" href="/contracts" />
          <Button
            label="Deploy Now"
            href="/deploy"
            secondary={true}
            styleClassNames="mt-4 sm:mt-0 sm:ml-4"
          />
        </div>
      </div>
    </div>
  );
};
