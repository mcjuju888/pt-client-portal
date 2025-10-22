import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        {/* Header */}
        <header className="border-b">
          <nav className="max-w-5xl mx-auto p-4 flex gap-4">
            <Link href="/dashboard" className="font-semibold hover:underline">
              Dashboard
            </Link>
            <Link href="/workouts/log" className="hover:underline">
              Log Workout
            </Link>
            <Link href="/workouts/progress" className="hover:underline">
              Progress
            </Link>
          </nav>
        </header>

        {/* Page content */}
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
