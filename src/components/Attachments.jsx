import { Text } from '../containers/Text';

export const Attachments = ({
  attachments,
  pdfName,
  pageDimensions,
  updateAttachment,
  removeAttachment,
}) => {
  const handleAttachmentUpdate = (index) => (attachment) =>
    updateAttachment(index, attachment);
  return attachments ? (
    <>
      {attachments.length
        ? attachments.map((attachment, index) => {
            const key = `${attachment.id}`;
            if (attachment.type === "text") {
              return (
                <Text
                  key={key}
                  attachmentIndex={index}
                  pageWidth={pageDimensions.width}
                  pageHeight={pageDimensions.height}
                  updateTextAttachment={handleAttachmentUpdate(index)}
                  {...(attachment)}
                />
              );
            }
            return null;
          })
        : null}
    </>
  ) : null;
};
