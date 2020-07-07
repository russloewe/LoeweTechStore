DO $$
BEGIN
  IF (EXISTS (SELECT * 
                   FROM INFORMATION_SCHEMA.TABLES 
                   WHERE TABLE_SCHEMA = 'public' 
                   AND  TABLE_NAME = 'users'))
	THEN
		DROP TABLE users;
	END IF;
	CREATE TABLE users(
	user_id serial PRIMARY KEY,
	name VARCHAR (50) UNIQUE NOT NULL,
	password VARCHAR (500) NOT NULL,
	email VARCHAR (500) NOT NULL,
	user_type INT default 0);
  
    INSERT INTO users (name, password, email) VALUES ('TEST USER', 'PASSWORD', 'test@test.com');
END $$
