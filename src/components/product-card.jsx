import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export function ProductCard({ product = {}, onContact, onDelete }) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = product?._id ? isInCart(product._id) : false;

  let imageSrc = null;
  if (Array.isArray(product.images) && product.images.length > 0) {
    imageSrc =
      typeof product.images[0] === "string"
        ? product.images[0]
        : product.images[0]?.url || null;
  } else {
    imageSrc = product.image || product.imageUrl || null;
  }

  const handleToggleCart = () => {
    if (!product?._id) return;
    if (inCart) {
      removeItem(product._id);
    } else {
      addItem(product);
    }
  };

  const handleDelete = () => {
    if (!product.removalKey) {
      alert("No removal key found for this product.");
      return;
    }
    if (window.confirm(`Delete "${product?.title}"?`)) {
      onDelete?.(product._id, product.removalKey);
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
                 dark:border-gray-700 p-4 flex flex-col 
                 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl"
    >
      {/* Product Image */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product?.title || "Product Image"}
            className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.png";
            }}
          />
        ) : (
          <img
            src="/placeholder.png"
            alt="No Image"
            className="w-full h-full object-cover opacity-70"
          />
        )}
      </div>

      {/* Product Info */}
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
        {product?.title || "Untitled Product"}
      </h3>

      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">
        {product?.description || "No description available."}
      </p>

      {/* Category + Condition badges */}
      <div className="flex flex-wrap gap-2 mb-2">
        {product?.category && (
          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
            {product.category}
          </span>
        )}
        {product?.condition && (
          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
            {product.condition}
          </span>
        )}
      </div>

      {/* Seller Info */}
      {product?.sellerName && (
        <p className="text-sm text-gray-500 mb-3">
          Sold by <span className="font-medium">{product.sellerName}</span>
        </p>
      )}

      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          ₹{typeof product?.price === "number" ? product.price : "0"}
        </span>

        <div className="flex gap-2">
          {/* Add / Remove toggle */}
          <Button
            onClick={handleToggleCart}
            disabled={!product?._id}
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
            onClick={() => onContact?.(product)}
            className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white"
          >
            Contact
          </Button>
          {onDelete && product?._id && product.removalKey && (
            <Button
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Remove Product
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
