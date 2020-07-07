/* filename:     auth.js
 * author:  russell loewe
 * project: WebApp
 * github: http://github.com/russloewe/WebApp
 * desc:   
 * 	
 * Web API to authorize users
 * 	
 */

import {Product} from "../interfaces/storeTypes";
import{ErrorCode, ProductListReq, ProductListRes,
       UpdateProductReq, UpdateProductRes,
       AddProductReq, AddProductRes} from '../interfaces/storeInterface';

    
interface ProductOptions{
    knexClient: {
        (): any;
    };
}

interface ProductInterface{
    listProducts: {
        (req: ProductListReq, res: ProductListRes): Promise<any>;
    };
    config: {
        (options: ProductOptions): void;
    };
}

export class ProductController implements ProductInterface{
    knex: any;
    constructor(){
        this.listProducts = this.listProducts.bind(this);
        this.addProduct = this.addProduct.bind(this);
        this.updateProduct = this.updateProduct.bind(this);
        this.config = this.config.bind(this);
    }
    
    config( options: ProductOptions) {
        this.knex = options.knexClient;
    }

    async listProducts(req: ProductListReq, res: ProductListRes){
        try{
            // First attempt
            let products: Product[] 
                = await this.knex('products')
                                 .where('published', true);
            return(res.json(products));
        }catch(err){
            try{
                // Second attempt
                let products: Product[] 
                = await this.knex('products')
                                 .where('published', true);
                return(res.json(products));
            }catch(err){
                // Fallback
                return(res.sendStatus(ErrorCode.modelError));
            }
            
        }
    };

    async updateProduct(req: UpdateProductReq, res: UpdateProductRes){
        let product: Product;
        try{
            product = req.body;
        }catch(err){
            return(res.sendStatus(ErrorCode.badReq))
        };

        try{
            await this.knex('products')
                .where('id', product.id)
                .update(product);
            res.sendStatus(200);
        }catch(err){
            return(res.sendStatus(ErrorCode.modelError))
        }
    }

    async addProduct(req: AddProductReq, res: AddProductRes){
        let product: Product;
        try{
            product = req.body;
        }catch(err){
            return(res.sendStatus(ErrorCode.badReq))
        };
        try{
            await this.knex('products')
                     //   .returning('id')
                        .insert(product);
            res.sendStatus(200);
        }catch(err){
            return(res.sendStatus(ErrorCode.modelError))
        }
    }



};



