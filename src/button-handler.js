import LocationAnalyzer from "./location-analyzer.js"

var locationAnalyzer = new LocationAnalyzer({});
var entity ;
var locacheck = false;
function ButtonHandler(options) {

}



function registerClickHandler(viewer){
    var handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    handler.setInputAction(function (click) {
        var cartesian = viewer.camera.pickEllipsoid(click.position, viewer.scene.globe.ellipsoid);
        if (locacheck && cartesian) {
            locationAnalyzer.getGeneralInformation(viewer, cartesian);
            //reset handler
            entity.label.show = false;
            locacheck = false;
        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function startLocationHoverEffect(viewer){
    entity.label.show = true;

}


ButtonHandler.prototype.setLocationHoverEffect = function(viewer){
    entity = viewer.entities.add({
        label: {
          show: false,
          showBackground: true,
          font: "14px monospace",
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.TOP,
          pixelOffset: new Cesium.Cartesian2(15, 0),
          zIndex: 9999
        },
      });
    // from Sandcastle
    var scene = viewer.scene;

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



ButtonHandler.prototype.colorEllipsoides = function (viewer, type) {
    var entities = viewer.entities.values;

    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        if(entity != undefined && entity.ellipsoid != undefined){    
            var mag  = entity.properties.mag != undefined ? entity.properties.mag : -10;
            var felt  = entity.properties.felt != undefined ? entity.properties.felt : -10;
            
            if(type == "felt"){
                if( felt >150)
                    entity.ellipsoid.material = Cesium.Color.RED.withAlpha(0.3);
                else if (felt >50)
                    entity.ellipsoid.material = Cesium.Color.YELLOW.withAlpha(0.3);
                else 
                    entity.ellipsoid.material = Cesium.Color.GREEN.withAlpha(0.3);
            }
            else if (type == "mag"){
                if( mag >6)
                    entity.ellipsoid.material = Cesium.Color.RED.withAlpha(0.3);
                else if (mag <3)
                    entity.ellipsoid.material = Cesium.Color.YELLOW.withAlpha(0.3);
                else 
                    entity.ellipsoid.material = Cesium.Color.GREEN.withAlpha(0.3);

            }
            else 
                entity.ellipsoid.material = Cesium.Color.BLUE.withAlpha(0.3);

        }
        
    }
}

ButtonHandler.prototype.assessLocation = function (viewer) {
    console.log("assess Location");
    startLocationHoverEffect(viewer);
    registerClickHandler(viewer);
    locacheck =true;
}


ButtonHandler.prototype.analyzeTopo = function () {
    console.log("analyze Topography");
}

export default ButtonHandler;
