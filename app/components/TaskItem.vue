<template>
  <div class="container task-item">
    <div class="floatleft buttons-group">
      <button type="button" class="btn start floatleft" @click="$emit('start-task', task)">
        <i class="icon-play-1"></i>
      </button>
      <button type="button" class="btn pause floatleft" @click="$emit('pause-task', task)">
        <i class="icon-pause-1"></i>
      </button>
      <button type="button" class="btn reset floatleft" @click="$emit('reset-task', task)">
        <i class="icon-ccw"></i>
      </button>
    </div>
    <input class="floatleft input-field task-name type-text" v-model="task.name" placeholder="Task name"/>
    <div class="floatleft task-time">
      <input type="text"
             v-model.trim="task.timeStr"
             v-on:keypress="timeStrInputFilter(event)"
             @change="changeTaskTimeStr(task)">
    </div>

    <button type="button" class="btn remove floatright" @click="$emit('remove-task', task)">
      <i class="icon-cancel-1"></i>
    </button>
  </div>
</template>

<script>
  let bpage = chrome.extension.getBackgroundPage();

  export default {
    props: ["task", "key", "counterState"],

    data() {
      return {
        state: "pause" // run, pause
      };
    },
    methods: {
      changeTaskTimeStr(task) {
        if (task.timeStr !== undefined) {
          let seconds = bpage.hmsToSeconds(task.timeStr);
          if (seconds !== -1) {
            task.time = seconds;
          }
        }
      },
      timeStrInputFilter(event) {
        event = (event) ? event : window.event;
        var charCode = (event.which) ? event.which : event.keyCode;
        if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46 && event.key !== ":") {
          event.preventDefault();
        } else {
          return true;
        }

      }
    }
  };
</script>

<style lang="scss">
  .task-item {
    padding: 3px 10px;

    &.active {
      background: #fffec9;
    }

    .task-name {
      margin-left: 7px;
      width: 366px;
    }

    .btn {
      border-radius: 50%;
      color: #9c9c9c;
      font-size: 13px;
      height: 30px;
      margin-right: 0;
      padding: 0;
      position: relative;
      transition: background 0.2s, color 0.3s linear;
      text-align: center;
      width: 30px;

      &:hover {
        background: #f7f7f7;
      }

      &:active {
        background: #e4e4e4;
      }

      &.start [class^="icon-"] {
        left: 6px;
      }

      [class^="icon-"] {
        left: 5px;
        position: absolute;
        top: 7px;
      }
    }

    .task-time {
      height: 30px;
      line-height: 30px;

      input {
        background: none;
        border: none;
        height: 30px;
        width: 88px;
      }
    }

    &.active, &:hover {

      .start {
        color: #369c31;
      }

      .pause {
        color: #ffa84f;
      }

      .remove {
        color: #e24444;
      }

      .reset {
        color: #606060;
      }

    }

    .remove {
      padding-right: 0;
    }

  }
</style>
