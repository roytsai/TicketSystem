/**
 * Created by Tang on 2018/5/8.
 */




exports.sayHelloInEnglish = function() {
    return "HELLO";
};

exports.deployContract = function(res, web3, address, privateKey, abi, bytecode){

    //res.render('ticketing_system');

    web3.eth.accounts.wallet.add({
        privateKey: privateKey,
        address: address
    });

    var myContract = new web3.eth.Contract(abi,
        {
            from: address, // default from address
            gasPrice: '1000000000'
        });
    console.log('11111',myContract);

    myContract.deploy({
        data: '0x' + bytecode,
        arguments: [100000, 'Roy', 16, "R"]
    }).send({
        from: address,
        gas: 3000000,
        gasPrice: '1000000000'
    },function(error, transactionHash){
        console.log('error : ',error);
        console.log('transactionHash : ',transactionHash);
        if(error == undefined){
            res.send(transactionHash);
        }else{
            res.status(500).send(error);
        }
    }).on('receipt', function(receipt){
            console.log(receipt);

        })
        .then(function(newContractInstance){
            console.log('newContractAddress = ',newContractInstance.options.address) // instance with the new contract address
        });

}