'use strict';

// global variables
var products = [
  new Product('images/bag.jpg'),
  new Product('images/banana.jpg'),
  new Product('images/bathroom.jpg'),
  new Product('images/boots.jpg'),
  new Product('images/breakfast.jpg'),
  new Product('images/bubblegum.jpg'),
  new Product('images/chair.jpg'),
  new Product('images/cthulhu.jpg'),
  new Product('images/dog-duck.jpg'),
  new Product('images/dragon.jpg'),
  new Product('images/pen.jpg'),
  new Product('images/pet-sweep.jpg'),
  new Product('images/scissors.jpg'),
  new Product('images/shark.jpg'),
  new Product('images/sweep.png'),
  new Product('images/tauntaun.jpg'),
  new Product('images/unicorn.jpg'),
  new Product('images/usb.gif'),
  new Product('images/water-can.jpg'),
  new Product('images/wine-glass.jpg')
];
var inUse = [{}, {}, {}];
var turnNumber = 0;
var section = document.getElementById('imgs');
var submitButton = document.getElementById('submitButton');
var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');
var chartForm = document.getElementById('chartForm');
var chart1Title = document.getElementById('chart1Title');
var chart2Title = document.getElementById('chart2Title');

// constructors
function Product(source, index) {
  this.source = source;
  this.index = index;
  this.name = source.slice(7, source.length - 4);
  this.totalPresented = 0;
  this.clicks = 0;
  this.lastPresented = 0;
  this.popularity = 0;

}

function setPopularity(product) {
  if (product.totalPresented === 0) {
    product.popularity = 0;
  } else {
    product.popularity = product.clicks / product.totalPresented;
  }
};


// compare functions (for sorting)
var comparePopular = function(productA, productB) {
  if (productA.popularity > productB.popularity) {
    return -1;
  } else if (productA.popularity < productB.popularity) {
    return 1;
  } else {
    if (productA.totalPresented > productB.totalPresented) {
      return -1;
    } else if (productA.totalPresented < productB.totalPresented) {
      return 1;
    } else return 0;
  }
};
var compareClicked = function(productA, productB) {
  if (productA.clicks > productB.clicks) {
    return -1;
  } else if (productA.clicks < productB.clicks) {
    return 1;
  } else {
    if (productA.totalPresented > productB.totalPresented) {
      return -1;
    } else if (productA.totalPresented < productB.totalPresented) {
      return 1;
    } else return 0;
  }
};
var compareFrequent = function(productA, productB) {
  if (productA.totalPresented > productB.totalPresented) {
    return -1;
  } else if (productA.totalPresented < productB.totalPresented) {
    return 1;
  } else {
    if (productA.clicks > productB.clicks) {
      return -1;
    } else if (productA.clicks < productB.clicks) {
      return 1;
    } else return 0;
  }
};
var compareDefault = function() {
  return 0;
};

// chart display functions
function prepChart() {
  for (var i = 0; i < products.length; i++) {
    if (storedArray) {
      setPopularity(storedArray[i]);
    } else {
      setPopularity(products[i]);
    }
  }
  var storedStringArray = localStorage.getItem('products');
  var storedArray = JSON.parse(storedStringArray);
}

function sortChart() {
  var radios = document.getElementsByName('sortButton');
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      switch (radios[i].value) {
      case 'reliable':
        products.sort(compareDefault);
        break;
      case 'clicked':
        products.sort(compareClicked);
        break;
      case 'frequent':
        products.sort(compareFrequent);
        break;
      case 'popular':
        products.sort(comparePopular);
        break;
      default:
        break;
      }
    }
  }
}

function displayChart1(clickBackgroundColors, hoverColors, presentedBackgroundColors) {
  var data = {
    labels: products.map(function(product) {
      return product.name;
    }),
    datasets: [{
      data: products.map(function(product) {
        return product.clicks;
      }),
      backgroundColor: clickBackgroundColors,
      hoverBackgroundColor: hoverColors
    }, {
      data: products.map(function(product) {
        return product.totalPresented;
      }),
      backgroundColor: presentedBackgroundColors,
      hoverBackgroundColor: hoverColors
    }],
  };
  var canvas = document.getElementById('canvas1');
  var context = canvas.getContext('2d');
  new Chart(context, {
    type: 'bar',
    data: data,
    options: {
      responsive: false
    },
    scales: [{
      ticks: {
        beginAtZero: true
      }
    }]
  });
  canvas.style.visibility = 'visible';
}

