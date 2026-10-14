import PromptSync from "prompt-sync";
import type { Task } from "../model/Task.js";
import { TaskValidation } from "../model/TaskValidation.js";

const prompt = PromptSync({ sigint: true });

//normal js object, no instantiation neeeded.
export const Interface = {
    askMainMenuOption: askMainMenuOption,
    askAreYouSure: askAreYouSure,
    getDifficultyString: getDifficultyString,
    getStatusString: getStatusString,
    askDueDateMenu:askDueDateMenu,
    showTaskAndWait:showTaskAndWait,
    showTask:showTask,
    askTaskToEdit: askTaskToEdit,
    askStateChange: askStateChange,
    askDifficulty:askDifficulty,
    askStatus:askStatus,
    askDescription:askDescription,
    askTitle:askTitle,
    askTitleToSearch:askTitleToSearch,
    askFilterToApply:askFilterToApply,
    askFieldToModify:askFieldToModify,
    showMessage:showMessage
}

function askFieldToModify(){
        console.log("-Ingrese el campo que desea modificar-");
        console.log("[1] Titulo");
        console.log("[2] Descripción(opcional)");
        console.log("[3] Estado(opcional)");
        console.log("[4] Dificultad(opcional)");
        console.log("[5] Fecha Vencimiento(opcional)");
        console.log("--------------");
        console.log("[G] Guardar");
        console.log("[C] Cancelar");
        console.log("--------------");
        return prompt("Ingrese una opción: ");
    }

function askFilterToApply(){
        console.log("-----[FILTRANDO]-----");
        console.log("Seleccione una de las opciones para buscar tareas con un estado en especifico:");
        console.log("[1]-Pendiente;");
        console.log("[2]-En Curso;");
        console.log("[3]-Terminada;");
        console.log("[4]-Quiero ver todas!;");
        console.log("[0]-Volver.");
        return prompt(">");
    }

function askTitleToSearch(){
        let title;
        while(true){
            console.log("------[BUSCAR TAREA POR TÍTULO]-------");
            console.log("Ingrese su busqueda, o deje en blanco para volver al menu");
            title = prompt(">");
            if (title.trim().length == 0){
                return null;
            } else {
                return title.toLowerCase();
            }
        }
    }

function askTitle() : string{
        let title, titleState;
        while (true) {
            title = prompt("Ingrese el titulo de la tarea(maximo 100 caracteres): >");
            titleState = TaskValidation.getTitleState(title);
            if (titleState === "too-long") {
                showMessage("[UY!] El titulo no puede superar los 100 caracteres de maximo.", "warning");
            } else if (titleState === "empty") {
                showMessage("[UY!] El titulo no puede estar vacio.", "warning");
            } else {
                return title;
            }
        }
    }

function askDescription() : string{
        let desc, descState;
        while (true) {
            desc = prompt("Ingrese la descripcion de la tarea(maximo 500 caracteres): >");
            descState = TaskValidation.getDescriptionState(desc);
            if (descState === "too-long") {
                showMessage("[UY!] La descripcion no puede superar los 500 caracteres de maximo.", "warning");
            } else if (desc.trim().length === 0 || desc === null) {
                showMessage("[!] La descripcion se guardara vacia.", "info");
                return "";
            } else {
                return desc;
            }
        }
    }

function askStatus() {
        let status;
        while (true) {
            console.log("Ingrese el estado de la tarea: ");
            console.log("[1] Pendiente;");
            console.log("[2] En Curso;");
            console.log("[3] Terminada;");
            status = prompt(">");
            status = Number(status);
            if (TaskValidation.isValidStatus(status) && status !== TaskValidation.CANCELLED) {
                return status;
            } else {
                showMessage("[UY!] Debe ingresar un estado valido.", "warning");
            }
        }
    }

function askDifficulty(){
        let dif;
        while (true) {
            console.log("Ingrese el nivel de dificultad de la tarea: ");
            console.log("[1] Facil");
            console.log("[2] Medio");
            console.log("[3] Dificil");
            dif = prompt(">");
            dif = Number(dif);
            if (!isNaN(dif) && TaskValidation.isValidDifficulty(dif)) {
                return dif;
            } else {
                showMessage("[UY!] Debe ingresar un nivel de dificultad valido.", "warning");
            }
        }
    }

function askStateChange(actualState : number) {
        let option;
        while (true) {
            console.log("Estado de la tarea: " + getStatusString(actualState));
            console.log("Desea cancelar la tarea?(s/n)");
            showMessage("[!] Esta accion no podra ser revertida y la tarea no podra ser editada.", "warning");
            option = prompt(">").toLowerCase();
            if (option === "s" || option === "n"){
                return option;
            } else {
                showMessage("[UY!] Debe ingresar una respuesta valido.", "warning");
            }
        }
    }

function askTaskToEdit(tasks: {id:number, title:string, status : number}[]) : string | null{
        let task;
        if (tasks.length > 0) {
            for (let i = 0; i < tasks.length; i++) {
                task = tasks[i];
                if (task !== undefined){
                    console.log(`[${task.id}]-${task.title} (${getStatusString(task.status)});`);
                }
            }
            console.log("-Seleccione el número de la tarea que desea editar, o [0] para volver.");
            return prompt(">");
        } else {
            showMessage("No se hallaron tareas...", "info");
            console.log("Presione cualquier tecla para volver.");
            prompt(">");
            return null;
        }
    }

