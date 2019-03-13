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


<style lang="scss">

  .create-new-task {
    padding: 5px 10px 9px;
    background: #dc4c35;

    .input-field {
      border-bottom: 1px solid #ffc3c3;
      color: #fff;
      font-family: 'Roboto', sans-serif;
      width: 100%;

      &::placeholder {
        color: #fff;
        font-family: 'Roboto', sans-serif;
      }
    }
  }

</style>
