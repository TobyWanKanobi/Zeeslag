var App = new function() {
	
	// Properties
	this.currentGame;
	this.gameBoard = '.gameboard';
	this.localShips = {'ships': []};
    this.loadedGameId;
	
	// Methods
	this.generateCoords = function() {
		
		var coords = [];
		for(var i = 1; i < 11; i++) {
			
			for(var x = 0; x < 10; x++) {
				coords.push({'x' : String.fromCharCode(97 + x), 'y' : i});
			}
		}
		
		return coords;
	};
	
	this.initBoard = function() {
		
		var coords = this.generateCoords();
		
		$.each(coords, function(index, value){
			var cell = '<div class="cell" data-x="'+ value.x + '" data-y="'+ value.y +'"></div>';
			$(App.gameBoard + ' .locations').append(cell);
		});
	};
	
	this.populateGameList = function(myGames) {
		
		$('#gamelist tbody').empty();
		if(myGames.length === 0) {
			$('#gamelist tbody').append('<tr><td colspan="3">You have no games yet</td></tr>');
			return false;
		}
		
		$('#gamelist tbody').empty();
		
		$.each(myGames, function(index, game){
			
			if(game.enemyName === undefined){
				game.enemyName = 'Waiting for player'
			}
			$('#gamelist tbody').append('<tr><td>' + game._id + '</td><td>' + game.enemyName + '</td>SATUS<td>' + game.status + '</td><td><button class="btn btn-success play-game" data-gameId="'+ game._id +'">PLAY</button></td></tr>');
		});
		
	};

    this.populateShipList = function(ships) {
       
	   $('.shiplist tbody').empty();
	   
	    $(ships).each(function(index, ship){
			
			App.localShips.ships[ship._id] = new shipObj(ship);
            $('.shiplist tbody').append('<tr><td width="200">'+$(this)[0].name+'</td><td width="100" data-id="'+$(this)[0]._id+'"><img data-type="horizontal" src="images/glyphicons-212-right-arrow.png" class="boat" /><img data-type="vertical" src="images/glyphicons-213-down-arrow.png" class="boat" /></div><div class="resetButton" style="display: none"><button class="btn btn-danger resetship">Reset</button></div></td><td><div class="boatLength">'+$(this)[0].length +'</div></td></tr>');
			
        });
		
        $('.boat').draggable({
            revert: true
        });
    };
	
	// Load GAME
	this.loadGame = function(game){
		App.currentGame = game;
        App.loadedGameId = game._id;
		
		$('#myGameboard .cell').css('background-color', '');
		$('#enemyGameboard .cell').css('background-color', '');
		$('#your-turn').html('');

		$('.shipPanel').css('display', 'none');
		
		if(game.status === 'started'){
			if(game.yourTurn) {
				$('#your-turn').html('It\'s my turn');
			} else {
				$('#your-turn').html('Opponent\'s turn');
			}
			
			drawShots(game);
			
		} else if(game.status === 'setup'){
			BattleshipAPI.getShips(App.populateShipList);
			$('.shipPanel').css('display', 'block');
		} else if(game.status === 'done'){
			//console.log(game);
			if(game.youWon) {
				$('#modalWon').modal('show');
			} else {
				$('#modalLost').modal('show');
			}
			
		}
		
		drawShips(game);
	};

    this.loopCoords = function (coord, length, isVertical){
		
		var temp = coord
        var shipCoords = [];
         
		for (var i = 0; i < length; i++) {
                
			if(isVertical){
                shipCoords.push({'x' : coord.x, 'y' : coord.y + i});
            }else {
				shipCoords.push({'x' : String.fromCharCode(coord.x.charCodeAt(0)+ i), 'y' : coord.y});
			
			}
        }
	
        return shipCoords;
    }

    this.checkCoords = function(coords){

        var result = true;
        $(coords).each(function(){
            console.log($(this)[0]['x'].charCodeAt(0));
            if($('#myGameboard div[data-x='+$(this)[0]['x']+'][data-y='+$(this)[0]['y']+']').hasClass('filled')){             
                result = false;
            }else if($(this)[0]['y'] > 10 || $(this)[0]['y'] < 1){
                result = false;
            }else if($(this)[0]['x'].charCodeAt(0) > 106 || $(this)[0]['x'].charCodeAt(0) < 97){
                result = false;
            }
        })
        return result;
    }

    this.checkBoard = function(){

        var result = true;

        $(App.localShips.ships).each(function(){
            if(typeof $(this)[0]['startCell']['x'] === 'undefined'){
               result = false;
            }
        })

        return result;
    }

    this.draggingUI = function (id){
        $('.shiplist td[data-id='+id+'] img').hide();
        $('.shiplist td[data-id='+id+'] .resetButton').show('');
    }

    this.settingUI = function (id){
        $('.shiplist td[data-id='+id+'] img').show();
        $('.shiplist td[data-id='+id+'] .resetButton').hide('');
    }
    
   this.nextChar = function(c) {
        return String.fromCharCode(c.charCodeAt(0));
   };

};


