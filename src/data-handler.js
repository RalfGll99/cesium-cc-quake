function DataHandler(options) {

}

DataHandler.prototype.loadQuakeData = function (viewer, path) {
    console.log("load quake data");
    //from sandcastle
    Cesium.Math.setRandomNumberSeed(0);

    var promise = Cesium.GeoJsonDataSource.load(
        "./data/quake.json"
    );
    promise
        .then(function (dataSource) {
        viewer.dataSources.add(dataSource);

        //Get the array of entities
        var entities = dataSource.entities.values;

        var colorHash = {};
        for (var i = 0; i < entities.length; i++) {
            //For each entity, create a random color based on the state name.
            //Some states have multiple entities, so we store the color in a
            //hash so that we use the same color for the entire state.
            var entity = entities[i];
            var name = entity.name;
            var color = colorHash[name];
            if (!color) {
            color = Cesium.Color.fromRandom({
                alpha: 1.0,
            });
            colorHash[name] = color;
            }

            //Set the polygon material to our random color.
            entity.polygon.material = color;
            //Remove the outlines.
            entity.polygon.outline = false;

            //Extrude the polygon based on the state's population.  Each entity
            //stores the properties for the GeoJSON feature it was created from
            //Since the population is a huge number, we divide by 50.
            entity.polygon.extrudedHeight =
            entity.properties.Population / 50.0;
        }
        })
        .otherwise(function (error) {
        //Display any errrors encountered while loading.
        window.alert(error);
        });
}

export default DataHandler;
