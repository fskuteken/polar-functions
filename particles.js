window.onload = function(){

/*******************/
/*CANVAS PROPERTIES*/
/*******************/
var CANVAS_WIDTH = window.innerWidth;
var CANVAS_HEIGHT = window.innerHeight;

var canvas = document.getElementById("GameScreen");
canvas.height = CANVAS_HEIGHT;
canvas.width = CANVAS_WIDTH;
var ctx = canvas.getContext("2d");

var scale = 1;
var zoom = 0;

function screenUpdate(){

	rect = canvas.getBoundingClientRect();

	CANVAS_WIDTH = window.innerWidth;
	CANVAS_HEIGHT = window.innerHeight;

	canvas.height = CANVAS_HEIGHT;
	canvas.width = CANVAS_WIDTH;

	scale = window.innerWidth/1366;

	centerX = CANVAS_WIDTH/2;
	centerY = CANVAS_HEIGHT/3;

}

/********************/
/* THEME PROPERTIES */
/********************/

var theme = 0;
var themesArray = [];

var themeColor = {
	r1: 255,
	r2: 255,
	g1: 255,
	g2: 255,
	b1: 255,
	b2: 255,
}
var gradient = ctx.createRadialGradient(CANVAS_WIDTH/2, 200, 0, CANVAS_WIDTH/2, 200, CANVAS_WIDTH);
   	gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'DarkSlateGrey');

var newTheme = {
	background: gradient,
	fontColor: "Black",
}
themesArray.push(newTheme);



var themeNumber = themesArray.length;

function changeFont(){
	ctx.textAlign = "center";
	ctx.font = "bold 14px Arial";
	ctx.lineWidth = 1;
	ctx.fillStyle = themesArray[theme].fontColor;
	ctx.strokeStyle = themesArray[theme].fontColor;
}

function changeBackground(){
	ctx.fillStyle = themesArray[theme].background;
	ctx.strokeStyle = themesArray[theme].background;
}


function BackgroundRefresh(){
	gradient = ctx.createRadialGradient(CANVAS_WIDTH/2, CANVAS_HEIGHT/3, 0, CANVAS_WIDTH/2, CANVAS_HEIGHT/3, CANVAS_WIDTH);
   	gradient.addColorStop(0, "rgb(" + redBarBack.min + ", " + greenBarBack.min + ", " + blueBarBack.min+ ")");
    gradient.addColorStop(1, "rgb(" + redBarBack.max + ", " + greenBarBack.max + ", " + blueBarBack.max+ ")");
    themesArray[0].background = gradient;
}

/**********************/
/*FRAME RATE FUNCTIONS*/
/**********************/

window.GetAnimationFrameRate = (function(){
    return  window.requestAnimationFrame   ||
        	window.webkitRequestAnimationFrame ||
        	window.mozRequestAnimationFrame    ||
        	window.oRequestAnimationFrame      ||
        	window.msRequestAnimationFrame     ||
        	function(callback, element){window.setTimeout(callback, 1000 / 60);};
})();

fps = {
	value: 0,
	draw: function(){
		changeFont();
		ctx.textAlign = "left";
  		ctx.fillText(this.value + " FPS", CANVAS_WIDTH/scale - 50, 20);
	},
	update: function(){
		this.value = Math.floor(1/dt);
	}
}
setInterval(function(){fps.update();}, 1000);

/*************/
/* PARTICLES */
/*************/

// FUNCTION PARAMETERS
var k1 = 20;
var k2 = 45;
var k3 = 20;
var curveAngle;

var currentFunction = 0;
var numberOfFunctions = 9;

var POLAR_ROSE = 0;
var EPISPIRAL = 1;
var TANGENT_SPIRAL = 2;
var POLYGON = 3;
var BUTTERFLY = 4;
var HEART = 5;
var LEAF = 6;
var EPITROCHOID = 7;
var HYPOTROCHOID = 8;


// FIGURE PARAMETERS
var size = 200;
var centerX = CANVAS_WIDTH/2;
var centerY = CANVAS_HEIGHT/3;

// PARTICLE PARAMETERS
var particlesArray = [];

var particleQuantity = 439;
var particleSpeed = 50;

var particleType = 0;
var particleSize = 3;
var particleWidth = 1;

var CIRCLE = 0;
var SQUARE = 1;
var RING = 2;

var lineWidth = 1;

// COLOR PARAMETERS
var singleColor = false;

var minR = 0;
var minG = 0;
var minB = 0;
var maxR = 255;
var maxG = 255;
var maxB = 255;
var alpha = 0.25;

function gcd(a,b){
	if(b==0) return a;
	else return gcd(b,a%b);
}

function particleSpawn(angle){
	var particle = {
		x: centerX,
		y: centerY,
		r: Math.floor(Math.random()*(maxR - minR)) + minR,
		g: Math.floor(Math.random()*(maxG - minG)) + minG,
		b: Math.floor(Math.random()*(maxB - minB)) + minB,
		angle: angle,
		timer: 0,
		lifespan: Math.random()*(1+size/50),
	}

	if (currentFunction == 2) particle.lifespan = size/10;

	particlesArray.push(particle);
}

function parametersRefresh(){
	k1 = barsArray[0].value;
	k2 = barsArray[1].value;
	k3 = barsArray[2].value;
	particleQuantity = barsArray[3].value;
	size = barsArray[4].value;
	particleSpeed = barsArray[5].value;
	particleSize = barsArray[6].value;
	lineWidth = barsArray[7].value;
	if (barsArray[8].value >= 0) zoom = 1 + barsArray[8].value/5;
	if (barsArray[8].value < 0) zoom = 1 + barsArray[8].value/50;

}

