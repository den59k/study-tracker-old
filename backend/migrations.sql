//Самое начало

CREATE TABLE users (
	id serial PRIMARY KEY,
	name text,
	surname text,
	email text,
	password bytea,
	role int,
	avatar text,
	token text,
	last_login_time bigint,
	creation_time bigint
);

CREATE UNIQUE INDEX ON users (email);

CREATE TABLE reg_requests (
	token text PRIMARY KEY,
	info jsonb,
	registration_time bigint
);

CREATE TABLE subjects (
	id serial PRIMARY KEY,
	title text,
	url text,
	description text,
	creation_time bigint,
	creator_id int
);

