function scrollToBottom(){
    var element = document.getElementById("messageBox");
    element.scrollTop = element.scrollHeight;
}

function updateStatus(onSuccess){
    console.log("updateStatus");
    $.ajax({
        type:'POST',
        data: { address : accountAddress},
        url: './tickets/init',
        dataType: 'json',
        cache: false,
        timeout: 1000*10,
        success: function(data){
            console.log("success:",data);
            for(var i=0;i<data.length;i++){
                $('#cell'+i).removeClass();
                if(data[i] == "1"){
                    $('#cell'+i).addClass( "sell" );
                }else  if(data[i] == "2") {
                    $('#cell'+i).addClass( "transfer" );
                }else  if(data[i] == "3") {
                    $('#cell'+i).addClass( "own" );
                }
            }
            $("#messageBox").append("<br><br> >>> <span style='color: blue'> update completed</span>");
            detectSelectState();
            scrollToBottom();
            if(typeof onSuccess === 'function'){
                onSuccess();
            }
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error:",textStatus,jqXHR,errorThrown);
            $("#messageBox").append("<br><br> >>> <span style='color: red'> update failure</span>");
            detectSelectState();
            scrollToBottom();
        }
    });
}


function detectSelectState(){
    for(var i=0;i<TOTAL_SEAT;i++){
        if($('#cell'+i).hasClass("clicked")){
            break;
        }
        if(i==TOTAL_SEAT-1){
            $("#buyTicketsBtn").hide();
            $("#transferTicketsBtn").hide();
            $("#cancelTransferBtn").hide();
        }
    }
}

function setupSeatClick(){
    $("td:not(#description)").on( "click", function() {

        if($(this).hasClass("sell")){
            return;
        }
        var nowSelectMode ;
        if($(this).hasClass("own")){
            nowSelectMode = SelectMode.OWN;
            $("#buyTicketsBtn").hide();
            $("#transferTicketsBtn").show();
            $("#cancelTransferBtn").hide();
        }else if($(this).hasClass("transfer")){
            nowSelectMode = SelectMode.TRANSFER;
            $("#buyTicketsBtn").hide();
            $("#transferTicketsBtn").hide();
            $("#cancelTransferBtn").show();
        }else {
            nowSelectMode = SelectMode.DEFAULT;
            $("#buyTicketsBtn").show();
            $("#transferTicketsBtn").hide();
            $("#cancelTransferBtn").hide();
        }

        if(nowSelectMode != mSeatSelectMode){
            for(var i=0;i<TOTAL_SEAT;i++){
                $('#cell'+i).removeClass("clicked");
            }
        }
        mSeatSelectMode = nowSelectMode;

        if($(this).hasClass("clicked")){
            $(this).removeClass("clicked");
        }else {
            $(this).addClass( "clicked" );
        }
        detectSelectState();

        var cellText = $(this).html();
        console.log(cellText);
    });
}


function earnToken(){
    console.log("earnToken");
    $("#messageBox").append("<br><br> >>>  <span style='color: blue'>  Padding Transaction ......</span>");
    $("#earnTokenBtn").prop("disabled", true);
    scrollToBottom();
    $.ajax({
        type:'POST',
        data: { address : accountAddress},
        url: './tickets/token/earn',
        dataType: 'text',
        cache: false,
        timeout: 1000*90,
        success: function(data){
            console.log("success:",data);
            $("#messageBox").append("<br><br> >>> Succeed to earn token");
            scrollToBottom();
            $("#earnTokenBtn").prop("disabled", false);
            queryToken();
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error:",textStatus,jqXHR,errorThrown);
            $("#messageBox").append("<br><br> >>> "+errorThrown);
            scrollToBottom();
            $("#earnTokenBtn").prop("disabled", false);
        }
    });
}

