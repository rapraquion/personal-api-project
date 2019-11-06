$(document).ready(function() {
  if ($(".splash").is(":visible")) {
    $(".wrapper").css({ opacity: "0" });
  }
  $(".splash-arrow").click(function() {
    $(".splash").slideUp("800", function() {
      $(".wrapper")
        .delay(100)
        .animate({ opacity: "1.0" }, 800);
    });
  });
  // end splash screen

  // initializing
  const newGame = $("#logo");
  const hit = $("#hit");
  const stand = $("#stand");
  let bankrollP = 2000;
  let allCards = [];
  let player = [];
  let dealer = [];
  var playerSum;
  var dealerSum;
  let dealerValues = [];
  let playerValues = [];
  let winsPlayer = 0;
  let winsDealer = 0;
  let tiePlayer = 0;

  // start newgame
  newGame.on("click", () => {
    document.getElementById('adjustbetdown').style.display = "inline";
    document.getElementById('adjustbetup').style.display = "inline";
    document.getElementById('allin').style.display = "inline";
    document.getElementById('hit').style.display = "inline";
    document.getElementById('stand').style.display = "inline";
    document.getElementById('d-wins').innerHTML = winsDealer;
    document.getElementById('p-wins').innerHTML = winsPlayer;
    document.getElementById('ties').innerHTML = tiePlayer;
    bankrollP = bankrollP - 100
    document.getElementById("bank").innerHTML = ' P' + bankrollP;
    document.getElementById('bet').innerHTML = ' P' + 100
    player = [];
    dealer = [];
    dealerValues = [];
    playerValues = [];
    playerSum = 0;
    dealerSum = 0;
    document.getElementById("dealerSum").innerHTML = "";
    document.getElementById("playerSum").innerHTML = "";
    document.getElementById("dealerCards").innerHTML = "";
    document.getElementById("playerCards").innerHTML = "";

    fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
      .then(response => {
        if (response.status != 200) {
          window.alert("Service Error!");
          return;
        }
        response.json().then(data => {
          let api = data;
          let deckID = api.deck_id;
          fetch(
            "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=52"
          ).then(response => {
            if (response.status != 200) {
              window.alert("ID !GET");
              return;
            }
            response.json().then(data => {
              let firstDeal = data.cards;

              // setting KING, QUEEN & JACK to 10
              for (var i = 0; i < firstDeal.length; i++) {
                if (
                  firstDeal[i].value == "KING" ||
                  firstDeal[i].value == "QUEEN" ||
                  firstDeal[i].value == "JACK"
                ) {
                  firstDeal[i].value = 10;
                }

                // setting ACE TO 11
                if (firstDeal[i].value == "ACE") {
                  firstDeal[i].value = 11;
                }

                // setting other cards to number itself
                if (
                  firstDeal[i].value !== "KING" &&
                  firstDeal[i].value !== "QUEEN" &&
                  firstDeal[i].value !== "JACK" &&
                  firstDeal[i].value !== "ACE"
                ) {
                  firstDeal[i].value = parseInt(firstDeal[i].value);
                }
              }
              allCards = firstDeal;
              

              //draw cards to player and dealer
              var card1 = allCards[Math.floor(Math.random() * allCards.length)];
              let index1 = allCards.indexOf(card1);
              allCards.splice(1, 1);
              player.push(card1);

              var card2 = allCards[Math.floor(Math.random() * allCards.length)];
              let index2 = allCards.indexOf(card2);
              allCards.splice(2, 1);
              player.push(card2);

              var card3 = allCards[Math.floor(Math.random() * allCards.length)];
              let index3 = allCards.indexOf(card3);
              allCards.splice(3, 1);
              dealer.push(card3);

              var card4 = allCards[Math.floor(Math.random() * allCards.length)];
              let index4 = allCards.indexOf(card4);
              allCards.splice(4, 1);
              dealer.push(card4);
              //end draw card

              //dealer cards
              for (var i = 0; i < dealer.length; i++) {
                if(i != 0) {
                  card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
                  dealerValues.push(dealer[i].value);
                  document.getElementById("dealerCards").innerHTML += card
                }
                if(i == 0) {
                  card = `<img src="https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_1024x1024.png?v=1523371937" style="width: 110px; height: 140px;"/>`;
                  dealerValues.push(dealer[i].value);
                  document.getElementById("dealerCards").innerHTML += card
                }
              } //dealer card

              // player cards
              for (var i = 0; i < player.length; i++) {
                card = `<img src="${player[i].images.png}" style="transform: rotate(140deg) width: 110px; height: 140px;"/>`;
                playerValues.push(player[i].value);
                document.getElementById("playerCards").innerHTML += card;
              }
              
              // player sum
              function getSum (total, num) {
                return total + num;
              }
              playerSum = playerValues.reduce(getSum);
              dealerSum = dealerValues.reduce(getSum);
              document.getElementById("playerSum").innerHTML = playerSum;
            }); //response id
          }); //response id error
        }); //response deck
      } //response deck error
    ); //end fetch deck
  }); //end newgame

  // bankroll, bet & allin
  $('#adjustbetup').click(() => {
    let cb = parseInt(document.getElementById("bet").innerHTML.split("P")[1]);
    cb = cb + 20;
    let br = parseInt(document.getElementById('bank').innerHTML.split('P')[1]);
    document.getElementById('bank').innerHTML = " P" + (br-20);
    document.getElementById('bet').innerHTML = " P" + cb;
  })
  
  $('#adjustbetdown').click(() => {
    let cb = parseInt(document.getElementById('bet').innerHTML.split("P")[1]);
    cb = cb - 20;
    let br = parseInt(document.getElementById('bank').innerHTML.split("P")[1]);
    document.getElementById('bank').innerHTML = " P" + (br+20);
    document.getElementById('bet').innerHTML = " P" + cb;
  })

  $('#allin').click(() => {
    let cb = parseInt(document.getElementById('bet').innerHTML.split('P')[1]);
    let br = parseInt(document.getElementById('bank').innerHTML.split('P')[1]);
    document.getElementById('bet').innerHTML = ' P' + br;
    document.getElementById('bank').innerHTML = ' P' + 0;
  })
  // end bankroll

// hit
  hit.on("click", () => {
    document.getElementById('adjustbetdown').style.display = 'none';
    document.getElementById('adjustbetup').style.display = 'none';
    document.getElementById('allin').style.display = 'none';
   
  // draw 3rd card
  var card5 = allCards[Math.floor(Math.random()*allCards.length)]
    let index5 = allCards.indexOf(card5);
    allCards.splice(5,1);
    player.push(card5);

  document.getElementById('playerCards').innerHTML = "";
  playerValues = [];

  for(var i = 0; i < player.length; i++) {
    card = `<img src="${player[i].images.png}" style="transform: rotate(140deg) width: 110px; height: 140px;"/>`;
    playerValues.push(player[i].value);
    document.getElementById("playerCards").innerHTML += card;
  }

  function getSum(total, num) {
    return total + num;
  }
  playerSum = playerSum + card5.value;

  if (playerSum > 21 && playerValues.includes(11) == true) {
    let pAce = playerValues.indexOf(11);
    playerValues[pAce] = 1;
    playerSum = playerValues.reduce(getSum);
    document.getElementById('playerSum').innerHTML = playerSum;
  }

  if (playerSum > 21 && playerValues.includes(11) == false) {
    document.getElementById('playerSum').innerHTML = playerSum;
    let cb = parseInt(document.getElementById('bet').innerHTML.split('P')[1]);
    document.getElementById('bet').innerHTML = ' P' + 0;
    bankrollP = document.getElementById('bank').innerHTML.split('P')[1];

    winsDealer = winsDealer + 1;

    document.getElementById('p-wins').innerHTML = winsPlayer;
    document.getElementById('d-wins').innerHTML = winsDealer;
    dealerValues = [];
    document.getElementById('dealerCards').innerHTML = '';

    for(var i = 0; i < dealer.length; i++) {
      card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
      dealerValues.push(dealer[i].value);
      document.getElementById('dealerCards').innerHTML += card;
    }
  }

  if(playerSum <=21){
    document.getElementById('playerSum').innerHTML = playerSum;
  }

  if(dealerSum < 13) {
    //draw 3rd card for dealer
    var card5 = allCards[Math.floor(Math.random()*allCards.length)]
    let index5 = allCards.indexOf(card5);
    allCards.splice(5,1);
    dealer.push(card5);

    document.getElementById('dealerCards').innerHTML = '';
    dealerValues = [];

    for(var i = 0; i < dealer.length; i++){
      if(i != 0){
        card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById('dealerCards').innerHTML += card;
      }
      if(i == 0){
        card = `<img src="https://cdn.shopify.com/s/files/1/0200/7616/products/playing-cards-bicycle-rider-back-1_1024x1024.png?v=1523371937" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById("dealerCards").innerHTML += card
      }
    }

    function getSum(total, num){
      return total + num;
    }

    dealerSum = dealerSum + card5.value;
    if(dealerSum > 21 && dealerValues.includes(11) == true){
      let dAce = dealerValues.indexOf(11);
      dAce = 1;
      dealerSum = dealerValues.reduce(getSum);
    }
    
  } //end dealerSum < 13
}); //end hit



  //stand
  stand.on("click", () => {
    document.getElementById('hit').style.display = 'none';
    document.getElementById('stand').style.display = 'none';

    function getSum (total, num) {
      return total + num;
    }

    dealerValues = [];
    for (var i = 0; i < dealer.length; i++) {
      dealerValues.push(dealer[1].value);
    }

    dealerSum = dealerValues.reduce(getSum);
    //always hit for dealer
    while(playerSum > dealerSum && playerSum <= 21){
      var card7 = allCards[Math.floor(Math.random()*allCards.length)];
      let index7 = allCards.indexOf(card7);
      allCards.splice(index7,1);
      dealer.push(card7)

      document.getElementById('dealerCards').innerHTML = '';
      dealerValues = [];

      for(var i = 0; i < dealer.length; i++){
        if(i != 0){
          card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
          dealerValues.push(dealer[i].value);
          document.getElementById('dealerCards').innerHTML += card;
        }
        if(i == 0){
          card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
          dealerValues.push(dealer[i].value);
          document.getElementById("dealerCards").innerHTML += card
        }
      }

      dealerSum = dealerValues.reduce(getSum);
      if(dealerSum > 21 && dealerValues.includes(11) == true){
        let aceIndex = dealerValues.indexOf(11);
        dealerValues[aceIndex] = 1;
        dealerSum = dealerValues.reduce(getSum);
      }
      document.getElementById('dealerSum').innerHTML = dealerSum;
    } //while end

    dealerSum = dealerValues.reduce(getSum);
    playerSum = playerValues.reduce(getSum);

    // determine winner
    if(dealerSum > playerSum && dealerSum <= 21) {
      winsDealer = winsDealer + 1;

      let cb = parseInt(document.getElementById('bet').innerHTML.split('P')[1]);
      let br = parseInt(document.getElementById('bank').innerHTML.split('P')[1]);
      document.getElementById('bet').innerHTML = " P" + 0;
      bankrollP = document.getElementById('bank').innerHTML.split("P")[1];

      document.getElementById('p-wins').innerHTML = winsPlayer;
      document.getElementById('d-wins').innerHTML = winsDealer;
      dealerValues = [];
      document.getElementById('dealerCards').innerHTML = "";

      for(var i = 0; i < dealer.length; i++){
        card = card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById('dealerCards').innerHTML += card;
      }
    }

    
    if(playerSum > dealerSum && playerSum <= 21){
      let cb = parseInt(document.getElementById('bet').innerHTML.split("P")[1]);
      let br = parseInt(document.getElementById('bank').innerHTML.split("P")[1]);
      document.getElementById('bank').innerHTML = " P" + [br + (cb*2)];
      document.getElementById('bet').innerHTML = " P" + 0;
      bankrollP = document.getElementById('bank').innerHTML.split("P")[1];
      winsPlayer = winsPlayer + 1;
      document.getElementById('p-wins').innerHTML = winsPlayer;
      document.getElementById('d-wins').innerHTML = winsDealer;
      dealerValues = [];
      document.getElementById('dealerCards').innerHTML = "";

      for (var i = 0; i < dealer.length; i++){
        card = card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById('dealerCards').innerHTML += card;
      }
    }

    if(dealerSum <= 21 && playerSum > 21) {
      winsDealer = winsDealer + 1;
      let cb = parseInt(document.getElementById('bet').innerHTML.split("P")[1]);
      let br = parseInt(document.getElementById('bank').innerHTML.split("P")[1]);
      document.getElementById('bet').innerHTML = " P" + 0;
      bankrollP = document.getElementById('bank').innerHTML.split("P")[1];

      document.getElementById('p-wins').innerHTML = winsPlayer;
      document.getElementById('d-wins').innerHTML = winsDealer;
      dealerValues = [];
      document.getElementById('dealerCards').innerHTML = "";

      for(var i = 0; i < dealer.length; i++){
        card = card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById('dealerCards').innerHTML += card;
      }
    }

    if(playerSum <=21 && dealerSum > 21){
      let cb = parseInt(document.getElementById('bet').innerHTML.split("P")[1]);
      let br = parseInt(document.getElementById('bank').innerHTML.split("P")[1]);
      document.getElementById('bank').innerHTML = " P" + (br + cb);
      document.getElementById('bet').innerHTML = " P" + 0;
      bankrollP = document.getElementById('bank').innerHTML.split("P")[1];
      winsPlayer = winsPlayer + 1;

      document.getElementById('p-wins').innerHTML = winsPlayer;
      document.getElementById('d-wins').innerHTML = winsDealer;
      dealerValues = [];
      document.getElementById('dealerCards').innerHTML = "";

      for(var i = 0; i < dealer.length; i++){
        card = card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById('dealerCards').innerHTML += card;
      }
    } 
    //end determining winner
    // if tied
    if(playerSum == dealerSum) {
      tiePlayer = tiePlayer + 1;
      document.getElementById('ties').innerHTML = tiePlayer;
      document.getElementById('p-wins').innerHTML = winsPlayer;
      document.getElementById('d-wins').innerHTML = winsDealer;

      dealerValues = [];
      document.getElementById('dealerCards').innerHTML = "";

      for(var i = 0; i < dealer.length; i++){
        card = card = `<img src="${dealer[i].images.png}" style="width: 110px; height: 140px;"/>`;
        dealerValues.push(dealer[i].value);
        document.getElementById('dealerCards').innerHTML += card;
      }
    } //end tie
  }); //end stand
}); //document end

$(window).scroll(function() {
  $(window).off("scroll");
  $(".splash").slideUp("800", function() {
    $("html, body").animate({ scrollTop: "0px" }, 100);
    $(".wrapper")
      .delay(100)
      .animate({ opacity: "1.0" }, 800);
  });
});
