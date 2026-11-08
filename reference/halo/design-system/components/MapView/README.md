Points on a map: price pins for listings or bubbles for where orders come from. The map itself (tiles from MapLibre, Leaflet or Google, an SVG or an image) goes in `background`; Halo draws pins, popups, legend and controls on top in its own style.

Props: `points` ({id, label, sub, lat, lng, value, text (pin label), tint, pulse}), `bounds` ({n, s, w, e}; what the background shows), `background` (node), `bubbles` (size by value instead of pins), `selected` / `onSelect`, `renderPopup(point)`, `legend`, `controls`, `height`, `label`.

- With a real map library, pass its projection's bounds or render the pins through its overlay API with the same classes (`ha-map-pin`, `ha-map-pop`).
- Price pins show the short price; the popup carries the details.
