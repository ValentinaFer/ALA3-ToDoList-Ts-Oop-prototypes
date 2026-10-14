import type { Status, Task } from "./Task.js";
import { TaskValidation } from "./TaskValidation.js";
import { createTask, createExistingTask } from "./Task.js";

let nextId: number = 1;

export type TaskManager = {
    tasks: Task[];
    addTask(title: string, desc: string, status: number, difficulty: number, dueDate: string | null): boolean;
    getTasksToDisplay(state?: number): { id: number, title: string, status: number }[];
    getTaskDataByID(id: number): Task | null;
    cancelTask(id:number):"not-found" | "cancelled" | "already-cancelled" ;
    getTaskReferenceByID(id:number):Task | null;
    editTask(id : number, task:Task): "incorrect" | "not-found" | "not-editable" | "no-changes" | "edited" |  "error-in-editing";
    getTasksByTitle(title:string, tasks?:{id:number, title:string, status: number}[]):{id:number, title:string, status: number}[];
}

const TaskManagerPrototype = {
    addTask: addTask,
    getTasksToDisplay: getTasksToDisplay,
    getTaskDataByID: getTaskDataByID,
    cancelTask:cancelTask,
    getTaskReferenceByID:getTaskReferenceByID,
    editTask:editTask,
    getTasksByTitle:getTasksByTitle
}

export function createTaskManager(): TaskManager {
    const manager: TaskManager = Object.create(TaskManagerPrototype);
    manager.tasks = [];
    return manager;
}

function getTasksByTitle(this:TaskManager, title : string, tasks?:{id:number, title:string, status: number}[]) : {id:number, title:string, status: number}[] {
        if (tasks === undefined){
            tasks = this.getTasksToDisplay();
        }
        let taskToDisplayFiltered = [];
        title = title.toLowerCase();
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];
            if (task !== undefined && task.title.toLowerCase().indexOf(title) !== -1) {
                taskToDisplayFiltered[taskToDisplayFiltered.length] = {title:task.title, id:task.id, status: task.status};
            }
        }
        return taskToDisplayFiltered;
    }

function areTasksTheSame(taskA:Task, taskB:Task) : boolean{
        if (taskA.title !== taskB.title){
            return false;
        }
        if (taskA.description !== taskB.description){
            return false;
        }
        if (taskA.status !== taskB.status){
            return false;
        }
        if (taskA.difficulty !== taskB.difficulty){
            return false;
        }
        if (taskA.dueDate !== taskB.dueDate){
            return false;
        }
        return true;
    }

function editTask(this:TaskManager, id : number, task:Task) : "incorrect" | "not-found" | "not-editable" | "no-changes" | "edited" |  "error-in-editing"{
        if (TaskValidation.getTitleState(task.title) !== "valid" || TaskValidation.getDescriptionState(task.description) !== "valid" || !TaskValidation.isValidStatus(task.status) || !TaskValidation.isValidDifficulty(task.difficulty)){
            return "incorrect";
        }
    
        let taskInArr = this.getTaskReferenceByID(id);
        if (taskInArr === null){
            return "not-found";
        } 
    
        if (taskInArr.status === TaskValidation.CANCELLED){
            return "not-editable";
        }
    
        if (areTasksTheSame(taskInArr, task)){
            return "no-changes";
        }
    
        let date = new Date();
        try {
            taskInArr.title = task.title;
            taskInArr.description = task.description;
            taskInArr.status = task.status;
            taskInArr.difficulty = task.difficulty;
            taskInArr.dueDate = task.dueDate;
            taskInArr.lastEditedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
        } catch (error) {
            return "error-in-editing"; //should never really reach here
        }
        
        return "edited";
    }

function cancelTask(this:TaskManager, id: number): "not-found" | "cancelled" | "already-cancelled" {
    const task = this.getTaskReferenceByID(id);
    if (task === null) {
        return "not-found";
    }
    if (task.status !== TaskValidation.CANCELLED) {
        const date = new Date();
        task.lastEditedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`
        task.status = TaskValidation.CANCELLED as Status;
        return "cancelled";
    } else {
        return "already-cancelled";
    }
}

function getTaskReferenceByID(this:TaskManager, id: number): Task | null {
    for (let i = 0; i < this.tasks.length; i++) {
        const task = this.tasks[i];
        if (task !== undefined && task.id === id) {
            return task;
        }
    }
    return null;
}


function getTaskDataByID(this: TaskManager, id: number): Task | null {
    for (let i = 0; i < this.tasks.length; i++) {
        const task = this.tasks[i];
        if (task !== undefined && task.id === id) {
            return createExistingTask(task.id, task.title, task.description, task.status, task.difficulty, task.dueDate, task.creationDate, task.lastEditedDate);
        }
    }
    return null;
}

function addTask(this: TaskManager, title: string, desc: string, status: number, difficulty: number, dueDate: string) {
    if (TaskValidation.getTitleState(title) !== "valid" || TaskValidation.getDescriptionState(desc) !== "valid" || !TaskValidation.isValidStatus(status) || !TaskValidation.isValidDifficulty(difficulty)) {
        return false;
    }
    const task: Task = createTask(title, desc, status, difficulty, dueDate);
    task.id = nextId++;
    this.tasks[this.tasks.length] = task;
    return true;
}

function getTasksToDisplay(this: TaskManager, state?: number): { id: number, title: string, status: number }[] {
    if (state === undefined){
        state = TaskValidation.GETALL;
    }
    let taskToDisplay = [], task;
    if (state === TaskValidation.GETALL) {
        for (let i = 0; i < this.tasks.length; i++) {
            task = this.tasks[i];
            if (task !== undefined && task.status !== TaskValidation.CANCELLED) {
                taskToDisplay[taskToDisplay.length] =
                {
                    id: task.id,
                    title: task.title,
                    status: task.status
                };
            }
        }
    } else {
        for (let i = 0; i < this.tasks.length; i++) {
            task = this.tasks[i];
            if (task !== undefined && task.status == state) {
                taskToDisplay[taskToDisplay.length] =
                {
                    id: task.id,
                    title: task.title,
                    status: task.status
                };
            }
        }
    }
    return taskToDisplay;
}