<template>
  <v-row>
    <v-col cols="12"
      ><v-alert :value="imageSearchInProgress" type="warning"
        >Search through image is in progress</v-alert
      ></v-col
    >

    <v-col cols="5">
      <v-form>
        <v-row><h2>Person's Details</h2></v-row>
        <v-row>
          <v-text-field v-model="personName" label="Person Name"></v-text-field>
        </v-row>
        <!-- <v-row>
          <v-text-field v-model="placeName" label="Place Name"></v-text-field>
        </v-row> -->
        <v-row>
          <v-btn @click="search">Search</v-btn>
        </v-row>
      </v-form>
    </v-col>
    <v-col cols="2"></v-col>
    <v-col cols="5">
      <h2>Person's Image</h2>
      <v-row>
        <v-image-input
          v-model="imageData"
          :image-quality="0.85"
          clearable
          image-format="jpeg"
        />
      </v-row>
      <v-row>
        <v-btn @click="searchImage">Search</v-btn>
      </v-row>
    </v-col>
    <bar-chart v-if="searchCompleted" :sentiment="sentiment"></bar-chart>
    <v-col v-if="searchCompleted">
      <v-card>
        <v-card-title>Collected Information</v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              ><div v-for="item in userDetails" :key="item._id">
                <p>{{ item.key }}: {{ item.value }}</p>
              </div></v-col
            >
            <v-col>
              <v-img width="300" :src="userImage"></v-img>
            </v-col>
          </v-row>
          <h1 style="margin-bottom: 20px">Friends</h1>
          <v-row>
            <span :key="friend" v-for="friend in friends">
              <a target="_blank" :href="'http://facebook.com/' + friend">
                <v-img
                  width="150"
                  :src="
                    'https:\/\/policehackathon.s3.amazonaws.com\/' +
                      friend +
                      '.jpg'
                  "
                ></v-img>
              </a>
            </span>
          </v-row>
          <v-row>
            <v-btn color="success" @click="clearImageSearch"> Done </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import barChart from "../components/barChart";
import axios from "../axios";
import image from "../image";
export default {
  name: "home",
  data: () => ({
    personName: "",
    placeName: "",
    friendName: "",
    imageData: "",
    userDetails: [],
    userImage: "",
    friends: [],
    searchCompleted: false,
    imageSearchInProgress: false,
    sentiment: {
      labels: [],
      data: [],
      label: ""
    }
  }),
  methods: {
    search: async function() {
      const { data } = await axios.get("/profile/search", {
        params: { name: this.personName }
      });
      this.searchCompleted = false;
      if (data) {
        this.userDetails = data.otherDetails;
        this.userImage =
          "https://policehackathon.s3.amazonaws.com/" + data.profileUrl;
        this.friends = data.friendsList;
        if (data.sentimentObject) {
          this.sentiment.labels = Object.keys(data.sentimentObject);
          this.sentiment.data = Object.values(data.sentimentObject);
          this.sentiment.label = "Sentiment towards " + data.fullName;
        }
      }

      this.searchCompleted = true;
    },

    searchImage: function() {
      // console.log(this.imageData);
      image.uploadImage(this.imageData);
      this.imageSearchInProgress = true;
    },

    checkImageStatus: async function() {
      const { data } = await axios.get("/profile/status");
      if (!data) {
        return;
      }
      if (data.status == "PROCCESSED") {
        this.imageSearchInProgress = false;

        this.userDetails = data.user.otherDetails;
        this.userImage =
          "https://policehackathon.s3.amazonaws.com/" + data.user.profileUrl;
        this.friends = data.user.friendsList;
        if (data.user.sentimentObject) {
          this.sentiment.labels = Object.keys(data.user.sentimentObject);
          this.sentiment.data = Object.values(data.user.sentimentObject);
          this.sentiment.label = "Sentiment towards " + data.user.fullName;
        }

        this.searchCompleted = true;
      } else {
        this.imageSearchInProgress = true;
      }
    },

    clearImageSearch: async function() {
      await axios.delete("/profile");
      this.$router.go();
    }
  },
  components: {
    barChart
  },
  mounted() {
    this.checkImageStatus();
  }
};
</script>
