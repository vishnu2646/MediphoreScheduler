export interface IProject {
    data: {
        id: number;
        name: string;
        description: string;
        duedate: string;
        status: string;
    }[];
}

export interface ITaskData {
    id: number;
    title: string;
    completed: boolean;
    end_date: string;
    project: {
        id: number;
        name: string;
    }
};

export interface ITask {
    data: ITaskData[];
}

export interface IBestResource {
    data: {
        id: number;
        resource: {
            id: number;
            name: string;
            shortDescription: string;
        },
        skill: {
            id: number;
            name: string;
        }
    }[];
}

export interface ISkills {
    data: {
        id: number;
        name: string;
    }[];
}