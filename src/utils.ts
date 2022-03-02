import { Bech32 } from '@cosmjs/encoding';

export const toStars = (addr: string) => {
  if (!addr.startsWith('stars')) {
    const { data } = Bech32.decode(addr);
    const starsAddr = Bech32.encode('stars', data);
    // wallet address length 44, contract address length 64
    if (data.length != 44 && data.length != 64) {
      throw new Error('Invalid address: ' + addr);
    }
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
  return (
    checkPrefixAndLength('stars', addr, 44) ||
    checkPrefixAndLength('stars', addr, 64)
  );
}
