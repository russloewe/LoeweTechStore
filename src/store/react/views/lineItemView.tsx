import React from 'react';
import {Product, ProductOption, LineItem,
    LineItemOptionValues, ProductDetails, ProductOptions} from '../../interfaces/storeTypes';
    import {toCurrency} from '../../interfaces/storeFormatters';

function itemOptions(options: LineItemOptionValues){
    return(
        Object.entries(options).map((option, id) =>(
            <div className='row' key={id}>
                <span>{option[0]}: {option[1]}</span>
            </div>
        ))
    )
}

interface LineItemViewProps{
    item: LineItem;
};

export default function LineItemView(props: LineItemViewProps){
    const item = props.item;
    let options;
    try{
        // Plan A
        options = itemOptions(item.options);
    }catch(err){
        try{
            // Plan B
            options= <div>
                        <h4>Error Formatting Line Item Options: </h4>
                        <p>{JSON.stringify(options)}</p>
                    </div>;
        }catch(err){
            // Plan C
            options = "";
        }
    }
    return(
        <div >
        <div className="row">
            <div className="col-1">
              <img className="img-fluid" src={item.thumb_url} />
            </div>
            <div className="col-10">
                <h5 className='font-weight-normal'>
                    {item.name}
                </h5>
            </div>
        </div> 


           {options}
            <div className="row">
                <span>Qty: {item.qty}</span>
            </div>
            <div className="row">
                <span>Sub Total: {toCurrency(item.sub_total)}</span>
            </div>

            
        </div>
    )

}