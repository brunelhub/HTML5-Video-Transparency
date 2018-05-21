/*
*** Video Presentation ***
*/

"use strict";

class VpServer 
{
	constructor(/*options*/) 
	{
		// Properties
		// this.src = options.src;
		// this.poster = options.poster;
		this.init();
	}

	init() 
	{
		// Initialize communication between server & client
		// The client messages will only get passed once the server has sent the first message
		this.sendMsgToClt({ action: "initCom" }),
		window.addEventListener("message", this.getMsgFromClt.bind(this), false)
	}

	createContent() 
	{
		// Page title
		document.title = this.clientDomain + " - Presentation";

		// Video container
		let vpCont = document.createElement("div"); 
		vpCont.className = "vp-container";
		vpCont.style.width = this.width + "px";
		vpCont.style.height = this.height + "px";
		document.body.appendChild(vpCont);

		// Video element
		let vpVideo = document.createElement("video"); 
		vpVideo.className = "vp-video";
		vpVideo.preload = "auto";
		vpVideo.loop = this.playRepeat ? "loop" : null;
		vpVideo.setAttribute("playsinline", "true");
        vpVideo.setAttribute("webkit-playsinline", "true");
        // vpVideo.setAttribute("iphone-inline-video", "");
        // vpVideo.setAttribute("controls", "");
        vpVideo.setAttribute("crossorigin", "anonymous");
		vpCont.appendChild(vpVideo);

		// Video sources
		this.src.forEach(s => {
			let vpSource = document.createElement("source");
			vpSource.src = s.path;
			vpSource.type = s.type;
			vpSource.setAttribute("codecs", s.codecs);
			vpVideo.appendChild(vpSource);
		});

		// BUFFER canvas
		let vpBuffer = document.createElement("canvas");
		vpBuffer.className = "vp-buffer";
		vpBuffer.id = "vp-buffer";
		vpBuffer.width = this.width;
		vpBuffer.height = this.height * 2;
		vpBuffer.style.display = "none";
		vpCont.appendChild(vpBuffer);

		// OUTPUT canvas
		let vpOutput = document.createElement("canvas");
		vpOutput.className = "vp-output";
		vpOutput.width = this.width;
		vpOutput.height = this.height;
		vpCont.appendChild(vpOutput);

		// Video poster
		let vpPoster = new Image();
		vpPoster.className = "vp-poster";
		vpPoster.src = this.poster;
		vpPoster.style.width = this.width + "px";
		vpPoster.style.height = this.height + "px";
		this.playAuto && !this.isMobile ? vpPoster.style.display = "none" : vpPoster.style.display = "block"
		vpCont.appendChild(vpPoster);

		// Video controls
		let vpControls = document.createElement("div");
		vpControls.className = "vp-controls" + (this.controlsAutoHide ? " controlsAutoHide" : "");
		// vpControls.style.display = "none";
		vpCont.appendChild(vpControls);

		// Play/Pause button
		let vpPlay = document.createElement("button");
		vpPlay.className = "vp-play-pause icon-play";
		vpPlay.title = "Play";
		vpControls.appendChild(vpPlay);
		vpPlay.addEventListener("click", function(e) {
            e.preventDefault(), e.stopPropagation(), this.vpVideo.paused ? this.vpVideo.play() : this.vpVideo.pause()
        }.bind(this));

		// Close button
		let vpClose = document.createElement("button");
		vpClose.className = "vp-close icon-close" + (this.controlsAutoHide ? " controlsAutoHide" : "");
		vpClose.title = "Close";
		vpCont.appendChild(vpClose);
		vpClose.addEventListener("click", function(e) {
            e.preventDefault(), e.stopPropagation(), this.vpVideo.pause(), this.vpCont.style.display = "none", this.sendMsgToClt({ action: "close" })
        }.bind(this));

		// Button overlay
		if (this.button) {
			let vpButton = document.createElement("div");
			vpButton.className = "vp-button";
			vpCont.appendChild(vpButton);
			let vpButtonLink = document.createElement("a");
			vpButtonLink.style.color = this.buttonTextColor;
			vpButtonLink.style.backgroundColor = this.buttonColor;
			vpButtonLink.style.cursor = this.buttonLink ? "pointer" : "default";
			this.buttonAlignCenter ? vpButton.style.textAlign = "center" : vpButton.style.textAlign = ""
			vpButton.style.top = this.buttonTop + "px";
	        vpButton.style.bottom = this.buttonBottom + "px";
			!this.buttonAlignCenter ? vpButtonLink.style.left = this.buttonLeft + "px" : vpButtonLink.style.left = ""
	        !this.buttonAlignCenter ? vpButtonLink.style.right = this.buttonRight + "px" : vpButtonLink.style.right = ""
			vpButtonLink.innerHTML = "<span>" + this.buttonText + "</span>";
			vpButtonLink.href = this.buttonLink ? this.buttonLink : "javaScript:void(0);";
			vpButtonLink.target = "_blank";
			vpButton.appendChild(vpButtonLink);
			this.buttonStart ? vpButton.style.display = "none" : vpButton.style.display = "block"
		}

		this.vpCont = vpCont;
		this.vpVideo = vpVideo;
		this.vpBuffer = vpBuffer;
		this.vpOutput = vpOutput;
		this.vpPoster = vpPoster;
		this.vpControls = vpControls;
		this.vpPlay = vpPlay;
		if (this.button) this.vpButton = vpButton;

		// play video
		vpVideo.addEventListener("canplay", function() {
			if (vpVideo.paused && this.playAuto && !this.isMobile) try {
                vpVideo.play()
            } catch (e) {
                vpVideo.pause()
            }
		}.bind(this));

		// draw video
		vpVideo.addEventListener("play", function() {
			this.vpPoster.style.display = "none";
			this.vpControls.style.display = "block";
			this.vpPlay.className = "vp-play-pause icon-pause"; 
			this.vpPlay.title = "Pause";
			this.initDrawVideo();
		}.bind(this));

		// video paused
		vpVideo.addEventListener("pause", function() {
			this.vpPlay.className = "vp-play-pause icon-play"; 
			this.vpPlay.title = "Play";
		}.bind(this));

		// video ended
		vpVideo.addEventListener("ended", function() {
			this.endRemoval ? (this.vpCont.style.display = "none", this.sendMsgToClt({ action: "close" })) : this.vpPoster.style.display = "block"
		}.bind(this));

		// video playing
		vpVideo.addEventListener("timeupdate",function() {
			//////////////////////////////////////////////////////////////////////////
			if (this.buttonStart && this.vpVideo.currentTime >= this.buttonStart) {
				this.vpButton.style.display = "block";
			}
			if (this.buttonStart && this.vpVideo.currentTime >= this.buttonEnd) {
				this.vpButton.style.display = "none";
			}
			//////////////////////////////////////////////////////////////////////////
			if (this.highlights) {
				let nbElements = this.highlights.length;
				for (let i = 0; i < nbElements; i++) {
					//send message to client 
					if (this.vpVideo.currentTime >= this.highlights[i].start) {
						// console.log("SERVER LOG : ==> this.highlights[i].start : " + JSON.stringify(this.highlights[i].start));
						this.sendMsgToClt({ action: "highlights", startHighlight: i })
					}
					if (this.vpVideo.currentTime >= this.highlights[i].end) {
						// console.log("SERVER LOG : ==> this.highlights[i].end : " + JSON.stringify(this.highlights[i].end));
						this.sendMsgToClt({ action: "highlights", endHighlight: i })
					}
				};
			}
			//////////////////////////////////////////////////////////////////////////
		}.bind(this));

	}

