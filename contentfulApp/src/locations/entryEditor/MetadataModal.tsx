import { EditorAppSDK, FieldAppSDK } from "@contentful/app-sdk";
import { Field, FieldWrapper } from "@contentful/default-field-editors";
import { Button, Modal } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";

type MetadataModalProps = {
  showModal: boolean,
  closeModal: () => void,
}

const MetadataModal = ({
  showModal,
  closeModal
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
              title=""
              onClose={() => closeModal()}
            />
            <Modal.Content>
              <FieldWrapper sdk={titleSDK} name={'Title'}>
                <Field sdk={titleSDK} />
              </FieldWrapper>
              <FieldWrapper sdk={slugSDK} name={'Slug'}>
                <Field sdk={slugSDK} />
              </FieldWrapper>
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
