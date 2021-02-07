import LocationAnalyzer from "./location-analyzer.js"

var locationAnalyzer = new LocationAnalyzer({});

function ButtonHandler(options) {

}

var moveHandler = undefined;

function registerClickHandler(viewer){
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        if (cartesian) {
            locationAnalyzer.getGeneralInformation(viewer, cartesian);
            
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}


function startLocationHoverEffect(viewer){
// from Sandcastle
var scene = viewer.scene;
var entity = viewer.entities.add({
    label: {
      show: false,
      showBackground: true,
      font: "14px monospace",
      horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
      verticalOrigin: Cesium.VerticalOrigin.TOP,
      pixelOffset: new Cesium.Cartesian2(15, 0),
    },
  });
 // Mouse over the globe to see the cartographic position
 var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
 handler.setInputAction(function (movement) {
   var cartesian = viewer.camera.pickEllipsoid(
     movement.endPosition,
     scene.globe.ellipsoid
   );
   if (cartesian) {
     var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
     var longitudeString = Cesium.Math.toDegrees(
       cartographic.longitude
     ).toFixed(2);
     var latitudeString = Cesium.Math.toDegrees(
       cartographic.latitude
     ).toFixed(2);

     entity.position = cartesian;
     entity.label.show = true;
     entity.label.text =
       "Lon: " +
       ("   " + longitudeString).slice(-7) +
       "\u00B0" +
       "\nLat: " +
       ("   " + latitudeString).slice(-7) +
       "\u00B0";
   } else {
     entity.label.show = false;
   }
 }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

ButtonHandler.prototype.assessLocation = function (viewer) {
    console.log("assess Location");
    startLocationHoverEffect(viewer);
    registerClickHandler(viewer);
    //start hover effect
}


ButtonHandler.prototype.analyzeTopo = function () {
    console.log("analyze Topography");
}

export default ButtonHandler;
