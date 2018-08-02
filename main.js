//
//
//  GENERAL FUNCTIONS
//
//

//reads the data from the csv file, hides the necessary elements and starts table generation
function readData(event) {
    var fileList = event.target.files; //creates a list with all the loaded files - in this case there is only one file
    var reader = new FileReader(); //object to read contents of a file

    reader.onload = function(loadedEvent) { //runs when the file is read
        var filetext = loadedEvent.target.result; //set variable filetext to the contents of the file

        //update the visible indications of the currently opened file
        document.getElementById("currentfile").innerHTML = fileList[0].name;
        document.getElementById("currentfilename").innerHTML = fileList[0].name + " opened";

        //remove the "load file" text from the webpage when a file is loaded
        hideElement("loadtexttable");
        hideElement("loadtextbar");
        hideElement("loadtextline");
        hideElement("loadtextpanel");
        hideElement("loadtextheat");

        //create a table with the data inside it
        createTable(filetext);
    };
    reader.readAsText(fileList[0]); //read the file
}

//hides a given element on the page using its id
function hideElement(id) {
    var elem = document.getElementById(id);
    elem.style.display = "none";
}

//
//
//  TABLE GENERATION FUNCTIONS
//
//


//VARIABLES

var columnDefs = [];                            //the headers for the table
var rowData = [];                               //the rows for the table
var usedcolumns = [];                           //used to track the headers for the table

var gridOptions = {
    columnDefs: columnDefs,                     //use the variable "columnsDefs" to create the columns
    rowData: rowData,                           //use the variable "rowData" to create the rows
    enableSorting: true,                        //allow the user to sort data
    enableFilter: true,                         //allow the user to filter data
    rowSelection: 'multiple',                   //the user can select multiple rows
    pagination: true,                           //the user can use pages in the table
    paginationPageSize: 250,                    //the amount of rows on one page is 250
    enableColResize: true,                      //allow for the columns to be resized
};

//FUNCTIONS

//creates the header of the table in the appropriate format and saves it to the columnDefs variable
function createHeader(data) {
    var rows = data.split("\n");
    var cell;
    var header = rows[0].split(",");
    for (cell = 0; cell < header.length; cell++) {
        var headerdict = {};
        headerdict["headerName"] = header[cell];
        headerdict["field"] = header[cell].toString().replace(/\s/g,'').toLocaleLowerCase();
        usedcolumns.push(headerdict["field"]);
        headerdict["checkboxSelection"] = cell === 0;
        columnDefs.push(headerdict);
    }
}

//creates every row in the table in the appropriate format and saves it to the rowData variable
function createRows(data) {
    var rows = data.split("\n");
    var x;
    for (x = 1; x < rows.length; x++) {
        var currentrow = rows[x];
        currentrow = currentrow.split(",");
        var cell = _.zipObject(usedcolumns, currentrow); //https://lodash.com/docs/4.17.10#zipObject
        rowData.push(cell);
    }
}

//runs all table related functions and then creates the table on the page
function createTable(data) {
    createHeader(data);
    createRows(data);
    var eGridDiv = document.querySelector('#tablefinal'); //locates the tables container in the page
    new agGrid.Grid(eGridDiv, gridOptions); //loads the table into #tablefinal
}