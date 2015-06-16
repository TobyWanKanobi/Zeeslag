var BattleshipService = Class.extend({

	init: function(){
	},
	baseUrl : 'https://zeeslagavans.herokuapp.com/',
	token : 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRwbWFpcGF1QHN0dWRlbnQuYXZhbnMubmwi.ku3W_i5exSexpTyOUYcrrmnBwF3k4A9-oOLDrll8Vv8',
	
	getShips : function(callback) {
		$.get(this.baseUrl + 'ships?token=' + this.token, function(result) {
			callback(result);
		}, 'json');
	},
	
	getGames : function(callback) {
		$.get(this.baseUrl + 'users/me/games?token=' + this.token, function(result){
			callback(result);
			//console.log(result);
		});
	},
	
	createComputerGame : function(callback) {
		$.get(this.baseUrl + 'games/AI?token=' + this.token, function(result){
			callback();
		});
	},
	
	createPlayerGame : function(callback) {
		$.get(this.baseUrl + 'games?token=' + this.token, function(result){
			callback();
		});
	}
	
});