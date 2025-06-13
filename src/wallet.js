import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet } from 'wagmi/chains';

const projectId = '17e75bfaa8c00c758e184a3d27137dee';
const chains = [mainnet];

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  transports: {
    [mainnet.id]: "http://mainnet.Infura.io",
  },
});

const web3Modal = createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  themeMode: 'dark'
});


export { web3Modal, wagmiConfig };
