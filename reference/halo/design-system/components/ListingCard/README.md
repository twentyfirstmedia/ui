Property listings from portals or your own stock: `ListingCard` (grid card or list row) and `ResultsToolbar` (count, selection, bulk actions, sort, view).

ListingCard: `listing` ({id, title, price (null = on request), rent, currency, pricePerSqm, area, rooms, place, image, photos, source, seller ("private" | "agent"), sellerLabel, phone, isNew, age, status, wished}), `layout` ("card" | "row"), `selected` + `onSelect`, `onWish`, `statusOptions` + `onStatus` (StatusSelect), `onOpen`.
ResultsToolbar: `title`, `total`, `meta`, `selected`, `onSelectAll(all)`, `bulkActions` ({label, icon, variant, busy, busyLabel, onClick}; shown while something is selected), `sortOptions` + `sort` + `onSort`, `views` ("grid" | "list" | "map") + `view` + `onView`.

- Area in m², money and counts follow `Halo.setLocale`.
