import React from 'react';
import ReactDOM from 'react-dom';
import FadeIn from "react-fade-in";
import {Product,  ProductOption, ProductChoice, ProductOptions} from '../../interfaces/storeTypes';


interface OptionProps{
    options: ProductOptions;
    values: {
        [key: string]: string;
    };
    onChange: any;
}
export default class ItemOptionForm extends React.Component{
    props: OptionProps;
    constructor(props: OptionProps){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.productOption = this.productOption.bind(this);
    }

    handleChange(event) {
        this.props.onChange(event);
      }
      
    productOption(option: ProductOption, id: number){
        let input;
        let name: string = option.label;
        let value = this.props.values[name];
        switch(option.type){
            case 'select':
                input = <select  value={value} name={name} onChange={this.handleChange}>
                    {option.choices.map((choice: ProductChoice, i: number) => (
                        <option key={i} value={choice.label}>{choice.label}</option>
                    ))}
                </select>;
                break;
            case 'number':
                input = <input  className='form-control' type='number' value={value} name={name} step={1} onChange={this.handleChange} />;
                break;
            default:
                input = <input  className='form-control' type={option.type} name={name} value={value} onChange={this.handleChange} />;

                break;
        };
        return(
            <div className='row' key={id}>
                    <div className='col-md-4'>
                        {name}
                    </div>
                    <div className='col-md-4'>
                        {input}
                    </div>
                    <div className='col-md-4'>
                    </div>
                </div>
        )
    }

    render(){
        return(
            <div>
                {this.props.options.map(
                    (option, id) => (this.productOption(option, id))
                )}
            </div>
        )
    }

}