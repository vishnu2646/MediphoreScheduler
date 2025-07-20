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
    status: string;
    end_date: string;
    start_date: string;
    project: {
        id: number;
        name: string;
    };
    skill: {
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
        name: string;
        short_description: string;
        skills: string[]
    }[];
}

export interface ISkills {
    data: {
        id: number;
        name: string;
    }[];
}