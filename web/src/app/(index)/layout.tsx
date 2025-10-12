"use client";
import Header from "./_components/Header";
import Footer from "./_components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 ">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
