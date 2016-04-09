window.onload = function() {

	const planeInitialY = 100,
		planeInitialX = 1200,
		planeInitialVelocity = 0,
		boatInitialY = 400,
		boatInitialX = 650,
 		planeLeftlimit = -100,
 		gameLeftBound = 0,
 		gameRightBound = 1150;

	var backgroundCanvas  = document.getElementById('backgroundLayer'),
		parachuteCanvas = document.getElementById('parachuteLayer'),
		plane,
		planeVelocity = 10,
		boat,
		boatVelocity = 25,
		scoreString,
		score,
		lifeString,
		lives,
		updateInterval,
		gravity = 5,
		parachuteList = new Array,		
		backgroundCanvasContext,
		parachuteCanvasContext;

	if (backgroundCanvas.getContext && parachuteCanvas.getContext){   
	   backgroundCanvasContext = backgroundCanvas.getContext('2d');  
	   parachuteCanvasContext = parachuteCanvas.getContext('2d');
	   backgroundCanvasContext.font = 'Bold 25px Sans-Serif';
	   backgroundCanvasContext.fillStyle = '#000'; 
	   loadGame();

	} 

	

	// loadGame - load plane and boat on screen
	function loadGame(){

		plane = {xPosition: planeInitialX, yPosition: planeInitialY, velocity: planeInitialVelocity,icon: new Image()};
		plane.icon.src = 'assets/plane.png';
		plane.icon.onload = function() {
			drawInstance(plane);
		}
		

		boat = {xPosition: boatInitialX, yPosition: boatInitialY, velocity: boatVelocity, icon: new Image()};
		boat.icon.src = 'assets/boat.png';
		boat.icon.onload = function(){
			drawInstance(boat);
		}

		backgroundCanvasContext.fillText('- Hit space bar to start the game -', 450, 300);
		window.addEventListener('keydown',startGame,false);
	}
	

	//start game - 
	function startGame(key){
		// start game if user hit space bar
		if (key.keyCode === 32){
			// Remove message to user and add score and life updates
			setupUI();
			// update game scene 
			updateInterval = setInterval(update , 50);
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

	// 
	function update(){
		// move plane
		plane.velocity = planeVelocity;
		movePlane();

		// move boat
		window.addEventListener('keydown',moveBoat,false);

		// decide if to drop parachute or no
		// droping the parachute happens after a random timout
		if ( Math.floor(Math.random() * 50) > 45) {
			setTimeout(dropParachute, Math.round(Math.random() * 50000) );
		}

		// For eache parachute on screen update it's position and check for landing position
		for (i=0 ; i < parachuteList.length ; i++){
			moveParachute(parachuteList[i]);
			checkParachuteLanding(parachuteList[i]);
		}
	}

	function movePlane(){
		// clear last plane appearance
		clearInstance(plane);
		//update plane position according to current position
		if (plane.xPosition < planeLeftlimit){
			plane.xPosition = planeInitialX;
		} else {
			plane.xPosition -= plane.velocity;
		}
		//redraw plane
		drawInstance(plane);
	}

	// move boat using keyboards
	//clear last boat appearance
	// update boat position according to keystroke
	// redraw boat
	function moveBoat(key){
		switch(key.keyCode){
			// move left is allowed until hitting screen border
			case (37): 
			if (boat.xPosition > gameLeftBound){
				clearInstance(boat);
				boat.xPosition -= boat.velocity;
				drawInstance(boat);
			}
			break;
			// move right is allowed until hitting screen border
			case (39):
			if (boat.xPosition < gameRightBound){
				clearInstance(boat);
				boat.xPosition += boat.velocity;
				drawInstance(boat);
			}
			break;
		}
	}

	// move parachute
	//clear last parachute appearance
	// update parachute position according to gravity
	// redraw parachute
	function moveParachute(parachute){
		clearParachute(parachute);
		parachute.yPosition += parachute.gravity;
		drawParachute(parachute);
	}

	// drop parachute from plane
	//create parachute and add it to parachute list
	function dropParachute(){
		if (plane.xPosition > gameLeftBound && plane.xPosition < gameRightBound){
			var parachute = {xPosition: plane.xPosition + plane.icon.width/2, yPosition: plane.yPosition + plane.icon.height/2 , gravity: gravity , icon: new Image()};
			parachute.icon.src = 'assets/parachute.png';
			parachute.icon.onload = function(){
				drawParachute(parachute);
				parachuteList.push(parachute);
			}
		}
	}

	// check parachute landing
	// check vertical and horizontal position to check if parachute hits boat or falls in the water
	// remove parachute from parachute list if landed
	// update score / lives according to landing
	// call game over if lives = 0
	function checkParachuteLanding(parachute){
		if (parachute.yPosition > boat.yPosition - boat.icon.height/2){
			if (parachute.xPosition > boat.xPosition && parachute.xPosition < boat.xPosition + boat.icon.width){
				updateScore();
				parachuteList.splice(parachuteList.indexOf(parachute),1);
				clearParachute(parachute);
			} else { 
				if ( parachute.yPosition > boat.yPosition + boat.icon.height){
					updateLives();
					parachuteList.splice(parachuteList.indexOf(parachute),1);
					clearParachute(parachute);
					if (lives === 0){
						gameOver();
					} 
				}
			}

		}
	}

	// Stop all animations
	function gameOver(){
		clearInterval(updateInterval);
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

	
	function clearInstance(instance){
		backgroundCanvasContext.clearRect(instance.xPosition, instance.yPosition, instance.icon.width, instance.icon.height);	
	}

	function drawInstance(instance){
		backgroundCanvasContext.drawImage(instance.icon,instance.xPosition, instance.yPosition);	
	}

	function clearParachute(parachute){
		parachuteCanvasContext.clearRect(parachute.xPosition,parachute.yPosition,parachute.icon.width,parachute.icon.height);	
	}

	function drawParachute(parachute){
		parachuteCanvasContext.drawImage(parachute.icon,parachute.xPosition,parachute.yPosition);	
	}
	
	
}