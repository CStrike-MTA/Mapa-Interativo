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
        setupSidebar();

        window.layerPoliceMaverick = addLayer(rc, window.policeMaverick);
        window.layerMaverick = addLayer(rc, window.maverick);

        setupLayerControl(map, {
            'Police Mavericks': window.layerPoliceMaverick,
            'Mavericks': window.layerMaverick
        });

        return map;
    }

    function addTileLayer(map, rc) {
        L.tileLayer('./map_tiles/{z}/{x}/{y}.png', {
            noWrap: true,
            bounds: rc.getMaxBounds(),
            maxNativeZoom: rc.zoomLevel()
        }).addTo(map);
    }

    function setupSidebar() {
        const sidebar = L.control.sidebar({ container: 'sidebar' }).addTo(window.map);

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
                pane: `
                    <button onclick="toggleLayer('layerPoliceMaverick')">Police Maverick</button>
                    <button onclick="toggleLayer('layerMaverick')">Maverick</button>
                `,
            });
    }

    function setupLayerControl(map, layers) {
        L.control.layers({}, layers).addTo(map);
    }

    window.toggleLayer = function (layerName) {
        const layer = window[layerName];
        if (window.map.hasLayer(layer)) {
            window.map.removeLayer(layer);
        } else {
            layer.addTo(window.map);
        }
    }

    function addLayer(rc, geojsonData) {
        return L.geoJson(geojsonData, {
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
    }

    // Initialize the map
    initMap('map', [4096, 4096]);
}(window));
