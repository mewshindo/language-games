FROM python:3.13-alpine AS build

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    REDIS_URL=redis://redis:6379/0 \
    DB_USER=postgres \
    DB_PASSWORD=postgres \
    DB_HOST=postgres \
    DB_PORT=5432 \
    DB_NAME=languagebox

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]