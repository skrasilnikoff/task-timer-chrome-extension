<template>
  <div class="create-new-task">
    <div class="container">
      <input class="field-group-inline" type="text" v-model="taskName" @keyup.enter="addTask" placeholder="Task name"/>
      <button class="floatleft" type="button" @click="addTask">Add</button>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        taskName: ''
      }
    },

    methods: {
      addTask() {
        this.taskName = this.taskName.trim();
        if (this.taskName !== '') {
          this.$emit('new-task-name', this.taskName);
          this.taskName = '';
        }
      }
    }
  }
</script>
