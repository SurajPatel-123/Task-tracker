import React from 'react';

function TaskForm({ title, setTitle, description, setDescription, handleSubmit, editingId, setEditingId, error }) {
  return (
    <form onSubmit={handleSubmit} className="task-form">
      <h2>{editingId ? "✏️ Edit Task" : "➕ Add New Task"}</h2>
      {error && <p className="error-msg">{error}</p>}
      
      <input 
        type="text" 
        placeholder="Task Title *" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea 
        placeholder="Task Description (Optional)" 
        value={description} 
        onChange={(e) => setDescription(e.target.value)}
      />
      <button type="submit">{editingId ? "Update Task" : "Add Task"}</button>
      {editingId && (
        <button 
          type="button" 
          className="cancel-btn" 
          onClick={() => { setEditingId(null); setTitle(''); setDescription(''); }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default TaskForm;