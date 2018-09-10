var Storage = {};
var appStatus = 0;

if (!appStatus) {
  getDataFromStorage('storage', function (result) {
    Storage = result.storage;

    if (Storage === undefined) {
      Storage = {
        taskList: [],
        lastTaskId: 1,
        currentTask: {id: 0},
        timer: null
      };
    }
  });
}

var Counter = {
  count: 0,
  timer: null,
  state: 0, // 0 or 1

  startCount: function (callback) {
    let self = this;

    updateBrowserAction();
    saveStorage();

    self.state = 1;
    self.timer = setTimeout(function () {

      self.count++;

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

  resetCount: function () {
    let self = this;
    self.count = 0;
    self.pauseCount();
  },

  clearTimeout: function () {
    clearTimeout(this.timer);
  },

  getCount: function () {
    return this.count;
  },

  setCount: function (count) {
    this.count = count;
  }
};

let greenColor = [76, 187, 23, 255];

function updateBrowserAction() {
  let time = secondsToHms(Counter.count);
  chrome.browserAction.setBadgeBackgroundColor({color: greenColor});
  chrome.browserAction.setBadgeText({text: time.h + ':' + time.m});
}

function saveStorage() {
  saveDataToStorage({storage: Storage});
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

function saveDataToStorage(data, callback) {
  /* data = {key: value} */
  chrome.storage.local.set(data, function () {
    if (typeof callback === "function") {
      callback();
    }
  });
}

function getDataFromStorage(key, callback) {
  chrome.storage.local.get([key], function (result) {
    if (typeof callback === "function") {
      callback(result);
    }
  });
}


//#####################################

function recLog() {
  setTimeout(function () {
    recLog();
  }, 2000)
}

// recLog();
