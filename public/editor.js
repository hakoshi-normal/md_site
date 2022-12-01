import marked from 'marked';
function inputChange(val) {
    console.log(marked(val));
    document.getElementById('test').innerHTML = marked(val);
}