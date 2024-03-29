var App = new function() {
	
	// Properties
	this.currentGame;
	this.gameBoard = '.gameboard';
	this.localShips = {'ships': []};
    this.loadedGameId;
	this.temp;
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
            $('.shiplist tbody').append('<tr><td width="200" class="ship'+$(this)[0]._id+'label">'+$(this)[0].name+'</td><td width="100" data-id="'+$(this)[0]._id+'"><img data-type="horizontal" src="images/glyphicons-212-right-arrow.png" class="boat" /><img data-type="vertical" src="images/glyphicons-213-down-arrow.png" class="boat" /></div><div class="resetButton" style="display: none"><button class="btn btn-danger resetShip">Reset</button></div></td><td><div class="boatLength">'+$(this)[0].length +'</div></td></tr>');

        });
		
        $('.boat').draggable({
            revert: true,
            stop: function(){
                $('#myGameboard .cell').each(function(){
                    $(this).removeClass('valid invalid');
                })
            }
        });
    };
	
	// Load GAME
	this.loadGame = function(game){
		App.currentGame = game;
        App.loadedGameId = game._id;
		
		$('#myGameboard .cell').css('background-color', '');
        $('#myGameboard .cell').removeClass('ship0 ship1 ship2 ship3 ship4 filled');
        $('#enemyGameboard .cell').css('background-color', '');

		$('#your-turn').html('');

		$('.shipPanel').css('display', 'none');
		
		if(game.status === 'started' || game.status === 'done'){
			if(game.yourTurn) {
				$('#your-turn').html('It\'s my turn');
			} else {
				$('#your-turn').html('Opponent\'s turn');
			}

            if(game.status === 'done') {

                if (game.youWon) {
                    $('#modalWon').modal('show');
                } else {
                    $('#modalLost').modal('show');
                }
            }

			App.drawShots(game);
			App.drawShips(game);
			
		} else if(game.status === 'setup'){
			BattleshipAPI.getShips(App.populateShipList);
			if (typeof game.myGameboard !== 'undefined') {
				App.drawShips(game);
				$('.shipPanel').css('display', 'none');
			}
			else {
				console.log('geen tekenen')
				$('.shipPanel').css('display', 'block');
			}
			
		}
		
	};

    this.loopCoords = function(coord, length, isVertical) {

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

    this.loopCoordsObj = function (object, target, length){

        var shipID = object.parent().attr("data-id");

        var isVertical = ((object.data('type') === 'vertical') ? true : false);
        var coord = {'x' : target.data('x'), 'y' : target.data('y')};

        var shipCoords = App.loopCoords(coord, App.localShips.ships[shipID].length, isVertical);
	
        return shipCoords;
    }

    this.checkCoords = function(coords){

        var result = true;
        $(coords).each(function(){

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
            if(typeof $(this)[0]['startCell']['x'] === 'undefined' || $(this)[0]['startCell']['x'] == 'undefined'){
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


    this.drawShips = function(game) {

        $.each(game.myGameboard.ships, function(index, ship){

            for (i= 0; i < ship.length; i++){

                var color = '#0000FF';

                if(ship.isVertical) {
                    App.fillCell('#myGameboard', {'x' : ship.startCell.x, 'y' : ship.startCell.y + i}, color);
                } else {
                    App.fillCell('#myGameboard', {'x' : String.fromCharCode(ship.startCell.x.charCodeAt(0) + i), 'y' : ship.startCell.y}, color);
                }
            }

            $.each(ship.hits, function(index, hit){
                App.fillCell('#myGameboard', hit, '#FF0000');
            });

        });

    };

    this.drawShots = function(game) {

        $.each(game.enemyGameboard.shots, function(index, shot){

            var color = '#0000FF';

            if(shot.isHit){
                color = '#FF0000';
            }

            App.fillCell('#enemyGameboard', shot, color);
        });

    };

    this.fillCell = function(boardId, coord, color) {
        $(boardId + ' .cell[data-x="'+coord.x+'"][data-y="'+coord.y+'"]').css('background-color', color);
    };

    this.AfterShot = function(coord, status) {

        var color;

        if(status === 'BOOM') {
            color = '#FF0000';
            console.log('Shot hit!');
        } else if(status === 'SPLASH') {
            color = '#0000FF';
            console.log('shot missed!');
        }

        App.fillCell('#enemyGameboard', coord, color);
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
	
	// Play GAME
	$('#gamelist tbody').on('click', '.play-game', function(event){
	
		var gameId = $(event.target).data('gameid');
		$('#gamelist .selected').removeClass('selected');
		$(event.target).closest('tr').addClass('selected');
		BattleshipAPI.getGameInfo(gameId, App.loadGame);
	
	});
	

	// Shot Click EVENT
	$('#enemyGameboard .locations').on('click', '.cell', function(e){
		
		var coord = {'x' : $(e.target).data('x'), 'y' : $(e.target).data('y')};
		BattleshipAPI.submitShot(App.currentGame._id, coord, App.loadGame, App.AfterShot);
		
	});
	
	// Reset shiplocation
	$('.shipPanel').on('click', '.resetship', function(){
		var id = $(this).parent().attr("data-id");
		App.settingUI(id); 
	});



    $('#myGameboard .locations .cell').each(function(index, cell) {

        $(cell).droppable({

            drop: function(ev, ui) {
                shipID = $(ui.draggable).parent('td').attr('data-id');
                var isVertical = (($(ui.draggable).data('type') === 'vertical') ? true : false);
                var coord = {'x' : $(ev.target).data('x'), 'y' : $(ev.target).data('y')};
				shipCoords = App.loopCoordsObj($(ui.draggable), $(ev.target));
                var valid = (App.checkCoords(shipCoords) ? 'valid' : 'invalid');

                $(shipCoords).each(function(index, coord){
                    $('#myGameboard div[data-x='+coord.x+'][data-y='+coord.y+']').removeClass(valid);
                });
				if(App.checkCoords(shipCoords)){
					
					App.localShips.ships[shipID].isVertical = isVertical;
					App.localShips.ships[shipID].startCell.x = coord.x;
					App.localShips.ships[shipID].startCell.y = coord.y;


                    App.draggingUI(shipID);
					$(shipCoords).each(function(index, coord){
						$('#myGameboard div[data-x='+coord.x+'][data-y='+coord.y+']').addClass('ship'+shipID+' filled');
					});

				}



			},

            over: function(ev, ui) {
                console.log('in!');
                shipCoords = App.loopCoordsObj($(ui.draggable), $(ev.target));

                var valid = (App.checkCoords(shipCoords) ? 'valid' : 'invalid');

                $(App.temp).each(function(index, coord){
                    $('#myGameboard div[data-x='+coord.x+'][data-y='+coord.y+']').removeClass('valid invalid');
                })
                $(shipCoords).each(function(index, coord){
                    $('#myGameboard div[data-x='+coord.x+'][data-y='+coord.y+']').addClass(valid);
                });
				
                App.temp = shipCoords;
            },
        });
    });

    $('#placeBoard').click( function(){
        if(App.checkBoard()){
            BattleshipAPI.submitGameBoard(App.loadedGameId, App.localShips, App.populateGameList);
        }else{
            alert('Eerste even de bootjes plaatsen');
        }

    });

    //reset a boat
    $('.shipPanel').on('click', '.resetShip', function(){
      var shipID = $(this).closest('td').attr("data-id");

       var  isVertical = App.localShips.ships[shipID].isVertical;
       var x = App.localShips.ships[shipID].startCell.x;
       var y = App.localShips.ships[shipID].startCell.y;

       // clear values in localShips
       App.localShips.ships[shipID].isVertical = 'undefined';
       App.localShips.ships[shipID].startCell.x = 'undefined';
       App.localShips.ships[shipID].startCell.y = 'undefined';

       var coord = {'x' : x, 'y' : y};

       shipCoords = App.loopCoords(coord, App.localShips.ships[shipID].length, isVertical);

        // delete the boat from the board
        $(shipCoords).each(function(index, coord){
            $('#myGameboard div[data-x='+coord.x+'][data-y='+coord.y+']').removeClass('ship'+shipID+' filled');
        });

        //refresh the table row in the table
        $(this).closest('td').html('<img data-type="horizontal" src="images/glyphicons-212-right-arrow.png" class="boat" /><img data-type="vertical" src="images/glyphicons-213-down-arrow.png" class="boat" /></div><div class="resetButton" style="display: none"><button class="btn btn-danger resetShip">Reset</button></div>');
        $('.boat').draggable({
            revert: true
        })
    });
});

var shipObj = function(ship) {
	this._id = ship._id;
	this.length = ship.length;
	this.name = ship.name;
	this.startCell = {'x' : undefined, 'y' : undefined};
	this.isVertical = ship.isVertical;
	this.__v = ship.__v;
};