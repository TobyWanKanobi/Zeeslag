var App = new function() {
	
	// Properties
	this.gameBoard = '.gameboard';
	
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
			console.log('hoi');
		});
	};

    this.populateShipList = function(shipList) {
        $(shipList).each(function(){

            $('.shiplist').append('<table><tr><td width="200">'+$(this)[0].name+'</td><td><img src="images/glyphicons-212-right-arrow.png" /><img src="images/glyphicons-213-down-arrow.png" /></td></tr></table>');
        })
    }

};


$(document).ready(function(){
	
	App.initBoard();

    BattleshipAPI.getShips(App.populateShipList);

});