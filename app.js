
var width = 1000,
    height = 700;

var color = d3.scale.category20();

var force = d3.layout.force()
    .charge(-350)
    .linkDistance(100)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

var mis = document.getElementById('mis').innerHTML;
graph = JSON.parse(mis);

force.nodes(graph.nodes)
    .links(graph.links)
    .start();

var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", 3);

var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);
node.append("circle")
    .attr("r", 18)
    .style("fill", function (d) {
    return color(d.group);
})
node.append("text")
      .attr("dx", 10)
      .attr("dy", "0.35em")
      .text(function(d) { return d.name })
      .style("stroke", "black");


force.on("tick", function () {
    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
        return d.source.y;
    })
        .attr("x2", function (d) {
        return d.target.x;
    })
        .attr("y2", function (d) {
        return d.target.y;
    });

    d3.selectAll("circle").attr("cx", function (d) {
        return d.x;
    })
        .attr("cy", function (d) {
        return d.y;
    });
    d3.selectAll("text").attr("x", function (d) {
        return d.x;
    })
        .attr("y", function (d) {
        return d.y;
    });
});

var optArray = [];
for (var i = 0; i < graph.nodes.length - 1; i++) {
    optArray.push(graph.nodes[i].name);
}
optArray = optArray.sort();

$(function completeNode() {
    $("#search").autocomplete({
        source: function (request, response) {
            var results = $.ui.autocomplete.filter(optArray, request.term);
            console.log(results);
            show(results);
            response(results);
        }
    });
});
$("#search").on("keydown", function(e) {
    if(e.keyCode == 8)
        show();
    });

function show(results) {
    var node = svg.selectAll(".node");
    node.style("visibility", "visible");
    if (results.length != 0) {
        for (var j = 0; j < results.length; j++) {
        node = node.filter(function (d, i) {
            return d.name != results[j];
        });
    }
        node.style("visibility", "hidden");
    }
                      
}

function searchNode() {
    var selectedVal = document.getElementById('search').value;
    var node = svg.selectAll(".node");
    if (selectedVal == "none") {
        node.style("stroke", "white").style("stroke-width", "1");
    } else {
        var selected = node.filter(function (d, i) {
            return d.name != selectedVal;
        });
        selected.style("opacity", "0");
        var link = svg.selectAll(".link")
        link.style("opacity", "0");
        d3.selectAll(".node, .link").transition()
            .duration(5000)
            .style("opacity", 1);
    }
}