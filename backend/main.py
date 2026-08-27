from fastapi import FastAPI, HTTPException, status

app = FastAPI()

posts: list[dict] = [
    {
        "id": 1,
        "content": "asdasdasd!"
    },
    {
        "id": 2,
        "content": "bababababaa"
    }
]

@app.get("/")
@app.get("/posts")
def home():
    return 

@app.get("/api/posts")
def get_posts():
    return posts

@app.get("/api/posts{post_id}")
def get_posts(post_id: int):
    for post in posts:
        if(post.get("id") == post_id):
            return post
    return HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found")

@app.get("/motd")
def get_motd():
    return "Message of the day!"