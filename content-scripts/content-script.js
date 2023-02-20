const setmyChatForms = (ParentElement) => {
    const form = document.createElement('form');
    form.id = 'mychat_form';
    form.innerHTML = `<input id="addTextTitleInput" type="text" name="title" placeholder="Title">
    <input id="addTextContentInput" type="text" name="text" placeholder="Text">
    <input type="submit" value="Save">`; 
    ParentElement.appendChild(form);
}

const setTabs = (ParentElement) =>{
    const container = document.createElement('div');
    container.id = "myChat_tabs_container";
    const btn1 = document.createElement('button');
    btn1.innerHTML = "Chat";
    btn1.className ="myChat_tablinks active";
    btn1.id = "mychat_btn1";
    container.appendChild(btn1);

    const btn2 = document.createElement('button');
    btn2.innerHTML = "Contenido";
    btn2.className ="myChat_tablinks";
    btn2.id = "mychat_btn2";
    container.appendChild(btn2);

    const btn3 = document.createElement('button');
    btn3.innerHTML = "Mi cuenta";
    btn3.className ="myChat_tablinks";
    btn3.id = "mychat_btn3";
    container.appendChild(btn3);

    ParentElement.appendChild(container);
};

const setTabsContent = (ParentElement) => {
    const container = document.createElement('div');
    container.id = "myChat_tab_one";
    container.className = "myChat_tabcontent";
    container.innerHTML = `<div id="myChat_conversation_container"></div>
    <form id="mychat_makeQuestion_form">
    <textarea id="mychat_question_textarea" placeholder="Escriba su pregunta"></textarea>
    <input type="submit" value="Preguntar" id="mychat_question_submit">
</form>`;
    ParentElement.appendChild(container);

};
const setTabsContent2 = (ParentElement) => {
    const container = document.createElement('div');
    container.id = "myChat_tab_two";
    container.className = "myChat_tabcontent";
    container.innerHTML = `<form id="mychat_addData_form">
    <textarea id="mychat_new_data_textarea" placeholder="Texto"></textarea>
    <input type="submit" id="mychat_addData_submit" value="Agregar">
</form>`;
    ParentElement.appendChild(container);

};
const setTabsContent3 = (ParentElement) => {
    const container = document.createElement('div');
    container.id = "myChat_tab_three";
    container.className = "myChat_tabcontent";
    container.innerHTML = `<form>
    <input type="text" placeholder="Ingrese su ID de cuenta">
    <input type="submit" value="Guardar">
    </form>`;
    ParentElement.appendChild(container);

};

const setCloseBtn = (ParentElement) => {
    //Boton de cerrar
    const closeRenderer = document.createElement('button');
    closeRenderer.id = 'myChat_close_sheet';
    closeRenderer.addEventListener("click", function () {
        document.getElementById('mychat_popup_div').style.display = "none";
    });
    closeRenderer.innerHTML = `<svg fill="#07288C" viewBox="0 0 24 24" width="24px" height="24px" class="post-icon"><path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"></path></svg>`;
    ParentElement.appendChild(closeRenderer);
};

let myChatPopupDiv = document.createElement('div');
myChatPopupDiv.id = 'mychat_popup_div';
document.body.appendChild(myChatPopupDiv);
setCloseBtn(myChatPopupDiv);
setTabs(myChatPopupDiv);
setTabsContent(myChatPopupDiv);
setTabsContent2(myChatPopupDiv);
setTabsContent3(myChatPopupDiv);


//WIP
const rejectScriptTextFilter = {
    acceptNode: function (node) {
        //console.log(node.wholeText);
        let match = /\r|\n/.exec(node.wholeText);
        //console.log(match.length);
        if (node.parentNode.nodeName !== 'SCRIPT' && match == null) {
            console.log(node.wholeText);
            return NodeFilter.FILTER_ACCEPT;
        } else {
            return NodeFilter.FILTER_REJECT
        }
    }
};

//WIP
function textNodesUnder(root) {
    var n, a = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, rejectScriptTextFilter
        , false);
    console.log(w);
    while (n = w.nextNode()) a.push(n);
    console.log(a);
    return a;
}

chrome.runtime.onMessage.addListener((obj, sender, response) => {
    const { type, content } = obj;
    if (type === "NEW_DATA") {
        myChatPopupDiv.style.display = "block";
        if(content){
            textNodesUnder(document.body);
            document.getElementById("mychat_new_data_textarea").value = content;
            document.getElementById("mychat_btn2").click();
        }
    } else {
        console.log(obj);
    }
});