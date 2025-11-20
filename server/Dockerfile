# Use official TensorFlow image (amd64) — compatible with Linux container
FROM --platform=linux/amd64 tensorflow/tensorflow:2.15.0

# Set working directory
WORKDIR /app

# Copy your server code
COPY . /app

# Install ALL Python dependencies from requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 8000
EXPOSE 8000

# Start Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
