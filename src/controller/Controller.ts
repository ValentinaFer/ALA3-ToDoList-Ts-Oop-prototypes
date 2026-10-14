import { Interface } from "../interface/Interface.js";
import type { Task } from "../model/Task.js";
import { createTaskManager } from "../model/TaskManager.js";
import type { TaskManager } from "../model/TaskManager.js";

const taskManager: TaskManager = createTaskManager();

export const Controller = {
    showMainMenu: showMainMenu,
}

function createTask() {
    let option: string, title: string = "", description: string = "", dueDate: string | null = null;
    let status: number = 1, difficulty: number = 1;
    while (true) {
        Interface.showTask(title, description, status, difficulty, null, dueDate, null);
        option = Interface.askFieldToModify();

        switch (option.toUpperCase()) {
            case "1":
                title = Interface.askTitle();
                break;
            case "2":
                description = Interface.askDescription();
                break;
            case "3":
                status = Interface.askStatus();
                break;
            case "4":
                difficulty = Interface.askDifficulty();
                break;
            case "5":
                dueDate = Interface.askDueDateMenu(dueDate);
                break;
            case "G":
                if (title === "") {
                    Interface.showMessage("[UY!] El titulo de la tarea no puede estar vacio.", "warning");
                } else {
                    if (taskManager.addTask(title, description, status, difficulty, dueDate)) {
                        Interface.showMessage("[Exito!] La tarea fue creada con exito.", "success");
                    } else {
                        Interface.showMessage("[Error!] La tarea no pudo ser creada.", "error");
                    }
                    return;
                }
                break;
            case "C":
                Interface.showMessage("[<-] Volviendo al menu.", "info");
                return;
            default:
                Interface.showMessage("[UY!] Debe ingresar una de las opciones del menu.", "info");
                break;
        }
    }
}

function getTasksFiltered() {
    let option: number;
    while (true) {
        option = Number(Interface.askFilterToApply());
        switch (option) {
            case 0:
                Interface.showMessage("[<-] Volviendo al menu.", "info");
                return null;
            case 1:
            case 2:
            case 3:
                return taskManager.getTasksToDisplay(option);
            case 4:
                return taskManager.getTasksToDisplay();
            default:
                Interface.showMessage("[UY!] Debe ingresar una opcion valida del menu.", "warning");
                break;
        }
    }
}

function selectTask(tasks = getTasksFiltered()): Task | null {
    if (tasks === null) {
        return null;
    }
    let selectedId;
    while (true) {
        selectedId = Interface.askTaskToEdit(tasks);
        if (selectedId === null || selectedId === "0") {
            Interface.showMessage("[<-] Volviendo al menu.", "info");
            return null;
        } else if (selectedId.trim() !== "") {
            selectedId = Number(selectedId);
            if (isNaN(selectedId)) {
                Interface.showMessage("[UY!] Debe ingresar un id valido.", "info");
            } else {
                if (isIdInTasks(selectedId, tasks)) {
                    return taskManager.getTaskDataByID(selectedId);
                } else {
                    Interface.showMessage("[UY!] El ID que ha seleccionado no se encuentra en la lista.", "warning");
                }
            }
        } else {
            Interface.showMessage("[UY!] Debe ingresar un ID valido de la lista", "warning");
        }
    }
}

function isIdInTasks(id: number, tasks: Task[] | { id: number, title: string, status: number }[]) {
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        if (task !== undefined && task.id === id) {
            return true;
        }
    }
    return false;
}

function cancelTask(task: Task) {
    let option: string;
    while (true) {
        option = Interface.askStateChange(task.status);
        if (option === "s") {
            switch (taskManager.cancelTask(task.id)) {
                case "cancelled":
                    Interface.showMessage("[Exito!] La tarea fue cancelada con exito.", "success");
                    break;
                case "not-found":
                    Interface.showMessage("[Error] La tarea no fue encontrada.", "error");
                    break;
                case "already-cancelled":
                    Interface.showMessage("[!] La tarea ya esta cancelada", "info");
                    break;
            }
            return;
        } else if (option === "n") {
            Interface.showMessage("[<-] Volviendo al menu.", "info");
            return;
        } else {
            Interface.showMessage("[UY!] Debe ingresar una opcion valida.", "warning");
        }
    }
}

function editTask(task: Task) {
    let option: string;
    while (true) {
        Interface.showTask(task.title, task.description, task.status, task.difficulty, task.creationDate, task.dueDate, task.lastEditedDate);
        option = Interface.askFieldToModify();
        switch (option.toUpperCase()) {
            case "1":
                task.title = Interface.askTitle();
                break;
            case "2":
                task.description = Interface.askDescription();
                break;
            case "3":
                task.status = Interface.askStatus();
                break;
            case "4":
                task.difficulty = Interface.askDifficulty();
                break;
            case "5":
                task.dueDate = Interface.askDueDateMenu(task.dueDate);
                break;
            case "G":
                switch (taskManager.editTask(task.id, task)) {
                    case "edited":
                        Interface.showMessage("[Exito!] La tarea fue editada con exito.", "success");
                        break;
                    case "no-changes":
                        Interface.showMessage("[Info!] No hubieron cambios.", "info");
                        break;
                    case "incorrect":
                        Interface.showMessage("[Error!] La tarea no es valida.", "error");
                        break;
                    case "not-editable":
                        Interface.showMessage("[Error!] La tarea no puede ser editada.", "error");
                        break;
                    case "not-found":
                        Interface.showMessage("[Error!] La tarea no fue encontrada para editar!", "error");
                    case "error-in-editing":
                        Interface.showMessage("[Error!] Sucedio un error inesperado al editar la tarea!", "error");
                }
                return;
            case "C":
                Interface.showMessage("[<-] Volviendo al menu.", "info");
                return;
            default:
                Interface.showMessage("[UY!] Debe ingresar una de las opciones del menu.", "info");
                break;
        }
    }

}

function showMainMenu() {
    let option: string, task: Task | null;
    while (true) {
        option = Interface.askMainMenuOption();
        switch (option.toUpperCase()) {
            case "1":
                createTask();
                break;
            case "2":
                task = selectTask();
                if (task !== null) {
                    editTask(task);
                }
                break;
            case "3":
                task = selectTask();
                if (task !== null) {
                    cancelTask(task);
                }
                break;
            case "4":
                task = selectTask();
                if (task !== null) {
                    Interface.showTaskAndWait(task);
                }
                break;
            case "5":
                let title = Interface.askTitleToSearch();
                if (title !== null){
                    task = selectTask(taskManager.getTasksByTitle(title));
                    if (task !== null){
                        editTask(task);
                    }
                } else {
                    Interface.showMessage("[<-] Volviendo al menu", "info");
                }
                break;
            case "0":
                if (Interface.askAreYouSure()) {
                    return;
                }
                break;
            default:
                Interface.showMessage("[UY!] Debe ingresar una opcion valida del menu", "warning");
                break;
        }
    }
}

