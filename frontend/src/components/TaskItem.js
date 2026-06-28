import React from 'react';

function TaskItem({ task, toggleStatus, startEdit, deleteTask }) {
  return (
    <div className={`task-item ${task.status.toLowerCase()}`}>
      <div className="task-info">
        <h3 style={{ textDecoration: task.status === 'Completed' ? 'line-through' : 'none' }}>
          {task.title}
        </h3>
        <p>{task.description || "No description provided."}</p>
        <span className={`badge ${task.status.toLowerCase()}`}>{task.status}</span>
      </div>
      <div className="task-actions">
        <button onClick={() => toggleStatus(task)} className="status-btn">
          {task.status === 'Pending' ? 'Complete' : 'Undo'}
        </button>
        <button onClick={() => startEdit(task)} className="edit-btn">Edit</button>
        <button onClick={() => deleteTask(task._id)} className="delete-btn">Delete</button>
      </div>
    </div>
  );
}

export default TaskItem;