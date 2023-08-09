import React, { useState, useRef } from 'react';
import { getMovePosition } from '../utils/helpers';
import ResizableField from '../components/ResizableField';
import { useAttachments } from '../hooks/useAttachments';

export const Text = ({
  id,
  x,
  y,
  placeholder,
  width,
  height,
  lineHeight,
  size,
  fontFamily,
  pageHeight,
  pageWidth,
  updateTextAttachment,
  attachmentIndex,
}) => {
  const inputRef = useRef(null);
  const [content, setContent] = useState(placeholder || '');
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(y);
  const [positionLeft, setPositionLeft] = useState(x);
  const [operation, setOperation] = useState("NO_MOVEMENT");
  const [textMode, setTextMode] = useState("command");

  const { remove } = useAttachments();

  const handleMouseMove = (event) => {
    event.preventDefault();

    if (mouseDown) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );

      setPositionTop(top);
      setPositionLeft(left);
    }
  };

  const handleMousedown = () => {
    if (textMode !== "command") {
      return;
    }

    setMouseDown(true);
    setOperation("MOVE");
  };

  const handleMouseUp = (event) => {
    event.preventDefault();

    if (textMode !== "command") {
      return;
    }

    setMouseDown(false);

    if (operation === "MOVE") {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );

      updateTextAttachment({
        x: left,
        y: top,
      });
    }

    setOperation("NO_MOVEMENT");
  };

  const handleMouseOut = (event) => {
    if (operation === "MOVE") {
      handleMouseUp(event);
    }

    if (textMode === "insert") {
      setTextMode("command");
      prepareTextAndUpdate();
    }
  };

  const prepareTextAndUpdate = () => {
    document.getSelection()?.removeAllRanges();

    const lines = [content];
    updateTextAttachment({
      lines,
      placeholder: content,
    });
  };

  const toggleEditMode = () => {
    const input = inputRef.current;
    const mode = textMode === "command" ? "insert" : "command";

    setTextMode(mode);

    if (input && mode === "insert") {
      input.focus();
      input.select();
    } else {
      prepareTextAndUpdate();
    }
  };

  const onChangeText = (event) => {
    const value = event.currentTarget.value;
    setContent(value);
  };

  const handleAttachmentRemove = () => {
    console.log('cliked on ', attachmentIndex);
    remove(attachmentIndex);
  };

  return (
    <ResizableField
      id={id}
      handleAttachmentRemove={handleAttachmentRemove}
      mode={textMode}
      placeholder={placeholder}
      size={size}
      lineHeight={lineHeight}
      inputRef={inputRef}
      fontFamily={fontFamily}
      positionTop={positionTop}
      onChangeText={onChangeText}
      positionLeft={positionLeft}
      toggleEditMode={toggleEditMode}
      handleMouseUp={handleMouseUp}
      handleMouseOut={handleMouseOut}
      handleMouseDown={handleMousedown}
      handleMouseMove={handleMouseMove}
    />
  );
};
