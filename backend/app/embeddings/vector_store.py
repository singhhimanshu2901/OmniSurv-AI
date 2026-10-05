from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class VectorStore(ABC):
    @abstractmethod
    def create_collection(self, collection_name: str, vector_dim: int) -> bool:
        pass

    @abstractmethod
    def delete_collection(self, collection_name: str) -> bool:
        pass

    @abstractmethod
    def upsert(self, collection_name: str, point_id: str, vector: List[float], payload: Dict[str, Any]) -> bool:
        pass

    @abstractmethod
    def batch_upsert(self, collection_name: str, points: List[Dict[str, Any]]) -> bool:
        pass

    @abstractmethod
    def search(
        self, 
        collection_name: str, 
        query_vector: List[float], 
        limit: int = 10, 
        filter_dict: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    def delete(self, collection_name: str, point_ids: List[str]) -> bool:
        pass

    @abstractmethod
    def health_check(self) -> bool:
        pass
