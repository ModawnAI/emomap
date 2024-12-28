class jsFunc {
    constructor () {
    }
    static window_setup() {
        window_width = document.documentElement.clientWidth;
        window_height = document.documentElement.clientHeight;
        page_width = document.documentElement.scrollWidth;
        page_height = document.documentElement.scrollHeight;
        center_x = window.innerWidth / 2 + "px";
        center_y = window.innerHeight / 2 + "px";
        ratio = window.devicePixelRatio || 1;  
        width_height = "wh:" + screen.width + "x" + screen.height;
        client_width_height = " cwh:" +  document.documentElement.clientWidth +"x" + document.documentElement.clientHeight;
        rw = screen.width * ratio;
        rh = screen.height * ratio;
        ratio_width_height = " r:" + ratio + "</br> rwh:" + rw + "x" + rh;
        env_data_string =  width_height + client_width_height + ratio_width_height + touch_status;
        env_data_string2 =" pw:" + page_width +" ph:" + page_height + " cx:" + center_x + " cy:" +center_y;
    
        screeninfo_msg =`<div><p> 현재 사용하시는 스크린 환경입니다. </br>" ${env_data_string}</br>${env_data_string2} </p></div>`;
      }
      
      static change_font_size(csize) {
        var $content_html = $(".content p, .content span");
        $content_html.each(() => {
          var cur_size = parseInt($(this).css("font-size"));
          cur_size += csize;
          console.log(cur_size);
          $(this).css("font-size", cur_size.toString() + "px");
        });    
    }
    
    // check the string contains html... 
    //static isHTML1=RegExp.prototype.test.bind(/(<([^>]+)>)/i);
    static isHTML(html){
      return /(<([^>]+)>)/i.test(html);
    }

    /** FUNCTIONS **/
    static html2text(html) {
      if(typeof html==="undefined" ||html===null) return '';
      if(Array.isArray(html)){
        var text=[];
        for(let i=0;i<html.length;i++){
          text[i]=jsFunc.html2text(html[i]);
        }
        return text;
      }
      if (jsFunc.isHTML(html)===false) {return html;}; 

      console.log(html)
      if(html.replaceAll===undefined) {
        String.prototype.replaceAll = function(search, replacement) {
          var target = this;return target.replace(new RegExp(search, 'g'), replacement);
        };
      }      
      var html0=html.replaceAll(/<br>/g, ',');  

      //replace <img with alt text

      var container = $("<div>").html(html0);
      container.find("img").replaceWith(function(){
        return this.alt;
      });

      var strAlt = container.html();
      console.log("output: " + strAlt);
      var text = jQuery(strAlt).text();

      /*
      html = html0.replace(/<style([\s\S]*?)<\/style>/gi, '');
      html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
      html = html.replace(/<\/div>/ig, '\n');
      html = html.replace(/<\/li>/ig, '\n');
      html = html.replace(/<li>/ig, '  *  ');
      html = html.replace(/<\/ul>/ig, '\n');
      html = html.replace(/<\/p>/ig, '\n');
      html = html.replace(/<br\s*[\/]?>/gi, "\n");
      var text = html.replace(/<[^>]+>/ig, '');
      */
      return text;
    }
    
    static unique_array(items){ 
      return [...new Set(items)];
    }
    static sort_numeric(numbers){
      numbers.sort(function(a, b) {
        return a - b;
      });
    }
    static compare_values(key, order = 'ascend') {
      return function innerSort(a, b)  {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
          // property doesn't exist on either object
          return 0;
        }
        const varA = (typeof a[key] === 'string')
          ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
          ? b[key].toUpperCase() : b[key];
    
        let comparison = 0;
        if (varA > varB) {
          comparison = 1;
        } else if (varA < varB) {
          comparison = -1;
        }
        return (
          (order === 'descend') ? (comparison * -1) : comparison
        );
      };
    }
    
    static rand(items) {
      // "|" for a kinda "int div"
      return items[items.length * Math.random() | 0];
    };
    static rand_samples(items,niter){
      var data=new Array(0);
      for (let i=0;i<niter;i++) data.push(items[items.length * Math.random() | 0]);
      return data;
    }
    static randidx(len) {
      // "|" for a kinda "int div"
      return len * Math.random() | 0;
    };

    static sort_not_neighboring(samples){
      let i=0;
      if(samples[1]==samples[0]) {
        if(samples.length>2) {const c=samples[2];samples[2]=samples[1];samples[1]=c;}
      }
      if(samples[2]==samples[1]) {
        if(samples.length>2) {const c=samples[3];samples[3]=samples[2];samples[2]=c;}
      }
      for(i=1;i<samples.length-1;i++){
        if(samples[i]==samples[i-1]) { 
          const c=samples[i+1];samples[i+1]=samples[i];samples[i]=c;
        }
      }
    }
    static rand_suffle(items) {
      return items.sort(function() {return 0.5 - Math.random()})[0];
    };
    static shuffleidx2(len) {
      var array=[...Array(len).keys()];
      var m = array.length,
        t, i;
    
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }
    static shuffle(array) {
      let currentIndex = array.length,  randomIndex;
      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    }
    
    static shuffleidx(len) {
        var items=[...Array(len).keys()];
        return items.sort(function() {return 0.5 - Math.random()});
    }
    static shuffle_items(items) {
      var items1=[...Array(items.length).keys()];
      var idx=items1.sort(function() {return 0.5 - Math.random()});
      var nitems=[];
      for(let i=0;i<items.length;i++) nitems.push(items[idx[i]]);
      return nitems;
    }
    static rand_response(niter,nitem,off=0){
      var data=new Array(niter);
      for (let i=0;i<niter;i++) data[i]=(nitem*Math.random() | 0)+off;
      return data;
    }

    static rand_rt(niter,m,s){ // number of samples, mean, stadard deviation  
      return gaussian(niter,m,s);
    }
    static zeros(nitem){
      return new Array(nitem).fill(0);// create zeros
    }
    /* This code uses the Box–Muller transform to give you a normal distribution between 0 and 1 inclusive. 
    It just resamples the values if it's more than 3.6 standard deviations away (less than 0.02% chance).
    */
   static randn_bm(min, max, skew) {
      let u = 0, v = 0;
      while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
      while(v === 0) v = Math.random();
      let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    
      num = num / 10.0 + 0.5; // Translate to 0 -> 1
      if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
      num = Math.pow(num, skew); // Skew
      num *= max - min; // Stretch to fill range
      num += min; // offset to min
      return num;
    }
    
    // returns a gaussian random with the given mean and stdev.
    static gaussian_basis(mean, stdev) {
      var y2;
      var use_last = false;
      return function() {
          var y1;
          if(use_last) {
             y1 = y2;
             use_last = false;
          }
          else {
              var x1, x2, w;
              do {
                   x1 = 2.0 * Math.random() - 1.0;
                   x2 = 2.0 * Math.random() - 1.0;
                   w  = x1 * x1 + x2 * x2;               
              } while( w >= 1.0);
              w = Math.sqrt((-2.0 * Math.log(w))/w);
              y1 = x1 * w;
              y2 = x2 * w;
              use_last = true;
         }
    
         var retval = mean + stdev * y1;
         if(retval > 0) 
             return retval;
         return -retval;
     }
    }
    
    static sequence_fill(nlength,sequence){
      if(!Array.isArray(sequence)) {sequence=[sequence];}
      for(let i=0;i<nlength;i++){ 
        if(sequence.length<=i) sequence.push(sequence[sequence.length-1]);
      }
      return sequence;
    }
    static prepend_string(arr,str){
      arr.forEach((element,i)=> arr[i]=str+element ); //add localpath
      return arr;
    }
    // make a standard gaussian variable.     
    static gaussian(niter, mean,stdev)
    {
      var data=[];
      var standard_normal = gaussian_basis(mean,stdev);
      // make a bunch of standard variates
      for(var i=0; i<niter; i++) {
        val=standard_normal();console.log(val);
          data.push(val);
      }  
      return data;
    }
    static array2d(M,N)
    {
      var arr = new Array(M);            // create an empty array of length `M`
      for (var i = 0; i < M; i++) {
          arr[i] = new Array(N);        // make each element an array
      }
      return arr;
    }
    //create_array(3, 2);
    static create_array(length) {
      var arr = new Array(length || 0),
          i = length;
    
      if (arguments.length > 1) {
          var args = Array.prototype.slice.call(arguments, 1);
          while(i--) arr[length-1 - i] = jsFunc.create_array.apply(this, args);
      }
      return arr;
    }
    
    //arr[i].splice(j, 1);  // assumes i is index of the the nested array and j is the index of the element in the nested array you want to remove.
    static filtered_array(arr, elem) {
      let newArr = [];
      // change code below this line
      for(var i=0; i<arr.length; i++){
        if(arr[i].indexOf(elem) === -1){
          for(var j=0; j<arr[i].length; j++){
            if(arr[i][j] === elem){
              arr.splice((i,j), 1);
            }
          }
          newArr.push(arr[i]);
        }
        else{
          newArr.push(arr[i]);
        }
      }
      // change code above this line
      return newArr;
    }
    
    
    //static Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {})) //Safari problem
    static max_array_index(numArray){
      return numArray.reduce((iMax, x, i, nArray) => x > nArray[iMax] ? i : iMax, 0);
    }
    static min_array_index(numArray){
      return numArray.reduce((iMin, x, i, nArray) => x > nArray[iMin] ?  iMin : i, 0);
    }
   
    static max_array(numArray) {
      return Math.max(...numArray); 
    }
    static min_array(numArray) {
      return Math.min(...numArray); 
    }
    static mean_array(numArray) {
      return (sum_array(numArray)/numArray.length) || 0;
    }
    static sum_array(numArray) {
      var sum = numArray.reduce((a, b) => a + b, 0);
      return sum;
    }
    static sub_array(numArray,cval) {
      var numArray2 = numArray.map( function(value) { 
        return value - cval; 
      } );
      return numArray2;
    }
    static mult_array(numArray,cval) {
      var numArray2 = numArray.map( function(value) { 
        return value * cval; 
      } );
      return numArray2;
    }
    static multadd_array(numArray,a,b) {
      var numArray2 = numArray.map( function(value) { 
        return value * a+b; 
      } );
      return numArray2;
    }
    
    static sub_array_array(numArray1,numArray2) {
      var x=[];
      for(var i = 0;i<numArray1.length;i++)   x.push(numArray1[i] - numArray2[i]);
      return x;
    }

    static typewriter(typingTxt){
      let typingBool = false; 
      let typingIdx=0; 
      typingTxt=typingTxt.split(""); // 한글자씩 자른다. 
      if(typingBool==false){ // 타이핑이 진행되지 않았다면 
        typingBool=true;         
        var tyInt = setInterval(typing,100); // 반복동작 
      } 

      function typing(){ 
        if(typingIdx<typingTxt.length){ // 타이핑될 텍스트 길이만큼 반복 
          $(".typing").append(typingTxt[typingIdx]); // 한글자씩 이어준다. 
          typingIdx++; 
        } else{ 
          clearInterval(tyInt); //끝나면 반복종료 
        } 
      }  
    }
    //static subtractTwoArrays = (arr1, arr2) => arr1.filter( el => !arr2.includes(el) ) //Safari problem..
    /*const arr1 = [1, 2, 3, 4, 8]
    const arr2 = [2, 4, 5, 6, 7]
    const arr1_subtract_arr2 = subtractTwoArrays(arr1, arr2)
    console.log( arr1_subtract_arr2 )  //  [ 1, 3, 8 ]
    */
   static getMargin(p){     
      var style=p.currentStyle || window.getComputedStyle(p);
      butmargy=parseFloat(style.marginTop.slice(0,-2));
      butmargx=parseFloat(style.marginLeft.slice(0,-2));
      //width-=butmargx*2;height-=butmargy*2;
    }
    
    static toSqlDatetime(inputDate) {
      const date = new Date(inputDate)
      const dateWithOffest = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
      return dateWithOffest
          .toISOString()
          .slice(0, 19)
          .replace('T', ' ')
    }
    
    static getLocation(){
      if (navigator.geolocation) {
        // GPS를 지원하면
        navigator.geolocation.getCurrentPosition(
          function(position){
            // position 객체 내부에 timestamp(현재 시간)와 coords 객체
            const time = new Date(position.timestamp);
            console.log(position);
            console.log(`현재시간 : ${time}`);
            console.log(`latitude 위도 : ${position.coords.latitude}`);
            console.log(`longitude 경도 : ${position.coords.longitude}`);
            console.log(`altitude 고도 : ${position.coords.altitude}`);
          },
          function(error){
            console.error(error);
          },
          {
            enableHighAccuracy: false,
            maximumAge: 0,
            timeout: Infinity,
          }
        );
      } else {
        console.log("GPS를 지원하지 않습니다");
      }
    };
    //toSqlDatetime(new Date()) // 2019-08-07 11:58:57
    //toSqlDatetime(new Date('2016-6-23 1:54:16')) // 2016-06-23 01:54:16
    
    static get_filename_extension(pathfilename){
      var filenameextension = pathfilename.replace(/^.*[\\\/]/, '');
      var filename = filenameextension.substring(0, filenameextension.lastIndexOf('.'));
      var ext = filenameextension.split('.').pop();
      if (filename.length==0) return [ext,''];
      else return [filename, ext];
    }
    
    static get_filename(pathfilename){
      if (typeof pathfilename === 'string' || pathfilename instanceof String){
        var filenameextension = pathfilename.replace(/^.*[\\\/]/, '');
        var filename = filenameextension.substring(0, filenameextension.lastIndexOf('.'));
        var ext = filenameextension.split('.').pop();
        if (filename.length==0) return ext;
        else return filename;
      } else return pathfilename;
    }
    

    static get_key_numbers(obj) {return Object.keys(obj).length;}

    static check_data_type (obj){
      let type=0;
      if (typeof obj === 'string' || obj instanceof String) {
          type=1;console.log('string'); 
          if(jsFunc.isHTML(obj)) {
              type=2;console.log('HTML'); 
          }
      }
      else if(Array.isArray(obj)) {
          type=4; console.log('array');
      }
      else if(jsFunc.get_key_numbers(obj)>0) {
          type=3; console.log('structure');
      }
      return type;
    }
    static isNumericNaN(a) { return a!==a;};
    
    static unique(array,sortmode=false) {
      let set=[...new Set(array)];
      if(sortmode) set.sort();
      return set;
    }

    static format_to_sql(obj){
      let new_obj = {};
      for(var item in obj){
        if (obj[item] instanceof Date) {
          new_obj[item] = jsFunc.toSqlDatetime(obj[item]);
        }
        else if(jsFunc.isNumericNaN(obj[item])){
        }
        else if (obj[item] === true || obj[item] === false)
        {
            if(obj[item]) new_obj[item]=1; else new_obj[item]=0; 
        }
        else if (obj[item] === null || obj[item] === undefined) {}
        else new_obj[item]=obj[item];
      }  
      return new_obj
    }
    static array2csv(data) {
      let str='';
      for(var i=0;i<data.length;i++) {
        if(i==data.length-1) str+=data[i];
        else str+=data[i]+',';
      }
      return str;
    }
    static array_to_string(origarray){
      let str='';
      for(let i=0;i<origarray.length;i++){
        var rlt=origarray[i];
        if (isNaN(rlt)) rlt=jsFunc.get_filename(rlt);
        if(i<origarray.length-1) rlt=rlt+','
        str+=rlt;
      }
      return str;
    }
    
    static isAllImage(files){
      let imgflag=true;
      files.forEach(function (item, i) {
        if (/(jpg|gif|png|jpeg)$/i.test(item)) { imgflag=imgflag && true; 
        } else{ imgflag=imgflag && false;
        }
      });
      return imgflag;
    }
    
    static isImage(item){
      if (/(jpg|gif|png|jpeg)$/i.test(item)) return true;
      else return false; 
    }
    static imageSize(src){
      const img = new Image();
      let val=[NaN,NaN];
      img.onload = function() {
        console.log(this.width + 'x' + this.height);
        return [this.width,this.height]; //문제 있을 수 있음.. 
      }
      img.onerror = function() { alert(0); } 
      img.src =src;
    }  


    static isAudio(item){
      if (/(wav|mp3|avi|mp4)$/i.test(item)) return true;
      else return false; 
    }

    static runSerial(tasks) {
      var result = Promise.resolve();
      tasks.forEach(task => {
        result = result.then(() => task());
      });
      return result;
    }
    /*
     * serial executes Promises sequentially.
     * @param {funcs} An array of funcs that return promises.
     * @example
     * const urls = ['/url1', '/url2', '/url3']
     * run_serial_funcs(urls.map(url => () => $.ajax(url)))
     *     .then(console.log.bind(console))
     */
    /* Safari problem
    static run_serial_funcs = funcs => 
      funcs.reduce((promise, func) =>
            promise.then(result => func().then(Array.prototype.concat.bind(result))), Promise.resolve([]))
    */

    static clone(obj) {
      // Handle the 3 simple types, and null or undefined
      if (null == obj || "object" != typeof obj) return obj;  
      // Handle Date
      if (obj instanceof Date) {
          var copy = new Date();
          copy.setTime(obj.getTime());
          return copy;
      }
      // Handle Array
      if (obj instanceof Array) {
          var copy = [];
          for (var i = 0, len = obj.length; i < len; i++) {
              copy[i] = jsFunc.clone(obj[i]);
          }
          return copy;
      }
      // Handle Object
      if (obj instanceof Object) {
          var copy = {};
          for (var attr in obj) {
              if (obj.hasOwnProperty(attr)) copy[attr] = jsFunc.clone(obj[attr]);
          }
          return copy;
      }
      throw new Error("Unable to copy obj! Its type isn't supported.");
    }       
