$(document).ready(function() {

	var image = document.getElementById("processImage");
	var bufferCanvas = document.getElementById("buffer");
	var displayCanvas = document.getElementById("display");
	var buffer = bufferCanvas.getContext("2d");
	var display = displayCanvas.getContext("2d");

	// If the viewport is less than 530 then we reduce the size of content image.
	// TODO use thumbnail image in this case.
	var breakPoint = 531;
	var viewportWidth = window.innerWidth;
	if (viewportWidth < breakPoint) {
		image.width = 200;
		image.height = 200;
		//image.src = "../images/image1t.jpg";
		bufferCanvas.width = 200;
		bufferCanvas.height = 200;
		displayCanvas.width = 200;
		displayCanvas.height = 200;
	}

	display.drawImage(image, 0, 0, bufferCanvas.width, bufferCanvas.height);

	// With this variable, we will trace the filter function
	var filter = null;

	// switching the filster
	// western
	$("#filters li:first-child").bind('click', function() {
		switchFilter(westernFilter, $(this));
	});

	// noir
	$("#filters li:nth-child(2)").bind('click', function() {
		switchFilter(noirFilter, $(this));
	});

	// scifi
	$("#filters li:nth-child(3)").bind('click', function() {
		switchFilter(scifiFilter, $(this));
	});

	// cartoon
	$("#filters li:nth-child(4)").bind('click', function() {
		switchFilter(bwcartoon, $(this));
	});

	// normal
	$("#filters li:last-child").bind('click', function() {
		resetBgcolorLi();
		display.drawImage(image, 0, 0, bufferCanvas.width, bufferCanvas.height);
		$(this).attr("class", "used_filter");
		filter = null;
	});

	// switching images
	$("#thumbnails img:first-child").click(function() {
		switchImage(1);
	});

	$("#thumbnails img:nth-child(2)").click(function() {
		switchImage(2);
	});

	$("#thumbnails img:nth-child(3)").click(function() {
		switchImage(3);
	});

	/**
	 * Copy image to the buffer canvas and pass rgb information to the filter function
	 * @param filterFunction: The filter function that will be applied to the image
	 * 
	 * @returns nothing
	 */
	 function processImage(filterFunction) {
	 	buffer.drawImage(image, 0, 0, bufferCanvas.width, bufferCanvas.height);
	 	var frame = buffer.getImageData(0, 0, bufferCanvas.width, bufferCanvas.height);

	 	var length = frame.data.length / 4;
	 	for (var i = 0; i < length; i++) {
		    var r = frame.data[i * 4 + 0];
		    var g = frame.data[i * 4 + 1];
		    var b = frame.data[i * 4 + 2];

		    filterFunction(i, r, g, b, frame.data);

		}
		display.putImageData(frame, 0, 0);
	 }

	/**
	 * Clearing both canvas before switching images
	 */
	 function resetCanvas() {
	 	buffer.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
	 	display.clearRect(0, 0, displayCanvas.width, displayCanvas.height);
	 }

	/**
	 * This function will reset background color for the filter's li
	 */
	 function resetBgcolorLi() {
		$("nav#filters li").attr("class", "unused_filter");
	 }

	/**
	 * This function will switch the filter and apply to the current image
	 * It will also change the background color of the li element.
	 * 
	 * @param ftFunction: The filter function that will be used.
	 * @param liElement: Currently selected li element
	 */
	 function switchFilter(ftFunction, liElement) {
	 	resetBgcolorLi();
		processImage(ftFunction);
		liElement.attr("class", "used_filter");
		filter = ftFunction;
	 }

	/**
	 * This function will switch the image and use the current filter
	 * 
	 * @param imgNum: number of the image that will be displayed
	 */
	 function switchImage(imgNum) {
	 	resetCanvas();
		image.src = "../images/image" + imgNum + "c.jpg";

		image.onload = function() {
			if (filter == null) {
				display.drawImage(image, 0, 0, bufferCanvas.width, bufferCanvas.height);
			} else {
				processImage(filter);
			}
		}
	 }

	/**
	 * Different filter functions
	 */
	 var westernFilter = function(pos, r, g, b, data) {
	 	var brightness = (3*r + 4*g + b) >>> 3;
	    data[pos * 4 + 0] = brightness+40;
	    data[pos * 4 + 1] = brightness+20;
	    data[pos * 4 + 2] = brightness-20;
	 }

	 var noirFilter = function(pos, r, g, b, data) {
	 	var brightness = (3*r + 4*g + b) >>> 3;
	    if (brightness < 0) brightness = 0;
	    data[pos * 4 + 0] = brightness;
	    data[pos * 4 + 1] = brightness;
	    data[pos * 4 + 2] = brightness;
	 }

	 var scifiFilter = function(pos, r, g, b, data) {
	 	var offset =  pos * 4;
	    data[offset] = Math.round(255 - r) ;
	    data[offset+1] = Math.round(255 - g) ;
	    data[offset+2] = Math.round(255 - b) ;
	 }

	 var bwcartoon = function(pos, r, g, b, data) {
	    var offset =  pos * 4;
	    if( data[offset] < 120 ) {
	        data[offset] = 80;
	        data[++offset] = 80;
	        data[++offset] = 80;
	    } else {
	        data[offset] = 255;
	        data[++offset] = 255;
	        data[++offset] = 255;
	    }
	    data[++offset] = 255;
	    ++offset;
	 }

});