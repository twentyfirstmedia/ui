# MapScreen

A city map with glass controls floating over it: search and filters on top, map layers on the start side, the selected place with directions on the end side, zoom buttons and a dock.

- Built from `FloatingLayout` and `MapView`; the map is drawn from the kit's colours, so it follows the kit and the theme. Put your own map (MapLibre, Mapbox, Cesium, three.js) into `background` instead.
- Everything floating is glass: translucent, blurred and readable over any backdrop.
