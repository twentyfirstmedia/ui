Product tile for catalogs and grids, plus the pieces it is made of: `Price`, `Rating`, `StockBadge` and `ProductArt`.

ProductCard props: `name`, `meta`, `art` + `tint` (or swap in your own image inside `.ha-product-media`), `price`, `compareAt`, `rating`, `reviews`, `badge` + `badgeTone`, `stock`, `wished` + `onWish`, `added` + `onAdd`, `onClick`.
Price: `value`, `compareAt` (shows the struck price and −%), `size` ("lg"), `currency`, `showSave`. Rating: `value`, `count`, `size`. StockBadge: `stock`, `low` (10), `compact`. ProductArt: `kind` (tee, mug, bottle, cap, tote, sneaker, watch, lamp), `tint`, `size`.

- One badge per card at most (Bestseller, New, Sold out). Sale is shown by the price, not a badge.
- Quick-add only for products without variants; otherwise open the product page.
- Low stock is a warning badge with the number left; out of stock disables add.
