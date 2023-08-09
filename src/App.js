import { useEffect, useRef } from 'react';
import 'semantic-ui-css/semantic.min.css';
import { Container, Grid, Button, Segment } from 'semantic-ui-react';
import { MenuBar } from './components/MenuBar';
import { usePdf } from './hooks/usePdf';
import { useAttachments } from './hooks/useAttachments';
import { useUploader } from './hooks/useUploader';
import { Empty } from './components/Empty';
import { Page } from './components/Page';
import { Attachments } from './components/Attachments';
import AttachmentProvider from './context/AttachmentContext';

const App = () => {
  const ref = useRef(null);
  const inputRef = useRef(null);
  const {
    file,
    initialize,
    pageIndex,
    isMultiPage,
    isFirstPage,
    isLastPage,
    currentPage,
    isSaving,
    savePdf,
    previousPage,
    nextPage,
    setDimensions,
    name,
    dimensions,
  } = usePdf();
  console.log(isLastPage);
  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
    update,
    remove,
    setPageIndex,
  } = useAttachments();

  useEffect(() => {
    setPageIndex(pageIndex);
  }, [pageIndex]);

  const initializePageAndAttachments = (pdfDetails) => {
    initialize(pdfDetails);
    const numberOfPages = pdfDetails.pages.length;
    resetAttachments(numberOfPages);
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
  } = useUploader({
    use: "pdf",
    afterUploadPdf: initializePageAndAttachments,
  });

  const addText = () => {
    const newTextAttachment = {
      id: Date.now(),
      type: "text",
      x: 0,
      y: 0,
      width: 20,
      height: 14,
      size: 14,
      lineHeight: 1.4,
      fontFamily: 'Times-Roman',
      placeholder: 'Enter',
    };
    addAttachment(newTextAttachment);
  };

  const hiddenInputs = (
    <>
      <input
        ref={pdfInput}
        type='file'
        name='pdf'
        id='pdf'
        accept='application/pdf'
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: 'none' }}
      />
    </>
  );

  const handleSavePdf = () => savePdf(allPageAttachments);

  return (
    <AttachmentProvider>
      <Container style={{ margin: 30 }}>
        {hiddenInputs}
        <MenuBar
          savePdf={handleSavePdf}
          addText={addText}
          savingPdfStatus={isSaving}
          uploadNewPdf={handlePdfClick}
          isPdfLoaded={!!file}
        />

        {!file ? (
          <Empty loading={isUploading} uploadPdf={handlePdfClick} />
        ) : (
          <Grid>
            <Grid.Row>
              <Grid.Column width={3} verticalAlign='middle' textAlign='left'>
                {isMultiPage && !isFirstPage && (
                  <Button circular icon='angle left' onClick={previousPage} />
                )}
              </Grid.Column>
              <Grid.Column width={10}>
                {currentPage && (
                  <Segment compact stacked={isMultiPage && !isLastPage}>
                    <div style={{ position: 'relative' }}>
                      <Page
                        dimensions={dimensions}
                        updateDimensions={setDimensions}
                        page={currentPage}
                      />
                      {dimensions && (
                        <Attachments
                          pdfName={name}
                          removeAttachment={remove}
                          updateAttachment={update}
                          pageDimensions={dimensions}
                          attachments={pageAttachments}
                        />
                      )}
                    </div>
                  </Segment>
                )}
              </Grid.Column>
              <Grid.Column width={3} verticalAlign='middle' textAlign='right'>
                {isMultiPage && !isLastPage && (
                  <Button circular icon='angle right' onClick={nextPage} />
                )}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        )}
      </Container>
    </AttachmentProvider>
  );
};

export default App;