// This is an assign function that copies full descriptors
static completeAssign(target, ...sources) {
  sources.forEach(source => {
    let descriptors = Object.keys(source).reduce((descriptors, key) => {
      descriptors[key] = Object.getOwnPropertyDescriptor(source, key);
      return descriptors;
    }, {});

    // By default, Object.assign copies enumerable Symbols, too
    Object.getOwnPropertySymbols(source).forEach(sym => {
      let descriptor = Object.getOwnPropertyDescriptor(source, sym);
      if (descriptor.enumerable) {
        descriptors[sym] = descriptor;
      }
    });
    Object.defineProperties(target, descriptors);
  });
  return target;
}
//copy = completeAssign({}, obj);
//console.log(copy);
// { foo:1, get bar() { return 2 } }


static load_extern(url){           // load extern javascript
  let scr = $.extend({}, {
      dataType: 'script',
      cache: true,
      url: url
  });
  return $.ajax(scr);
}
static load_jsfile(file, func) {
  jsFunc.load_extern(file).done(func);    // calls a function from an extern javascript file
}
//loadjsfile('somefile.js',()=>              
//myFunc(args)
//);  


static loadScript(src){
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.onload = resolve
    script.onerror = reject
    script.src = src
    document.head.append(script)
  })
}
/*
loadScript('https://code.jquery.com/jquery-3.4.1.min.js')
  .then(() => loadScript('https://code.jquery.com/ui/1.12.1/jquery-ui.min.js'))
  .then(() => {
    // now safe to use jQuery and jQuery UI, which depends on jQuery
  })
  .catch(() => console.error('Something went wrong.'))
*/

