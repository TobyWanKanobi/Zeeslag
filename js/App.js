var App = new function() {
	
	// Properties
	this.gameBoard = '.gameboard';
    this.shipLocations = { "ships": [
        {
            "_id": 0,
            "length": 2,
            "name": "Patrol boat",
            "startCell" : { "x": "a", "y": 2 },
            "isVertical" : false,
            "__v": 0
        },
        {
            "_id": 1,
            "length": 3,
            "name": "Destoryer",
            "startCell" : { "x": "a", "y": 1 },
            "isVertical" : false,
            "__v": 0
        },
        {
            "_id": 2,
            "length": 3,
            "name": "Submarine",
            "startCell" : { "x": "a", "y": 3 },
            "isVertical" : false,
            "__v": 0
        },
        {
            "_id": 3,
            "length": 4,
            "name": "Battleship",
            "startCell" : { "x": "a", "y": 4 },
            "isVertical" : false,
            "__v": 0
        },
        {
            "_id": 4,
            "length": 5,
            "name": "Aircraft carrier",
            "startCell" : { "x": "a", "y": 5 },
            "isVertical" : false,
            "__v": 0
        }]};


	
	// Methods
	this.generateCoords = function() {
		
		var coords = [];
		for(var i = 1; i < 11; i++) {
			
			for(var x = 0; x < 10; x++) {
				coords.push({'x' : String.fromCharCode(65 + x), 'y' : i});
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

            $('.shiplist').append('<table><tr><td width="200">'+$(this)[0].name+'</td><td width="100" data-id="'+$(this)[0]._id+'"><img data-type="horizontal" src="images/glyphicons-212-right-arrow.png" class="boat" /><img data-type="vertical" src="images/glyphicons-213-down-arrow.png" class="boat" /></div></td><td><div class="boatLength">'+$(this)[0].length +'</div></td></tr></table>');
            $('.boat').draggable();
        })
    }

    this.setShip = function(id){

    }

};


$(document).ready(function(){
	
	App.initBoard();
	BattleshipAPI.getMyGames(App.populateGameList);
	
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
		alert($(event.target).data('gameid'));
	});

    BattleshipAPI.getShips(App.populateShipList);

    // drag and drop the boats
    $('.boat').draggable();

    $('div',  '#myGameboard' , '.locations' ).each(function() {

        var $div = $(this);
        console.log($div);
        $div.droppable({
            drop: function() {
                $('.boat').addClass('dropped').
                    css({
                        /*top: $div.offset().top,
                        left: $div.offset().left*/
                    });

                $div.addClass("filled");
               console.log('hoi');
            }
        });
    });

});