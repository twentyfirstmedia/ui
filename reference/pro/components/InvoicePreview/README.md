# InvoicePreview
Live preview of an outgoing invoice on paper (`paper` / `paper-ink`, white in both themes) beside its form.

Shows exactly what the PDF/E-Rechnung will contain: sender company block, recipient, invoice number from the company's sequence (mono), dates, line items, net/VAT/gross, payment terms, mandatory company details in the footer. Status above the paper: Entwurf, Freigabe nötig (agent-created), Versendet, Bezahlt, Storniert. Issued invoices are immutable; changes create a cancellation (Storno) and a new number.
