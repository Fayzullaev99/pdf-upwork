import { useReducer, useCallback } from 'react';

const initialState = {
  pageIndex: -1,
  allPageAttachments: [],
  pageAttachments: [],
};

const reducer = (state, action) => {
  const { pageIndex, allPageAttachments, pageAttachments } = state;

  switch (action.type) {
    case "ADD_ATTACHMENT": {
      const newAllPageAttachmentsAdd = allPageAttachments.map((attachments, index) =>
        pageIndex === index ? [...attachments, action.attachment] : attachments
      );

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsAdd,
        pageAttachments: newAllPageAttachmentsAdd[pageIndex],
      };
    }
    case "REMOVE_ATTACHMENT": {
      const newAllPageAttachmentsRemove = allPageAttachments.map(
        (otherPageAttachments, index) => {
          if (pageIndex === index) {
            return pageAttachments.filter(
              (_, _attachmentIndex) => _attachmentIndex !== action.attachmentIndex
            );
          }
          return otherPageAttachments;
        }
      );

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsRemove,
        pageAttachments: newAllPageAttachmentsRemove[pageIndex],
      };
    }
    case "UPDATE_ATTACHMENT": {
      if (pageIndex === -1) {
        return state;
      }

      const newAllPageAttachmentsUpdate = allPageAttachments.map((otherPageAttachments, index) =>
        pageIndex === index
          ? pageAttachments.map((oldAttachment, _attachmentIndex) =>
              _attachmentIndex === action.attachmentIndex
                ? { ...oldAttachment, ...action.attachment }
                : oldAttachment
            )
          : otherPageAttachments
      );

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsUpdate,
        pageAttachments: newAllPageAttachmentsUpdate[pageIndex],
      };
    }
    case "UPDATE_PAGE_INDEX": {
      return {
        ...state,
        pageIndex: action.pageIndex,
        pageAttachments: allPageAttachments[action.pageIndex],
      };
    }
    case "RESET": {
      return {
        pageIndex: 0,
        pageAttachments: [],
        allPageAttachments: Array(action.numberOfPages).fill([]),
      };
    }
    default: {
      return state;
    }
  }
};

export const useAttachments = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { allPageAttachments, pageAttachments } = state;

  const add = (newAttachment) =>
    dispatch({ type: "ADD_ATTACHMENT", attachment: newAttachment });

  const remove = (attachmentIndex) =>
    dispatch({ type: "REMOVE_ATTACHMENT", attachmentIndex });

  const update = (attachmentIndex, attachment) =>
    dispatch({
      type: "UPDATE_ATTACHMENT",
      attachmentIndex,
      attachment,
    });

  const reset = (numberOfPages) =>
    dispatch({ type: "RESET", numberOfPages });

  const setPageIndex = useCallback(
    (index) => {
      dispatch({ type: "UPDATE_PAGE_INDEX", pageIndex: index });
    },
    [dispatch]
  );

  return {
    add,
    reset,
    remove,
    update,
    setPageIndex,
    pageAttachments,
    allPageAttachments,
  };
};
