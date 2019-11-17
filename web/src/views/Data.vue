<template>
  <v-container>
    <sweet-modal ref="modal" icon="success" v-on:close="modalClosed">
      Data collection is job is submitted successfully!
    </sweet-modal>
    <v-alert type="success" :value="!isCompleted">The data collection job is in progress!</v-alert>
    <v-row>
      <v-col cols="5">
        <v-card pa="5">
          <v-card-title>
            Data collection by user ids
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="facebook"
                label="Facebook username"
              ></v-text-field>
              <v-text-field
                v-model="twitter"
                label="Twitter username"
              ></v-text-field>
              <v-text-field
                v-model="instagram"
                label="Instagram username"
              ></v-text-field>
            </v-form>
            <v-card-actions>
              <v-row justify="center">
                <v-btn color="success" outlined @click="collectData">
                  Submit Data Collection Request</v-btn
                >
              </v-row>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="2"></v-col>
      <v-col cols="5">
        <v-card pa="5">
          <v-card-title>
            Data Collection by Image and Name
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="name"
                label="Enter Full Name"
              ></v-text-field>

              <v-image-input
                v-model="imageData"
                :image-quality="0.85"
                clearable
                image-format="jpeg"
              />
            </v-form>
            <v-card-actions>
              <v-row justify="center">
                <v-btn color="success" outlined @click="collectData">
                  Submit Data Collection Request</v-btn
                >
              </v-row>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    facebook: "",
    twitter: "",
    instagram: "",
    name: "",
    imageData: "",
    isCompleted: true
  }),

  methods: {
    collectData: function() {
      console.log(this.facebook);
      this.$refs.modal.open();
    },
    modalClosed(){
      this.isCompleted = false;
    }
  },

  mounted(){
    
  }
};
</script>

<style></style>
