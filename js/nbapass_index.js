var teams = ['gsw', 'hou', 'lac', 'por', 'mem', 'sas', 'dal', 'nop', 'atl', 'cle', 'chi', 'tor', 'was', 'mil', 'bos', 'bkn'];
var teamname_list = ['金州勇士', '休士頓火箭', '洛杉磯快艇', '波特蘭拓荒者', '孟斐斯灰熊', '聖安東尼奧馬刺', '達拉斯小牛', '紐奧良鵜鶘', '亞特蘭大老鷹', '克里夫蘭騎士', '芝加哥公牛', '多倫多暴龍', '華盛頓巫師', '密爾瓦基公鹿', '波士頓賽爾提克', '布魯克林籃網'];
var width = '100%', height = 120;
// var color = d3.scale.category20();
var node_lists = {};
var para = 2;
var static_x = [170/para, 70/para, 108.2/para, 231.8/para, 270/para];
var static_y = [25/para, 97.7/para, 215.3/para, 215.3/para, 97.7/para];
var btn_focused = 0;
var team_profile = {}

//------------------------------------------------------------------------------------------------//

for (var i in teams){
	team_profile[teams[i]] = [];
}

d3.csv('data/players_profile.csv', function(data_profile){
	for (var i in data_profile){
		var temp = {}
		temp['chinesename'] = data_profile[i]['chinesename'];
		temp['name'] = data_profile[i]['name'];
		temp['position'] = data_profile[i]['position'];
		temp['number'] = data_profile[i]['number'];
		team_profile[data_profile[i]['team']].push(temp);
	}

	// console.log(team_profile);
});

$(document).ready(function(){
	
	for (var i = 0; i < teams.length; i++){
		var chartblock = d3.select('.charts-container').append('div').attr('class', 'chart-block').attr('id', teams[i] + '-chart-block');
		chartblock.append('div').attr('class', 'teamchart').attr('id', teams[i] + '-chart');

		if (teams[i] == 'sas'){
			var top_pass_div = chartblock.append('div').attr('class', 'top-pass top-1');
			top_pass_div.append('div').attr('class', 'top-little-text').text('TOP1');
			top_pass_div.append('div').attr('class', 'top-big-text').text('346次');
		}
		else if (teams[i] == 'atl'){
			var top_pass_div = chartblock.append('div').attr('class', 'top-pass top-2');
			top_pass_div.append('div').attr('class', 'top-little-text').text('TOP2');
			top_pass_div.append('div').attr('class', 'top-big-text').text('323次');
		}
		else if (teams[i] == 'gsw'){
			var top_pass_div = chartblock.append('div').attr('class', 'top-pass top-3');
			top_pass_div.append('div').attr('class', 'top-little-text').text('TOP3');
			top_pass_div.append('div').attr('class', 'top-big-text').text('316次');
		}

		if (teams[i] == 'lac'){
			var top_pass_div = chartblock.append('div').attr('class', 'top-pass-percent top-1');
			top_pass_div.append('div').attr('class', 'top-little-text').text('TOP1');
			top_pass_div.append('div').attr('class', 'top-big-text').text('59.7%');
		}
		else if (teams[i] == 'por'){
			var top_pass_div = chartblock.append('div').attr('class', 'top-pass-percent top-2');
			top_pass_div.append('div').attr('class', 'top-little-text').text('TOP2');
			top_pass_div.append('div').attr('class', 'top-big-text').text('50.4%');
		}
		else if (teams[i] == 'was'){
			var top_pass_div = chartblock.append('div').attr('class', 'top-pass-percent top-3');
			top_pass_div.append('div').attr('class', 'top-little-text').text('TOP3');
			top_pass_div.append('div').attr('class', 'top-big-text').text('47.5%');
		}

		
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

	document.onclick = function(e){

		if(e.target.id == 'btn-top-pass'){
			if(btn_focused == 2){
				$('.top-pass-percent').fadeOut(500);
				$('#sas-chart-block').animate({opacity: 1}, 500);
				$('#atl-chart-block').animate({opacity: 1}, 500);
				$('#gsw-chart-block').animate({opacity: 1}, 500);
				$('.top-pass-percent').fadeOut(500);
			}
			for (var i = 0; i < teams.length; i++){
				if (teams[i] != 'sas' && teams[i] != 'atl' && teams[i] != 'gsw'){
					$('#' + teams[i] + '-chart-block').animate({opacity: 0.1}, 500);
				}
			}

			$('.top-pass').fadeIn(500);


			btn_focused = 1;
		}
		else if (e.target.id == 'btn-top-pass-percent'){
			if(btn_focused == 1){
				$('.top-pass').fadeOut(500);
				$('#lac-chart-block').animate({opacity: 1}, 500);
				$('#por-chart-block').animate({opacity: 1}, 500);
				$('#was-chart-block').animate({opacity: 1}, 500);
				$('.top-pass').fadeOut(500);
			}
			for (var i = 0; i < teams.length; i++){
				if (teams[i] != 'lac' && teams[i] != 'por' && teams[i] != 'was'){
					$('#' + teams[i] + '-chart-block').animate({opacity: 0.1}, 500);
				}
			}

			$('.top-pass-percent').fadeIn(500);

			btn_focused = 2;
		}
		else{
			
			for (var i = 0; i < teams.length; i++){
				$('#' + teams[i] + '-chart-block').animate({opacity: 1}, 500);
			}

			$('.top-pass').fadeOut(500);
			$('.top-pass-percent').fadeOut(500);
			
			btn_focused = 0;
		}
	}

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

	  tip = d3.tip().attr('class', 'd3-tip')
			.html(function(d) { 
	  			return '球在 ' + d.source.name + ' 和 ' + d.target.name + ' 之間平均傳導了 ' +  formatFloat(d.value, 2) + '次'; 
	  		})
	  		/*.offset(function() {
		  		return [10, this.getBBox().width / 2];
			})*/
			.direction(function(){
	  			if ($(this).offset().left + (this.getBBox().width / 2) + 200 > $(window).width())
	  				return 'w';
	  			else if($(this).offset().left - this.getBBox().width / 2 -200 < 0)
	  				return 'e';
	  			else
	  				return 's';
	  		});

	  tip_node = d3.tip().attr('class', 'd3-tip')
		  	.html(function(d){
		  		console.log(d);
			  	var str = team_profile[d.team][d.index]['chinesename'] + '   ' +  d.name + '<br>位置：' + team_profile[d.team][d.index]['position'] + '<br>' + team_profile[d.team][d.index]['number'] + '<br>傳球分佈<br>';
			  	for (var i = 0; i < d.passto_list.length; i++){
			  		str += d.passto_list[i]['player_name'] + '： ' + d.passto_list[i]['pass_times'] + ' 次<br>';
			  	}
			  	return str;
		  	})
		  	.direction(function(){
	  			if ($(this).offset().left + this.getBBox().width / 2 > $(window).width())
	  				return 'w';
	  			else if($(this).offset().left - this.getBBox().width / 2 < 0)
	  				return 'e';
	  			else
	  				return 's';
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