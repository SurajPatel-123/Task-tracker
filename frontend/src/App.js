import React, { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './App.css';

const API_URL = 'https://task-backend-hojz.onrender.com/api';

function App() {
  const [tasks, setTasks] = useState([]); // डिफॉल्ट खाली एरे
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('All');
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');

  // 1. GET TASKS WITH SAFETY CHECK
  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      const data = await res.json();
      
      // सुनिश्चित करें कि बैकएंड से एरे ही मिला है
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        console.error("Backend did not return an array:", data);
        setTasks([]); 
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // 2. ADD & EDIT TASK WITH SAFETY CHECK
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty!');
      return;
    }
    setError('');

    const taskData = { title, description };

    try {
      if (editingId) {
        const res = await fetch(`${API_URL}/tasks/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        const updatedTask = await res.json();
        
        if (updatedTask && updatedTask._id) {
          setTasks(tasks.map(t => t._id === editingId ? updatedTask : t));
        } else {
          fetchTasks(); // सुरक्षित तरीका: दोबारा लिस्ट फेच कर लो
        }
        setEditingId(null);
      } else {
        const res = await fetch(`${API_URL}/tasks`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData),
        });
        const newTask = await res.json();
        
        if (newTask && newTask._id) {
          setTasks([newTask, ...tasks]);
        } else {
          fetchTasks(); // सुरक्षित तरीका
        }
      }
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  // 3. TOGGLE STATUS
  const toggleStatus = async (task) => {
    const newStatus = task.status === 'Pending' ? 'Completed' : 'Pending';
    try {
      const res = await fetch(`${API_URL}/tasks/${task._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTask = await res.json();
      if (updatedTask && updatedTask._id) {
        setTasks(tasks.map(t => t._id === task._id ? updatedTask : t));
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // 4. DELETE TASK
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      setTasks(tasks.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Backend से कनेक्ट नहीं हो पाया: " + err.message);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
  };

  // SAFETY FILTER CHECK
  const filteredTasks = Array.isArray(tasks) 
    ? tasks.filter(task => {
        if (filter === 'Pending') return task.status === 'Pending';
        if (filter === 'Completed') return task.status === 'Completed';
        return true;
      })
    : [];

  return (
    <div className="app-container">
      <header>
        <h1>📝 Task Tracker</h1>
      </header>

      <TaskForm 
        title={title} setTitle={setTitle}
        description={description} setDescription={setDescription}
        handleSubmit={handleSubmit} editingId={editingId}
        setEditingId={setEditingId} error={error}
      />

      <div className="filter-container">
        <label>Filter Tasks: </label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All Tasks</option>
          <option value="Pending">⚠️ Pending</option>
          <option value="Completed">✅ Completed</option>
        </select>
      </div>

      <div className="task-list">
        {filteredTasks.length === 0 ? (
          <p className="no-tasks">No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <TaskItem 
              key={task._id} task={task}
              toggleStatus={toggleStatus} startEdit={startEdit}
              deleteTask={deleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;