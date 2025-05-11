"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { inter, creepster } from "@/lib/fonts";
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n/i18n";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const [mounted, setMounted] = useState(false);

  // // This ensures hydration matching
  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return null;
  // }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${creepster.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans bg-slate-900 text-white min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <I18nextProvider i18n={i18n}>
            {/* Game audio context (optional) */}
            {/* <AudioProvider> */}
            <div className="flex flex-col min-h-screen">{children}</div>
            {/* </AudioProvider> */}
          </I18nextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
