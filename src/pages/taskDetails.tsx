import { useNavigate, useParams } from 'react-router-dom'
import { useFetch } from '@/hooks/use-fetch';
import { ArrowLeft, Calendar, CheckCircle, Circle, Clock, DotIcon, EllipsisIcon, EllipsisVerticalIcon, FileText, MenuIcon, Tag, User, UserCircle2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import BestResource from '@/components/bestResource';
import ResourceSkillFilter from '@/components/resourceSkillFilter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { IResource, ISkills } from '@/core/types/interfaces';
import { usePost } from '@/hooks/use-post';

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
        assigned_resource: {
            id: number;
            name: string;
        }
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

    const apiUrl = import.meta.env.VITE_API_URL;

    const { data, loading, error, refetch } = useFetch<ITaskDetail>(`${apiUrl}/tasks/${id}`);

    const taskDetail = data;

    const skillName = taskDetail?.data.skill.name;

    const { data: resources, loading: resourcesLoading, error: resourcesError } = useFetch<IResource>(`${apiUrl}/resources?skill=${skillName}`);

    const resourceList = resources?.data;

    const { data: assignData, loading: assignLoading, error: assignError, post } = usePost()

    if(loading || resourcesLoading || assignLoading) {
        return <p>Loading...</p>
    }

    if(error || resourcesError || assignError) {
        return <p>Something gone wrong</p>
    }

    const handleAssignResource = async (resource) => {
        const postData = {
            resource_id: resource.id
        } as any;

        await post(`${apiUrl}/task/${id}/assign`, postData);

        if(assignData && assignData.data) {
            console.log(assignData.data)
        }
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
                                <div className="flex items-start gap-3">
                                    <div className="flex items-center gap-3">
                                        <UserCircle2Icon className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Assign To </p>
                                            <p className="text-sm text-muted-foreground">{taskDetail.data.assigned_resource?.name || 'Unassigned'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <EllipsisIcon className="h-4 w-4 text-muted-foreground"/>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="start">
                                                <DropdownMenuGroup>
                                                    {resourceList && resourceList.length > 0 && resourceList.map(resource => (
                                                        <DropdownMenuItem key={resource.id} onClick={() => handleAssignResource(resource)}>
                                                            <UserCircle2Icon className="h-4 w-4 text-muted-foreground mr-2"/>
                                                            {resource.name}
                                                        </DropdownMenuItem>
                                                    ))}
                                                </DropdownMenuGroup>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
