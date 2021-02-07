import DataHandler from "./src/data-handler.js";
import ButtonHandler from "./src/button-handler.js";

var dataHandler = new DataHandler();
var buttonHandler = new ButtonHandler();


function main() {

$( function() {
  
    $( "#accordion" ).accordion();
  
    $( "button, input, a" ).click( function( event ) {
        // buttonHandler.analyzeTopo();
        buttonHandler.assessLocation(viewer);
    } );
  } );

    //setting of variables
    var viewer = new Cesium.Viewer('cesiumContainer', {
        // terrainProvider: Cesium.createWorldTerrain()
    });

    dataHandler.loadQuakeData(viewer, "./data/quake.json");
  

}

main();