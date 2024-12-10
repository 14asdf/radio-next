export const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const encodeUrl = url => {
  return btoa(url);
};

export const decodeUrl = id => {
  return atob(id);
};

export const findStation = (audioSrc, stations) => {
  const station = stations.find(station => station.streamUrl === decodeUrl(audioSrc));
  return station ? station : null;
};
