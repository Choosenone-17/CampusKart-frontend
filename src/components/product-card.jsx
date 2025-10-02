import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import axios from "axios";

export function ProductCard({ product = {}, onContact, onMarkSold }) {
  const { addItem, removeItem, isInCart } = useCart();

  // ✅ Safe productId (supports both id and _id from backend)
  const productId = product?.id || product?._id;
  const inCart = productId ? isInCart(productId) : false;
  const isSold = product?.status === "sold";

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
    if (!productId || isSold) return;
    if (inCart) {
      removeItem(productId);
    } else {
      addItem({ ...product, id: productId }); // ✅ Ensure cart stores consistent id
    }
  };

  // 🔹 Mark product as sold
  const handleMarkSold = async () => {
    if (!productId) return;

    const secretKey = prompt(
      `Enter your secret key to mark "${product?.title}" as SOLD:`
    );
    if (!secretKey) return;

    try {
      const res = await axios.post(`/api/products/${productId}/mark-sold`, {
        secretKey,
      });
      alert(res.data.message || "✅ Product marked as sold");
      onMarkSold?.(productId);
    } catch (err) {
      if (
        err.response?.status === 403 ||
        err.response?.data?.message === "Invalid secret key"
      ) {
        alert("❌ Wrong secret key. Please try again.");
      } else {
        alert("❌ Failed to mark as sold. Try again later.");
      }
    }
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 
                 dark:border-gray-700 p-4 flex flex-col 
                 transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-xl
                 ${isSold ? "opacity-70" : ""}`}
    >
      {/* Product Image */}
      <div className="h-48 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 overflow-hidden flex items-center justify-center relative">
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

        {/* 🔹 Sold badge overlay */}
        {isSold && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-600 text-white text-lg font-bold px-4 py-2 rounded-lg shadow-lg">
              SOLD OUT
            </span>
          </div>
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
          {!isSold ? (
            <>
              {/* Add / Remove toggle */}
              <Button
                onClick={handleToggleCart}
                disabled={!productId}
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

              {/* Mark as Sold */}
              <Button
                onClick={handleMarkSold}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Soldout
              </Button>
            </>
          ) : (
            <span className="text-red-600 font-semibold">SOLD</span>
          )}
        </div>
      </div>
    </div>
  );
}
