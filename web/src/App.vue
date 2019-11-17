<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="@/assets/logo.png"
          transition="scale-transition"
          width="40"
        />

        <h1>OSINT</h1>
      </div>
      <v-btn style="margin-left:30px" to="/datacollector">
        <span class="mr-2">Data Collector</span>
      </v-btn>
      <v-btn style="margin-left:20px" to="/">
        <span class="mr-2">Search</span>
      </v-btn>

      <v-spacer></v-spacer>

      <!-- <v-btn to="/analysis" >
        <span class="mr-2">Analysis</span>
      </v-btn> -->
    </v-app-bar>
    <v-content>
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    //
  })
};
</script>