// Load a script from given `url`
static loadScriptSingle (url) {
  return new Promise(function(resolve, reject) {
      const script = document.createElement('script');
      script.src = url;
      script.addEventListener('load', function() {
          // The script is loaded completely
          resolve(true);
      });
      document.head.appendChild(script);
  });
};

//        
// Perform all promises in the order
static waterfall(promises) {
  return promises.reduce(
      function(p, c) {
          // Waiting for `p` completed
          return p.then(function() {
              // and then `c`
              return c.then(function(result) {
                  return true;
              });
          });
      },
      // The initial value passed to the reduce method
      Promise.resolve([])
  );
};

// Load an array of scripts in order
static loadScriptsInOrder(arrayOfJs) {
  const promises = arrayOfJs.map(function(url) {
      return loadScriptSingle(url);
  });
  return waterfall(promises);
};

static setFavicon(url) {
  // Find the current favicon element
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
      // Update the new link
      favicon.href = url;
  } else {
      // Create new `link`
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = url;
  
      // Append to the `head` element
      document.head.appendChild(link);
  }
};
//setFavicon('/path/to/user/profile/icon.ico');

static emojiFavicon(emoji) {
  // Create a canvas element
  const canvas = document.createElement('canvas');
  canvas.height = 64;
  canvas.width = 64;

  // Get the canvas context
  const context = canvas.getContext('2d');
  context.font = '64px serif';
  context.fillText(emoji, 0, 64);

  // Get the custom URL
  const url = canvas.toDataURL();

  // Update the favicon
  setFavicon(url);
};
//emojiFavicon('🎉');

