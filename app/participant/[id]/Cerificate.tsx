'use client';

import { toPng } from 'html-to-image';
import React from 'react';
import ReactDOM from 'react-dom';
import { categoryMap } from '../../data/branding';

export const generateCertificate = async ({
  name = 'Fatima N',
  rank = '2',
  grade = 'A+',
  team = '',
  category = 'Senior',
  program = 'Essay Writing',
  filename = 'certificate',
}: {
  name: string;
  rank: string;
  grade: string;
  team : string;
  category: string;
  program: string;
  filename?: string;
}) => {
  const rankProvider: any = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    default: 'Participant',
  };

  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.zIndex = '-1';
  document.body.appendChild(container);

  const wrapper = document.createElement('div');
  container.appendChild(wrapper);

  const imageSrc = `${window.location.origin}/certificate/certi.jpg`;

  const CertificateElement = (
    <div className="w-fit">
      <div className="relative w-fit" style={{ aspectRatio: '1/1' }}>
        <img
          id="bg-cert"
          src={imageSrc}
          className="h-auto w-[450px]"
          crossOrigin="anonymous"
        />
        <div className="absolute space-grotesk tracking-tighter text-left inset-0 mt-[255px] flex flex-col text-white px-14 leading-tight">
          <p className="text-[12px] font-light">
            This is to proudly <br />
            acknowledge and honor
          </p>
          <h1 className="text-[14px] font-bold" style={{ color: '#4bcaeb' }}>
            {name}
          </h1>
          <p className="text-[12px] font-light w-[200px]">
            of {team} Division, for securing{' '}
            {rankProvider[rank] || rankProvider.default} Place with{' '}
            <span className="font-semibold">{grade} Grade</span> in the{' '}
            {categoryMap[category]} {program} competition held in connection with SSF
            Malappuram District (East) Sahityotsav at Kondotty from the 1st to 3rd of August, 2025.
          </p>
        </div>
      </div>
    </div>
  );

  return new Promise<void>((resolve, reject) => {
    ReactDOM.render(CertificateElement, wrapper, async () => {
      try {
        const canvasTarget = wrapper.querySelector('div') as HTMLElement;
        const bgImg = wrapper.querySelector('#bg-cert') as HTMLImageElement;

        // ✅ Wait until the image is loaded
        if (!bgImg.complete) {
          await new Promise((res, rej) => {
            bgImg.onload = () => res(true);
            bgImg.onerror = () => rej('Image failed to load');
          });
        }

        // Now capture the image
        const dataUrl = await toPng(canvasTarget, {
          pixelRatio: 6,
        });

        const link = document.createElement('a');
        link.download = `${rank}_${program}.jpg`;
        link.href = dataUrl;
        link.click();

        document.body.removeChild(container);
        resolve();
      } catch (error) {
        console.error('Certificate generation failed', error);
        document.body.removeChild(container);
        reject(error);
      }
    });
  });
};
