export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const encodeUrl = (url) => {
  return btoa(url);
};

export const decodeUrl = (id) => {
  return atob(id);
};

export const findStation = (audioSrc, stations) => {
  const station = stations.find(
    (station) => station.streamUrl === decodeUrl(audioSrc)
  );
  return station ? station : null;
};

export const createAvatarUrl = (title) => {
  const baseHue = Math.abs(
    title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 360
  );
  const secondHue = (baseHue + 180) % 360; // Complementary color

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:hsl(${baseHue}, 90%, 65%)"/>
          <stop offset="100%" style="stop-color:hsl(${secondHue}, 80%, 55%)"/>
        </linearGradient>
      </defs>
      
      <rect width="100" height="100" fill="url(#grad1)"/>
      <text x="50" y="50" dy="0.1em" fill="white" 
        font-family="sans-serif" font-size="40" font-weight="bold" 
        text-anchor="middle" dominant-baseline="middle">
        ${title.substring(0, 2).toUpperCase()}
      </text>
    </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