static loadCSS(cssfile){ //cssfile='/path/to/js/file.css'
  // Create new link element
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('href', cssfile);

  // Append to the `head` element
  document.head.appendChild(link);
}
static replace_src_imgpath(str,newpath){
  var str1;
  //str1=str.replace(/<img([^>]*)\ssrc=(['"])(?:[^\2\/]*\/)*([^\2]+)\2/gi, `<img$1 src=$2${newpath}/$3$2`);
  str1=str.replace(/\<img([^>]*)\ssrc=('|")(img[^>]*)\2\s([^>]*)\/\>/gi, `<img$1 src=$2${newpath}/$3$2 $4/>`);
  //str1=str.replace(/<img([^>]*)\ssrc=(['"])(\/[^\2*([^\2\s<]+)\2/gi, `<img$1 src=$2${newpath}/$3$2`);
  return str1;
}

static replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

static imageExists1(image_url){
  var http = new XMLHttpRequest();
  http.open('HEAD', image_url, false);
  http.send();
  return http.status != 404;
}

static existImage(url,callback_true,callback_false) {
  var tester = new Image();
  tester.addEventListener('load', callback_true);
  tester.addEventListener('error', callback_false);
  tester.src = url;
}
//testImage("http://foo.com/bar.jpg");


static read_csv1(filename){
  $.ajax({
    url: filename,
    dataType: 'text',
  }).done(jsFunc.successFunction);
}

static successFunction(data) {
  var allRows = data.split(/\r?\n|\r/);
  var table = '<table>';
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    if (singleRow === 0) {
      table += '<thead>';
      table += '<tr>';
    } else {
      table += '<tr>';
    }
    var rowCells = allRows[singleRow].split(',');
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (singleRow === 0) {
        table += '<th>';
        table += rowCells[rowCell];
        table += '</th>';
      } else {
        table += '<td>';
        table += rowCells[rowCell];
        table += '</td>';
      }
    }
    if (singleRow === 0) {
      table += '</tr>';
      table += '</thead>';
      table += '<tbody>';
    } else {
      table += '</tr>';
    }
  } 
  table += '</tbody>';
  table += '</table>';
  $('body').append(table);
}