	sendMsgToClt(msg) 
	{
		window.parent.postMessage(JSON.stringify(msg), "*");
	}

	getMsgFromClt(msg) 
	{
		let data = JSON.parse(msg.data);
		switch (data.action) 
		{
			case "cltOptions":
			    // recieve options from the client
			    console.log("SERVER LOG : ==> Recieved options from the client");
			    // assign options to instance variable 'this' (ex: this.term = opts.terms;)
				let opts = Object.assign({}, data.options);
				Object.keys(opts).forEach(prop => {
					this[prop] = opts[prop];
				});
				document.readyState == "complete" ? this.createContent() : window.addEventListener("load", this.createContent.bind(this), false);
			    break;
		}	
	}

	initDrawVideo() 
	{
		// Pass context to setInterval so we can call drawVideo()
		let e = this;
		window.setInterval(function() {
	        e.drawVideo();
	    }, 20);
	}

	drawVideo() 
	{
		let bufferCtx = this.vpBuffer.getContext('2d');
		let outputCtx = this.vpOutput.getContext('2d');

		bufferCtx.drawImage(this.vpVideo, 0, 0, this.width, 2 * this.height);
		// bufferCtx.drawImage(this.vpVideo, 0, 0);
		let image = bufferCtx.getImageData(0, 0, this.width, this.height);
		let imageData = image.data;
		let alphaData = bufferCtx.getImageData(0, this.height, this.width, this.height).data;
		let length = imageData.length;

		for (let i = 3; i < length; i += 4) imageData[i] = alphaData[i - 1];
		// outputCtx.putImageData(image, 0, 0, 0, 1, this.width, this.height);
		outputCtx.putImageData(image, 0, 0, 0, 0, this.width, this.height);
	}


}