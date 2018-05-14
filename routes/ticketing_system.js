/**
 * Created by Tang on 2018/5/8.
 */
var express = require('express');
var router = express.Router();
var utils = require("./utils/utils.js");
const Web3 = require('web3');
const solc = require('solc');
const fs = require('fs');
const GAS_PRICE =  '4000000000';


const hostPrivateKey = "0x2fe24b0999e9c4280ce4da51533919d513a418eac0e90f5bad5dcfc6087ded11";
const ropstenUri = 'https://ropsten.infura.io/mwg3V7N453hrHF2aP2oR';
const hostAddress = '0x8A5ca8F54a5992ACcf239D469343B75da65C8319'; // ropsten account

//0xb4bc5a1eae77573be7ba57b8c5d89798f0790e99
//1000000,"Roy",12,"R"

// **********local
const testrpcUri = 'http://localhost:8545';
const localAddress = '0x6daeb417c43d202355ce8b9631aac7af5df4ed6a';
const localPrivateKey = "0xd26ae12d7245b4498cc4847d57c3be5dcb1de96d391abcfba7b92e2d89741528";
// **********local

const TokenCA = "0xccf038aeb6f54858b7033661a020ae0c14c30f26";
const TicketsCA = "0xf8360dda773f663043a90e58ac970ee660d1ff87";

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('ticketing_system');
});

router.post('/init', function(req, res, next) {

    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    web3.eth.defaultAccount = hostAddress;
    //compileSolData = compileTokenSol();
    var abi =  JSON.parse(fs.readFileSync("./contracts/abi/Tickets.abi", 'utf8'));

    console.log("req.body.address = ",req.body.address);

    web3.eth.getBalance(String(req.body.address))
        .then(console.log);

    var myContract = new web3.eth.Contract(abi, TicketsCA, {gasPrice: '1000000000',gas: 300000, from: hostAddress});
    myContract.methods.getStatus(String(req.body.address)).call({from: hostAddress},function(error, result){
        console.log("error = ",error);
        console.log("result = ",result);
        if(error == undefined){
            res.send(result);
        }else{
            res.status(500).send(error);
        }
    });

});

router.post('/token/earn', function(req, res, next) {
    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    web3.eth.defaultAccount = hostAddress;
    var abi =  JSON.parse(fs.readFileSync("./contracts/abi/MyToken.abi", 'utf8'));

    web3.eth.accounts.wallet.add({
        privateKey: hostPrivateKey,
        address: hostAddress
    });

    var myContract = new web3.eth.Contract(abi, TokenCA, {gasPrice: GAS_PRICE, from: hostAddress});
    myContract.methods.transfer(String(req.body.address), 200).send({from: hostAddress, gasPrice: GAS_PRICE,gas: 300000,value:0},function(error, result){
        console.log("error = ",error);
        console.log("result = ",result);
        if(error == undefined){
            res.send('ok');
        }else{
            res.status(500).send(error);
        }
    });

});

router.post('/token/query', function(req, res, next) {

    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    web3.eth.defaultAccount = hostAddress;

    var abi =  JSON.parse(fs.readFileSync("./contracts/abi/MyToken.abi", 'utf8'));

    console.log("req.body.queryAddress  = ",req.body.address);

    var myContract = new web3.eth.Contract(abi, TokenCA, {gasPrice: GAS_PRICE, from: hostAddress});
    myContract.methods.balanceOf(String(req.body.address)).call({from: hostAddress},function(error, result){
        console.log("error = ",error);
        if(error == undefined){
            res.send(String(result));
        }else{
            res.send(String(error));
        }
    });

});

router.post('/buy', function(req, res, next) {

    console.log("buy");
    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    web3.eth.defaultAccount = hostAddress;
    var abi =  JSON.parse(fs.readFileSync("./contracts/abi/Tickets.abi", 'utf8'));

    web3.eth.accounts.wallet.add({
        privateKey: hostPrivateKey,
        address: hostAddress
    });

    var myContract = new web3.eth.Contract(abi, TicketsCA, {gasPrice: GAS_PRICE});
    console.log("seatId = ",req.body.seatId);
    var seatId = JSON.parse(req.body.seatId);


    myContract.methods.buy(TokenCA, String(req.body.address),seatId).estimateGas({from: hostAddress})
        .then(function(gasAmount){

            var gas = gasAmount*3;
            console.log("buy  gasAmount = ",gasAmount," -> ",gas);
            myContract.methods.buy(TokenCA, String(req.body.address),seatId).send({from: hostAddress,gasPrice: GAS_PRICE,gas: gas,value:0})
            .on('receipt', function(receipt){
                console.log("result = ",receipt);
                res.send('ok');
            })
            .on('error', function(error){
                console.log("error = ",error);
                res.status(500).send(error);
            });
        })
        .catch(function(error){
            console.error('buy error  = ',error);
            res.status(500).send(error);
        });


});

