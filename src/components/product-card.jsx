import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";
import { useCart } from "@/lib/cart";

const categoryColors = {
  textbooks: "text-primary-500 bg-primary-50 dark:bg-primary-900",
  electronics: "text-green-500 bg-green-50 dark:bg-green-900",
  "dorm-items": "text-purple-500 bg-purple-50 dark:bg-purple-900",
  supplies: "text-amber-500 bg-amber-50 dark:bg-amber-900",
  clothing: "text-pink-500 bg-pink-50 dark:bg-pink-900",
  furniture: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900",
  other: "text-gray-500 bg-gray-50 dark:bg-gray-900",
};

const conditionColors = {
  new: "text-green-600 bg-green-100 dark:bg-green-900",
  "like-new": "text-blue-600 bg-blue-100 dark:bg-blue-900",
  good: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900",
  fair: "text-orange-600 bg-orange-100 dark:bg-orange-900",
  poor: "text-red-600 bg-red-100 dark:bg-red-900",
};

export function ProductCard({ product, onContact }) {
  const { addItem, removeItem, items } = useCart();

  // Normalize id to avoid type mismatch issues
  const productId = String(product._id);
  const isInCart = items.some(item => String(item._id) === productId);

  const handleCartToggle = () => {
    if (isInCart) {
      removeItem(productId);
    } else {
      addItem({
        ...product,
        _id: productId, // normalize
      });
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      data-testid={`product-card-${productId}`}
    >
      {/* Product Image */}
      <div className="aspect-video bg-gray-100 dark:bg-gray-700 overflow-hidden">
        {product.images?.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <User className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1" data-testid="product-title">
            {product.title}
          </h3>
          <span className="text-xl font-bold text-primary-500 flex-shrink-0" data-testid="product-price">
            ₹{product.price}
          </span>
        </div>

        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2" data-testid="product-description">
          {product.description}
        </p>

        {/* Category and Condition Badges */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <Badge
            className={`text-xs font-medium px-2 py-1 rounded-full ${categoryColors[product.category] || categoryColors.other}`}
            data-testid="product-category"
          >
            {product.category?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
          <Badge
            className={`text-xs font-medium px-2 py-1 rounded-full ${conditionColors[product.condition] || conditionColors.good}`}
            data-testid="product-condition"
          >
            {product.condition?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
          </Badge>
        </div>

        {/* Seller Info */}
        <div className="text-xs text-gray-500 dark:text-gray-400 mb-4">
          <span>Sold by {product.sellerName}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={() => onContact(product)}
            className="flex-1 bg-primary-500 hover:bg-primary-600 text-white text-sm transition-colors duration-200"
            data-testid="button-contact-seller"
          >
            Contact Seller
          </Button>
          <Button
            onClick={handleCartToggle}
            variant={isInCart ? "secondary" : "outline"}
            className="px-3 text-sm transition-colors duration-200"
            data-testid="button-add-to-cart"
          >
            {isInCart ? "Remove" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
