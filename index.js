var dataset;
// get data from the website
let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  //const data = JSON.stringify(json);
  barGraph(json);
}

function barGraph(input) {
  let dataset = input.data;

  const padding = 20;
  const svgWidth = 890;
  const svgHeight = 400;

  var yearsDate = dataset.map(function(item){
    return new Date(item[0]);
  })
  
  var xMax = new Date(d3.max(yearsDate));
  xMax.setMonth(xMax.getMonth() + 6);

  var xScale = d3.scaleTime()
                .domain([d3.min(yearsDate), xMax])
                .range([padding, svgWidth-padding]);

  const minValueY = d3.min(dataset, (d) => d[1]);
  const maxValueY = d3.max(dataset, (d) => d[1]);

  const yScale = d3.scaleLinear()
    .domain([0, maxValueY])
    .range([svgHeight - padding, padding]);

// create svg
  const svg = d3.select('#container')
    .append('svg')
    .attr('width', svgWidth)
    .attr('height', svgHeight)

    svg.append('text')
    .attr('x', 50)
    .attr('y', 150)
    .attr('transform', 'rotate(-90)')
    .text("Gross Domestic Product")
    .style('font', '20px')

// append all rectangles to svg
  svg.selectAll('rect')
    .data(dataset)
    .enter()
    .append('rect')
    .attr('x', (d, i) => xScale(yearsDate[i])+padding )
    .attr('y', (d) => yScale(d[1]))
    .attr('width', svgWidth / dataset.length)
    .attr('height', (d) => d[1]*0.02)
    .attr('class', 'bar')
    .attr('data-date', (d)=>d[0])
    .attr('data-gdp', (d)=>d[1])
    .on('mouseover', function(d){

      let xPosition = parseInt(d3.select(this).attr('x')) + 40;
      let yPosition = d3.select(this).attr('y');

      d3.select('#tooltip')
        .style('left', xPosition+'px')
        .style('top', 300 + 'px')
        .attr('data-date', d3.select(this).attr('data-date'))
        .select('#value1')
        .text(setDate(d3.select(this).attr('data-date')))

      d3.select('#value2')
        .text(setGdp(d3.select(this).attr('data-gdp') ) )

        // show the tooltip
        d3.select("#tooltip").classed("hidden", false);
    })
    .on('mouseout', function(d){
      d3.select('#tooltip').classed("hidden", true);
    })

  const xAxis = d3.axisBottom(xScale);

  svg.append('g')
    .attr('transform', `translate(20, ${svgHeight-padding})`)
    .attr('id', 'x-axis')
    .call(xAxis)
    ;


  const yAxis = d3.axisLeft(yScale);

  svg.append('g')
    .attr('transform', 'translate(' + 40 + ',' + 0 + ')')
    .attr('id', 'y-axis')
    .call(yAxis);

}

function setDate(d){
  let date = d.split('-');
  let quarter;
  switch(date[1])
  {
    case '01':
      quarter = ' Q1';
      break;
    case '04':
      quarter = ' Q2';
      break;
    case '07':
      quarter = ' Q3';
      break;
    case '10':
      quarter = ' Q4';
      break;
    default:
  }
  return date[0] + quarter;
}

function setGdp(d){
  return '$' + d + ' Billion';
}