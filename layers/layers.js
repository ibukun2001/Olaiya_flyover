baseLayers = [new ol.layer.Tile({
    type: 'base',
    title: 'MapQuest aerial',
    source: new ol.source.MapQuest({
        layer: 'sat'
    })
}), new ol.layer.Tile({
    type: 'base',
    title: 'ESRI world imagery',
    source: new ol.source.XYZ({
        attributions: [new ol.Attribution({
            html: ['Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community']
        })],
        url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    })
})];
var baseLayersGroup = new ol.layer.Group({
    'type': 'base',
    'title': 'Base maps',
    layers: baseLayers
});
var lyr_olaiyaroadsedit1 = new ol.layer.Vector({
    opacity: 1.0,
    source: new ol.source.Vector({
        features: new ol.format.GeoJSON().readFeatures(geojson_olaiyaroadsedit1)
    }),

    style: style_olaiyaroadsedit1,
    title: "olaiyaroadsEdit1",
    filters: [],
    timeInfo: null,
    isSelectable: true
});

lyr_olaiyaroadsedit1.setVisible(true);
var layersList = [lyr_olaiyaroadsedit1];
layersList.unshift(baseLayersGroup);