function particleRefresh(){

	parametersRefresh();

	particlesArray.length = 0;

	if (currentFunction == POLAR_ROSE || currentFunction == EPISPIRAL || currentFunction == TANGENT_SPIRAL || EPITROCHOID){
		curveAngle = Math.PI*k2/gcd(k1, k2);
		if((k1*k2)%2 == 0) curveAngle = curveAngle*2;
		if (k3!=0 && k2%2 == 1) curveAngle = 2*curveAngle;
	}

	if (currentFunction == POLYGON) {
		if (k2 >= k1/2){
			k2 %= Math.round(k1/2);
			if (k2 == 0) k2 = 1;
		}

		curveAngle = 2*Math.PI*k2;
	}

	if (currentFunction == BUTTERFLY) curveAngle = 24*Math.PI;

	if (currentFunction == HEART || currentFunction == LEAF) curveAngle = 2*Math.PI;

	if (currentFunction==POLYGON) {
		for (i=0; i < particleQuantity; i++){
			particleSpawn(curveAngle*i/particleQuantity + Math.PI);
		}
	}

	else {
		for (i=0; i < particleQuantity; i++){
			particleSpawn(curveAngle*i/particleQuantity);
		}
	}
	

}

function particleDraw(){

	if (singleColor == true) {
		ctx.strokeStyle = "rgba(" + redBar.min + ", " + greenBar.min + ", " + blueBar.min + ", " + alpha + ")";
		ctx.fillStyle = "rgba(" + redBar.min + ", " + greenBar.min + ", " + blueBar.min + ", " + alpha + ")";
	}

	for (i = 0; i < particlesArray.length; i++){

		ctx.lineWidth = lineWidth;

		if (singleColor == false) ctx.fillStyle = "rgba(" + particlesArray[i].r + ", " + particlesArray[i].g + ", " + particlesArray[i].b + ", " + alpha + ")";

		if (particleType == CIRCLE){
			ctx.beginPath();
        	ctx.arc(particlesArray[i].x, particlesArray[i].y, particleSize, 0, 2*Math.PI);
        	ctx.closePath();
     		ctx.fill();
     	}

     	if (particleType == SQUARE) {
     		ctx.fillRect(particlesArray[i].x - particleSize, particlesArray[i].y - particleSize, 2*particleSize, 2*particleSize);
     	}

     	if (particleType == RING){
     		if (singleColor == false) ctx.strokeStyle = "rgba("+particlesArray[i].r+", "+particlesArray[i].g+", "+particlesArray[i].b+", " + alpha + ")";
     		ctx.lineWidth = 1;
     		ctx.beginPath();
        	ctx.arc(particlesArray[i].x, particlesArray[i].y, particleSize, 0, 2*Math.PI);
        	ctx.closePath();
     		ctx.stroke();
     	}

     	if (lineWidth != 0 && currentFunction != POLYGON){
     		ctx.lineWidth = lineWidth;

     		if (singleColor == false) ctx.strokeStyle = "rgba("+particlesArray[i].r+", "+particlesArray[i].g+", "+particlesArray[i].b+", " + alpha + ")";

     		if (i < particlesArray.length - 1){
     			ctx.beginPath();
				ctx.moveTo(particlesArray[i].x ,particlesArray[i].y);
				ctx.lineTo(particlesArray[i+1].x ,particlesArray[i+1].y);
				ctx.stroke();
			}
		
			else if (i == particlesArray.length - 1){
     			ctx.beginPath();
				ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
				ctx.lineTo(particlesArray[0].x, particlesArray[0].y);
				ctx.stroke();
			}

		}

	}

	if (lineWidth != 0 && currentFunction == POLYGON){
		for (j = 0; j < gcd(k1, k2); j++){
			for (i = j*Math.floor(particlesArray.length/gcd(k1, k2)); i < (j+1)*(particlesArray.length/gcd(k1, k2)); i++){
		
    			if (singleColor == false) ctx.strokeStyle = "rgba("+particlesArray[i].r+", "+particlesArray[i].g+", "+particlesArray[i].b+", " + alpha + ")";

   				if (i < (j+1)*Math.floor(particlesArray.length/gcd(k1, k2)) - 1){
   					ctx.beginPath();
					ctx.moveTo(particlesArray[i].x ,particlesArray[i].y);
					ctx.lineTo(particlesArray[i+1].x ,particlesArray[i+1].y);
					ctx.stroke();
				}
		
				if (i == (j+1)*Math.floor(particlesArray.length/gcd(k1, k2)) - 1){
   					ctx.beginPath();
					ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
					ctx.lineTo(particlesArray[j*Math.floor(particlesArray.length/gcd(k1, k2))].x, particlesArray[j*Math.floor(particlesArray.length/gcd(k1, k2))].y);
					ctx.stroke();
				}
			}
		}
	}
}

