const TAG = 'aws-cli-help';
const SETTINGS_KEY = `${TAG}-settings`;

let getStoredOrEmpty = (key, cb) => {
  chrome.storage.local.get([key])
    .then((result) => {
      let raw = result[key];
      cb(raw ? JSON.parse(raw) : {});
    });
};

let setStored = (key, value, cb) => {
  let d = {};
  d[key] = JSON.stringify(value);
  chrome.storage.local.set(d)
    .then(cb);
};

let setActionState = (en) => {
  // console.debug(TAG, 'setActionState', en);
  chrome.action.setBadgeText({
    text: en ? '' : 'OFF',
  });
  chrome.action.setBadgeBackgroundColor({
    color: en ? '#FFF' : '#F80',
  });  
};

chrome.runtime.onInstalled.addListener(() => {
  // console.debug(TAG, 'onStartup');
  getStoredOrEmpty(SETTINGS_KEY, (data) => {
    // console.debug(TAG, 'onStartup', 'got settings', {...data});
    let en = data.hasOwnProperty('enabledGlobal') ? data.enabledGlobal : true;
    setActionState(en);
  });  
});

chrome.action.onClicked.addListener((tab) => {
  // console.debug(TAG, 'onClicked');
  getStoredOrEmpty(SETTINGS_KEY, (data) => {
    // console.debug(TAG, 'onClicked', 'got settings', {...data});
    let en = data.hasOwnProperty('enabledGlobal') ? data.enabledGlobal : true;
    en = !en;
    data.enabledGlobal = en;

    setStored(SETTINGS_KEY, data, () => {
      // console.debug(TAG, 'onClicked', 'stored new settings', {...data});
      setActionState(en);
    });
  });  
});