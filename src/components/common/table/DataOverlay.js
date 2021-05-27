import React, { useState, useRef } from 'react';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

export default function DataOverlay({ textContent, title, maxTextLength }) {
  !maxTextLength && (maxTextLength = 50);
  const [show, setShow] = useState(false);
  const [target, setTarget] = useState(null);
  const ref = useRef(null);

  const handleClick = (event) => {
    setShow(!show);
    setTarget(event.target);
  };
  if (!textContent) textContent = '';
  if (typeof textContent !== 'string') {
    textContent = String(textContent);
  }
  if (textContent.length < maxTextLength) {
    return <>{textContent}</>;
  } else {
    let shortContent = textContent.slice(0, maxTextLength) + ' ...';
    return (
      <>
        <div ref={ref} onClick={handleClick} style={{ overflowWrap: 'break-word', display: 'inline-block', height: '100%' }}>
          {shortContent}
        </div>
        <Overlay show={show} target={target} placement="bottom" container={ref.current} containerPadding={20}>
          <Popover id="popover-contained">
            <Popover.Title as="h3">{title}</Popover.Title>
            <Popover.Content>{textContent}</Popover.Content>
          </Popover>
        </Overlay>
      </>
    );
  }
}