function particleUpdate(){

	size = size*scale;
	var A = size;
	var t;

	if (currentFunction == POLAR_ROSE) A = size/(1 + k3/25);

	if (currentFunction == EPISPIRAL) A = size/((1 + k3/5)*2);

	if (currentFunction == TANGENT_SPIRAL) A = size/((1 + k3/5)*2);

	if (currentFunction == POLYGON) {
		if (k2 >= k1/2){
			k2 %= Math.round(k1/2);
			if (k2 == 0) k2 = 1;
		}
	}

	if (currentFunction == BUTTERFLY || currentFunction == HEART || currentFunction == LEAF) A = size/3;


	if (currentFunction == EPITROCHOID) A = size/(k1+k2+k3);

	if (currentFunction == HYPOTROCHOID) {
		if (k1 > k2) A = size / (k1 - k2 + k3);
		else A = size / (k2 - k1 + k3);
	}

	for (i = 0; i < particlesArray.length; i++){

		particlesArray[i].angle += 2*Math.PI*particleSpeed*dt/1000;

		t = particlesArray[i].angle;

		if (currentFunction == POLAR_ROSE){
			particlesArray[i].x = centerX + A*(Math.cos(k1/k2*t) + k3/25)*Math.cos(t);
			particlesArray[i].y = centerY + A*(Math.cos(k1/k2*t) + k3/25)*Math.sin(t);
		}

		if (currentFunction == EPISPIRAL){
			particlesArray[i].x = centerX + A*(1/Math.cos(k1/k2*t) + k3/5)*Math.cos(t);
			particlesArray[i].y = centerY + A*(1/Math.cos(k1/k2*t) + k3/5)*Math.sin(t);
		}

		if (currentFunction == TANGENT_SPIRAL){
			particlesArray[i].x = centerX + A*(Math.tan(k1/k2*t) + k3/5)*Math.cos(t);
			particlesArray[i].y = centerY + A*(Math.tan(k1/k2*t) + k3/5)*Math.sin(t);
		}

		if (currentFunction == BUTTERFLY){
			particlesArray[i].x = centerX + A*(Math.pow(Math.E, Math.sin(t))-2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5))*Math.cos(t);
			particlesArray[i].y = centerY - A*(Math.pow(Math.E, Math.sin(t))-2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5))*Math.sin(t);		
		}

		if (currentFunction == HEART){
			particlesArray[i].x = centerX + A*(2 - 2*Math.sin(t) + Math.sin(t)*(Math.sqrt(Math.abs(Math.cos(t))))/(Math.sin(t)+1.4))*Math.cos(t);
			particlesArray[i].y = 0.5*centerY - A*(2 - 2*Math.sin(t) + Math.sin(t)*(Math.sqrt(Math.abs(Math.cos(t))))/(Math.sin(t)+1.4))*Math.sin(t);
		}

		if (currentFunction == LEAF){
			particlesArray[i].x = centerX + A*( (1 + (9/10)*Math.cos(8*t)) * (1 + (1/10)*(Math.cos(24*t))) * ( (9/10) + (1/10)*Math.cos(200*t)) * (1+Math.sin(t))) * Math.cos(t);
			particlesArray[i].y = 1.8*centerY - A*( (1 + (9/10)*Math.cos(8*t)) * (1 + (1/10)*(Math.cos(24*t))) * ( (9/10) + (1/10)*Math.cos(200*t)) * (1+Math.sin(t))) * Math.sin(t);
		}

		if (currentFunction == EPITROCHOID){
			particlesArray[i].x = centerX + A*((k1 + k2)*Math.cos(t) - k3*(Math.cos( ( (k1 + k2)/k2 )*t )));
			particlesArray[i].y = centerY + A*((k1 + k2)*Math.sin(t) - k3*(Math.sin( ( (k1 + k2)/k2 )*t )));
		}

		if (currentFunction == HYPOTROCHOID){
			particlesArray[i].x = centerX + A*((k1 - k2)*Math.cos(t) + k3*(Math.cos( ( (k1 - k2)/k2 )*t )));
			particlesArray[i].y = centerY + A*((k1 - k2)*Math.sin(t) - k3*(Math.sin( ( (k1 - k2)/k2 )*t )));
		}
	}

	if (currentFunction == POLYGON){
		for (j = 0; j < gcd(k1, k2); j++){
			for (i = j*Math.floor(particlesArray.length/gcd(k1, k2)); i < (j+1)*particlesArray.length/gcd(k1, k2); i++){
				t = particlesArray[i].angle;
				particlesArray[i].x = centerX + A*((Math.cos(k2*Math.PI/k1) / Math.cos((t-2*j*Math.PI/k1)%(2*k2*Math.PI/k1)-k2*Math.PI/k1)))*Math.cos(t);
				particlesArray[i].y = centerY - A*((Math.cos(k2*Math.PI/k1) / Math.cos((t-2*j*Math.PI/k1)%(2*k2*Math.PI/k1)-k2*Math.PI/k1)))*Math.sin(t);
			}
		}
	}
}

function titleDraw(){
	var title;
	switch(currentFunction){
		case POLAR_ROSE: title = "1. Polar rose"; break;
		case EPISPIRAL: title = "2. Epispiral"; break;
		case TANGENT_SPIRAL: title = "3. Tangent spiral"; break;
		case POLYGON: title = "4. Polygon"; break;
		case BUTTERFLY: title = "5. Butterfly"; break;
		case HEART: title = "6. Heart"; break;
		case LEAF: title = "7. Leaf"; break;
		case EPITROCHOID: title = "8. Epitrochoid"; break;
		case HYPOTROCHOID: title = "9. Hypotrochoid"; break;
	}

	ctx.font = "100 24px Georgia serif ";

	if (singleColor == true) {
		ctx.strokeStyle = "rgba(" + redBar.min + ", " + greenBar.min + ", " + blueBar.min + ", " + alpha + ")";
		ctx.fillStyle = "rgba(" + redBar.min + ", " + greenBar.min + ", " + blueBar.min + ", " + alpha + ")";
	}

	else {
		ctx.fillStyle = "rgba(" + redBar.min + ", " + greenBar.min + ", " + blueBar.min + ", " + alpha + ")";
		ctx.strokeStyle = "rgba(" + redBar.max + ", " + greenBar.max + ", " + blueBar.max + ", " + alpha + ")";
	}

	ctx.fillText(title, 10, 32);
	ctx.lineWidth = 1;
	ctx.strokeText(title, 10, 32);
}

/***********/
/* BUTTONS */
/***********/

var randomImg = new Image();
	randomImg.src = "buttons/random.png";

var themeImg = new Image();
	themeImg.src = "buttons/theme.png";

var colorImg = new Image();
	colorImg.src = "buttons/randomcolor.png";

var singleColorImg = new Image();
	singleColorImg.src = "buttons/singlecolor.png";

var randomThemeImg = new Image();
	randomThemeImg.src = "buttons/randomtheme.png";

