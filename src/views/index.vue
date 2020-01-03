<template>
  <div>
    <ul style="width:80px">
      <li @click="jumpPokeAmole" style="cursor:pointer">打地鼠</li>
      <li @click="jumpRetroSnaker" style="cursor:pointer">贪吃蛇</li>
      <li @click="jumpMineClearance" style="cursor:pointer">扫雷</li>
    </ul>
  </div>
</template>

<script>
import mole from "@/components/mole.vue";
export default {
  name: "pokeAmole",
  components: {
    mole
  },
  data() {
    return {};
  },
  methods: {
    jumpPokeAmole() {
      this.$router.push("pokeAmole");
    },
    jumpRetroSnaker() {
      this.$router.push("retroSnaker");
    },
    jumpMineClearance(){
      this.$router.push("mineClearance");
    }
  }
};
</script>
