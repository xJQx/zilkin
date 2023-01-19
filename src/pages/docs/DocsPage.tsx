import React from 'react';
import { DocsCard } from 'features/docs';
import { FeatureHeader, PageTitle } from 'components/typography';

export const DocsPage = () => {
  return (
    <div className="min-h-[85vh] pt-28 px-8 sm:px-24 text-white">
      <PageTitle title="DOCS" />
      <div className="flex flex-col">
        <div>
          <FeatureHeader numbering="01" title="Developer Docs" />
          <div className="flex flex-row flex-wrap gap-4">
            {/* Scilla Docs */}
            <DocsCard
              title="Scilla Docs"
              description="Scilla (short for Smart Contract Intermediate-Level LAnguage) is an intermediate-level smart contract language being developed for the Zilliqa blockchain."
              href="https://scilla.readthedocs.io/en/latest/"
            />

            {/* Zilliqa Devloper Portal */}
            <DocsCard
              title="Zilliqa Devloper Portal"
              description="Technical documentation for participating in the Zilliqa network."
              href="https://dev.zilliqa.com/"
            />
          </div>
        </div>
        <div className="">
          <FeatureHeader numbering="02" title="Contracts Standard" />
          <div className="flex flex-row flex-wrap gap-4">
            {/* ZRC2 */}
            <DocsCard
              title="ZRC2"
              subTitle="Fungible Tokens"
              description="ZRC-2 defines a minimum interface that a smart contract must implement to allow fungible tokens to be managed, tracked, owned, and traded peer-to-peer via wallets or exchanges."
              href="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-2.md"
            />

            {/* ZRC6 */}
            <DocsCard
              title="ZRC6"
              subTitle="Non-Fungible Token"
              description="ZRC-6 defines a new minimum interface of an NFT smart contract while improving upon ZRC-1."
              href="https://github.com/Zilliqa/ZRC/blob/main/zrcs/zrc-6.md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
