import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, arbitrum, sepolia, polygon, polygonAmoy } from 'wagmi/chains';

const projectId = '17e75bfaa8c00c758e184a3d27137dee';//Reown Appkit 的 ID(錢包整合)
const chains = [ mainnet, arbitrum, sepolia, polygon, polygonAmoy ];//使用wagmi提供的共用節點

//建立可連線的鏈
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  ssr: true,

});

//建立彈窗(Appkit)樣式
const web3Modal = createWeb3Modal({
  wagmiConfig: wagmiConfig,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  themeMode: "light"
});


export { web3Modal, wagmiConfig };
