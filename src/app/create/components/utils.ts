import { ComicSettings } from './types';

// Get panel border radius based on settings
export const getPanelBorderRadius = (settings: ComicSettings): string => {
  return settings.panelForm === 'Rounded' ? '12px' : '0';
};

// Get panel shadow style
export const getPanelShadowStyle = (settings: ComicSettings): string => {
  if (!settings.panelShadow) return '';
  
  return `${settings.titleShadowOffsetX}px ${settings.shadowVerticalOffset}px ${settings.shadowBlurRadius}px ${settings.shadowSpreadRadius}px rgba(0,0,0,${settings.shadowOpacity})`;
};

// Get title shadow style
export const getTitleShadowStyle = (settings: ComicSettings): string => {
  if (!settings.titleShadow) return '';
  
  return `${settings.titleShadowOffsetX}px ${settings.titleShadowOffsetY}px ${settings.titleShadowBlur}px rgba(0,0,0,0.5)`;
};

// Get panel background style
export const getPanelBackgroundStyle = (settings: ComicSettings): string => {
  if (settings.panelBackgroundType === 'Solid') {
    return settings.panelGradientStart;
  }
  
  // Gradient
  const direction = settings.panelGradientDirection === 'Diagonal Down' 
    ? '135deg' 
    : settings.panelGradientDirection === 'Horizontal' 
      ? '90deg' 
      : '180deg';
  
  return `linear-gradient(${direction}, ${settings.panelGradientStart}, ${settings.panelGradientEnd})`;
};

// Get comic background style
export const getComicBackgroundStyle = (settings: ComicSettings): string => {
  if (settings.comicBackgroundType === 'Solid') {
    return settings.comicBackgroundColor;
  }
  
  // Gradient
  return `linear-gradient(135deg, ${settings.comicGradientStart}, ${settings.comicGradientEnd})`;
};
