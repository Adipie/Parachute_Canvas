window.onload = function() {

	const planeYPosition = 100,
 		planeLeftlimit = -100,
 		planeInitialPosition = 1200,
 		boatYPosition = 400,
 		parachuteInitialYPosition = 140,
 		dropRLimit = 1150,
 		dropLLimit = 10,
 		parachuteYStep = 10,
 		boatXStep = 25,
 		planeXstep = 5;

	var canvas1  = document.getElementById('layer1'),
		canvas2 = document.getElementById('layer2'),
		boat,
		boatXPosition,
		plane,
		planeXPosition,
		planeInterval,
		dropTimer,
		score,
		scoreString,
		lives,
		lifeString,
		ctx;

	if (canvas1.getContext && canvas2.getContext){   
	   ctx = canvas1.getContext('2d');  
	   layer2Ctx = canvas2.getContext('2d'); 
	   setScene();
	} 

	

	//set game scene - add a boat and a plane.
	
	function setScene(){
	
		plane = new Image();
		plane.src = 'assets/plane.png';

		planeXPosition = planeInitialPosition;

		plane.onload = function(){
			ctx.drawImage(plane,planeXPosition,planeYPosition);
		}
		
		boat = new Image();
		boat.src = 'assets/boat.png';

		boatXPosition = 650;

		boat.onload = function(){
			ctx.drawImage(boat,boatXPosition,boatYPosition);
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
			planeInterval = setInterval(planeAnimation,30); 

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

	function planeAnimation(){
		ctx.clearRect(planeXPosition,planeYPosition,plane.width,plane.height);
			if (planeXPosition < planeLeftlimit){
				planeXPosition = planeInitialPosition;
				ctx.drawImage(plane,planeXPosition,planeYPosition);
			} else {
				planeXPosition -= planeXstep;
				ctx.drawImage(plane,planeXPosition,planeYPosition);
			}	
	}

	// move boat using keyboards
	function moveBoat(key){
		switch(key.keyCode){
			case (37): 
			if (boatXPosition > 0){
				ctx.clearRect(boatXPosition, boatYPosition, boat.width, boat.height);
				boatXPosition -= boatXStep;
				ctx.drawImage(boat,boatXPosition, boatYPosition);
			}
			break;
			case (39):
			if (boatXPosition < 1150){
				ctx.clearRect(boatXPosition, boatYPosition, boat.width, boat.height);
				boatXPosition += boatXStep;
				ctx.drawImage(boat,boatXPosition, boatYPosition);
			}
			break;

		}
	}

	// drop parachuters 
	function dropParachuters(){
		var parachute,
			parachuteXPosition,
			parachuteYPosition;
		if (lives > 0 ){
			dropTimer = Math.round(Math.random() * 3000) + 1000;
			if (planeXPosition > dropLLimit && planeXPosition < dropRLimit){
				parachute = new Image();
				parachute.src = 'assets/parachute.png';
				parachuteXPosition = planeXPosition + plane.width/2;
				parachuteYPosition = parachuteInitialYPosition;
				parachute.onload = function(){				
					layer2Ctx.drawImage(parachute, parachuteXPosition ,parachuteYPosition);	
				}
				
				startParachuteAnimation(parachute, parachuteXPosition ,parachuteYPosition);
			}	
			setTimeout(dropParachuters,dropTimer);	
		}
	}

	// parachute animation, update score and lives according to landing point
	function startParachuteAnimation(parachute, parachuteXPosition ,parachuteYPosition){
		var fallInterval = setInterval(function(){			
				layer2Ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
				parachuteYPosition += 10;
				layer2Ctx.drawImage(parachute, parachuteXPosition ,parachuteYPosition);
				if (parachuteYPosition > (boatYPosition + boat.height)) {
					clearInterval(fallInterval);
					if (parachuteXPosition > boatXPosition && parachuteXPosition < (boatXPosition + boat.width)){
						updateScore();
						layer2Ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
					} else {
						updateLives();
						layer2Ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
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

	function updateScore(){
		score += 10;
		ctx.clearRect(40,0, 350,50);
		ctx.fillText(scoreString + score, 40,30);	
	}

	function updateLives(){
		lives -= 1;
		ctx.clearRect(40,50, 350,50);
		ctx.fillText(lifeString + lives, 40,70);	
	}
}