function queryToken(){
    $("#queryTokenBtn").prop("disabled", true);
    $.ajax({
        type:'POST',
        data: { address : accountAddress},
        url: './tickets/token/query',
        dataType: 'text',
        cache: false,
        timeout: 1000*10,
        success: function(data){
            console.log("success:",data);
            $("#messageBox").append("<br><br> >>> Your have <span style='color: green'>"+data+"</span> R token");
            scrollToBottom();
            $("#queryTokenBtn").prop("disabled", false);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error:",textStatus,jqXHR,errorThrown);
            $("#messageBox").append("<br><br> >>> "+errorThrown);
            scrollToBottom();
            $("#queryTokenBtn").prop("disabled", false);
        }
    });
}

function buyTickets(){

    $("#buyTicketsBtn").prop("disabled", true);
    $("#messageBox").append("<br><br> >>>  <span style='color: blue'>  Padding Transaction ......</span>");
    var seatId =[];
    for(var id=0;id<TOTAL_SEAT;id++){
        if($('#cell'+id).hasClass("clicked")){
            seatId.push(id);
        }
    }
    console.log("buyTickets = ",seatId);

    $.ajax({
        type:'POST',
        data: { address : accountAddress, seatId:JSON.stringify(seatId)},
        url: './tickets/buy',
        dataType: 'text',
        cache: false,
        timeout: 1000*90,
        success: function(data){
            console.log("success:",data);
            $("#messageBox").append("<br><br> >>> <span> buy tickets success</span>");
            updateStatus();
            $("#buyTicketsBtn").prop("disabled", false);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error:",textStatus,jqXHR,errorThrown);
            $("#messageBox").append("<br><br> >>> <span style='color: red'>buy tickets failure</span>");
            $("#buyTicketsBtn").prop("disabled", false);
        }
    });
}

function transferTickets(){
    $("#transferTicketsBtn").prop("disabled", true);
    $("#messageBox").append("<br><br> >>>  <span style='color: blue'>  Padding Transaction ......</span>");
    var seatId =[];
    for(var id=0;id<TOTAL_SEAT;id++){
        if($('#cell'+id).hasClass("clicked")){
            seatId.push(id);
        }
    }
    console.log("buyTickets = ",seatId);
    $.ajax({
        type:'POST',
        data: { address : accountAddress, seatId:JSON.stringify(seatId)},
        url: './tickets/transfer',
        dataType: 'text',
        cache: false,
        timeout: 1000*90,
        success: function(data){
            console.log("success:",data);
            $("#messageBox").append("<br><br> >>> <span> transfer tickets success</span>");
            updateStatus();
            $("#transferTicketsBtn").prop("disabled", false);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error:",textStatus,jqXHR,errorThrown);
            $("#messageBox").append("<br><br> >>> <span style='color: red'>transfer tickets failure</span>");
            $("#transferTicketsBtn").prop("disabled", false);
        }
    });
}

function cancelTransfer(){
    $("#cancelTransferBtn").prop("disabled", true);
    $("#messageBox").append("<br><br> >>>  <span style='color: blue'>  Padding Transaction ......</span>");
    var seatId =[];
    for(var id=0;id<TOTAL_SEAT;id++){
        if($('#cell'+id).hasClass("clicked")){
            seatId.push(id);
        }
    }
    console.log("cancelTransfer = ",seatId);

    $.ajax({
        type:'POST',
        data: { address : accountAddress, seatId:JSON.stringify(seatId)},
        url: './tickets/cancel_transfer',
        dataType: 'text',
        cache: false,
        timeout: 1000*90,
        success: function(data){
            console.log("success:",data);
            $("#messageBox").append("<br><br> >>> <span> cancel transfer tickets success</span>");
            updateStatus();
            $("#cancelTransferBtn").prop("disabled", false);
        },
        error: function(jqXHR, textStatus, errorThrown){
            console.log("error:",textStatus,jqXHR,errorThrown);
            $("#messageBox").append("<br><br> >>> <span style='color: red'> cancel transfer tickets failure</span>");
            $("#cancelTransferBtn").prop("disabled", false);
        }
    });
}