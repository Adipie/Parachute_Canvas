window.onload = function() {	
	var canvas  = document.getElementById('myCanvas');
	if (canvas.getContext){   
	   var ctx = canvas.getContext('2d');   
	   setScene();
	   
	} 

	else {   
	   
	}  
	var boat,
		plane,
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

		boat = new Image();
		boat.src = 'assets/boat.png';

		boat.onload = function(){
			ctx.drawImage(boat,650,400);
		}

		ctx.font = 'Bold 25px Sans-Serif';
		ctx.fillStyle = '#000';

		scoreString = 'Score: ';
		score = 0;
		ctx.fillText(scoreString + score, 40,30);

		lifeString = 'lives: ';
		lives = 3;
		ctx.fillText(lifeString + lives, 40, 70);

		ctx.fillText('- Hit space bar to start the game -', 450, 300);

		
		

	}

	//ctx.clearRect(40,0, 350,50);
	//start game
	//handle parachute-boat collision
	//handle missed parachute
	//game over
}