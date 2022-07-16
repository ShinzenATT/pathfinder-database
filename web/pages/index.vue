<template>
  <v-card>
    <v-alert v-if="error" color="error" text>
      {{ error }}
    </v-alert>
    <v-data-table
      :items="spells"
      :loading="loading"
      :headers="headers"
      sort-by="name"
      must-sort
      :search="search"
      show-expand
      single-expand
      :expanded="expanded"
      :page.sync="currentPage"
      :group-by="groupBy"
      group-desc
      :footer-props="{
        itemsPerPageOptions: [20, 25, 30 , 40, 50, 100, -1]
      }"
      item-key="name"
      @click:row="row => expandRow(row)"
      @page-count="c => pageCount = c"
    >
      <template #top>
        <v-card-title>
          <v-row dense>
            <v-col>
              <v-text-field v-model="search" style="min-width: 150px" prepend-inner-icon="mdi-magnify" outlined label="Search" />
            </v-col>
            <v-col>
              <v-select
                v-model="groupBy"
                style="min-width: 150px"
                outlined
                label="Group by"
                :items="groupOptions"
                clearable
              />
            </v-col>
          </v-row>
        </v-card-title>
      </template>

      <template #group.header="props">
        <td :colspan="headers.length + 1" @click="props.toggle()">
          <v-btn v-if="props.isOpen" small icon>
            <v-icon>mdi-menu-up</v-icon>
          </v-btn>
          <v-btn v-else small icon>
            <v-icon>mdi-menu-down</v-icon>
          </v-btn>
          {{ props.group[0] ? props.group : 'Unknown' }}
        </td>
      </template>

      <template #item.classes="props">
        {{ getClassesStr(props.value) }}
      </template>

      <template #item.components="props">
        {{ getComponentsStr(props.item) }}
      </template>

      <template #footer.prepend>
        <v-pagination v-model="currentPage" :length="pageCount" total-visible="15" />
      </template>

      <template #expanded-item="props">
        <td :colspan="headers.length + 1">
          <v-card-text>
            <v-row>
              <v-col cols="9">
                <h2>{{ props.item.name }}</h2>
                <h6 v-if="props.item.relatedSpellNames">
                  {{ props.item.relatedSpellNames.join(', ') }}
                </h6>
              </v-col>
              <v-col cols="3">
                <v-btn style="width: 100%" @click="() => overlay = true">
                  View in D20
                </v-btn>
              </v-col>
              <v-col> {{ getComponentsStr(props.item) }} </v-col>
              <v-col> {{ getClassesStr(props.item.classes) }} </v-col>
              <v-col> {{ props.item.castingTime.time + ' ' + props.item.castingTime.unit }} </v-col>
              <v-col cols="12">
                {{ props.item.description }}
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Website modal -->
          <v-lazy>
            <v-overlay v-if="overlay" @click="() => overlay = false">
              <iframe
                style="position: fixed; top: 5%;"
                :style="'left:' + ($vuetify.breakpoint.mdAndUp ? '30%':'3%')"
                :width="getIframeWidth()"
                height="800"
                :src="props.item.link"
              />
              <v-row dense style="position: fixed; left: 0; bottom: 0; width: 100%;">
                <v-col cols="2" style="padding: 0">
                  <v-btn width="100%" color="secondary" tile>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-col>
                <v-col style="padding: 0">
                  <v-btn
                    style="width: 100%"
                    :href="props.item.link"
                    target="_blank"
                    tile
                    color="primary"
                    @click="() => overlay = false"
                  >
                    Open in new tab
                  </v-btn>
                </v-col>
              </v-row>
            </v-overlay>
          </v-lazy>
        </td>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Spell } from '~/assets/interfaces'

@Component
export default class IndexPage extends Vue {
  created () {
    this.getSpellsFromNull()
    this.groupBy = undefined
  }

  spells: Spell[] = []
  error = ''
  loading = true
  search = ''
  groupBy?: string = ''
  currentPage = 1
  pageCount = 0
  expanded: number[] = []
  overlay = false
  headers = [
    {
      text: 'Spell',
      value: 'name'
    },
    {
      text: 'School',
      value: 'school.school'
    },
    {
      text: 'Classes',
      value: 'classes',
      sortable: false
    },
    {
      text: 'Components',
      value: 'components',
      sortable: false
    }
  ]

  groupOptions = [
    { text: 'School', value: 'school.school' },
    { text: 'Source Book', value: 'sourceBook' },
    { text: 'Casting unit', value: 'castingTime.unit' },
    { text: 'Casting Target', value: 'effect.target' },
    { text: 'Casting Range', value: 'effect.range' },
    { text: 'Target Area', value: 'effect.area' }
  ]

  getClassesStr (classes: any): string {
    let str = ''
    for (const key in classes) {
      str += key + ' ' + classes[key] + ', '
    }
    return str.substring(0, str.length - 2)
  }

  getComponentsStr (item: Spell): string {
    let str = ''
    if (item.components.verbal) {
      str += 'V, '
    }
    if (item.components.somatic) {
      str += 'S, '
    }
    if (item.components.material) {
      str += item.components.material + ', '
    }
    if (item.components.divineFocus) {
      str = item.components.material ? str.substring(0, str.length - 2) + '/' : str
      str += 'DF, '
    }
    if (item.components.focus) {
      str += item.components.focus + ', '
    }
    return str.substring(0, str.length - 2)
  }

  expandRow (row: number): void {
    this.expanded = row === this.expanded[0] ? [] : [row]
  }

  getIframeWidth () {
    if (window.innerWidth <= 700) {
      return window.innerWidth
    }
    return 700
  }

  getSpellsFromNull () {
    this.loading = true
    this.error = ''

    fetch('/spells.json')
      .then((res) => {
        if (res.ok) {
          return res.json()
        } else {
          this.error = res.statusText
          return null
        }
      }).then((res) => { this.spells = res })
      .catch((err) => { this.error = err })
      .finally(() => { this.loading = false })
  }
}
</script>
