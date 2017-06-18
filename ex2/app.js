var htmlMaker = require('./HTMLMaker.js');

// Simple function for printing the two args given to it
consoleLogCallback = function(error, htmlContent){
    console.log("Errors: \n" + error);
    console.log("HTML content: \n" + htmlContent);
};

htmlMaker.generate("./example.html", "./params.txt", "./newExample.html", consoleLogCallback);