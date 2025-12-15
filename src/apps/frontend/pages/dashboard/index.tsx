import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useAccountContext } from 'frontend/contexts/account.provider';
import TaskService from 'frontend/services/task.service';
import { Task } from 'frontend/types/task';
import CommentSection from 'frontend/components/comment-section';

// Add animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
if (!document.head.querySelector('style[data-dashboard-animations]')) {
    styleSheet.setAttribute('data-dashboard-animations', 'true');
    document.head.appendChild(styleSheet);
}

// Styles objects
const styles = {
    container: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: '1px solid #eee',
    },
    title: {
        fontSize: '2rem',
        color: '#333',
        margin: 0,
        fontWeight: 700,
    },
    button: {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s ease',
    },
    tasksContainer: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: '1.5rem',
        maxHeight: '70vh',
        overflowY: 'auto' as const,
        paddingRight: '10px',
    },
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '12px',
        padding: '1.5rem',
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        position: 'relative' as const,
        transition: 'transform 0.2s, box-shadow 0.2s',
    },
    taskHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '10px',
    },
    input: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        width: '100%',
        marginBottom: '1rem',
        fontSize: '1rem',
        display: 'block',
        boxSizing: 'border-box' as const,
    },
    textarea: {
        padding: '12px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        width: '100%',
        marginBottom: '1rem',
        fontSize: '1rem',
        minHeight: '100px',
        fontFamily: 'inherit',
        resize: 'vertical' as const,
        display: 'block',
        boxSizing: 'border-box' as const,
    },
    menuButton: {
        background: 'none',
        border: 'none',
        fontSize: '1.5rem',
        cursor: 'pointer',
        color: '#999',
        padding: '5px',
        borderRadius: '50%',
        width: '36px',
        height: '36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dropdown: {
        position: 'absolute' as const,
        top: '40px',
        right: '10px',
        backgroundColor: 'white',
        border: '1px solid #eee',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        zIndex: 10,
        overflow: 'hidden',
        minWidth: '120px',
    },
    dropdownItem: {
        padding: '10px 15px',
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#333',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    }
};

