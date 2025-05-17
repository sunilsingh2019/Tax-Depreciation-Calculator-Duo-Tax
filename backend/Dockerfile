FROM python:3.9-slim

WORKDIR /app

# Install system dependencies for WeasyPrint and SVG support
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpango-1.0-0 \
    libpangoft2-1.0-0 \
    libpangocairo-1.0-0 \
    libcairo2 \
    libpq-dev \
    libgdk-pixbuf2.0-0 \
    shared-mime-info \
    libgirepository1.0-dev \
    libharfbuzz-dev \
    libffi-dev \
    librsvg2-2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Create template directories
RUN mkdir -p /app/app/templates/assets

# Copy application code
COPY . .

# Ensure templates directory exists
RUN mkdir -p /app/app/templates/assets

# Make entrypoint script executable
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 8000

# Use our entrypoint script
ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["python", "start.py"] 