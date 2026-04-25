from fastapi import APIRouter

router = APIRouter(prefix="/performance", tags=["Performance"])

@router.get("/{user_id}")
def get_performance(user_id: int):
    return {
        "user_id": user_id,
        "weak_topics": [],
        "strong_topics": []
    }