
export const PLATFORM_LOGO_SVG = `
<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="48" fill="#070b14" stroke="#10b981" stroke-width="2"/>
  <path d="M30 70L45 50L55 60L75 35" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M75 35H60M75 35V50" stroke="#10b981" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M25 75H75" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
</svg>
`;

export const generatePlatformLogo = async (): Promise<string | null> => {
  // تم الاستغناء عن التوليد الديناميكي لثبات الهوية
  return null;
};
