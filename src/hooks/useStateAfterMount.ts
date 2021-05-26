
import {useState, useEffect} from 'react';

export default function useStateAfterMount(useHook, ...args){
    let[state] = useState({mounted: false})
    let result = useHook(...args)
    useEffect(()=>{
        state.mounted = true;
    }, []);
    if(state.mounted){
        return {wait: false, result}
    }
    return {wait: true}
}