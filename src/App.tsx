import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginPage } from "@/components/LoginPage";
import { AppShell } from "@/components/AppShell";

// Admin pages
import { OrgDomainsPage } from "@/pages/admin/OrgDomainsPage";
import { OrgDomainCardPage } from "@/pages/admin/OrgDomainCardPage";
import { TechDomainsPage } from "@/pages/admin/TechDomainsPage";
import { TechDomainCardPage } from "@/pages/admin/TechDomainCardPage";
import { RequirementsPage } from "@/pages/admin/RequirementsPage";
import { RequirementCardPage } from "@/pages/admin/RequirementCardPage";
import { TechnologiesPage } from "@/pages/admin/TechnologiesPage";
import { TechnologyCardPage } from "@/pages/admin/TechnologyCardPage";

const queryClient = new QueryClient();

function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const currentUser = useStore(s => s.currentUser);
  if (!currentUser) return <Navigate to="/login" replace />;
  if (adminOnly && currentUser.role !== 'administrator') return <Navigate to="/library/org-domains" replace />;
  return <AppShell>{children}</AppShell>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Admin routes */}
          <Route path="/admin/org-domains" element={<ProtectedRoute adminOnly><OrgDomainsPage /></ProtectedRoute>} />
          <Route path="/admin/org-domains/:id" element={<ProtectedRoute adminOnly><OrgDomainCardPage /></ProtectedRoute>} />
          <Route path="/admin/tech-domains" element={<ProtectedRoute adminOnly><TechDomainsPage /></ProtectedRoute>} />
          <Route path="/admin/tech-domains/:id" element={<ProtectedRoute adminOnly><TechDomainCardPage /></ProtectedRoute>} />
          <Route path="/admin/requirements" element={<ProtectedRoute adminOnly><RequirementsPage /></ProtectedRoute>} />
          <Route path="/admin/requirements/:id" element={<ProtectedRoute adminOnly><RequirementCardPage /></ProtectedRoute>} />
          <Route path="/admin/technologies" element={<ProtectedRoute adminOnly><TechnologiesPage /></ProtectedRoute>} />
          <Route path="/admin/technologies/:id" element={<ProtectedRoute adminOnly><TechnologyCardPage /></ProtectedRoute>} />

          {/* Library (consumer) routes — read-only */}
          <Route path="/library/org-domains" element={<ProtectedRoute><OrgDomainsPage /></ProtectedRoute>} />
          <Route path="/library/org-domains/:id" element={<ProtectedRoute><OrgDomainCardPage /></ProtectedRoute>} />
          <Route path="/library/tech-domains" element={<ProtectedRoute><TechDomainsPage /></ProtectedRoute>} />
          <Route path="/library/tech-domains/:id" element={<ProtectedRoute><TechDomainCardPage /></ProtectedRoute>} />
          <Route path="/library/requirements" element={<ProtectedRoute><RequirementsPage /></ProtectedRoute>} />
          <Route path="/library/requirements/:id" element={<ProtectedRoute><RequirementCardPage /></ProtectedRoute>} />
          <Route path="/library/technologies" element={<ProtectedRoute><TechnologiesPage /></ProtectedRoute>} />
          <Route path="/library/technologies/:id" element={<ProtectedRoute><TechnologyCardPage /></ProtectedRoute>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
