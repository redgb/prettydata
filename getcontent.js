    function splitData() {
        //var tabledata = [["header 1", "header 2", "header 3"], ["row 1", "row 2", "row 3"]]
        var table = []
        var data = "Row ID,Order Priority,Discount,Unit Price";
        var table = data.split(","); //splits the string 'string' and stores it in result
        var i;
        for (i = 0; i < table.length; i++) {
            text += data[i] + "<br>";
        }
    }

        function getData(){
        var x = document.getElementById("fileToLoad");
        var txt = "";
        if ('files' in x) {
            if (x.files.length == 0) {
                txt = "Select one or more files.";
            } else {
                for (var i = 0; i < x.files.length; i++) {
                    txt += (i+1) + ". file";
                    var file = x.files[i];

                    const reader = new FileReader();

                    // This fires after the blob has been read/loaded.
                    reader.addEventListener('loadend', (e) => {

                      window.e = e;
                      window.reader= reader;
                      const text = e.srcElement.result;
                      console.log(text);
                    });

                    // Start reading the blob as text.
                    reader.readAsText(file);
                }
            }
        }
        else {
            if (x.value == "") {
                txt += "Select one or more files.";
            } else {
                txt += "The files property is not supported by your browser!";
                txt  += "<br>The path of the selected file: " + x.value; // If the browser does not support the files property, it will return the path of the selected file instead.
            }
        }
        document.getElementById("filecontents").innerHTML = "contents: " + e.target.result;
    }

        <input type="file" id="fileToLoad" multiple size="50" onchange="getData()">

        <body onload="getData()">