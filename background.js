chrome.action.onClicked.addListener((tab) => {
//show myChay-popup created in content-script.js
    chrome.tabs.sendMessage(tab.id,{
        type: "NEW_DATA",
        content: "",
    });
});

  chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: 'tld',
        title: 'Agregar a myChat',
        type: 'normal',
        contexts: ['selection']
      });
  });

  chrome.contextMenus.onClicked.addListener((item,tab) => {
    //send selectionText to addData Form
    const selectedText = item.selectionText;
    console.log(selectedText);
      chrome.tabs.sendMessage(tab.id,{
          type: "NEW_DATA",
          content: selectedText,
      });


    
  });

