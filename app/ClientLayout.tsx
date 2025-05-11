"use client"

import type React from "react"

import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { ThemeProvider } from "@/components/theme-provider"
import "@/app/globals.css"
import "@/i18n/i18n" // Import i18n configuration

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { i18n } = useTranslation()

  // Set document direction based on language
  useEffect(() => {
    document.documentElement.dir = i18n.dir()
    document.documentElement.lang = i18n.language
  }, [i18n, i18n.language])

  return (
    <html lang={i18n.language} dir={i18n.dir()}>
      <body className={`min-h-screen bg-background font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
