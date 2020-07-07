DO $$
BEGIN
  IF (EXISTS (SELECT * 
                   FROM INFORMATION_SCHEMA.TABLES 
                   WHERE TABLE_SCHEMA = 'public' 
                   AND  TABLE_NAME = 'customers'))
  THEN
    RAISE NOTICE 'table exists, dropping';
    DROP TABLE customers CASCADE;
  END IF;
  
    CREATE TABLE customers(
        id serial PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        mods JSON,
        address VARCHAR(250) NOT NULL);
    INSERT INTO customers (name, address) values ('test customer', '123 paper str');

  
END $$
