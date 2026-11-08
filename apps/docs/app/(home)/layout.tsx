import type { ReactNode } from "react";

export const metadata = { title: "Twentyfirst UI" };

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
