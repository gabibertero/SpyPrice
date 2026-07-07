FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

ENV SPYPRICE_DATABASE_URL=sqlite:////data/spyprice.db
ENV SPYPRICE_ENABLE_SEED=true

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
