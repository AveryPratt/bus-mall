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
var chart1;
var chart2;

// html elements
var intro = document.getElementById('intro');
var section = document.getElementById('imgs');
var radios = document.getElementsByName('sortButton');
var resetStoredDataButton = document.getElementById('resetStoredDataButton');
var chartForm = document.getElementById('chartForm');
var chart1Title = document.getElementById('chart1Title');
var chart2Title = document.getElementById('chart2Title');
var canvas1 = document.getElementById('canvas1');
var canvas2 = document.getElementById('canvas2');

// constructors
function Product(source, index){
  this.source = source;
  this.index = index;
  this.name = source.slice(7, source.length - 4);
  this.totalPresented = 0;
  this.clicks = 0;
  this.lastPresented = 0;
  this.popularity = 0;
  this.reliability = 0;
}

// compare functions (for sorting)
var compareReliable = function(productA, productB){
  if (productA.reliability > productB.reliability) {
    return -1;
  }
  else if (productA.reliability < productB.reliability) {
    return 1;
  }
  else return 0;
};
var comparePopular = function(productA, productB){
  if (productA.popularity > productB.popularity) {
    return -1;
  }
  else if (productA.popularity < productB.popularity) {
    return 1;
  }
  else {
    if (productA.totalPresented > productB.totalPresented) {
      return -1;
    }
    else if (productA.totalPresented < productB.totalPresented) {
      return 1;
    }
    else return 0;
  }
};
var compareClicked = function(productA, productB){
  if (productA.clicks > productB.clicks) {
    return -1;
  }
  else if (productA.clicks < productB.clicks) {
    return 1;
  }
  else {
    if (productA.totalPresented > productB.totalPresented) {
      return -1;
    }
    else if (productA.totalPresented < productB.totalPresented) {
      return 1;
    }
    else return 0;
  }
};
var compareFrequent = function(productA, productB){
  if (productA.totalPresented > productB.totalPresented) {
    return -1;
  }
  else if (productA.totalPresented < productB.totalPresented) {
    return 1;
  }
  else {
    if (productA.clicks > productB.clicks) {
      return -1;
    }
    else if (productA.clicks < productB.clicks) {
      return 1;
    }
    else return 0;
  }
};
var compareAlphabetical = function(productA, productB){
  return productA.name.localCompare(productB.name);
};

