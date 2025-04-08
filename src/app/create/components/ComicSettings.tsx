'use client';

import React from 'react';
import { ComicSettings as ComicSettingsType, fontOptions } from './types';

interface ComicSettingsProps {
  settings: ComicSettingsType;
  handleSettingChange: (key: keyof ComicSettingsType, value: any) => void;
}

const ComicSettings: React.FC<ComicSettingsProps> = ({ settings, handleSettingChange }) => {
  return (
    <div className="md:col-span-1">
      <div className="bg-[#e9e3d9] rounded-xl p-6 shadow-md border border-[#d0c3b1]">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">My Life As Settings</h2>
        
        {/* Title */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            My Life As Title
          </label>
          <input
            type="text"
            value={settings.title}
            onChange={(e) => handleSettingChange('title', e.target.value)}
            className="w-full px-4 py-3 border border-[#d0c3b1] rounded-lg shadow-sm bg-[#e9e3d9]"
            placeholder="Enter your My Life As title"
          />
        </div>
        
        {/* Title Font */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Poppins']">
            Title Font
          </label>
          <select
            value={settings.titleFont}
            onChange={(e) => handleSettingChange('titleFont', e.target.value)}
            className="w-full px-4 py-3 border border-[#d0c3b1] rounded-lg shadow-sm bg-[#e9e3d9]"
          >
            {fontOptions.map(font => (
              <option key={font.value} value={font.value}>{font.label}</option>
            ))}
          </select>
        </div>
        
        {/* Title Color */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Poppins']">
            Title Color
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={settings.titleColor}
              onChange={(e) => handleSettingChange('titleColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-300 mr-3 cursor-pointer"
            />
            <input
              type="text"
              value={settings.titleColor}
              onChange={(e) => handleSettingChange('titleColor', e.target.value)}
              className="w-full px-4 py-3 border border-[#d0c3b1] rounded-lg shadow-sm bg-[#e9e3d9] font-mono"
            />
          </div>
        </div>
        
        {/* Panel Arrangement - Only 2x2 Grid is available */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Poppins']">
            Panel Arrangement
          </label>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => handleSettingChange('panelArrangement', '2x2 Grid')}
              className="flex flex-col items-center justify-center p-4 border border-[#d0c3b1] bg-[#e9e3d9] text-gray-700 rounded-lg transition-colors"
            >
              <div className="grid grid-cols-2 gap-1 w-16 h-16 mb-2">
                <div className="bg-blue-200 rounded"></div>
                <div className="bg-blue-200 rounded"></div>
                <div className="bg-blue-200 rounded"></div>
                <div className="bg-blue-200 rounded"></div>
              </div>
              <span className="text-sm font-medium font-['Poppins']">2×2 Grid</span>
            </button>
          </div>
        </div>
        
        {/* Panel Form */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-['Poppins']">
            Panel Style
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSettingChange('panelForm', 'Rounded')}
              className={`flex flex-col items-center justify-center p-4 border ${
                settings.panelForm === 'Rounded' 
                  ? 'border-[#d0c3b1] bg-[#d0c3b1] text-gray-700' 
                  : 'border-[#d0c3b1] bg-[#e9e3d9] text-gray-700'
              } rounded-lg transition-colors`}
            >
              <div className="w-16 h-16 bg-gray-200 rounded-xl mb-2"></div>
              <span className="text-sm font-medium font-['Poppins']">Rounded</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleSettingChange('panelForm', 'Square')}
              className={`flex flex-col items-center justify-center p-4 border ${
                settings.panelForm === 'Square' 
                  ? 'border-[#d0c3b1] bg-[#d0c3b1] text-gray-700' 
                  : 'border-[#d0c3b1] bg-[#e9e3d9] text-gray-700'
              } rounded-lg transition-colors`}
            >
              <div className="w-16 h-16 bg-gray-200 mb-2"></div>
              <span className="text-sm font-medium font-['Poppins']">Square</span>
            </button>
          </div>
        </div>
        
        {/* Effects Section */}
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-800 mb-3 font-['Poppins']">Effects</h3>
          <div className="bg-[#e9e3d9] p-4 rounded-lg space-y-3 border border-[#d0c3b1]">
            {/* Panel Shadow Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700 font-['Poppins']">Panel Shadow</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.panelShadow}
                  onChange={(e) => handleSettingChange('panelShadow', e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${settings.panelShadow ? 'bg-[#f0b90b]' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.panelShadow ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
            
            {/* Title Shadow Toggle */}
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm font-medium text-gray-700 font-['Poppins']">Title Shadow</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={settings.titleShadow}
                  onChange={(e) => handleSettingChange('titleShadow', e.target.checked)}
                  className="sr-only"
                />
                <div className={`block w-12 h-6 rounded-full transition-colors ${settings.titleShadow ? 'bg-[#f0b90b]' : 'bg-gray-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${settings.titleShadow ? 'transform translate-x-6' : ''}`}></div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComicSettings;
