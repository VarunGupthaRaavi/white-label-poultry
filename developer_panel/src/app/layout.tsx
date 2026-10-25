import './globals.css';
import type { Metadata } from 'next';
import { AuthProvider } from '../context/AuthContext';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Gatekeeper } from '../components/Gatekeeper';

export const metadata: Metadata = {
  title: 'White-Label Platform Control Plane | Developer Panel',
  description: 'Enterprise Multi-Tenant Orchestrator & Control Plane for White-Label Commerce',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
        <AuthProvider>
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
              <Gatekeeper>{children}</Gatekeeper>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
