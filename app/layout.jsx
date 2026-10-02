import "./globals.css";
import SiteNav from "@/components/nav";
import BackToTop from "@/components/backtotop";
import Newsletter from "@/components/newsletter";
export const metadata = { title: "Cebutech Alpha Designers | CTU Main Campus", description: "Official hub for Cebutech Alpha Designers — programs, admissions, news, events and staff at CTU Main Campus.", manifest: "/manifest.json" };
export const viewport = { themeColor: "#0e7c6b" };
export default function RootLayout({ children }) {
  return (<html lang="en"><body className="font-display">
    <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-pine focus:px-3 focus:py-2 focus:rounded-lg focus:text-sm">Skip to content</a>
    <SiteNav />
    <main id="main-content" className="min-h-[80vh] page-enter">{children}</main>
    <footer className="bg-pine text-white/80 text-sm py-8 mt-12"><div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between md:items-center"><span>© 2026 Cebutech Alpha Designers — CTU Main Campus<br />Studio Hours Mon–Fri 8am–4pm</span><div><p className="font-bold text-white text-xs tracking-wide">FRIDAY ROUNDUP — EMAIL ME THE NEWS</p><Newsletter /></div><span className="flex gap-3"><a href="#" className="hover:text-teal-200">Facebook</a><a href="#" className="hover:text-teal-200">Instagram</a><a href="#" className="hover:text-teal-200">YouTube</a></span></div></footer>
    <BackToTop />
  </body></html>);
}


