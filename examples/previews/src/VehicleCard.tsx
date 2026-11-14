import { VehicleCard } from "@twentyfirstmedia/ui-core";
import "./_connectors";

export default function Preview() {
  return (
    <div style={{ maxWidth: 420 }}>
      <VehicleCard
        name="Model Y"
        model="Long Range · 2024"
        battery={58}
        range={287}
        limit={80}
        charging="charging"
        power={11}
        until={new Date(2026, 10, 15, 6, 30)}
        locked
        climateOn={false}
        inside={9}
        location="Home · Garage"
        onLock={() => {}}
        onClimate={() => {}}
        service={{ name: "Tesla", icon: "brandTesla" }}
      />
    </div>
  );
}
