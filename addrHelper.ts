import { Bech32 } from '@cosmjs/encoding';

exports.to_stars_addr = (addr: string) => {
  if (!addr.startsWith('stars')) {
    const { data } = Bech32.decode(addr);
    const starsAddr = Bech32.encode('stars', data);
    addr = starsAddr;
  }
  return addr;
};
