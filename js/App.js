var App = new function() {
	
	// Properties
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
			var cell = '<div class="cell" data-x="'+ value.x + '" data-y="'+ value.y + '"data-x-d="'+ value.d +'"></div>';
			$(App.gameBoard + ' .locations').append(cell);
		});
	};
	
	this.populateGameList = function(myGames) {
		
		$('#gamelist tbody').empty();
		if(myGames.length === 0) {
			$('#gamelist tbody').append('<tr><td colspan="3">You have no games yet</td></tr>');
			return false;
		}
		
		$.each(myGames, function(index, game){
			
			if(game.enemyName === undefined){
				game.enemyName = 'Waiting for player'
			}
			$('#gamelist tbody').append('<tr><td>' + game._id + '</td><td>' + game.enemyName + '</td>SATUS<td>' + game.status + '</td><td><button class="btn btn-success play-game" data-gameId="'+ game._id +'">PLAY</button></td></tr>');
		});
	};

    this.populateShipList = function(ships) {
       
	    $(ships).each(function(index, ship){
			
			App.localShips.ships[ship._id] = new shipObj(ship);
            $('.shiplist tbody').append('<tr><td width="200">'+$(this)[0].name+'</td><td width="100" data-id="'+$(this)[0]._id+'"><img data-type="horizontal" src="images/glyphicons-212-right-arrow.png" class="boat" /><img data-type="vertical" src="images/glyphicons-213-down-arrow.png" class="boat" /></div><div class="resetButton" style="display: none"><button class="btn btn-danger resetship">Reset</button></div></td><td><div class="boatLength">'+$(this)[0].length +'</div></td></tr>');

        });
		
        $('.boat').draggable({
            revert: true
        });
    };
	
	this.loadGame = function(game){
        App.loadedGameId = game._id;
		$('#enemy-label').remove();
		$('#turn-label').remove();
		//$('.content').prepend('<h2 id="turn-label"></h2>');
		$('.content').prepend('<h1 id="enemy-label" class="h1">Now playing vs ' + game.enemyName + '</h1>');
		
		if(game.status === 'started'){
			
			drawShips(game);
			drawShots(game);
			
		} else if(game.status === 'setup'){
			$('.shipPanel').css('display', 'block');
		}
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
                console.log("ik ben al gevuld!");
                result = false;
            }else if($(this)[0]['y'] > 10 || $(this)[0]['y'] < 1){
                console.log('Y-Ass klopt niet!');
                result = false;
            }else if($(this)[0]['x'].charCodeAt(0) > 106 || $(this)[0]['x'].charCodeAt(0) < 97){
                console.log('X-Ass klopt niet!');
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
		BattleshipAPI.getGameInfo(gameId, App.loadGame);
	
	});
	
	$('#enemyGameboard .locations').on('click', '.cell', function(e){
		alert('SHOTS fired!');
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
				
				//$('.boat').addClass('dropped');
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
            console.log("hoihoihoi"+App.loadedGameId);

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

var testGame = {
  '_id':1,
  'status'		:	'started',
  'yourTurn'	:	false,
  'enemyId'		:	'55268f3aa43c82a4244bb00a',
  'enemyName'	:	'rechtsboven@gmail.com',
  'myGameboard':{
					'_id'	:	20,
					'__v'	:	3,
					'ships'	:[{
						'length':		2,
						'isVertical':	true,
						'_id'		:	'554239de10da4dc04faacdaf',
						'hits'		:	[{'x':'i','y':1,'_id':'55423a8710da4dc04faacdba'}],
						'startCell'	:	{'x':'i','y':1}
						},
						{
							'length':		4,
							'isVertical':	false,
							'_id'		:	"554239de10da4dc04faacdaf",
							'hits'		:	[{"x":"i","y":1,"_id":"55423a8710da4dc04faacdba"}],
							'startCell'	:	{'x':'a','y':7}
						},
						
						{
						'length'	:	3,
						"isVertical":true,
						"_id":"554239de10da4dc04faacdae",
						"hits":[],
						"startCell":{"x":"h","y":1}
					}],
				},
  'enemyGameboard' :{
    '_id'	:	21,
    '__v'	:	3,
    'shots'	:[
		{"x":"c","y":2,"_id":"55423a7610da4dc04faacdb4"},
    	{"x":"e","y":2,"_id":"55423a7f10da4dc04faacdb6"},
    	{"x":"d","y":2,"isHit":true,"_id":"55423a8510da4dc04faacdb9"}
    ]
  }
};