/*
*** Video Presentation ***
*/

"use strict";

class VpClient 
{
	constructor(options) 
	{
		// Default properties
		const defaults = {
							id: "vp-demo", // used by iframe address
							clientDomain: "", // used by page Title
							serverAddress: "https://www.our-server.com", // used by iframe address
							src: [],
					        poster: "",
							isMobile: false,
							mobileSize: 65, // percentage
							containerId: "", // body by default
					        width: 0,
					        height: 0,
					        left: "", // if empty => won't be added
					        right: "0",
					        top: "",
					        bottom: "0",
					        playAuto: true,
					        playRepeat: false,
					        endRemoval: true,
					        controlsAutoHide: true, // only if controlsShow is true
					        button: false,
				            buttonText: "test",
				            buttonLink: "",
				            buttonColor: "#1CA593",
				            buttonTextColor: "#ffffff",
				            buttonAlignCenter: false,
				            buttonTop: "", // if empty => don't add style
				            buttonBottom: "",
				            buttonLeft: "", // only if buttonAlignCenter = false
				            buttonRight: "", // only if buttonAlignCenter = false
				            buttonStart: "", // in seconds
				            buttonEnd: "", // works only if buttonStart is setup
				            highlights: {}, // key/value => elementId or class/{start: 0, end: 10}
						};
		let opts = Object.assign({}, defaults, options);
		this.opts = opts;
		this.init();
	}

	init() 
	{
		this.checkDevice(),
		window.addEventListener("message", this.getMsgFromSrv.bind(this), false),
		document.readyState == "complete" ? this.createIframe() : window.addEventListener("load", this.createIframe.bind(this), false)
	}

	createIframe() 
	{
		// if on mobile ==> change dimensions
		if (this.opts.isMobile) this.opts.width = (this.opts.width / 100 * this.opts.mobileSize).toFixed(1), this.opts.height = (this.opts.height / 100 * this.opts.mobileSize).toFixed(1);

  		let iframe = document.createElement("iframe");
		iframe.id = "video-presentation";
		iframe.src = this.opts.serverAddress + "/" + this.opts.id + "/vpinclude.html";
        iframe.width = this.opts.width;
        iframe.height = this.opts.height;
		iframe.scrolling = "no";
        iframe.style.border = "none";
        iframe.style.position = "fixed";
        iframe.style.zIndex = "999999";
        iframe.style.left = this.opts.left + "px";
        iframe.style.right = this.opts.right + "px";
        iframe.style.top = this.opts.top + "px";
        iframe.style.bottom = this.opts.bottom + "px";
        iframe.setAttribute('allowFullScreen', '');
  		this.opts.containerId !== "" && document.getElementById(this.opts.containerId) ? document.getElementById(this.opts.containerId).appendChild(iframe) : document.body.appendChild(iframe);
	}

	removeIframe() 
	{
		let iframe = document.getElementById("video-presentation");
		iframe.style.display = "none";
		iframe.parentNode.removeChild(iframe);
	}

	sendMsgToSrv(msg) 
	{
		let iframe = document.getElementById("video-presentation");
		iframe.contentWindow.postMessage(JSON.stringify(msg), "*")
	}

	getMsgFromSrv(msg) 
	{
		let data = JSON.parse(msg.data);
		switch (data.action)
		{
            case "initCom":
                // Send options the server
                console.log("CLIENT LOG : ==> Communication initialized by the server");
                let newMsg = { 
									action: "cltOptions", 
									options: this.opts 
								};
                this.sendMsgToSrv(newMsg);
                break;

            case "close":
                this.removeIframe();
                break;

            case "highlights":
            	if (data.hasOwnProperty("startHighlight")) {
            		let startElement = document.querySelector(this.opts.highlights[data.startHighlight].htmlElement);
								this.highlightElement(startElement);
            	}
            	else if (data.hasOwnProperty("endHighlight")) {
            		let endElement = document.querySelector(this.opts.highlights[data.endHighlight].htmlElement);
								this.unhighlightElement(endElement);
            	}
            break;
                
        }
	}

	checkDevice() 
	{
		// check if we're on mobile
		let check = false;
		(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
		// sets this.isMobile
		this.opts.isMobile = check;
	}

	highlightElement(element) 
	{
		element.style.backgroundColor = "rgba(0, 100, 255, 0.35)";
		element.style.color = "rgba(255, 255, 255, 1)";
		element.style.border = "2px solid rgba(20, 20, 20, .4)";
		element.style.borderRadius = "7px";
	}

	unhighlightElement(element) 
	{
		// restore previously saved styles
		element.style.backgroundColor = "";
		element.style.color = "";
		element.style.border = "none";
		element.style.borderRadius = "";
	}

}