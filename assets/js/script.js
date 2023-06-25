var lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus fermentum libero sed ante molestie, et tincidunt libero ultrices. Phasellus sed placerat nunc, a condimentum nunc. Proin lobortis tincidunt accumsan. Vivamus vitae enim neque. Curabitur ante felis, sodales at enim id, commodo fermentum sapien. Donec faucibus risus vel ante ultricies commodo. Curabitur commodo quam quis enim porta auctor. Phasellus imperdiet imperdiet condimentum. Aliquam at magna orci. Quisque eget purus vel augue iaculis blandit at sed ex. In ultricies tincidunt lorem. Quisque vel massa placerat, maximus nulla dapibus, ullamcorper mi. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aenean a sollicitudin velit, non cursus lectus. Nulla vehicula cursus justo";

$(document).ready(function () {
    function previewFile(file) {
        const reader = new FileReader();

        var img = new Image();

        getFontSize();
        
        // ファイルが読み込まれたときに実行する
        reader.onload = function (e) {
            const imageUrl = e.target.result; // 画像のURLはevent.target.resultで呼び出せる
            img.src = imageUrl; // 画像のURLをimg要素にセット
            img.onload = function(){
            var [check, slider, size, bool] = border();
            var aspect = img.height / img.width;
            var width = size;
            var height = width * aspect;
            var ctx = createCanvas(width, height);
            ctx.drawImage(img, 0, 0, width, height);
            var imageData = ctx.getImageData(0, 0, Math.floor(width), Math.floor(height)); // wとhを整数に変換
            var data = imageData.data;
            var count = 0;
            var t = "";
            var scaleW =  10000 / width;
            //var scaleH =  10000 / height;
            $("#preview").css({ "transform": `scale(${scaleW}%,${scaleW}%)` });
            
            

            for (let y = 0; y < Math.floor(height); y++) {
                let line = "";
                for (let x = 0; x < Math.floor(width); x++) {
                    var index = (x + y * Math.floor(width)) * 4;
                    var r = data[index];
                    var g = data[index + 1];
                    var b = data[index + 2];
                    var alpha = data[index + 3];
                    var [h,s,v] = rgb2hsv(r,g,b);
                    var cValue;
                    var sValue;
                    switch(check){
                        case "r":
                            cValue = r;
                            sValue = slider;
                            break;
                        case "g":
                            cValue = g;
                            sValue = slider;
                            break;
                        case "b":
                            cValue = b;
                            sValue = slider;
                            break;
                        case "h":
                            cValue = h;
                            sValue = (360 / 255) * slider;
                            break;
                        case "s":
                            cValue = s;
                            sValue = slider / 255;
                            break;
                        case "v":
                            cValue = v;
                            sValue = slider / 255;
                            break;
                    }

                    var b;
                    if(bool){
                        b = cValue >= sValue;
                    }else{
                        b = cValue <= sValue;
                    }
                    
                    if (b && lorem[count] != " ") {
                        line += lorem[count];
                        count++;
                        if (count >= lorem.length) {
                            count = 0;
                        }
                    } else if (b && lorem[count] == " ") {
                        line += "&nbsp;";
                        count++;
                        if (count >= lorem.length) {
                            count = 0;
                        }
                    } else {
                        line += "&nbsp;";
                    }
                }
                t += line + "<br>";
            }

            $("#preview").html(t);
            }
            
        }
        
        // いざファイルを読み込む
        reader.readAsDataURL(file);
    }
      
    
    // <input>でファイルが選択されたときの処理
    const fileInput = document.getElementById('img');
    const handleFileSelect = () => {
        const files = fileInput.files;
        for (let i = 0; i < files.length; i++) {
            previewFile(files[i]);
        }
    }
    fileInput.addEventListener('change', handleFileSelect);


    
});

const createCanvas = function(w, h) {
    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    return ctx;
}

const getFontSize = function(){

    var span = document.createElement('span');
  
    span.style.position = 'absolute';
    span.style.top = '-1000px';
    span.style.left = '-1000px';
    span.style.whiteSpace = 'nowrap';
  
    span.innerHTML = 'a';
  
    span.style.fontSize = "10px";
    span.style.fontFamily =  "'IBM Plex Mono', monospace";
  
    document.body.appendChild(span);
  
    var width = span.clientWidth;
  
    span.parentElement.removeChild(span);

    $("#preview").css({"line-height" : width + "px"});
  
    //return width;
  }

  function rgb2hsv ( i,j,k ) {
	var r = i / 255 ;
	var g = j / 255 ;
	var b = k / 255 ;

	var max = Math.max( r, g, b ) ;
	var min = Math.min( r, g, b ) ;
	var diff = max - min ;

	var h = 0 ;

	switch( min ) {
		case max :
			h = 0 ;
		break ;

		case r :
			h = (60 * ((b - g) / diff)) + 180 ;
		break ;

		case g :
			h = (60 * ((r - b) / diff)) + 300 ;
		break ;

		case b :
			h = (60 * ((g - r) / diff)) + 60 ;
		break ;
	}

	var s = max == 0 ? 0 : diff / max ;
	var v = max ;

	return [ h, s, v ] ;
}

function border(){
    let elements = document.getElementsByName('color');
    let invert = document.getElementsByName('invert');
    let slider = document.getElementById('inputSlideBar');
    let size = document.getElementById('txt1');
    let len = elements.length;
    let sliderValue;
    let checkValue = '';
    var bool = false;
    var sizeValue;

    sliderValue = slider.value;
    sizeValue = Number(size.value);

    for (let i = 0; i < len; i++){
        if (elements.item(i).checked){
            checkValue = elements.item(i).value;
        }
    }
    if(invert.checked){
        bool = true;
    }else{
        bool = false;
    }

    return [checkValue , sliderValue, sizeValue,bool];
}