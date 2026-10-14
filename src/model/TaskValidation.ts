import type { Difficulty, Status } from "./Task.js";

const PENDING = 1;
const IN_PROGRESS = 2;
const COMPLETED = 3;
const CANCELLED = 4;

const GETALL = 0;

const VALID_STATUS = [PENDING, IN_PROGRESS, CANCELLED, COMPLETED];

const VALID_DIFFICULTIES = [1,2,3];

//normal js object, no instantiation neeeded.
export const TaskValidation = {
    getDescriptionState: getDescriptionState,
    getTitleState: getTitleState,
    isValidStatus: isValidStatus,
    isValidDifficulty:isValidDifficulty,
    CANCELLED:CANCELLED,
    GETALL:GETALL
}

function getDescriptionState(description:string){
    if (description.length > 500 && description.trim() !== ""){
        return "too-long";
    }
    return "valid";
}

function getTitleState(title:string){
    if (title.trim() === ""){
        return "empty";
    } else if (title.length > 100){
        return "too-long";
    }
    return "valid";
}

function isValidDifficulty(difficulty:number): difficulty is Difficulty{
    for (let i = 0; i < VALID_DIFFICULTIES.length; i++) {
        if (difficulty === VALID_DIFFICULTIES[i]){
            return true;
        }
    }
    return false;
}

function isValidStatus(status:number):status is Status{
    for (let i = 0; i < VALID_STATUS.length; i++) {
        if (status ===  VALID_STATUS[i]){
            return true;
        }
    }
    return false;
}
