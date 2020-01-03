<template>
  <div>
      <clearance :row='15' :column="15" :mine="20"></clearance>
  </div>
</template>

<script>
import clearance from "@/components/clearance.vue";
export default {
  components: {
    clearance,
  },
  data() {
    return {};
  }
};
</script>
