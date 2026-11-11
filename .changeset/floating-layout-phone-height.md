---
"@twentyfirstmedia/ui-core": patch
"@twentyfirstmedia/halo": patch
"@twentyfirstmedia/pro": patch
"@twentyfirstmedia/ui": patch
"@twentyfirstmedia/elements": patch
---

`FloatingLayout` on a phone keeps the height it is given: the stacked slot grid counts its padding into the inherited height (`box-sizing: border-box`). Before, the layout grew by twice the padding, and with a fixed height the bottom slot was cut off at the edge. Apps that worked around it with `.tf-floating-ui { box-sizing: border-box; }` can drop that rule.
