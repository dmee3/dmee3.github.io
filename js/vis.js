fade = ['#EEEEEE', '#BBBBBB', '#999999'];
colors = ['#763568', '#8E44AD', '#CF000F', '#DC3023', '#F9690E', '#F4D03F', '#7A942E', '#26A65B', '#36D7B7', '#22A7F0'];
var vis = null;
var fullscreen = false;
var style = document.getElementById('style');
var canvas = document.getElementById('visualizer');

function findDistance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function Bar(x, y, w, h) {
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};

function Line(x, y) {
	this.x = x;
	this.y = y;
};

function Particle(w, h, c) {
	this.x =  Math.round(Math.random() * w);
	this.y =  Math.round(Math.random() * h);
	this.vx =  Math.random() * 2- 1;
	this.vy =  Math.random() * 2 - 1;
	this.color = colors[c];
	this.rad = Math.round(Math.random()) + 1;
};

function Visualizer(audioElement, canvasElement) {

	var me = this;

	//Wire up canvas DOM element
	this.canvas = canvasElement;
	var canvasCtx = canvasElement.getContext('2d');
	canvasCtx.globalCompositeOperation = 'lighter';
	canvasCtx.lineWidth = 0.5;

	//Set up canvas state
	this.visStyle = 'Particles';
	var shapes = [];
	var history1 = [];
	var history2 = [];
	var particles = [];

	//Wire up audio DOM element
	this.audio = audioElement;
	audioElement.src = 'files/WildBoy.m4a';
	audioElement.controls = true;
	audioElement.autoplay = true;

	//Set up audio context and nodes
	var audioCtx = new window.AudioContext();
	var analyser = audioCtx.createAnalyser();

	//Connect audio nodes
	var source = audioCtx.createMediaElementSource(audioElement);
  source.connect(analyser);
  analyser.connect(audioCtx.destination);
	analyser.fftSize = 128;
	var bufferLength = analyser.frequencyBinCount;
	var timeArray = new Uint8Array(bufferLength);
	var freqArray = new Uint8Array(bufferLength);
	var freqAvg = 0, freqAvg1 = 0, freqAvg2 = 0;

	//Generate particles
	for (var i = 0; i < bufferLength; i++) {
		particles.push(new Particle(canvasElement.width, canvasElement.height, Math.floor(i * colors.length / bufferLength)));
	}

	//Draw a visualizer with vertical bars for each frequency range
	drawBars = function() {

		//Draw old bars faded
		canvasCtx.fillStyle = fade[2];
		for (var i = 0; i < history2.length; i++) {
			canvasCtx.fillRect(history2[i].x, history2[i].y, history2[i].w, history2[i].h);
		}
		canvasCtx.fillStyle = fade[1];
		for (var i = 0; i < history1.length; i++) {
			canvasCtx.fillRect(history1[i].x, history1[i].y, history1[i].w, history1[i].h);
		}

		//Calculate bar sizes
		var barWidth = ((canvasElement.width - 4) / bufferLength + 4);
		var barHeight;
		var x = 2;

		//Draw new bars
		shapes = [];
		for(var i = 0; i < bufferLength; i++) {

			//Bar height is calculated by:
			//    (x[i] - minFreq) * scale_factor / (maxFreq - minFreq)
			//    where maxFreq = 255 and minFreq = 0
			barHeight = freqArray[i] * canvasElement.height / 255;

			//Draw bar and record shape
			if (history2.length > 0 && barHeight > history1[i].h) {
				canvasCtx.fillStyle = colors[Math.floor(i * colors.length / bufferLength)];
			} else {
				canvasCtx.fillStyle = fade[0];
			}
			canvasCtx.fillRect(x, canvasElement.height - barHeight + 50, barWidth, barHeight);
			shapes.push(new Bar(x, canvasElement.height - barHeight + 50, barWidth, barHeight));

			x += barWidth + 4;
		}

		//Update former shape record
		history2 = history1;
		history1 = shapes;

	};

	//Draw a visualizer with lines representing frequency range values
	drawLines = function() {

		//Draw old lines faded
		canvasCtx.lineWidth = 0.5;
		if (history2[0]) {
			canvasCtx.strokeStyle = fade[1];
			canvasCtx.beginPath();
			canvasCtx.moveTo(history2[0].x, history2[0].y);
			for (var i = 1; i < history2.length; i++) {
				canvasCtx.lineTo(history2[i].x, history2[i].y);
			}
			canvasCtx.stroke();
			canvasCtx.closePath();
		}
		if (history1[0]) {
			canvasCtx.strokeStyle = fade[1];
			canvasCtx.beginPath();
			canvasCtx.moveTo(history1[0].x, history1[0].y);
			for (var i = 1; i < history1.length; i++) {
				canvasCtx.lineTo(history1[i].x, history1[i].y);
			}
			canvasCtx.stroke();
			canvasCtx.closePath();
		}

		//Set up beginning of canvas stroke for new line
		var intervalWidth = ((canvasElement.width - 4) / bufferLength + 4);
		var x = 2;

		//Draw new line
		canvasCtx.strokeStyle = fade[0];
		canvasCtx.lineWidth = 1;
		canvasCtx.beginPath();
		canvasCtx.moveTo(x, freqArray[0] * canvasElement.height / 255);
		shapes = [];
		for(var i = 1; i < bufferLength - 1; i++) {

			var height = freqArray[i] * canvasElement.height / 255;
			var y = canvasElement.height - height + 50;
			canvasCtx.lineTo(x, y);
			shapes.push(new Line(x, y));

			x += intervalWidth + 4;
		}

		canvasCtx.stroke();
		canvasCtx.closePath();

		//Update previous line values
		history2 = history1;
		history1 = shapes;
	};

	//Draw a visualizer with randomixed particles
	drawParticles = function() {

		for (var i = 0; i < bufferLength; i++) {

			var part = particles[i];

			//Draw particle with updated radius
			canvasCtx.fillStyle = part.color;
			canvasCtx.beginPath();
			var maxRad = canvasElement.width / 30;
			part.rad = freqArray[i] * maxRad / 255;
			canvasCtx.arc(part.x, part.y, part.rad, 0, Math.PI * 2, false);
			canvasCtx.fill();
			canvasCtx.closePath();

			//Draw connections between close particles
			canvasCtx.strokeStyle = '#EEEEEE';
			canvasCtx.lineWidth = 1;
			for (var j = 0; j < bufferLength; j++) {
				var part2 = particles[j];
				if (findDistance(part.x, part.y, part2.x, part2.y) < maxRad * 1.5) {
					canvasCtx.beginPath();
					canvasCtx.moveTo(part.x, part.y);
					canvasCtx.lineTo(part2.x, part2.y);
					canvasCtx.stroke();
				}
			}

			//Update particle position
			part.x += part.vx;
			part.y += part.vy;
			if (part.x > canvasElement.width) part.x = 0;
			if (part.x < 0) part.x = canvasElement.width;
			if (part.y > canvasElement.height) part.y = 0;
			if (part.y < 0) part.x = canvasElement.height;
			
			//Slightly randomize particle direction
			if (Math.random() > 0.9) {
				part.vx += Math.random() * 0.5 - 0.25;
				part.vy += Math.random() * 0.5 - 0.25;
			}
		}
	};

	//Refresh function, called for every time step
	this.refresh = function() {

		//Clear canvas
		canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
		canvasCtx.globalCompositeOperation = 'lighter';

		//Set background by average of low end frequency
		analyser.getByteFrequencyData(freqArray);
		//freqAvg = (freqArray[0] + freqArray[1] + freqArray[2] + freqArray[4]) / 4;
		//freqAvg2 = freqAvg1;
		//freqAvg1 = freqAvg;
		if (freqAvg - freqAvg1 > freqAvg1 - freqAvg2) {
			canvasCtx.fillStyle = '#555555';
			canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
		}


		//Redraw based on chosen style
		switch(me.visStyle) {
			case 'Bars':
				drawBars();
				break;
			case 'Lines':
				drawLines();
				break;
			case 'Particles':
				drawParticles();
				break;
		}
	};
};

//Create and run visualizer object
window.addEventListener('load', function(e) {

	vis = new Visualizer(document.getElementById('player'), document.getElementById('visualizer'));
	setInterval(vis.refresh, 30);
}, false);

//Change visualizer style when dropdown is changed
style.addEventListener('change', function(e) {
	vis.visStyle = style.options[style.selectedIndex].text;
});

//Toggle fullscreen on visualizer click
canvas.addEventListener('click', function(e) {
	if (fullscreen) {
		canvas.width = 500;
		canvas.height = 500;
		canvas.style.position = "relative";
	} else {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas.style.position = "fixed";
	}
	fullscreen = !fullscreen;
}, false);