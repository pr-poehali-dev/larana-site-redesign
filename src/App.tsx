
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { ProductProvider } from "@/contexts/ProductContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import EmployeePanel from "./pages/EmployeePanel";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contacts from "./pages/Contacts";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Oferta from "./pages/Oferta";
import Catalog from "./pages/Catalog";
import BundlesCatalog from "./pages/BundlesCatalog";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import Delivery from "./pages/Delivery";
import CleanupProducts from "./pages/CleanupProducts";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ProductProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/employee" element={<EmployeePanel />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/oferta" element={<Oferta />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/catalog/bundles" element={<BundlesCatalog />} />
            <Route path="/catalog/:slug" element={<CategoryPage />} />
            <Route path="/catalog/:slug/:id" element={<ProductPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/delivery" element={<Delivery />} />
            <Route path="/cleanup-products" element={<CleanupProducts />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </TooltipProvider>
      </ProductProvider>
    </HelmetProvider>
  </QueryClientProvider>
);

export default App;