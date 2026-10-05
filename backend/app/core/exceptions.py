class OmniSurvException(Exception):
    """Base exception for OmniSurv-AI system"""
    def __init__(self, message: str, status_code: int = 400):
        super().__init__(message)
        self.message = message
        self.status_code = status_code

class VideoProcessingError(OmniSurvException):
    def __init__(self, message: str):
        super().__init__(f"Video processing failed: {message}", status_code=500)

class ModelInferenceError(OmniSurvException):
    def __init__(self, message: str):
        super().__init__(f"Model inference error: {message}", status_code=500)

class VectorStoreError(OmniSurvException):
    def __init__(self, message: str):
        super().__init__(f"Vector database error: {message}", status_code=500)

class ResourceNotFoundError(OmniSurvException):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(f"{resource} with ID '{resource_id}' not found.", status_code=404)

class InsufficientEvidenceError(OmniSurvException):
    def __init__(self, message: str = "Insufficient visual evidence to validate query."):
        super().__init__(message, status_code=422)
