import { useEffect, useState } from "react";
import Mask from "../mask/mask-component";
import Messages from "../messages/messages.component";
import Group from "../group/index";

const componentMatchString = {
  mask: "Mask",
  messages: "Messages",
  group: "Group",
};

export default function ComponentResolver() {
  const [currentComponent, setComponent] = useState(componentMatchString.mask);

  const showMask = () => setComponent(componentMatchString.mask);
  const showMessages = () => setComponent(componentMatchString.messages);
  const showGroup = () => setComponent(componentMatchString.group);

  const renderComponent = () => {
    switch (currentComponent) {
      case componentMatchString.messages:
        return (
          <Messages showMessages={showMessages} tabInactiveHandler={showMask} />
        );
        break;

      case componentMatchString.group:
        return <Group showGroup={showGroup} />;
        break;

      default:
      case componentMatchString.mask:
        return <Mask showMessages={showMessages} showGroup={showGroup} />;
        break;
    }
  };
  return <>{renderComponent()}</>;
}