const TaskList: React.FC = () => {
    const { accountDetails } = useAccountContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [hoveredCard, setHoveredCard] = useState<string | null>(null);
    const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);

    const taskService = new TaskService();

    useEffect(() => {
        const handleClickOutside = () => setOpenMenuId(null);
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const fetchTasks = async () => {
        if (!accountDetails?.id) return;
        setIsLoading(true);
        try {
            const response = await taskService.getTasks(accountDetails.id);
            const responseData = response.data as any;
            const tasksData = Array.isArray(responseData)
                ? responseData
                : (responseData?.items || responseData?.data || []);
            setTasks(tasksData);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks().catch(console.error);
    }, [accountDetails?.id]);

    const handleCreateTask = async () => {
        if (!accountDetails?.id || !newTaskTitle || !newTaskDescription) return;

        const loadingToast = toast.loading('Creating task...');
        try {
            await taskService.createTask(accountDetails.id, {
                title: newTaskTitle,
                description: newTaskDescription,
            });
            setNewTaskTitle('');
            setNewTaskDescription('');
            setIsCreating(false);
            await fetchTasks();
            toast.success('✅ Task created successfully!', { id: loadingToast });
        } catch (e) {
            console.error(e);
            toast.error('❌ Failed to create task. Please try again.', { id: loadingToast });
        }
    };

    const handleDeleteTask = async (taskId: string) => {
        if (!accountDetails?.id) return;
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        setDeletingTaskId(taskId);
        const loadingToast = toast.loading('Deleting task...');
        try {
            await taskService.deleteTask(accountDetails.id, taskId);
            await fetchTasks();
            toast.success('🗑️ Task deleted successfully!', { id: loadingToast });
        } catch (e) {
            console.error(e);
            toast.error('❌ Failed to delete task. Please try again.', { id: loadingToast });
        } finally {
            setDeletingTaskId(null);
        }
    };

    const handleUpdateTask = async () => {
        if (!accountDetails?.id || !editingTask) return;

        const loadingToast = toast.loading('Updating task...');
        try {
            await taskService.updateTask(accountDetails.id, editingTask.id, {
                title: editingTask.title,
                description: editingTask.description,
            });
            setEditingTask(null);
            await fetchTasks();
            toast.success('✏️ Task updated successfully!', { id: loadingToast });
        } catch (e) {
            console.error(e);
            toast.error('❌ Failed to update task. Please try again.', { id: loadingToast });
        }
    };

    const toggleMenu = (e: React.MouseEvent, taskId: string) => {
        e.stopPropagation();
        setOpenMenuId(openMenuId === taskId ? null : taskId);
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h1 style={styles.title}>My Tasks</h1>
                    {tasks.length > 0 && (
                        <span style={{
                            backgroundColor: '#007bff',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '20px',
                            fontSize: '0.9rem',
                            fontWeight: 600
                        }}>
                            {tasks.length}
                        </span>
                    )}
                </div>
                <button
                    style={styles.button}
                    onClick={() => setIsCreating(true)}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    ➕ New Task
                </button>
            </div>

            {isCreating && (
                <div style={{ ...styles.card, borderColor: '#007bff', backgroundColor: '#f8f9fa', marginBottom: '20px' }}>
                    <h3 style={{ marginTop: 0 }}>Create New Task</h3>
                    <input
                        style={styles.input}
                        placeholder="Task Title"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        autoFocus
                    />
                    <textarea
                        style={styles.textarea}
                        placeholder="Description..."
                        value={newTaskDescription}
                        onChange={(e) => setNewTaskDescription(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={() => setIsCreating(false)}>
                            Cancel
                        </button>
                        <button style={styles.button} onClick={handleCreateTask}>
                            Create Task
                        </button>
                    </div>
                </div>
            )}

            <div style={styles.tasksContainer}>
                {isLoading && tasks.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>}
                {!isLoading && tasks.length === 0 && !isCreating && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <div style={{ fontSize: '40px', marginBottom: '10px' }}>📝</div>
                        <p>No tasks yet. Create one to get started!</p>
                    </div>
                )}

                {tasks.map((task, index) => (
                    <div
                        key={task.id}
                        style={{
                            ...styles.card,
                            transform: hoveredCard === task.id ? 'translateY(-4px)' : 'none',
                            boxShadow: hoveredCard === task.id ? '0 8px 16px rgba(0,0,0,0.1)' : '0 2px 4px rgba(0,0,0,0.05)',
                            borderColor: hoveredCard === task.id ? '#b0d4ff' : '#e0e0e0',
                            opacity: deletingTaskId === task.id ? 0.5 : 1,
                            pointerEvents: deletingTaskId === task.id ? 'none' : 'auto',
                            animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s both`
                        }}
                        onMouseEnter={() => setHoveredCard(task.id)}
                        onMouseLeave={() => setHoveredCard(null)}
                    >
                        {editingTask?.id === task.id ? (
                            <div>
                                <input
                                    style={styles.input}
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                />
                                <textarea
                                    style={styles.textarea}
                                    value={editingTask.description}
                                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                />
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                    <button style={{ ...styles.button, backgroundColor: '#6c757d' }} onClick={() => setEditingTask(null)}>
                                        Cancel
                                    </button>
                                    <button style={{ ...styles.button, backgroundColor: '#28a745' }} onClick={handleUpdateTask}>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={styles.taskHeader}>
                                    <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.25rem' }}>{task.title}</h3>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            style={styles.menuButton}
                                            onClick={(e) => toggleMenu(e, task.id)}
                                        >
                                            ⋮
                                        </button>
                                        {openMenuId === task.id && (
                                            <div style={styles.dropdown}>
                                                <div
                                                    style={styles.dropdownItem}
                                                    onClick={() => setEditingTask(task)}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    ✏️ Edit
                                                </div>
                                                <div
                                                    style={{ ...styles.dropdownItem, color: '#dc3545', opacity: deletingTaskId === task.id ? 0.5 : 1 }}
                                                    onClick={() => deletingTaskId !== task.id && handleDeleteTask(task.id)}
                                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    {deletingTaskId === task.id ? '⏳ Deleting...' : '🗑️ Delete'}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>{task.description}</p>
                                <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '15px 0' }} />
                                {accountDetails?.id && <CommentSection taskId={task.id} accountId={accountDetails.id} />}
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskList;
