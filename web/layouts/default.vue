<template>
  <v-app>
    <v-main>
      <v-app-bar>
        <v-container>
          <v-app-bar-title> PFD20 Searcher </v-app-bar-title>
        </v-container>
      </v-app-bar>
      <v-container>
        <nuxt/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";

@Component
export default class DefaultLayout extends Vue{
}
</script>