var squareImg = new Image();
	squareImg.src = "buttons/square.png";

var circleImg = new Image();
	circleImg.src = "buttons/circle.png";

var formImg = new Image();
	formImg.src = "buttons/form.png";

var previousImg = new Image();
	previousImg.src = "buttons/previous.png";

var nextImg = new Image();
	nextImg.src = "buttons/next.png";

var buttonWidth = 75;
var buttonHeight = 50;

var buttonsArray = [];

var buttonY0 = 667 - 180 - 60;
var buttonY1 = 667 - 180;
var buttonY2 = 667 - 180 + 60;
var buttonY3 = 667 - 180 + 120;
var buttonDX = 70;

var previousButton = {
	x: 25,
	y: buttonY3,
	focus: false,
	image: previousImg,
	effect: function(){
		currentFunction--;
		if (currentFunction < 0) currentFunction = numberOfFunctions - 1;
		particleRefresh();
	}
}
buttonsArray.push(previousButton);

var nextButton = {
	x: 125,
	y: buttonY3,
	focus: false,
	image: nextImg,
	effect: function(){
		currentFunction++;
		currentFunction %= numberOfFunctions;
		particleRefresh();
	}
}
buttonsArray.push(nextButton);

var buttonRandom = {
	x: 560,
	y: buttonY3,
	focus: false,
	image: randomImg,
	effect: function(){

		buttonRandomColor.effect();

		if (locksArray[0].locked == false) k1Bar.value = Math.floor(Math.random()*(k1Bar.max - k1Bar.min) + k1Bar.min);

		if (locksArray[1].locked == false) k2Bar.value = Math.floor(Math.random()*(k2Bar.max - k2Bar.min) + k2Bar.min);

		if (locksArray[2].locked == false) k3Bar.value = Math.floor(Math.random()*(k3Bar.max - k3Bar.min) + k3Bar.min);

		if (locksArray[3].locked == false) nBar.value = Math.floor(Math.random()*(nBar.max - nBar.min) + nBar.min);

		if (locksArray[4].locked == false) lBar.value = Math.floor(Math.random()*(lBar.max - lBar.min) + lBar.min);

		if (locksArray[5].locked == false) sBar.value = Math.floor(Math.random()*(sBar.max));

		if (locksArray[6].locked == false) rBar.value = Math.floor(Math.random()*(rBar.max - rBar.min - 1) + rBar.min + 1);

		if (locksArray[7].locked == false) wBar.value = Math.floor(Math.random()*(wBar.max - wBar.min) + wBar.min);

		particleRefresh();

	},
}
buttonsArray.push(buttonRandom);

var buttonColor = {
	x: 560,
	y: buttonY1,
	focus: false,
	image: singleColorImg,
	text: "Single Color",
	effect: function(){
		singleColor++;
		singleColor%=2;
	}
}
buttonsArray.push(buttonColor);

var buttonRandomColor = {
	x: 560,
	y: buttonY2,
	focus: false,
	image: colorImg,
	effect: function(){

		if (locksArray[8].locked == false){
			redBar.min = Math.floor(Math.random()*255);
			redBar.max = Math.floor(Math.random()*255);
			minR = redBar.min;
			maxR = redBar.max;
		}

		if (locksArray[9].locked == false){
			greenBar.min = Math.floor(Math.random()*255);
			greenBar.max = Math.floor(Math.random()*255);
			minG = greenBar.min;
			maxG = greenBar.max;
		}

		if (locksArray[10].locked == false){
			blueBar.min = Math.floor(Math.random()*255);
			blueBar.max = Math.floor(Math.random()*255);
			minB = blueBar.min;
			maxB = blueBar.max;
		}

		if (locksArray[11].locked == false) alpha = Math.floor(Math.random()*51 + 25)/100;

		for (i = 0; i < particlesArray.length; i++){
			particlesArray[i].r = Math.floor(Math.random()*(maxR - minR)) + minR;
			particlesArray[i].g = Math.floor(Math.random()*(maxG - minG)) + minG;
			particlesArray[i].b = Math.floor(Math.random()*(maxB - minB)) + minB;
		}

	}
}
buttonsArray.push(buttonRandomColor);

var buttonForm = {
	x: 560,
	y: buttonY0,
	focus: false,
	image: formImg,
	effect: function(){
		particleType++;
		particleType%=3;
	}
}
buttonsArray.push(buttonForm);

var buttonRandomTheme = {
	x: 910,
	y: buttonY3,
	focus: false,
	image: randomThemeImg,
	effect: function(){
		if (locksArray[12].locked == false){
			redBarBack.min = Math.floor(Math.random()*255);
			redBarBack.max = Math.floor(Math.random()*255);
		}

		if (locksArray[13].locked == false){
			greenBarBack.min = Math.floor(Math.random()*255);
			greenBarBack.max = Math.floor(Math.random()*255);
		}

		if (locksArray[14].locked == false){
			blueBarBack.min = Math.floor(Math.random()*255);
			blueBarBack.max = Math.floor(Math.random()*255);
		}
	}
}
buttonsArray.push(buttonRandomTheme);


function buttonsDraw(){

	changeFont();

	for (i = 0; i < buttonsArray.length; i++){

		if (buttonsArray[i].focus == false) ctx.drawImage(buttonsArray[i].image, buttonsArray[i].x, buttonsArray[i].y, buttonWidth, buttonHeight);
		else ctx.drawImage(buttonsArray[i].image, buttonsArray[i].x, buttonsArray[i].y, 0.90*buttonWidth, 0.90*buttonHeight);

	}

	ctx.textAlign = "left";

	ctx.fillText("K = function parameters", 25, barY1);
	ctx.fillText("N = particles quantity", 25, barY1 + 22);
	ctx.fillText("L = figure size", 25, barY1 + 44);
	ctx.fillText("R = particle radius", 25, barY1 + 66);
	ctx.fillText("S = particle speed", 25, barY1 + 88);
	ctx.fillText("W = line width", 25, barY1 + 110);
	ctx.fillText("Z = zoom", 25, barY1 + 132);

}

