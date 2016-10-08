console.log('Loaded!');
var e = document.getElementById('madi');
madi.onclick=function(){
  madi.style.marginLeft='100px';  
};
var marginLeft=0;
function moveRight(){
    marginLeft=marginLeft+10;
    img.style.marginLeft=marginLeft+'px';
}

img.onclick=function(){
  var interval=setInterval(moveRight,100);  
};