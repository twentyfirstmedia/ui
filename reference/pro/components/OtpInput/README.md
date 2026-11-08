# OtpInput
Six-digit code entry for TOTP login, re-authentication before critical actions, and device pairing.

Six 40×48 cells in Geist Mono 20px, a gap after the third. Pasting a code fills all cells; typing advances; Backspace goes back. `inputmode="numeric"`, `autocomplete="one-time-code"`. On error all cells get a `danger` border and the hint says what to do.
