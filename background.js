// background.js

chrome.commands.onCommand.addListener(function(commandName) {
  console.log('onCommand event received for message: ', commandName);
  //alert("command is " + command);

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    var commands = [
      { 'alarmName': "close_in_5_minutes", 'closeInMinutes': 5},
      { 'alarmName': "close_in_10_minutes", 'closeInMinutes': 10},
      { 'alarmName': "close_in_15_minutes", 'closeInMinutes': 15},
      { 'alarmName': "close_in_30_minutes", 'closeInMinutes': 30}
    ];

    var result = commands.filter(function(cmd){
      return cmd.alarmName ===commandName;
    });
    if(!result || result.length != 1) {
      console.log("invalid commandName " + commandName);
      return ;
    }

    var command = result[0];
    
    var alarmName = command.alarmName + Date.now()
    chrome.alarms.create(alarmName, {delayInMinutes: command.closeInMinutes});
    activeTab.title = command.closeInMinutes + "m" + activeTab.title

    // set in storage alarm name, tab id
    var items = {};
    items[alarmName ] = activeTab.id;

    alert("created alarm " + alarmName  + " will close the tab " + activeTab.id);
    chrome.storage.sync.set(items, function() {
        console.log(command.alarmName + 'alarm tab id is set to ' + activeTab.id);
    });
     
  });

});

chrome.alarms.onAlarm.addListener(function(alarm){
  //alert('great');
  //alert('closing the tab');

  // get alarm name
  // get tab id from alarm name from storage
  // check if tab id exist 
    // if exist
    // delete that tab

  console.log("Received onAlarm handler  alarm : " + alarm);
  var alarmName = alarm.name;
  var tabId = null;
  chrome.storage.sync.get([alarmName], function(result) {
    console.log('Value currently is ' + result[alarmName]);
    if( alarmName in result){
      tabId = result[alarmName];
      console.log("remove tab id : " + tabId);
      chrome.tabs.remove(tabId, function() {
        console.log('closed the current tab');
      });
    }
  });
  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   var activeTab = tabs[0];
  //   chrome.tabs.remove(activeTab.id, function() {
  //      console.log('closed the current tab');
  //     });
  //  // chrome.tabs.sendMessage(activeTab.id, {"message": "close_current_tab"});
  // });
});
