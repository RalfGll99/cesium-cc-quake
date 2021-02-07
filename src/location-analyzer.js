
var closestQuakeEntity = undefined;

function LocationAnalyzer(options) {

}

function getClosestQuake(viewer, cartesian){
    //reset color if already highlighted
    if(closestQuakeEntity != undefined){        
        closestQuakeEntity.ent.ellipsoid.material = Cesium.Color.BLUE.withAlpha(0.3);
    }

    var entities = viewer.entities.values;
    var closestEntity = {ent: undefined, distance: Number.MAX_VALUE};

    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var d = Cesium.Cartesian3.distance(entity.position.getValue(), cartesian);

        console.log(closestEntity.distance)
        if(closestEntity.distance > d && d != 0 ){
            closestEntity.ent = entity;
            closestEntity.distance = d;
        }
    }
    return closestEntity;
}


LocationAnalyzer.prototype.getGeneralInformation = function (viewer, cartesian) {
    console.log("let me check that");

    //position info
    var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
    var longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(2);
    var latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(2);

    //calculate closest quake event
    closestQuakeEntity = getClosestQuake(viewer, cartesian);
    if(closestQuakeEntity.distance== Number.MAX_VALUE){
        var str = $( "#loca-info" ).first().html("No Quake found");
        return;
    }

    $( function() {
     
        var str = $( "#loca-info" ).first().html( 
            "Longitude: "+ longitudeString + "<br> "+
            "Latitude: " + latitudeString + "<br>" +
            "<h3>Closest Quake</h3>"+
            "<br> Distance: " + closestQuakeEntity.distance +
            "<br> Description: " + closestQuakeEntity.ent.name+
            "<br> Felt by: " + closestQuakeEntity.ent.properties.felt 
            );
  
      } );

      //highlight Closest Quake
      closestQuakeEntity.ent.ellipsoid.material = Cesium.Color.RED.withAlpha(0.3);
      //zoom to click and quake event
    //   var bb =new Cesium.AxisAlignedBoundingBox(cartesian, closestQuakeEntity.ent.position.getValue());
      const destination = Cesium.Rectangle.fromCartesianArray([cartesian, closestQuakeEntity.ent.position.getValue()]);
      viewer.camera.flyTo({
        destination,
      });
}

export default LocationAnalyzer;
