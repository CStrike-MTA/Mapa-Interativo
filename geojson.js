(function (window) {
    let policeMaverickCoords = [
        [3116.3642578125, 3175.4677734375],
        [901.5175833, 1566.506458],
        [3622.408833, 342.7965]
    ]

    let mavericksCoords = [
        [1046.202583, 3895.0335],
        [1011.637417, 1829.566583],
        [928.9110833, 126.7833333],
        [3835.618833, 190.49],
        [3566.041, 2957.087917]
    ]

    window.policeMaverick = policeMaverickCoords.map(coords => ({
        type: "Feature",
        properties: {
            name: "Police Maverick"
        },
        geometry: {
            type: "Point",
            coordinates: coords
        }
    }))

    window.maverick = mavericksCoords.map(coords => ({
        type: "Feature",
        properties: {
            name: "Maverick"
        },
        geometry: {
            type: "Point",
            coordinates: coords
        }
    }))

}(window))