$(document).ready(function(){
	App.initBoard();
	BattleshipAPI.getMyGames(App.populateGameList);
	BattleshipAPI.getShips(App.populateShipList);
	
	// New player game 
	$('#newPlayerGame').on('click', function(){
		BattleshipAPI.newGame('PLAYER', App.populateGameList);
	});
	
	// New CPU game
	$('#newCPUGame').on('click', function(){
		BattleshipAPI.newGame('CPU', App.populateGameList);
	});
	
	// Delete all games
	$('#deleteGames').on('click', function(){
		BattleshipAPI.deleteGames(App.populateGameList);
	});
	
	$('#refresh-games').on('click', function(){
		BattleshipAPI.getMyGames(App.populateGameList);
		console.log('haha');
	});
	
	$('#gamelist tbody').on('click', '.play-game', function(event){
	
		var gameId = $(event.target).data('gameid');
		$('#gamelist .selected').removeClass('selected');
		$(event.target).closest('tr').addClass('selected');
		BattleshipAPI.getGameInfo(gameId, App.loadGame);
	
	});
	
	var AfterShot = function(coord, status) {
	
		var color;
		
		if(status === 'BOOM') {
			color = '#FF0000';
			console.log('Shot hit!');
		} else if(status === 'SPLASH') {
			color = '#0000FF';
			console.log('shot missed!');
		}
		
		fillCell('#enemyGameboard', coord, color);
	};
	// Shot Click EVENT
	$('#enemyGameboard .locations').on('click', '.cell', function(e){
		
		var coord = {'x' : $(e.target).data('x'), 'y' : $(e.target).data('y')};
		BattleshipAPI.submitShot(App.currentGame._id, coord, App.loadGame, AfterShot);
		
	});
	
	// Reset shiplocation
	$('.shipPanel').on('click', '.resetship', function(){
		var id = $(this).parent().attr("data-id");
		App.settingUI(id); 
	});

    // drag and drop the boats
    $('.boat').draggable();

    $('#myGameboard .locations .cell').each(function(index, cell) {
		
        $(cell).droppable({

            drop: function(ev, ui) {
				
				var shipID = $(ui.draggable).parent().attr("data-id");
				
				var isVertical = (($(ui.draggable).data('type') === 'vertical') ? true : false);
				var coord = {'x' : $(ev.target).data('x'), 'y' : $(ev.target).data('y')};

				shipCoords = App.loopCoords(coord, App.localShips.ships[shipID].length, isVertical);
				
				if(App.checkCoords(shipCoords)){
					
					App.localShips.ships[shipID].isVertical = isVertical;
					App.localShips.ships[shipID].startCell.x = coord.x;
					App.localShips.ships[shipID].startCell.y = coord.y;
					
                    if(App.checkBoard()){
                        $('#placeBoard').prop("disabled",false);
                    }


                    App.draggingUI(shipID);
					$(shipCoords).each(function(index, coord){
						$('#myGameboard div[data-x='+coord.x+'][data-y='+coord.y+']').addClass('filled');
					});
					
				}else{
				}
			}
        });
    });

    $('#placeBoard').click( function(){
        if(App.checkBoard()){
            BattleshipAPI.submitGameBoard(App.loadedGameId, App.localShips, App.populateGameList);
        }else{
            alert('Eerste even de bootjes plaatsen');
        }

    })
});

var drawShips = function(game) {

	$.each(game.myGameboard.ships, function(index, ship){
		
		for (i= 0; i < ship.length; i++){
			
			var color = '#0000FF';
			
			if(ship.isVertical) {
				fillCell('#myGameboard', {'x' : ship.startCell.x, 'y' : ship.startCell.y + i}, color);
			} else {
				fillCell('#myGameboard', {'x' : String.fromCharCode(ship.startCell.x.charCodeAt(0) + i), 'y' : ship.startCell.y}, color);
			}
		}
		
		$.each(ship.hits, function(index, hit){
			fillCell('#myGameboard', hit, '#FF0000');
		});
		
	});
	
};

var drawShots = function(game) {
	
	$.each(game.enemyGameboard.shots, function(index, shot){
		
		var color = '#0000FF';
		
		if(shot.isHit){
			color = '#FF0000';
		}
		
		fillCell('#enemyGameboard', shot, color);
	});
	
};

var fillCell = function(boardId, coord, color) {
	$(boardId + ' .cell[data-x="'+coord.x+'"][data-y="'+coord.y+'"]').css('background-color', color);
};

var nextChar = function(c){
	return String.fromCharCode(c.charCodeAt(0) + 1);
};

var shipObj = function(ship) {
	this._id = ship._id;
	this.length = ship.length;
	this.name = ship.name;
	this.startCell = {'x' : undefined, 'y' : undefined};
	this.isVertical = ship.isVertical;
	this.__v = ship.__v;
};