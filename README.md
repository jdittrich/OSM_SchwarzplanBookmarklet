# OSM_SchwarzplanBookmarklet

A [bookmarklet](https://support.mozilla.org/en-US/kb/bookmarklets-perform-common-web-page-tasks) downloading [OSM](http://de.wikipedia.org/wiki/OpenStreetMap) maps as svg and reformatting them to a [figure ground diagram](http://en.wikipedia.org/wiki/Figure-ground_diagram).

## Build

The code needs to be transformed to a bookmarklet to be useful. Use [bookbu](https://github.com/ardcore/bookbu.js) for this. Install bookbu with  `npm install bookbu` on the command line. Go to the folder the `svgToSchwarzplan.js` is in and type `bookbu.js svgToSchwarzplan.js`. This will generate the bookmarklet code. If you type `bookbu.js svgToSchwarzplan.js html` bookbu will generate an additional example html-page with a drag-ready bookmakrlet link. 

## Inner workings

The script starts at the very bottom of the file. It checks some conditions. 
If they are met, it calls `makeRequest` which scraps the locations and zoom info and generates an AJAX request for the svg.

If the Request was successful, `processSVG` is called with the SVG as argument. It calls `deleteUnusedElement` (get rid of unused elements except paths), `setBackgroundColor` (sets background colors of rects to white) and 
 `changePaths` (which gets all paths, makes buildings black and deletes anything else). The buildings are recognized by color (I could find no semantical way to do this).
 
After this processing, it calls `download` which takes the svg’s markup-text and generates a link which contains the data of the svg file to download ([HTML5 Magic stuff](http://stackoverflow.com/a/18197511/263398)).
 
