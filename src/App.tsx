import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/projects";
import NotFound from "./pages/errorPage";
import ShedularLayout from "./layout/layout";
import Tasks from "./pages/tasks";
import TaskDetails from "./pages/taskDetails";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <ShedularLayout>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/tasks" element={<Tasks />} />
                        <Route path="/task/:id" element={<TaskDetails />}/>
                        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </BrowserRouter>
            </ShedularLayout>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
