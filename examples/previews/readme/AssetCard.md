# AssetCard

A generated image or asset: its state (queued, generating, ready, failed), a watermark badge, the version
stepper "‹ 2/3 ›", "Make current", "Regenerate" with a prompt and download.

- `versions` are the asset's versions (`src`, `prompt`, `state`, `error`, `downloadHref`); `version` /
  `onVersionChange` control which one is shown (default the `current` one).
- `current` marks the version in use; `onMakeCurrent(index)` shows "Make current" on the others.
- `state` is a new generation's state and wins over the shown version's (the image area shimmers while
  generating, unless motion is reduced).
- `onRegenerate(prompt)` opens a prompt field prefilled with the version's prompt (⌘/Ctrl+Enter sends, Esc cancels).
- `watermark` (`true` or your text) puts a badge on the image; `meta` is the small line (size, cost).
