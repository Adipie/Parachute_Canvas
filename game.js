window.onload = function() {	
	var canvas  = document.getElementById('myCanvas');
	if (canvas.getContext){   
	   var ctx = canvas.getContext('2d');   
	   setScene();
	} 

	else {   
	   
	}  
	var boat,
		boatPosition,
		plane,
		planePosition,
		score,
		scoreString,
		lives,
		lifeString;


	//set game scene - add a boat and a plane.
	
	function setScene(){
	
		plane = new Image();
		plane.src = 'assets/plane.png';

		plane.onload = function(){
			ctx.drawImage(plane,1100,100);
		}
		planePosition = 1100;

		boat = new Image();
		boat.src = 'assets/boat.png';

		boat.onload = function(){
			ctx.drawImage(boat,650,400);
		}
		boatPosition = 650;

		ctx.font = 'Bold 25px Sans-Serif';
		ctx.fillStyle = '#000';

		scoreString = 'Score: ';
		score = 0;
		ctx.fillText(scoreString + score, 40,30);

		lifeString = 'lives: ';
		lives = 3;
		ctx.fillText(lifeString + lives, 40, 70);

		ctx.fillText('- Hit space bar to start the game -', 450, 300);
		window.addEventListener('keydown',startGame,true);
	}

	//start game
	function startGame(key){
		if (key.keyCode === 32){
			ctx.clearRect(450,200,500,200);
			startPlaneAnimation();
			window.addEventListener('keydown',moveBoat,true);
		}
	}

	function startPlaneAnimation(){
		setInterval(function(){
			ctx.clearRect(planePosition,100,plane.width,plane.height);
			if (planePosition < -100){
				planePosition = 1200;
				ctx.drawImage(plane,planePosition,100);
			} else {
				planePosition -= 5;
				ctx.drawImage(plane,planePosition,100);
			}
		} ,30);
	}

	function moveBoat(key){
		switch(key.keyCode){
			case (37): 
			if (boatPosition > 0){
				ctx.clearRect(boatPosition, 400, boat.width, boat.height);
				boatPosition -= 10;
				ctx.drawImage(boat,boatPosition, 400);
			}
			break;
			case (39):
			if (boatPosition < 1150){
				ctx.clearRect(boatPosition, 400, boat.width, boat.height);
				boatPosition += 10;
				ctx.drawImage(boat,boatPosition, 400);
			}
			break;

		}
	}

	//ctx.clearRect(40,0, 350,50);
	
	//handle parachute-boat collision
	//handle missed parachute
	//game over
}