/*******************/
/* PARAMETERS BARS */
/*******************/

var markImg = new Image();
	markImg.src = "buttons/mark.png";

var barY1 = 667 - 210;
var barY2 = 667 - 45;
var deltaX = 35;

var markWidth = 25;
var markHeight = 13;

var barsArray = [];

var k1Bar = {
	x: 200 + 1*deltaX,
	value: k1,
	min: 1,
	max: 50,
	text: "K1",
	focus: false,
}
barsArray.push(k1Bar);

var k2Bar = {
	x: 200 + 2*deltaX,
	value: k2,
	min: 1,
	max: 50,
	text: "K2",
	focus: false,
}
barsArray.push(k2Bar);

var k3Bar = {
	x: 200 + 3*deltaX,
	value: k3,
	min: 0,
	max: 50,
	text: "K3",
	focus: false,
}
barsArray.push(k3Bar);

var nBar = {
	x: 200 + 4*deltaX,
	value: particleQuantity,
	min: 25,
	max: 1000,
	text: "N",
	focus: false,
}
barsArray.push(nBar);

var lBar = {
	x: 200 + 5*deltaX,
	value: size,
	min: 100,
	max: 250,
	text: "L",
	focus: false,
}
barsArray.push(lBar);

var sBar = {
	x: 200 + 6*deltaX,
	value: particleSpeed,
	min: 0,
	max: 100,
	text: "S",
	focus: false,
}
barsArray.push(sBar);

var rBar = {
	x: 200 + 7*deltaX,
	value: particleSize,
	min: 0,
	max: 10,
	text: "R",
	focus: false,
}
barsArray.push(rBar);

var wBar = {
	x: 200 + 8*deltaX,
	value: lineWidth,
	min: 0,
	max: 10,
	text: "W",
	focus: false,
}
barsArray.push(wBar);

var zBar = {
	x: 200 + 9*deltaX,
	value: zoom,
	min: -49,
	max: 50,
	text: "Z",
	focus: false,
}
barsArray.push(zBar);

/*************/
/* RGBA BARS */
/*************/

var colorBarsArray = [];

var redBar = {
	x: 685,
	color: "red",
	text: "R",
	min: minR,
	max: maxR,
	focus1: false,
	focus2: false,
}
colorBarsArray.push(redBar);

var greenBar = {
	x: 745,
	color: "green",
	text: "G",
	min: minG,
	max: maxG,
	focus1: false,
	focus2: false,
}
colorBarsArray.push(greenBar);

var blueBar = {
	x: 805,
	color: "blue",
	text: "B",
	min: minB,
	max: maxB,
	focus1: false,
	focus2: false,
}
colorBarsArray.push(blueBar);

var alphaBar = {
	x: 865,
	color: "DarkSlateGrey",
	text: "A",
	focus: false,
}
colorBarsArray.push(alphaBar);

var redBarBack = {
	x: 1020,
	color: "red",
	text: "R",
	min: themeColor.r1,
	max: themeColor.r2,
	focus1: false,
	focus2: false,
}
colorBarsArray.push(redBarBack);

var greenBarBack = {
	x: 1080,
	color: "green",
	text: "G",
	min: themeColor.g1,
	max: themeColor.g2,
	focus1: false,
	focus2: false,
}
colorBarsArray.push(greenBarBack);

var blueBarBack = {
	x: 1140,
	color: "blue",
	text: "B",
	min: themeColor.b1,
	max: themeColor.b2,
	focus1: false,
	focus2: false,
}
colorBarsArray.push(blueBarBack);

