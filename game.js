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

	var backgroundCanvas  = document.getElementById('layer1'),
		parachuteCanvas = document.getElementById('layer2'),
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
		backgroundCanvasContext,
		parachuteCanvasContext;

	if (backgroundCanvas.getContext && parachuteCanvas.getContext){   
	   backgroundCanvasContext = backgroundCanvas.getContext('2d');  
	   parachuteCanvasContext = parachuteCanvas.getContext('2d'); 
	   setScene();
	} 

	

	//set game scene - add a boat and a plane.
	
	function setScene(){
		plane = new Image();
		plane.src = 'assets/plane.png';

		planeXPosition = planeInitialPosition;

		plane.onload = function(){
			backgroundCanvasContext.drawImage(plane,planeXPosition,planeYPosition);
		}
		
		boat = new Image();
		boat.src = 'assets/boat.png';

		boatXPosition = 650;

		boat.onload = function(){
			backgroundCanvasContext.drawImage(boat,boatXPosition,boatYPosition);
		}
		

		backgroundCanvasContext.font = 'Bold 25px Sans-Serif';
		backgroundCanvasContext.fillStyle = '#000';

		backgroundCanvasContext.fillText('- Hit space bar to start the game -', 450, 300);
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
		backgroundCanvasContext.clearRect(40,0, 350,50);
		backgroundCanvasContext.clearRect(40,50, 350,50);

		scoreString = 'Score: ';
		score = 0;
		backgroundCanvasContext.fillText(scoreString + score, 40,30);

		lifeString = 'Lives: ';
		lives = 3;
		backgroundCanvasContext.fillText(lifeString + lives, 40, 70);

		// remove message from screen
		backgroundCanvasContext.clearRect(450,200,800,200);
	}

	function planeAnimation(){
		backgroundCanvasContext.clearRect(planeXPosition,planeYPosition,plane.width,plane.height);
			// if plane leaves game borders draw it back on the other side
			if (planeXPosition < planeLeftlimit){
				planeXPosition = planeInitialPosition;
				backgroundCanvasContext.drawImage(plane,planeXPosition,planeYPosition);
			} else {
				planeXPosition -= planeXstep;
				backgroundCanvasContext.drawImage(plane,planeXPosition,planeYPosition);
			}	
	}

	// move boat using keyboards
	function moveBoat(key){
		switch(key.keyCode){
			// move left is allowed until hitting screen border
			case (37): 
			if (boatXPosition > 0){
				backgroundCanvasContext.clearRect(boatXPosition, boatYPosition, boat.width, boat.height);
				boatXPosition -= boatXStep;
				backgroundCanvasContext.drawImage(boat,boatXPosition, boatYPosition);
			}
			break;
			// move right is allowed until hitting screen border
			case (39):
			if (boatXPosition < 1150){
				backgroundCanvasContext.clearRect(boatXPosition, boatYPosition, boat.width, boat.height);
				boatXPosition += boatXStep;
				backgroundCanvasContext.drawImage(boat,boatXPosition, boatYPosition);
			}
			break;
		}
	}

	// drop parachuters 
	function dropParachuters(){
		var parachute,
			parachuteXPosition,
			parachuteYPosition;
		// drop parachuters while user still has lives left
		if (lives > 0 ){
			dropTimer = Math.round(Math.random() * 3000) + 1000;
			if (planeXPosition > dropLLimit && planeXPosition < dropRLimit){
				parachute = new Image();
				parachute.src = 'assets/parachute.png';
				parachuteXPosition = planeXPosition + plane.width/2;
				parachuteYPosition = parachuteInitialYPosition;
				parachute.onload = function(){				
					parachuteCanvasContext.drawImage(parachute, parachuteXPosition ,parachuteYPosition);	
				}
				
				startParachuteAnimation(parachute, parachuteXPosition ,parachuteYPosition);
			}	
			// call the next parachute drop
			setTimeout(dropParachuters,dropTimer);	
		}
	}

	// parachute animation, update score and lives according to landing point
	function startParachuteAnimation(parachute, parachuteXPosition ,parachuteYPosition){
		var fallInterval = setInterval(function(){			
				parachuteCanvasContext.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
				parachuteYPosition += 10;
				parachuteCanvasContext.drawImage(parachute, parachuteXPosition ,parachuteYPosition);
				if (parachuteYPosition > (boatYPosition + boat.height)) {
					// stop animation
					clearInterval(fallInterval);
					// handle boat catches or misses parachute
					if (parachuteXPosition > boatXPosition && parachuteXPosition < (boatXPosition + boat.width)){
						updateScore();
						parachuteCanvasContext.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
					} else { 
						updateLives();
						parachuteCanvasContext.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
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
		backgroundCanvasContext.fillText('Game Over! Hit space bar to play again', 450, 300);
		window.addEventListener('keydown',startGame,false);
	}

	function updateScore(){
		score += 10;
		backgroundCanvasContext.clearRect(40,0, 350,50);
		backgroundCanvasContext.fillText(scoreString + score, 40,30);	
	}

	function updateLives(){
		lives -= 1;
		backgroundCanvasContext.clearRect(40,50, 350,50);
		backgroundCanvasContext.fillText(lifeString + lives, 40,70);	
	}
}