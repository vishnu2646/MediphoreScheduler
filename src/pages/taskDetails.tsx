import { ArrowLeft, Calendar, CheckCircle, Circle, Clock, FileText, Tag, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BestResource from '@/components/bestResource';
import ResourceSkillFilter from '../components/resourceSkillFilter';
import { useFetch } from '@/hooks/useFetch';

interface ITaskDetail {
    data: {
        id: number;
        project: {
            id: number;
            name: string;
        };
        skill: {
            id: number;
            name: string;
        };
        title: string;
        description: string;
        completed: boolean;
        start_date: string;
        end_date: string;
    }
}

const TaskDetails = () => {

    const navigate = useNavigate();

    const { id  } = useParams<{ id: string }>();

    const { data, loading, error } = useFetch<ITaskDetail>(`http://localhost:8000/api/tasks/${id}`)

    const taskDetail = data;

    if(loading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <p>Something gone wrong</p>
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    return (
        <div className='p-4'>
            <div className="flex items-center gap-4">
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className='rounded-[50%] h-[25px] w-[25px]'
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="h-4 w-px bg-border" />
                <div>
                    <h1 className="text-2xl font-bold tracking-wide">{taskDetail.data.title}</h1>
                    <p className="text-muted-foreground cursor-pointer hover:text-primary">Task #{taskDetail.data.id}</p>
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-3 my-4">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Task Details
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {taskDetail.data.completed ? (
                                        <CheckCircle className="h-5 w-5 text-success" />
                                    ) : (
                                        <Circle className="h-5 w-5 text-muted-foreground" />
                                    )}
                                    <Badge variant={taskDetail.data.completed ? "default" : "secondary"}>
                                        {taskDetail.data.completed ? "Completed" : "In Progress"}
                                    </Badge>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-medium mb-2">Description</h4>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {taskDetail.data.description}
                                </p>
                            </div>

                            <Separator />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Project</p>
                                        <p className="text-sm text-muted-foreground">{taskDetail.data.project.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Skill Required</p>
                                        <Badge variant="outline">{taskDetail.data.skill.name}</Badge>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">Start Date</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(taskDetail.data.start_date)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                        <p className="text-sm font-medium">End Date</p>
                                        <p className="text-sm text-muted-foreground">{formatDate(taskDetail.data.end_date)}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Best Resources for {taskDetail.data.skill.name}</CardTitle>
                            <CardDescription>
                                Resources specifically relevant to this task's skill requirement and based on available dates
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <BestResource taskID={id}/>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <ResourceSkillFilter />
            </div>
        </div>
    )
}

export default TaskDetails
