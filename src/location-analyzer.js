
var closestQuakeEntity = undefined;
var position = undefined;

function LocationAnalyzer(options) {
}

LocationAnalyzer.prototype.checkSlope = function(viewer){
    
    if(position != undefined && closestQuakeEntity != undefined){
        var cartoPos = Cesium.Cartographic.fromCartesian(position);
        //  check slope in distance of next kilometer in direction of quake
        var stepSize = 0.00089832 * 0.0174533; //10m steps
        var cartoPosArray = [];
        for (let index = -20; index < 20; index+=1) {

            for (let yindex = -10; yindex < 10; yindex+=1) {
                var newCarto = new Cesium.Cartographic();      
                newCarto.longitude = cartoPos.longitude + index * stepSize;
                newCarto.latitude = cartoPos.latitude + yindex * stepSize;
                cartoPosArray.push(newCarto);
            }
            cartoPosArray.push(cartoPos);
        }

        var terrainProvider = Cesium.createWorldTerrain();
      
        var promise = Cesium.sampleTerrainMostDetailed(terrainProvider, cartoPosArray);
        Cesium.when(promise, function(updatedPositions) {
            var pickPosHeight = updatedPositions[updatedPositions.length-1].height;
            const destination = Cesium.Rectangle.fromCartographicArray(updatedPositions);
            viewer.camera.flyTo({
                destination,
            });
            var heightDiff = 0;
            updatedPositions.forEach(newCarto => {
                var currentDiff = Math.abs(newCarto.height - pickPosHeight);
                if (heightDiff < currentDiff){
                    heightDiff = newCarto.height;
                }
                var newCart = Cesium.Cartographic.toCartesian(newCarto);
                var color = currentDiff > 50? Cesium.Color.RED : Cesium.Color.GREEN;
                var e = viewer.entities.add({
                    position: newCart,
                    point: {
                      color: color,
                      pixelSize: 15,
                      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                    }
                });
            });
            console.log(heightDiff);
            if(heightDiff >50){
                alert("Your position is loacated in a slopy area. If close to an earthquake area.. don't build here")
            }

        });
        
    }
}

function getClosestQuake(viewer, cartesian){
    //reset color if already highlighted
    if(closestQuakeEntity != undefined && closestQuakeEntity.ent.ellipsoid != undefined){        
        closestQuakeEntity.ent.ellipsoid.material = Cesium.Color.BLUE.withAlpha(0.3);
    }

    var entities = viewer.entities.values;
    var closestEntity = {ent: undefined, distance: Number.MAX_VALUE};

    for (var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        var d = Cesium.Cartesian3.distance(entity.position.getValue(), cartesian);

        if(closestEntity.distance > d && d != 0 ){
            closestEntity.ent = entity;
            closestEntity.distance = d;
        }
    }
    return closestEntity;
}




LocationAnalyzer.prototype.getGeneralInformation = function (viewer, cartesian) {
    position = cartesian;
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

    var mag = undefined;
    var felt = undefined;
    if (closestQuakeEntity.ent.properties != undefined){
        mag = closestQuakeEntity.ent.properties.mag;
        felt = closestQuakeEntity.ent.properties.felt;
        $( function() {
         
            var str = $( "#loca-info" ).first().html( 
                "Longitude: "+ longitudeString + "<br> "+
                "Latitude: " + latitudeString + "<br>" +
                "<b>Closest Quake</b>"+
                "<br> Magnitude: " + mag +
                "<br> Distance: " + closestQuakeEntity.distance.toFixed(2) + "m" + 
                "<br> Description: " + closestQuakeEntity.ent.name+
                "<br> Felt by: " + felt
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

}

export default LocationAnalyzer;
