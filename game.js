window.onload = function() {

	const planeYPosition = 100;
 	const planeLeftlimit = -100;
 	const planeInitialPosition = 1200;
 	const boatYPosition = 400;
 	const parachuteInitialYPosition = 140;
 	const dropRLimit = 1150;
 	const dropLLimit = 10;
 	const parachuteYStep = 10;
 	const boatXStep = 25;
 	const planeXstep = 5;

	var canvas  = document.getElementById('myCanvas');

	if (canvas.getContext){   
	   var ctx = canvas.getContext('2d');   
	   setScene();
	} 

	var boat,
		boatPosition,
		plane,
		planePosition,
		planeInterval,
		dropTimer,
		dropInterval,
		score,
		scoreString,
		lives,
		lifeString;

	//set game scene - add a boat and a plane.
	
	function setScene(){
	
		plane = new Image();
		plane.src = 'assets/plane.png';

		planePosition = planeInitialPosition;

		plane.onload = function(){
			ctx.drawImage(plane,planePosition,planeYPosition);
		}
		
		boat = new Image();
		boat.src = 'assets/boat.png';

		boatPosition = 650;

		boat.onload = function(){
			ctx.drawImage(boat,boatPosition,boatYPosition);
		}
		

		ctx.font = 'Bold 25px Sans-Serif';
		ctx.fillStyle = '#000';

		ctx.fillText('- Hit space bar to start the game -', 450, 300);
		window.addEventListener('keydown',startGame,false);

	}

	//start game
	function startGame(key){
		// start game if user hit space bar
		if (key.keyCode === 32){
			
			setupUI();
			
			// plane starts moving
			startPlaneAnimation(); 

			// catch keyboard events to move the boat
			window.addEventListener('keydown',moveBoat,true);

			// drop parachuters at random interval
			dropParachuters(); 
		}
	}

	function setupUI(){
		window.removeEventListener('keydown',startGame);
		// create score and lives tracking
		ctx.clearRect(40,0, 350,50);
		ctx.clearRect(40,50, 350,50);

		scoreString = 'Score: ';
		score = 0;
		ctx.fillText(scoreString + score, 40,30);

		lifeString = 'Lives: ';
		lives = 3;
		ctx.fillText(lifeString + lives, 40, 70);

		// remove message from screen
		ctx.clearRect(450,200,500,200);
	}

	//  start plane animations
	function startPlaneAnimation(){
		planeInterval = setInterval(function(){
			ctx.clearRect(planePosition,planeYPosition,plane.width,plane.height);
			if (planePosition < planeLeftlimit){
				planePosition = planeInitialPosition;
				ctx.drawImage(plane,planePosition,planeYPosition);
			} else {
				planePosition -= planeXstep;
				ctx.drawImage(plane,planePosition,planeYPosition);
			}
		} ,30);
	}

	// move boat using keyboards
	function moveBoat(key){
		switch(key.keyCode){
			case (37): 
			if (boatPosition > 0){
				ctx.clearRect(boatPosition, boatYPosition, boat.width, boat.height);
				boatPosition -= boatXStep;
				ctx.drawImage(boat,boatPosition, boatYPosition);
			}
			break;
			case (39):
			if (boatPosition < 1150){
				ctx.clearRect(boatPosition, boatYPosition, boat.width, boat.height);
				boatPosition += boatXStep;
				ctx.drawImage(boat,boatPosition, boatYPosition);
			}
			break;

		}
	}

	// drop parachuters 
	function dropParachuters(){
		if (lives > 0 ){
			dropTimer = Math.round(Math.random() * 3000) + 1000;
			if (planePosition > dropLLimit && planePosition < dropRLimit){
				var parachute = new Image();
				parachute.src = 'assets/parachute.png';
				var parachuteXPosition = planePosition + plane.width/2;
				var parachuteYPosition = parachuteInitialYPosition;
				parachute.onload = function(){				
					ctx.drawImage(parachute, parachuteXPosition ,parachuteYPosition);	
					}
				startParachuteAnimation(parachute, parachuteXPosition ,parachuteYPosition);
			}	
			setTimeout(dropParachuters,dropTimer);	
		}
	}

	// parachute animation, update score and lives according to landing point
	function startParachuteAnimation(parachute, parachuteXPosition ,parachuteYPosition){
		var fallInterval = setInterval(function(){			
				ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
				parachuteYPosition += 10;
				ctx.drawImage(parachute, parachuteXPosition ,parachuteYPosition);
				if (parachuteYPosition > (boatYPosition + boat.height)) {
					if (parachuteXPosition > boatPosition && parachuteXPosition < (boatPosition + boat.width)){
						clearInterval(fallInterval);
						score += 10;
						ctx.clearRect(40,0, 350,50);
						ctx.fillText(scoreString + score, 40,30);
						ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
					} else {
						clearInterval(fallInterval);
						lives -= 1;
						ctx.clearRect(40,50, 350,50);
						ctx.fillText(lifeString + lives, 40,70);
						ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
						if (lives === 0){
							gameOver();
						}
					}
				}
			},30);	

	}
	
	// stop plane and drop parachutes, present play again
	function gameOver(){
		clearInterval(planeInterval);
		window.removeEventListener('keydown',moveBoat);
		ctx.fillText('Game Over! Hit space bar to play again', 450, 300);
		window.addEventListener('keydown',startGame,false);
	}
}