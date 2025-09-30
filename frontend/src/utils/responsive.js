// Responsive breakpoints
export const breakpoints = {
  xs: 480,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1600,
};

// Check if screen is mobile
export const isMobile = () => {
  return window.innerWidth <= breakpoints.md;
};

// Check if screen is tablet
export const isTablet = () => {
  return window.innerWidth > breakpoints.md && window.innerWidth <= breakpoints.lg;
};

// Check if screen is desktop
export const isDesktop = () => {
  return window.innerWidth > breakpoints.lg;
};

// Get responsive column spans
export const getResponsiveColumns = (mobile = 24, tablet = 12, desktop = 8) => {
  return {
    xs: mobile,
    sm: mobile,
    md: tablet,
    lg: desktop,
    xl: desktop,
    xxl: desktop,
  };
};

// Get responsive table scroll
export const getTableScroll = (minWidth = 800) => {
  return isMobile() ? { x: minWidth } : {};
};

// Get responsive modal width
export const getModalWidth = (defaultWidth = 600) => {
  if (isMobile()) return '95%';
  if (isTablet()) return '80%';
  return defaultWidth;
};