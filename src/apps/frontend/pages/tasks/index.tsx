import React, { useEffect, useState } from 'react';
import { useAccountContext } from 'frontend/contexts/account.provider';
import TaskService from 'frontend/services/task.service';
import { Task } from 'frontend/types/task';
import CommentSection from 'frontend/components/comment-section';

// Reusing styles from dashboard for consistency
const styles = {
    container: {
        padding: '2rem',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif",
    },
    header: {
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
};

const TasksPage: React.FC = () => {
    const { accountDetails } = useAccountContext();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const taskService = new TaskService();

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

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>All Tasks (Read Only)</h1>
            </div>

            <div style={styles.tasksContainer}>
                {isLoading && tasks.length === 0 && <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>}
                {!isLoading && tasks.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                        <p>No tasks available.</p>
                    </div>
                )}

                {tasks.map((task) => (
                    <div key={task.id} style={styles.card}>
                        <div style={styles.taskHeader}>
                            <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '1.25rem' }}>{task.title}</h3>
                        </div>
                        <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '1.5rem' }}>{task.description}</p>
                        <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '15px 0' }} />
                        <CommentSection taskId={task.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TasksPage;
