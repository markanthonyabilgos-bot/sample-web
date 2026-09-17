import "./globals.css";
import SiteNav from "@/components/nav";
import BackToTop from "@/components/backtotop";
import Newsletter from "@/components/newsletter";
export const metadata = { title: "My School | Student Organizations", description: "Official hub for clubs, events and announcements at My School.", manifest: "/manifest.json" };
export const viewport = { themeColor: "#0e7c6b" };
export default function RootLayout({ children }) {
  return (<html lang="en"><body className="font-display">
    <SiteNav />
    <main className="min-h-[80vh] page-enter">{children}</main>
    <footer className="bg-navy text-white/80 text-sm py-8 mt-12"><div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row gap-4 justify-between md:items-center"><span>© 2026 My School — Office of Student Life, Room 204<br />Mon–Fri 8am–4pm</span><div><p className="font-bold text-white text-xs tracking-wide">FRIDAY ROUNDUP — EMAIL ME THE NEWS</p><Newsletter /></div><span className="flex gap-3"><a href="#" className="hover:text-teal-200">Facebook</a><a href="#" className="hover:text-teal-200">Instagram</a><a href="#" className="hover:text-teal-200">YouTube</a></span></div></footer>
    <BackToTop />
  </body></html>);
}


