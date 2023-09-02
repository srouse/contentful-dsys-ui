import { EditorAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { Field, FieldWrapper } from "@contentful/default-field-editors";
import { Button, Modal } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { ReactElement } from "react";

type MetadataModalProps = {
  showModal: boolean,
  closeModal: () => void,
  componentSelector: ReactElement<any, any>
}

const MetadataModal = ({
  showModal,
  closeModal,
  componentSelector
}: MetadataModalProps) => {
  const sdk = useSDK<EditorAppSDK>();

  const titleSDK: FieldAppSDK  = {
    ...sdk,
    field: sdk.entry.fields["title"].getForLocale('en-US')
  } as FieldAppSDK;

  const slugSDK: FieldAppSDK  = {
    ...sdk,
    field: sdk.entry.fields["slug"].getForLocale('en-US')
  } as FieldAppSDK;

  return (
    <Modal onClose={() => closeModal()} isShown={showModal} size={'medium'}>
        {() => (
          <>
            <Modal.Header
              title="Web Component Metadata"
              onClose={() => closeModal()}
            />
            <Modal.Content>
              <FieldWrapper sdk={titleSDK} name={'Title'}>
                <Field sdk={titleSDK} />
              </FieldWrapper>
              <FieldWrapper sdk={slugSDK} name={'Slug'}>
                <Field sdk={slugSDK} />
              </FieldWrapper>
              {componentSelector}
            </Modal.Content>
            <Modal.Controls>
              <Button
                variant="positive"
                size="small"
                onClick={async () => {
                  await sdk.entry.save();
                  closeModal();
                }}
              >
                Done
              </Button>
            </Modal.Controls>
          </>
        )}
      </Modal>
  );
}

export default MetadataModal;
