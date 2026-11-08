import { Button, ButtonGroup, IconButton, Menu, Popover } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div className="tf-panel" style={{ gap: 20, paddingBottom: 200 }}>
      <div className="tf-row" style={{ gap: 16 }}>
        <ButtonGroup label="History">
          <Button variant="secondary" icon="undo">
            Undo
          </Button>
          <Button variant="secondary" icon="redo">
            Redo
          </Button>
        </ButtonGroup>
        <ButtonGroup label="Zoom">
          <IconButton icon="minus" label="Zoom out" variant="outline" />
          <Button variant="secondary">100%</Button>
          <IconButton icon="plus" label="Zoom in" variant="outline" />
        </ButtonGroup>
      </div>
      <ButtonGroup label="Publish">
        <Button icon="send">Publish</Button>
        <Popover
          open
          flush
          align="end"
          trigger={<IconButton icon="chevronDown" label="More publish options" variant="solid" />}
        >
          <Menu
            items={[
              { label: "Schedule…", icon: "calendar" },
              { label: "Publish to staging", icon: "upload" },
              "-",
              { label: "Save as draft", icon: "file" },
            ]}
          />
        </Popover>
      </ButtonGroup>
    </div>
  );
}
