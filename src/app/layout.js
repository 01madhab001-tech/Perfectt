import { Kalam } from "next/font/google";
import "./globals.css";

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
})

export const metadata = {
  title: "This is about us!",
  description: "Something simple, shared with feeling."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${kalam.className} bg-black antialiased select-none`}
      >
        {children}
      </body>
    </html>
  );
}