// chart display functions
function prepChart(){
  for (var i = 0; i < products.length; i++) {
    setReliability(products[i]);
  }
}
function sortChart(){
  for (var i = 0; i < radios.length; i++) {
    if (radios[i].checked) {
      switch (radios[i].value) {
      case 'reliable':
        products.sort(compareReliable);
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
        products.sort(compareAlphabetical);
        break;
      }
    }
  }
}
function displayChart1(clickBackgroundColors, hoverColors, presentedBackgroundColors) {
  if(chart1){
    chart1.destroy();
  }
  var data = {
    labels: products.map(function(product) {
      return product.name;
    }),
    datasets: [{
      label: 'clicks',
      data: products.map(function(product) {
        return product.clicks;
      }),
      backgroundColor: clickBackgroundColors,
      hoverBackgroundColor: hoverColors
    }, {
      label: 'times presented',
      data: products.map(function(product) {
        return product.totalPresented;
      }),
      backgroundColor: presentedBackgroundColors,
      hoverBackgroundColor: hoverColors
    }],
  };
  var canvas = document.getElementById('canvas1');
  var context = canvas.getContext('2d');
  chart1 = new Chart(context, {
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
  if(chart2){
    chart2.destroy();
  }
  var data = {
    labels: products.map(function(product) {
      return product.name;
    }),
    datasets: [{
      label: 'popularity',
      data: products.map(function(product) {
        return product.popularity;
      }),
      backgroundColor: popularityBackgroundColors,
      hoverBackgroundColor: hoverColors
    }],
  };
  var canvas = document.getElementById('canvas2');
  var context = canvas.getContext('2d');
  chart2 = new Chart(context, {
    type: 'bar',
    data: data,
    options: {
      responsive: false,
    },
    scales: [{
      ticks: {
        beginAtZero: true
      }
    }]
  });
  canvas.style.visibility = 'visible';
}
function displayCharts(){
  prepChart();
  sortChart();
  var clickBackgroundColors = [];
  var presentedBackgroundColors = [];
  var popularityBackgroundColors = [];
  var hoverColors = [];
  for (var i = 0; i < products.length; i++) {
    clickBackgroundColors[i] = '#ff0000';
    presentedBackgroundColors[i] = '#0000ff';
    popularityBackgroundColors[i] = '#9900ff'; //#339933
    hoverColors[i] = '#333333'; //#9900ff
  }
  displayChart1(clickBackgroundColors, hoverColors, presentedBackgroundColors);
  displayChart2(hoverColors, popularityBackgroundColors);
}

// other functions
function setPopularity(product){
  if (product.totalPresented === 0) {
    product.popularity = 0;
  } else {
    product.popularity = (product.clicks / product.totalPresented) * 100;
  }
}
function setReliability(product){
  setPopularity(product);
  product.reliability = product.popularity * Math.log(product.totalPresented + 1);
}
function generateImages(){
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
function populateInUseArray(){
  var skipArr = [];
  turnNumber += 1;
  for (var i = 0; i < inUse.length; i++) {
    var rand = generateRand(skipArr);
    skipArr.push(rand);
    if (products[rand].lastPresented >= (turnNumber - 1) && turnNumber > 1) {
      i -= 1;
    }
    else {
      products[rand].totalPresented += 1;
      products[rand].lastPresented = turnNumber;
      inUse[i] = products[rand];
    }
  }
}
function generateRand(skipArr){
  var rand = Math.floor(Math.random() * (products.length - skipArr.length));
  for (var i = 0; i < skipArr.length; i++) {
    if (rand >= skipArr[i]) {
      rand += 1;
    }
  }
  return rand;
};
function showResults(){
  var finished = new Product('images/finished.jpg');
  inUse = [finished, finished, finished];
  generateImages();
  logResults();
  var chartSection = document.getElementById('charts');
  intro.textContent = 'Thank you for completing the survey! Your results are shown below.';
  chartSection.style.visibility = 'visible';
  canvas1.style.visibility = 'visible';
  canvas2.style.visibility = 'visible';
  chartForm.style.visibility = 'visible';
  chart1Title.style.visibility = 'visible';
  chart2Title.style.visibility = 'visible';
}
function logResults(){
  var totalsMessage = '';
  for (var i = 0; i < products.length; i++) {
    totalsMessage += products[i].name + ': ' + products[i].clicks + ', ' + products[i].totalPresented + ', ' + products[i].popularity.toFixed(2) + ', ' + products[i].reliability.toFixed(2) + ' | ';
  }
  console.log('Sorted by most ' + getRadioValue());
  console.log('Results [name: clicks, presented,  popularity, reliability]: ' + totalsMessage);
}
function getRadioValue(){
  for (var i = 0; i < radios.length; i++) {
    if(radios[i].checked){
      return radios[i].value;
    }
  }
}

// local storage functions
function storeData(){
  var productsString = JSON.stringify(products);
  localStorage.setItem('products', productsString);
}
function retrieveData(){
  var storedStringArray = localStorage.getItem('products');
  if(storedStringArray){
    var storedArray = JSON.parse(storedStringArray);
    products = storedArray;
    for (var i = 0; i < products.length; i++) {
      products[i].lastPresented = 0;
    }
  }
  else{
    for (var j = 0; j < products.length; j++) {
      products[j].index = j;
    }
  }
}
function resetStoredData(){
  for (var i = 0; i < products.length; i++) {
    products[i].totalPresented = 0;
    products[i].clicks = 0;
    products[i].lastPresented = 0;
    products[i].popularity = 0;
    products[i].reliability = 0;
  }
  storeData();
}

// event handlers
function handleImageClick(event){
  var clickedProduct;
  if(event.target.id.slice(0, event.target.id.length - 1) === 'imgDiv'){
    clickedProduct = inUse[event.target.querySelector('img').id.slice(3, 4) - 1];
  }
  else{
    clickedProduct = inUse[event.target.id.slice(3, 4) - 1];
  }
  clickedProduct.clicks += 1;
  if (turnNumber >= 25) {
    console.log('Survey Complete!');
    storeData();
    displayCharts();
    showResults();
    section.removeEventListener('click', handleImageClick);
  } else {
    populateInUseArray();
    generateImages();
    console.log(clickedProduct.name + ' ' + clickedProduct.clicks + '/' + clickedProduct.totalPresented);
    console.log(26 - turnNumber + ' choices left.');
    console.log(event.target.id);
  }
}
function handleFormClick(event){
  var check = false;
  if(event.target === resetStoredDataButton){
    check = confirm('Are you sure you want to delete previous data?');
    if(check){
      resetStoredData();
      console.log('Data Reset.');
    }
  }
  else{check = true;}
  if(check){
    displayCharts();
    showResults();
  }
}

// run script
retrieveData();
populateInUseArray();
generateImages();
section.addEventListener('click', handleImageClick);
chartForm.addEventListener('click', handleFormClick);
