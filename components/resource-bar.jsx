import Link from "next/link";

const resources = [
  { label: "Student Portal", href: "/archive#portal", desc: "Grades & forms" },
  { label: "Academic Calendar", href: "/events", desc: "Dates & deadlines" },
  { label: "Studio Schedules", href: "/archive#schedules", desc: "Menus & shifts" },
  { label: "Transportation", href: "/archive#transport", desc: "Routes & shuttles" },
];

export default function ResourceBar() {
  return (
    <section aria-label="Quick-access resources" className="max-w-6xl mx-auto px-4 -mt-6 relative z-10">
      <nav className="grid grid-cols-2 md:grid-cols-4 gap-2 bg-white border border-teal-100 rounded-xl shadow-sm p-2">
        {resources.map((r) => (
          <Link key={r.label} href={r.href} className="rounded-lg px-3 py-2 hover:bg-teal-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600">
            <span className="block text-sm font-bold text-teal-900">{r.label}</span>
            <span className="block text-xs text-slate-600">{r.desc}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
