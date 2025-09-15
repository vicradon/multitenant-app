# Multitenant App (NestJS)

An application obeying the rules of multi-tenancy

## Database Diagram

![Database Diagram](./docs/db_diagram.png)

## Key Concept

This app follows the multiple databases, one application pattern, using domain as the distinguishing feature.

The approach is simple:

1. The identity database's datasource used for getting tenant information is fixed and initialized on start of the application
2. The other databases datasource are initialized (once) while the app is running (lazy init)
3. Once a datasource is initialized, it is cached in a HashMap for reuse
4. We allow for an authenticated and an unauthenticated entrypoints to the db
5. The authenticated entrypoint uses the request context to get the user details and make requests to the right datasource
6. The unauthenticated entrypoint uses the email domain of the user to make requests to the right datasource


This architecture allows us to introduce multiple databases into the app as time progresses by simply adding new rows to the tenants table in the identity db


### Getting the DBs up

Run the command below to run the three dbs
```sh
docker compose up
```

You can then use these env values based on the docker

```sh
DB_URL_IDENTITY=postgresql://hospital_identity_db:hospital_identity_db@localhost:5432/hospital_identity_db
DB_URL_HOSPITAL_A=postgresql://hospital_a:hospital_a@localhost:5433/hospital_a
DB_URL_HOSPITAL_B=postgresql://hospital_b:hospital_b@localhost:5434/hospital_b
```