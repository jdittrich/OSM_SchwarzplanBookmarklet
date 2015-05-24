var makeRequest = function(){
	var mapnik_minlon = document.querySelector("#mapnik_minlon").getAttribute("value");
	var mapnik_minlat = document.querySelector("#mapnik_minlat").getAttribute("value");
	var mapnik_maxlon = document.querySelector("#mapnik_maxlon").getAttribute("value");
	var mapnik_maxlat = document.querySelector("#mapnik_maxlat").getAttribute("value");
	var mapnik_scale  = document.querySelector("#mapnik_scale").value;
	var indicator = null;

	$.ajax({
		url: "http://render.openstreetmap.org/cgi-bin/export"+"?"+"bbox="+mapnik_minlon+","+mapnik_minlat+","+mapnik_maxlon+","+mapnik_maxlat+"&scale="+mapnik_scale+"&format=svg",
		method:"GET",
		dataType:"XML",
		xhr: function()
		{
			var xhr = new window.XMLHttpRequest();
			indicator = $('<div style="position: fixed; top: 50%; left: 50%; z-index: 9999; font-size: 5em; width: 14em; margin-left: -7em; background: rgba(255, 255, 255, 0.5); padding: 0.2em; text-align: center;">bitte warten…</div>').appendTo("body");

			xhr.addEventListener("progress", function(evt){
			if (evt.lengthComputable) {
				var percentComplete = evt.loaded / evt.total;
				//Do something with download progress
				indicator.text(Math.ceil(percentComplete*100)+"%");
			}
			}, false);
			return xhr;
		}
	})
	.done(processSVG)
	.fail(function(qXHR, textStatus, errorThrown){
		alert("sorry, something went wrong!. Check if you got web connection and try again later");
	})
	.always(function(){
		indicator.remove();
	});
};





var processSVG = function(data){
	deleteUnusedElement(data);
	setBackgroundColor(data);
	changePaths(data);
	download("schwarzplan.svg",new XMLSerializer().serializeToString(data));
};

var checkIsBuilding = function(element){
	//checks if the element is a building
	if(!(element instanceof SVGElement)){return undefined;}
	var isBuilding = false;

	var buildingcolors= ["fill:rgb(85.098039%,81.568627%,78.823529%)","fill:(81.960784%,77.647059%,74.117647%)"];
	buildingcolors.forEach(function(color, index, array){
		if((element.getAttribute("style")).indexOf(color) !== -1){
			isBuilding = true;
		}
	});
	return isBuilding;
};


var deleteUnusedElement = function(svgdocument){
//delete defs and other non-path types
	var defs = svgdocument.querySelector("defs");
	var use = svgdocument.querySelectorAll("use");
	if(defs){
		defs.parentNode.removeChild(defs);
	}

	for(var i=0; i< use.length; i++){
		use[i].parentNode.removeChild(use[i]);
	}
};

var setBackgroundColor = function(svgdocument){
	//colors the rect in the background
	var rects = svgdocument.querySelectorAll("rect");
	for(var i=0; i< rects.length; i++){
			rects[i].style.fill="rgb(255,255,255)";
	}
};


var changePaths = function(svgdocument){
	var paths= svgdocument.querySelectorAll("path");

	for(var i=0; i<paths.length;i++){
		var currentElement = paths[i];
		if(!(currentElement instanceof SVGElement)){
			continue;
		}
		if(checkIsBuilding(currentElement)){
			currentElement.style.fill="rgb(0%,0%,0%)";
			currentElement.style.strokeWidth = "0";
		} else {
			currentElement.parentNode.removeChild(currentElement);
		}
	}
};

//http://stackoverflow.com/questions/2897619/using-html5-javascript-to-generate-and-save-a-file
var download = function (filename, text){
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(text));
		pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    }
    else {
        pom.click();
    }
};

if(window.location.href.indexOf("openstreetmap.org") == -1){
	if(confirm("you seem to be not on openstreetmap.org. The Downloader works only there!\n Shall I open openstreetmap?")){
		window.location.href="http://www.openstreetmap.org/";
	}
} else if(confirm("This will download the current view as a Figure-ground diagram. \n The view can be further cut by choosing setting custom dimensions in the share dialog (do NOT press download there).  \n It only works in Openstreetmap on the Standard Layer (right toolbar, ›Layers‹). \n The maps are under Creativecommons BY-SA license. Please consider contributing or donating to openstreetmap.")){
	makeRequest();
}
