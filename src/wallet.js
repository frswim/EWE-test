import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, arbitrum, sepolia, polygon } from 'wagmi/chains';

const projectId = '17e75bfaa8c00c758e184a3d27137dee';
const chains = [ mainnet, arbitrum, sepolia, polygon ];

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  ssr: true,

});

const web3Modal = createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: "light"
});


export { web3Modal, wagmiConfig };
