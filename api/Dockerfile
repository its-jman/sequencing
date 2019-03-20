FROM python:3.7

RUN pip install pipenv

RUN mkdir code

WORKDIR /code

COPY Pipfile /code/Pipfile
COPY Pipfile.lock /code/Pipfile.lock
