from typing import List
from fastapi import FastAPI, Form, File, UploadFile
from fastapi.responses import HTMLResponse

app = FastAPI(title="Forms & Files Demo")

# --- A simple HTML page to try things quickly in the browser ---
@app.get("/", response_class=HTMLResponse)
def home():
    return """
    <html>
      <head>
        <title>FastAPI Forms & Files Demo</title>
        <style>
          body { font-family: system-ui, sans-serif; margin: 2rem; line-height: 1.4; }
          form { margin-bottom: 2rem; padding: 1rem; border: 1px solid #ddd; border-radius: 8px; }
          h2 { margin: 0 0 .5rem 0; }
          label { display: block; margin-top: .5rem; }
          input[type="text"], input[type="password"] { width: 280px; padding: .4rem; }
          button { margin-top: .75rem; padding: .5rem 1rem; cursor: pointer; }
          code { background: #f6f8fa; padding: .15rem .35rem; border-radius: 4px; }
        </style>
      </head>
      <body>
        <h1>FastAPI: Form, File, UploadFile</h1>

        <form action="/login" method="post">
          <h2>1) Form data</h2>
          <label>Username <input name="username" type="text" required></label>
          <label>Password <input name="password" type="password" required></label>
          <button type="submit">Submit Form</button>
          <p>Server reads fields using <code>Form(...)</code></p>
        </form>

        <form action="/upload-bytes" method="post" enctype="multipart/form-data">
          <h2>2) Raw File as bytes</h2>
          <label>Select a file <input name="file" type="file" required></label>
          <button type="submit">Upload</button>
          <p>Server reads the whole file into memory using <code>File(...)</code> → <code>bytes</code></p>
        </form>

        <form action="/upload-file" method="post" enctype="multipart/form-data">
          <h2>3) UploadFile (streamed)</h2>
          <label>Select a file <input name="file" type="file" required></label>
          <button type="submit">Upload</button>
          <p>Server receives a file-like object using <code>UploadFile</code> (doesn't load everything into RAM)</p>
        </form>

        <form action="/upload-multiple" method="post" enctype="multipart/form-data">
          <h2>4) Multiple UploadFiles</h2>
          <label>Select files <input name="files" type="file" multiple required></label>
          <button type="submit">Upload</button>
          <p>Server accepts a list of <code>UploadFile</code>s</p>
        </form>
      </body>
    </html>
    """

from typing import Annotated
# -------- 1) Form fields --------
@app.post("/login")
def login(username: Annotated[str, Form()], password: str = Form(...)):
    # In real apps, never return the raw password; this is just a demo.
    return {
        "message": "Form received!",
        "username": username,
        "password_length": len(password),
    }


# -------- 2) Raw File as bytes (loads whole file into memory) --------
@app.post("/upload-bytes")
def upload_bytes(file: bytes = File(...), filename: str = Form(None)):
    size = len(file)
    preview = file[:32]  # show a tiny preview of the first bytes
    return {
        "received_as": "bytes",
        "filename_hint_from_form": filename,
        "size_bytes": size,
        "first_32_bytes_preview": list(preview),
    }


# -------- 3) Streamed UploadFile (spools to disk, file-like) --------
@app.post("/upload-file")
async def upload_file(file: UploadFile):
    # Read a small chunk to demonstrate streaming
    chunk = await file.read(64)
    # If you need to reset the pointer for further reading:
    await file.seek(0)

    return {
        "received_as": "UploadFile",
        "filename": file.filename,
        "content_type": file.content_type,
        "first_64_bytes_preview": list(chunk),
    }


# -------- 4) Multiple files --------
@app.post("/upload-multiple")
async def upload_multiple(files: List[UploadFile] = File(...)):
    info = []
    for f in files:
        # Don't read whole content to keep memory usage low in this demo
        info.append({"filename": f.filename, "content_type": f.content_type})
    return {"count": len(files), "files": info}
