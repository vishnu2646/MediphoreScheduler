import { Badge } from '@/components/ui/badge'
import { IBestResource } from '@/core/types/interfaces';
import { useFetch } from '@/hooks/use-fetch';
import { ArrowRight, Search } from 'lucide-react';

const BestResource = ({ taskID }: {taskID: string}) => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const { data, loading, error } = useFetch<IBestResource>(`${apiUrl}/resources/search?task_id=${taskID}`)

    const resourceList = data;

    if(loading) {
        return <p>Loading...</p>
    }

    if(error) {
        return <p>Something gone wrong</p>
    }

    if(typeof(resourceList.data) === 'string' || resourceList.data.length === 0) {
        return (
            <div className="p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No Best resources found</p>
                    <Badge variant='destructive'>Notify when Resource Matches</Badge>
                </div>
            </div>
        )
    }

    return (
        <>
            {resourceList.data && resourceList.data.length > 0 && resourceList.data.map(resource => (
                <div key={resource.id} className="p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h4 className="font-medium">{resource.name}</h4>
                            <p className="text-sm text-muted-foreground">{resource.short_description}</p>
                        </div>
                        {resource.skills.map(skill => (
                            <Badge variant="outline" className='mr-2' key={skill}>
                                {skill}
                            </Badge>
                        ))}
                    </div>
                    <p className='flex items-center gap-2 cursor-pointer text-xs justify-end'>More Details <ArrowRight className='h-3 w-3' /></p>
                </div>
            ))}
        </>
    )
}

export default BestResource
