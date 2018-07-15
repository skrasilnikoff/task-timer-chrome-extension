console.log('background');

var Storage = {
  taskList: [],
  nextTaskId: 1,
  currentTask: {id: 0},
  timer: null
};



var Counter = {
  count: 0,
  timer: null,
  state: 1, // 0 or 1

  startCount: function (callback) {
    let self = this;

    updateBrowserAction();

    self.state = 1;
    self.timer = setTimeout(function () {
      self.count++;

      console.log('count', self.count);

      if (callback) {
        callback();
      }

      self.startCount(callback);
    }, 1000);
  },

  pauseCount: function () {
    let self = this;
    self.state = 0;
    self.clearTimeout();
    updateBrowserAction();
  },

  clearTimeout: function () {
    clearTimeout(this.timer);
  },

  getCount: function () {
    return this.count;
  },

  resetCount: function () {
    this.count = 0;
  },

  setCount: function (count) {
    this.count = count;
  }
};

let greenColor = [76, 187, 23, 255];

function updateBrowserAction() {
  let time = secondsToHms(Counter.count);
  chrome.browserAction.setBadgeBackgroundColor({color:greenColor});
  chrome.browserAction.setBadgeText({text: time.h + ':' + time.m});
}

function secondsToHms(d) {
  d = Number(d);
  let h = Math.floor(d / 3600);
  let m = Math.floor(d % 3600 / 60);
  let s = Math.floor(d % 3600 % 60);

  let hDisplay = h > 0 ? h : "0";
  let mDisplay = m > 0 ? m : "0";
  let sDisplay = s > 0 ? s : "0";

  return {'h': hDisplay, 'm': mDisplay, 's': sDisplay};
}




//#####################################

function recLog() {
  setTimeout(function () {
    console.log('Storage', Storage);
    recLog();
  }, 2000)
}

// recLog();
