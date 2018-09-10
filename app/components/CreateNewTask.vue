<template>

  <div class="create-new-task">
    <div class="container">
      <input class="floatleft input-field type-text" v-model="taskName" @keyup.enter="addTask"
             placeholder="Enter a new task name..."/>
    </div>
  </div>

</template>

<script>
  export default {
    data() {
      return {
        taskName: ""
      };
    },

    methods: {
      addTask() {
        this.taskName = this.taskName.trim();
        if (this.taskName !== "") {
          this.$emit("new-task-name", this.taskName);
          this.taskName = "";
        }
      }
    }
  };
</script>

<style scoped>

  .create-new-task {
    border-bottom: 1px solid #eee;
    padding: 5px 10px 9px;
    background: #6878b1;
  }

  .create-new-task .input-field {
    width: 100%;
  }

  .create-new-task .input-field {
    color: #fff;
    font-family: 'Roboto', sans-serif;
  }

  .create-new-task .input-field::placeholder {
    color: #eee;
    font-family: 'Roboto', sans-serif;
  }

</style>
