import { Button } from "@/components/ui/button";
import { X, Trash2, CreditCard } from "lucide-react";
import { useCart } from "@/lib/cart";

export function CartSidebar({ isOpen, onClose, onContactSeller }) {
  const { items, removeItem, total } = useCart();

  const handleContactSeller = (product) => {
    onContactSeller(product);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
          data-testid="cart-backdrop"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        data-testid="cart-sidebar"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Shopping Cart ({items.length})
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              data-testid="button-close-cart"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Add some items to get started!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item._id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4" data-testid={`cart-item-${item._id}`}>
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-600 rounded-lg overflow-hidden flex-shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <CreditCard className="h-6 w-6" />
                          </div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                          {item.condition} · {item.category?.replace('-', ' ')}
                        </p>
                        <p className="text-lg font-semibold text-primary-500 mt-1">
                          ₹{item.price}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item._id)}
                          className="text-gray-400 hover:text-red-500 h-8 w-8"
                          data-testid={`button-remove-${item._id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Contact Seller Button */}
                    <div className="mt-3">
                      <Button
                        onClick={() => handleContactSeller(item)}
                        className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm"
                        data-testid={`button-contact-${item._id}`}
                      >
                        Contact Seller
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900 dark:text-white">
                  Total:
                </span>
                <span className="text-2xl font-bold text-primary-500" data-testid="cart-total">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Contact individual sellers to arrange payment and pickup
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}