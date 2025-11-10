# backend/Dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH=/app \
    DJANGO_SETTINGS_MODULE=core.settings
    

# System deps for psycopg2 etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
  && rm -rf /var/lib/apt/lists/*

# Workdir inside container
WORKDIR /app

# Copy and install Python deps (cache-friendly)
COPY requirements.txt requirements.txt


RUN python -m pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY / /app

RUN mkdir -p /app/staticfiles

# Run migrations + collectstatic at start, then serve
# Railway sets $PORT; default to 8000 for local
# CMD bash -c "python manage.py migrate --noinput && \
#            python manage.py collectstatic --noinput"

# CMD bash -c "gunicorn core.wsgi:application --bind 0.0.0.0:$PORT --workers 1"
COPY entry.sh /entry.sh
RUN chmod +x /entry.sh

CMD ["/entry.sh"]

         
