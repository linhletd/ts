import React from 'react';
import {Controller} from 'react-hook-form';
import ErrorBoundary from '../../generic/ErrorBoundary';


export default function withController(_Component){
    return function Component({name, control, defaulValue, ...rest}){
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