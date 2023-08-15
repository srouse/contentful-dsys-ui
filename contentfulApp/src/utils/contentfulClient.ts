import { createClient, ContentfulClientApi, Entry, EntryCollection } from 'contentful';

/**
 * getEntry
 * @param {string} space
 * @param {string} environment
 * @param {string} accessToken
 * @param {string} entryId
 * @param {boolean} usePreview
 */
export async function getEntry(
    space: string | undefined,
    environment: string | undefined,
    accessToken: string | undefined,
    entryId: string,
): Promise<Entry<any> | void> {
  /* let client: ContentfulClientApi | false;
  if (
    !space ||
    !environment ||
    !accessToken
  ) {
    client = getClientFromLocalStorage( false );
  } else { */
  const client = getClient(
      space,
      environment,
      accessToken,
      false,
  );
  // }
  if (client && entryId) {
    return await client.getEntry(
        entryId, {include: 6},
    ).catch(
        console.error,
    );// eat the error
  }
  console.error('could NOT find contentful entry');
}

/**
 * getEntries
 * @param {string} space
 * @param {string} environment
 * @param {string} accessToken
 * @param {string} contentType
 * @param {boolean} usePreview
 */
export async function getEntries(
    space: string | undefined,
    environment: string | undefined,
    accessToken: string | undefined,
    contentType: string,
): Promise<EntryCollection<any> | void> {
  if (
    !space ||
    !environment ||
    !accessToken
  ) {
    console.error('not enough info to create Contentful client');
    return;
  }
  const client = getClient(
      space,
      environment,
      accessToken,
      false,
  );
  if (client && contentType) {
    const result = await client.getEntries({
      content_type: contentType,
      include: 6,
      limit: 1000,
    }).catch(console.error);// eat the error
    if (result && result.total > 900) {
      console.error('approaching 1000 limit!!!!!');
    }
    return result;
  }
  console.error('could NOT find contentful entry');
}

/**
 * getPreviewEntry
 * @param {string} space
 * @param {string} environment
 * @param {string} previewAccessToken
 * @param {string} entryId
 */
export async function getPreviewEntry(
    space: string | undefined,
    environment: string | undefined,
    previewAccessToken: string | undefined,
    entryId: string,
): Promise<Entry<any> | void> {
  /* let client: ContentfulClientApi | false;
  if (
    !space ||
    !environment ||
    !previewAccessToken
  ) {
    client = getClientFromLocalStorage( true );
  } else { */
  const client = getClient(
      space,
      environment,
      previewAccessToken,
      true,
  );
  // }
  if (client && entryId) {
    const entry = await client.getEntry(
        entryId, {include: 5},
    ).catch(console.error);// eat the error
    return entry;
  }
  console.error('could NOT find contentful entry');
}

/**
 * getPreviewEntries
 * @param {string} space
 * @param {string} environment
 * @param {string} previewAccessToken
 * @param {string} contentType
 * @param {boolean} usePreview
 */
export async function getPreviewEntries(
    space: string | undefined,
    environment: string | undefined,
    previewAccessToken: string | undefined,
    contentType: string,
): Promise<EntryCollection<any> | void> {
  /* if (
    !space ||
    !environment ||
    !previewAccessToken
  ) {
    client = getClientFromLocalStorage( true );
  } else { */
  const client = getClient(
      space,
      environment,
      previewAccessToken,
      true,
  );
  // }
  if (client && contentType) {
    const result = await client.getEntries({
      content_type: contentType,
      include: 6,
      limit: 1000,
    }).catch(console.error);// eat the error
    if (result && result.total > 900) {
      console.error('approaching 1000 limit!!!!!');
    }
    return result;
  }
  console.error('could NOT find contentful entry');
}

/**
 * getClient
 * @param {string} space
 * @param {string} environment
 * @param {string} accessToken
 * @param {boolean} usePreview
 * @return {ContentfulClientApi}
 */
export function getClient(
    space: string | undefined,
    environment: string | undefined,
    accessToken: string | undefined,
    usePreview: boolean,
) :ContentfulClientApi | false {
  if (
    !space ||
    !environment ||
    !accessToken
  ) {
    console.error('was not passed contentful client info');
    return false;
  }

  const config: any = {
    space,
    environment,
    accessToken,
  };
  if (usePreview) {
    config.host = 'preview.contentful.com';
  }
  return createClient(config);
}

/**
 * getClientFromLocalStorage
 * a way to avoid having to force environment variables into app...
 * put this into your Session Storage (via Web Developer in browser)
 * contentful-access-token
 * contentful-space
 * contentful-environment
 * @param {boolean} usePreview
 * @return {ContentfulClientApi | false}
 */
/*
export function getClientFromLocalStorage(
    usePreview: boolean,
): ContentfulClientApi | false {
  const space = local Storage.getItem('contentful-space');
  const environment = local Storage.getItem('contentful-environment');
  let accessToken = local Storage.getItem('contentful-access-token');
  if (usePreview) {
    accessToken = local Storage.getItem('contentful-preview-access-token');
  }

  if (
    !space ||
    !environment ||
    !accessToken
  ) {
    console.error('could NOT find contentful client info');
    return false;
  }

  const config: any = {
    space,
    environment,
    accessToken,
  };
  if (usePreview) {
    config.host = 'preview.contentful.com';
  }

  return contentful.createClient(config);
}
*/
