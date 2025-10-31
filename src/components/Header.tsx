import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import psaLogo from "@/assets/psa-logo.jpeg";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 md:gap-3">
            <img src={psaLogo} alt="PSA Logo" className="w-8 h-8 md:w-12 md:h-12 object-contain" />
            <span className="text-lg md:text-xl font-bold text-primary">PSA System</span>
          </div>
          
          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('opportunities')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Browse Opportunities
            </button>
            <button 
              onClick={() => scrollToSection('opportunities')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Organizations
            </button>
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('opportunities')}
              className="text-foreground hover:text-primary transition-colors"
            >
              Contact
            </button>
          </nav>
          
          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => scrollToSection('opportunities')}
              className="text-xs md:text-sm"
            >
              Get Started
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-6 mt-8">
                  <button 
                    onClick={() => scrollToSection('opportunities')}
                    className="text-lg text-foreground hover:text-primary transition-colors text-left"
                  >
                    Browse Opportunities
                  </button>
                  <button 
                    onClick={() => scrollToSection('opportunities')}
                    className="text-lg text-foreground hover:text-primary transition-colors text-left"
                  >
                    Organizations
                  </button>
                  <button 
                    onClick={() => scrollToSection('about')}
                    className="text-lg text-foreground hover:text-primary transition-colors text-left"
                  >
                    How It Works
                  </button>
                  <button 
                    onClick={() => scrollToSection('opportunities')}
                    className="text-lg text-foreground hover:text-primary transition-colors text-left"
                  >
                    Contact
                  </button>
                  <Button variant="ghost" size="lg" className="justify-start">
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;