function showTaskAndWait(task:Task){
        showTask(task.title, task.description, task.status, task.difficulty, task.creationDate, task.dueDate, task.lastEditedDate);
        console.log("Presione cualquier tecla para volver.");
        prompt("");
    }

function showTask(title:string="", description:string="", status:number=1, difficulty:number=1, creationDate:string|null, dueDate:string|null, lastEditedDate:string|null){
        console.log("-----------------------------------");
        console.log(`Titulo: ${title.trim() !== "" ? title : "No hay título."}`);
        console.log(`Descripcion: ${description.trim() !== "" ? description : "No hay descripción."}`);
        console.log(`Estado: ${getStatusString(status)}`);
        console.log(`Dificultad: ${getDifficultyString(difficulty)}`);
        console.log(`Fecha de creacion: ${creationDate !== null ? creationDate:"--/--/---- --:--hs."}`);
        console.log(`Fecha de vencimiento: ${dueDate !== null ? dueDate : "--/--/----."}`);
        console.log(`Fecha de última edición: ${lastEditedDate !== null ? lastEditedDate : "--/--/----."}`);
        console.log("-----------------------------------");
    }

function askDueDateMenu(actualDueDateStrn : string | null = null) : string | null{
        let option;
        let dateOriginal = actualDueDateStrn;
        let date = dateOriginal;
        let hasDate;
        while (true) {
            hasDate = date !== null;
            if (hasDate) {
                console.log(`[${date}]`);
                console.log("[1] Cambiar Fecha;");
                console.log("[2] Quitar Fecha;");
            } else {
                console.log("No tiene fecha.");
                console.log("[1] Agregar Fecha;");
            }
            console.log("[G] Guardar;");
            console.log("[C] Cancelar;");
    
            option = prompt("Ingrese una opcion: ");
            if (option.toUpperCase() == "G") {
                return date;
            } else if (option.toUpperCase() == "C") {
                return dateOriginal;
            } else if (option == "1") {
                date = askDueDate();
            } else if (option == "2" && hasDate) {
                date = null;
            } else {
                showMessage("[UY!] Debe ingresar una opcion valida del menu.", "warning");
            }
        }
    }

function askDueDate() : string {
        let year : number, month : number, dayNum : number;
        while (true) {
            year = askYear();
            console.log(`[  /  /${year}]`);
            month = askMonth();
            console.log(`[  /${month}/${year}]`);
            dayNum = askDay(year, month);
            return `${dayNum}/${month}/${year}`;
        }
    }

function askYear() : number{
        let year;
        while (true) {
            year = Number(prompt("Ingrese el año: "));
            if (!isNaN(year) && year > 999) {
                return year;
            } else {
                showMessage("[UY!] Debe ingresar un año valido.", "warning");
            }
        }
    }

function askMonth() : number{
        let month;
        while (true) {
            month = Number(prompt("Ingrese el mes: "));
            if (!isNaN(month) && month > 0 && month <= 12) {
                return month;
            } else {
                showMessage("[UY!] Debe ingresar un mes valido.", "warning");
            }
        }
    }

function askDay(year : number, month : number) : number {
        const diasEnMeses = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        let day;
        let bisiesto = ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0));
        let cantDiasMax = diasEnMeses[month - 1];
        if (month == 2 && bisiesto) {
            cantDiasMax = 29;
        }
        while (true) {
            day = Number(prompt("Ingrese el dia: "));
            if (!isNaN(day) && day > 0 && cantDiasMax !== undefined && day <= cantDiasMax) {
                return day;
            } else {
                showMessage("[UY!] Debe ingresar un día valido (1-" + cantDiasMax + ").", "warning");
            }
        }
    }

function askAreYouSure() {
    while (true) {
        showMessage("¿Esta seguro que desea salir?(s/n)", "warning");
        switch (prompt(">").toLowerCase()) {
            case "s":
                return true;
            case "n":
                return false;
            default:
                showMessage("[UY!] Debe ingresar una opcion valida.", "warning");
        }
    }
}

function askMainMenuOption() {
    console.log("-----[TODO LIST]-----");
    console.log("[1]-Agregar una nueva Tarea;");
    console.log("[2]-Modificar una Tarea;");
    console.log("[3]-Cancelar una Tarea;");
    console.log("[4]-Ver todas mis Tareas;");
    console.log("[5]-Buscar una Tarea por Título;");

    console.log("[0]-Salir.");
    return prompt(">");
}

function getStatusString(status:number){
            switch (status) {
            case 1:
                return "Pendiente";
            case 2:
                return "En Curso";
            case 3:
                return "Terminada";
            case 4:
                return "Cancelada";
            default:
                return "[ERROR] estado fuera de rango.";
        }
    }

function getDifficultyString(dif:number){
        switch (dif) {
            case 1: return "*--";
            case 2: return "**-";
            case 3: return "***";
            default: return "[ERROR] dificultad fuera de rango.";
        }
    }

function showMessage(msg: string, type: "success" | "error" | "warning" | "info"): void {
    let color: string;
    switch (type) {
        case "success":
            color = "\x1b[32m";
            break;
        case "error":
            color = "\x1b[31m";
            break;
        case "warning":
            color = "\x1b[33m";
            break;
        default:
            color = "\x1b[36m"
    }
    console.log(`${color}${msg}\x1b[0m`);
}

