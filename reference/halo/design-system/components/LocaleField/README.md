Content in several languages and switching context: `LocaleField`, `LocaleSwitcher`, `WorkspaceSwitcher`.

LocaleField: `label`, `locales` ({code, label, flag}), `value` / `defaultValue` ({[code]: text}) + `onChange`, `source` (language others copy from; default the first), `active`, `multiline`, `rows`, `onTranslate(text, to)` (return or resolve the translation), `hint`, `error`. Missing languages carry a warn diamond; empty fields show the source text as placeholder.
LocaleSwitcher: `languages` ({code, label, short, flag}), `language` / `onLanguage`, `currencies`, `currency` / `onCurrency`, `variant` ("frame" for the dark top bar).
WorkspaceSwitcher: `items` ({id, name, sub, tint, logo}), `value` / `onChange`, `label`, `footer`, `variant` ("frame").
