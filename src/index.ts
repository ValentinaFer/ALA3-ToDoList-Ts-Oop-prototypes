import {createTask} from "./model/Task.js";
import type {Task} from "./model/Task.js";
import { Controller } from "./controller/Controller.js";

const task:Task = createTask("titulo", "dasdfasdf", 1);

console.log(task);

Controller.showMainMenu();