function barsDraw(){

	ctx.textAlign = "center";

	// PROPERTIES

	for (i = 0; i < barsArray.length; i++){

		ctx.fillText(barsArray[i].text, barsArray[i].x, barY1 - 15);

		ctx.beginPath();
		ctx.moveTo(barsArray[i].x, barY1);
		ctx.lineTo(barsArray[i].x, barY2);
		changeFont();
		ctx.stroke();
		
	}

	ctx.fillStyle = "black";

	for (i = 0; i < barsArray.length; i++){

		if (barsArray[i].focus == false) {
			ctx.drawImage(markImg, barsArray[i].x, barY2 - ((barsArray[i].value - barsArray[i].min)/(barsArray[i].max - barsArray[i].min))*(barY2-barY1) - markHeight/2, markWidth, markHeight);
		}

		else {
			ctx.drawImage(markImg, barsArray[i].x, barY2 - ((barsArray[i].value - barsArray[i].min)/(barsArray[i].max - barsArray[i].min))*(barY2-barY1) - markHeight/2, 1.1*markWidth, 1.1*markHeight);
		}

		ctx.fillText(barsArray[i].value, barsArray[i].x + markWidth/2, barY2  - ((barsArray[i].value - barsArray[i].min)/(barsArray[i].max - barsArray[i].min))*(barY2-barY1) + 0.4*markHeight);

	}

	// COLORS	

	for (i = 0; i < colorBarsArray.length; i++){
		ctx.fillStyle = colorBarsArray[i].color;
		ctx.fillText(colorBarsArray[i].text, colorBarsArray[i].x, barY1 - 15);

		ctx.beginPath();
		ctx.moveTo(colorBarsArray[i].x, barY1);
		ctx.lineTo(colorBarsArray[i].x, barY2);
		changeFont();
		ctx.stroke();

	}

	ctx.fillStyle = "black";

	for (i = 0; i < 3; i++){
		if (colorBarsArray[i].focus1 == false){
			ctx.drawImage(markImg, colorBarsArray[i].x-markWidth, barY2 - colorBarsArray[i].min*(barY2-barY1)/255 - markHeight/2, markWidth, markHeight);
		}
		else {
			ctx.drawImage(markImg, colorBarsArray[i].x-markWidth, barY2 - colorBarsArray[i].min*(barY2-barY1)/255 - markHeight/2, 1.1*markWidth, 1.1*markHeight);
		}

		ctx.fillText(colorBarsArray[i].min, colorBarsArray[i].x - markWidth/2, barY2 - colorBarsArray[i].min*(barY2-barY1)/255 + 0.4*markHeight);

		if (singleColor == false){
			if (colorBarsArray[i].focus2 == false){
				ctx.drawImage(markImg, colorBarsArray[i].x, barY2 - colorBarsArray[i].max*(barY2-barY1)/255 - markHeight/2, markWidth, markHeight);
			}
			else {
				ctx.drawImage(markImg, colorBarsArray[i].x, barY2 - colorBarsArray[i].max*(barY2-barY1)/255 - markHeight/2, 1.1*markWidth, 1.1*markHeight);
			}

			ctx.fillText(colorBarsArray[i].max, colorBarsArray[i].x + markWidth/2, barY2 - colorBarsArray[i].max*(barY2-barY1)/255 + 0.4*markHeight);
		}

	}

	if (alphaBar.focus == false) {
		ctx.drawImage(markImg, alphaBar.x, barY2 - alpha*(barY2-barY1) - markHeight/2, markWidth, markHeight);
	}

	else {
		ctx.drawImage(markImg, alphaBar.x, barY2 - alpha*(barY2-barY1) - markHeight/2, 1.1*markWidth, 1.1*markHeight);
	}

	ctx.fillText(alpha.toFixed(2), alphaBar.x + markWidth/2, barY2 - alpha*(barY2-barY1) + 0.4*markHeight);



	for (i = 4; i < 7; i++){
		if (colorBarsArray[i].focus1 == false){
			ctx.drawImage(markImg, colorBarsArray[i].x-markWidth, barY2 - colorBarsArray[i].min*(barY2-barY1)/255 - markHeight/2, markWidth, markHeight);
		}
		else {
			ctx.drawImage(markImg, colorBarsArray[i].x-markWidth, barY2 - colorBarsArray[i].min*(barY2-barY1)/255 - markHeight/2, 1.1*markWidth, 1.1*markHeight);
		}

		ctx.fillText(colorBarsArray[i].min, colorBarsArray[i].x - markWidth/2, barY2 - colorBarsArray[i].min*(barY2-barY1)/255 + 0.4*markHeight);


		if (colorBarsArray[i].focus2 == false){
			ctx.drawImage(markImg, colorBarsArray[i].x, barY2 - colorBarsArray[i].max*(barY2-barY1)/255 - markHeight/2, markWidth, markHeight);
		}
		else {
			ctx.drawImage(markImg, colorBarsArray[i].x, barY2 - colorBarsArray[i].max*(barY2-barY1)/255 - markHeight/2, 1.1*markWidth, 1.1*markHeight);
		}

		ctx.fillText(colorBarsArray[i].max, colorBarsArray[i].x + markWidth/2, barY2 - colorBarsArray[i].max*(barY2-barY1)/255 + 0.4*markHeight);
		

	}

}



/*********/
/* LOCKS */
/*********/

var lockedImg = new Image();
	lockedImg.src = "buttons/locked.png";

var unlockedImg = new Image();
	unlockedImg.src = "buttons/unlocked.png";

var lockWidth = 50;
var lockHeight = 50;

var locksArray = [];

function loadLocks(){

	for (i = 0; i < barsArray.length - 1; i++){
		var newLock = {
			x: barsArray[i].x - 10,
			y: barY2 + 15,
			focus: false,
			locked: false,
		}

		locksArray.push(newLock);
	}

	for (i = 0; i < colorBarsArray.length; i++){
		var newLock = {
			x: colorBarsArray[i].x - 10,
			y: barY2 + 15,
			focus: false,
			locked: false,
		}

	locksArray.push(newLock);
	}	

}

loadLocks();


function locksDraw(){
	for (i = 0; i < locksArray.length; i++){
		if (locksArray[i].locked == false) {

			if (locksArray[i].focus == false) ctx.drawImage(unlockedImg, locksArray[i].x, locksArray[i].y, unlockedImg.width, unlockedImg.height);
			else ctx.drawImage(unlockedImg, locksArray[i].x, locksArray[i].y, 1.1*unlockedImg.width, 1.1*unlockedImg.height);

		}

		else {

			if (locksArray[i].focus == false) ctx.drawImage(lockedImg, locksArray[i].x, locksArray[i].y, lockedImg.width, lockedImg.height);
			else ctx.drawImage(lockedImg, locksArray[i].x, locksArray[i].y, 1.1*lockedImg.width, 1.1*lockedImg.height);

		}
	}
}

/**********/
/* EVENTS */
/**********/

var mouseX;
var mouseY;

