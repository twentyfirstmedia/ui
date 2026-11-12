# QrCode

A QR code drawn as SVG and encoded on the device, so the text (a sign-in secret, an invite link)
never goes to a service.

- `value` is the text; `level` sets the error correction (L, M by default, Q, H).
- It fills its container's width, or `size`; the light quiet zone (`quiet`, default 4 modules) is
  part of the drawing.
- Dark modules on the paper colour in every theme, because scanners expect dark on light.
- `TwoFactorSetup` draws one from `qrValue` (the otpauth:// link).
