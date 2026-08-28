from fastapi import FastAPI, HTTPException, status

from src.schemas import ResultSend, ResultResponse

app = FastAPI()

results = [
    {
        "id": 1,
        "mode": 'numbers',
        "language": "ja",
        "difficulty": "1"
    }
]

@app.post(
    "/api/results/{user_id}",
    response_model=ResultResponse,
    status_code=status.HTTP_201_CREATED
)
def post_result(post: ResultSend):
    new_id = max(r["id"] for r in results) + 1 if results else 1
    new_result = {
        "id": new_id,
        "mode": post.mode,
        "language": post.language,
        "difficulty": post.difficulty,
        "datetime": "today"
    }
    results.append(new_result)
    return new_result

#@app.get("/api/posts{post_id}")
#def get_posts(post_id: int):
#    for post in posts:
#        if(post.get("id") == post_id):
#            return post
#    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

@app.get("/motd")
def get_motd():
    return "Message of the day!"