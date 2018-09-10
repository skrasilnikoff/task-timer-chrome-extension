<template>
  <div id="app">
    <task-list/>
  </div>
</template>

<script>
  import TaskList from './components/TaskList.vue';

  export default {
    data() {
      return {}
    },

    components: {TaskList},
  };
</script>

<style scoped>
  #app {
    padding: 0;
    width: 622px;
  }
</style>
