/**
 * Created by q on 2017/11/30.
 */
var canvasWidth = Math.min(600,$(window).width() - 20);
var canvasHeight = canvasWidth;
var isMouseDown = false;           //鼠标是否按下
var strokeColor = "black;";        //线条颜色
var lastLoc = {x:0,y:0};           //鼠标按下的初始位置
var lastTimeStamp =  0;            //鼠标按下的时间
var lastLineWidth = -1;            //上一条线条的官渡
$("#controller").css("width",canvasWidth + "px");
var canvas = document.getElementById("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
var context = canvas.getContext('2d');

drawGrid();
dottedLinTo(context,3,3,canvasWidth-3,canvasHeight-3,7);
dottedLinTo(context,canvasWidth-3,3,3,canvasHeight-3,7);
dottedLinTo(context,3,canvasHeight/2,canvasWidth-3,canvasHeight/2,7);
dottedLinTo(context,canvasWidth/2,3,canvasWidth/2,canvasHeight-3,7);
canvas.onmousedown = function(e){
    e.preventDefault();
    //isMouseDown = true;
    //lastLoc = windowToCanvas(e.clientX, e.clientY);
    //lastTimeStamp = new Date().getTime();
    startStroke({x:e.clientX, y:e.clientY});
};
canvas.onmousemove = function(e){
    e.preventDefault();
    if(isMouseDown){
        //var curLoc = windowToCanvas(e.clientX, e.clientY);
        //var curTimeStamp = new Date().getTime();
        //var t = curTimeStamp - lastTimeStamp;
        //var s = calcDistance(curLoc,lastLoc);
        //var lineWidth = calcLineWidth(t,s);
        //
        //context.beginPath();
        //context.moveTo(lastLoc.x,lastLoc.y);
        //context.lineTo(curLoc.x,curLoc.y);
        //context.strokeStyle = strokeColor;
        //context.lineWidth = lineWidth;
        //context.lineCap = "round";
        //context.stroke();
        //
        //lastLoc = curLoc;
        //lastTimeStamp = curTimeStamp;
        //lastLineWidth = lineWidth;
        moveStroke({x: e.clientX,y: e.clientY});
    }
};
canvas.onmouseup = function(e){
    e.preventDefault();
    //isMouseDown = false;
    endStroke();
};
canvas.onmouseout = function(e){
    e.preventDefault();
    //isMouseDown = false;
    endStroke();
};
canvas.addEventListener("touchstart",function(e){
    e.preventDefault();
    touch = e.touches[0];
    startStroke({x:touch.pageX,y:touch.pageY});
});
canvas.addEventListener("touchmove",function(e){
    e.preventDefault();
    if(isMouseDown){
        touch = e.touches[0];
        moveStroke({x:touch.pageX,y:touch.pageY});
    }
});
canvas.addEventListener("touchend",function(e){
    e.preventDefault();
    endStroke();
});
$(".color_btn").click(function(e){
    $(".color_btn").removeClass("color_btn_selected");
    $(this).addClass("color_btn_selected");
    strokeColor = $(this).css("background-color");
});
$("#clear_btn").click(function(e){
    context.clearRect(0,0,canvasWidth,canvasHeight);
    drawGrid();
    dottedLinTo(context,3,3,canvasWidth-3,canvasHeight-3,7);
    dottedLinTo(context,canvasWidth-3,3,3,canvasHeight-3,7);
    dottedLinTo(context,3,canvasHeight/2,canvasWidth-3,canvasHeight/2,7);
    dottedLinTo(context,canvasWidth/2,3,canvasWidth/2,canvasHeight-3,7);
});
function drawGrid(){
    context.strokeStyle = "rgb(230,11,9)";

    context.save();
    context.beginPath();
    context.moveTo(3,3);
    context.lineTo(canvasWidth-3,3);
    context.lineTo(canvasWidth-3,canvasHeight-3);
    context.lineTo(3,canvasHeight-3);
    context.closePath();
    context.lineWidth = 6;
    context.stroke();
    context.restore();
}
function dottedLinTo(context,sx,sy,ex,ey,length){
    var w = ex - sx; //获取线条的水平宽度
    var h = ey - sy; //获取线条的垂直高度
    var l = Math.sqrt(w*w + h*h); // 获取线条的长度
    var index = Math.floor(l/length); //获取虚线的个数
    for(var i=0;i<index;i++){
        if(i%2==0){
            context.moveTo(sx+w/index*i,sy+h/index*i);
        }else{
            context.lineTo(sx+w/index*i,sy+h/index*i);
        }
    }
    context.strokeStyle = "rgb(230,11,9)";
    context.lineWidth = 1;
    context.stroke();
}
function windowToCanvas(x,y){
    var bbox = canvas.getBoundingClientRect();
    return {x:Math.round(x-bbox.left),y:Math.round(y-bbox.top)};
}
function calcDistance(loc1,loc2){
    return Math.sqrt( (loc1.x - loc2.x)*(loc1.x - loc2.x) + (loc1.y - loc2.y)*(loc1.y - loc2.y) )
}
function calcLineWidth(t,s){
    var v = s/t;
    var resultLineWidth;
    if(v<=0.1){
        resultLineWidth = 30;
    }else if(v>=10){
        resultLineWidth = 1;
    }else{
        resultLineWidth = 30 - (v-0.1)/(10-0.1)*(30-0.1);
    }
    if(lastLineWidth == -1){
        return resultLineWidth;
    }
    return lastLineWidth*2/3 + resultLineWidth/3;
}
function startStroke(point){
    isMouseDown = true;
    lastLoc = windowToCanvas(point.x,point.y);
    lastTimeStamp = new Date().getTime();
}
function moveStroke(point){
    var curLoc = windowToCanvas(point.x, point.y);
    var curTimeStamp = new Date().getTime();
    var t = curTimeStamp - lastTimeStamp;
    var s = calcDistance(curLoc,lastLoc);
    var lineWidth = calcLineWidth(t,s);

    context.beginPath();
    context.moveTo(lastLoc.x,lastLoc.y);
    context.lineTo(curLoc.x,curLoc.y);
    context.strokeStyle = strokeColor;
    context.lineWidth = lineWidth;
    context.lineCap = "round";
    context.stroke();

    lastLoc = curLoc;
    lastTimeStamp = curTimeStamp;
    lastLineWidth = lineWidth;
}
function endStroke(){
    isMouseDown = false;
}