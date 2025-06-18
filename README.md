# 錢包DApp (羊星測驗)
此版本運用 vite + react + wagmi，並使用reown (原walletConnect) 建立多種錢包的連結支援。

運行時請如下動作執行:

1. 安裝所需套件 ```npm install```


2. 運行於本地端 ```npm run dev```


3. 透過連結進入 http://localhost:5137


# 各檔用途:
1. App.jsx:存在於 /src ，負責本Dapp的渲染元件控制。
2. main.jsx:存在於 /src ，負責渲染App.jsx。
3. wallet.js:存在於 /src ，負責Dapp可連接之區塊鏈的設定。
4. ChainList.json:存在於 /public ，提供區塊鏈名與代幣的Library。
5. App.css, main.css:存在於 /src ，負責渲染樣式。