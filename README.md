# BlockChain

	這裡就不提區塊鍊的概念了，我主要描述想要開發區塊鍊技術該怎麼入手，重點有兩個
	
## 1. Smart contract(智能合約)
  * 智能合約可依照創建者的需求所創建，透過[solidity](http://solidity.readthedocs.io/en/latest)語言編寫，IDE可選擇[Remix](https://ethereum.github.io/browser-solidity/)，
	並且Environment切換至javascript VM，這樣能用最單純的方式來學習合約編寫
	
	![](http://www.baidu.com/img/bdlogo.gif)
	
  * 更進階一點是，實際試著透過RPC的環境去deploy和methods操作。
  1. chrome安裝metamask
  2. npm install -g ethereumjs-testrpc
  3. 透過操作metamask可連線至Main Ethereum Network或其他Test Network，或連至testrpc的環境
	
  
  
  
## 2. Decentralized Applications
  透過nodejs+express的架構開發，並搭配web3套件(1.0.0-beta.34)來操作deploy與methods，
