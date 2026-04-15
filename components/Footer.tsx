const links = ['Product', 'Pricing', 'Privacy', 'Contact'];

export function Footer() {
  return (
    <footer id="footer" className="border-t border-slate-200 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p className="font-semibold text-slate-900">TailorCV</p>
        <div className="flex flex-wrap gap-5">
          {links.map((link) => (
            <a key={link} href="#" className="transition hover:text-slate-900">
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
