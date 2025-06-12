import { useEffect, useState } from "react";
import Mask from '../mask/mask-component';
import Messages from '../messages/messages.component';
import Group from '../group/index';
import { debounce } from '../../utils/debounce';

let setInactivityTimer = (tabInactiveHandler) => {
    const resetTimer = () => {
    const inactiveTime = Number(process.env.REACT_APP_INACTIVE_TIME_LIMIT)*1000
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

  const componentMatchString = {
    mask: 'Mask',
    messages: 'Messages',
    group: 'Group'
  }

export default function ComponentResolver() {
    const [isTabInactive, setIsTabInactive] = useState(false);
    const tabInactiveHandler = (flag) => setIsTabInactive(flag);
    const [currentComponent, setComponent] = useState(componentMatchString.mask);
    setInactivityTimer(tabInactiveHandler);
    
    useEffect(() => {
        if(isTabInactive) {
            showMask();
        }
    }, [isTabInactive])

    const showMask = () => setComponent(componentMatchString.mask);
    const showMessages = () => setComponent(componentMatchString.messages);
    const showGroup = () => setComponent(componentMatchString.group);

    const renderComponent = () => {
        switch(currentComponent) {
            
            case componentMatchString.messages:
                return <Messages showMessages={showMessages}/>           
                break;
                
            case componentMatchString.group:
                return <Group showGroup={showGroup} />
                break;
                
            default:
            case componentMatchString.mask:
                return <Mask showMessages={showMessages} showGroup={showGroup}/>
                break;
        } 
    }
    return(
        <>
            {renderComponent()}
        </>
    )
}
