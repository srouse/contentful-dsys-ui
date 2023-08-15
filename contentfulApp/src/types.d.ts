
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
}

export type MemberInput = {
  default?: string,
  type: 'string' | 'select' | 'reference',
  selectItems?: string[],
  attribute: string,
  value?: string,
}