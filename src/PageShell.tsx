// src/PageShell.tsx — estructura común de las páginas privadas
import type { ReactNode } from 'react';
import BarraSuperior from './home/BarraSuperior.jsx';
import Footer from './home/Footer.jsx';

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="home-page">
      <BarraSuperior />
      <main className="container app-page">{children}</main>
      <Footer />
    </div>
  );
}
