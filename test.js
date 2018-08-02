// Use the "evaluate" delimiter to execute JavaScript and generate HTML.
var compiled = _.template('<% _.forEach(users, function(user) { %><li><%- user %></li><% }); %>');
compiled({ 'users': ['fred', 'barney'] });
// => '<li>fred</li><li>barney</li>'

var data = ["row", "row2", "row3", "row4", "row5"]
function displayRows(data, range) {
    var y;
    for (y = 0; y < 10; y++) {
        var appendsfirst = "";
        var appendslast = "";
        var appendstype = "";

        if (rownumber === 0) {
            appendsfirst = "<thead>";
            appendstype = "th";
            appendslast = "</th></thead><tbody>";
        }
        else if (rownumber === data.length+1) {
            appendsfirst = "<tr>";
            appendstype = "td";
            appendslast = "</tr></tbody>";
        }
        else {
            appendsfirst = "<tr>";
            appendstype = "td";
            appendslast = "</tr>";
        }

        finaltable += appendsfirst;
        var i;
        for (i = 0; i < data.length; i++) {
            finaltable += "<" + appendstype + ">" + data[i] + "</" + appendstype + ">";
        }
        finaltable += appendslast;
        move(data.length);
        if (rownumber % 10 === 0 || rownumber <= 10) {
            document.getElementById("table").innerHTML = finaltable;
        }
    }
}