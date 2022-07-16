// this type may use null instead of undefined
export interface Spell {
  name: string,
  link: string,
  school: {
    school?: string,
    subSchool?: string,
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
  castingTime: {
    unit?: string,
    time?: string
  },
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
  savingThrow: {
    fortitude: boolean,
    reflex: boolean,
    will: boolean,
    description?: string
  },
  spellResistance: {
    applies: boolean,
    description?: string
  },
  description?: string,
  sourceBook?: string,
  relatedSpellNames?: string[]
}
