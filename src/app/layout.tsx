export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <title>אפליקציית חדר ישיבות</title>
        <meta name="description" content="אפליקציה לניהול חדרי ישיבות" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
