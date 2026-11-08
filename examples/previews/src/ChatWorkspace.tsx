import * as React from "react";
import {
  ChatList,
  ChatMessage,
  ChatWorkspace,
  FeedbackRating,
  SearchHits,
  ThinkingLine,
} from "@twentyfirstmedia/ui-core";
import type { ChatListProps } from "@twentyfirstmedia/ui-core";

const groups: ChatListProps["groups"] = [
  {
    title: "Pinned",
    items: [
      {
        id: "mb",
        name: "Main Brain",
        sub: "Morning briefing is ready",
        time: "08:00",
        tint: "lilac",
        status: "ok",
        pinned: true,
      },
    ],
  },
  {
    title: "Northwind",
    mark: "sky",
    items: [
      {
        id: "atlas",
        name: "Atlas",
        sub: "Waiting for your approval",
        time: "09:41",
        tint: "sky",
        status: "signal",
        unread: 1,
      },
      {
        id: "ads",
        name: "Ads",
        sub: "Budget at 82%",
        time: "09:12",
        tint: "mint",
        status: "warn",
      },
    ],
  },
  {
    title: "People",
    items: [
      {
        id: "lukas",
        name: "Lukas Weber",
        sub: "Sounds good",
        time: "Mon",
        avatar: true,
      },
    ],
  },
];
function App() {
  const s = React.useState("atlas");
  return (
    <div
      style={{
        height: 580,
      }}
    >
      <ChatWorkspace
        className="demo-fill"
        list={<ChatList groups={groups} selected={s[0]} onSelect={s[1]} />}
        thread={
          <div
            className="tf-col"
            style={{
              gap: 20,
            }}
          >
            <ChatMessage role="user" text="Draft a reply to Northwind" />
            <ChatMessage
              role="assistant"
              name="Atlas"
              tint="sky"
              time="09:41"
              text="Drafted. It quotes **40 seats at €24** prorated to May 1."
            />
            <ThinkingLine text="Reading 3 messages…" />
            <FeedbackRating label="Was this useful?" />
          </div>
        }
        details={
          <SearchHits
            query="seats"
            items={[
              {
                id: 1,
                chat: "Atlas",
                time: "09:41",
                who: "Atlas",
                text: "It quotes 40 seats at €24 prorated to May 1.",
              },
              {
                id: 2,
                chat: "Main Brain",
                time: "Mon",
                text: "Northwind asked about seats twice this quarter.",
              },
            ]}
          />
        }
      />
    </div>
  );
}
export default App;
