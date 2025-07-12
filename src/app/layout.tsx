// app/layout.tsx
import "@/app/globals.css";
import { Toaster } from "sonner";
import { Inter } from "next/font/google";
import { Noto_Nastaliq_Urdu } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });
const urduFont = Noto_Nastaliq_Urdu({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-urdu",
});

export const metadata = {
  title: "Blog Summariser",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`h-full ${urduFont.variable} ${inter.className}`}
    >
      <body suppressHydrationWarning className="h-full">
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
