'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PanelImage, ComicSettings, defaultSettings } from './components/types';
import PanelUpload from './components/PanelUpload';
import ComicSettingsComponent from './components/ComicSettings';
import ComicPreview from './components/ComicPreview';

// Create a unique key for the component instance
// This will force React to create a new component instance with fresh state
// whenever the page is refreshed or the user changes
const getInstanceKey = () => {
  return `instance-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

export default function ComicCreator() {
  // Use a key to force component remount
  const [instanceKey] = useState(getInstanceKey());
  const { user } = useAuth();
  
  // Initialize with empty panels
  const [panels, setPanels] = useState<PanelImage[]>([
    { file: null, preview: '' },
    { file: null, preview: '' },
    { file: null, preview: '' },
    { file: null, preview: '' }
  ]);
  
  // Force reset on page load and user change
  useEffect(() => {
    // Clear all panels and settings
    setPanels([
      { file: null, preview: '' },
      { file: null, preview: '' },
      { file: null, preview: '' },
      { file: null, preview: '' }
    ]);
    setSettings({...defaultSettings});
    setActiveTab('upload');
    
    // Clear any cached data in browser
    if (typeof window !== 'undefined') {
      // Force browser to clear any cached images
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        img.src = img.src.split('?')[0] + '?t=' + new Date().getTime();
      });
    }
  }, [user]);
  
  const [settings, setSettings] = useState<ComicSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'upload' | 'preview'>('upload');
  const [isCreating, setIsCreating] = useState(false);

  // Handle settings change
  const handleSettingChange = (key: keyof ComicSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Reset all settings and panels without confirmation
  const resetAll = () => {
    setPanels([
      { file: null, preview: '' },
      { file: null, preview: '' },
      { file: null, preview: '' },
      { file: null, preview: '' }
    ]);
    
    setSettings(defaultSettings);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-[#e9e3d9] rounded-xl shadow-xl overflow-hidden border border-[#d0c3b1]">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">My Life As Creator</h1>
            <p className="text-gray-500 mb-8">Create and customize your own 4-panel life story</p>
            
            {/* Tabs */}
            <div className="border-b border-[#d0c3b1] mb-8">
              <nav className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`py-4 px-8 font-medium text-base transition-all ${
                    activeTab === 'upload'
                      ? 'border-b-2 border-[#f0b90b] text-[#f0b90b]'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-[#f0b90b] text-white flex items-center justify-center mr-2 text-sm">1</span>
                    Upload Panel Assets
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`py-4 px-8 font-medium text-base transition-all ${
                    activeTab === 'preview'
                      ? 'border-b-2 border-[#f0b90b] text-[#f0b90b]'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="flex items-center" style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}>
                    <span className="w-6 h-6 rounded-full bg-[#f0b90b] text-white flex items-center justify-center mr-2 text-sm">2</span>
                    Preview & Finalize
                  </span>
                </button>
              </nav>
            </div>
            
            {/* Upload Panel Assets Tab */}
            {activeTab === 'upload' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Panel Upload Section - key forces remount when user changes */}
                  <PanelUpload 
                    key={`panel-upload-${user?.id || 'no-user'}-${Date.now()}`} 
                    panels={panels} 
                    setPanels={setPanels}
                    settings={settings}
                  />
                  
                  {/* Comic Settings */}
                  <ComicSettingsComponent settings={settings} handleSettingChange={handleSettingChange} />
                </div>
                
                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className="px-6 py-3 bg-[#f0b90b] text-white font-medium rounded-md shadow-sm hover:bg-[#d9a70a]"
                    style={{ fontFamily: 'SK Concretica, system-ui, sans-serif' }}
                  >
                    Continue to Preview
                  </button>
                </div>
              </div>
            )}
            
            {/* Preview & Finalize Tab */}
            {activeTab === 'preview' && (
              <ComicPreview 
                key={`comic-preview-${user?.id || 'no-user'}-${Date.now()}`}
                panels={panels}
                setPanels={setPanels}
                settings={settings}
                user={user}
                isCreating={isCreating}
                setIsCreating={setIsCreating}
                resetAll={resetAll}
                setActiveTab={setActiveTab}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
