var teams = ['gsw', 'hou', 'lac', 'por', 'mem', 'sas', 'dal', 'nop', 'atl', 'cle', 'chi', 'tor', 'was', 'mil', 'bos', 'bkn'];
var teamname_list = ['金州勇士', '休士頓火箭', '洛杉磯快艇', '波特蘭拓荒者', '孟斐斯灰熊', '聖安東尼奧馬刺', '達拉斯小牛', '紐奧良鵜鶘', '亞特蘭大老鷹', '克里夫蘭騎士', '芝加哥公牛', '多倫多暴龍', '華盛頓巫師', '密爾瓦基公鹿', '波士頓賽爾提克', '布魯克林籃網'];
var width = '100%', height = 120;
// var color = d3.scale.category20();
var node_lists = {};
var para = 2;
var static_x = [170/para, 70/para, 108.2/para, 231.8/para, 270/para];
var static_y = [25/para, 97.7/para, 215.3/para, 215.3/para, 97.7/para];

//------------------------------------------------------------------------------------------------//

$(document).ready(function(){
	
	

	
	for (var i = 0; i < teams.length; i++){
		var chartblock = d3.select('.charts-container').append('div').attr('class', 'chart-block');
		chartblock.append('div').attr('class', 'teamchart').attr('id', teams[i] + '-chart');
		
		var teamname_block = chartblock.append('div').attr('class', 'teamname-block').attr('id', teams[i] + '-teamname-block');

		var standing_str = '季賽戰績/  ';
		if(i < 8)
			standing_str = standing_str + '西區';
		else
			standing_str = standing_str + '東區';

		standing_str = standing_str + 'No. ' + (i%8 + 1).toString();
		chartblock.append('div').attr('class', 'team-standing').attr('id', teams[i] + '-standing').text(standing_str);
		
		var team_img = teamname_block.append('div').attr('class', 'team-img').attr('id', teams[i] + '-img');
		teamname_block.append('div').attr('class', 'team-name').text(teamname_list[i]);

		team_img.append('img').attr('src', 'img/' + teams[i] + '_logo.svg').attr({
			'height': '100%'
			// 'height': '40px',
		});

		draw(teams[i]);
	}
	// draw('cle');
	// draw('gsw');


});

function draw(teamname){

	var force = d3.layout.force()
	    .charge(-120)
	    .linkDistance(100)
	    .size([width, height]);

	var svg = d3.select("#" + teamname + "-chart").append("svg")
	    .attr("width", width)
	    .attr("height", height);

	d3.json("data/" + teamname + "_pass_final.json", function(error, graph) {

	  force
	      .nodes(graph.nodes)
	      .links(graph.links)
	      .start();

	  // console.log(graph);

	  node_lists[teamname] = graph.nodes;

	  tip = d3.tip().attr('class', 'd3-tip').direction('s').html(function(d) { 

	  	return '球在 ' + d.source.name + ' 和 ' + d.target.name + ' 之間平均傳導了 ' +  formatFloat(d.value, 2) + '次'; 
	  });

	  tip_node = d3.tip().attr('class', 'd3-tip').direction('s').html(function(d){
	  	// console.log(d);
	  	var str = '名字： ' + d.name + '<br>傳球分佈<br>';
	  	for (var i = 0; i < d.passto_list.length; i++){
	  		str += d.passto_list[i]['player_name'] + '： ' + d.passto_list[i]['pass_times'] + ' 次<br>';
	  	}
	  	return str;
	  })

	  svg.call(tip);
	  svg.call(tip_node);

	  /*svg.append("defs").selectAll("marker")
	    .data(["suit", "licensing", "resolved"])
	  .enter().append("marker")
	    .attr("id", function(d) { return d; })
	    .attr("viewBox", "0 -5 10 10")
	    .attr("refX", 25)
	    .attr("refY", 0)
	    .attr("markerWidth", 6)
	    .attr("markerHeight", 6)
	    .attr("orient", "auto")
	  .append("path")
	    .attr("d", "M0,-5L10,0L0,5 L10,0 L0, -5")
	    .style("stroke", "#4679BD")
	    .style("opacity", "0.6");*/

	  var link = svg.selectAll(".link-" + teamname)
	      .data(graph.links)
	    .enter().append("line")
	      .attr("class", "link link-" + teamname)
	      .style("marker-end",  "url(#suit)") // Modified line 
	      .style("stroke-width", function(d) { return d.value/3; })
	      /*.style("stroke", function(d){
	      	return '#4545F4';
	      })*/
	      .on('mouseover', tip.show)
	      .on('mouseout', tip.hide);

	  var node = svg.selectAll(".node-" + teamname)
	      .data(graph.nodes)
	    .enter().append("circle")
	      .attr("class", "node node-" + teamname)
	      .attr("r", 10)
	      .style("fill", function(d) { 
	      	return '#aaaaaa'; 
	      })
	      // .call(force.drag)
	      .on('mouseover', tip_node.show)
	      .on('mouseout', tip_node.hide);

	  var padding = 70, // separation between circles
		    radius=10;
		/*function collide(alpha) {
		  var quadtree = d3.geom.quadtree(graph.nodes);
		  return function(d) {
		    var rb = 2*radius + padding,
		        nx1 = d.x - rb,
		        nx2 = d.x + rb,
		        ny1 = d.y - rb,
		        ny2 = d.y + rb;
		    quadtree.visit(function(quad, x1, y1, x2, y2) {
		      if (quad.point && (quad.point !== d)) {
		        var x = d.x - quad.point.x,
		            y = d.y - quad.point.y,
		            l = Math.sqrt(x * x + y * y);
		          if (l < rb) {
		          l = (l - rb) / l * alpha;
		          d.x -= x *= l;
		          d.y -= y *= l;
		          quad.point.x += x;
		          quad.point.y += y;
		        }
		      }
		      return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
		    });
		  };
		}*/

	  /*node.append("title")
	      .text(function(d) { return d.name; });*/

	  force.on("tick", function() {
	  	node.attr("cx", function(d) {
		    	// d.fixed = true; 
		      	// console.log(d);
		      	d.x = static_x[d.index];
		      	d.y = static_y[d.index];
		      	/*console.log(d.index);
		      	console.log(d.x);*/
		      	return d.x; 
	      	})
	        .attr("cy", function(d) { return d.y; });

	    link.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });

	    
	    // node.each(collide(3));
	  });

	  force.start();
	});

}

function formatFloat(num, pos)
{
  var size = Math.pow(10, pos);
  return Math.round(num * size) / size;
}