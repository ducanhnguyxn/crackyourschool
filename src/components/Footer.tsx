import { BookOpen, Twitter, Facebook, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xl font-bold">
              <BookOpen className="w-6 h-6 text-primary" />
              <span>CrackYourSchool</span>
            </div>
            <p className="text-background/70 leading-relaxed">
              Your AI-powered study companion for academic success and peace of mind.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Product</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Pricing</a></li>
              <li><Link to="/faq" className="text-background/70 hover:text-primary transition-colors">FAQ</Link></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Roadmap</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">GDPR</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 text-center text-background/60 text-sm">
          <p>© 2024 CrackYourSchool. All rights reserved. Made with AI for learners everywhere.</p>
        </div>
      </div>
    </footer>
  );
};
