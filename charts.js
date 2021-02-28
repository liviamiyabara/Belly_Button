function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();


function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}



// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // 3. Create a variable that holds the samples array.
    var samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var filterArray = samples.filter(sampleObject => sampleObject.id == sample);
    var filterArray_meta = data.metadata.filter(sampleObject => sampleObject.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = filterArray[0];
    var result_meta = filterArray_meta[0];
    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids = result.otu_ids;
    var otu_labels = result.otu_labels;
    var sample_values = result.sample_values;
    var wfreq_values = result_meta.wfreq;

    console.log(wfreq_values)
    
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    // 8. Create the trace for the bar chart. 
    var trace1 = {
      x: sample_values.slice(0,10).reverse(),
      y: otu_ids.slice(0,10).map(otuID => `OTU ${otuID}`).reverse(),
      text: otu_labels.slice(0,10).reverse(),
      type: "bar",
      orientation: "h"
    };
    var data = [trace1];
    // 9. Create the layout for the bar chart. 
    var layout = {
        title: "Top 10 Bacteria Cultures Found for ID " +sample,
        margin: {l: 100, r: 100, t: 100, b: 100} 
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", data, layout);  
    
    // 11. Create the trace for the bubble chart.
    var trace1 = {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: 'markers',
        marker: {
        size: sample_values,
        color: otu_ids,
        }
    };
    var data = [trace1];
    // 12. Create the layout for the bubble chart.
    var layout = {
        title: "Bacteria Cultures per Sample for ID " +sample,
        showlegend: false,
        hovermode: 'closest',
        xaxis: {title:"OTU (Operational Taxonomic Unit) ID " +sample},
    };
    
    // 13. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', data, layout); 

    // 14. Create the trace for the gauge chart.
    
    var data = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge+number",
        value: wfreq_values,
        title: "Belly Button Washing Frequency<br> Scrubs per Week for ID" +sample, 
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "black" },
          bar: { color: "black" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            {range: [0,2], color:"red"},
            {range: [2,4], color:"darkorange"},
            {range: [4,6], color:"yellow"},
            {range: [6,8], color:"limegreen"},
            {range: [8,10], color:"green"}
          ],   
        }     
      }
    ];
    
    // 15. Create the layout for the gauge chart.
    var layout = { width: 450, height: 400, margin: { t: 0, b: 0 }};
       
    // 16. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", data, layout);

  });    
}