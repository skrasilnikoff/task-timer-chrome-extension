<template>
  <div class="task-item container">
    <div class="field-group-inline">
      <input class="task-name floatleft" type="text" v-model="task.name"/>
    </div>

    <div class="time-fields field-group-inline">
      <span>{{ counterTime }}</span>
    </div>

    <button class="field-group-inline" type="button" @click="$emit('start-task', task)">Start</button>
    <button class="field-group-inline" type="button" @click="$emit('pause-task', task)">Pause</button>
    <button class="field-group-inline" type="button" @click="$emit('remove-task', task)">Delete</button>
  </div>
</template>

<script>

  let bpage = chrome.extension.getBackgroundPage();

  export default {
    props: [
      'task',
    ],

    data() {
      return {
        'state': 'pause' // run, pause
      }
    },

    computed: {
      counterTime: {
        get: function () {
          let hms = this._secondsToHms(this.task.time);

          for (let index in hms) {
            if (hms[index] < 10) {
              hms[index] = '0' + hms[index];
            }
          }

          return hms.h + ':' + hms.m + ':' + hms.s;
        }
      }
    },

    methods: {

      _secondsToHms(d) {
        return bpage.secondsToHms(d);
      },

    }
  }
</script>

<style scoped>
  .task-item {
    margin-bottom: 10px;
    width: 100%;
  }

  .task-item input.task-name {
    width: 200px;
  }

  .time-fields {
    width: 56px;
    line-height: 35px;
  }
</style>
