import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme-provider.jsx";
import { CartProvider } from "@/lib/cart.jsx";
import { Navbar } from "@/components/navbar.jsx";
import AddProductModal from "@/components/add-product-modal.jsx";
import { CartSidebar } from "@/components/cart-sidebar.jsx";
import { Home } from "@/pages/home.jsx";
import { Products } from "@/pages/products.jsx";
import NotFound from "@/pages/not-found.jsx";

function Router() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleAddProductClick = () => {
    setIsAddProductModalOpen(true);
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleContactSeller = (product) => {
  const { contactMethod, contactDetails, sellerName } = product;
  let count = 0;

  if (!contactDetails) {
    alert(`No contact details available for ${sellerName}`);
    return;
  }

  let url = "";

  switch (contactMethod) {
    case "email":
      url = `mailto:${contactDetails}`;
      count++;
      break;

    case "phone":
      alert(`Contact ${sellerName} via ${contactMethod}: ${contactDetails}`);
      break;

    case "whatsapp":
      const whatsappNumber = contactDetails.replace(/\D/g, "");
      url = `https://wa.me/${whatsappNumber}`;
      count++;
      break;

    case "telegram":
      const telegramUser = contactDetails.replace(/^@/, "");
      url = `https://t.me/${telegramUser}`;
      count++;
      break;

    default:
      alert(`Contact ${sellerName} via ${contactMethod}: ${contactDetails}`);
      count++;
      return;
  }
  if(count!=0)
  {

  window.open(url, "_blank"); // Open in new tab/window
  }
};

  return (
    <>
      <Navbar 
        onAddProductClick={handleAddProductClick}
        onCartClick={handleCartClick}
      />
      
      <Switch>
        <Route path="/" component={() => 
          <Home 
            onAddProductClick={handleAddProductClick}
            onContactSeller={handleContactSeller}
          />
        } />
        <Route path="/products" component={() => 
          <Products 
            onAddProductClick={handleAddProductClick}
            onContactSeller={handleContactSeller}
          />
        } />
        <Route component={NotFound} />
      </Switch>

      <AddProductModal
        isOpen={isAddProductModalOpen}
        onClose={() => setIsAddProductModalOpen(false)}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onContactSeller={handleContactSeller}
      />
    </>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <Router />
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;