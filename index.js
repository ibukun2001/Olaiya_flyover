var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');
closer.onclick = function() {
    container.style.display = 'none';
    closer.blur();
    return false;
};

var overlayPopup = new ol.Overlay({
    element: container
});

var view = new ol.View({
    center: [0, 0],
    zoom: 7,
    maxZoom: 32,
    minZoom: 1,
    projection: 'EPSG:3857'
});

var pointZoom = 16;

var map = new ol.Map({
    controls: [
        new ol.control.ScaleLine({
            "minWidth": 64,
            "units": "metric"
        }),
        new ol.control.LayerSwitcher({
            "showZoomTo": false,
            "allowFiltering": true,
            "allowReordering": false,
            "showDownload": false,
            "showOpacity": false,
            "tipLabel": "Layers"
        }),
        new ol.control.Legend(),
        new ol.control.Geolocation(),
        new ol.control.MousePosition({
            "projection": "EPSG:4326",
            "undefinedHTML": "&nbsp;",
            "coordinateFormat": ol.coordinate.createStringXY(4)
        }),
        new ol.control.Zoom({
            "zoomInTipLabel": "Zoom in",
            "zoomOutLabel": "-",
            "zoomOutTipLabel": "Zoom out",
            "duration": 250,
            "zoomInLabel": "+",
            "delta": 1.2
        })
    ],
    target: document.getElementById('map'),
    renderer: 'canvas',
    overlays: [overlayPopup],
    layers: layersList,
    view: view
});

var originalExtent = [505840.895826, 868144.106868, 506226.259171, 868397.209707];
map.getView().fit(originalExtent, map.getSize());

var currentInteraction;

var ol3d = new olcs.OLCesium({
    map: map
});
var scene = ol3d.getCesiumScene();
var terrainProvider = new Cesium.CesiumTerrainProvider({
    url: '//cesiumjs.org/stk-terrain/tilesets/world/tiles'
});
scene.terrainProvider = terrainProvider;
map.addControl(new ol.control.CesiumControl(ol3d))

popupLayers = [`<b>Name</b>: [Name]<br><b>Type</b>: [Type]`];

var popupEventTriggered = function(evt) {
    var pixel = map.getEventPixel(evt.originalEvent);
    var coord = evt.coordinate;
    var popupTexts = [];
    var currentFeature;
    var allLayers = getAllNonBaseLayers();
    map.forEachFeatureAtPixel(pixel, function(feature, layer) {
        feature = decluster(feature);
        if (feature) {
            popupDef = popupLayers[allLayers.indexOf(layer)];
            if (popupDef) {
                var featureKeys = feature.getKeys();
                for (var i = 0; i < featureKeys.length; i++) {
                    if (featureKeys[i] != 'geometry') {
                        var value = feature.get(featureKeys[i]);
                        if (value) {
                            popupDef = popupDef.split("[" + featureKeys[i] + "]").join(
                                String(feature.get(featureKeys[i])))
                        } else {
                            popupDef = popupDef.split("[" + featureKeys[i] + "]").join("NULL")
                        }
                    }
                }
                popupTexts.push(popupDef);
            }
        }
    });

    var geojsonFormat = new ol.format.GeoJSON();
    var len = allLayers.length;
    for (var i = 0; i < len; i++) {
        var layer = allLayers[i];
        if (layer.getSource() instanceof ol.source.TileWMS) {
            var popupDef = popupLayers[allLayers.indexOf(layer)];
            if (popupDef == "#AllAttributes") {
                var url = layer.getSource().getGetFeatureInfoUrl(
                    evt.coordinate,
                    map.getView().getResolution(),
                    map.getView().getProjection(), {
                        'INFO_FORMAT': 'text/plain'
                    }
                );
                $.get(url, {}, function(data) {
                    popupTexts.push(data);
                });
            } else if (popupDef !== "") {
                var url = layer.getSource().getGetFeatureInfoUrl(
                    evt.coordinate,
                    map.getView().getResolution(),
                    map.getView().getProjection(), {
                        'INFO_FORMAT': 'application/json'
                    }
                );
                $.ajax({
                    url: url,
                    success: function(data) {
                        var features = geojsonFormat.readFeatures(data);
                        for (var f = 0; f < feature.length; f++) {
                            var feature = features[f];
                            var values = feature.getProperties();
                            for (var key in values) {
                                if (key != 'geometry') {
                                    var value = values[key];
                                    if (value) {
                                        popupDef = popupDef.split("[" + key + "]").join(
                                            String(value));
                                    } else {
                                        popupDef = popupDef.split("[" + key + "]").join("NULL");
                                    }
                                }
                            }
                            popupTexts.push(popupDef);
                        }
                    }
                });
            }
        }
    }
    if (popupTexts.length) {
        overlayPopup.setPosition(coord);
        content.innerHTML = popupTexts.join("<hr>");
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        closer.blur();
    }
};

map.on('singleclick', function(evt) {
    popupEventTriggered(evt);
});