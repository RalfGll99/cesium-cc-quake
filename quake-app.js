import DataHandler from "./src/data-handler.js";
import ButtonHandler from "./src/button-handler.js";

var dataHandler = new DataHandler();
var buttonHandler = new ButtonHandler();


function main() {

$( function() {
  
    $( "#accordion" ).accordion();
  
    $( "#a" ).click( function( event ) {
        // buttonHandler.analyzeTopo();
        buttonHandler.assessLocation(viewer);
    } );

    $( "#color-mag" ).click( function( event ) {
      buttonHandler.colorEllipsoides(viewer, "mag");      
    } );
    $( "#color-reports" ).click( function( event ) {
      buttonHandler.colorEllipsoides(viewer, "felt");      
    } );
    $( "#color-standard" ).click( function( event ) {
      buttonHandler.colorEllipsoides(viewer, "");      
    } );
    $( "#check-slope" ).click( function( event ) {
      buttonHandler.checkSlope(viewer, "");      
    } );
    

  } );

    //setting of variables
    var viewer = new Cesium.Viewer("cesiumContainer", {
          terrainProvider: new Cesium.CesiumTerrainProvider({
        url: Cesium.IonResource.fromAssetId(1),
      }),
    });
    buttonHandler.setLocationHoverEffect(viewer);

    dataHandler.loadQuakeData(viewer, "./data/quake.json");
  

}

main();