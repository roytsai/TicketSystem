var express = require('express');
var router = express.Router();
const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');

const testrpcUri = 'http://localhost:8545';
const ropstenUri = 'https://ropsten.infura.io/mwg3V7N453hrHF2aP2oR';

//const ropstenUri = 'https://ropsten.etherscan.io/5PZZX7MAP98FRVADKQYCQMWGJ532RNNGD3';


const mainnetUri = 'https://mainnet.infura.io/mwg3V7N453hrHF2aP2oR ';
const address = '0x8A5ca8F54a5992ACcf239D469343B75da65C8319'; // ropsten account
const privateKey = "0x2fe24b0999e9c4280ce4da51533919d513a418eac0e90f5bad5dcfc6087ded11";
//const address = '0x3f45b28a11855efad36848c2138715dfb7e5bf2c'; // user
const contractAddress = "0xf47c11c296fa1a4f0fd9c79976690a24abbc6b2f";



router.post('/web3/deploy', function(req, res, next) {

    console.log("req.body.url = ",req.body.url);
    console.log("req.body.privateKey = ",req.body.privateKey);

    var web3 = new Web3(new Web3.providers.HttpProvider(req.body.url));
    var userAddress = web3.eth.accounts.privateKeyToAccount(req.body.privateKey).address;
    web3.eth.defaultAccount = userAddress;

    web3.eth.net.getNetworkType()
        .then(console.log);

    deployContract(res, web3, userAddress, req.body.privateKey);
    //console.log('addWallet  = ',addWallet);


    //web3.eth.getTransactionCount("0xf47c11c296fa1a4f0fd9c79976690a24abbc6b2f")
    //    .then(console.log);
    //
    //web3.eth.isSyncing()
    //    .then(console.log);
    //
    //web3.eth.getBlockNumber()
    //    .then(function(number){
    //        console.log('getBlockNumber = ',number);
    //    });

    //web3.eth.accounts.signTransaction({
    //    gas: 2000000
    //}, privateKey)
    //    .then(console.log);


    //deployContract2(web3)



});

router.post('/web3/set', function(req, res, next) {
    console.info("PATH [ /web3/set ]");

    console.log("req.body.url = ", req.body.url);
    console.log("req.body.privateKey = ", req.body.privateKey);
    console.log("req.body.contractAddress = ", req.body.contractAddress);
    console.log("req.body.valueX = ", req.body.valueX);

    var web3 = new Web3(new Web3.providers.HttpProvider(req.body.url));
    var userAddress = web3.eth.accounts.privateKeyToAccount(req.body.privateKey).address;
    web3.eth.defaultAccount = userAddress;

    web3.eth.net.getNetworkType()
        .then(console.log);

    var addWallet = web3.eth.accounts.wallet.add({
        privateKey: req.body.privateKey,
        address: userAddress
    });

    var compileSolData = compileSol("./contracts/SimpleStorage.sol");
    var bytecode =  compileSolData[0];
    var abi = compileSolData[1];

    var myContract = new web3.eth.Contract(abi, req.body.contractAddress, {gasPrice: '4000000000', from: userAddress});

    myContract.methods.set(req.body.valueX).send({from: userAddress,gasPrice:'4000000000',gas: 300000,value:0}).then(
        function(error,transactionHash){
            console.error(error);
            console.log(transactionHash);
            res.send('ok');
    });


});

router.post('/web3/get', function(req, res, next) {
    console.log("PATH [ /web3/get ]");

    console.log("req.body.url = ", req.body.url);
    console.log("req.body.privateKey = ",req.body.privateKey);
    console.log("req.body.contractAddress = ",req.body.contractAddress);

    var web3 = new Web3(new Web3.providers.HttpProvider(req.body.url));
    var userAddress = web3.eth.accounts.privateKeyToAccount(req.body.privateKey).address;

    web3.eth.defaultAccount = userAddress;

    web3.eth.getGasPrice()
        .then(function(gasPrice){
            console.log("GasPrice = ", gasPrice);
        });

    web3.eth.net.getNetworkType()
        .then(function(networkType){
            console.log("NetworkType = ", networkType);
        });

    var compileSolData = compileSol("./contracts/SimpleStorage.sol");
    var bytecode =  compileSolData[0];
    var abi = compileSolData[1];
    var myContract = new web3.eth.Contract(abi, req.body.contractAddress, {gasPrice: '4000000000', from: userAddress});
    myContract.methods.get().call({from: userAddress},function(error, result){
        console.log("error = "+error);
        console.log("result = "+result);
        if(error == undefined){
            res.send(String(result));
        }else{
            res.send(String(error));
        }
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index');

});

function compileSol(path){

    var source = fs.readFileSync(path, 'utf8');
    var compiledContract = solc.compile(source);

    for(var contractName in compiledContract.contracts) {
        // code and ABI that are needed by web3
        // console.log(contractName + ': ' + compiledContract.contracts[contractName].bytecode);
        // console.log(contractName + '; ' + JSON.parse(compiledContract.contracts[contractName].interface));
        var bytecode = compiledContract.contracts[contractName].bytecode;
        var abi = JSON.parse(compiledContract.contracts[contractName].interface);
        //console.log(JSON.stringify(abi, undefined, 2));
        return [bytecode,abi];
    }

}

function deployContract(res, web3, address, privateKey){

    var compileSolData = compileSol("./contracts/SimpleStorage.sol");
    var bytecode =  compileSolData[0];
    var abi = compileSolData[1];

    web3.eth.accounts.wallet.add({
        privateKey: privateKey,
        address: address
    });

    var myContract = new web3.eth.Contract(abi,
        {
            from: address, // default from address
            gasPrice: '4000000000'
        });
    estimationGas(myContract, bytecode);

    myContract.deploy({
        data: '0x' + bytecode
    }).send({
        from: address,
        gas: 3000000,
        gasPrice: '4000000000'
    },function(error, transactionHash){
        console.log('error : ',error);
        console.log('transactionHash : ',transactionHash);
        if(error == undefined){
            res.send(transactionHash);
        }else{
            res.status(500).send(error);
        }
    })
    .on('receipt', function(receipt){
        console.log(receipt);
    })
    .then(function(newContractInstance){
        console.log('newContractAddress = ',newContractInstance.options.address) // instance with the new contract address
    });

}


function estimationGas(myContract, bytecode){
    myContract.deploy({
        data: '0x' + bytecode,
        arguments: []
    })
        .estimateGas(function(err, gas){
            console.log('estimateGas = ',gas);
        });
}

module.exports = router;
