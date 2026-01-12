let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

let nextId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;

// отсортировка одной задачи
function renderTask(task) {
    const taskElement = document.createElement('div');
    taskElement.className = 'task-item';
    taskElement.dataset.id = task.id;

    // чекбокс
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed

    // при редактировании задачи
    const textSpan = document.createElement('span');
    textSpan.className = 'task-text';
    textSpan.textContent = task.text;
    if (task.completed) textSpan.style.textDecoration = 'line-through'

    // кнопка редак. для актив. задач
    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.innerHTML = '✏️';
    if (task.completed) editBtn.style.display = 'none';
    
    // кнопка удаления
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '🗑️';

    // собираем чё мы тут нае.. сделали..
    taskElement.append(checkbox, textSpan, editBtn, deleteBtn);
    return taskElement;
}

// Распределение задач по колонкам и обновление счётчика
function updateList() {
    const activeList = document.getElementById('active-list');  
    const completedList = document.getElementById('completed-list');

    // очищаем колонки
    activeList.innerHTML = '';
    completedList.innerHTML = '';

    // раскидываем задачи по колонкам
    tasks.forEach(task => {
        const taskElement = renderTask(task);
        if (task.completed) {
            completedList.appendChild(taskElement);
        } else {
            activeList.appendChild(taskElement);
        }
    });

    // обновляем счётчик
    document.getElementById('active-counter').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completed-counter').textContent = tasks.filter(t => t.completed).length;

    // сохраняем в локал сторедж
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Добавление новой задачи
document.getElementById('add-btn').addEventListener('click', addTask);
document.getElementById('task-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    // игнорируем пустые задачи
    if (text === '') return;

    // создаём новую задачу
    tasks.push({
        id: nextId++,
        text: text,
        completed: false
    });

    input.value = '';
    updateList();
}

// обработка событий (кнопки ред и т.д.)
document.addEventListener('click', (e) => {
    const taskElement = e.target.closest('.task-item');
    if (!taskElement) return;
    const taskId = parseInt(taskElement.dataset.id);
    const task = tasks.find(t => t.id === taskId);

    // обработка чекбокса (чтоб переходили туда сюда)
    if (e.target.classList.contains('task-checkbox')) {
        task.completed = e.target.checked;
        updateList();
    }

    // обработка удаления
    if (e.target.classList.contains('delete-btn')) {
        tasks = tasks.filter(t => t.id !== taskId);
        updateList();
    }

    // обработка редактирования
    if (e.target.classList.contains('edit-btn')) {
        const textSpan = taskElement.querySelector('.task-text');
        const currentText = textSpan.textContent;

        // заменяем psan на input
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentText;
        input.className = 'edit-input';

        // Вставляем input вместо span
        textSpan.replaceWith(input);
        input.focus();

        // Сохраняем по Enter
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const newText = input.value.trim();
                if (newText !== '') {
                    task.text = newText;
                    updateList();
                } else {
                    updateList();
                }
            }
        });
        // Отмена редактирования при потери фокуса
        input.addEventListener('blur', () => {
            updateList();
        })
    }
});

updateList();