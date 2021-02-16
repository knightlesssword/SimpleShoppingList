const electron = require('electron');
const {
    ipcRenderer
} = electron;
const ul = document.querySelector('ul');

//catch item add
ipcRenderer.on('item:add', function(e, item) {
    ul.className = 'collection';
    const li = document.createElement('li');
    li.className = 'collection-item';
    const itemText = document.createTextNode(item);
    li.append(itemText);
    ul.appendChild(li);
});

//catch item clear
ipcRenderer.on('item:clear', function() {
    ul.innerHTML = '';
    ul.className = '';
});

//remove item
ul.addEventListener('dblclick', removeItem);

function removeItem(e) {
    e.target.remove();
    if (ul.children.length == 0) {
        ul.className = '';
    }
}