router.post('/transfer', function(req, res, next) {

    console.log("transfer");
    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    web3.eth.defaultAccount = hostAddress;
    var abi =  JSON.parse(fs.readFileSync("./contracts/abi/Tickets.abi", 'utf8'));

    web3.eth.accounts.wallet.add({
        privateKey: hostPrivateKey,
        address: hostAddress
    });

    var myContract = new web3.eth.Contract(abi, TicketsCA, {gasPrice: GAS_PRICE});
    console.log("seatId = ",req.body.seatId);
    var seatId = JSON.parse(req.body.seatId);


    myContract.methods.proposeTransfer(String(req.body.address),seatId).estimateGas({from: hostAddress})
        .then(function(gasAmount){
            var gas = gasAmount*3;
            console.log("transfer  gasAmount = ",gasAmount," -> ",gas);
            myContract.methods.proposeTransfer(String(req.body.address),seatId).send({from: hostAddress,gasPrice: GAS_PRICE,gas: gas,value:0})
            .on('receipt', function(receipt){
                console.log("result = ",receipt);
                res.send('ok');
            })
            .on('error', function(error){
                console.log("error = ",error);
                res.status(500).send(error);
            });
        })
        .catch(function(error){
           console.error('transfer error  = ',error);
            res.status(500).send(error);
        });

});

router.post('/cancel_transfer', function(req, res, next) {

    console.log("cancel_transfer");
    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    web3.eth.defaultAccount = hostAddress;
    var abi =  JSON.parse(fs.readFileSync("./contracts/abi/Tickets.abi", 'utf8'));

    web3.eth.accounts.wallet.add({
        privateKey: hostPrivateKey,
        address: hostAddress
    });

    var myContract = new web3.eth.Contract(abi, TicketsCA, {gasPrice: GAS_PRICE});
    console.log("seatId = ",req.body.seatId);
    var seatId = JSON.parse(req.body.seatId);


    myContract.methods.cancelTransfer(String(req.body.address),seatId).estimateGas({from: hostAddress})
        .then(function(gasAmount){
            var gas = gasAmount*3;
            console.log("cancel_transfer  gasAmount = ",gasAmount," -> ",gas);
            myContract.methods.cancelTransfer(String(req.body.address),seatId).send({from: hostAddress,gasPrice: GAS_PRICE,gas: gas,value:0})
                .on('receipt', function(receipt){
                    console.log("result = ",receipt);
                    res.send('ok');
                })
                .on('error', function(error){
                    console.log("error = ",error);
                    res.status(500).send(error);
                });
        })
        .catch(function(error){
            console.error('transfer error  = ',error);
            res.status(500).send(error);
        });

});

function deployToken(res){

    var web3 = new Web3(new Web3.providers.HttpProvider(ropstenUri));
    var userAddress = web3.eth.accounts.privateKeyToAccount(privateKey).address;
    web3.eth.defaultAccount = userAddress;

    var input = {
        'ERC20Interface.sol': fs.readFileSync("./contracts/ERC20Interface.sol", 'utf8'),
        'ERC20Token.sol': fs.readFileSync("./contracts/ERC20Token.sol", 'utf8'),
        'MyToken.sol': fs.readFileSync("./contracts/MyToken.sol", 'utf8')
    };

    var compiledContract = solc.compile({sources: input}, 1);
    for(var contractName in compiledContract.contracts) {

        var bytecode = compiledContract.contracts[contractName].bytecode;
        var abi = JSON.parse(compiledContract.contracts[contractName].interface);
        if(contractName == "MyToken.sol:MyToken"){
            console.log(JSON.stringify(abi, undefined, 2));
            utils.deployContract(res, web3, userAddress, privateKey, abi, bytecode);

        }
        //console.log(JSON.stringify(abi, undefined, 2));
        //return [bytecode,abi];
    }
}

function compileTokenSol(){
    var input = {
        'ERC20Interface.sol': fs.readFileSync("./contracts/ERC20Interface.sol", 'utf8'),
        'ERC20Token.sol': fs.readFileSync("./contracts/ERC20Token.sol", 'utf8'),
        'MyToken.sol': fs.readFileSync("./contracts/MyToken.sol", 'utf8')
    };

    var compiledContract = solc.compile({sources: input}, 1);
    for(var contractName in compiledContract.contracts) {

        var bytecode = compiledContract.contracts[contractName].bytecode;
        var abi = JSON.parse(compiledContract.contracts[contractName].interface);
        if(contractName == "MyToken.sol:MyToken"){
            //console.log(JSON.stringify(abi, undefined, 2));
            return [bytecode,abi];
        }
    }
}



module.exports = router;