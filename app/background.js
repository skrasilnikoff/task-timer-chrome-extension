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
    } else {

      if (Storage.taskList !== undefined) {
        Storage.taskList.forEach(function (task) {
          if (task.timeStr === undefined) {
            task.timeStr = beautifyHms(secondsToHms(task.time))
          }

        })
      }

    }
  });
}

var Counter = {
  count: 0,
  timer: null,
  state: 0, // 0 or 1

  startCount: function (callback) {
    let self = this;

    updateBrowserAction('start');
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
    updateBrowserAction('pause');
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

let statusColors = {
  start: [76, 187, 23, 255],
  pause: [214, 119, 21, 1]
};

function updateBrowserAction(action) {
  action = action || 'start';
  let time = secondsToHms(Counter.count);
  chrome.browserAction.setBadgeBackgroundColor({color: statusColors[action]});
  if (action == 'pause') {
    chrome.browserAction.setBadgeText({text: '❚❚'});
  } else {
    chrome.browserAction.setBadgeText({text: time.h + ':' + ((time.m < 10) ? '0' + time.m : time.m)});
  }
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

function beautifyHms(hms) {
  for (let index in hms) {
    if (hms[index] < 10) {
      hms[index] = "0" + hms[index];
    }
  }
  return hms.h + ":" + hms.m + ":" + hms.s;
}

function hmsToSeconds(hms) {
  let hmsArr = hms.split(':');

  if (hmsArr.length === 3) {
    let h = Number(hmsArr[0] * 3600);
    let m = Number(hmsArr[1] * 60);
    let s = Number(hmsArr[2]);

    return h + m + s;
  }

  return -1;


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
