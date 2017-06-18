var allFuncs = [fun0, fun1, fun2, fun3, fun4, fun5];
function runFuncs() {
    // fun0 should be written as image to html file
    document.write("<img src=" + fun0().photoURL + "><hr>");
    // Other funcs should write their result
    // Used JSON.stringify to showing real values
    for(var i=1; i<=5; i++)
        document.write(JSON.stringify(allFuncs[i]()) + "<hr>");
}
runFuncs();


