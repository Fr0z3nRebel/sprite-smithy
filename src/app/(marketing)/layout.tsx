import type { Metadata } from 'next';
import Header from '@/components/landing/Header';
import Footer from '@/components/landing/Footer';

export const metadata: Metadata = {
  title: 'Sprite Smithy - AI Video to Sprite Sheet Converter',
  description: 'Transform AI-generated character videos into perfectly aligned, loopable 2D sprite sheets using deterministic image processing. $30 lifetime access.',
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
