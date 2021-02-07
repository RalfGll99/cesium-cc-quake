import DataHandler from "./src/data-handler.js";

var dataHandler = new DataHandler();


function main() {
$( function() {
    $( "button, input, a" ).click( function( event ) {
        buttonHandler.analyzeTopo();
    } );
  } );

    //setting of variables
    var viewer = new Cesium.Viewer('cesiumContainer', {
        // terrainProvider: Cesium.createWorldTerrain()
    });

    dataHandler.loadQuakeData(viewer, "");
  

}

main();