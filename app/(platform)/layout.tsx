import { Navbar } from "@/components/platform/Navbar";
import { Sidebar } from "@/components/platform/Sidebar";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full relative flex flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Sidebar - Hidden on mobile, handled via sheet in future */}
      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Navbar />
        <div className="flex-1 overflow-auto p-4 md:p-8 relative scroll-smooth">
          {/* Background Decor */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          {children}
        </div>
      </main>
    </div>
  );
}
