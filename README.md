# Video Presentation - HTML5 videos with alpha channel transparency

**This small package allows you to display videos with transparency on a web page. Usefull if you want to display a web presenter on your home page for example**

---

## Installation

1. Download the files.

2. Integrate the script `vpclient.js` to the client website.
	- by loading it 
        ```html 
        <script src="js/vpclient.js"></script> 
        ```
	- or by adding its content directly to the HTML body of the page 
        ```html
        <script language="Javascript"> here goes the source </script>
        ````

3. Also add this to the body of the page :
	```html
    <script>
	let vpClient = new VpClient({
	                            id: "test-server",
	                            clientDomain: "test-client",
	                            serverAddress: "https://www.my-server.com",
	                            width: 370,
	                            height: 506,
                                });
    </script>
    ```
	*This is where you can configure the way the video is displayed.*

4. Add the files `vpserver.js` and `vpinclude.html` to a folder on the server.
    It might be on the same domain or on a different domain (as long as the server is allowed to serve files to the domain where the request originated from).

    - /folder/**vpinclude.html**
    - /folder/**js/vpserver.js**
	
	


## About the video files

The script requires the alpha information to be added underneath the RGB track, and to be the same size as the original video. The white part of the video represents what will be displayed (visible) and the black part represents what will be hidden.

Check the demo videos in the `server/videos` folder to understand how the source videos should look like.

Here is an example of how it renders on the page: **[live demo][example-1]**

[example-1]: http://www.france-consulting.fr/


## Options

When you instantiate the client class, you can pass several options to configure the way the video is displayed:


- `id: "folder"`
Name of the server folder. Used in the Iframe address. </br>ex: https://www.server.com/FOLDER
- `clientDomain: ""`
Name of the client website. Used in the Iframe title.
- `iserverAddress: "https://www.server.com"`
Address of the server. Used in the Iframe address.
- `src: [{`</br>	
            `path:"videos/video.m4v",`</br>
		    `type: "video/mp4",`</br>
		    `codecs: "avc1.42E01E"`</br>
	    `}]`      
Video sources (address relative to the folder on the server). </br>ex: https://www.server.com/FOLDER/VIDEOS/VIDEO.M4V
- `poster: "videos/poster.png",`
Poster image (address relative to the folder on the server). </br>ex: https://www.server.com/FOLDER/VIDEOS/POSTER.PNG
- `mobileSize: 65`
Percentage of the size of the video to be displayed on mobile and tablets (65% by default).
- `containerId: ""`
HTML element containing the Iframe (<body> by default).
- `width: 0`
Video width (same for the Iframe).
- `height: 0`
Video height (same for the Iframe).
- `left: ""`
Left positioning of the Iframe (NULL by default). Only the value, without "px".
- `right: "0"`
Right positioning of the Iframe (0 by default).
- `top: ""`
Top positioning of the Iframe (NULL by default).
- `bottom: "0"`
Bottom positioning of the Iframe (0 by default).
- `playAuto: true`
Autoplay (true by default).
- `playRepeat: false`
Auto repeat (false by default).
- `endRemoval: true`
Deletes the video after it finishes playing (true by default).
- `controlsAutoHide: true`
Play/Pause/Close buttons are hidden by default. They are displayed on mouse hover (true by default).
- `button: false`
Activate the creation of a button on top of the video (false by default).
- `buttonText: "text"`
Text on the button.
- `buttonLink: "https://www.link.com"`
Link of the button.
- `buttonColor: "#1CA593"`
Color of the button (green by default).
- `buttonTextColor: "#ffffff"`
Color of the text on the button (white by default).
- `buttonAlignCenter: false`
Automatic alignment of the button in the center of the video.
- `buttonTop: ""`
Top positioning of the button (NULL by default). Only the value, without "px".
- `buttonBottom: ""`
Bottom positioning of the button (NULL by default). Only the value, without "px".
- `buttonLeft: ""`
Left positioning of the button (NULL by default). Only used if buttonAlignCenter = false.
- `buttonRight: ""`
Right positioning of the button (NULL by default). Only used if buttonAlignCenter = false.
- `buttonStart: ""`
Starts displaying button at the given time of the video (in seconds).
- `buttonEnd: ""`
Stops displaying button at the given time of the video (in seconds). Only used if buttonStart is defined.
- `highlights: [`</br>
            `{htmlElement:"div.a-container div h1", start: 7, end: 9},`</br>
            `{htmlElement:"div.my-titles div:nth-child(1) h2", start: 9, end: 11},`</br>
            `{htmlElement:"div.my-titles div:nth-child(2) h2", start: 11, end: 13},`</br>
            `{htmlElement:"#that-block", start: 17, end: 22}`</br>
            `]`      
Highlights an element of the page at the given time of the video (in seconds). Usefull if the presenter wants to draw attention to a specific feature of the page.


## Device & Browser support

The code has been tested on desktop, mobile devices and tablets (Firefox, chrome, Safari, IE 9.0).
Keep in mind that the support for transparent videos is not native on any of these platforms and that the script is based on a hack (use of canvas). Therefore you might encounter unexpected results depending on the context.

I don't offer support for this script. It is provided as it is.


## License

All the source code is licensed under the MIT License.
The demo videos however are copywrited material and should not be used in any way other than for testing purpose.
