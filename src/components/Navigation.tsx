import { BookOpen, LogOut, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const Navigation = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 text-lg md:text-xl font-bold">
              <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-primary shrink-0" />
              <span className="hidden sm:inline">crackyourschool</span>
              <span className="sm:hidden">CYS</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </a>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                Dashboard
              </Link>
            )}
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <a href="/#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="/#blog" className="text-sm font-medium hover:text-primary transition-colors">
              Blog
            </a>
            <a href="/#faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </a>
          </div>

          {user ? (
            <div className="flex items-center gap-2 md:gap-3">
              {profile?.is_pro && (
                <Badge className="bg-primary text-primary-foreground px-2 md:px-3 py-1 text-xs md:text-sm hidden sm:flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  Pro
                </Badge>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 md:h-10 md:w-10 rounded-full shrink-0">
                    <Avatar className="h-9 w-9 md:h-10 md:w-10">
                      <AvatarFallback className="text-xs md:text-sm">
                        {user.email?.charAt(0).toUpperCase() || <User className="h-3 w-3 md:h-4 md:w-4" />}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium leading-none">Account</p>
                        {profile?.is_pro && (
                          <Badge variant="outline" className="text-xs px-1.5 py-0">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs leading-none text-muted-foreground break-all">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing">Pricing</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Link to="/auth" className="shrink-0">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-xs md:text-sm px-3 md:px-4 py-2 md:py-2">
                <span className="hidden sm:inline">Get Started - It's Free</span>
                <span className="sm:hidden">Get Started</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