function displayChart2(hoverColors, popularityBackgroundColors) {
  var data = {
    labels: products.map(function(product) {
      return product.name;
    }),
    datasets: [{
      data: products.map(function(product) {
        return product.popularity;
      }),
      backgroundColor: popularityBackgroundColors,
      hoverBackgroundColor: hoverColors
    }],
  };
  var canvas = document.getElementById('canvas2');
  var context = canvas.getContext('2d');
  new Chart(context, {
    type: 'bar',
    data: data,
    options: {
      responsive: false
    },
    scales: [{
      ticks: {
        beginAtZero: true
      }
    }]
  });
  canvas.style.visibility = 'visible';
}

function hideCharts() {
  canvas1.style.visibility = 'hidden';
  canvas2.style.visibility = 'hidden';
  chartForm.style.visibility = 'hidden';
  chart1Title.style.visibility = 'hidden';
  chart2Title.style.visibility = 'hidden';
}

function showCharts() {
  canvas1.style.visibility = 'visible';
  canvas2.style.visibility = 'visible';
  chartForm.style.visibility = 'visible';
  chart1Title.style.visibility = 'visible';
  chart2Title.style.visibility = 'visible';
}

// other functions
function generateImages() {
  for (var i = 0; i < inUse.length; i++) {
    var img = document.getElementById('img' + (i + 1));
    var srcAtt = document.createAttribute('src');
    srcAtt.value = inUse[i].source;
    var altAtt = document.createAttribute('alt');
    altAtt.value = inUse[i].name;
    img.setAttributeNode(srcAtt);
    img.setAttributeNode(altAtt);
  }
}

function populateInUseArray() {
  var skipArr = [];
  turnNumber += 1;
  for (var i = 0; i < inUse.length; i++) {
    var rand = generateRand(skipArr);
    skipArr.push(rand);
    if (products[rand].lastPresented >= (turnNumber - 1) && turnNumber > 1) {
      i -= 1;
    } else {
      products[rand].totalPresented += 1;
      products[rand].lastPresented = turnNumber;
      inUse[i] = products[rand];
    }
  }
}

function generateRand(skipArr) {
  var rand = Math.floor(Math.random() * (products.length - skipArr.length));
  for (var i = 0; i < skipArr.length; i++) {
    if (rand >= skipArr[i]) {
      rand += 1;
    }
  }
  return rand;
};

function showResults() {
  var finished = new Product('images/finished.jpg');
  inUse = [finished, finished, finished];
  generateImages();
  var messageTag = document.getElementById('message');
  messageTag.style.visibility = 'visible';
  var totalsMessage = '';
  for (var i = 0; i < products.length; i++) {
    totalsMessage += products[i].name + ': ' + products[i].clicks + '/' + products[i].totalPresented + '. (' + products[i].popularity.toFixed(2) + ') | ';
  }
  console.log('Survey complete.');
  console.log('Results: ' + totalsMessage);
  showCharts();
}

// event handlers
function handleImageClick(event) {
  var clickedProduct = inUse[event.target.id.slice(3, 4) - 1];
  clickedProduct.clicks += 1;
  if (turnNumber >= 25) {
    handleSubmitButtonClick();
    showResults();
    body.removeEventListener('click', handleImageClick);
  } else {
    populateInUseArray();
    generateImages();
    console.log(clickedProduct.name + ' ' + clickedProduct.clicks + '/' + clickedProduct.totalPresented);
    console.log(26 - turnNumber + ' choices left.');
    console.log(event.target.id);
  }
}

function storedData() {
  var productsString = JSON.stringify(products);
  localStorage.setItem('products', productsString);
}


function handleSubmitButtonClick() {
  prepChart();
  sortChart();
  var clickBackgroundColors = [];
  var presentedBackgroundColors = [];
  var popularityBackgroundColors = [];
  var hoverColors = [];
  for (var i = 0; i < products.length; i++) {
    clickBackgroundColors[i] = '#ff0000';
    presentedBackgroundColors[i] = '#0000ff';
    popularityBackgroundColors[i] = '#999999';
    hoverColors[i] = '#9900ff';
  }
  displayChart1(clickBackgroundColors, hoverColors, presentedBackgroundColors);
  displayChart2(hoverColors, popularityBackgroundColors);
  storedData();
}

// run script
hideCharts();
for (var i = 0; i < products.length; i++) {
  products[i].index = i;
}
populateInUseArray();
generateImages();
section.addEventListener('click', handleImageClick);
submitButton.addEventListener('click', handleSubmitButtonClick);
