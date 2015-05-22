# OSM_SchwarzplanBookmarklet
A bookmarklet downloading OSM maps as svg and reformatting them to a figure ground diagram.

##Build
The code needs to be transformed to a bookmarklet to be useful. Use [bookbu](https://github.com/ardcore/bookbu.js). 
Install it with  `npm install bookbu`, go to the repos folder via the terminal 
and type `bookbu.js svgToSchwarzplan.js` or  `bookbu.js svgToSchwarzplan.js html` to get an example page. 

##Inner workings

The script starts at the very bottom of the file. It checks some conditions. 
If they are met, it calls `makeRequest` which scraps the locations and zoom info and generates an AJAX request for the svg.

If the Request was successful, `processSVG` is called with the SVG as argument. It calls `deleteUnusedElement` (get rid of unused elements except paths), `setBackgroundColor` (sets backjground colors of rects to white) and 
 `changePaths` (which gets all paths, makes buildings black and deletes anything else).
 
 After this processing, it calls `download` which takes the svgs text, generates a link which contains the data of the file to download (HTML5 Magic stuff)
 
