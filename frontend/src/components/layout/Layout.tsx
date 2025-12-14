import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-sweet-grid overflow-hidden">
      <div className="pointer-events-none absolute inset-0">
        <div className="floating-blob" style={{ top: '-120px', left: '-80px', background: 'rgba(255,143,177,0.35)', animationDuration: '16s' }} />
        <div className="floating-blob" style={{ top: '20%', right: '-100px', background: 'rgba(255,184,108,0.28)', animationDuration: '18s', animationDelay: '3s' }} />
        <div className="floating-blob" style={{ bottom: '-140px', left: '25%', background: 'rgba(201,122,68,0.25)', animationDuration: '20s', animationDelay: '1s' }} />
      </div>
      <Header />
      <main className="flex-1 relative z-10">{children}</main>
      <Footer />
    </div>
  );
};