function mousedown(event) {
	mouseX = (event.clientX - rect.left)/scale;
	mouseY = (event.clientY - rect.top)/scale;

	// BUTTONS

	for (i = 0; i < buttonsArray.length; i++){

		if (mouseX > buttonsArray[i].x && mouseX < buttonsArray[i].x + buttonWidth &&
			mouseY > buttonsArray[i].y + Y && mouseY < buttonsArray[i].y + buttonHeight + Y){

			buttonsArray[i].focus = true;

		}

	}

	// PROPERTIES BAR

	for (i = 0; i < barsArray.length; i++){
		if (mouseX > barsArray[i].x && mouseX < barsArray[i].x + markWidth &&
			mouseY > barY2 - ((barsArray[i].value - barsArray[i].min)/(barsArray[i].max - barsArray[i].min))*(barY2-barY1) - markHeight/2  + Y && mouseY < barY2 - ((barsArray[i].value - barsArray[i].min)/(barsArray[i].max - barsArray[i].min))*(barY2-barY1) + markHeight/2 + Y){

			barsArray[i].focus = true;

		}
	}

	// COLOR BAR

	for (i = 0; i < 3; i++){
		if (mouseX > colorBarsArray[i].x-markWidth && mouseX < colorBarsArray[i].x &&
			mouseY > barY2 - colorBarsArray[i].min*(barY2-barY1)/255 - markHeight/2  + Y && mouseY < barY2 - colorBarsArray[i].min*(barY2-barY1)/255 + markHeight/2 + Y){

			colorBarsArray[i].focus1 = true;

		}
	}

	if (singleColor == false){
		for (i = 0; i < 3; i++){
			if (mouseX > colorBarsArray[i].x && mouseX < colorBarsArray[i].x + markWidth &&
				mouseY > barY2 - colorBarsArray[i].max*(barY2-barY1)/255 - markHeight/2 + Y && mouseY < barY2 - colorBarsArray[i].max*(barY2-barY1)/255 + markHeight/2 + Y){

				colorBarsArray[i].focus2 = true;

			}
		}
	}

	if (mouseX > alphaBar.x && mouseX < alphaBar.x + markWidth &&
		mouseY > barY2 - alpha*(barY2-barY1) - markHeight/2 + Y && mouseY < barY2 - alpha*(barY2-barY1) + markHeight/2 + Y){

		alphaBar.focus = true;

	}

	for (i = 4; i < 7; i++){
		if (mouseX > colorBarsArray[i].x-markWidth && mouseX < colorBarsArray[i].x &&
			mouseY > barY2 - colorBarsArray[i].min*(barY2-barY1)/255 - markHeight/2  + Y && mouseY < barY2 - colorBarsArray[i].min*(barY2-barY1)/255 + markHeight/2 + Y){
			colorBarsArray[i].focus1 = true;
		}
	}

	for (i = 4; i < 7; i++){
		if (mouseX > colorBarsArray[i].x && mouseX < colorBarsArray[i].x + markWidth &&
			mouseY > barY2 - colorBarsArray[i].max*(barY2-barY1)/255 - markHeight/2 + Y && mouseY < barY2 - colorBarsArray[i].max*(barY2-barY1)/255 + markHeight/2 + Y){
			colorBarsArray[i].focus2 = true;
		}
	}

	// LOCKS

	for (i = 0; i < locksArray.length; i++){

		if (mouseX > locksArray[i].x && mouseX < locksArray[i].x + lockedImg.width &&
			mouseY > locksArray[i].y + Y && mouseY < locksArray[i].y + lockedImg.height + Y)

		locksArray[i].focus = true;

	}


}

function mouseup() {

	// BUTTONS
	for (i = 0; i < buttonsArray.length; i++){

		if (buttonsArray[i].focus == true){

			buttonsArray[i].focus = false;
			buttonsArray[i].effect();

		}

	}

	// BARS

	for (i = 0; i < barsArray.length; i++){
		barsArray[i].focus = false;
	}

	for (i = 0; i < 3; i++){
		colorBarsArray[i].focus1 = false;
		colorBarsArray[i].focus2 = false;	
	}

	alphaBar.focus = false;

	for (i = 4; i < 7; i++){
		colorBarsArray[i].focus1 = false;
		colorBarsArray[i].focus2 = false;	
	}

	// LOCKS

	for (i = 0; i < locksArray.length; i++){

		if (locksArray[i].focus == true){

			locksArray[i].focus = false;
			if (locksArray[i].locked == false) locksArray[i].locked = true;
			else locksArray[i].locked = false;

		}

	}


}

