import { toast, ToastOptions } from 'react-toastify';

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'light',
  style: { 
    background: '#e9e3d9',
    color: '#3c3c3c',
    borderRadius: '8px',
    border: '1px solid #d0c3b1',
    fontFamily: 'SK Concretica, system-ui, sans-serif'
  },
};

// Success toast
export const showSuccess = (message: string, options?: ToastOptions) => {
  toast.success(message, { ...defaultOptions, ...options });
};

// Error toast
export const showError = (message: string, options?: ToastOptions) => {
  toast.error(message, { ...defaultOptions, ...options });
};

// Info toast
export const showInfo = (message: string, options?: ToastOptions) => {
  toast.info(message, { ...defaultOptions, ...options });
};

// Warning toast
export const showWarning = (message: string, options?: ToastOptions) => {
  toast.warning(message, { ...defaultOptions, ...options });
};
