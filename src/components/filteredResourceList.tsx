import { ArrowRight, Search } from 'lucide-react';
import { useFetch } from '@/hooks/use-fetch';
import { Badge } from './ui/badge';

interface IResource {
    data: {
        id: number;
        name: string;
        short_description: string;
        current_status: string;
        skills: {
            id: number;
            name: string;
        }[];
    }[];
}

const FilteredResourceList = (
    {
        selectedSkill,
    }: any
) => {

    const apiUrl = import.meta.env.VITE_API_URL;

    const { data, loading, error } = useFetch<IResource>(`${apiUrl}/resources?skill=${selectedSkill}`)

    if(loading) {
        return <p>Loading...</p>;
    };

    if(error) {
        return <p>Something gone wrong</p>;
    };

    const filteredResources = data.data;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "unavalible": return "bg-destructive/80 text-white border-destructive/20 hover:cursor-pointer"
            case "avalible": return "bg-shedular-green text-white border-shedular-green hover:cursor-pointer"
            default: return "bg-muted text-shedular-dark hover:cursor-pointer hover:bg-muted "
        }
    }

    return (
        <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredResources && filteredResources.length > 0 && filteredResources?.map((resource, index) => (
                <div key={index} className="p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer">
                    <div className="space-y-2">
                        <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">
                                {resource.name}
                            </h4>
                            <Badge className={`capitalize ${getStatusColor(resource.current_status)}`}>{resource.current_status}</Badge>
                        </div>
                        <p className='text-xs'>{resource.short_description}</p>
                        <p className="text-xs text-muted-foreground flex items-center justify-end gap-2">
                            More Details <ArrowRight className='w-4 h-4' />
                        </p>
                    </div>
                </div>
            ))}
            {filteredResources && filteredResources.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No resources found</p>
                    <p className="text-xs">Try adjusting your filters</p>
                </div>
            )}
        </div>
    )
}

export default FilteredResourceList
