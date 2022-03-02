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

export function validateAddr(addr: string): boolean {
  // validate non-contract addresses
  return checkPrefixAndLength('stars', addr, 44);
}

function checkPrefixAndLength(
  prefix: string,
  data: string,
  length: number
): boolean {
  try {
    const vals = Bech32.decode(data);
    return vals.prefix === prefix && data.length == length;
  } catch (e) {
    return false;
  }
}
