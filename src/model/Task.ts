import { TaskValidation } from "./TaskValidation.js";
export type Status = 1 | 2 | 3 | 4;
export type Difficulty = 1 | 2 | 3;

//public interface
export type Task = {
    id:number,
    title:string;
    description:string;
    status:Status;
    difficulty:Difficulty;
    creationDate:string;
    dueDate:string | null;
    lastEditedDate:string | null;
}

//internal data stored on each task instance
type TaskData = {
    _id:number,
    _title:string;
    _description:string;
    _status:Status;
    _difficulty:Difficulty;
    _creationDate:string;
    _dueDate:string | null;
    _lastEditedDate:string | null;
}

//(this as unknown as TaskData) asserts the "this" as type of the internal data TaskData. not runtime validation so must still initialize the backing fields

export const taskPrototype = {
    set id(id:number){
        (this as unknown as TaskData)._id = id;
    },
    set title(title:string){
        if (TaskValidation.getTitleState(title) !== "valid"){
            throw new Error("Title is not valid.");
        }
        (this as unknown as TaskData)._title = title;
    },
    set description(description:string){
        if (TaskValidation.getDescriptionState(description) !== "valid"){
            throw new Error("Description is not valid.");
        }
        (this as unknown as TaskData)._description = description;
    },
    set status(status:Status){
        (this as unknown as TaskData)._status = status;
    },
    set difficulty(difficulty:Difficulty){
        (this as unknown as TaskData)._difficulty = difficulty;
    },
    set creationDate(creationDate:string){
        (this as unknown as TaskData)._creationDate = creationDate;
    },
    set dueDate(dueDate:string | null){
        (this as unknown as TaskData)._dueDate = dueDate;
    },
    set lastEditedDate(lastEditedDate:string | null){
        (this as unknown as TaskData)._lastEditedDate = lastEditedDate;
    }, //-----------------------------
    get id(){
        return (this as unknown as TaskData)._id;
    },
    get difficulty():Difficulty{
        return (this as unknown as TaskData)._difficulty;
    },
    get title():string{
        return (this as unknown as TaskData)._title;
    },
    get description():string{
        return (this as unknown as TaskData)._description;
    },
    get status():Status{
        return (this as unknown as TaskData)._status;
    },
    get creationDate():string{
        return (this as unknown as TaskData)._creationDate;
    },
    get dueDate():string | null{
        return (this as unknown as TaskData)._dueDate;
    },
    get lastEditedDate():string | null {
        return (this as unknown as TaskData)._lastEditedDate;
    }
}

export function createExistingTask(
    id:number,
    title:string,
    description:string,
    status:Status,
    difficulty:Difficulty,
    dueDate:string | null,
    creationDate: string,
    lastEditedDate: string | null
){
    const task = Object.create(taskPrototype) as Task;
    task.id = id;
    task.title = title;
    task.description = description;
    task.status = status;
    task.difficulty = difficulty;
    task.creationDate = creationDate;
    task.dueDate = dueDate;
    task.lastEditedDate = lastEditedDate;
    return task;
}

export function createTask(
    title:string, 
    description:string, 
    status:Status = 1,
    difficulty:Difficulty = 1, 
    dueDate:string | null = null
):Task {
    const task = Object.create(taskPrototype) as Task;
    task.title = title;
    task.description = description;
    task.status = status;
    task.difficulty = difficulty;
    const date = new Date();
    task.creationDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}hs`;
    task.dueDate = dueDate;
    task.lastEditedDate = null;

    return task;
}