import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";

export function ProductCard({ product = {}, onContact, onDelete }) {
  const { items, addItem, removeItem, isInCart } = useCart();
  const inCart = product._id ? isInCart(product._id) : false;
  const imageSrc = product.image || product.imageUrl || null;

  const handleToggleCart = () => {
    if (!product._id) return;
    if (inCart) {
      removeItem(product._id);
    } else {
      addItem(product);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex flex-col">
      {/* Product Image */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={product.title || "Product Image"}
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
        {product.title || "Untitled Product"}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {product.description || "No description available."}
      </p>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
          ₹{typeof product.price === "number" ? product.price : "0"}
        </span>
        <div className="flex gap-2">
          {/* Add / Remove toggle */}
          <Button
            onClick={handleToggleCart}
            disabled={!product._id}
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

          {/* Delete product */}
          {onDelete && product._id && (
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
