import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { mainnet, arbitrum, sepolia, polygon, polygonAmoy } from 'wagmi/chains';
import { defineChain } from 'viem';

const projectId = '17e75bfaa8c00c758e184a3d27137dee';//Reown Appkit 的 ID(錢包整合)

//加入新的鏈
const kaiaChain = defineChain({
  id: 8217,
  name: 'Kaia',
  nativeCurrency: {
    name: 'Kaia',
    symbol: 'KAIA',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://public-en.node.kaia.io'], // RPC 端點
    },
    public: {
      http: ['https://public-en.node.kaia.io'],
    },
  },
  blockExplorers: {
    default: { name: 'KaiaScan', url: 'https://www.kaiascan.io/' },
  },
  testnet: false,
});

const chains = [ mainnet, arbitrum, sepolia, polygon, polygonAmoy, kaiaChain ];//使用wagmi提供的共用節點

//建立可連線的鏈
const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  ssr: true,

});

//建立彈窗(Appkit)樣式
const web3Modal = createWeb3Modal({
  wagmiConfig: wagmiConfig, //建立連線的方法配置
  projectId,
  enableAnalytics: true, //紀錄有錢包使用數據
  enableOnramp: true, //開啟法幣購買
  themeMode: "light"
});


export { web3Modal, wagmiConfig };
