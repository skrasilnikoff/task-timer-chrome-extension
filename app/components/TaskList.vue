<template>
  <div class="task-list">
    <div class="list">
      <task-item v-for="task in taskList"
                 :task="task"
                 :key="task.id"
                 @start-task="onStartTask"
                 @pause-task="onPauseTask"
                 @remove-task="onRemoveTask"
      />
    </div>
    <hr>
    <br/>
    <div class="container">
      <create-new-task @new-task-name="onAddTask"/>
    </div>
  </div>
</template>

<script>
  import TaskItem from './TaskItem.vue';
  import CreateNewTask from './CreateNewTask.vue';
  import _clone from 'lodash/clone';

  let bpage = chrome.extension.getBackgroundPage();
  let Storage = bpage.Storage;

  let nextTaskId = 1;
  let Counter = null;


  export default {
    components: {
      TaskItem, CreateNewTask
    },

    data() {
      return {
        taskList: [],
        currentTask: {id: 0}
      }
    },

    created: function () {
      Counter = bpage.Counter;
      this.taskList = Storage.taskList;
      this.currentTask = Storage.currentTask;
      nextTaskId = Storage.nextTaskId;
    },

    methods: {
      onAddTask(taskName) {
        let self = this;

        self.taskList.push(
          {
            id: nextTaskId++,
            name: taskName,
            time: 0
          }
        );
        self._saveTaskList();
      },

      onStartTask(task) {
        var self = this;

        // state = 0
        if (!Counter.state) {

          self._startCount(task);

        } else {

          if (self.currentTask.id !== task.id) {

            Counter.pauseCount();
            self.currentTask.time = _clone(Counter.getCount());
            self._saveTaskList();
            Counter.resetCount();

            self._startCount(task);

          }
        }
      },

      _startCount(task) {
        let self = this;

        Counter.setCount(_clone(task.time));

        self.currentTask = task;
        self._saveTaskList();

        Counter.startCount(function () {
          task.time = _clone(Counter.getCount());
          self._saveTaskList();
        });
      },

      onPauseTask(task) {
        let self = this;

        console.log('Counter.state', Counter.state);
        console.log('self.currentTask.id', self.currentTask.id);

        if (Counter.state && self.currentTask.id === task.id) {
          Counter.pauseCount();
          self.currentTask.time = _clone(Counter.getCount());
          self._saveTaskList();
          Counter.resetCount();
        }

      },

      onRemoveTask(task) {
        let self = this;

        if (task.id === self.currentTask.id) {
          Counter.pauseCount();
          Counter.resetCount();
          self.currentTask.id = 0;
        }

        for (let i = 0; i < self.taskList.length; i++) {
          let _id = self.taskList[i].id;
          if (_id === task.id) {
            if (confirm('Are you sure?')) {
              let removedTask = self.taskList.splice(i, 1);
              console.log('removedTask', removedTask);
            }

            break;
          }
        }

        self._saveTaskList();

      },

      _saveTaskList: function () {
        Storage.taskList = this.taskList;
        Storage.currentTask = this.currentTask;
        Storage.nextTaskId = nextTaskId;
      },

    }
  };
</script>

<style scoped>
  .task-list {
    margin-bottom: 10px;
    width: 100%;
  }
</style>
