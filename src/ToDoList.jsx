import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from 'date-fns';

function ToDoList() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [filterKeyword, setFilterKeyword] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false); 
    const [editTaskValue, setEditTaskValue] = useState(''); 
    const [taskFilter, setTaskFilter] = useState('all');
    const [currentDay, setCurrentDay] = useState('');

    function handleInputChange(event) {
        setNewTask(event.target.value);
    }

    function addTask() {
        if (newTask.trim() !== '' && !tasks.some(task => task.text === newTask.trim())) {
            const newTaskObject = {
                text: newTask.trim(),
                timeAdded: new Date().getTime(),
                id: new Date().getTime(), 
                completed: false
            };           
            setTasks((prevTasks) => [...prevTasks, newTaskObject]);
            setNewTask('');
        } else if (tasks.some(task => task.text === newTask.trim())) {
            alert("Task already exists!");
        }
    }
    // function addTask() {
    //     if (newTask.trim() !== '') {
    //         setTasks((task) => [...task, newTask]);
    //         setNewTask('');
    //     }
    // }

    function deleteTask(index){
        const confirmDelete = window.confirm('Are you sure you want to delete this task?')
        if(confirmDelete){
            const updatedTasks = tasks.filter((_,i)=> i!==index )
            setTasks(updatedTasks)
        }
    }

    function moveTaskUp(index) {
        if (index > 0) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index - 1]] = [updatedTasks[index - 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function moveTaskDown(index) {
        if (index < tasks.length - 1) {
            const updatedTasks = [...tasks];
            [updatedTasks[index], updatedTasks[index + 1]] = [updatedTasks[index + 1], updatedTasks[index]];
            setTasks(updatedTasks);
        }
    }

    function openEditModal(index){
        setEditTaskValue(tasks[index].text)
        setEditIndex(index)
        setShowEditModal(true)
    }

    function handleEditInputChange(event){
        setEditTaskValue(event.target.value)
    }

    function saveEditTask() {
        const updatedText = editTaskValue.trim();
        if (updatedText === "") {
            alert("Task cannot be empty");
            return;
        }
    
        const isDuplicate = tasks.some((task, index) => task.text.toLowerCase() === updatedText.toLowerCase() && index !== editIndex);
    
        if (isDuplicate) {
            alert("This task already exists!");
            return;
        }

        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = { 
            ...updatedTasks[editIndex], 
            text: updatedText,
            timeEdited: new Date().getTime() 
        };
    
        setTasks(updatedTasks);
        closeEditModal();
    }
    

    function closeEditModal() {
        setShowEditModal(false);
        setEditTaskValue('');
        setEditIndex(null);
    }

    function handleCheckboxChange(index) {
        const updatedTasks = [...tasks];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTasks(updatedTasks);
    }

    function handleFilterChange(event){
        setFilterKeyword(event.target.value)
    }
    const searchedTask = tasks.filter(task =>
        task.text.toLowerCase().includes(filterKeyword.toLowerCase())
    );
    
    function handleTaskFilterChange(event) {
        setTaskFilter(event.target.value);
    }
    

    const filteredTasks = tasks.filter(task => {
        const matchesKeyword = task.text.toLowerCase().includes(filterKeyword.toLowerCase());
        const matchesFilter = taskFilter === 'all' || 
            (taskFilter === 'completed' && task.completed) || 
            (taskFilter === 'incomplete' && !task.completed);
        
        return matchesKeyword && matchesFilter;
    });

    useEffect(() => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const date = new Date();
        setCurrentDay(`${days[date.getDay()]}, ${date.toLocaleDateString()}`);
      }, []);

    const totalTasks = filteredTasks.length;

    return (
        <>
            <div className="to-do-list">
                <h1>To-Do List</h1>
                <p className="motivational-text">Start today with a plan—let's get things done!</p>
                <p>{currentDay}</p>
                <p>{totalTasks}</p>
                <div>
                    <input
                        type="text"
                        placeholder="Enter a Task..."
                        value={newTask}
                        onChange={handleInputChange}
                    />
                    <button className="add-button" onClick={addTask}>
                        Add
                    </button>
                </div>
                <div className="search-container">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filterKeyword}
                        onChange={handleFilterChange}
                    />
                </div>
                <div className="filter-container">
                <label htmlFor="task-filter" className="filter-label">Filter by: </label>
                <select id="task-filter" className="filter-select" onChange={handleTaskFilterChange} value={taskFilter}>
                    <option value="all">All Tasks</option>
                    <option value="completed">Completed Tasks</option>
                    <option value="incomplete">Incomplete Tasks</option>
                </select>
                </div>
            </div>
            <ol>
                {filteredTasks.map((task, index) => (
                    <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                        <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleCheckboxChange(index)}
                        />
                        <span className="text">{task.text}</span>
                        <span className="timestamp">
                            ({formatDistanceToNow(task.timeAdded, { addSuffix: true })}
                            {task.timeEdited && ` | Edited ${formatDistanceToNow(task.timeEdited, { addSuffix: true })}`})
                        </span>
                        <button className="delete-button" onClick={() => deleteTask(index)}>
                            Delete
                        </button>
                        <button className="move-button" onClick={() => moveTaskUp(index)}>
                            Up ⬆️
                        </button>
                        <button className="move-button" onClick={() => moveTaskDown(index)}>
                            Down ⬇️
                        </button>
                        <button className="edit-button" onClick={() => openEditModal(index)}>
                            Edit ✏️
                        </button>
                    </li>
                ))}
            </ol>
            {showEditModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Edit Task</h2>
                        <input
                            type="text"
                            value={editTaskValue}
                            onChange={handleEditInputChange}
                        />
                        <div className="modal-actions">
                            <button onClick={saveEditTask}>Save</button>
                            <button onClick={closeEditModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ToDoList;
