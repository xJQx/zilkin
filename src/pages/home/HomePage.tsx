import { motion } from 'framer-motion';
import React from 'react';
import {
  Button,
  Hero,
  FeatureDescription,
  FeatureHeader,
  GreenText,
} from '../../components';

export const HomePage = () => {
  return (
    <>
      <Hero />

      {/* Features */}
      <div id="features" className="min-h-screen pb-12 sm:pb-24 px-8 sm:px-24">
        {/* Contracts Wizard */}
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FeatureHeader numbering="01" title="Contracts Wizard" />
          <FeatureDescription imgSrc="images/contracts-wizard-sample.png">
            <div>
              Our <GreenText>Contracts Wizard</GreenText> is a web application
              to <GreenText>interactively build</GreenText> a contract out of{' '}
              <GreenText>components</GreenText> from Scilla Contracts.
            </div>
            <div className="mt-4">
              Select the contract that you want, set your parameters and desired
              features, and the Wizard will{' '}
              <GreenText>generate all of the code necessary.</GreenText> The
              resulting code is ready to be compiled and deployed, or it can
              serve as a starting point and customized further with specific
              logic.
            </div>
            <div className="mt-4">
              <Button
                label="Try Now"
                href="/contracts-wizard"
                styleClassNames="text-base py-2 px-8"
              />
            </div>
          </FeatureDescription>
        </motion.div>

        {/* Automatic Deployment */}
        <motion.div
          initial={{ opacity: 0, y: 200 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <FeatureHeader numbering="02" title="Automatic Deployment" />
          <FeatureDescription imgSrc="images/automatic-deployment-sample.jpg">
            <div>
              Just want to <GreenText>deploy</GreenText> your Scilla Token or
              NFT <GreenText>without writing a single line of code?</GreenText>
              &nbsp;No worries!
            </div>
            <div className="mt-4">
              Our <GreenText>Automatic Deployment</GreenText> is a web
              application that enables you to select parameters for your scilla
              contracts and deploy automatically without needing to write a
              single line of scilla code.
            </div>
            <div className="mt-4">
              <Button
                label="Try Now"
                href="/deploy"
                styleClassNames="text-base py-2 px-8"
              />
            </div>
          </FeatureDescription>
        </motion.div>
      </div>
    </>
  );
};