function mousemove(event){
	mouseX = (event.clientX - rect.left)/scale;
	mouseY = (event.clientY - rect.top)/scale - Y;

	// PROPERTIES

	for (i = 0; i < barsArray.length; i++){

		if (barsArray[i].focus == true){

			if ((mouseY - barY2)*(barsArray[i].max - barsArray[i].min)/(barY1-barY2) + barsArray[i].min >= barsArray[i].min && (mouseY - barY2)*(barsArray[i].max - barsArray[i].min)/(barY1-barY2) + barsArray[i].min <= barsArray[i].max){
				barsArray[i].value = Math.floor((mouseY - barY2)*(barsArray[i].max - barsArray[i].min)/(barY1-barY2) + barsArray[i].min);
			}
			if ((mouseY - barY2)*(barsArray[i].max - barsArray[i].min)/(barY1-barY2) + barsArray[i].min < barsArray[i].min) barsArray[i].value = barsArray[i].min;
			if ((mouseY - barY2)*(barsArray[i].max - barsArray[i].min)/(barY1-barY2) + barsArray[i].min > barsArray[i].max) barsArray[i].value = barsArray[i].max;

			if (i <= 3) particleRefresh();

		}

	}

	// COLORS

	for (i = 0; i < 3; i++){

		if (colorBarsArray[i].focus1 == true){
			if ((mouseY - barY2)*255/(barY1-barY2) >= 0 && (mouseY - barY2)*255/(barY1-barY2) <= 255){
				colorBarsArray[i].min = Math.floor((mouseY - barY2)*255/(barY1-barY2));
			}
			if ((mouseY - barY2)*255/(barY1-barY2) < 0) colorBarsArray[i].min = 0;
			if ((mouseY - barY2)*255/(barY1-barY2) > 255) colorBarsArray[i].min = 255;

			minR = colorBarsArray[0].min;
			maxR = colorBarsArray[0].max;

			minG = colorBarsArray[1].min;
			maxG = colorBarsArray[1].max;

			minB = colorBarsArray[2].min;
			maxB = colorBarsArray[2].max;

			for (i = 0; i < particlesArray.length; i++){
				particlesArray[i].r = Math.floor(Math.random()*(maxR - minR)) + minR;
				particlesArray[i].g = Math.floor(Math.random()*(maxG - minG)) + minG;
				particlesArray[i].b = Math.floor(Math.random()*(maxB - minB)) + minB;
			}

		}

	}

	for (i = 0; i < 3; i++){

		if (colorBarsArray[i].focus2 == true){
			if ((mouseY - barY2)*255/(barY1-barY2) >= 0 && (mouseY - buttonY1)*255/(barY2-barY1) <= 255){
				colorBarsArray[i].max = Math.floor((mouseY - barY2)*255/(barY1-barY2));
			}
			if ((mouseY - barY2)*255/(barY1-barY2) < 0) colorBarsArray[i].max = 0;
			if ((mouseY - barY2)*255/(barY1-barY2) > 255) colorBarsArray[i].max = 255;

			minR = colorBarsArray[0].min;
			maxR = colorBarsArray[0].max;

			minG = colorBarsArray[1].min;
			maxG = colorBarsArray[1].max;

			minB = colorBarsArray[2].min;
			maxB = colorBarsArray[2].max;

			for (i = 0; i < particlesArray.length; i++){
				particlesArray[i].r = Math.floor(Math.random()*(maxR - minR)) + minR;
				particlesArray[i].g = Math.floor(Math.random()*(maxG - minG)) + minG;
				particlesArray[i].b = Math.floor(Math.random()*(maxB - minB)) + minB;
			}

		}

	}

	if (alphaBar.focus == true) {
		if ((mouseY - buttonY3)/(buttonY1-buttonY3) >= 0 && (mouseY - buttonY1)/(buttonY3-buttonY1) <= 1){
			alpha = (mouseY - buttonY3)/(buttonY1-buttonY3);
		}
		if ((mouseY - buttonY3)/(buttonY1-buttonY3) < 0) alpha = 0;
		if ((mouseY - buttonY3)/(buttonY1-buttonY3) > 1) alpha = 1;
	}


	// BACKGROUND

	for (i = 4; i < 7; i++){

		if (colorBarsArray[i].focus1 == true){
			if ((mouseY - barY2)*255/(barY1-barY2) >= 0 && (mouseY - buttonY1)*255/(barY2-barY1) <= 255){
				colorBarsArray[i].min = Math.floor((mouseY - barY2)*255/(barY1-barY2));
			}
			if ((mouseY - barY2)*255/(barY1-barY2) < 0) colorBarsArray[i].min = 0;
			if ((mouseY - barY2)*255/(barY1-barY2) > 255) colorBarsArray[i].min = 255;

			themeColor.r1 = colorBarsArray[4].min;
			themeColor.r2 = colorBarsArray[4].max;

			themeColor.g1 = colorBarsArray[5].min;
			themeColor.g2 = colorBarsArray[5].max;

			themeColor.b1 = colorBarsArray[6].min;
			themeColor.b2 = colorBarsArray[6].max;	

		}

	}

	for (i = 4; i < 7; i++){

		if (colorBarsArray[i].focus2 == true){
			if ((mouseY - barY2)*255/(barY1-barY2) >= 0 && (mouseY - buttonY1)*255/(barY2-barY1) <= 255){
				colorBarsArray[i].max = Math.floor((mouseY - barY2)*255/(barY1-barY2));
			}
			if ((mouseY - barY2)*255/(barY1-barY2) < 0) colorBarsArray[i].max = 0;
			if ((mouseY - barY2)*255/(barY1-barY2) > 255) colorBarsArray[i].max = 255;

			themeColor.r1 = colorBarsArray[4].min;
			themeColor.r2 = colorBarsArray[4].max;

			themeColor.g1 = colorBarsArray[5].min;
			themeColor.g2 = colorBarsArray[5].max;

			themeColor.b1 = colorBarsArray[6].min;
			themeColor.b2 = colorBarsArray[6].max;	

		}

	}

}

window.addEventListener("mousedown", mousedown, false);
window.addEventListener("mouseup", mouseup, false);
window.addEventListener("mousemove", mousemove, false);

canvas.addEventListener("touchstart", mousedown, false);
canvas.addEventListener("touchend", mouseup, false);
canvas.addEventListener("touchmove", mousemove, false);

/*****************/
/* DRAW FUNCTION */
/*****************/
draw();

var Y = 0;
function draw(){

	update();

	ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	changeBackground();

	ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

	ctx.save();

	ctx.translate(centerX, centerY);
	ctx.scale(zoom, zoom);
	ctx.translate(-centerX, -centerY);

	particleDraw();

	ctx.restore();

	ctx.save();

	ctx.scale(scale, scale);

	titleDraw();

	fps.draw();

	Y = CANVAS_HEIGHT/scale - 667;

	ctx.translate(0, Y);

	buttonsDraw();

	locksDraw();

	barsDraw();

	ctx.restore();

	GetAnimationFrameRate(draw);
}

/*******************/
/* UPDATE FUNCTION */
/*******************/
var t1, t2, dt;
t1 = new Date().getTime();
var rect = canvas.getBoundingClientRect();
function update(){

	screenUpdate();

	gradient = ctx.createRadialGradient(CANVAS_WIDTH/2, 200, 0, CANVAS_WIDTH/2, 200, CANVAS_WIDTH);
   	gradient.addColorStop(0, 'white');
    gradient.addColorStop(1, 'DarkSlateGrey');

    themesArray[0].background = gradient;

    BackgroundRefresh();

	t2 = new Date().getTime();
	dt = (t2 - t1)/1000;
	t1 = t2;
	if (dt > 0.260) dt = 0;

	deltaTime = dt;

	parametersRefresh();

	particleUpdate();

}

particleRefresh();

};