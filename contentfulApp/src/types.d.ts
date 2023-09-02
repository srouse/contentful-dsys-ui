import { Entry } from "contentful"

export type WebComponent = {
  kind: string,
  description: string,
  name: string,
  members: WebComponentMember[],
  attributes: WebComponentAttribute[],
  superclass: {
    name: string,
    package: string
  },
  tagName: string,
  customElement: boolean
  slots?: WebComponentMember[]
}

export type WebComponentAttribute = {
  name: string,
  type: {
    text: string
  },
  default: string,
  fieldName: string
}

export type WebComponentMember = {
  kind: string,
  name: string,
  type: {
    text: string
  },
  default: string,
  attribute: string,
  reflects: boolean,
  value?: string,
  valueArr? : string[],
  description?: string,
}

export type MemberInputType = 
'string' | 'select' |
'reference' | 'referenceArray'

export type MemberInput = {
  default?: string,
  type: MemberInputType,
  selectItems?: string[],
  attribute: string,
  value?: string,
  valueArr?: string[],
  description?: string,
}

export interface IWebsiteFields {
  /** Title */
  title?: string | undefined;

  /** HTML Full Template */
  htmlFullTemplate?: string | undefined;

  /** HTML Simple Template */
  htmlSimpleTemplate?: string | undefined;

  /** Metadata */
  metadata?: IWebComponent | undefined;

  /** Header */
  header?: IWebComponent | undefined;

  /** Footer */
  footer?: IWebComponent | undefined;
}

export interface IWebsite extends Entry<IWebsiteFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "website";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}


export interface IWebComponentFields {
  /** Title */
  title?: string | undefined;

  /** Configuration */
  configuration?: Record<string, any> | undefined;

  /** Output */
  output?: string | undefined;

  /** References */
  references?: Entry<{ [fieldId: string]: unknown }>[] | undefined;
}

export interface IWebComponent extends Entry<IWebComponentFields> {
  sys: {
    id: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
    contentType: {
      sys: {
        id: "webComponent";
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
}