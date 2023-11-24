var textStyleCache_olaiyaroadsedit1 = {}
var clusterStyleCache_olaiyaroadsedit1 = {}
var selectedClusterStyleCache_olaiyaroadsedit1 = {}
var style_olaiyaroadsedit1 = function(feature, resolution) {

    if (feature.hide === true) {
        return null;
    }


    var value = ""
    var style = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(0,0,0,1.0)",
            lineDash: null,
            width: 5
        })
    }), new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(0,0,0,1.0)",
            lineDash: null,
            width: 4
        })
    })];
    var selectionStyle = [new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(255, 204, 0, 1)",
            lineDash: null,
            width: 5
        })
    }), new ol.style.Style({
        stroke: new ol.style.Stroke({
            color: "rgba(255, 204, 0, 1)",
            lineDash: null,
            width: 4
        })
    })];
    var labelText = feature.get("Name");
    var key = value + "_" + labelText

    if (!textStyleCache_olaiyaroadsedit1[key]) {
        var text = new ol.style.Text({
            font: '16.5px Calibri,sans-serif',
            text: labelText,
            fill: new ol.style.Fill({
                color: "rgba(0, 0, 0, 255)"
            }),
        });
        textStyleCache_olaiyaroadsedit1[key] = new ol.style.Style({
            "text": text
        });
    }
    var allStyles = [textStyleCache_olaiyaroadsedit1[key]];
    var selected = lyr_olaiyaroadsedit1.selectedFeatures;
    if (selected && selected.indexOf(feature) != -1) {
        allStyles.push.apply(allStyles, selectionStyle);
    } else {
        allStyles.push.apply(allStyles, style);
    }
    return allStyles;
};