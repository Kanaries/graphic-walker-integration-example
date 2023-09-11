# How to use GeoJson / TopoJson in Graphic-Walker

## Init GraphicWalker

Add geojson config in GraphicWalker init

```
const geoList = [
        { name: 'World Countries', type: 'TopoJSON', url: 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json' },
        {
            name: 'World Cities',
            type: 'GeoJSON',
            url: 'https://raw.githubusercontent.com/drei01/geojson-world-cities/f2a988af4bc15463df55586afbbffbd3068b7218/cities.geojson',
        },
    ];
 <GraphicWalker {...} geoList={geoList} />
```

## Config

<img width="1162" alt="image" src="https://github.com/Kanaries/graphic-walker-integration-example/assets/19528375/14eb7bcd-19ab-45f6-847d-92a127733100">

<img width="1190" alt="image" src="https://github.com/Kanaries/graphic-walker-integration-example/assets/19528375/133d5383-0a98-4d38-8084-da535c27ac71">