static read_csv(filename){
  $(document).ready(function() {
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        success: function(data) {
          return jsFunc.processData(data);
        }
    });
  });
}
static read_csv_function(filename,func){
  $(document).ready(function() {
    $.ajax({
        type: "GET",
        url: filename,
        dataType: "text",
        success: func,
        error : function(error) {
          console.log("No CSV!");
          return null;
        },
    });
  });
}
static  process_data(csv) {
  var data = $.csv.toObjects(csv);
  var allRows = data.split(/\r?\n|\r/);
}
static  processData(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var lines = [];
  for (var i=0; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      lines.push(data[0]);
  }
  alert(lines);
}

static  processData1(allText) {
  var allTextLines = allText.split(/\r\n|\n/);
  var headers = allTextLines[0].split(',');
  var lines = [];
  for (var i=1; i<allTextLines.length; i++) {
      var data = allTextLines[i].split(',');
      if (data.length == headers.length) {
          var tarr = [];
          for (var j=0; j<headers.length; j++) {
              tarr.push(headers[j]+":"+data[j]);
          }
          lines.push(tarr);
      }
  }
  alert(lines);
}
// !!!! This code is experimental...don't blame me if your performance tanks.
/*
const box = document.getElementById("box");

function resizeBox() {
  calcTextWidth();
  calcTextSize();
}
resizeBox();
new ResizeObserver(resizeBox).observe(box);
*/
static calcTextWidth(id="text") {
  const text = document.getElementById(id);
  const parentContainerWidth = text.parentNode.clientWidth;

  const currentTextWidth = text.scrollWidth;
  const currentFontStretch = parseInt(window.getComputedStyle(text).fontStretch);
    
  console.log('parent: ' + parentContainerWidth + ' textwidth: ' + currentTextWidth + ' stretch: ' +currentFontStretch);
  const newValue =  Math.round(Math.min(Math.max(300, (parentContainerWidth / currentTextWidth) * currentFontStretch), 500));
  text.style.setProperty('--fontStretch', newValue + '%');
  console.log('parent: ' + parentContainerWidth + ' textwidth: ' + currentTextWidth + ' stretch: ' +currentFontStretch +' newValue:'+newValue);
}

