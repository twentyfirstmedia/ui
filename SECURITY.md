# Security

## Supported versions

Security fixes go into the latest release of `@twentyfirstmedia/ui-core`, `@twentyfirstmedia/halo`, `@twentyfirstmedia/pro` and `@twentyfirstmedia/ui`. All four are versioned together.

## Reporting a vulnerability

Please do not open a public issue. Report it privately instead:

- through GitHub: **Security → Report a vulnerability** on [twentyfirstmedia/ui](https://github.com/twentyfirstmedia/ui/security/advisories/new), or
- by email to **hello@twentyfirst.media** with "Security" in the subject.

Include what you found, how to reproduce it and the affected versions. We confirm within three working days and keep you updated until a fix is released. We are happy to credit you in the release notes.

## Scope

The components render in the browser and make no network requests of their own; the MCP server runs locally over stdio and reads only its bundled docs. Reports about cross-site scripting through component props (for example `RichText`, `EmailPreview`, `CodeBlock`) or about the CLI writing outside the project directory are especially welcome.
