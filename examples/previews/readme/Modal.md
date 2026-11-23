# Modal

A dialog over the page: icon, title, text, your content and the actions in its footer.

- Render it while open (`{open && <Modal …/>}`), or keep it mounted and pass `open`, so it can animate out.
- While open it traps focus: focus moves into it (an element marked `data-autofocus`, else the first
  text field, else the first focusable element), Tab and Shift+Tab stay inside, Escape calls `onClose`,
  and focus returns to the element that opened it. This also works when it is mounted closed and
  opened later through `open`.
- `inline` shows it in place, as part of a page or a demo, without the focus trap.

```tsx
const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Invite</Button>
<Modal open={open} onClose={() => setOpen(false)} title="Invite teammates"
  actions={[<Button key="send" onClick={send}>Send invites</Button>]}>
  <Input label="Email addresses" />
</Modal>
```