static calcTextSize(id) {
  const text = document.getElementById(id);
  const parentContainerWidth = text.parentNode.clientWidth;
  const currentTextWidth = text.scrollWidth;
  const currentFontSize = parseInt(window.getComputedStyle(text).fontSize);
  const newValue = Math.round(Math.min(Math.max(16, (parentContainerWidth / currentTextWidth) * currentFontSize), 500));
  text.style.setProperty('--fontSize', newValue +'px');
  console.log('currentFontsize: ' + currentFontSize + ' newFontsize: ' + newValue );

}
static adjustHeights(elem) {
  var fontstep = 2;
  if ($(elem).height()>$(elem).parent().height() || $(elem).width()>$(elem).parent().width()) {
  $(elem).css('font-size',(($(elem).css('font-size').substr(0,2)-fontstep)) + 'px').css('line-height',(($(elem).css('font-size').substr(0,2))) + 'px');
  adjustHeights(elem);
  }
}

static read_with_ajax(url,fun,holder){//url,function,just a placeholder
  holder=new XMLHttpRequest;
  holder.open('GET',url);
  holder.onload=fun;
  holder.send()
  }

  static alertTxt(){
      //alert(this.response)
      data = $.csv.toArrays(this.response) //global value : data
      //console.log(data)
      alert(data)
  }

