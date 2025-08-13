//  Animated Stars 
function createStars() {
    const starsContainer = document.getElementById('stars');
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = Math.random() * 3 + 1 + 'px';
        star.style.height = star.style.width;
        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 3 + 2) + 's';
        starsContainer.appendChild(star);
    }
}

//  Task Storage 
let tasks = {
    'urgent-important': [],
    'urgent-not-important': [],
    'not-urgent-important': [],
    'not-urgent-not-important': []
};
let completedTasks = [];
let taskIdCounter = 0;

//  LocalStorage 
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    const savedCompleted = localStorage.getItem('completedTasks');
    const savedCounter = localStorage.getItem('taskIdCounter');
    if (savedTasks) tasks = JSON.parse(savedTasks);
    if (savedCompleted) completedTasks = JSON.parse(savedCompleted);
    if (savedCounter) taskIdCounter = parseInt(savedCounter, 10);
}
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    localStorage.setItem('taskIdCounter', taskIdCounter);
}

//  Navigation 
function showMatrix() {
    document.getElementById('matrix-page').style.display = 'block';
    document.getElementById('completed-page').style.display = 'none';
    document.querySelector('.nav-btn:nth-child(1)').classList.add('active');
    document.querySelector('.nav-btn:nth-child(2)').classList.remove('active');
}
function showCompleted() {
    document.getElementById('matrix-page').style.display = 'none';
    document.getElementById('completed-page').style.display = 'block';
    document.querySelector('.nav-btn:nth-child(1)').classList.remove('active');
    document.querySelector('.nav-btn:nth-child(2)').classList.add('active');
    updateCompletedPage();
}

//  Add Task 
function addTask(category) {
    const input = document.getElementById(category + '-input');
    const text = input.value.trim();
    if (text === '') return;
    const task = {
        id: ++taskIdCounter,
        text: text,
        category: category,
        completed: false,
        completedAt: null
    };
    tasks[category].push(task);
    input.value = '';
    renderTasks(category);
    saveTasks();
}

//  Render Tasks 
function renderTasks(category) {
    const container = document.getElementById(category + '-tasks');
    container.innerHTML = '';
    tasks[category].forEach(task => {
        if (!task.completed) {
            const taskElement = createTaskElement(task);
            container.appendChild(taskElement);
        }
    });
}

//  Create Task Element (with edit feature) 
function createTaskElement(task) {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'task-item';

    // Editable text
    const textDiv = document.createElement('div');
    textDiv.className = 'task-text';
    textDiv.textContent = task.text;
    textDiv.title = "Click to edit";
    textDiv.style.cursor = "pointer";
    textDiv.onclick = function () {
        editTask(task, textDiv);
    };

    taskDiv.innerHTML = `
        <div class="task-checkbox" title="Mark complete" onclick="completeTask(${task.id}, '${task.category}')"></div>
    `;
    taskDiv.appendChild(textDiv);

    const delBtn = document.createElement('button');
    delBtn.className = 'delete-btn';
    delBtn.textContent = '×';
    delBtn.title = "Delete";
    delBtn.onclick = function () {
        deleteTask(task.id, task.category);
    };
    taskDiv.appendChild(delBtn);

    return taskDiv;
}

//  Edit Task 
function editTask(task, textDiv) {
    const input = document.createElement('input');
    input.type = 'text';
    input.value = task.text;
    input.className = 'edit-input';
    input.style.width = '80%';
    textDiv.replaceWith(input);
    input.focus();

    input.onblur = input.onkeydown = function (e) {
        if (e.type === 'blur' || e.key === 'Enter') {
            task.text = input.value.trim() || task.text;
            saveTasks();
            renderTasks(task.category);
        }
    };
}

//  Complete Task 
function completeTask(taskId, category) {
    const task = tasks[category].find(t => t.id === taskId);
    if (task) {
        task.completed = true;
        task.completedAt = new Date().toISOString();
        completedTasks.push(task);
        sendTaskToGoogleSheet(task); 
        renderTasks(category);
        saveTasks();
        launchRocket();
        showCompletionMessage();
    }
}

//  Launch Rocket Animation 
function launchRocket() {
    const rocket = document.createElement('div');
    rocket.innerHTML = '🚀';
    rocket.className = 'rocket-launch';
    rocket.style.left = Math.random() * (window.innerWidth - 50) + 'px';
    rocket.style.bottom = '0px';
    document.body.appendChild(rocket);
    setTimeout(() => {
        rocket.remove();
    }, 2000);
}

//  Delete Task 
function deleteTask(taskId, category) {
    tasks[category] = tasks[category].filter(t => t.id !== taskId);
    renderTasks(category);
    saveTasks();
}

