export const DONATION_CONFIG = {
  popupInterval: 15 * 60 * 1000, // 15 minutes in milliseconds
  storageKey: "donationPopupLastShown",
} as const;

export const CRYPTO_ADDRESSES = {
  bitcoin: {
    symbol: "BTC",
    name: "Bitcoin",
    address: "bc1q8tyal73vlylp22qs8sz7hd853j43lje8cryhrm",
  },
  ethereum: {
    symbol: "ETH",
    name: "Ethereum",
    address: "0xbb842406Fa06B749a5894220912f3199B511A15E",
  },
} as const;

export type CryptoType = keyof typeof CRYPTO_ADDRESSES;
