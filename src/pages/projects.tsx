import { useNavigate } from 'react-router-dom';
import { useFetch } from '@/hooks/use-fetch';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IProject } from "@/core/types/interfaces";
import { Plus, Target, Calendar } from "lucide-react";

const Index = () => {
    const navigate = useNavigate();

    const apiUrl = import.meta.env.VITE_API_URL;

    const { data, loading, error } = useFetch<IProject>(`${apiUrl}/projects`)

    const projectsCount = data && data.data && data.data.length;

    const completedProjectCount = data && data.data && data.data.filter(project => project.status.toLowerCase() === 'completed').length;

    if(loading) {
        return <p>Loading Projects.</p>
    }

    if(error) {
        return <p>Something Gone Wrong.</p>
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        })
    }

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "in progress": return "bg-primary text-white border-primary/20 hover:cursor-pointer"
            case "completed": return "bg-shedular-green text-shedular-green border-shedular-green hover:cursor-pointer"
            default: return "bg-muted text-shedular-dark hover:cursor-pointer hover:bg-muted "
        }
    }

    const handleViewTasks = (id: number) => {
        navigate(`/tasks?project_id=${id}`);
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage and track your project portfolio
                    </p>
                </div>
                <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="h-4 w-4" />
                    New Project
                </Button>
            </div>

            {/* Overview  */}
            <div className="grid gap-4 md:grid-cols-4 my-5">
                <Card className="border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">No of Projects</span>
                        </div>
                        <div className="text-2xl font-bold">{projectsCount}</div>
                    </CardContent>
                </Card>

                 <Card className="border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-shedular-green" />
                            <span className="text-sm font-medium">Completed</span>
                        </div>
                        <div className="text-2xl font-bold">{completedProjectCount}</div>
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium">Total Tasks</span>
                        </div>
                        <div className="text-2xl font-bold">
                            4
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Projects List */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data && data.data.length > 0 && data.data.map(project => (
                    <Card key={project.id} className="border-border/50 hover:border-primary/20 transition-colors">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg">{project.name}</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Project Details */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3 text-muted-foreground" />
                                        <span>Due Date</span>
                                    </div>
                                    <span className="font-medium">{formatDate(project.duedate)}</span>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                        <Target className="h-3 w-3 text-muted-foreground" />
                                        <span>Tasks</span>
                                    </div>
                                    <span className="font-medium">
                                        4
                                    </span>
                                </div>
                            </div>

                            {/* Priority and Actions */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/50">
                                <Badge className={`capitalize ${getStatusColor(project.status)}`}>
                                    {project.status}
                                </Badge>
                                <Button variant="outline" size="sm" onClick={() => handleViewTasks(project.id)}>
                                    View Details
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Index;
