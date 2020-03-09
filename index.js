mapboxgl.accessToken = 'pk.eyJ1IjoidHFtIiwiYSI6ImNrNTg4dTB3MTBjMnYzbm15OG5kbG9kdm0ifQ.nKjtxAoUjFg0TGiCbYaHfA';
var map = new mapboxgl.Map({
  container: 'map', //container id in HTML
  style: 'mapbox://styles/tqm/ck76a7as10eof1ipcvyvy67w6', //stylesheet location
  center: [-79.3753, 43.69999], // starting point, longitude/latitude
  zoom: 11 // starting zoom level
});

map.on('load', () => {

  map.addSource('popTor', {
    'type': 'vector',
    'url': 'mapbox://tqm.try-tiles'
  });

  map.addSource('denseTor', {
    'type': 'vector',
    'url': 'mapbox://tqm.hello-toronto-density'
  });

  map.addLayer({
    'id': 'pop',
    'type': 'fill',
    'source': 'popTor',
    'layout': {
      'visibility': 'visible'
    },
    'paint': {
      "fill-color": [
        'interpolate',
        ['linear'],
        ['to-number', ['get', 'EUhg3n3MSze_data_COL1'], 0], // get a number, but if provided with a non-number default to 0
        0, '#edf8fb',
        423, '#b2e2e2',
        508, '#66c2a4',
        609, '#2ca25f',
        888, '#006d2c'
      ],
      "fill-opacity": 0.8,
      "fill-outline-color": 'black'
    },
    'source-layer': 'hello_world'
  });

  map.addLayer({
    'id': 'dense',
    'type': 'fill',
    'source': 'denseTor',
    'layout': {
      'visibility': 'none'
    },
    "paint": {
      "fill-color": [
        'interpolate',
      ['linear'],
      ['to-number', ['get', 'popDensityToronto_data_COL1'], 0],
      0, '#edf8fb',
      3213, '#b2e2e2',
      4929, '#66c2a4',
      7451, '#2ca25f',
      11170, '#006d2c'
      ],
      'fill-opacity': 0.8,
      'fill-outline-color': 'black'
    },
    'source-layer': 'hello-toronto-density'
  });


  map.on('click', 'pop', function(e){
    var features = map.queryRenderedFeatures(e.point);
    // console.log(features[0].geometry.coordinates[0])

    let shorty = e.features[0].properties
    let poly = turf.polygon([features[0].geometry.coordinates[0]])
    let area = turf.area(poly).toFixed(2)
    let areakm = (area / 1000000).toFixed(2)
    let popDense = shorty.EUhg3n3MSze_data_COL1 / (area / 1000000)
    let popDensity = (popDense).toFixed(1)
    let link =
    console.log(popDensity)
    new mapboxgl.Popup()
      .setLngLat(e.lngLat)
      .setHTML('<h1>Population of Dissemation Areas</h1><br/>' + '<strong>Dissemation Area ID: </strong>' + shorty.DAUID + ' <br/> ' + '<strong>Population: </strong>'+ shorty.EUhg3n3MSze_data_COL1 + ' <br/> ' + '<strong>Area</strong>: ' + areakm + ' km2 <br/> <strong>Population Density: </strong>' + popDensity + ' people/km2<br/><strong>Link: </strong>' + '<a href=http://google.ca>Google</a>')
      .addTo(map);
  });

  map.on('mouseenter', 'pop', function() {
    map.getCanvas().style.cursor = 'pointer';
  });

  map.on('mouseleave', 'pop', function() {
    map.getCanvas().style.cursor = '';
  });

});

map.on('style-load', ()=> {
  let popMapIsVisible = true

  let visibleMap = document.getElementsByClassName('menu')
  let popMap = visibleMap[0].id;
  let denseMap = visibleMap[1].id;

  console.log(visibleMap)
  console.log(visibleMap[0].checked)
  console.log(visibleMap[1].checked)

  if (popMap.checked) {
    // let selectedLayer = popMap;
    // console.log(selectedLayer)
    map.setLayoutProperty(popMap, 'visibility', 'visible')
  } else {
    // selectedLayer = visibleMap[1].id;
    map.setLayoutProperty(denseMap, 'visibility', 'visible')
    map.setLayoutProperty(popMap, 'visibility', 'none')
  }
});


let toggleableLayerIds = ['pop', 'dense'];

for (let i=0; i<toggleableLayerIds.length; i++) {
  let id = toggleableLayerIds[i];
  // console.log(id)

  let link = document.createElement('a');
  link.href = '#';
  link.className = 'active';
  link.textContent = id;
  // console.log(link)
  console.log(link.textContent)

  link.onclick = function(e) {
    let clickedLayer = this.textContent;
    // console.log(clickedLayer)
    e.preventDefault();
    e.stopPropagation();

    let visibility = map.getLayoutProperty(clickedLayer, 'visibility');
    // let invisibility = map.getLayoutProperty(clickedLayer, 'none')
    // console.log(visibility)

    if (visibility === 'visible') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      this.className = "";
    } else {
      this.className = 'active';
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');
    }
  };

  let layers = document.getElementById('menu');
  layers.appendChild(link);
};

// map.addControl(new mapboxgl.NavigationControl());
