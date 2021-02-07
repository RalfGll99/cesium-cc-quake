function DataHandler(options) {

}

DataHandler.prototype.clear = function (viewer) {
    viewer.dataSources.removeAll();
}

function visualizeAsSphere(viewer, entity) {
var mag = entity.properties.mag.getValue() *10000*4;
var ent = viewer.entities.add({
    name: entity.name,
    position: entity.position.getValue(),
    ellipsoid: {
      radii: new Cesium.Cartesian3(mag, mag, mag),
      maximumCone: Cesium.Math.PI_OVER_TWO,
      material: Cesium.Color.BLUE.withAlpha(0.3),
      outline: true,
    },
  });

  // todo does not work
  ent.properties = entity.properties;
}

// load data ... from sandcastle
DataHandler.prototype.loadQuakeData = function (viewer, path) {
    console.log("load quake data");
    var promise = Cesium.GeoJsonDataSource.load(path);

    promise.then(function (dataSource) {
        //Get the array of entities
        var entities = dataSource.entities.values;

        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            visualizeAsSphere(viewer, entity);         
       
        }
    }).otherwise(function (error) {
        //Display any errrors encountered while loading.
        window.alert(error);
    });
}

export default DataHandler;
