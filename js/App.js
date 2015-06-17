var App = new function() {
	
	// Properties
	this.gameBoard = '.gameboard';
    this.shipLocations = { "ships": []};


	
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
			var cell = '<div class="cell" data-x="'+ value.x + '" data-y="'+ value.y + '"></div>';
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
			$('#gamelist tbody').append('<tr><td>' + game._id + '</td><td>' + game.enemyName + '</td>SATUS<td>' + game.status + '</td><td><button class="btn btn-success play-game" data-gameId="'+ game._id +'">PLAY</button></td></tr>');
		});
	};

    this.populateShipList = function(shipList) {
       
		$(shipList).each(function(){
            $('.shiplist').prepend('<table><tr><td width="200">'+$(this)[0].name+'</td><td width="100"><img src="images/glyphicons-212-right-arrow.png" class="boat" /><img src="images/glyphicons-213-down-arrow.png" class="boat" /></div></td><td><div class="boatLength">'+$(this)[0].length +'</div></td></tr></table>');
            $('.boat').draggable();
        });
    };
	
	this.loadGame = function(game){
		game = testGame;
		$('#enemy-label').remove();
		$('#turn-label').remove();
		//$('.content').prepend('<h2 id="turn-label"></h2>');
		$('.content').prepend('<h1 id="enemy-label" class="h1">Now playing vs ' + game.enemyName + '</h1>');
		
		if(game.status === 'started'){
		
			$.each(game.myGameboard.ships, function(index, ship){
				drawShip(ship);
			});
			
			$.each(game.enemyGameboard.shots, function(index, shot){
				drawShot(shot);
			});
			console.log('playGame');
		} else if(game.status === 'setup'){
			$('.shipPanel').css('display', 'block');
			console.log('placeShips!');
		}
	};

    this.setShip = function(id){

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
	
	$('#gamelist tbody').on('click', '.play-game', function(event){
	
		var gameId = $(event.target).data('gameid');
		BattleshipAPI.getGameInfo(gameId, App.loadGame);
	
	});

    // drag and drop the boats
    $('.boat').draggable();

    $('div',  '#myGameboard' , '.locations' ).each(function() {

        var $div = $(this);

        $div.droppable({
            drop: function() {
                $('.boat').addClass('dropped').
                    css({
                        /*top: $div.offset().top,
                        left: $div.offset().left*/
                    });
                App.
                $div.addClass("filled");
            }
        });
    });

});

var drawShip = function(ship) {
	var coord = ship.startCell;
	for (i= 0; i < ship.length; i++){
		$('#myGameboard .cell[data-x="'+coord.x+'"][data-y="'+coord.y+'"]').css('background-color', '#0000FF');
		if(ship.isVertical) {
			coord.y++;
		} else {
			coord.x = nextChar(coord.x);
		}
	}
	
	$.each(ship.hits, function(index, hit){
		$('#myGameboard .cell[data-x="'+hit.x+'"][data-y="'+hit.y+'"]').css('background-color', '#FF0000');
	});
};

var drawShot = function(shot) {
	
	var color = '#0000FF';
	
	if(shot.isHit){
		color = '#FF0000';
	}
	
	$('#enemyGameboard .cell[data-x="'+shot.x+'"][data-y="'+shot.y+'"]').css('background-color', color);
	
};

var nextChar = function(c){
	return String.fromCharCode(c.charCodeAt(0) + 1);
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
						'_id'		:	"554239de10da4dc04faacdaf",
						'hits'		:	[{"x":"i","y":1,"_id":"55423a8710da4dc04faacdba"}],
						'startCell'	:	{"x":"i","y":1}
						},
						
						{
						'length':		4,
						'isVertical':	false,
						'_id'		:	"554239de10da4dc04faacdaf",
						//'hits'		:	[{"x":"i","y":1,"_id":"55423a8710da4dc04faacdba"}],
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