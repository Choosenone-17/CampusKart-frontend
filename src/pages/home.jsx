import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card.jsx";
import { Shield, DollarSign, Users, Search, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from 'react-icons/fa';

export function Home({ onAddProductClick, onContactSeller }) {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  const featuredProducts = products.slice(0, 8);

  const scrollToProducts = () => {
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

      <section className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-28">
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center">
            <h1 className="text-6xl lg:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 leading-tight">
              Your Campus <span className="text-primary-500">Marketplace</span>
            </h1>
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 mb-10 max-w-4xl mx-auto leading-relaxed">
              Buy and sell textbooks, electronics, furniture, and more with fellow students.
              Safe, secure, and designed for campus life.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button
                onClick={scrollToProducts}
                size="lg"
                className="bg-primary-500 hover:bg-primary-600 text-white px-10 py-4 text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Search className="mr-3 h-6 w-6" />
                Browse Products
              </Button>
              <Button
                onClick={onAddProductClick}
                variant="outline"
                size="lg"
                className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-10 py-4 text-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Plus className="mr-3 h-6 w-6" />
                Sell an Item
              </Button>
            </div>
          </div>
        </div>
      </section>



      <section className="py-28 bg-white dark:bg-gray-800">
        <div className="max-w-8xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Why Choose CampusKart?
            </h2>
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              The trusted marketplace built specifically for college students
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            <div className="text-center p-10 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-8">
                <Shield className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Safe & Secure</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Campus-only marketplace ensures you're dealing with verified students from your Institute
              </p>
            </div>

            <div className="text-center p-10 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-8">
                <DollarSign className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Save Money</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Find great deals on textbooks, electronics, and dorm essentials from fellow students
              </p>
            </div>

            <div className="text-center p-10 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3">
              <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-8">
                <Users className="h-10 w-10 text-primary-500" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Community Driven</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Connect with your campus community and help each other succeed
              </p>
            </div>
          </div>
        </div>
      </section>



      <section id="products" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
              Featured Products
            </h2>
            <p className="text-2xl lg:text-3xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Discover the latest items from your campus community
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                  <div className="space-y-2">
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
                    <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 max-w-md mx-auto shadow-lg">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plus className="h-8 w-8 text-primary-500" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  No products yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Be the first to list an item on your campus marketplace!
                </p>
                <Button
                  onClick={onAddProductClick}
                  className="bg-primary-500 hover:bg-primary-600 text-white"
                  data-testid="button-first-product"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add First Product
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12" data-testid="featured-products">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onContact={onContactSeller}
                  />
                ))}
              </div>

              {products.length > 8 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-8 py-3 text-lg font-semibold"
                    onClick={() => (window.location.href = "/products")}
                    data-testid="button-view-all"
                  >
                    View All Products
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>


      <footer className="bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 py-20 w-full">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

            {/* Brand Section */}
            <div className="text-left sm:text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">CampusKart</h1>
              <p className="text-lg text-gray-900 dark:text-white">
                Your campus marketplace for affordable, safe, and student-focused trading.
                Connect, buy, and sell faster with CampusKart.
              </p>
              <div className="flex space-x-4 mt-4 text-gray-400">
                <a href="#" className="hover:text-white"><FaFacebookF /></a>
                <a href="#" className="hover:text-white"><FaTwitter /></a>
                <a href="#" className="hover:text-white"><FaLinkedinIn /></a>
                <a href="#" className="hover:text-white"><FaInstagram /></a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-left sm:text-center md:text-left">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Start Selling</a></li>
                <li><a href="/products" className="hover:text-white">Browse Products</a></li>
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>

            {/* Legal Section */}
            <div className="text-left sm:text-center md:text-left">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white">Refund Policy</a></li>
                <li><a href="#" className="hover:text-white">Shipping Policy</a></li>
              </ul>
            </div>

            {/* Contact Section */}
            <div className="text-left sm:text-center md:text-left">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Get In Touch</h4>
              <ul className="space-y-2 text-lg">
                <li>
                  <a href="mailto:campuskart17@gmail.com" className="hover:text-white">
                    ✉︎ campuskart17@gmail.com
                  </a>
                </li>
                <li>
                  <a href="tel:+919179337751" className="hover:text-white">
                    📞 +91 9179337751
                  </a>
                </li>
                <li>📍 SGSITS, Indore</li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} CampusKart. All rights reserved.
            </p>
            <p className="text-sm text-gray-400">
              Made with ❤️ by CampusKart Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}