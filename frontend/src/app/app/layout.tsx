import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life App',
  description: 'Life — family management app prototype',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ margin: 0, padding: 0, background: '#1C1C1E', minHeight: '100vh' }}>
      {children}
    </div>
  );
}
