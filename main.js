//
//
//      GENERAL FUNCTIONS
//
//

//
//      VARIABLES
//

//remembers if the user can
//store their recent files
var hasStorage = true;

//
//      FUNCTIONS
//

//runs immediately after the
//page is loaded
//
//checks for the web storage
//support and disables recent
//file sharing if not supported
function start() {
    //checks if there is a possible
    //storage space in the browser
    if (typeof(Storage) !== "undefined") {
        hasStorage = true;
    } else {
        //otherwise, hide the recent
        //files tab and alert the user
        document.getElementById("recentfiles").style.visibility = "none";
        alert("this browser doesn't support html5 web storage, so some features have been disabled");
        hasStorage = false;
    }

    //disables the close file button
    //button and the graph tabs so that
    //the user can only upload a file
    document.getElementById("fileclose").disabled = true;
}

//runs when the upload button is clicked
//and a file is uploaded.
function setupData(event) {
    //creates a list with all the
    //loaded files - in this case
    //there is only one file
    var fileList = event.target.files;

    //object to read contents of a file
    var reader = new FileReader();

    //runs once the file has been
    //read by the reader
    reader.onload = function(loadedEvent) {
        //update the visible indications
        //of the currently opened file
        document.getElementById("currentfilename").innerHTML = fileList[0].name + " opened";
        document.getElementById("pills-table-tab").innerHTML = "table: <b>"  + fileList[0].name +"</b>";

        //remove the "load file" text
        //from the web page when a file
        //is loaded, disable the upload
        //button, enable tab buttons,
        //allow for the file to be closed
        document.getElementById("loadtexttable").style.display = "none";            //"upload a file" text
        document.getElementById("inputGroupFile02").disabled = true;                //the input button
        document.getElementById("fileclose").disabled = false;                      //the close file button
        document.getElementById("fileopen").disabled = true;                        //the open file button

        var csvtext = loadedEvent.target.result;

        //save the file name and data to the recent file history
        if (hasStorage === true) {
            saveFileToHistory(fileList[0].name, loadedEvent.target.result);
        }

        //creates:
        // - the table
        // - the bar chart
        // - the line chart
        // - the scatter chart
        // - the heat map
        createTable(csvtext);
        createBarChart(csvtext, fileList[0].name);
        createLineChart(loadedEvent.target.result, fileList[0].name);
        //createScatterChart(loadedEvent.target.result, fileList[0].name);
        createHeatMap(loadedEvent.target.result, fileList[0].name);
    };
    //reads the uploaded file
    //as text and stores it
    reader.readAsText(fileList[0]);
}

function saveFileToHistory(name, content) {
    localStorage.lastusedfile = [name, content];
}

//
//
//      TABLE GENERATION FUNCTIONS
//
//

//
//      VARIABLES
//

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
    enableColResize: true                       //allow for the columns to be resized
};


//
//      FUNCTIONS
//

// //runs when the close file
// //button is pressed
// function closeTable() {
//     //(ideally) destroys the table
//     gridOptions.api.destroy();
//
//     columnDefs = [];
//     rowData = [];
//
//     //reset the page's elements
//     //to their beginning state
//     //so the user can upload
//     //a file again
//     document.getElementById("inputGroupFile02").disabled = false;                   //the file upload button
//     document.getElementById("fileclose").disabled = true;                           //the close file button
//     document.getElementById("fileopen").disabled = false;                           //the open file button
//     document.getElementById("currentfilename").innerHTML = "open a .csv file";      //the text in the file upload field
//     document.getElementById("pills-table-tab").innerHTML = "table";                    //the table tab
//     document.getElementById("loadtexttable").style.display = "";                    //the "load a file" text
// }

