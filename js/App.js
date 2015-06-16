$(document).ready(function(){
	var service = new BattleshipService();
	var gameBoard = '#gameboard #locations';
	var coords = [];
	var currentGame;
	
	// Get My games and fill	
	var populateGames = function() {
		
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
		
	};
	
	// Create coordinates
	for(var i = 10; i > 0; i--) {
		
		for(var x = 0; x < 10; x++) {
			coords.push({
				'x' : String.fromCharCode(65 + x),
				'y' : i}
			);
		}
	}
	
	// Put events on buttons
	$('#newGamePlayer').on('click', function(e){
		service.createPlayerGame(populateGames);
	});
	
	$('#newGameComputer').on('click', function(e){
		service.createComputerGame(populateGames);
	});
	
	// Generate grid
	$.each(coords, function(index, value){
		var cell = '<div class="cell" data-x="'+ value.x + '" data-y="'+ value.y + '"></div>';
		$(gameBoard).append(cell);
	});
	
	// Get ships
	service.getShips(function (result) {
		
		$.each(result, function (index, value) {
			$('#ships .panel-body').append('<div>' + value.name + '</div>');
		});
		
	});
	
	populateGames();
	
	// Add hit or miss class to cell
	var cells = $('.cell');
	$(cells[40]).addClass('missed');
	$(cells[75]).addClass('hit');
	
});