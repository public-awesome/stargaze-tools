import { Bech32 } from '@cosmjs/encoding';

export const toStars = (addr: string) => {
  if (!addr.startsWith('stars')) {
    const { data } = Bech32.decode(addr);
    const starsAddr = Bech32.encode('stars', data);
    let { data: data2 } = Bech32.decode(starsAddr);
    // wallet address length 44, contract address length 64, cosmos 20
    if (![44, 64, 20].includes(data2.length)) {
      throw new Error('Invalid address: ' + addr + ' ' + starsAddr);
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
