# ConnectionCard
A connected account or service: OAuth apps, API keys, external MCP servers, mail providers, banks.

Row with the service's Simple Icon, name, what it is used for and by how many agents, status (Verbunden, Läuft ab, Fehler) and one action (Verbinden, Erneuern, Verwalten). Grouped in a HairlineGrid on the Verbindungen page. Connecting always happens here (OAuth flow or SecretField), never in chat; the Main Brain can only request a connection, which shows as a signal row "Angefragt vom Main Brain".