//var csv is the CSV file with headers
static csvJSON(csvText) {
  let lines = []; const result = [];
  if(typeof csvText=="undefined" || csvText==null) return []
  const linesArray = csvText.split('\n');
  // for trimming and deleting extra space 
  linesArray.forEach((e) => {
      const row = e.replace(/[\s]+[,]+|[,]+[\s]+/g, ',').trim();
      if (row.length>0) lines.push(row);
  });
  const headers = lines[0].split(",");  
  for (let i = 1; i < lines.length; i++) {  
      const obj = {};
      const currentline = lines[i].split(",");  
      for (let j = 0; j < headers.length; j++) obj[headers[j]] = currentline[j];
      result.push(obj);
  }
  //return result; //JavaScript object
  // return JSON.stringify(result); //JSON
  return result;
}
// For Reading CSV File
static readCSV(event) {
  const reader = new FileReader();
  reader.readAsText(event.files[0]);
  reader.onload = () => {
      const text = reader.result;
      const csvToJson = this.csvJSON(text);
      console.log(csvToJson);
  };
}
}

/*
function calculate_font_sizes()
{
  fitTextInBox('login-h1');
  fitTextInBox('subtittle');
}
calculate_font_sizes();
window.addEventListener('resize', calculate_font_sizes);
*/

