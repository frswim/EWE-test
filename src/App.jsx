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
  const [chain, setChain] = useState(["Unknown","Unknown"]);
  const [balance, setBalance] = useState(null);
  const [gasPrice, setGasPrice] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const { connector } = useAccount();

  const connectWallet = async () => {
    try {
      // 開啟連接錢包
      await web3Modal.open();
    } catch (err) {
      console.error('連線錯誤', err);
    }
  };

  //Step.1 錢包連線成功後，執行 Web3 查詢 (When get connector)
  useEffect(() => {
    //Step.1-1 確定是否有連線response
    if (!connector) {
      setAccount(null);
      setChain(["Unknown","Unknown"])
      setBalance(null)
      return;
    }

    let provider;
    let web3Instance;

    //(事件)是否改變帳號(Change account&balance)
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) return;
      const account = accounts[0];
      //重新取得帳號
      setAccount(account);

      //重新取得餘額
      const balanceWei = await web3Instance.eth.getBalance(account);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(6));
    };

    //(事件)是否更改鏈(Change web3&chain&balance&gasprice)
    const handleChainChanged = async (chainIdHex) => {
      //重新取得Web3
      const newProvider = await connector.getProvider();
      web3Instance = new Web3(newProvider);
      setWeb3(web3Instance);

      //重新取得鏈名
      const chainId = parseInt(chainIdHex, 16);
      setChain(chainMap[chainId] || [`Unknown (ID: ${chainId})`, "Unknown Token"]);
      
      //重新取得餘額
      const accounts = await web3Instance.eth.getAccounts(); //因為useState非同步，有可能null
      const balanceWei = await web3Instance.eth.getBalance(accounts[0]);
      const balanceEth = web3Instance.utils.fromWei(balanceWei, 'ether');
      setBalance(parseFloat(balanceEth).toFixed(6));

      //useEffect會因Web3重新渲染gas price(不用多寫)
    };

    //Step.1-2 初始化
    const init = async () => {
      //取得 Web3 連接
      provider = await connector.getProvider();
      web3Instance = new Web3(provider);
      setWeb3(web3Instance);

      //取得帳號與餘額
      const accounts = await web3Instance.eth.getAccounts();
      handleAccountsChanged(accounts);

      //取得鏈名
      const chainId = await web3Instance.eth.getChainId();
      setChain(chainMap[chainId] || [`Unknown (ID: ${chainId})`, "Unknown Token"]);

      //透過provider監聽錢包內事件(因錢包內事件connector無反應)
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

  //Step.2 定時取得 Gas Price (When web3&account changed)
  useEffect(() => {
    //Step.2-1 確認錢包已連線
    if (!web3 || !account) return;
    
    //Step.2-2 取得Gas Price
    const fetchGasPrice = async () => {
      try {
        const priceWei = await web3.eth.getGasPrice();
        const priceGwei = web3.utils.fromWei(priceWei, 'gwei');
        setGasPrice(parseFloat(priceGwei).toFixed(6));
        setLastUpdated(new Date().toLocaleString());
      } catch (err) {
        console.error('取得 gas price 失敗:', err);
      }
    };

    fetchGasPrice();
    //Step.2-3 設定5秒更新
    const interval = setInterval(fetchGasPrice, 5000);
    return () => clearInterval(interval);
  }, [web3, account]);

  //Step.3 回傳顯示頁面
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>EWE-DApp-Test</h1>
      <button className = "fancy-button" onClick={connectWallet}>
        {!account ? (
          '連接錢包'
        ) : (
          <div>
            <div>帳號：{account}</div>
            <div>鏈名：{chain[0]}</div>
            <div>餘額：{balance} {chain[1]}</div>
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
