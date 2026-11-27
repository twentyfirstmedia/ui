# MailRulesEditor

Rules for incoming mail: if all (or any) of the conditions match (from, to, subject or text contains, doesn't contain, is, starts or ends with), then run the actions (move to a folder, archive, mark as read, star, forward, hand to an agent, delete). Each rule has a name and can be switched off. The value is a list of `MailRule`s; `onSave` adds a save button.
