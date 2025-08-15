import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { GraduationCap, Plus, ShoppingCart, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "./theme-provider";
import { useCart } from "@/lib/cart";

export function Navbar({ onAddProductClick, onCartClick }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { items } = useCart();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Browse" },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        isScrolled ? "shadow-md" : "shadow-sm"
      }`}
    >
      <div className="w-full px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center cursor-pointer">
            <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center">
              <GraduationCap className="text-white w-7 h-7" />
            </div>
            <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
              CampusKart
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`px-4 py-3 rounded-md text-lg font-medium transition-colors duration-200 cursor-pointer ${
                    location === link.href
                      ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {link.label}
                </span>
              </Link>
            ))}

            {/* Cart */}
            <Button
              variant="ghost"
              onClick={onCartClick}
              className="relative text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white p-3"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>

            {/* Theme toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            </Button>

            {/* Add Product */}
            <Button
              onClick={onAddProductClick}
              className="bg-primary-500 hover:bg-primary-600 text-white text-lg px-6 py-3"
            >
              <Plus className="mr-2 h-5 w-5" /> Add Product
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCartClick}
              className="relative p-2"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <span
                className={`block px-4 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
                  location === link.href
                    ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                {link.label}
              </span>
            </Link>
          ))}

          <Button
            onClick={onAddProductClick}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white text-lg px-6 py-3"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Product
          </Button>

          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full flex items-center justify-center p-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === "light" ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
            <span className="ml-2">Toggle Theme</span>
          </Button>
        </div>
      )}
    </nav>
  );
}
