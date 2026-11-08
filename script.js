
/* 1. Récupérer les éléments HTML */

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");

const filterButtons = document.querySelectorAll(".filter-btn");
const clearCompletedButton = document.getElementById("clearCompleted");

/* 2. Initialiser les tâches */

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

/* 3. Sauvegarder les tâches */

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* 4. Afficher les tâches */

function displayTasks() {

    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function(task) {

        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function(task) {

        const li = document.createElement("li");
        li.classList.add("task");

        if (task.completed) {
            li.classList.add("completed");
        }

        /* Texte de la tâche */

        const span = document.createElement("span");
        span.textContent = task.text;

        /* Bouton terminer */

        const completeButton = document.createElement("button");

        completeButton.textContent = task.completed
            ? "Annuler"
            : "Terminer";

        completeButton.addEventListener("click", function() {
            toggleTask(task.id);
        });

        /* Bouton modifier */

        const editButton = document.createElement("button");

        editButton.textContent = "Modifier";

        editButton.addEventListener("click", function() {
            editTask(task.id);
        });

        /* Bouton supprimer */

        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Supprimer";
        deleteButton.classList.add("delete-btn");

        deleteButton.addEventListener("click", function() {
            deleteTask(task.id);
        });

        /* Ajouter les éléments dans la liste */

        li.appendChild(span);
        li.appendChild(completeButton);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    /* Compter les tâches restantes */

    const remainingTasks = tasks.filter(function(task) {
        return !task.completed;
    }).length;

    taskCount.textContent = remainingTasks +
        (remainingTasks > 1
            ? " tâches restantes"
            : " tâche restante");
}

/* 5. Ajouter une tâche */

taskForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Veuillez saisir une tâche !");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    displayTasks();

    taskInput.value = "";
});

/* 6. Terminer ou réactiver une tâche */

function toggleTask(id) {

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            return {
                ...task,
                completed: !task.completed
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

/* 7. Modifier une tâche */

function editTask(id) {

    const task = tasks.find(function(task) {
        return task.id === id;
    });

    if (!task) {
        return;
    }

    const newText = prompt("Modifier votre tâche :", task.text);

    if (newText === null) {
        return;
    }

    if (newText.trim() === "") {
        alert("La tâche ne peut pas être vide !");
        return;
    }

    tasks = tasks.map(function(task) {

        if (task.id === id) {
            return {
                ...task,
                text: newText.trim()
            };
        }

        return task;
    });

    saveTasks();
    displayTasks();
}

/* 8. Supprimer une tâche */

function deleteTask(id) {

    tasks = tasks.filter(function(task) {
        return task.id !== id;
    });

    saveTasks();
    displayTasks();
}

/* 9. Filtrer les tâches */

filterButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        currentFilter = button.dataset.filter;

        filterButtons.forEach(function(btn) {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        displayTasks();
    });
});

/* 10. Supprimer les tâches terminées */

clearCompletedButton.addEventListener("click", function() {

    tasks = tasks.filter(function(task) {
        return !task.completed;
    });

    saveTasks();
    displayTasks();
});

/* 11. Afficher les tâches au démarrage */

displayTasks();
