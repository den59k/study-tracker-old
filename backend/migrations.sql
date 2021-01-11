-- Самое начало

CREATE TYPE user_role AS ENUM ('student', 'teacher');

CREATE TABLE users (
	id bigserial PRIMARY KEY,
	name text NOT NULL,
	surname text,
	avatar text,
	avatar_full text,
	creation_time bigint NOT NULL
);

-- Мы разделяем users на две таблицы, потому что это разные вещи. user может быть с несозданным аккаунтом

CREATE TABLE accounts (
	user_id bigint NOT NULL UNIQUE
		, FOREIGN KEY (user_id) REFERENCES users (id),
	email text NOT NULL UNIQUE,
	role user_role NOT NULL,
	password bytea NOT NULL,
	token text,
	last_login_time bigint
);

CREATE TABLE reg_requests (
	token text PRIMARY KEY,
	info jsonb,
	registration_time bigint
);

CREATE TABLE subjects (
	id serial PRIMARY KEY,
	title text NOT NULL,
	url text NOT NULL UNIQUE,
	description text,
	creation_time bigint NOT NULL,
	creator_id bigint NOT NULL
		, FOREIGN KEY (creator_id) REFERENCES users (id),
	UNIQUE (title, creator_id)
);

CREATE TYPE worktype AS ENUM ('lab', 'ind', 'practical', 'other');

CREATE TABLE works (
	id serial PRIMARY KEY,
	subject_id int NOT NULL
		, FOREIGN KEY (subject_id) REFERENCES subjects (id),
	type worktype NOT NULL,
	url text,
	title text NOT NULL,
	theme text,
	description text,
	creation_time bigint NOT NULL,
	UNIQUE (url, subject_id)
);

-- Второй коммит пошел

CREATE TABLE groups (
	id serial PRIMARY KEY,
	title text NOT NULL,
	url text NOT NULL UNIQUE,
	captain_id bigint
		, FOREIGN KEY (captain_id) REFERENCES users (id),
	creation_time bigint NOT NULL
);

CREATE TABLE groups_subjects (
	group_id int NOT NULL
		, FOREIGN KEY (group_id) REFERENCES groups (id),
	subject_id int NOT NULL
		, FOREIGN KEY (subject_id) REFERENCES subjects (id),
	UNIQUE ( group_id, subject_id )
);

CREATE TABLE groups_teacher (
	teacher_id bigint NOT NULL
		, FOREIGN KEY (teacher_id) REFERENCES users (id),
	group_id int NOT NULL
		, FOREIGN KEY (group_id) REFERENCES groups (id),
	UNIQUE (teacher_id, group_id)
);

CREATE TABLE students_groups (
	student_id bigint NOT NULL
		, FOREIGN KEY (student_id) REFERENCES users (id),
	group_id int NOT NULL
		, FOREIGN KEY (group_id) REFERENCES groups (id),
	UNIQUE (student_id, group_id)
);

-- Третий коммит

-- student_id - ид студента, который сдает. user_id - ид автора коммита
CREATE TABLE commits (
	id bigserial PRIMARY KEY,
	work_id int NOT NULL
		, FOREIGN KEY (work_id) REFERENCES works (id),
	student_id bigint NOT NULL
		, FOREIGN KEY (student_id) REFERENCES users (id),
	user_id bigint NOT NULL
		, FOREIGN KEY (user_id) REFERENCES users (id),
	text text,
	files jsonb [],
	timestep bigint NOT NULL,
	mark smallint
);