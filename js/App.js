var App = new function() {
	
	// Properties
	this.gameBoard = '.gameBoard';
	
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
			$(gameBoard + ' .locations').append(cell);
		});
	};

};


$(document).ready(function(){
	
	App.initBoard();
	// Get My games and fill	
	/*var populateGames = function() {
		
		service.getGames(function(games){
			
			if(games.length > 0) {
				$('#gamelist').empty();
				$.each(games, function(index, game){
					$('#gamelist').append('<li>' + game.enemyName + ' ' + game.status +'</li>');
				});
			} else {
				$('#gamelist').html('<li>Geen spellen</li>');
			}
			
		});	
		
	};*/

	// Get ships
	/*service.getShips(function (result) {
		
		$.each(result, function (index, value) {
			$('#ships .panel-body').append('<div>' + value.name + '</div>');
		});
		
	});*/
	
});