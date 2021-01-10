-- Самое начало

CREATE TYPE user_role AS ENUM ('student', 'teacher');

CREATE TABLE users (
	id bigserial PRIMARY KEY,
	name text,
	surname text,
	avatar text,
	avatar_full text,
	creation_time bigint
);

-- Мы разделяем users на две таблицы, потому что это разные вещи. user может быть с несозданным аккаунтом

CREATE TABLE accounts (
	user_id bigint PRIMARY KEY,
	email text,
	role user_role,
	password bytea,
	token text,
	last_login_time bigint
);

CREATE UNIQUE INDEX ON accounts (email);

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
	creator_id bigint
);

CREATE UNIQUE INDEX ON subjects (url);

CREATE TYPE worktype AS ENUM ('lab', 'ind', 'practical', 'other');

CREATE TABLE works (
	id serial PRIMARY KEY,
	subject_id int,
	type worktype,
	url text,
	title text,
	theme text,
	description text,
	creation_time bigint
);

CREATE UNIQUE INDEX ON works (url, subject_id);

-- Второй коммит пошел

CREATE TABLE groups (
	id serial PRIMARY KEY,
	title text,
	url text,
	captain_id bigint,
	creation_time bigint
);

CREATE UNIQUE INDEX ON groups (url);

CREATE TABLE groups_subjects (
	group_id int,
	subject_id int,
	PRIMARY KEY ( group_id, subject_id )
)

CREATE TABLE groups_teacher (
	teacher_id bigint,
	group_id int,
	PRIMARY KEY (teacher_id, group_id)
);

CREATE TABLE groups_requests (
	teacher_id bigint,
	captain_id bigint,
	request_time bigint,
	PRIMARY KEY (teacher_id, captain_id)
);

CREATE TABLE students_groups (
	student_id bigint,
	group_id int,
	PRIMARY KEY (student_id, group_id)
);