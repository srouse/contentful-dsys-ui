

export type ContentfulEntry<T> = T & {};


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