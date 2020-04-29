(function init() {
  let player;
  let game;
  const user1 = "X";
  const user2 = "O";

  const socket = io.connect("http://dijkstra.cs.ttu.ee:7500");

  class Player {
    constructor(name, type) {
      this.name = name;
      this.type = type;
      this.cur = true;
      this.arr = 0;
    }

    static get wins() {
      return [7, 56, 448, 73, 146, 292, 273, 84];
    }
    /**
Чтобы определить условие выигрыша, каждый квадрат помечается слева
      * вправо, сверху вниз, с последовательными степенями 2. Каждая клетка
      * таким образом представляет отдельный бит в 9-битной строке, и
      * квадраты игрока в любой момент времени могут быть представлены как
      * уникальное 9-битное значение. Таким образом, победитель может быть легко определен
      * проверка, покрывали ли текущие 9 бит игрока
      * из восьми комбинаций «три в ряд».

     * 
     * суммы всех комбинаций
     * в аррее все эти чисоа у нас
   
     */

    updatearr(num) {
      this.arr += num;
    }

    getarr() {
      return this.arr;
    }

    // назначить чей ход
    setCurrent(turn) {
      this.cur = turn;
      const message = turn ? "Sinu kord" : "Ootame..";
      $("#turn").text(message);
    }

    getName() {
      return this.name;
    }

    getType() {
      return this.type;
    }

    getCurrent() {
      return this.cur;
    }
  }

  // данная "комната"
  class Game {
    constructor(roomId) {
      this.roomId = roomId;
      this.board = [];
      this.moves = 0;
    }

    Board() {
      function ClickHandler() {
        const row = parseInt(this.id.split("_")[1][0], 10);
        const col = parseInt(this.id.split("_")[1][1], 10);
        if (!player.getCurrent() || !game) {
          alert("Mitte sinu kord");
          return;
        }

        if ($(this).prop("disabled")) {
          alert("On juba kasutusel");
          return;
        }

        // обновление после хода
        game.playTurn(this);
        game.updateBoard(player.getType(), row, col, this.id);

        player.setCurrent(false);
        player.updatearr(1 << (row * 3 + col));

        game.Winner();
      }

      for (let i = 0; i < 3; i++) {
        this.board.push(["", "", ""]);
        for (let j = 0; j < 3; j++) {
          $(`#button_${i}${j}`).on("click", ClickHandler);
        }
      }
    }
    // отобразить игру , не меню
    displayBoard(message) {
      $(".menu").css("display", "none");
      $(".gameBoard").css("display", "block");
      $("#userHello").html(message);
      this.Board();
    }
    /**
     * обновить доску
     *
     * @param {string} type
     * @param {int} row
     * @param {int} col
     * @param {string} tile
     */
    updateBoard(type, row, col, tile) {
      $(`#${tile}`)
        .text(type)
        .prop("disabled", true);
      this.board[row][col] = type;
      this.moves++;
    }

    getRoomId() {
      return this.roomId;
    }

    // для другого человек обновление всего

    playTurn(tile) {
      const clickedTile = $(tile).attr("id");

      socket.emit("playTurn", {
        tile: clickedTile,
        room: this.getRoomId()
      });
    }

    Winner() {
      const currentPlayerPositions = player.getarr();

      Player.wins.forEach(winningPosition => {
        if ((winningPosition & currentPlayerPositions) === winningPosition) {
          game.announceWinner();
        }
      });

      const tieMessage = "Tied";
      if (this.Tie()) {
        socket.emit("gameEnded", {
          room: this.getRoomId(),
          message: tieMessage
        });
        alert(tieMessage);
        location.reload();
      }
    }

    Tie() {
      return this.moves >= 9;
    }

    announceWinner() {
      const message = `${player.getName()} voidab!`;
      socket.emit("gameEnded", {
        room: this.getRoomId(),
        message
      });
      alert(message);
      location.reload();
    }

    endGame(message) {
      alert(message);
      location.reload();
    }
  }

  $("#new").on("click", () => {
    const name = $("#user1_name").val();
    if (!name) {
      alert("Sisesta nimi");
      return;
    }
    socket.emit("createGame", { name });
    player = new Player(name, user1);
  });
  //prisoedinitsa k igre
  $("#join").on("click", () => {
    const name = $("#user2_name").val();
    const roomID = $("#room").val();
    if (!name || !roomID) {
      alert("Sisesta nimi ja ID.");
      return;
    }
    socket.emit("joinGame", { name, room: roomID });
    player = new Player(name, user2);
  });

  // начало новой игры
  socket.on("newGame", data => {
    const message = `Teise inimese nimi ja ID: 
      ${data.room}`;

    // Create game for player 1
    game = new Game(data.room);
    game.displayBoard(message);
  });

  //кто создает тот начинает
  socket.on("user1", data => {
    const message = `Game started`;
    $("#userHello").html(message);
    player.setCurrent(true);
  });

  socket.on("user2", data => {
    const message = `Hello!`;

    game = new Game(data.room);
    game.displayBoard(message);
    player.setCurrent(false);
  });

  //proverka posl hoda
  socket.on("turnPlayed", data => {
    const row = data.tile.split("_")[1][0];
    const col = data.tile.split("_")[1][1];
    const opp = player.getType() === user1 ? user2 : user1;

    game.updateBoard(opp, row, col, data.tile);
    player.setCurrent(true);
  });

  // endagme
  socket.on("gameEnd", data => {
    game.endGame(data.message);
    socket.leave(data.room);
  });

  /**
   * error
   */
  socket.on("err", data => {
    game.endGame(data.message);
  });
})();
