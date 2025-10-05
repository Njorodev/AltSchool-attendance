from fastapi import FastAPI
from routes.user import user_router
from routes.event import event_router
from routes.speaker import speaker_router
from routes.registration import registration_router

app = FastAPI()

app.include_router(user_router, prefix="/users", tags=["Users"])
app.include_router(event_router, prefix="/events", tags=["Events"])
app.include_router(speaker_router, prefix="/speakers", tags=["Speakers"])
app.include_router(registration_router, prefix="/event-registration", tags=["Event Registration"])

@app.get("/", status_code=200)
def home():
    return {"message": "Hello from the Events booking API"}