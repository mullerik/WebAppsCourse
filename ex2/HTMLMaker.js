const fs = require('fs');

exports.generate = function (htmlFilePath, paramsFilePath, destFilePath, callback) {
    var errLog = "";
    fs.readFile(htmlFilePath, 'utf-8', function (errorHTML, dataHTML) {

        // Log errors
        if (errorHTML)
            errLog += errorHTML + "\n";

        fs.readFile(paramsFilePath, 'utf-8', function (errorParams, dataParams) {
            // Log errors
            if (errorParams)
                errLog += errorParams + "\n";

            // Convert paramsFile to javascript dictionary
            jsonParams = JSON.parse(dataParams);

            //Replace <%% Values %%> with matching values from paramsFile
            // Any whitespace within the <%% %%> will be ignored
            var newHTML = dataHTML.replace(/<%%\s*(.*?)\s*%%>/g, function (match, p1) {
                // If there is a matching value in the json file, use it, otherwise keep the original value.
                return jsonParams[p1] ? jsonParams[p1] : match;
            });

            // Write new html file to destFilePath
            fs.writeFile(destFilePath, newHTML);

            // If there were no errors, errLog should be undefined
            if (errLog === "")
                errLog = undefined;

            // Invoke callback with error and the newHTML
            callback(errLog, newHTML);
        });
    });
};