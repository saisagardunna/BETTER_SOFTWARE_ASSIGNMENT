from pymongo.collection import Collection

from modules.application.repository import ApplicationRepository
from modules.task.internal.store.comment_model import CommentModel


class CommentRepository(ApplicationRepository):
    collection_name = CommentModel.get_collection_name()

    @classmethod
    def on_init_collection(cls, collection: Collection) -> bool:
        collection.create_index(
            [("task_id", 1), ("created_at", -1)], name="task_id_index"
        )
        return True
