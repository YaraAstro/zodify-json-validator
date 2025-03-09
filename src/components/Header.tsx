
import React from 'react';
import { cn } from '@/lib/utils';
import { Github } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "w-full border-b border-border bg-background/50 backdrop-blur-sm sticky top-0 z-10",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="relative size-8 bg-primary/10 rounded-md flex items-center justify-center overflow-hidden animate-float">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-primary/10 backdrop-blur-xs"></div>
            <div className="relative z-10 font-semibold text-primary text-lg">z</div>
          </div>
          <Link to="/" className="text-xl font-medium tracking-tight">
            <span className="text-primary font-semibold">Zod</span>ify
          </Link>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm">
          <a 
            href="https://github.com/colinhacks/zod" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Zod Docs
          </a>
          <Link 
            to="/docs" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
          <a 
            href="https://github.com/YaraAstro/zodify-json-validator" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
          >
            <Github size={16} /> GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
