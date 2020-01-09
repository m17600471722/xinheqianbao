<template>
  <div>
    <div class="head">
      <div class="head_left" @click="goback">
        <img src="../../assets/head/goback.png" />
      </div>
      <div class="head_center">{{title}}</div>
      <div class="head_right"></div>
    </div>
    <div class="head_lucency"></div>
  </div>
</template>

<script>
import { linkSync } from "fs";
//import { mapState, mapActions } from 'vuex'
export default {
  name: "me",
  props: ["title", "isBack", "isUser", "type"],
  data() {
    return {};
  },
  methods: {
    goback: function() {
      if (this.isBack == "") {
        this.$router.goBack();
      } else if (this.isUser == "") {
        this.$router.push({ name: "Login" });
      } else if (this.type == "Mine") {
        this.$router.push({ name: "Mine" });
      } else if (this.type == "datacenter") {
        this.$router.push({ name: "Mine" });
      } else {
        this.$router.push({ name: "home" });
      }
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.head {
  padding: 0 10px;
  display: flex;
  justify-content: space-between;
  height: 1rem;
  align-items: center;
  font-size: 0.4rem;
  position: fixed;
  width: 100%;
  background: #fff;
  z-index: 999;
}
.head_lucency {
  height: 1rem;
  padding: 0 10px;
}
.head_left,
.head_right {
  width: 0.6rem;
}
.head_center {
}
img {
  width: 0.6rem;
}
</style>
