from fastapi import FastAPI
from routes import users, courses, enrollments
from fastapi.responses import Response


app = FastAPI(title="EduTrack Lite API")

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(courses.router, prefix="/courses", tags=["courses"])
app.include_router(enrollments.router, prefix="/enrollments", tags=["enrollments"])

@app.get("/")
def root():
    return {"msg": "EduTrack Lite API running"}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)
