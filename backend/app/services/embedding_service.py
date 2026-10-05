from typing import List, Union, Optional
import numpy as np
from PIL import Image
from app.embeddings.clip_model import CLIPEmbeddingModel, EmbeddingModel

class EmbeddingService:
    def __init__(self, model: Optional[EmbeddingModel] = None):
        self.model = model or CLIPEmbeddingModel()

    def get_image_embedding(self, image: Union[np.ndarray, Image.Image]) -> List[float]:
        return self.model.embed_image(image)

    def get_text_embedding(self, text: str) -> List[float]:
        return self.model.embed_text(text)

    def get_batch_image_embeddings(self, images: List[Union[np.ndarray, Image.Image]]) -> List[List[float]]:
        return self.model.embed_batch_images(images)

embedding_service = EmbeddingService()
