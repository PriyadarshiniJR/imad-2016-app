console.log('Loaded!');
var e = document.getElementById('madi');

var marginLeft=0;
function moveRight(){
    marginLeft=marginLeft+10;
    img.style.marginLeft=marginLeft+'px';
}

madi.onclick=function(){
  var interval=setInterval(moveRight,100);  
};