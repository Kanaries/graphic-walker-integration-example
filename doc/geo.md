# How to use GeoJson / TopoJson in Graphic-Walker

## Init GraphicWalker

Add geojson config in GraphicWalker init

These are pre-defined geojson files we provide, but you can also use your own configured ones.

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

Swtich to geo

<img width="1162" alt="image" src="https://github.com/Kanaries/graphic-walker-integration-example/assets/19528375/14eb7bcd-19ab-45f6-847d-92a127733100">

<img width="1190" alt="image" src="https://github.com/Kanaries/graphic-walker-integration-example/assets/19528375/133d5383-0a98-4d38-8084-da535c27ac71">

If your country code and geojson mapping is correct, it should render successfully.

<img width="945" alt="image" src="https://github.com/Kanaries/graphic-walker-integration-example/assets/19528375/84d1909c-9a52-4a58-9596-f5ac07448ff2">


