'use client';

import React, { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { PanelImage, ComicSettings } from './types';
import { getPanelBorderRadius, getPanelBackgroundStyle, getPanelShadowStyle, getTitleShadowStyle, getComicBackgroundStyle } from './utils';
import html2canvas from 'html2canvas';
import domtoimage from 'dom-to-image-more';
import { showSuccess, showError } from '@/utils/toast';

interface ComicPreviewProps {
  panels: PanelImage[];
  setPanels: React.Dispatch<React.SetStateAction<PanelImage[]>>;
  settings: ComicSettings;
  user: any;
  isCreating: boolean;
  setIsCreating: React.Dispatch<React.SetStateAction<boolean>>;
  resetAll: () => void;
  setActiveTab: React.Dispatch<React.SetStateAction<'upload' | 'preview'>>;
}

const ComicPreview: React.FC<ComicPreviewProps> = ({ 
  panels, 
  setPanels,
  settings, 
  user, 
  isCreating, 
  setIsCreating, 
  resetAll, 
  setActiveTab 
}) => {
  const comicRef = useRef<HTMLDivElement>(null);
  
  // Generate a unique timestamp to prevent image caching
  const timestamp = Date.now();

  // Download comic as PNG
  const downloadComic = async () => {
    if (!comicRef.current) return;
    
    const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
    if (downloadBtn) {
      downloadBtn.textContent = 'Generating...';
      downloadBtn.disabled = true;
    }
    
    try {
      // Create a wrapper div with fixed dimensions to control the final image size
      const wrapperDiv = document.createElement('div');
      wrapperDiv.style.width = '700px'; // Control the overall width of the image
      wrapperDiv.style.padding = '50px'; // Equal padding on all sides
      wrapperDiv.style.backgroundColor = '#e9e3d9'; // Solid background color without dots
      wrapperDiv.style.textAlign = 'center'; // Center the comic
      wrapperDiv.style.border = 'none'; // Ensure no border
      
      // Clone the comic element
      const comicClone = comicRef.current.cloneNode(true) as HTMLElement;
      comicClone.style.width = '100%'; // Make it fill the wrapper width
      comicClone.style.margin = '0 auto'; // Center it
      
      // Preserve panel styling but remove any unwanted borders
      const panels = comicClone.querySelectorAll('[data-comic-panel]');
      panels.forEach((panel) => {
        const panelElement = panel as HTMLElement;
        
        // Keep the border radius if it's set in the settings
        if (settings.panelForm === 'Rounded') {
          panelElement.style.borderRadius = '12px';
        } else {
          panelElement.style.borderRadius = '0';
        }
        
        // Make sure there's no border
        panelElement.style.border = 'none';
        
        // Find and fix any images inside this panel
        const img = panelElement.querySelector('img');
        if (img) {
          // Match the panel's border radius for the image
          if (settings.panelForm === 'Rounded') {
            img.style.borderRadius = '12px';
          } else {
            img.style.borderRadius = '0';
          }
          
          // Remove any other border styling
          img.style.border = 'none';
          img.style.outline = 'none';
          img.style.boxShadow = 'none';
          
          // Make sure the image fills the panel
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
        }
      });
      wrapperDiv.appendChild(comicClone);
      
      // Temporarily add the wrapper to the document
      document.body.appendChild(wrapperDiv);
      
      // Use dom-to-image-more to get a full screenshot
      const dataUrl = await domtoimage.toPng(wrapperDiv, {
        quality: 1
      });
      
      // Remove the temporary wrapper
      document.body.removeChild(wrapperDiv);
      
      // Create download link
      const link = document.createElement('a');
      link.download = `${settings.title.replace(/\s+/g, '-').toLowerCase()}.png`;
      link.href = dataUrl;
      link.click();
      
      // Reset button state
      if (downloadBtn) {
        downloadBtn.textContent = 'Download Comic (PNG)';
        downloadBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error downloading My Life As:', error);
      showError('Failed to download My Life As. Please try again.');
      
      // Reset button state on error
      const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;
      if (downloadBtn) {
        downloadBtn.textContent = 'Download My Life As (PNG)';
        downloadBtn.disabled = false;
      }
    }
  };

  // Save comic to backend
  const saveComic = async () => {
    if (!user) {
      showError('Please connect your wallet to save comics');
      return;
    }
    
    // Check if all panels have images
    const missingPanels = panels.filter(panel => !panel.preview).length;
    if (missingPanels > 0) {
      showError(`Please add images to all 4 panels before publishing your My Life As (${missingPanels} panel${missingPanels > 1 ? 's' : ''} missing)`);
      return;
    }
    
    setIsCreating(true);
    
    try {
      // Generate the image using the same approach as downloadComic
      if (!comicRef.current) {
        throw new Error('My Life As reference not found');
      }
      
      // Create a wrapper div with fixed dimensions to control the final image size
      const wrapperDiv = document.createElement('div');
      wrapperDiv.style.width = '700px'; // Control the overall width of the image
      wrapperDiv.style.padding = '50px'; // Equal padding on all sides
      wrapperDiv.style.backgroundColor = '#e9e3d9'; // Solid background color without dots
      wrapperDiv.style.textAlign = 'center'; // Center the comic
      wrapperDiv.style.border = 'none'; // Ensure no border
      
      // Clone the comic element
      const comicClone = comicRef.current.cloneNode(true) as HTMLElement;
      comicClone.style.width = '100%'; // Make it fill the wrapper width
      comicClone.style.margin = '0 auto'; // Center it
      
      // Preserve panel styling but remove any unwanted borders
      const panels = comicClone.querySelectorAll('[data-comic-panel]');
      panels.forEach((panel) => {
        const panelElement = panel as HTMLElement;
        
        // Keep the border radius if it's set in the settings
        if (settings.panelForm === 'Rounded') {
          panelElement.style.borderRadius = '12px';
        } else {
          panelElement.style.borderRadius = '0';
        }
        
        // Make sure there's no border
        panelElement.style.border = 'none';
        
        // Find and fix any images inside this panel
        const img = panelElement.querySelector('img');
        if (img) {
          // Match the panel's border radius for the image
          if (settings.panelForm === 'Rounded') {
            img.style.borderRadius = '12px';
          } else {
            img.style.borderRadius = '0';
          }
          
          // Remove any other border styling
          img.style.border = 'none';
          img.style.outline = 'none';
          img.style.boxShadow = 'none';
          
          // Make sure the image fills the panel
          img.style.width = '100%';
          img.style.height = '100%';
          img.style.objectFit = 'cover';
        }
      });
      wrapperDiv.appendChild(comicClone);
      
      // Temporarily add the wrapper to the document
      document.body.appendChild(wrapperDiv);
      
      // Use dom-to-image-more to get a full screenshot
      const dataUrl = await domtoimage.toPng(wrapperDiv, {
        quality: 1
      });
      
      // Remove the temporary wrapper
      document.body.removeChild(wrapperDiv);
      
      // Use the data URL for the image
      const imageUrl = dataUrl;
      
      // Save to backend
      const response = await fetch('/api/comics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: settings.title,
          creator: user.id,
          creatorAddress: user.address,
          imageUrl,
          settings,
          isPublic: true, // Default to public
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save My Life As');
      }
      
      showSuccess('My Life As saved successfully to the gallery!');
      
      // Reset panels and redirect to home page
      setPanels([
        { file: null, preview: '' },
        { file: null, preview: '' },
        { file: null, preview: '' },
        { file: null, preview: '' }
      ]);
      
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      console.error('Error saving comic:', error);
      showError('Failed to save comic. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>Preview Your My Life As</h2>
      
      {/* Comic Preview */}
      <div 
        ref={comicRef}
        data-comic-container
        className="mb-8 max-w-3xl mx-auto bg-[#e9e3d9] relative"
        style={{ 
          padding: '24px',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
          border: '1px solid #d0c3b1',
          backgroundImage: 'radial-gradient(#d0c3b1 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }}
      >
        {/* Decorative Corner Elements */}
        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#f0b90b] rounded-tl-lg"></div>
        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#f0b90b] rounded-tr-lg"></div>
        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#f0b90b] rounded-bl-lg"></div>
        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#f0b90b] rounded-br-lg"></div>
        
        {/* Decorative Ribbon */}
        <div className="ribbon-fix absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#f0b90b] text-white px-6 py-1 text-sm font-bold shadow-md z-10" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
          $MyLifeAs
        </div>
        {/* Comic Title - positioned higher */}
        <h2 
          className="comic-title text-center font-bold py-2"
          style={{
            color: settings.titleColor,
            fontSize: `${Math.min(settings.titleFontSize, 48)}px`, // Limit max font size
            fontFamily: settings.titleFont,
            textShadow: getTitleShadowStyle(settings),
            marginTop: '-10px', // Move title higher
          }}
        >
          {settings.title}
        </h2>
        
        {/* Comic Panels */}
        <div 
          className="grid grid-cols-2"
          style={{ gap: '8px' }}
        >
          {panels.map((panel, index) => (
            <div
              key={`preview-panel-${index}-${timestamp}`}
              data-comic-panel
              className="overflow-hidden"
              style={{
                aspectRatio: '1/1', // Force square aspect ratio
                overflow: 'hidden',
                background: '#e9e3d9', // Use beige background instead of white
                borderRadius: settings.panelForm === 'Rounded' ? '12px' : '0', // Apply border radius based on settings
              }}
            >
              {panel.preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={panel.preview} 
                  alt={`Panel ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="aspect-square w-full border border-dashed border-gray-300 flex flex-col items-center justify-center">
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
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4">
        <button
          onClick={resetAll}
          className="px-6 py-3 bg-[#e9e3d9] text-gray-700 font-medium rounded-md shadow-sm border border-[#d0c3b1] hover:bg-[#d0c3b1]"
          style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}
        >
          Reset All
        </button>
        
        <button
          id="download-btn"
          onClick={downloadComic}
          className="px-6 py-3 bg-[#3b82f6] text-white font-medium rounded-md shadow-sm hover:bg-[#2563eb]"
          style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}
        >
          Download My Life As (PNG)
        </button>
        
        <button
          onClick={saveComic}
          disabled={isCreating || !user}
          className={`px-6 py-3 font-medium rounded-md shadow-sm ${
            !user
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isCreating
                ? 'bg-[#d9a70a] text-white cursor-wait'
                : 'bg-[#f0b90b] text-white hover:bg-[#d9a70a]'
          }`}
          style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}
        >
          {isCreating ? 'Publishing...' : 'Publish My Life As'}
        </button>
      </div>
      
      {!user && (
        <p className="text-center text-sm text-gray-500 mt-2">
          Connect your wallet to save comics
        </p>
      )}
      
      <div className="mt-8">
        <button
          onClick={() => setActiveTab('upload')}
          className="text-[#f0b90b] hover:text-[#d9a70a] font-medium flex items-center"
          style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}
        >
          <svg 
            className="w-4 h-4 mr-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Upload
        </button>
      </div>
    </div>
  );
};

export default ComicPreview;
