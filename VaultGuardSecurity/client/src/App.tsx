import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { Sidebar } from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Category from "@/pages/category";
import SearchPage from "@/pages/search";
import ReportsPage from "@/pages/reports";
import SettingsPage from "@/pages/settings";
import DocumentsPage from "@/pages/documents";
import CollaborationPage from "@/pages/collaboration";
import NotFound from "@/pages/not-found";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";

function LoginPage() {
  const { login, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
            <Shield className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome to GoVAULT</h2>
          <p className="mt-2 text-sm text-gray-600">
            Your secure family information management system
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <Button
            onClick={login}
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Secure authentication through Google Workspace
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/category/:categoryName" component={Category} />
        <Route path="/search" component={SearchPage} />
        <Route path="/reports" component={ReportsPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route path="/documents" component={DocumentsPage} />
        <Route path="/collaboration" component={CollaborationPage} />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
}

function AppContent() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-4 animate-pulse">
            <Shield className="text-white" size={32} />
          </div>
          <p className="text-gray-600">Loading GoVAULT...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return <AuthenticatedApp />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
