import { Menu, Dropdown } from "semantic-ui-react";

export const MenuBar = ({
  uploadNewPdf,
  addText,
  isPdfLoaded,
  savingPdfStatus,
  savePdf,
}) => (
  <Menu pointing>
    <Menu.Item header>PDF Editor</Menu.Item>
    <Menu.Menu position="right">
      {isPdfLoaded && (
        <>
          <Dropdown item closeOnBlur icon="edit outline" simple>
            <Dropdown.Menu>
              <Dropdown.Item onClick={addText}>Add Text</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <Menu.Item
            name={savingPdfStatus ? "Saving..." : "Save"}
            disabled={savingPdfStatus}
            onClick={savePdf}
          />
          <Menu.Item name="Upload New" onClick={uploadNewPdf} />
        </>
      )}
    </Menu.Menu>
  </Menu>
);
