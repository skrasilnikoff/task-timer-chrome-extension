<template>
  <div class="task-list">

    <create-new-task @new-task-name="onAddTask"/>

    <br/>

    <div class="list">
      <div class="container">
        <ul>
          <task-item v-for="task in taskList"
                     v-bind:class="{ active : task.id == currentTask.id }"
                     :task="task"
                     :key="task.id"
                     @start-task="onStartTask"
                     @pause-task="onPauseTask"
                     @remove-task="onRemoveTask"
                     @reset-task="onResetTask"
          />
        </ul>
      </div>
    </div>

  </div>
</template>

<script>
  import TaskItem from "./TaskItem.vue";
  import CreateNewTask from "./CreateNewTask.vue";
  import _clone from "lodash/clone";

  let bpage = chrome.extension.getBackgroundPage();
  let Storage = bpage.Storage;

  let lastTaskId = 1;
  let Counter = null;

  export default {
    components: {
      TaskItem,
      CreateNewTask
    },

    data() {
      return {
        taskList: [],
        currentTask: {id: 0}
      };
    },

    created: function () {
      Counter = bpage.Counter;
      this.taskList = Storage.taskList;
      this.currentTask = Storage.currentTask;
      lastTaskId = (Storage.lastTaskId) ? Storage.lastTaskId : 1;
    },

    methods: {
      onAddTask(taskName) {
        let self = this;

        self.taskList.push({
          id: ++lastTaskId,
          name: taskName,
          time: 0,
          timeStr: "00:00:00"
        });
        self._saveTaskList();
      },

      onStartTask(task) {
        var self = this;

        // state == 0
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
          task.timeStr = bpage.beautifyHms(bpage.secondsToHms(task.time));
          self._saveTaskList();
        });
      },

      onPauseTask(task) {
        let self = this;

        if (Counter.state && self.currentTask.id === task.id) {
          Counter.pauseCount();
          self.currentTask = {};//.time = _clone(Counter.getCount());
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
            if (confirm("Are you sure?")) {
              let removedTask = self.taskList.splice(i, 1);
            }

            break;
          }
        }

        self._saveTaskList();
      },

      onResetTask(task) {
        task.time = 0;
        task.timeStr = "00:00:00";
        Counter.resetCount();
        this._saveTaskList();
      },

      _saveTaskList: function () {
        Storage.taskList = this.taskList;
        Storage.currentTask = this.currentTask;
        Storage.lastTaskId = lastTaskId;

        bpage.saveStorage();
      }
    },

    computed: {
      counterState: {
        get: function () {
          return (Counter.state) ? 'start' : 'pause';
        }
      }
    },
  };
</script>

<style scoped>
  .task-list {
    margin-bottom: 10px;
    width: 100%;
  }
</style>
