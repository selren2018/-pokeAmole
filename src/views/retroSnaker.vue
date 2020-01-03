<template>
  <div>
      <snaker :row='30' :column="30" :animationTime="200" :showBorder="true"></snaker>
  </div>
</template>

<script>
import snaker from "@/components/snaker.vue";
export default {
  name: "retroSnaker",
  components: {
    snaker,
  },
  data() {
    return {};
  }
};
</script>
