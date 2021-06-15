let task = document.querySelector(".task");
let taskMethods = {
    normal () {
        task.classList.remove("task__deleteOpen");
        task.classList.remove("task__completeOpen");
        task.classList.remove("task__deleting");
        task.classList.remove("task__completing");
    },
    deleteOpen () {
        task.classList.add("task__deleteOpen");
        task.classList.remove("task__completeOpen");
        task.classList.remove("task__deleting");
        task.classList.remove("task__completing");
    },
    completeOpen (){
        task.classList.remove("task__deleteOpen");
        task.classList.add("task__completeOpen");
        task.classList.remove("task__deleting");
        task.classList.remove("task__completing");
    },
    deleting () {
        task.classList.remove("task__deleteOpen");
        task.classList.remove("task__completeOpen");
        task.classList.add("task__deleting");
        task.classList.remove("task__completing");
    },
    completing () {
        task.classList.remove("task__deleteOpen");
        task.classList.remove("task__completeOpen");
        task.classList.remove("task__deleting");
        task.classList.add("task__completing");
    },
    complete () {
        task.classList.remove("task__completing");
        task.classList.remove("task__completeOpen");
        task.classList.toggle("task__complete");   
    },
    delete () {
        task.classList.remove("task__deleting");
        task.classList.remove("task__deleteOpen");
        task.classList.toggle("task__delete");   
    }

}
const onTaskMouseDown = function (evt) {
    let firstX = evt.pageX;
    let firstTransform = task.style.transform;
    const onTaskMouseMove = function (evt) {
        let diffX = evt.pageX - firstX;
        if (diffX > 210) {
            taskMethods.deleting();
            task.style.transform = `translateX(210px)`;
        }
        else if (diffX < -210) {
            taskMethods.completing();
            task.style.transform = `translateX(-210px)`;
        }
        else if (diffX > 150) {
            taskMethods.deleting();
            task.style.transform = `translateX(${diffX}px)`;
        }
        else if (diffX < -150){
            taskMethods.completing();
            task.style.transform = `translateX(${diffX}px)`;
        }
        else{
            if (task.classList.contains("task__completeOpen")) {
                // task.style.transform = `translateX(${-90 + diffX}px)`;   
            }
            else if (task.classList.contains("task__deleteOpen")) {
                // task.style.transform = `translateX(${90 + diffX}px)`;   
            }
            else{
                taskMethods.normal();
                task.style.transform = `translateX(${diffX}px)`;
            }
            
        }
        
    } 
    const onTaskMouseUp = function (evt) {
        task.style.transition = "all 0.3s ease";
        task.style.transform = "";
        let lastX = evt.pageX;
        if (task.classList.contains("task__deleting")) {
            taskMethods.delete();
        }
        else if (task.classList.contains("task__completing")) {
            taskMethods.complete();
        }
        else if (task.classList.contains("task__completeOpen")) {
            // taskMethods.complete();
            taskMethods.normal();
        }
        else if (task.classList.contains("task__deleteOpen")) {
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
            task.style.transition = "0s";
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
task.addEventListener("mousedown", onTaskMouseDown);
task.addEventListener("touchstart", onTaskMouseDown);



// Complete Button
const completeButton = document.querySelector(".complete__button");
const onCompleteButtonClick = function () {
    taskMethods.complete();
}
completeButton.addEventListener("click", onCompleteButtonClick);


// Delete Button
const deleteButton = document.querySelector(".delete__button");
const onDeleteButtonClick = function () {
    taskMethods.delete();
}
deleteButton.addEventListener("click", onDeleteButtonClick);
