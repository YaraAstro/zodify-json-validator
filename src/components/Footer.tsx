
import React from 'react';
import { cn } from '@/lib/utils';

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer className={cn(
      "w-full border-t border-border bg-background/50 backdrop-blur-sm py-6",
      className
    )}>
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:px-6 text-sm text-muted-foreground">
        <p>
          Built with precision and care
        </p>
        <div className="flex items-center gap-4">
          <a 
            href="#" 
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </a>
          <a 
            href="#" 
            className="hover:text-foreground transition-colors"
          >
            Terms
          </a>
          <a 
            href="#" 
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
