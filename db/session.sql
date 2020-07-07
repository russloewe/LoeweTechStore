DO $$
BEGIN
  IF (EXISTS (SELECT * 
                   FROM INFORMATION_SCHEMA.TABLES 
                   WHERE TABLE_SCHEMA = 'public' 
                   AND  TABLE_NAME = 'session'))
  THEN
    RAISE NOTICE 'table already exists';
    DROP TABLE session;
	END IF;
	
    CREATE TABLE "session" (
    "sid" varchar NOT NULL COLLATE "default",
    "sess" json NOT NULL,
    "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey"
    PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  
END $$


