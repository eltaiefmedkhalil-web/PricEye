import { Twitter, Linkedin, Github } from 'lucide-react';

const footerLinks = {
  Product: ['Features', 'Pricing', 'Integrations', 'API', 'Changelog'],
  Company: ['About', 'Blog', 'Careers', 'Press', 'Partners'],
  Resources: ['Documentation', 'Help Center', 'Community', 'Webinars', 'Status'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR'],
};

export default function Footer() {
  return (
    <footer className="bg-brand-dark/50 border-t border-brand-primary/10 pt-16 pb-8">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <img src="/p_priceeye_vecto_(1).png" alt="PricEye" className="w-9 h-12" />
              <span className="text-xl font-bold text-white font-heading">PricEye</span>
            </a>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              The transparent AI-powered dynamic pricing solution for short-term rentals.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 bg-brand-dark/50 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-lg flex items-center justify-center transition-colors group"
              >
                <Twitter className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
              </a>
              {/* Bouton LinkedIn mis à jour */}
              <a
                href="https://www.linkedin.com/company/priceyeai"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 bg-brand-dark/50 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-lg flex items-center justify-center transition-colors group"
              >
                <Linkedin className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
              </a>
              <a
                href="https://www.linkedin.com/company/priceyeai"
                className="w-9 h-9 bg-brand-dark/50 hover:bg-brand-primary/20 border border-brand-primary/20 rounded-lg flex items-center justify-center transition-colors group"
              >
                <Github className="w-4 h-4 text-slate-400 group-hover:text-brand-accent transition-colors" />
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => {
                  const isPartners = link === 'Partners';
                  const linkUrl = isPartners 
                    ? "https://forms.gle/rmp6UxTFRsdNrMrQ9" 
                    : "#";
                  
                  return (
                    <li key={link}>
                      <a
                        href={linkUrl}
                        target={isPartners ? "_blank" : undefined}
                        rel={isPartners ? "noopener noreferrer" : undefined}
                        className="text-slate-400 hover:text-white text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-brand-primary/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2025 PricEye. All rights reserved.
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