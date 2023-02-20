chrome.action.onClicked.addListener((tab) => {
    console.log("ping click");
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
    const selectedText = item.selectionText;
    console.log(selectedText);
      chrome.tabs.sendMessage(tab.id,{
          type: "NEW_DATA",
          content: selectedText,
      });


    
  });

