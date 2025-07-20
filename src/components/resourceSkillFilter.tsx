import { useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { ISkills } from '@/core/types/interfaces';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import FilteredResourceList from './filteredResourceList';
import { useFetch } from '@/hooks/useFetch';

const ResourceSkillFilter = () => {

    const [selectedSkill, setSelectedSkill] = useState<string>('all');

    const [searchTerm, setSearchTerm] = useState("");

    const { data, loading, error } = useFetch<ISkills>('http://localhost:8000/api/skills')

    const skillsList = data?.data;

    if(loading) {
        return <p>Loading...</p>;
    };

    if(error) {
        return <p>Something gone wrong</p>;
    };

    const handleSkillChange = (value: string) => {
        setSelectedSkill(value);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Resources
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Filter by Skill</label>
                        <Select onValueChange={handleSkillChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select skill" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Skills</SelectItem>
                                {skillsList.length > 0 && skillsList.map((skill) => (
                                    <SelectItem key={skill.id} value={skill.name}>
                                        {skill.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="text-sm font-medium mb-2 block">Search Resources</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search resources..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Resources</CardTitle>
                    <CardDescription className='text-sm'>
                        Browse and filter available resources by skill
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <FilteredResourceList
                        searchTearm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        selectedSkill={selectedSkill}
                        setSelectedSkill={setSelectedSkill}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default ResourceSkillFilter;