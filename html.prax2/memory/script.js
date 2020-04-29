const cards = document.querySelectorAll(".memory-card"); //stored all memory cards;

let isFlipped = false;
let lock = false;
let first, second;
let cardsNumbers = [
  "6card_button",
  "16card_button",
  "26card_button",
  "52card_button"
];
let cardSetting = ["number", "color"];
let curCardsMode = "6card_button";
let curGameMode = "number";
let startButton = "start_button";
let score = 0;
let timer = 0;
let stop;
let counter = cards.length / 2;

function incrementSeconds() {
  timer += 1;
  document.getElementById("time").innerHTML = timer;
}
stop = setInterval(incrementSeconds, 1000);

function clickSettings(event) {
  let curElementId = event.target.id;
  if (curElementId == startButton) {
    var name = document.getElementById("name").value;
    localStorage.setItem("name", name);

    gameStart(curCardsMode, curGameMode);
  } else if (cardsNumbers.includes(curElementId)) {
    curCardsMode = curElementId;
  } else if (cardSetting.includes(curElementId)) {
    curGameMode = curElementId;
  } else {
    throw new Error("wrong settings button clicked");
  }
}

function gameStart(curCardsMode) {
  if (curGameMode == "number") {
    if (curCardsMode == "6card_button") {
      window.location = "6card.html";
    } else if (curCardsMode == "16card_button") {
      window.location = "16card.html";
    } else if (curCardsMode == "26card_button") {
      window.location = "26card.html";
    } else if (curCardsMode == "52card_button") {
      window.location = "52card.html";
    }
  } else if (curGameMode == "color") {
    if (curCardsMode == "6card_button") {
      window.location = "6card_color.html";
    } else if (curCardsMode == "16card_button") {
      window.location = "16card_color.html";
    } else if (curCardsMode == "26card_button") {
      window.location = "26card_color.html";
    } else if (curCardsMode == "52card_button") {
      window.location = "52card_color.html";
    }
  }
}

function flipCard() {
  var err = document.getElementById("mode").innerText;

  if (lock) {
    // to not able click 3 card in a row
    return;
  }
  if (this === first) {
    //help to disable 1 card check
    return;
  }

  this.classList.add("flipped"); //changes class name, so it shows that card if flippedx

  if (!isFlipped) {
    //checks if it is a 1 click or 2 click
    isFlipped = true;
    first = this;
    return;
  }
  isFlipped = false;
  second = this;

  if (err == "Number") {
    checkNumber();
  } else if (err == "Color") {
    checkColor();
  }
}

function checkNumber() {
  if (first.dataset.numbers === second.dataset.numbers) {
    score++;
    counter--;
    disable();
  } else {
    score--;
    flipBack();
  }
  document.getElementById("score").innerHTML = score;
  if (counter == 0) {
    clearInterval(stop);
    localStorage.setItem("Score", score);
    localStorage.setItem("Time", timer);
    sendData();
  }
}

function checkColor() {
  if (
    first.dataset.numbers === second.dataset.numbers &&
    first.dataset.color === second.dataset.color
  ) {
    score++;
    counter--;
    disable();
  } else {
    score--;
    flipBack();
  }

  document.getElementById("score").innerHTML = score;
  if (counter == 0) {
    clearInterval(stop);
    localStorage.setItem("Score", score);
    localStorage.setItem("Time", timer);
    sendData();
  }
}

function getData() {
  //dont know how pernamently save data

  var table = document.getElementById("table");

  var newR = table.insertRow(1);

  var cel1 = newR.insertCell(0);
  var cel2 = newR.insertCell(1);
  var cel3 = newR.insertCell(2);
  var cel4 = newR.insertCell(3);

  cel1.innerHTML = date;
  cel2.innerHTML = localStorage.getItem("Score");
  cel3.innerHTML = localStorage.getItem("Time");
  cel4.innerHTML = localStorage.getItem("name");
}

window.onload = function() {
  getData();
};
function sendData() {
  var score = localStorage.getItem("Score");
  var time = localStorage.getItem("Time");
  var name = localStorage.getItem("name");
  var url = "http://dijkstra.cs.ttu.ee/~albutu/cgi-bin/table_script.py";
  var date = new Date().toLocaleString();

  $.ajax({
    url: url,
    type: "POST",
    datatype: "json",
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    data: {
      time: time,
      score: score,
      date: date,
      name: name
    },
    success: function(response) {
      console.log(response.message);
      console.log(response.keys);
    }
  });
}

function disable() {
  lock = true;
  setTimeout(() => {
    first.removeEventListener("click", flipCard);
    second.removeEventListener("click", flipCard);
    resetCard();
  }, 250);
}

function flipBack() {
  lock = true;
  setTimeout(() => {
    first.classList.remove("flipped");
    second.classList.remove("flipped");
    resetCard();
  }, 500);
}

function resetCard() {
  //to disable 1 card check
  [isFlipped, lock] = [false, false];
  [first, second] = [null, null];
}

(function shuffleBoard() {
  //shuffles board
  cards.forEach(card => {
    let random = Math.floor(Math.random() * 12);
    card.style.order = random;
  });
})();

cards.forEach(card => card.addEventListener("click", flipCard)); //add every card on click , loop throung
