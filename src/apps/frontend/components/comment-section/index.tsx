import * as React from 'react';
import { useEffect, useState } from 'react';

import { Button, Flex, Input, ParagraphMedium, VerticalStackLayout } from 'frontend/components';
import CommentService from 'frontend/services/comment.service';
import { ButtonKind } from 'frontend/types/button';
import { Comment } from 'frontend/types/comment';

interface CommentSectionProps {
    taskId: string;
    accountId: string;
}

const commentService = new CommentService();

const CommentSection: React.FC<CommentSectionProps> = ({ taskId, accountId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingComment, setEditingComment] = useState<Comment | null>(null);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await commentService.getComments(accountId, taskId);
            const commentsData = Array.isArray(response.data) ? response.data : (response.data?.data || []);
            setComments(commentsData);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments().catch(console.error);
    }, [taskId, accountId]);

    const handleAddComment = async () => {
        if (!newComment) return;
        setIsAdding(true);
        try {
            await commentService.createComment(accountId, taskId, {
                content: newComment,
            });
            setNewComment('');
            await fetchComments();
        } catch (e) {
            console.error(e);
        } finally {
            setIsAdding(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Delete this comment?')) return;
        try {
            await commentService.deleteComment(accountId, taskId, commentId);
            await fetchComments();
        } catch (e) {
            console.error(e);
        }
    };

    const handleUpdateComment = async () => {
        if (!editingComment) return;
        try {
            await commentService.updateComment(accountId, taskId, editingComment.id, {
                content: editingComment.content,
            });
            setEditingComment(null);
            await fetchComments();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="mt-4 border-t border-stroke pt-4">
            <h4 className="mb-2 text-sm font-semibold text-slate-700">Comments</h4>

            {/* Add Comment */}
            <Flex className="mb-4 gap-2">
                <Input
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                    onClick={() => { handleAddComment().catch(console.error); }}
                    isLoading={isAdding}
                    disabled={!newComment}
                    kind={ButtonKind.SECONDARY}
                >
                    💬 Post
                </Button>
            </Flex>

            {/* Comment List */}
            <VerticalStackLayout gap={3}>
                {isLoading && comments.length === 0 && (
                    <ParagraphMedium className="text-sm text-slate-500">
                        Loading comments...
                    </ParagraphMedium>
                )}
                {!isLoading && comments.length === 0 && (
                    <ParagraphMedium className="text-sm text-slate-400">
                        No comments yet.
                    </ParagraphMedium>
                )}
                {comments.length > 0 && (
                    comments.map((comment) => (
                        <div key={comment.id} className="rounded bg-slate-50 p-3 text-sm">
                            {editingComment?.id === comment.id ? (
                                <VerticalStackLayout gap={2}>
                                    <Input
                                        value={editingComment.content}
                                        onChange={(e) =>
                                            setEditingComment({ ...editingComment, content: e.target.value })
                                        }
                                    />
                                    <Flex className="gap-2">
                                        <Button onClick={() => { handleUpdateComment().catch(console.error); }} kind={ButtonKind.TERTIARY}>
                                            ✅ Save
                                        </Button>
                                        <Button
                                            onClick={() => setEditingComment(null)}
                                            kind={ButtonKind.TERTIARY}
                                            type="button"
                                        >
                                            ❌ Cancel
                                        </Button>
                                    </Flex>
                                </VerticalStackLayout>
                            ) : (
                                <div className="flex justify-between items-start group">
                                    <p className="text-slate-700 whitespace-pre-wrap">{comment.content}</p>
                                    <Flex className="opacity-0 group-hover:opacity-100 transition-opacity gap-2 min-w-fit ml-2">
                                        <button
                                            className="text-xs text-blue-500 hover:text-blue-700"
                                            onClick={() => setEditingComment(comment)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="text-xs text-red-500 hover:text-red-700"
                                            onClick={() => { handleDeleteComment(comment.id).catch(console.error); }}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </Flex>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </VerticalStackLayout>
        </div>
    );
};

export default CommentSection;
