# Sequencing
This is a WIP project conceptualized for a PhD student who needed to search for irregularities/patterns across a genome. Specific analysis is still TBD, but the data layer has been designed to cache complex calculations lazily and to work with a flexible data model to support any future changes.

## Pre-requisites

- WARNING: There are known issues with Docker's functionality on Windows. It is recommended to run on MacOS or Linux machine.
- You must have [Docker](https://docs.docker.com/docker-for-windows/) and [Docker Compose](https://docs.docker.com/compose/install/) installed.


## Running

Clone a copy of the repo:
```bash
git clone https://github.com/jbmanning/sequencing
```

Change to the sequencing directory
```bash
cd sequencing/
```

All-in-one: Install dependencies, database, and start server
```bash
docker-compose up
```

Once containers have finished installing (may take a few minutes), navigate to `localhost:3000` in your browser.

## Sample interface (Missing features)
![sequencing-data-table](https://user-images.githubusercontent.com/11013297/55007662-cdab4180-4fad-11e9-9389-a6f2818863ab.png)
![sequencing-analysis](https://user-images.githubusercontent.com/11013297/55007723-e9aee300-4fad-11e9-997c-8126f483e19a.png)
