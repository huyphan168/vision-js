from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import os
from PIL import Image
import io
from fastapi.responses import HTMLResponse

from database import engine, get_db
import models
import schemas

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", response_class=HTMLResponse)
async def root():
    return """
    <html>
        <body>
            <h1>Welcome to the Image Upload API</h1>
            <p>Use the /upload endpoint to upload an image.</p>
            <form action="/upload" enctype="multipart/form-data" method="post">
                <input name="file" type="file" accept="image/*">
                <input type="submit">
            </form>
        </body>
    </html>
    """

@app.post("/upload")
async def upload_image(file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Save the image
        timestamp = datetime.now()
        image_path = f"uploads/{timestamp.strftime('%Y%m%d%H%M%S')}.jpg"
        os.makedirs(os.path.dirname(image_path), exist_ok=True)
        image.save(image_path)
        
        # TODO: Implement people counting logic here
        # For now, we'll use a dummy count
        count = 10
        
        # Save to database
        db_people_count = models.PeopleCount(timestamp=timestamp, count=count, image_path=image_path)
        db.add(db_people_count)
        db.commit()
        db.refresh(db_people_count)
        
        return {"count": count, "timestamp": str(timestamp), "image_path": image_path}
    except Exception as e:
        print(f"Error processing upload: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    # Get data for the last 24 hours
    start_time = datetime.now() - timedelta(hours=24)
    counts = db.query(models.PeopleCount).filter(models.PeopleCount.timestamp >= start_time).all()
    
    total_today = sum(count.count for count in counts)
    average_per_hour = total_today / 24 if counts else 0
    
    time_series_data = [
        {"timestamp": count.timestamp.isoformat(), "count": count.count}
        for count in counts
    ]
    
    return schemas.StatsResponse(
        totalToday=total_today,
        averagePerHour=average_per_hour,
        timeSeriesData=time_series_data
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=1000)
