# BlockChain

這裡就不提區塊鍊的概念了，我主要描述想要開發區塊鍊技術該怎麼入手，重點有兩個 :
	
### 1. Smart contract(智能合約)
- 智能合約可依照創建者的需求所創建，透過[solidity](http://solidity.readthedocs.io/en/latest)語言編寫，IDE可選擇[Remix](https://ethereum.github.io/browser-solidity/)，並且Environment切換至javascript VM，這樣能用最單純的方式來學習合約編寫。
	
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
  
  
  
  
## 範例1
	
> 程式碼中的第一個範例是一個簡單的例子，如何透過web3來deply、myMethod.call、myMethod.send。若期待web3能成功與測試網路溝通，除非自己成為節點或透過Infura，至[Infura](https://infura.io/signup) 官網申請，就可以收到 API-key。
<img src="https://github.com/roytsai/TicketSystem/blob/master/public/images/simple.jpg" width="500px">

### 1. deploy({data:bytcode}).send() <br>
  - abi, bytecode : 可透過solc編譯或是remix直接複製。
  - userAddress : 使用者帳號的address。
~~~
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    var myContract = new web3.eth.Contract(abi,
        {
            from: userAddress, 
            gasPrice: '4000000000'
        });
	
    myContract.deploy({
        data: '0x' + bytecode
    }).send({
        from: userAddress,
        gas: 3000000,
        gasPrice: '4000000000'
    },function(error, transactionHash){
        if(error == undefined){
            res.send(transactionHash);
        }else{
            res.status(500).send(error);
        }
    })	
~~~

### 2. methods.myMethod().set() <br>
  - userPrivateKey: 使用者的privateKey，會需要扣value的動作就會需要addWallet這個動作。<br>
  - contractAddress: 操作已deploy的contract的address。<br>
  - valueX: 合約中function的參數取決於你的設計。<br>
~~~
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    var addWallet = web3.eth.accounts.wallet.add({
        privateKey: userPrivateKey,
        address: '0x3f45b28a11855efad36848c2138715dfb7e5bf2c'
    });

    var myContract = new web3.eth.Contract(abi, contractAddress, {gasPrice: '4000000000', from: userAddress});

    myContract.methods.set(valueX).send({from: userAddress,gasPrice:'4000000000',gas: 300000,value:0}).then(
        function(error,transactionHash){
            console.error(error);
            console.log(transactionHash);
            res.send('ok');
    });
~~~

### 3. methods.myMethod().call() <br>

~~~
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    var myContract = new web3.eth.Contract(abi, contractAddress, {gasPrice: '4000000000', from: userAddress});

    myContract.methods.get().call({from: userAddress},function(error, result){
        if(error == undefined){
            res.send(String(result));
        }else{
            res.send(String(error));
        }
    });
~~~

## 範例2
> 程式碼中的第二個範例，我利用ERC20-token來實作一個訂票系統，使用者安裝metamask後切換到ropsten，我在ropsten已經deploy了ticket和token contract，點選[earn token] Button，每按一次會發給你200元，每個座位是80元，購買後的座位可以再轉售出給別人，此範例是為了練習:

### 1. ERC-20 token的contract

### 2. 不同contract間的溝通




