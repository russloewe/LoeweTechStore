import React from 'react';
import{ShipDest} from '../../interfaces/storeTypes';

function ShippingTableRow(item1, item2){
    return(
        <tr>
                <td>
                    {item1}
                </td>
                <td>
                    {item2}
                </td>
            </tr>
    )
}
function ShippingTableRow_CityState(item1, item2){
    return(
        <tr>
                <td>
                    City
                </td>
                <td>
                    {item1}
                </td>
                <td>
                    State
                </td>
                <td>
                    {item2}
                </td>
            </tr>
    )
}

export default function ShippingTable(shipping: ShipDest){
    let table;
    try{
        // Plan A
        table = <table>
                    {ShippingTableRow('Name', shipping.name)}
                    {ShippingTableRow('Line1', shipping.addr_1)}
                    {ShippingTableRow('Line2', shipping.addr_2)}
                    {ShippingTableRow_CityState(shipping.city, shipping.state)}
                    {ShippingTableRow('Zipcode', shipping.zipcode)}
                </table>
    }catch(err){
        try{
            // Plan B
            table= <div>
                        <h4>Error Fromatting shipping data: </h4>
                        <p>{JSON.stringify(shipping)}</p>
                    </div>;
        }catch(err){
            // Plan C
            table = <div>
                        <h4>Error Fromatting shipping data</h4>
                        <p> :( :( :( </p>
                    </div>;
        }
    }
    return(table)

}