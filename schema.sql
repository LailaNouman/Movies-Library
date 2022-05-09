DROP TABLE IF EXISTS addMovie;

CREATE TABLE addMovie (
    specificmovie varchar(255),
    comment varchar(255)
);

ALTER TABLE addMovie
ADD id SERIAL PRIMARY KEY;