import * as React from "react";
import { ReviewCard } from "@twentyfirstmedia/ui-core";

export default function Preview() {
  return (
    <div
      className="tf-grid"
      style={
        {
          "--cols": "1fr 1fr",
          gap: 16,
          alignItems: "start",
        } as React.CSSProperties
      }
    >
      <ReviewCard
        author="Jonas P."
        verified
        product="1,000 followers"
        date="2 days ago"
        rating={2}
        state="pending"
        title="Slower than promised"
        text="Arrived after two days instead of one hour. Support answered quickly though, so two stars. Would be great to get a refund for the delay."
        highlight={["refund"]}
        onPublish={() => {}}
        onHide={() => {}}
        onReply={() => {}}
      />
      <ReviewCard
        author="Ida N."
        product="TikTok views"
        date="Apr 12"
        rating={5}
        state="published"
        text="Fast, simple, worked exactly as described."
        reply="Thanks Ida, glad it worked!"
        onHide={() => {}}
        onReply={() => {}}
      />
    </div>
  );
}
