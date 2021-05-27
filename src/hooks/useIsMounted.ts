import {useEffect, useState} from "react";
import { isLoggedIn } from 'src/util/TokenProvider';
import {useRouter} from 'next/router';
import BrowserProvider from "src/util/browser/BrowserProvider";
const useIsMounted = (shouldCheckLogin?:boolean) => {
  const router = useRouter();
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    if(shouldCheckLogin){
      if(!isLoggedIn()){
        router.push(BrowserProvider.getUrl('LOGIN'))
      }
    }
    setMounted(true)
  }, []);
  return isMounted;
};

export default useIsMounted;