import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduCore - School Management System Auth & Multi-Role Architecture',
  description:
    'Enterprise-grade baseline authentication and multi-role routing architecture for School Management Systems built with Next.js, Supabase SSR, TypeScript, and Tailwind CSS.',
  openGraph: {
    title: 'EduCore - School Management System Auth & Multi-Role Architecture',
    description:
      'Enterprise-grade baseline authentication and multi-role routing architecture for School Management Systems built with Next.js, Supabase SSR, TypeScript, and Tailwind CSS.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EduCore - School Management System Auth & Multi-Role Architecture',
    description:
      'Enterprise-grade baseline authentication and multi-role routing architecture for School Management Systems built with Next.js, Supabase SSR, TypeScript, and Tailwind CSS.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-800 antialiased font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
