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
    <div class="floatleft task-time">{{ counterTime }}</div>
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

    computed: {
      counterTime: {
        get: function () {
          let hms = this._secondsToHms(this.task.time);

          for (let index in hms) {
            if (hms[index] < 10) {
              hms[index] = "0" + hms[index];
            }
          }

          return hms.h + ":" + hms.m + ":" + hms.s;
        }
      }
    },

    methods: {
      _secondsToHms(d) {
        return bpage.secondsToHms(d);
      }
    }
  };
</script>

<style scoped>
  .task-item {
    border-bottom: 1px solid #eee;
    padding: 10px 10px 13px;
  }

  .task-item.active {
    background: #fffec9;
  }

  .task-item .task-name {
    margin-left: 7px;
    width: 366px;
  }

  .task-item .btn {
    border-radius: 50%;
    color: #9c9c9c;
    font-size: 13px;
    height: 30px;
    margin-right: 0;
    margin-top: 8px;
    position: relative;
    transition: background 0.2s, color 0.3s linear;
    text-align: center;
    width: 30px;
  }

  .task-item .btn [class^="icon-"] {
    left: 5px;
    position: absolute;
    top: 7px;
  }

  .task-item .btn.start [class^="icon-"] {
    left: 6px;
  }

  .task-item .btn:hover {
    background: #f7f7f7;
  }

  .task-item .btn:active {
    background: #e4e4e4;
  }

  .task-item .task-time {
    height: 40px;
    line-height: 48px;
  }

  .task-item.active .start,
  .task-item:hover .start {
    color: #369c31;
  }

  .task-item.active .pause,
  .task-item:hover .pause {
    color: #ffa84f;
  }

  .task-item .remove {
    padding-right: 0;
  }

  .task-item.active .remove,
  .task-item:hover .remove {
    color: #e24444;
  }

  .task-item.active .reset,
  .task-item:hover .reset {
    color: #606060;
  }

</style>
