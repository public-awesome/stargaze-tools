import { Bech32 } from '@cosmjs/encoding';

export const toStars = (addr: string) => {
  if (!addr.startsWith('stars')) {
    const { data } = Bech32.decode(addr);
    const starsAddr = Bech32.encode('stars', data);
    addr = starsAddr;
  }
  return addr;
};
