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
		planeInterval,
		dropTimer,
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

		lifeString = 'Lives: ';
		lives = 3;
		ctx.fillText(lifeString + lives, 40, 70);

		ctx.fillText('- Hit space bar to start the game -', 450, 300);
		window.addEventListener('keydown',startGame,false);
	}

	//start game
	function startGame(key){
		if (key.keyCode === 32){
			score = 0;
			lives = 3;
			ctx.clearRect(450,200,500,200);
			// plane starts moving
			startPlaneAnimation();
			// catch keyboard events to move the boat
			window.addEventListener('keydown',moveBoat,true);
			// drop parachuters at random interval
			dropTimer = Math.round(Math.random() * 5000) + 500;
			var dropInterval = setInterval(dropParachuters,dropTimer); 
		}
	}

	//  start plane animations
	function startPlaneAnimation(){
		planeInterval = setInterval(function(){
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

	// move boat using keyboards
	function moveBoat(key){
		switch(key.keyCode){
			case (37): 
			if (boatPosition > 0){
				ctx.clearRect(boatPosition, 400, boat.width, boat.height);
				boatPosition -= 20;
				ctx.drawImage(boat,boatPosition, 400);
			}
			break;
			case (39):
			if (boatPosition < 1150){
				ctx.clearRect(boatPosition, 400, boat.width, boat.height);
				boatPosition += 20;
				ctx.drawImage(boat,boatPosition, 400);
			}
			break;

		}
	}

	// drop parachuters 
	function dropParachuters(){
		if (planePosition > 10 && planePosition < 1150){
			var parachute = new Image();
			parachute.src = 'assets/parachute.png';
			var parachuteXPosition = planePosition + 50;
			var parachuteYPosition = 140;
			parachute.onload = function(){				
			ctx.drawImage(parachute, parachuteXPosition ,parachuteYPosition);	
			}
			setInterval(function(){			
				ctx.clearRect(parachuteXPosition,parachuteYPosition,parachute.width,parachute.height);
				parachuteYPosition += 10;
				ctx.drawImage(parachute, parachuteXPosition ,parachuteYPosition);
				if (parachuteYPosition > (400 + boat.height)) {
					if (parachuteXPosition > boatPosition && parachuteXPosition < (boatPosition + boat.width)){
						score += 10;
						ctx.clearRect(40,0, 350,50);
						ctx.fillText(scoreString + score, 40,30);
						delete parachute();
					}
				}
			},30);	
		}	
	}

	function handleParachuteLanding(parachute,parachuteXPosition,parachuteYPosition){
		if (parachuteYPosition > (400 + boat.height)) {
			console.log(parachuteXPosition);
			console.log(parachuteYPosition);
			if (parachuteXPosition > boatPosition && parachuteXPosition < (boatPosition + boat.width)){
				score += 10;
				ctx.clearRect(40,0, 350,50);
				ctx.fillText(scoreString + score, 40,30);
			}
		}
	}
	/*if (parachuteXPosition > boatPosition && parachuteXPosition < boatPosition+boat.width && parachuteYPosition === 400+boat.height){
				score += 10;
				ctx.clearRect(40,0, 350,50);
				ctx.fillText(scoreString + score, 40,30);
				clearInterval(parachuteInterval);				
			}

			*/
	//handle parachute-boat collision
	//handle missed parachute
	//game over
}