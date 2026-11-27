# RecipientInput

Address chips for To, Cc and Bcc. Type and press Enter, comma or Tab; pick from `suggestions` (or `suggest`, asked while typing) with the arrow keys; paste several addresses at once (`a@x.com, Bo Lee <bo@y.com>`). Invalid addresses stay as red chips with a message, Backspace in the empty field removes the last chip. The value is a list of `{ address, name? }`; `parseRecipients` and `isEmailAddress` are exported too.
