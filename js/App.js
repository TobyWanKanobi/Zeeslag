var App = new function() {
	
	// Properties
	this.gameBoard = '.gameboard';
    this.shipLocations = { "ships": []};


	
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

            $('.shiplist').append('<table><tr><td width="200">'+$(this)[0].name+'</td><td width="100"><img src="images/glyphicons-212-right-arrow.png" class="boat" /><img src="images/glyphicons-213-down-arrow.png" class="boat" /></div></td><td><div class="boatLength">'+$(this)[0].length +'</div></td></tr></table>');
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

        $div.droppable({
            drop: function() {
                $('.boat').addClass('dropped').
                    css({
                        /*top: $div.offset().top,
                        left: $div.offset().left*/
                    });
                App.
                $div.addClass("filled");
               console.log('hoi');
            }
        });
    });

});