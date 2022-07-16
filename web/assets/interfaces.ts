// this type may use null instead of undefined
export interface Spell {
  name: string,
  url: string,
  school: {
    school?: string,
    'sub-school'?: string,
    descriptors?: []
  },
  /** key is class and value is number */
  classes: any | {
    cleric?: number,
    paladin?: number,
    sorcerer?: number,
    wizard?: number,
    druid?: number
  },
  'casting-time'?: string,
  components: {
    verbal: boolean,
    somatic: boolean,
    material?: string,
    focus?: string,
    divineFocus: boolean
  },
  effect: {
    range?: string,
    area?: string,
    target?: string,
    duration?: string,
    dismissible: boolean
  },
  'saving-throw': {
    fortitude: boolean,
    reflex: boolean,
    will: boolean,
    description?: string
  },
  'spell-resistance': {
    applies: boolean,
    description?: string
  },
  description?: string,
  'source-book'?: string,
  'related-spell-names'?: string[]
}
