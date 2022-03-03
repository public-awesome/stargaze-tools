import { toBech32, fromBech32 } from 'cosmwasm';

export const toStars = (addr: string) => {
  if (!addr.startsWith('stars')) {
    const { data } = fromBech32(addr);
    const starsAddr = toBech32('stars', data);
    addr = starsAddr;
  }
  return addr;
};

export const isValidHttpUrl = (uri: string) => {
  let url;

  try {
    url = new URL(uri);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
};