// Completion Message 
function showCompletionMessage() {
    const messages = [
        "Mission Accomplished! 🚀",
        "Houston, we have success! 🌟",
        "Stellar performance, Commander! ⭐",
        "Launch successful! 🛸",
        "You're out of this world! 🌌"
    ];
    const message = messages[Math.floor(Math.random() * messages.length)];
    const msgDiv = document.createElement('div');
    msgDiv.innerHTML = message;
    msgDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #1e88e5, #1976d2);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.5rem;
        font-weight: 700;
        z-index: 1000;
        animation: popIn 0.5s ease-out;
        border: 2px solid #64b5f6;
        box-shadow: 0 0 30px rgba(30, 136, 229, 0.5);
        font-family: 'Orbitron', sans-serif;
    `;
    document.body.appendChild(msgDiv);
    setTimeout(() => {
        msgDiv.remove();
    }, 3000);
}

// Completed Page
function updateCompletedPage() {
    document.getElementById('total-completed').textContent = completedTasks.length;
    const urgentCompleted = completedTasks.filter(t =>
        t.category === 'urgent-important' || t.category === 'urgent-not-important'
    ).length;
    document.getElementById('urgent-completed').textContent = urgentCompleted;
    const importantCompleted = completedTasks.filter(t =>
        t.category === 'urgent-important' || t.category === 'not-urgent-important'
    ).length;
    document.getElementById('important-completed').textContent = importantCompleted;

    const completedList = document.getElementById('completed-tasks-list');
    completedList.innerHTML = '';
    if (completedTasks.length === 0) {
        completedList.innerHTML = `
            <div style="text-align: center; opacity: 0.7; padding: 40px;">
                <div style="font-size: 4rem; margin-bottom: 15px;">🌌</div>
                <p>No missions completed yet!</p>
                <p style="font-size: 0.9rem; margin-top: 10px;">Time to launch some rockets, Commander! 🚀</p>
            </div>
        `;
        return;
    }
    // Group by date
    const groupedTasks = {};
    completedTasks.forEach(task => {
        const date = new Date(task.completedAt).toDateString();
        if (!groupedTasks[date]) groupedTasks[date] = [];
        groupedTasks[date].push(task);
    });
    Object.keys(groupedTasks).reverse().forEach(date => {
        const dateDiv = document.createElement('div');
        dateDiv.innerHTML = `<h3 style="margin: 20px 0 15px 0; color: #4caf50; font-family: 'Orbitron', sans-serif;">${date}</h3>`;
        completedList.appendChild(dateDiv);
        groupedTasks[date].forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.className = 'task-item';
            taskDiv.innerHTML = `
                <div class="task-checkbox checked"></div>
                <div class="task-text completed">${task.text}</div>
                <span style="opacity: 0.6; font-size: 0.8rem; color: #90caf9;">${getCategoryLabel(task.category)}</span>
            `;
            completedList.appendChild(taskDiv);
        });
    });
}

//Category Label
function getCategoryLabel(category) {
    const labels = {
        'urgent-important': '🔴 Critical',
        'urgent-not-important': '🟡 Support',
        'not-urgent-important': '🔵 Exploration',
        'not-urgent-not-important': '🟣 Leisure'
    };
    return labels[category] || category;
}

//  Keypress Listeners 
document.addEventListener('DOMContentLoaded', function () {
    createStars();
    loadTasks();

    // Add sample tasks only if no tasks loaded
    if (
        Object.values(tasks).every(arr => arr.length === 0) &&
        completedTasks.length === 0
    ) {
        tasks['urgent-important'].push({
            id: ++taskIdCounter,
            text: 'Launch satellite deployment',
            category: 'urgent-important',
            completed: false
        });
        tasks['not-urgent-important'].push({
            id: ++taskIdCounter,
            text: 'Plan Mars expedition',
            category: 'not-urgent-important',
            completed: false
        });
        tasks['not-urgent-not-important'].push({
            id: ++taskIdCounter,
            text: 'Watch space documentaries',
            category: 'not-urgent-not-important',
            completed: false
        });
        saveTasks();
    }

    Object.keys(tasks).forEach(category => {
        renderTasks(category);
    });

    const inputs = document.querySelectorAll('.task-input input');
    inputs.forEach(input => {
        input.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                const category = this.id.replace('-input', '');
                addTask(category);
            }
        });
    });
});

// Pop-in Animation for Completion Message
const style = document.createElement('style');
style.textContent = `
    @keyframes popIn {
        0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Send Task to Google Sheet 
// UPDATED Send Task to Google Sheet function - Fixed data structure
function sendTaskToGoogleSheet(task) {
    const scriptURL = 'https://script.google.com/macros/s/AKfycbwWBneY7rAiSxZC_DkzH8mXsn5JpZ64-9lgTm4OfdsWTzZ0Lq-9tJ7nKH7BbCroE2Qc/exec';
    
    // Create a clean data object with all required fields
    const taskData = {
        taskId: task.id,
        taskText: task.text,
        taskCategory: task.category,
        completedAt: task.completedAt || new Date().toISOString()
    };
    
    console.log('Sending task data to Google Sheets:', taskData);
    
    fetch(scriptURL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
    })
    .then(response => {
        console.log('Task sent to Google Sheets successfully');
    })
    .catch(error => {
        console.error('Error sending task to Google Sheets:', error);
    });
}

//  Export Completed Tasks to CSV
function exportCompletedTasksToCSV() {
    if (completedTasks.length === 0) {
        alert("No completed tasks to export!");
        return;
    }
    const header = ["Date Completed", "Task", "Category"];
    const rows = completedTasks.map(task => [
        new Date(task.completedAt).toLocaleString(),
        `"${task.text.replace(/"/g, '""')}"`,
        getCategoryLabel(task.category)
    ]);
    let csvContent = header.join(",") + "\n" + rows.map(r => r.join(",")).join("\n");

    // Download as CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "completed_tasks.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

