import { useEffect, useRef } from "react"

export const customUseEffect = (cb, depsArray) => {

    const ref = useRef(false);
    const prevDeps = useRef([]);

    if(depsArray===undefined){
        cb();
        return
    }

    if(!ref.current) {
        ref.current=true;
        prevDeps.current=depsArray;
        cb();
        return;
    }
    if(ref.current && JSON.stringify(prevDeps.current)!==JSON.stringify(depsArray)){
        prevDeps.current=JSON.stringify(depsArray);
        cb();
        return;
    }
}


export const customUseMemo = (cb, depsArray) => {

    const ref = useRef(null);

    const isEqual = (prevArray, currArray) => {

        if(prevArray===null) return false;
    
        if(prevArray.length !== currArray.length) return false;
    
        for(let i=0; i<prevArray.length; i++) {
            if(prevArray[i]!==currArray[i]){
                return false;
            }
        }
        return true;
    }
    if(!ref.current || !isEqual(ref.current.depsArray, depsArray)){
        ref.current={
            value:cb(),
            depsArray
        }
    }

    useEffect(()=>{
        return ()=>{
            ref.current=null;
        }
    },[])
    
    return ref.current.value;
}