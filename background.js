chrome.action.onClicked.addListener((tab) => {
//show myChay-popup created in content-script.js
    chrome.tabs.sendMessage(tab.id,{
        type: "NEW_DATA",
        content: "",
    });
});

  chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: 'addmyChat',
        title: 'Agregar contenido',
        type: 'normal',
        contexts: ['selection']
      });
      chrome.contextMenus.create({
        id: 'QAmyChat',
        title: 'Responder pregunta',
        type: 'normal',
        contexts: ['selection']
      });
  });

  chrome.contextMenus.onClicked.addListener((item,tab) => {
    //send selectionText to addData Form or makeQuestion Form
    const option_id = item.menuItemId;
    const selectedText = item.selectionText;
    console.log(option_id);
    if (option_id == 'addmyChat') {
      chrome.tabs.sendMessage(tab.id,{
        type: "NEW_DATA",
        content: selectedText,
    });
    } else if(option_id == 'QAmyChat') {
      chrome.tabs.sendMessage(tab.id,{
        type: "ANSWER_QUESTION",
        content: selectedText,
    }); 
    }



    
  });

