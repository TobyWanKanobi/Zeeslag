var BattleshipAPI = new function() {

	// Properties
	this.baseUrl = 'http://zeeslagavans.herokuapp.com/';
	this.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.InRwbWFpcGF1QHN0dWRlbnQuYXZhbnMubmwi.ku3W_i5exSexpTyOUYcrrmnBwF3k4A9-oOLDrll8Vv8';
	this.url = this.baseUrl + '[option]?token=' + this.token; 
	
	// Methods
	// Via deze route krijg je een collectie van games waarin jij mee speelt. Elke game heeft de volgende eigenschappen:
	// Unique ID van de game
	// Unique ID van de tegenstander
	// De naam van de tegenstander
	this.getMyGames = function(callback) {
		
		var url = this.url.replace('[option]', 'users/me/games');
		
		$.ajax({
			url : url,
			dataType : 'json',
			type : 'GET',
			success : function(response) {
				console.log(response);
			},
			error : function(response) {
				// onError do nothing
			}
		});
		
	};
	
	// Delete
	this.deleteGames = function(callback) {
		
		var url = this.url.replace('[option]', 'users/me/games');
		
		$.ajax({
			url : url,
			dataType : 'json',
			type : 'DELETE',
			success : function(response) {
				callback(response);
			},
			error : function(response) {
				// onError do nothing
			}
		});
		
	};
	
	// Via deze route kun je een nieuwe game opvragen met als tegenstander een andere student.
	this.newPlayerGame = function(callback) {
		
		var url = this.url.replace('[option]', 'games');
		
		$.ajax({
			url : url, 
			dataType : 'json',
			type : 'GET',
			success : function(response) {
				callback(response);
			}, 
			error : function(response) {
				// onError do nothing
			},
		});
	
	};
	
	// Via deze route kun je een nieuwe game opvragen met als tegenstander een computer.
	this.newCPUGame = function(callback) {
		
		var url = this.url.replace('[option]', 'games/AI');
		
		$.ajax({
			url : url, 
			dataType : 'json',
			type : 'GET',
			success : function(response) {
				callback(response);
			}, 
			error : function(response) {
				// onError do nothing
			},
		});
	
	};
	
	// Voor elke game kun je alle informatie opvragen doormiddel van het Id.
	// Het is alleen mogelijk gegevens op te halen van een game waar je zelf aan deel neemt.
	this.getGameInfo = function(gameId, callback) {
		
		var url = this.url.replace('[option]', 'games/' + gameId);
		
		$.ajax({
			url : url, 
			dataType : 'json',
			type : 'GET',
			success : function(response) {
				callback(response);
			}, 
			error : function(response) {
				// onError do nothing
			},
		});
	
	};
	
	// Get shipobjects
	this.getShips = function(callback) {
	
		var url = this.url.replace('[option]', 'ships');
		
		$.ajax({
			url : url, 
			dataType : 'json',
			type : 'GET',
			success : function(response) {
				callback(response);
			}, 
			error : function(response) {
				// onError do nothing
			},
		});
	};
	
	// Submit boards
	this.submitGameBoard = function(gameId, gameBoard, callback) {
	
		var url = this.url.replace('[option]', 'games/' + gameId + '/gameboards');
		
		$.ajax({
			url : url, 
			dataType : 'json',
			type : 'POST',
			success : function(response) {
				callback(response);
			}, 
			error : function(response) {
				// onError do nothing
			},
		});
	};
	
	// Submit boards
	this.submitShot = function(gameId, shot, callback) {
	
		var url = this.url.replace('[option]', 'games/' + gameId + '/shots');
		
		$.ajax({
			url : url, 
			dataType : 'json',
			type : 'POST',
			success : function(response) {
				callback(response);
			}, 
			error : function(response) {
				// onError do nothing
			},
		});
	};
   
};