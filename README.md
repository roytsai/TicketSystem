# BlockChain

這裡就不提區塊鍊的概念了，我主要描述想要開發區塊鍊技術該怎麼入手，重點有兩個 :
	
### 1. Smart contract(智能合約)
- 智能合約可依照創建者的需求所創建，透過[solidity](http://solidity.readthedocs.io/en/latest)語言編寫，IDE選擇[Remix](https://ethereum.github.io/browser-solidity/)，並且Environment切換至javascript VM，這樣能夠用最單純的方式來學習合約編寫。
	
	<img src="https://github.com/roytsai/TicketSystem/blob/master/public/images/javascriptVM.jpg" width="500px">
	
- 更進階一點是，實際試著透過RPC的環境去deploy和methods操作。<br>
	1. chrome安裝metamask。
	2. npm install -g ethereumjs-testrpc (直接叫出cmd輸入testrpc即有10組帳號使用)。
	3. 透過操作metamask可連線至Main Ethereum Network或其他Test Network，或連至testrpc的環境。
	
  <img src="https://github.com/roytsai/TicketSystem/blob/master/public/images/metamask.jpg" width="200px">
  
### 2. Decentralized Applications
- 我選擇透過nodejs+express的架構開發，並搭配[web3](https://web3js.readthedocs.io/en/1.0/)套件(1.0.0-beta.34)來操作deploy與methods，需要注意的是前端的web3版本只有到0.20.6與後端可能會不一致，程式碼的寫法會有所不同，初始步驟如下:<br>
	1. 開啟一個nodejs專案<br>
	2. npm install bower -g<br>
	3. bower install web3 (供前端使用)<br>
	4. npm install web3 (供後端使用)<br>
  
  
  
  
## 範例1 (simple_example.ejs)
	
> 程式碼中的第一個範例是一個簡單的例子，如何透過web3來deply、myMethod.call、myMethod.send。<br>
然而你想要成功連結測試網路，除非自己建立節點或透過Infura的節點進行溝通，至[Infura](https://infura.io/signup) 官網申請，就可以收到 API-key。
<img src="https://github.com/roytsai/TicketSystem/blob/master/public/images/simple.jpg" width="500px">

### 1. deploy({data:bytcode}).send() <br>
  - abi, bytecode : 可透過solc編譯或是remix直接複製。
  - userAddress : 使用者帳號的address。
~~~
        const contract = web3.eth.contract(abi);
        contractInstance = contract.new({ data: '0x' + bytecode, from: web3.eth.defaultAccount, gas: 4000000, gasPrice: '5000000000'},
                function(error, result){

                });
~~~

### 2. methods.myMethod().set() <br>
  - contractAddress: 操作已deploy的contract address。<br>
  - valueX: 合約中function的參數，這取決於你的合約設計。<br>
~~~
          var MyContract = web3.eth.contract(abi);
          var myContractInstance = MyContract.at(contractAddress);
          myContractInstance.set(valueX, function(error, transaction){

          });
~~~

### 3. methods.myMethod().call() <br>

~~~
           var MyContract = web3.eth.contract(abi);
           var myContractInstance = MyContract.at(contractAddress);
           var result = myContractInstance.get.call({from:web3.eth.defaultAccount },function(error, result){

           });
~~~

## 範例2 (ticketing_system.js、ticketing_system.ejs)
> 程式碼中的第二個範例，我利用ERC20-token來實作一個訂票系統，而我是在back-end操作contracts，讓使用者在操作上不需要去控制metamask，我在ropsten已經部屬了ticket和token contract，可點選[earn token] 按鍵，每按一次會發給你200元，每個座位是80元，購買後的座位可以再轉售出給別人，此範例是為了練習:

<img src="https://github.com/roytsai/TicketSystem/blob/master/public/images/TicketSystem.jpg" width="500px">

### 1. ERC-20 token的contract

### 2. 不同contract間的溝通




