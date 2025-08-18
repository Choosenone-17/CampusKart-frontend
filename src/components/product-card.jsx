import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import api from "@/lib/api";
import { useCart } from "@/lib/cart";

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

/* ✅ Product Card Component */
export function ProductCard({ product, inCart, onToggleCart, onContact, onDelete, currentUserId }) {
  const isOwner = currentUserId && product.sellerId === currentUserId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      {/* Product Image */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {product.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          ₹{product.price}
        </span>
        <div className="flex gap-2">
          {/* Add / Remove toggle */}
          <Button
            onClick={onToggleCart}
            className={`${
              inCart
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary-500 hover:bg-primary-600"
            } text-white`}
          >
            {inCart ? "Remove" : "Add"}
          </Button>

          {/* Contact seller */}
          <Button
            onClick={() => onContact(product)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
          >
            Contact
          </Button>

          {/* Delete product (only for owner) */}
          {isOwner && (
            <Button
              onClick={() => onDelete(product._id)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ✅ Products Grid Component */
export function Products({ onAddProductClick, onContactSeller, onDeleteProduct, currentUserId }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ Grab cart helpers
  const { addItem, removeItem, isInCart } = useCart();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/products");
      return res.data;
    },
  });

  // ✅ Filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      product.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
              className="bg-primary-500 hover:bg-primary-600 text-white transition-colors duration-200"
              data-testid="button-add-product"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="lg:w-64">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                data-testid="select-category"
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
        <div>
          {isLoading ? (
            // Skeleton loaders
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
            // No results UI
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
                  data-testid="button-no-results"
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
                      categories.find((c) => c.value === selectedCategory)
                        ?.label
                    }`}
                </p>
              </div>

              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                data-testid="products-grid"
              >
                {filteredProducts.map((product) => {
                  const inCart = isInCart(product._id);
                  return (
                    <ProductCard
                      key={product._id}
                      product={product}
                      inCart={inCart}
                      onToggleCart={() =>
                        inCart ? removeItem(product._id) : addItem(product)
                      }
                      onContact={onContactSeller}
                      onDelete={onDeleteProduct}
                      currentUserId={currentUserId}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
