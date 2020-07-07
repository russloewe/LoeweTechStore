INSERT INTO products (price, qty, name, published, image_urls, description, options ) 
       values (2500, 50, 'Yeet-Shirts', true,
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
INSERT INTO products (price, qty, name, published, image_urls, description, options ) 
       values (1650, 50, 'MacWood Lids', true,
            '["/public/prods/hat_0.jpg",
              "/public/prods/hat_1.jpg",
              "/public/prods/hat_2.jpg"]',
            'dope meme hats. Use your imagination',
            '[
                {"label": "style", 
                "type": "select", 
                "choices": [{"label": "Trucker", "cost": "3"},
                            {"label": "One-Size", "cost": "3"},
                            {"label": "Dew-Rog", "cost": "3"}]
                            },
                {"label": "color", 
                "type": "select", 
                "choices": [{"label": "Yeet-Yellow"},
                            {"label": "Blood-Blue"},
                            {"label": "Rebel-Red"}]
                            }
            ]');
INSERT INTO products (price, qty, name, published, image_urls, description, options ) 
       values (8500, 50, 'Air Yeets', true,
            '["/public/prods/shoe_0.jpg",
              "/public/prods/shoe_1.jpg",
              "/public/prods/shoe_2.jpg"]',
            'Meme air jordans because.',
            '[
                {"label": "color", 
                "type": "select", 
                "choices": [{"label": "White"},
                            {"label": "Black"}]
                            }
            ]');

