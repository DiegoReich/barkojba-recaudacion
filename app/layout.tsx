import './globals.css';

export const metadata = {
  title: 'Recaudación Barkojba + 35',
  description: 'Sistema de recaudación para equipo de fútbol amateur'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