/************************************************************************************************************
	(C) www.dhtmlgoodies.com, October 2005
	
	This is a script from www.dhtmlgoodies.com. You will find this and a lot of other scripts at our website.	
	
	Terms of use:
	You are free to use this script as long as the copyright message is kept intact. However, you may not
	redistribute, sell or repost it without our permission.
	
	Thank you!
	
	www.dhtmlgoodies.com
	Alf Magne Kalleland
	
	************************************************************************************************************/	
class jsFitText {
  constructor (boxID,maxHeight) {  
    this.fitTextInBox_maxWidth = false;
    this.fitTextInBox_maxHeight = false;
    this.fitTextInBox_currentWidth = false;
    this.fitTextInBox_currentBox = false;
    this.fitTextInBox_currentTextObj = false;
    this.fitTextInBox(boxID,maxHeight);
  }
  fitTextInBox(boxID,maxHeight)
  {
    if(maxHeight) this.fitTextInBox_maxHeight=maxHeight; else this.fitTextInBox_maxHeight = 10000;
    var obj = document.getElementById(boxID);
    this.fitTextInBox_maxWidth = obj.offsetWidth;	
    this.fitTextInBox_currentBox = obj;
    this.fitTextInBox_currentTextObj = obj.getElementsByTagName('SPAN')[0];
    if(this.fitTextInBox_currentTextObj===undefined || this.fitTextInBox_currentTextObj===null) return;
    this.fitTextInBox_currentTextObj.style.fontSize = '1px';
    this.fitTextInBox_currentWidth = this.fitTextInBox_currentTextObj.offsetWidth;
    this.fitTextInBoxAutoFit();    
  }	

  fitTextInBoxAutoFit()
  {
    var tmpFontSize = this.fitTextInBox_currentTextObj.style.fontSize.replace('px','')/1;
    this.fitTextInBox_currentTextObj.style.fontSize = tmpFontSize + 1 + 'px';
    var tmpWidth = this.fitTextInBox_currentTextObj.offsetWidth;
    var tmpHeight = this.fitTextInBox_currentTextObj.offsetHeight;
    if(tmpWidth>=this.fitTextInBox_currentWidth && tmpWidth<this.fitTextInBox_maxWidth && tmpHeight<this.fitTextInBox_maxHeight && tmpFontSize<300){		
      this.fitTextInBox_currentWidth = this.fitTextInBox_currentTextObj.offsetWidth;	
      this.fitTextInBoxAutoFit();
    }else{
      this.fitTextInBox_currentTextObj.style.fontSize = this.fitTextInBox_currentTextObj.style.fontSize.replace('px','')/1 - 1 + 'px';
    }		
  }	
}
String.prototype.format = function() {
  var formatted = this;
  for (var i = 0; i < arguments.length; i++) {
      var regexp = new RegExp('\\{'+i+'\\}', 'gi');
      formatted = formatted.replace(regexp, arguments[i]);
  }
  return formatted;
};