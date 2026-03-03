import { Twitter, Linkedin, Github } from 'lucide-react';

interface FooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
}

const footerLinks: Record<string, FooterLink[]> = {
  Product: [
    { label: 'AI Dynamic Pricing Features', href: '#features' },
    { label: 'Rental Pricing Plans', href: '#pricing' },
    { label: 'Watch PricEye Demo', href: 'https://app.storylane.io/share/gzv1szkg4y0l', isExternal: true },
    { label: 'FAQ', href: '#faq' },
  ],
  Company: [
    { label: 'Become a Partner', href: 'https://forms.gle/rmp6UxTFRsdNrMrQ9', isExternal: true },
  ],
  Resources: [
    { label: 'Who is PricEye For?', href: '#audience' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-brand-dark/50 border-t border-brand-primary/10 pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4" aria-label="PricEye AI - Back to homepage">
              <img src="/p_priceeye_vecto_(1).png" alt="PricEye AI dynamic pricing logo" width={36} height={48} loading="lazy" className="w-9 h-12" />
              <span className="text-xl font-bold text-white font-heading">PricEye</span>
            </a>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              The transparent AI-powered dynamic pricing solution for Airbnb hosts and short-term rental property managers.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="PricEye on Twitter"
                className="w-9 h-9 bg-brand-dark/50 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-lg flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/priceyeai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="PricEye on LinkedIn"
                className="w-9 h-9 bg-brand-dark/50 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-lg flex items-center justify-center transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/priceyeai"
                aria-label="PricEye on GitHub"
                className="w-9 h-9 bg-brand-dark/50 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-lg flex items-center justify-center transition-colors group"
              >
                <Github className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.isExternal ? '_blank' : undefined}
                      rel={link.isExternal ? 'noopener noreferrer' : undefined}
                      className="text-slate-400 hover:text-white text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="border-t border-brand-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} PricEye. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}