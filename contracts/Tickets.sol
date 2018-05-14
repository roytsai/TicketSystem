pragma solidity ^0.4.23;

import "./MyToken.sol";

contract Tickets {
    
    enum SeatStatus {DEFAULT, SELL, TRANSFER, OWNER}

    mapping (address => uint[] ) public mOwnerToTicket;
    mapping (uint => address) public mTicketToOwner;
    
    mapping (address => uint[]) public mTransferToTicket;
    mapping (uint => address) public mTicketToTransfer;    
    mapping (uint => bool) public isSelled;

    
    uint256 totalSeat = 30;
    uint256 constant TICKET_PRICE = 80;


    struct Ticket {
        uint id;
    }

    constructor() public{

        // mOwnerToTicket[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = [13,14];
        // mTicketToOwner[13] = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;
        // mTicketToOwner[14] = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;
        
        // mTransferToTicket[0xca35b7d915458ef540ade6068dfe2f44e8fa733c] = [8];
        // mTicketToTransfer[8] = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;
        

        // mOwnerToTicket[0x14723a09acff6d2a60dcdf7aa4aff308fddc160c] = [5,6];
        // mTicketToOwner[5] = 0x14723a09acff6d2a60dcdf7aa4aff308fddc160c;
        // mTicketToOwner[6] = 0x14723a09acff6d2a60dcdf7aa4aff308fddc160c;
        
        
        // isSelled[5] = true;
        // isSelled[6] = true;
        // isSelled[13] = true;
        // isSelled[14] = true;        

    }

    function buy(address _tokenAddress, address _buyer, uint[] _seatId) public returns (bool) {
    // function buy( address _buyer, uint[] _seatId) public returns (bool) {

        for(uint i=0; i<_seatId.length; i++){
            require( isSelled[_seatId[i]] == false );
            require( mTicketToTransfer[_seatId[i]] != _buyer );
            require( contain(mOwnerToTicket[_buyer], _seatId[i]) == false );
        }

        MyToken token = MyToken(_tokenAddress);
        uint balance = token.balanceOf(_buyer);
        uint price = _seatId.length*TICKET_PRICE;
        require(balance > price);

    
        for(i=0; i<_seatId.length; i++){
             isSelled[_seatId[i]] = true;
             mOwnerToTicket[_buyer].push(_seatId[i]);
             mTicketToOwner[_seatId[i]] = _buyer;
             if(mTicketToTransfer[_seatId[i]]!= address(0)){
                 address transfer = mTicketToTransfer[_seatId[i]];
                 removeValue(mTransferToTicket[transfer], _seatId[i]);
                //  delete mTicketToTransfer[_seatId[i]];
                mTicketToTransfer[_seatId[i]] = address(0);
             }
        }
        
        token.withdraw(_buyer, price);
            
        return true;
    }


    function proposeTransfer(address _transferor, uint[] _seatId) public returns (bool){

        uint[] storage ownTickets = mOwnerToTicket[_transferor];
        uint[] storage transferTickets = mTransferToTicket[_transferor];

        //check is yours
        for(uint i=0; i<_seatId.length; i++){
            bool ckeckable = false;
            for(uint j=0; j<ownTickets.length; j++){
                if(_seatId[i] == ownTickets[j]){
                    ckeckable = true;
                    break;
                }
            }
            
            for( j=0; j<transferTickets.length; j++){
                if(_seatId[i] == transferTickets[j]){
                    ckeckable = false;
                    break;
                }
            }
            require(ckeckable == true);
        }


        //¥[¨ìtransfer
        //¦©±¼owner
        mTransferToTicket[_transferor] = marge(mTransferToTicket[_transferor] , _seatId);
        for(i=0; i<_seatId.length; i++){
            isSelled[ _seatId[i] ] = false;
            mTicketToTransfer[_seatId[i]] = _transferor;
            mTicketToOwner[_seatId[i]] = address(0);
            removeValue(mOwnerToTicket[_transferor], _seatId[i]);
        }


        return true;
    }
    
    function cancelTransfer(address _transferor, uint[] _seatId) public returns (bool){
        for(uint i=0; i<_seatId.length; i++){
            require(mTicketToTransfer[_seatId[i]] == _transferor);
        }
        mOwnerToTicket[_transferor] = marge(mOwnerToTicket[_transferor] , _seatId);
        for(i=0; i<_seatId.length; i++){
            isSelled[ _seatId[i] ] = true;
            mTicketToOwner[_seatId[i]] = _transferor;
            mTicketToTransfer[_seatId[i]] = address(0);
            removeValue(mTransferToTicket[_transferor], _seatId[i]);
        } 
    }

    function getStatus(address _user) public view returns (SeatStatus[]){

        SeatStatus[] memory status = new SeatStatus[](totalSeat);
        for(uint id=0; id<totalSeat; id++){
            
            if (isTransfer(_user, id)){
                status[id]= SeatStatus.TRANSFER;
            }else if(isOwner(_user, id)){
                status[id]= SeatStatus.OWNER;
            }else if (isSelled[id]){
                status[id]= SeatStatus.SELL;
            }else{
                status[id]= SeatStatus.DEFAULT;
            }
           
        }        
        return status;
    }
    
    
    function isOwner(address _user, uint _id) private view returns(bool){
        
        return (mTicketToOwner[_id] == _user);

    }
    
    function isTransfer(address _user, uint _id) private view returns(bool){
        uint[] storage transferArray = mTransferToTicket[ _user ];
        for(uint i=0; i<transferArray.length; i++){
            if(transferArray[i] == _id){
                return true;
            }
        } 
        return false;
    }    

    function removeValue(uint[] storage _array,uint _value)  private {
        for (uint i = 0; i<_array.length; i++){
            if(_array[i] == _value){
                removeIndex(_array, i);
                break;
            }
        }
    }    
    
    function removeIndex(uint[] storage array,uint index)  private {
        if (index >= array.length) return;

        for (uint i = index; i<array.length-1; i++){
            array[i] = array[i+1];
        }
        delete array[array.length-1];
        array.length--;
    }
    
    function marge(uint[] _array, uint[] _array2)  private pure returns (uint[]) {
        
        uint[] memory array = new  uint[](_array.length+_array2.length);

        for (uint i = 0; i<_array.length; i++){
            array[i] = _array[i];
        }
        
        for ( i = _array.length; i<array.length; i++){
            array[i] = _array2[i - _array.length];
        }     
        
        return array;
        
    }
    
    function contain(uint[] storage _array, uint _value)  private view returns (bool) {
        
        for (uint i = 0; i<_array.length; i++){
            if(_array[i] == _value){
                return true;
            }
        }

        return false;
        
    }

}