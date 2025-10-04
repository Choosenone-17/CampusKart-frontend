import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductCard } from "@/components/product-card.jsx";
import { Search, Plus } from "lucide-react";
import Swal from "sweetalert2";
import api from "@/lib/api";

// Static categories
const categories = [
  { value: "all", label: "All Categories" },
  { value: "textbooks", label: "Textbooks" },
  { value: "electronics", label: "Electronics" },
  { value: "dorm-items", label: "Dorm Items" },
  { value: "supplies", label: "Supplies" },
  { value: "clothing", label: "Clothing" },
  { value: "furniture", label: "Furniture" },
  { value: "other", label: "Other" },
];

export function Products({ onAddProductClick, onContactSeller }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  // Fetch products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/products");
      return Array.isArray(res.data) ? res.data : [];
    },
  });

  // Mark as Sold mutation
  const markAsSoldMutation = useMutation({
    mutationFn: async ({ id, secretKey }) => {
      await api.post(`/api/products/${id}/mark-sold`, { secretKey });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
    },
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (newProductData) => {
      const res = await api.post("/api/products", newProductData);
      return res.data; // { product: {...}, secretKey }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["products"], (old = []) => [
        data.product,
        ...old,
      ]);

      Swal.fire({
        icon: "success",
        title: "✅ Product Added Successfully!",
        html: `
          <p>Use this key to mark your product as sold when it gets sold out 😊</p>
          <strong style="font-size:18px;color:#333;">${data.secretKey}</strong>
        `,
        confirmButtonText: "Got it!",
      });
    },
  });

  // Apply filters
  let filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  filteredProducts.sort((a, b) => {
    if (a.status === "sold" && b.status !== "sold") return 1;
    if (a.status !== "sold" && b.status === "sold") return -1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Browse Products
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Discover great deals from your campus community
            </p>
          </div>
          <Button
            onClick={onAddProductClick}
            className="bg-primary-500 hover:bg-primary-600 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse"
              >
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <div className="space-y-2">
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded"></div>
                  <div className="bg-gray-200 dark:bg-gray-700 h-4 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-12 max-w-md mx-auto shadow-lg">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                No products found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {searchQuery || selectedCategory !== "all"
                  ? "Try adjusting your search or filters"
                  : "Be the first to list an item in this category!"}
              </p>
              <Button
                onClick={onAddProductClick}
                className="bg-primary-500 hover:bg-primary-600 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? "s" : ""}
                {selectedCategory !== "all" &&
                  ` in ${
                    categories.find((c) => c.value === selectedCategory)?.label
                  }`}
              </p>
            </div>

            {/* ✅ Changed xl:grid-cols-4 → xl:grid-cols-3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id || product._id}
                  product={product}
                  onContact={onContactSeller}
                  onMarkSold={(id, secretKey) =>
                    markAsSoldMutation.mutate({ id, secretKey })
                  }
                />
              ))}
            </div>
          </>
        )}
         {/* FOOTER */}
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
    </div>
  );
}
