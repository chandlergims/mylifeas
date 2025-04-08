'use client';

import React from 'react';
import { PanelImage, ComicSettings } from './types';

interface PanelUploadProps {
  panels: PanelImage[];
  setPanels: React.Dispatch<React.SetStateAction<PanelImage[]>>;
  settings: ComicSettings;
}

const PanelUpload: React.FC<PanelUploadProps> = ({ panels, setPanels, settings }) => {
  // Handle file upload for a specific panel
  const handleFileUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (event.target?.result) {
          const newPanels = [...panels];
          newPanels[index] = {
            file,
            preview: event.target.result as string
          };
          setPanels(newPanels);
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  // Handle deleting a panel image
  const handleDeletePanel = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const newPanels = [...panels];
    newPanels[index] = { file: null, preview: '' };
    setPanels(newPanels);
  };

  return (
    <div className="md:col-span-2">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 font-['Poppins']">Upload Panel Images</h2>
        <button
          onClick={() => {
            setPanels([
              { file: null, preview: '' },
              { file: null, preview: '' },
              { file: null, preview: '' },
              { file: null, preview: '' }
            ]);
          }}
          className="px-3 py-1 bg-[#e9e3d9] text-[#f0b90b] rounded-md text-sm font-medium hover:bg-[#f0b90b]/10 transition-colors border border-[#f0b90b]/20"
        >
          Clear All
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {panels.map((panel, index) => (
          <div key={`panel-${index}-${Date.now()}`} className="relative">
            <div 
              className="aspect-square flex flex-col items-center justify-center text-center border border-dashed border-gray-300"
              style={{
                borderRadius: settings.panelForm === 'Rounded' ? '12px' : '0', // Apply border radius based on settings
                overflow: 'hidden'
              }}
            >
              {panel.preview ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={panel.preview} 
                    alt={`Panel ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                  {/* Delete button */}
                  <div className="absolute top-0 right-0 p-2 z-10">
                    <button
                      onClick={(e) => handleDeletePanel(index, e)}
                      className="bg-red-500 text-white rounded-md px-2 py-1 text-sm font-medium shadow-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-gray-400">
                  <svg 
                    className="w-10 h-10 mx-auto" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <p className="mt-2 text-sm">Click to upload</p>
                </div>
              )}
              
              {/* File input - only show when no image is uploaded */}
              {!panel.preview && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload(index, e)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              )}
              
              {/* No replace button as requested */}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#f0b90b]/10 rounded-lg p-4 mt-4 flex items-start border border-[#f0b90b]/20">
        <svg 
          className="w-5 h-5 text-[#f0b90b] mt-0.5 mr-2 flex-shrink-0" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <p className="text-sm text-[#3c3c3c] font-['SK Concretica']">
          <span className="font-semibold">Pro Tip:</span> Use square images for best results. All panels will be displayed as squares in the final comic.
        </p>
      </div>
    </div>
  );
};

export default PanelUpload;
