import { toBech32, fromBech32 } from 'cosmwasm';

export const toStars = (addr: string) => {
  const { data } = fromBech32(addr);
  const starsAddr = toBech32('stars', data);
  // wallet address length 20, contract address length 32
  if (![20, 32].includes(data.length)) {
    throw new Error('Invalid address: ' + addr + ' ' + starsAddr);
  }
  addr = starsAddr;

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
