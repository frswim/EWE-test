import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Web3 from 'web3';
import './App.css';
import { web3Modal } from './wallet';
const res = await fetch('/ChainList.json');
const chainMap = await res.json();

function App() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [chain, setChain] = useState(null);
  const [balance, setBalance] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { connector } = useAccount();

  const connectWallet = async () => {
    try {
      await web3Modal.open(); // 開啟連接錢包
    } catch (err) {
      console.error('連線錯誤', err);
    }
  };

  // 錢包連線成功後，執行 Web3 查詢
  useEffect(() => {
    if (!connector) {
      setAccount(null);
      setChain(null)
      setBalance(null)
      return;
    }

    let provider;
    let web3Instance;

    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) return;
      const account = accounts[0];
      setAccount(account);

      const balanceWei = await web3Instance.eth.getBalance(account);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(4));
    };

    const handleChainChanged = async (chainIdHex) => {
      const chainId = parseInt(chainIdHex, 16);
      setChain(chainMap[chainId] || `Unknown (ID: ${chainId})`);
    };

    const init = async () => {
      provider = await connector.getProvider();
      web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      handleAccountsChanged(accounts);

      const chainId = await web3Instance.eth.getChainId();
      setChain(chainMap[chainId] || `Unknown (ID: ${chainId})`);

      // Add listeners
      provider.on('accountsChanged', handleAccountsChanged);
      provider.on('chainChanged', handleChainChanged);
    };

    init();

    return () => {
      if (provider?.removeListener) {
        provider.removeListener('accountsChanged', handleAccountsChanged);
        provider.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [connector]);

  // 定時取得 Gas Price
  useEffect(() => {
    if (!web3 || !account) return;

    const fetchGasPrice = async () => {
      try {
        const priceWei = await web3.eth.getGasPrice();
        const priceGwei = web3.utils.fromWei(priceWei, 'gwei');
        setGasPrice(parseFloat(priceGwei).toFixed(2));
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error('取得 gas price 失敗:', err);
      }
    };

    fetchGasPrice();
    const interval = setInterval(fetchGasPrice, 5000);
    return () => clearInterval(interval);
  }, [web3, account]);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>EWE-DApp-Test</h1>
      <button class = "fancy-button" onClick={connectWallet}>
        {!account ? (
          '連接錢包'
        ) : (
          <div>
            <div>帳號：{account}</div>
            <div>鏈名稱：{chain}</div>
            <div>餘額：{balance} ETH</div>
          </div>
        )}
      </button>
      {!account ? (
        "尚未連接"
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div>Gas Price：{gasPrice} Gwei</div>
          <div>更新時間：{lastUpdated}</div>
        </div>
      )}
    </div>
  );
}

export default App;
