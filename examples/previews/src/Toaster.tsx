import * as React from "react";
import { Button, Toaster, toast } from "@twentyfirstmedia/ui-core";

function App() {
  React.useEffect(() => {
    toast({
      text: "Invoice #2097 sent to Northwind",
      tone: "success",
      duration: 600000,
    });
    toast({
      text: "2 people removed",
      tone: "danger",
      icon: "trash",
      undo: () => {
        toast({
          text: "Restored",
          tone: "info",
          duration: 600000,
        });
      },
      duration: 600000,
    });
  }, []);
  return (
    <div
      className="tf-panel"
      style={{
        gap: 12,
      }}
    >
      <div className="tf-row">
        <Button
          variant="soft"
          onClick={() => {
            toast("Profile saved");
          }}
        >
          Success
        </Button>
        <Button
          variant="soft"
          onClick={() => {
            toast({
              text: "Build started for halo-web",
              tone: "info",
            });
          }}
        >
          Info
        </Button>
        <Button
          variant="soft"
          onClick={() => {
            toast({
              text: "Project archived",
              undo: () => {
                toast("Restored");
              },
            });
          }}
        >
          With undo
        </Button>
      </div>
      <p
        className="tf-card-desc"
        style={{
          margin: 0,
        }}
      >
        Toasts stack bottom-center above the dock, three at most. Hover pauses the timer.
      </p>
      <Toaster />
    </div>
  );
}
export default App;
