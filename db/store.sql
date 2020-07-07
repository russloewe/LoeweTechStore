DO $$
BEGIN

    IF (EXISTS (SELECT * 
                   FROM INFORMATION_SCHEMA.TABLES 
                   WHERE TABLE_SCHEMA = 'public' 
                   AND  TABLE_NAME = 'products'))
    THEN
        RAISE NOTICE 'table exists, dropping';
    DROP TABLE products CASCADE;
    END IF;
    
    IF (EXISTS (SELECT * 
                   FROM INFORMATION_SCHEMA.TABLES 
                   WHERE TABLE_SCHEMA = 'public' 
                   AND  TABLE_NAME = 'orders'))
    THEN
        RAISE NOTICE 'Table orders exits, dropping table';
        DROP TABLE orders CASCADE;
    END IF;
    
    IF (EXISTS (SELECT * 
                   FROM INFORMATION_SCHEMA.TABLES 
                   WHERE TABLE_SCHEMA = 'public' 
                   AND  TABLE_NAME = 'line_items'))
    THEN
        RAISE NOTICE 'Table line_items exits, dropping table';
        DROP TABLE line_items;
    END IF;
    
    CREATE TABLE products(
        id serial PRIMARY KEY,
        price INT CHECK (price >=0) NOT NULL,
        qty INT CHECK (qty >= 0) NOT NULL,
        name VARCHAR(50) NOT NULL,
        category JSONB,
        image_urls JSONB NOT NULL DEFAULT '[]',
        description VARCHAR NOT NULL DEFAULT '',
        options JSONB NOT NULL DEFAULT '[]',
        published BOOLEAN DEFAULT FALSE);
    
    INSERT INTO products (price, qty, name, image_urls, description, options ) 
       values (420, 5, 'test product', 
            '["/public/prods/shirt_0.jpg",
              "/public/prods/shirt_1.jpg",
              "/public/prods/shirt_2.jpg"]',
            'dope meme shirts',
            '[
                {"label": "size", 
                "type": "select", 
                "choices": [{"label": "small", "cost": "3"},
                            {"label": "medium", "cost": "3"},
                            {"label": "large", "cost": "3"}]
                            }
            ]');



    CREATE TABLE orders(
        id serial PRIMARY KEY,
        charge_status VARCHAR(25),
        charge_id VARCHAR(50) UNIQUE,
        shipped BOOLEAN DEFAULT FALSE,
        ship_tracking VARCHAR(100),
        ship_to JSON NOT NULL,
        customer JSON NOT NULL,
        cart JSON NOT NULL);  
        
    INSERT INTO orders (cart, customer, ship_to) VALUES ('{}', '{}', '{}');

    CREATE TABLE line_items(
        id serial PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
        qty INTEGER CHECK(qty > 0) NOT NULL,
        name VARCHAR(50) NOT NULL,
        thumb_url VARCHAR(200) NOT NULL,
        sub_total INTEGER NOT NULL,
        options JSONB NOT NULL
        );  
        
    INSERT INTO line_items (name, thumb_url, product_id, order_id, qty, sub_total, options) VALUES
			('test', '', 1, 1, 1, 1111,  '[{"sub_total": "2" }]');

CREATE OR REPLACE FUNCTION update_product_qty_del()
    RETURNS trigger AS 
    $BODY$
    DECLARE
        item_qty integer;
        stock_qty integer;
    BEGIN
        item_qty = OLD.qty;
        SELECT qty into stock_qty FROM products WHERE id = OLD.product_id;
        UPDATE products SET qty = stock_qty + item_qty 
                WHERE id = OLD.product_id;
        RETURN OLD;
    END;
    $BODY$ LANGUAGE PLPGSQL;

CREATE OR REPLACE FUNCTION update_product_qty()
    RETURNS trigger  AS
    $BODY$
    DECLARE 
        stock_qty integer;
        order_qty integer;
        prod_name varchar(50);
    BEGIN
        order_qty := NEW.qty;
        SELECT qty, name, image_urls->>0 into stock_qty, NEW.name, NEW.thumb_url FROM products WHERE id = NEW.product_id;
        
        IF NOT (EXISTS ( SELECT * FROM products WHERE id = NEW.product_id) ) THEN
            RAISE EXCEPTION 'No matching product in database';
            RETURN NULL;
        ELSIF stock_qty < order_qty THEN
            RAISE EXCEPTION 'Not enough stock to fulfill order.';
            RETURN NULL;
        ELSE
            UPDATE products SET qty = stock_qty - order_qty 
                WHERE id = NEW.product_id;
            RETURN NEW;
        END IF;

    END;
    $BODY$ LANGUAGE PLPGSQL;

drop trigger if exists update_products on line_items;
drop trigger if exists update_product_qty_del on line_items;
    
CREATE TRIGGER update_products BEFORE INSERT
    ON line_items
    FOR EACH ROW EXECUTE PROCEDURE public.update_product_qty();
CREATE TRIGGER update_products_qty_del BEFORE DELETE
    ON line_items
    FOR EACH ROW EXECUTE PROCEDURE public.update_product_qty_del(); 
END $$
