const $addForm = document.querySelector("#taskForm");
const $inputAdd = $addForm.querySelector("#inputTask");
const $addButton = $addForm.querySelector("#addButton");

const $taskList = document.querySelector(".tasks");
const $taskTemplate = $taskList.querySelector("#template-task").content.querySelector(".task");

let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
let tasks = tasksFromLocalStorage || [
    {
        id: 1,
        title: "Hello, crazy horse",
        completed: false,
    },
    {
        id: 2,
        title: "Swipe left to complete",
        completed: false,
    },
    {
        id: 3,
        title: "Swipe left to delete",
        completed: false,
    }
]
const tasksToTemplate = function () {
    $taskList.innerHTML = "";
    tasks.forEach( task => {
        let $currentTaskHTML = $taskTemplate.cloneNode(true);
        let $currentTaskTitle = $currentTaskHTML.querySelector(".task__title");
        $currentTaskTitle.textContent = task.title;
        if (task.completed) {
            $currentTaskHTML.classList.add("completed");
        }
        $currentTaskHTML.setAttribute("id", `task${task["id"]}`);
        $taskList.appendChild($currentTaskHTML);
    })
    addListenerToButtons();
}
const addNewTask = function (inputValue) {
    const newTask = {
        id: tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1,
        title: inputValue,
        completed: false,
    }
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks))
    tasksToTemplate();
}
const getTaskIdByEvent = function (evt) {
    const $button = evt.target;
    let $parent = $button.parentElement;
    while (!$parent.classList.contains("task")) {
        $parent = $parent.parentElement;
    }
    const buttonId = $parent.getAttribute("id");
    return buttonId.substring(4, buttonId.length)
}

// Изменение данных
const toggleCompleteById = function (id) {
    let changingTask = tasks.find( task => {
        return task["id"] === parseInt(id);
    })
    changingTask["completed"] = !changingTask["completed"];
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasksToTemplate();
}
const deleteTaskById = function (id) {
    tasks = tasks.filter( task => {
        return task["id"] != parseInt(id);
    })
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasksToTemplate();
}
const changeTaskById = function (id, taskTitle) {
    let changingTask = tasks.find( task => {
        return task["id"] === parseInt(id);
    })
    changingTask["title"] = taskTitle;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    tasksToTemplate();
}

// Функции-обработчики
const onCompleteButtonClick = function (evt) {
    const id = getTaskIdByEvent(evt);
    toggleCompleteById(id);
}
const onDeleteButtonClick = function (evt) {
    const id = getTaskIdByEvent(evt);
    deleteTaskById(id);
}
const onTaskChangingChange = function (evt) {
    const $taskTitle = evt.target;
    const taskId = $taskTitle.parentElement.getAttribute("id");
    const id = taskId.substring(4, taskId.length)
    if ($taskTitle.textContent !== "") {
        changeTaskById(id, $taskTitle.textContent)
    }
    else{
        deleteTaskById(id);
    }
}
const onTaskMouseDown = function (evt) {
    let mouseDownX = evt.pageX;
    let id = getTaskIdByEvent(evt);    
    let $task = document.querySelector(`#task${id}`);
    let taskMethods = {
        normal () {
            $task.classList.remove("task__deleteOpen");
            $task.classList.remove("task__completeOpen");
            $task.classList.remove("task__deleting");
            $task.classList.remove("task__completing");
        },
        deleteOpen () {
            $task.classList.add("task__deleteOpen");
            $task.classList.remove("task__completeOpen");
            $task.classList.remove("task__deleting");
            $task.classList.remove("task__completing");
        },
        completeOpen (){
            $task.classList.remove("task__deleteOpen");
            $task.classList.add("task__completeOpen");
            $task.classList.remove("task__deleting");
            $task.classList.remove("task__completing");
        },
        deleting () {
            $task.classList.remove("task__deleteOpen");
            $task.classList.remove("task__completeOpen");
            $task.classList.add("task__deleting");
            $task.classList.remove("task__completing");
        },
        completing () {
            $task.classList.remove("task__deleteOpen");
            $task.classList.remove("task__completeOpen");
            $task.classList.remove("task__deleting");
            $task.classList.add("task__completing");
        },
        complete () {
            $task.classList.remove("task__completing");
            $task.classList.remove("task__completeOpen");
            $task.classList.toggle("task__complete");   
        },
        delete () {
            $task.classList.remove("task__deleting");
            $task.classList.remove("task__deleteOpen");
            $task.classList.toggle("task__delete");   
        }
    }
    let firstX = evt.pageX;
    const onTaskMouseMove = function (evt) {
        let diffX = evt.pageX - firstX;
        if (diffX > 210) {
            taskMethods.deleting();
            $task.style.transform = `translateX(210px)`;
        }
        else if (diffX < -210) {
            taskMethods.completing();
            $task.style.transform = `translateX(-210px)`;
        }
        else if (diffX > 150) {
            taskMethods.deleting();
            $task.style.transform = `translateX(${diffX}px)`;
        }
        else if (diffX < -150){
            taskMethods.completing();
            $task.style.transform = `translateX(${diffX}px)`;
        }
        else{
            if ($task.classList.contains("task__completeOpen")) {
            }
            else if ($task.classList.contains("task__deleteOpen")) {
            }
            else{
                taskMethods.normal();
                $task.style.transform = `translateX(${diffX}px)`;
            }   
        } 
    } 
    const onTaskMouseUp = function (evt) {
        $task.style.transition = "all 0.3s ease";
        $task.style.transform = "";
        let lastX = evt.pageX;
        if ($task.classList.contains("task__deleting")) {
            taskMethods.delete();
            onDeleteButtonClick(evt);
        }
        else if ($task.classList.contains("task__completing")) {
            taskMethods.complete();
            onCompleteButtonClick(evt);
        }
        else if ($task.classList.contains("task__completeOpen")) {
            // taskMethods.complete();
            taskMethods.normal();
        }
        else if ($task.classList.contains("task__deleteOpen")) {
            // taskMethods.delete();
            taskMethods.normal();
        }
        else if (lastX - firstX > 30) {
            taskMethods.deleteOpen();
        }
        else if (lastX - firstX < -30) {
            taskMethods.completeOpen();
        }
        else{
            taskMethods.normal();
        }
        setTimeout(() => {
            $task.style.transition = "0s";
        }, 300);
        window.removeEventListener("mousemove", onTaskMouseMove)
        window.removeEventListener("mouseup", onTaskMouseUp);
        window.removeEventListener("touchmove", onTaskMouseMove)
        window.removeEventListener("touchstart", onTaskMouseUp);
    }
    window.addEventListener("mousemove", onTaskMouseMove)
    window.addEventListener("mouseup", onTaskMouseUp);
    window.addEventListener("touchmove", onTaskMouseMove)
    window.addEventListener("touchend", onTaskMouseUp);
    
}
const addListenerToButtons = function () {
    const $tasks = $taskList.querySelectorAll(".task");
    $tasks.forEach( $task => {
       $task.querySelector(".complete__button").addEventListener("click", onCompleteButtonClick);
       $task.querySelector(".delete__button").addEventListener("click", onDeleteButtonClick);
       $task.querySelector(".task__title").addEventListener("change", onTaskChangingChange);
       $task.addEventListener("mousedown", onTaskMouseDown);
       $task.addEventListener("touchstart", onTaskMouseDown);
    })
}
const onAddButtonClick = function (evt) {
    evt.preventDefault();
    if ($inputAdd.value != "") {
        addNewTask($inputAdd.value);        
        $inputAdd.value = "";
    }
}
$addButton.addEventListener("click", onAddButtonClick);
tasksToTemplate();