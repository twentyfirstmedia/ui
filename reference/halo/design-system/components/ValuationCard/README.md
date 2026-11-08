Real-estate figures: `ValuationCard` (estimate with range and asking price), `SavedSearch` (a search that runs on its own and reports new hits) and `EnergyClass` (the energy label scale).

ValuationCard: `value`, `low`, `high`, `asking`, `perSqm`, `compare`, `currency`, `confidence` (0–1) or `confidenceLabel`, `facts` (KeyValue items), `note`, `title`, `action`.
SavedSearch: `name`, `criteria` (strings), `lastRun`, `frequency`, `newCount`, `enabled` + `onToggle`, `onEdit`, `onOpen`, `openLabel`, `icon`, `tint`.
EnergyClass: `value`, `kwh`, `kind`, `scale` (default A+…H).
