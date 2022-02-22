import { Bech32 } from '@cosmjs/encoding';

export const toStars = (addr: string) => {
  if (!addr.startsWith('stars')) {
    const { data } = Bech32.decode(addr);
    const starsAddr = Bech32.encode('stars', data);
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
