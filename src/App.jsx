import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Web3 from 'web3';
import './App.css';
import { web3Modal } from './wallet';

function App() {
  const [chainMap, setChainMap] = useState({});
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

  // 載入 ChainList.json
  useEffect(() => {
    const loadChainMap = async () => {
      try {
        const res = await fetch('/ChainList.json');
        const json = await res.json();
        setChainMap(json);
      } catch (err) {
        console.error('載入鏈資料失敗:', err);
      }
    };
    loadChainMap();
  }, []);

  // 錢包連線成功後，執行 Web3 查詢
  useEffect(() => {
    const init = async () => {
      if (!connector) return;
      const provider = await connector.getProvider();
      const web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      const account = accounts[0];
      console.log(account)
      setAccount(account);

      const chainId = await web3Instance.eth.getChainId();
      setChain(chainMap[chainId] || `Unknown (ID: ${chainId})`);

      const balanceWei = await web3Instance.eth.getBalance(account);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(4));
    };

    init();
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
      <h2>DApp with Web3Modal v2</h2>
      <button onClick={connectWallet}>連接錢包</button>
      {!account ? (
        <div>尚未連線錢包</div>
      ) : (
        <div>
          <p>帳號：{account}</p>
          <p>鏈名稱：{chain}</p>
          <p>餘額：{balance} ETH</p>
          <p>Gas Price：{gasPrice} Gwei</p>
          <p>更新時間：{lastUpdated}</p>
        </div>
      )}
    </div>
  );
}

export default App;
