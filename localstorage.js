const $addForm = document.querySelector("#taskForm");
const $inputAdd = $addForm.querySelector("#inputTask");
const $addButton = $addForm.querySelector("#addButton");

const $taskList = document.querySelector(".tasks");
const $taskTemplate = $taskList.querySelector("#template-task").content.querySelector(".task");

let tasksFromLocalStorage = JSON.parse(localStorage.getItem("tasks"));
let tasks = tasksFromLocalStorage || [
    {
        id: 1,
        title: "Убраться в комнате",
        completed: true,
    },
    {
        id: 2,
        title: "Поступить в Италию",
        completed: false,
    },
    {
        id: 3,
        title: "Пойти в магазин",
        completed: false,
    }
]
const tasksToTemplate = function () {
    $taskList.innerHTML = "";
    tasks.forEach( task => {
        let $currentTaskHTML = $taskTemplate.cloneNode(true);
        let $currentTaskTitle = $currentTaskHTML.querySelector(".task__title");
        $currentTaskTitle.value = task.title;
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
const getButtonIdByEvent = function (evt) {
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
    const id = getButtonIdByEvent(evt);
    toggleCompleteById(id);
}
const onDeleteButtonClick = function (evt) {
    const id = getButtonIdByEvent(evt);
    deleteTaskById(id);
}
const onTaskChangingChange = function (evt) {
    const $taskTitle = evt.target;
    const taskId = $taskTitle.parentElement.getAttribute("id");
    const id = taskId.substring(4, taskId.length)
    if ($taskTitle.value !== "") {
        changeTaskById(id, $taskTitle.value)
    }
    else{
        deleteTaskById(id);
    }
}

const addListenerToButtons = function () {
    const $tasks = $taskList.querySelectorAll(".task");
    $tasks.forEach( $task => {
       $task.querySelector(".complete__button").addEventListener("click", onCompleteButtonClick);
       $task.querySelector(".delete__button").addEventListener("click", onDeleteButtonClick);
       $task.querySelector(".task__title").addEventListener("change", onTaskChangingChange);
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