export interface PanelImage {
  file: File | null;
  preview: string;
}

export type FontOption = 'SK Concretica' | 'Bangers' | 'Bebas Neue' | 'Comic Neue' | 'Poppins' | 'Montserrat';

export interface ComicSettings {
  title: string;
  titleFont: FontOption;
  titleFontSize: number;
  titleColor: string;
  titleShadow: boolean;
  titleShadowOffsetX: number;
  titleShadowOffsetY: number;
  titleShadowBlur: number;
  titleTopMargin: number;
  titleBottomMargin: number;
  panelArrangement: '2x2 Grid' | 'Custom';
  gutterWidth: number;
  padding: number;
  panelForm: 'Rounded' | 'Square';
  borderType: 'None' | 'Solid' | 'Dashed';
  borderThickness: number;
  borderColor: string;
  internalPadding: number;
  panelShadow: boolean;
  shadowVerticalOffset: number;
  shadowBlurRadius: number;
  shadowSpreadRadius: number;
  shadowColor: string;
  shadowOpacity: number;
  panelBackgroundType: 'Solid' | 'Gradient';
  panelGradientStart: string;
  panelGradientEnd: string;
  panelGradientDirection: string;
  comicBackgroundType: 'Solid' | 'Gradient';
  comicBackgroundColor: string;
  comicGradientStart: string;
  comicGradientEnd: string;
}

// Available font options with their display names
export const fontOptions: { value: FontOption; label: string }[] = [
  { value: 'SK Concretica', label: 'SK Concretica (Default)' },
  { value: 'Bangers', label: 'Bangers (Comic Style)' },
  { value: 'Bebas Neue', label: 'Bebas Neue (Bold)' },
  { value: 'Comic Neue', label: 'Comic Neue (Casual)' },
  { value: 'Poppins', label: 'Poppins (Modern)' },
  { value: 'Montserrat', label: 'Montserrat (Clean)' },
];

// Default settings
export const defaultSettings: ComicSettings = {
  title: 'My Life As',
  titleFont: 'SK Concretica',
  titleFontSize: 42,
  titleColor: '#f0b90b',
  titleShadow: true,
  titleShadowOffsetX: 2,
  titleShadowOffsetY: 2,
  titleShadowBlur: 3,
  titleTopMargin: 5,
  titleBottomMargin: 15,
  panelArrangement: '2x2 Grid',
  gutterWidth: 8,
  padding: 0,
  panelForm: 'Square',
  borderType: 'Solid',
  borderThickness: 1,
  borderColor: '#000000',
  internalPadding: 0,
  panelShadow: false,
  shadowVerticalOffset: 0,
  shadowBlurRadius: 0,
  shadowSpreadRadius: 0,
  shadowColor: '#000000',
  shadowOpacity: 0,
  panelBackgroundType: 'Solid',
  panelGradientStart: '#c1ff72', // Lime green color
  panelGradientEnd: '#c1ff72',
  panelGradientDirection: 'Diagonal Down',
  comicBackgroundType: 'Solid',
  comicBackgroundColor: '#ffffff',
  comicGradientStart: '#ffffff',
  comicGradientEnd: '#ffffff',
};
