import { Button, Combobox, Icon, Popover, Tooltip } from "@twentyfirstmedia/ui-core";

function App() {
  return (
    <div
      className="tf-panel"
      style={{
        gap: 40,
        paddingTop: 56,
      }}
    >
      <div
        className="tf-row"
        style={{
          gap: 16,
        }}
      >
        <Tooltip label="Archive" shortcut="E">
          <button type="button" className="tf-iconbtn tf-iconbtn-soft" aria-label="Archive">
            <Icon name="inbox" />
          </button>
        </Tooltip>
        <Tooltip label="Star">
          <button type="button" className="tf-iconbtn tf-iconbtn-soft" aria-label="Star">
            <Icon name="star" />
          </button>
        </Tooltip>
        <Tooltip label="Opens in a new tab" side="bottom">
          <button type="button" className="tf-btn tf-btn-secondary">
            View invoice
          </button>
        </Tooltip>
        <Tooltip label="Copy share link" shortcut="⌘L" defaultOpen>
          <button type="button" className="tf-iconbtn tf-iconbtn-soft" aria-label="Share">
            <Icon name="share" />
          </button>
        </Tooltip>
      </div>
      <div
        className="tf-row"
        style={{
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <Popover
          open
          width={280}
          trigger={
            <button type="button" className="tf-btn tf-btn-soft">
              <Icon name="users" size={15} />
              Assign
            </button>
          }
        >
          <div
            className="tf-col"
            style={{
              gap: 12,
            }}
          >
            <b>Assign to</b>
            <Combobox
              options={["Ava Vogel", "Ben Okafor", "Clara Haddad"]}
              placeholder="Search people"
            />
            <div
              className="tf-row"
              style={{
                justifyContent: "flex-end",
              }}
            >
              <Button size="sm">Assign</Button>
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}
export default App;
