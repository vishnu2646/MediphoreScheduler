import { useNavigate, useSearchParams } from "react-router-dom";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ITask, ITaskData } from "@/core/types/interfaces";
import { Calendar, Clock, Filter, Plus, Search } from "lucide-react";
import { useFetch } from "@/hooks/use-fetch";
import { usePost } from "@/hooks/use-post";
import { useEffect, useState } from "react";

const Tasks = () => {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const apiUrl = import.meta.env.VITE_API_URL;

    const projectParam = searchParams.get('project_id');

    const [priority, setPriority] = useState('');

    const randomPriority = () => {
        const priorityArray = ['Low', 'Medium', 'High'];
        const randomPriorityIndex = Math.floor(Math.random() * priorityArray.length);
        setPriority(priorityArray[randomPriorityIndex]);
    }

    useEffect(() => {
        randomPriority();
    }, []);

    const { data, loading, error, refetch } = useFetch<ITask>(`${apiUrl}/tasks?project_id=${projectParam}`);

    const { data: postata, loading: postLoading, error: postError, post } = usePost();

    if(loading || postLoading) {
        return <p>Loading...</p>
    }

    if(error || postError) {
        return <p>Something gone wrong</p>
    }

    const activeTasks = data && data.data && data.data.filter(task => task.status !== 'completed');

    const completedTasks = data && data.data && data.data.filter(task => task.status === 'completed');

    const handleCloseTask = async (task) => {
        task.status = 'completed';
        await post(`${apiUrl}/tasks/${task.id}`, task);
        refetch();
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        })
    };

    const getStatusColor = (task: ITaskData) => {
        const status = task.status;
        switch (status.toLowerCase()) {
            case "completed": return "bg-green/10 text-white border-green/20"
            case "in progress": return "bg-primary/10 text-primary border-primary/20 hover:cursor-pointer"
            default: return "bg-muted"
        }
    };

    const handleRouteTaskDetail = (id: number) => {
        navigate(`/task/${id}`)
    }

    return (
        <div className="p-4">
            <div className="flex items-center justify-between flex-wrap">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
                    <p className="text-muted-foreground text-sm">
                        Manage your tasks and stay productive
                    </p>
                </div>
                <Button className="bg-primary hover:bg-primary-dark">
                    <Plus className="h-4 w-4" />
                    New Task
                </Button>
            </div>

            <div className="flex items-center gap-4 my-6">
                <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
                <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                </Button>
                <div className="ml-auto flex gap-2">
                    <Badge variant="secondary">{activeTasks.length} Active</Badge>
                    <Badge variant="outline">{completedTasks.length} Completed</Badge>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            Active Tasks
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Tasks that need your attention
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {activeTasks.map(task => (
                            <div key={task.id} className="p-4 rounded-lg border border-border/50 space-y-3">
                                <div className="flex items-start gap-3">
                                <Checkbox
                                    className="mt-1"
                                    checked={task.status === 'completed'}
                                    onCheckedChange={() => handleCloseTask(task)}
                                />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h4
                                            className="font-medium capitalize hover:text-primary hover:cursor-pointer"
                                            onClick={() => handleRouteTaskDetail(task.id)}
                                        >
                                            {task.title}
                                        </h4>
                                        <Badge variant={priority === 'High' ? 'destructive' : priority === 'Medium' ? 'default' : 'success'}>
                                            {priority}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>Due {formatDate(task.end_date)}</span>
                                        </div>
                                        <Badge variant="outline" className={`capitalize ${getStatusColor(task)}`}>
                                            {task.status}
                                        </Badge>
                                        <span className="text-primary">{task.project.name}</span>
                                    </div>
                                </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card className="border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-success" />
                            Completed Tasks
                        </CardTitle>
                        <CardDescription className="text-sm">
                            Recently finished work
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {completedTasks.length === 0 && (
                            <p>No Completed Tasks to List</p>
                        )}
                        {completedTasks.length > 0 && completedTasks.map((task) => (
                        <div className="p-4 rounded-lg border border-border/50 space-y-3 opacity-75">
                            <div className="flex items-start gap-3">
                            <Checkbox
                                className="mt-1"
                                checked={task.status === 'completed'}
                            />
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium line-through hove:text-primary hover:cursor-pointer" onClick={() => handleRouteTaskDetail(task.id)}>{task.title}</h4>
                                    <Badge>
                                        {priority}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        <span>{task.status && 'completed'} {formatDate(task.end_date)}</span>
                                    </div>
                                    <Badge variant="outline">
                                        {task.status && 'completed'}
                                    </Badge>
                                    <span className="text-primary">{task.project.name}</span>
                                </div>
                            </div>
                            </div>
                        </div>
                        ))}
                    </CardContent>
                    </Card>
            </div>
        </div>
    );
}

export default Tasks;