//creates the header of the
//table in the appropriate
//format and saves it to
//the columnDefs variable
function createHeader(data) {
    var rows = data.split("\n");
    var header = rows[0].split(",");

    //iterate through every
    //cell and then generate
    //the required format
    //for the column headers
    var y;
    for (y = 0; y < header.length; y++) {
        var headerdict = {};

        //set the name of the
        //column to the name
        //of the cell
        headerdict["headerName"] = header[y];

        //set the id of the
        //column to the name
        //of the cell in
        //lowercase with
        //spaces removed
        headerdict["field"] = header[y].toString().replace(/\s/g,'').toLocaleLowerCase();

        //save the new column
        //created using its id
        usedcolumns.push(headerdict["field"]);

        //sets the checkbox selection
        //to true on the first
        //cell in the header
        headerdict["checkboxSelection"] = y === 0;
        columnDefs.push(headerdict);
    }
}

//creates every row in the
//table in the appropriate
//format and saves it to
//the rowData variable
function createRows(data) {
    var rows = data.split("\n");

    //iterates over every
    //row in the table and
    //makes it the correct
    //format for the rows
    var x;
    for (x = 1; x < rows.length; x++) {
        var currentrow = rows[x];
        currentrow = currentrow.split(",");
        if(currentrow[0] === "") {
            break
        }
        else {
            //merges two arrays
            var cell = _.zipObject(usedcolumns, currentrow); //https://lodash.com/docs/4.17.10#zipObject
            rowData.push(cell);
        }

    }
}

//runs all table related functions
//and then creates the table on the page
function createTable(data) {
    createHeader(data);
    createRows(data);

    //locates the tables
    //container in the page
    var eGridDiv = document.querySelector('#tablefinal');

    //loads the table into
    //the #tablefinal div
    new agGrid.Grid(eGridDiv, gridOptions);
}

//
//
//      CHART GENERATION
//
//


//
//      BAR CHART
//

function createBarChart(data, name) {
        $('#bargraph').highcharts({
            chart: {
                type: "column"
            },
            title: {
                text: name
            },
            xAxis: {
                categories: []
            },
            yAxis: {
                title: {
                    text: ""
                }
            },
            data: {
                csv: data
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: false
                    }
                }
            }
        });
}

//
//      LINE CHART
//

function createLineChart(data, name) {
    console.log("line");
    Highcharts.chart('container', {

        title: {
            text: name
        },

        yAxis: {
            title: {
                text: ""
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle'
        },

        plotOptions: {
            series: {
                label: {
                    connectorAllowed: false
                },
                pointStart: 2010
            }
        },

        data: {
            csv: data
        },

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}

//
//      SCATTER CHART
//

function createScatterChart(data, name) {
    $('#scattergraph').highcharts({
        chart: {
            type: "scatter"
        },
        title: {
            text: name
        },
        xAxis: {
            categories: []
        },
        yAxis: {
            title: {
                text: "number"
            }
        },
        data: {
            csv: data
        },
        plotOptions: {
            series: {
                marker: {
                    enabled: false
                }
            }
        }
    });
}

//
//      HEAT MAP
//

function createHeatMap(data, name) {
   Highcharts.chart('containerheat', {

    chart: {
        type: 'heatmap',
        marginTop: 40,
        marginBottom: 80,
        plotBorderWidth: 1
    },


    title: {
        text: ''
    },

    xAxis: {
        categories: ['2010', '2011']
    },

    yAxis: {
        categories: ['1', '2', "3"],
        title: null
    },

    colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: Highcharts.getOptions().colors[0]
    },

    legend: {
        align: 'right',
        layout: 'vertical',
        margin: 0,
        verticalAlign: 'top',
        y: 25,
        symbolHeight: 280
    },

    tooltip: {
        formatter: function () {
            return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
                this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
        }
    },

    series: [{
        name: 'Sales per employee',
        borderWidth: 1,
        data: [[0, 0, 176344.2276474], [0, 1, 63328.3444443199], [0, 2, -24949.61195457], [1, 0, 176344.2276], [1, 1, 239672.5721], [1,2, 2066.83048456001]],
        dataLabels: {
            enabled: true,
            color: '#000000'
        }
    }]

});
}
