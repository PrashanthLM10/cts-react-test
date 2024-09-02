import { useEffect, useState } from "react";
import Mask from '../mask/mask-component';
import Messages from '../messages/messages.component';
import { debounce } from '../../utils/debounce';

let setInactivityTimer = (tabInactiveHandler) => {
    const resetTimer = () => {
    const inactiveTime = Number(process.env.INACTIVE_TIME_LIMIT || process.env.REACT_APP_INACTIVE_TIME_LIMIT)*1000
      tabInactiveHandler(false);
      clearTimeout(time);
      time = setTimeout(() => tabInactiveHandler(true), inactiveTime)
    }
    const debouncedResetTimer = debounce(resetTimer, 5000);
  
    let time;
    window.onload = resetTimer; 
    window.ontouchstart = debouncedResetTimer; 
    window.onclick = debouncedResetTimer; 
    window.onkeydown = debouncedResetTimer; 
  };

export default function ComponentResolver() {
    const [isTabInactive, setIsTabInactive] = useState(false);
    const tabInactiveHandler = (flag) => setIsTabInactive(flag);
    const [showMessages, setShowMessages] = useState(false);
    setInactivityTimer(tabInactiveHandler);
    
    useEffect(() => {
        if(isTabInactive) {
            setShowMessages(false);
        }
    }, [isTabInactive])
    return(
        <>
            {!showMessages && <Messages setShowMessages={setShowMessages}/>}
            {showMessages && <Messages setShowMessages={setShowMessages}/>}
        </>
    )
}