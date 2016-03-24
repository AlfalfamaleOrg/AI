var Reversi = {};

(function(){

	"use strict";

	var Entity = {

		current: 1,
		bot: 2,
		
		board: {},
		states: {
			0: 'empty',
			1: 'black',
			2: 'white',
			3: 'grey'
		},

		init: function(){

			var query = window.location.search.substring(1);

			var params = query.split('&');

			for(var i = 0; i < params.length; i++){

				var props = params[i].split('=');

				var key = props[0];

				if(key === 'player'){

					if(props[1] == 'white'){

						this.bot = 1;
					}
					else if(props[1] == 'none'){

						this.bot = 0;
					}
					else if(props[1] == 'both'){

						this.bot = 3;
					}
				}
			}

			for(var x = 1; x <= 8; x++){
								
				this.board[x] = {};
				
				for(var y = 1; y <= 8; y++){
					
					this.board[x][y] = 0;
				}
			}

			this.board[4][5] = 2;
			this.board[5][4] = 2;
			this.board[4][4] = 1;
			this.board[5][5] = 1;

			this.board = Rules.addOptions(this.board, this.current);
			Output.displayStones(this.board);
			Output.displayStatus(this.current);

			if(Entity.bot === 0){

				setTimeout(function(){

					Bot.takeTurn(Entity.board, Entity.bot);
				}, 1000);
			}
			else if(this.current === this.bot){

				Bot.takeTurn(this.board, this.current);
			}
		},
		
		flipStones: function(square){

			function flipDirection(ox, oy, dir_x, dir_y){

				var nx = ox + dir_x;
				var ny = oy + dir_y;

				while(nx > 0 && nx <= 8 && ny > 0 && ny <= 8){

					if(Entity.board[nx][ny] !== Entity.current){

						Entity.board[nx][ny] = Entity.current;
					}
					else if(Entity.board[nx][ny] === Entity.current){

						return;
					}

					nx += dir_x;
					ny += dir_y;
				}
			}

			function checkDirection(ox, oy, dir_x, dir_y){

				var nx = ox + dir_x;
				var ny = oy + dir_y;

				var option = false;

				while(nx > 0 && nx <= 8 && ny > 0 && ny <= 8){

					if(Entity.board[nx][ny] === 3){

						return;
					}
					else if(Entity.board[nx][ny] === 0){

						return;
					}
					else if(Entity.board[nx][ny] !== Entity.current){

						option = true;
					}
					else if(Entity.board[nx][ny] === Entity.current && option){

						flipDirection(ox, oy, dir_x, dir_y);
					}

					nx += dir_x;
					ny += dir_y;
				}
			}

			checkDirection(square.x, square.y, 1, -1);
			checkDirection(square.x, square.y, 1, 0);
			checkDirection(square.x, square.y, 1, 1);
			checkDirection(square.x, square.y, 0, -1);
			checkDirection(square.x, square.y, 0, 1);
			checkDirection(square.x, square.y, -1, -1);
			checkDirection(square.x, square.y, -1, 0);
			checkDirection(square.x, square.y, -1, 1);
		}
	};
	
	Reversi.clickSquare = function(square){

		if(Rules.isAllowed(square, Entity.board)){

			Entity.board[square.x][square.y] = Entity.current;
			Entity.flipStones(square);
			var new_player = Rules.getNextPlayer(Entity.board, Entity.current);

			if(new_player === 0){

				Output.displayWinner(
					Rules.determineWinner(Entity.board)
				);
			}
			else{

				Entity.current = new_player;
				Entity.board = Rules.addOptions(Entity.board, Entity.current);
				Output.displayStatus(Entity.current);
			}

			Output.displayStones(Entity.board);

			if(Entity.bot === 0 && new_player !== 0){

				setTimeout(function(){

					Bot.takeTurn(Entity.board, Entity.current);
				}, 1000);
			}

			else if(new_player === Entity.bot){

				Bot.takeTurn(Entity.board, Entity.current);
			}
		}
		else if(Entity.bot === 0){

			setTimeout(function(){

				Bot.takeTurn(Entity.board, Entity.current);
			}, 1000);
		}
		else if(Entity.current === Entity.bot){

			Bot.takeTurn(Entity.board, Entity.current);
		}
	};
	
	Reversi.getColor = function(number){
		
		return Entity.states[number];
	};

	Reversi.current = function(){

		return Entity.current;
	};

	document.addEvent('domready', function(){

		Entity.init();
	});
})();