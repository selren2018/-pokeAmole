<template>
  <div>
      <mole :row='3' :column="4" :animationTime="2000"></mole>
  </div>
</template>

<script>
import mole from "@/components/mole.vue";
export default {
  name: "pokeAmole",
  components: {
    mole,
  },
  data() {
    return {};
  }
};
</script>
