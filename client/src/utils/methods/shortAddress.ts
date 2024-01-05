type ShortAddressType = (address: string) => string;

export const shortAddress: ShortAddressType = (
  address,
  startLength = 6,
  endLength = 4
) => {
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};
