FROM python:3.10-alpine

WORKDIR /app

COPY base/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# copy base folder
COPY base ./base
# copy backend folder of codejudge
COPY codejudge ./codejudge
# copy backend folder of ide
COPY ide ./ide
# copy folder of app that manages user authentication
COPY usersAuth ./usersAuth

# Other files
COPY Pipfile .
COPY Pipfile.lock .
COPY manage.py .

RUN python manage.py makemigrations
RUN python manage.py migrate

EXPOSE 8000
