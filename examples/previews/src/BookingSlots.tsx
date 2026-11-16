import * as React from "react";
import { BookingSlots, Panel } from "@twentyfirstmedia/ui-core";
import { DAYS } from "./_sales";

export default function Preview() {
  const [value, setValue] = React.useState<{ date: Date | string | number; time: string } | null>({
    date: DAYS[2]!.date,
    time: "10:30",
  });
  return (
    <Panel style={{ maxWidth: 520 }}>
      <BookingSlots
        title="Intro call"
        host="Mara Ellis"
        duration={30}
        timeZone="Europe/Berlin"
        days={DAYS}
        value={value}
        onChange={setValue}
        onConfirm={() => {}}
      />
    </Panel>
  );
}
