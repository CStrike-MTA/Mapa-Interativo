(function (window) {
    function initMap(mapid, img, minZoom = 1.25, maxZoom = 4) {
        const map = L.map(mapid, {
            crs: L.CRS.Simple,
            minZoom,
            maxZoom
        });
        window.map = map;
        const rc = new L.RasterCoords(map, img);
        map.setView(rc.unproject([img[0] / 2, img[1] / 2]), 2);

        addTileLayer(map, rc);
        setupSidebar(map);
        addAllLayers(rc);

        const layers = Object.values(window.layers); // Use the dynamically added layers
        setupLayerControl(map, layers);

        return map;
    }

    function addTileLayer(map, rc) {
        L.tileLayer('./map_tiles/{z}/{x}/{y}.png', {
            noWrap: true,
            bounds: rc.getMaxBounds(),
            maxNativeZoom: rc.zoomLevel()
        }).addTo(map);
    }

    function setupSidebar(map) {
        const sidebar = L.control.sidebar({ container: 'sidebar' }).addTo(map);

        sidebar
            .addPanel({
                id: 'js-api',
                tab: '<i class="fa fa-gear"></i>',
                title: 'Cstrike',
                pane: 'Mapa interativo Cstrike',
            })
            .addPanel({
                id: 'carros',
                tab: '<i class="fa-solid fa-car"></i>',
                title: 'Veiculos',
                pane: `<div class="div-dos-botao">${generateSidebarContent()}<div/>`,
            });
    }

    function generateSidebarContent() {
        return Object.keys(window.coordsData).map(key =>
            `<button class="botoes-dessa-bomba" onclick="toggleLayer('layer${key.charAt(0).toUpperCase() + key.slice(1)}')">${window.coordsData[key].name}</button>`
        ).join('');
    }

    function setupLayerControl(map, layers) {
        L.control.layers({}, layers).addTo(map);
    }

    function toggleLayer(layerName) {
        const layer = window.layers[layerName];
        if (window.map.hasLayer(layer)) {
            window.map.removeLayer(layer);
        } else {
            layer.addTo(window.map);
        }
    }

    function addLayer(rc, geojsonData, layerName) {
        const layer = L.geoJson(geojsonData, {
            coordsToLatLng: function (coords) {
                return rc.unproject(coords);
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties && feature.properties.name) {
                    layer.bindPopup(feature.properties.name);
                }
            },
            pointToLayer: function (feature, latlng) {
                return L.marker(latlng, {});
            }
        });
        window.layers = window.layers || {};
        window.layers[layerName] = layer;
        return layer;
    }

    function addAllLayers(rc) {
        Object.keys(window.coordsData).forEach(key => {
            const layerName = `layer${key.charAt(0).toUpperCase() + key.slice(1)}`;
            addLayer(rc, createGeoJsonData(window.coordsData[key].coords, window.coordsData[key].name), layerName);
        });
    }

    function createGeoJsonData(coordsArray, name) {
        return coordsArray.map(coords => ({
            type: "Feature",
            properties: { name },
            geometry: {
                type: "Point",
                coordinates: coords
            }
        }));
    }

    // Initialize the map
    initMap('map', [4096, 4096]);
    window.toggleLayer = toggleLayer;
}(window));
