import Nav from "@/components/nav";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}
