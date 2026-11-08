# SecretField
Shows a stored credential without exposing it: API keys, SMTP passwords, webhook secrets.

Masked by default in mono (`sk_live_••••••••4f2a`, last four visible), with Reveal (re-authenticates first for Infrastruktur and Geld secrets), Copy, and Rotate. Shows when it was set and by whom. Agents never see these values; the field only exists in the Cockpit.
