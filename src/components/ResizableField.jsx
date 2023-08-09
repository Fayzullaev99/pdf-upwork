import {useEffect, useRef } from 'react';
import styles from '../styles/resizeabledField.module.css';
import makeResizableElement from '../utils/makeResizableElement';

function ResizableField({
  inputRef,
  id,
  mode,
  size,
  placeholder,
  fontFamily,
  positionTop,
  positionLeft,
  onChangeText,
  toggleEditMode,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  lineHeight,
  handleAttachmentRemove,
}) {
  const resizeDivRef = useRef(null);

  useEffect(() => {
    if (resizeDivRef.current && inputRef.current) {
      makeResizableElement(
        resizeDivRef.current,
        document.querySelectorAll('#resizer'),
        inputRef.current,
        positionLeft,
        positionTop
      );
    }
  }, [inputRef,positionLeft,positionTop]);

  return (
    <div
      ref={resizeDivRef}
      className={styles.resizable}
      onClick={toggleEditMode}
      onMouseDown={handleMouseDown}
      id={id}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      style={{
        fontFamily,
        fontSize: size,
        lineHeight,
        cursor: `${mode === "command" ? 'move' : 'default'},all-scroll`,
        top: positionTop,
        left: positionLeft,
      }}
    >
      <div id={id} className={styles.resizers}>
        <div id='remove' className={`${styles.removeIcon}`} onClick={handleAttachmentRemove}>
        &ang;
        </div>
        <div id='resizer' className={`${styles.resizer} ${styles.top} topResizer`}></div>
        <div id='resizer' className={`${styles.resizer} ${styles.topRight} topRightResizer`}></div>
        <div id='resizer' className={`${styles.resizer} ${styles.right} rightResizer`}></div>
        <div
          id='resizer'
          className={`${styles.resizer} ${styles.bottomRight} bottomRightResizer`}
        ></div>
        <div id='resizer' className={`${styles.resizer} ${styles.bottom} bottomResizer`}></div>
        <div
          id='resizer'
          className={`${styles.resizer} ${styles.bottomLeft} bottomLeftResizer`}
        ></div>
        <div id='resizer' className={`${styles.resizer} ${styles.left} leftResizer`}></div>
        <div id='resizer' className={`${styles.resizer} ${styles.topLeft} topLeftResizer`}></div>
      <input
        type='text'
        ref={inputRef}
        placeholder={"Write"}
        onChange={onChangeText}
        readOnly={mode === "command"}
        style={{
          fontFamily,
          fontSize: size,
          lineHeight,
          cursor: mode === "command" ? 'move' : 'text',
        }}
        className={styles.resizableInput}
      />
      </div>
    </div>
  );
}

export default ResizableField;
