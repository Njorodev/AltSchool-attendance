from fastapi import FastAPI, Request, Depends, Header

app = FastAPI()


@app.middleware("http")
async def log_requests(request: Request, call_next):
    # Log the request details
    print(f"Request: {request.method} {request.url}")
    response = await call_next(request)
    print(f"Response: {response.status_code}")
    return response


@app.middleware('http')
async def add_custom_header(request: Request, call_next):
    response = await call_next(request)
    response.headers['X-Custom-Header'] = 'MyCustomValue'
    return response


@app.middleware('http')
async def add_process_time(request: Request, call_next):
    import time
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers['X-Process-Time'] = str(process_time)
    return response


def verify_api_key(x_api_key: str):
    if x_api_key != "mysecretkey":
        from fastapi import HTTPException
        raise HTTPException(status_code=403, detail="Could not validate credentials")


@app.get("/")
async def read_root(id: int, q: str, api_key: str = Depends(verify_api_key)):
    return {"Hello": api_key, "ID": id, "Query": q}


@app.get('/dial')
async def ping(api_key: str = Header(None)):
    return {"ping": "localhost:8000", "API Key": api_key}