import React from 'react';
import {Controller} from 'react-hook-form';
import ErrorBoundary from '../../generic/ErrorBoundary';


export default function withController(Component){
    return function _Component(props){
        let {name, control, defaulValue, ...rest} = props;
        return (
            <ErrorBoundary>
                <Controller
                name={name}
                control={control}
                defaultValue={defaulValue}
                render={({field}) =>{
                    return <Component {...field} {...rest}/>
                }}
                />
            </ErrorBoundary>
        )
    }

}