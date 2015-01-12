/*! pace 0.5.6 */
(function(){var a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W=[].slice,X={}.hasOwnProperty,Y=function(a,b){function c(){this.constructor=a}for(var d in b)X.call(b,d)&&(a[d]=b[d]);return c.prototype=b.prototype,a.prototype=new c,a.__super__=b.prototype,a},Z=[].indexOf||function(a){for(var b=0,c=this.length;c>b;b++)if(b in this&&this[b]===a)return b;return-1};for(t={catchupTime:500,initialRate:.03,minTime:500,ghostTime:500,maxProgressPerFrame:10,easeFactor:1.25,startOnPageLoad:!0,restartOnPushState:!0,restartOnRequestAfter:500,target:"body",elements:{checkInterval:100,selectors:["body"]},eventLag:{minSamples:10,sampleCount:3,lagThreshold:3},ajax:{trackMethods:["GET"],trackWebSockets:!0,ignoreURLs:[]}},B=function(){var a;return null!=(a="undefined"!=typeof performance&&null!==performance&&"function"==typeof performance.now?performance.now():void 0)?a:+new Date},D=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame,s=window.cancelAnimationFrame||window.mozCancelAnimationFrame,null==D&&(D=function(a){return setTimeout(a,50)},s=function(a){return clearTimeout(a)}),F=function(a){var b,c;return b=B(),(c=function(){var d;return d=B()-b,d>=33?(b=B(),a(d,function(){return D(c)})):setTimeout(c,33-d)})()},E=function(){var a,b,c;return c=arguments[0],b=arguments[1],a=3<=arguments.length?W.call(arguments,2):[],"function"==typeof c[b]?c[b].apply(c,a):c[b]},u=function(){var a,b,c,d,e,f,g;for(b=arguments[0],d=2<=arguments.length?W.call(arguments,1):[],f=0,g=d.length;g>f;f++)if(c=d[f])for(a in c)X.call(c,a)&&(e=c[a],null!=b[a]&&"object"==typeof b[a]&&null!=e&&"object"==typeof e?u(b[a],e):b[a]=e);return b},p=function(a){var b,c,d,e,f;for(c=b=0,e=0,f=a.length;f>e;e++)d=a[e],c+=Math.abs(d),b++;return c/b},w=function(a,b){var c,d,e;if(null==a&&(a="options"),null==b&&(b=!0),e=document.querySelector("[data-pace-"+a+"]")){if(c=e.getAttribute("data-pace-"+a),!b)return c;try{return JSON.parse(c)}catch(f){return d=f,"undefined"!=typeof console&&null!==console?console.error("Error parsing inline pace options",d):void 0}}},g=function(){function a(){}return a.prototype.on=function(a,b,c,d){var e;return null==d&&(d=!1),null==this.bindings&&(this.bindings={}),null==(e=this.bindings)[a]&&(e[a]=[]),this.bindings[a].push({handler:b,ctx:c,once:d})},a.prototype.once=function(a,b,c){return this.on(a,b,c,!0)},a.prototype.off=function(a,b){var c,d,e;if(null!=(null!=(d=this.bindings)?d[a]:void 0)){if(null==b)return delete this.bindings[a];for(c=0,e=[];c<this.bindings[a].length;)e.push(this.bindings[a][c].handler===b?this.bindings[a].splice(c,1):c++);return e}},a.prototype.trigger=function(){var a,b,c,d,e,f,g,h,i;if(c=arguments[0],a=2<=arguments.length?W.call(arguments,1):[],null!=(g=this.bindings)?g[c]:void 0){for(e=0,i=[];e<this.bindings[c].length;)h=this.bindings[c][e],d=h.handler,b=h.ctx,f=h.once,d.apply(null!=b?b:this,a),i.push(f?this.bindings[c].splice(e,1):e++);return i}},a}(),null==window.Pace&&(window.Pace={}),u(Pace,g.prototype),C=Pace.options=u({},t,window.paceOptions,w()),T=["ajax","document","eventLag","elements"],P=0,R=T.length;R>P;P++)J=T[P],C[J]===!0&&(C[J]=t[J]);i=function(a){function b(){return U=b.__super__.constructor.apply(this,arguments)}return Y(b,a),b}(Error),b=function(){function a(){this.progress=0}return a.prototype.getElement=function(){var a;if(null==this.el){if(a=document.querySelector(C.target),!a)throw new i;this.el=document.createElement("div"),this.el.className="pace pace-active",document.body.className=document.body.className.replace(/pace-done/g,""),document.body.className+=" pace-running",this.el.innerHTML='<div class="pace-progress">\n  <div class="pace-progress-inner"></div>\n</div>\n<div class="pace-activity"></div>',null!=a.firstChild?a.insertBefore(this.el,a.firstChild):a.appendChild(this.el)}return this.el},a.prototype.finish=function(){var a;return a=this.getElement(),a.className=a.className.replace("pace-active",""),a.className+=" pace-inactive",document.body.className=document.body.className.replace("pace-running",""),document.body.className+=" pace-done"},a.prototype.update=function(a){return this.progress=a,this.render()},a.prototype.destroy=function(){try{this.getElement().parentNode.removeChild(this.getElement())}catch(a){i=a}return this.el=void 0},a.prototype.render=function(){var a,b;return null==document.querySelector(C.target)?!1:(a=this.getElement(),a.children[0].style.width=""+this.progress+"%",(!this.lastRenderedProgress||this.lastRenderedProgress|0!==this.progress|0)&&(a.children[0].setAttribute("data-progress-text",""+(0|this.progress)+"%"),this.progress>=100?b="99":(b=this.progress<10?"0":"",b+=0|this.progress),a.children[0].setAttribute("data-progress",""+b)),this.lastRenderedProgress=this.progress)},a.prototype.done=function(){return this.progress>=100},a}(),h=function(){function a(){this.bindings={}}return a.prototype.trigger=function(a,b){var c,d,e,f,g;if(null!=this.bindings[a]){for(f=this.bindings[a],g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(c.call(this,b));return g}},a.prototype.on=function(a,b){var c;return null==(c=this.bindings)[a]&&(c[a]=[]),this.bindings[a].push(b)},a}(),O=window.XMLHttpRequest,N=window.XDomainRequest,M=window.WebSocket,v=function(a,b){var c,d,e,f;f=[];for(d in b.prototype)try{e=b.prototype[d],f.push(null==a[d]&&"function"!=typeof e?a[d]=e:void 0)}catch(g){c=g}return f},z=[],Pace.ignore=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?W.call(arguments,1):[],z.unshift("ignore"),c=b.apply(null,a),z.shift(),c},Pace.track=function(){var a,b,c;return b=arguments[0],a=2<=arguments.length?W.call(arguments,1):[],z.unshift("track"),c=b.apply(null,a),z.shift(),c},I=function(a){var b;if(null==a&&(a="GET"),"track"===z[0])return"force";if(!z.length&&C.ajax){if("socket"===a&&C.ajax.trackWebSockets)return!0;if(b=a.toUpperCase(),Z.call(C.ajax.trackMethods,b)>=0)return!0}return!1},j=function(a){function b(){var a,c=this;b.__super__.constructor.apply(this,arguments),a=function(a){var b;return b=a.open,a.open=function(d,e){return I(d)&&c.trigger("request",{type:d,url:e,request:a}),b.apply(a,arguments)}},window.XMLHttpRequest=function(b){var c;return c=new O(b),a(c),c};try{v(window.XMLHttpRequest,O)}catch(d){}if(null!=N){window.XDomainRequest=function(){var b;return b=new N,a(b),b};try{v(window.XDomainRequest,N)}catch(d){}}if(null!=M&&C.ajax.trackWebSockets){window.WebSocket=function(a,b){var d;return d=null!=b?new M(a,b):new M(a),I("socket")&&c.trigger("request",{type:"socket",url:a,protocols:b,request:d}),d};try{v(window.WebSocket,M)}catch(d){}}}return Y(b,a),b}(h),Q=null,x=function(){return null==Q&&(Q=new j),Q},H=function(a){var b,c,d,e;for(e=C.ajax.ignoreURLs,c=0,d=e.length;d>c;c++)if(b=e[c],"string"==typeof b){if(-1!==a.indexOf(b))return!0}else if(b.test(a))return!0;return!1},x().on("request",function(b){var c,d,e,f,g;return f=b.type,e=b.request,g=b.url,H(g)?void 0:Pace.running||C.restartOnRequestAfter===!1&&"force"!==I(f)?void 0:(d=arguments,c=C.restartOnRequestAfter||0,"boolean"==typeof c&&(c=0),setTimeout(function(){var b,c,g,h,i,j;if(b="socket"===f?e.readyState<2:0<(h=e.readyState)&&4>h){for(Pace.restart(),i=Pace.sources,j=[],c=0,g=i.length;g>c;c++){if(J=i[c],J instanceof a){J.watch.apply(J,d);break}j.push(void 0)}return j}},c))}),a=function(){function a(){var a=this;this.elements=[],x().on("request",function(){return a.watch.apply(a,arguments)})}return a.prototype.watch=function(a){var b,c,d,e;return d=a.type,b=a.request,e=a.url,H(e)?void 0:(c="socket"===d?new m(b):new n(b),this.elements.push(c))},a}(),n=function(){function a(a){var b,c,d,e,f,g,h=this;if(this.progress=0,null!=window.ProgressEvent)for(c=null,a.addEventListener("progress",function(a){return h.progress=a.lengthComputable?100*a.loaded/a.total:h.progress+(100-h.progress)/2}),g=["load","abort","timeout","error"],d=0,e=g.length;e>d;d++)b=g[d],a.addEventListener(b,function(){return h.progress=100});else f=a.onreadystatechange,a.onreadystatechange=function(){var b;return 0===(b=a.readyState)||4===b?h.progress=100:3===a.readyState&&(h.progress=50),"function"==typeof f?f.apply(null,arguments):void 0}}return a}(),m=function(){function a(a){var b,c,d,e,f=this;for(this.progress=0,e=["error","open"],c=0,d=e.length;d>c;c++)b=e[c],a.addEventListener(b,function(){return f.progress=100})}return a}(),d=function(){function a(a){var b,c,d,f;for(null==a&&(a={}),this.elements=[],null==a.selectors&&(a.selectors=[]),f=a.selectors,c=0,d=f.length;d>c;c++)b=f[c],this.elements.push(new e(b))}return a}(),e=function(){function a(a){this.selector=a,this.progress=0,this.check()}return a.prototype.check=function(){var a=this;return document.querySelector(this.selector)?this.done():setTimeout(function(){return a.check()},C.elements.checkInterval)},a.prototype.done=function(){return this.progress=100},a}(),c=function(){function a(){var a,b,c=this;this.progress=null!=(b=this.states[document.readyState])?b:100,a=document.onreadystatechange,document.onreadystatechange=function(){return null!=c.states[document.readyState]&&(c.progress=c.states[document.readyState]),"function"==typeof a?a.apply(null,arguments):void 0}}return a.prototype.states={loading:0,interactive:50,complete:100},a}(),f=function(){function a(){var a,b,c,d,e,f=this;this.progress=0,a=0,e=[],d=0,c=B(),b=setInterval(function(){var g;return g=B()-c-50,c=B(),e.push(g),e.length>C.eventLag.sampleCount&&e.shift(),a=p(e),++d>=C.eventLag.minSamples&&a<C.eventLag.lagThreshold?(f.progress=100,clearInterval(b)):f.progress=100*(3/(a+3))},50)}return a}(),l=function(){function a(a){this.source=a,this.last=this.sinceLastUpdate=0,this.rate=C.initialRate,this.catchup=0,this.progress=this.lastProgress=0,null!=this.source&&(this.progress=E(this.source,"progress"))}return a.prototype.tick=function(a,b){var c;return null==b&&(b=E(this.source,"progress")),b>=100&&(this.done=!0),b===this.last?this.sinceLastUpdate+=a:(this.sinceLastUpdate&&(this.rate=(b-this.last)/this.sinceLastUpdate),this.catchup=(b-this.progress)/C.catchupTime,this.sinceLastUpdate=0,this.last=b),b>this.progress&&(this.progress+=this.catchup*a),c=1-Math.pow(this.progress/100,C.easeFactor),this.progress+=c*this.rate*a,this.progress=Math.min(this.lastProgress+C.maxProgressPerFrame,this.progress),this.progress=Math.max(0,this.progress),this.progress=Math.min(100,this.progress),this.lastProgress=this.progress,this.progress},a}(),K=null,G=null,q=null,L=null,o=null,r=null,Pace.running=!1,y=function(){return C.restartOnPushState?Pace.restart():void 0},null!=window.history.pushState&&(S=window.history.pushState,window.history.pushState=function(){return y(),S.apply(window.history,arguments)}),null!=window.history.replaceState&&(V=window.history.replaceState,window.history.replaceState=function(){return y(),V.apply(window.history,arguments)}),k={ajax:a,elements:d,document:c,eventLag:f},(A=function(){var a,c,d,e,f,g,h,i;for(Pace.sources=K=[],g=["ajax","elements","document","eventLag"],c=0,e=g.length;e>c;c++)a=g[c],C[a]!==!1&&K.push(new k[a](C[a]));for(i=null!=(h=C.extraSources)?h:[],d=0,f=i.length;f>d;d++)J=i[d],K.push(new J(C));return Pace.bar=q=new b,G=[],L=new l})(),Pace.stop=function(){return Pace.trigger("stop"),Pace.running=!1,q.destroy(),r=!0,null!=o&&("function"==typeof s&&s(o),o=null),A()},Pace.restart=function(){return Pace.trigger("restart"),Pace.stop(),Pace.start()},Pace.go=function(){var a;return Pace.running=!0,q.render(),a=B(),r=!1,o=F(function(b,c){var d,e,f,g,h,i,j,k,m,n,o,p,s,t,u,v;for(k=100-q.progress,e=o=0,f=!0,i=p=0,t=K.length;t>p;i=++p)for(J=K[i],n=null!=G[i]?G[i]:G[i]=[],h=null!=(v=J.elements)?v:[J],j=s=0,u=h.length;u>s;j=++s)g=h[j],m=null!=n[j]?n[j]:n[j]=new l(g),f&=m.done,m.done||(e++,o+=m.tick(b));return d=o/e,q.update(L.tick(b,d)),q.done()||f||r?(q.update(100),Pace.trigger("done"),setTimeout(function(){return q.finish(),Pace.running=!1,Pace.trigger("hide")},Math.max(C.ghostTime,Math.max(C.minTime-(B()-a),0)))):c()})},Pace.start=function(a){u(C,a),Pace.running=!0;try{q.render()}catch(b){i=b}return document.querySelector(".pace")?(Pace.trigger("start"),Pace.go()):setTimeout(Pace.start,50)},"function"==typeof define&&define.amd?define(function(){return Pace}):"object"==typeof exports?module.exports=Pace:C.startOnPageLoad&&Pace.start()}).call(this);

/*global jQuery */
/*jshint browser:true */
/*!
* FitVids 1.1
*
* Copyright 2013, Chris Coyier - http://css-tricks.com + Dave Rupert - http://daverupert.com
* Credit to Thierry Koblentz - http://www.alistapart.com/articles/creating-intrinsic-ratios-for-video/
* Released under the WTFPL license - http://sam.zoy.org/wtfpl/
*
*/

(function( $ ){

  "use strict";

  $.fn.fitVids = function( options ) {
    var settings = {
      customSelector: null,
      ignore: null
    };

    if(!document.getElementById('fit-vids-style')) {
      // appendStyles: https://github.com/toddmotto/fluidvids/blob/master/dist/fluidvids.js
      var head = document.head || document.getElementsByTagName('head')[0];
      var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
      var div = document.createElement('div');
      div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
      head.appendChild(div.childNodes[1]);
    }

    if ( options ) {
      $.extend( settings, options );
    }

    return this.each(function(){
      var selectors = [
        "iframe[src*='player.vimeo.com']",
        "iframe[src*='youtube.com']",
        "iframe[src*='youtube-nocookie.com']",
        "iframe[src*='kickstarter.com'][src*='video.html']",
        "object",
        "embed"
      ];

      if (settings.customSelector) {
        selectors.push(settings.customSelector);
      }

      var ignoreList = '.fitvidsignore';

      if(settings.ignore) {
        ignoreList = ignoreList + ', ' + settings.ignore;
      }

      var $allVideos = $(this).find(selectors.join(','));
      $allVideos = $allVideos.not("object object"); // SwfObj conflict patch
      $allVideos = $allVideos.not(ignoreList); // Disable FitVids on this video.

      $allVideos.each(function(){
        var $this = $(this);
        if($this.parents(ignoreList).length > 0) {
          return; // Disable FitVids on this video.
        }
        if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) { return; }
        if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width'))))
        {
          $this.attr('height', 9);
          $this.attr('width', 16);
        }
        var height = ( this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10))) ) ? parseInt($this.attr('height'), 10) : $this.height(),
            width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
            aspectRatio = height / width;
        if(!$this.attr('id')){
          var videoID = 'fitvid' + Math.floor(Math.random()*999999);
          $this.attr('id', videoID);
        }
        $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100)+"%");
        $this.removeAttr('height').removeAttr('width');
      });
    });
  };
// Works with either jQuery or Zepto
})( window.jQuery || window.Zepto );

/**
 * photoset-grid - v1.0.1
 * 2014-04-08
 * jQuery plugin to arrange images into a flexible grid
 * http://stylehatch.github.com/photoset-grid/
 *
 * Copyright 2014 Jonathan Moore - Style Hatch
 */
!function(a,b,c,d){"use strict";function e(b,c){this.element=b,this.options=a.extend({},g,c),this._defaults=g,this._name=f,this.init()}var f="photosetGrid",g={width:"100%",gutter:"0px",highresLinks:!1,lowresWidth:500,rel:"",onInit:function(){},onComplete:function(){}};e.prototype={init:function(){this.options.onInit(),this._setupRows(this.element,this.options),this._setupColumns(this.element,this.options)},_callback:function(a){this.options.onComplete(a)},_setupRows:function(b,c){if(c.layout)this.layout=c.layout;else if(a(b).attr("data-layout"))this.layout=a(b).attr("data-layout");else{for(var d="",e=1,f=0;f<a(b).find("img").length;f++)d+=e.toString();this.layout=d}this.rows=this.layout.split("");for(var g in this.rows)this.rows[g]=parseInt(this.rows[g],10);var h=a(b).find("img"),i=0;a.each(this.rows,function(a,b){var c=i,d=i+b;h.slice(c,d).wrapAll('<div class="photoset-row cols-'+b+'"></div>'),i=d}),a(b).find(".photoset-row:not(:last-child)").css({"margin-bottom":c.gutter})},_setupColumns:function(c,d){var e=this,f=function(e){function f(){var b=a(c).width().toString();b!==a(c).attr("data-width")&&(g.each(function(){var b=a(this).find("img:eq(0)");a(this).find("img").each(function(){var c=a(this);c.attr("height")<b.attr("height")&&(b=a(this)),parseInt(c.css("width"),10)>d.lowresWidth&&c.attr("data-highres")&&c.attr("src",c.attr("data-highres"))});var c=b.attr("height")*parseInt(b.css("width"),10)/b.attr("width"),e=Math.floor(.025*c);a(this).height(c-e),a(this).find("img").each(function(){var b=a(this).attr("height")*parseInt(a(this).css("width"),10)/a(this).attr("width"),d=.5*(c-b)+"px";a(this).css({"margin-top":d})})}),a(c).attr("data-width",b))}var g=a(c).find(".photoset-row"),h=a(c).find("img");d.highresLinks?(h.each(function(){var b;b=a(this).attr(a(this).attr("data-highres")?"data-highres":"src"),a(this).wrapAll('<a href="'+b+'" class="photoset-cell highres-link" />')}),d.rel&&h.parent().attr("rel",d.rel)):h.each(function(){a(this).wrapAll('<div class="photoset-cell" />')});var i=a(c).find(".photoset-cell"),j=a(c).find(".cols-1 .photoset-cell"),k=a(c).find(".cols-2 .photoset-cell"),l=a(c).find(".cols-3 .photoset-cell"),m=a(c).find(".cols-4 .photoset-cell"),n=a(c).find(".cols-5 .photoset-cell");a(c).css({width:d.width}),g.css({clear:"left",display:"block",overflow:"hidden"}),i.css({"float":"left",display:"block","line-height":"0","-webkit-box-sizing":"border-box","-moz-box-sizing":"border-box","box-sizing":"border-box"}),h.css({width:"100%",height:"auto"}),e&&h.each(function(){a(this).attr("height",a(this).height()),a(this).attr("width",a(this).width())}),j.css({width:"100%"}),k.css({width:"50%"}),l.css({width:"33.3%"}),m.css({width:"25%"}),n.css({width:"20%"});var o=parseInt(d.gutter,10);a(c).find(".photoset-cell:not(:last-child)").css({"padding-right":o/2+"px"}),a(c).find(".photoset-cell:not(:first-child)").css({"padding-left":o/2+"px"}),f(),a(b).on("resize",function(){f()})},g=!0,h=!0;a(c).find("img").each(function(){h&=!!a(this).attr("height")&!!a(this).attr("width")}),g=!h,g?a(c).imagesLoaded(function(){f(g),e._callback(c)}):(f(g),e._callback(c))}},a.fn[f]=function(b){return this.each(function(){a.data(this,"plugin_"+f)||a.data(this,"plugin_"+f,new e(this,b))})};var h="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";a.fn.imagesLoaded=function(b){function c(){var c=a(m),d=a(n);i&&(n.length?i.reject(k,c,d):i.resolve(k)),a.isFunction(b)&&b.call(g,k,c,d)}function e(a){f(a.target,"error"===a.type)}function f(b,d){b.src!==h&&-1===a.inArray(b,l)&&(l.push(b),d?n.push(b):m.push(b),a.data(b,"imagesLoaded",{isBroken:d,src:b.src}),j&&i.notifyWith(a(b),[d,k,a(m),a(n)]),k.length===l.length&&(setTimeout(c),k.unbind(".imagesLoaded",e)))}var g=this,i=a.isFunction(a.Deferred)?a.Deferred():0,j=a.isFunction(i.notify),k=g.find("img").add(g.filter("img")),l=[],m=[],n=[];return a.isPlainObject(b)&&a.each(b,function(a,c){"callback"===a?b=c:i&&i[a](c)}),k.length?k.bind("load.imagesLoaded error.imagesLoaded",e).each(function(b,c){var e=c.src,g=a.data(c,"imagesLoaded");return g&&g.src===e?void f(c,g.isBroken):c.complete&&c.naturalWidth!==d?void f(c,0===c.naturalWidth||0===c.naturalHeight):void((c.readyState||c.complete)&&(c.src=h,c.src=e))}):c(),i?i.promise(g):g};var i,j,k,l=a.event,m={_:0},n=0;i=l.special.throttledresize={setup:function(){a(this).on("resize",i.handler)},teardown:function(){a(this).off("resize",i.handler)},handler:function(b,c){var d=this,e=arguments;j=!0,k||(setInterval(function(){n++,(n>i.threshold&&j||c)&&(b.type="throttledresize",l.dispatch.apply(d,e),j=!1,n=0),n>9&&(a(m).stop(),k=!1,n=0)},30),k=!0)},threshold:0}}(jQuery,window,document);


///////// BOOTSTRAP MODAL  ///

!function ($) {

    "use strict"; // jshint ;_;

    /* MODAL MANAGER CLASS DEFINITION
    * ====================== */

    var ModalManager = function (element, options) {
        this.init(element, options);
    };

    ModalManager.prototype = {

        constructor: ModalManager,

        init: function (element, options) {
            this.$element = $(element);
            this.options = $.extend({}, $.fn.modalmanager.defaults, this.$element.data(), typeof options == 'object' && options);
            this.stack = [];
            this.backdropCount = 0;

            if (this.options.resize) {
                var resizeTimeout,
                    that = this;

                $(window).on('resize.modal', function(){
                    resizeTimeout && clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(function(){
                        for (var i = 0; i < that.stack.length; i++){
                            that.stack[i].isShown && that.stack[i].layout();
                        }
                    }, 10);
                });
            }
        },

        createModal: function (element, options) {
            $(element).modal($.extend({ manager: this }, options));
        },

        appendModal: function (modal) {
            this.stack.push(modal);

            var that = this;

            modal.$element.on('show.modalmanager', targetIsSelf(function (e) {

                var showModal = function(){
                    modal.isShown = true;

                    var transition = $.support.transition && modal.$element.hasClass('fade');

                    that.$element
                        .toggleClass('modal-open', that.hasOpenModal())
                        .toggleClass('page-overflow', $(window).height() < that.$element.height());

                    modal.$parent = modal.$element.parent();

                    modal.$container = that.createContainer(modal);

                    modal.$element.appendTo(modal.$container);

                    that.backdrop(modal, function () {
                        modal.$element.show();

                        if (transition) {       
                            //modal.$element[0].style.display = 'run-in';       
                            modal.$element[0].offsetWidth;
                            //modal.$element.one($.support.transition.end, function () { modal.$element[0].style.display = 'block' });  
                        }
                        
                        modal.layout();

                        modal.$element
                            .addClass('in')
                            .attr('aria-hidden', false);

                        var complete = function () {
                            that.setFocus();
                            modal.$element.trigger('shown');
                        };

                        transition ?
                            modal.$element.one($.support.transition.end, complete) :
                            complete();
                    });
                };

                modal.options.replace ?
                    that.replace(showModal) :
                    showModal();
            }));

            modal.$element.on('hidden.modalmanager', targetIsSelf(function (e) {
                that.backdrop(modal);
                // handle the case when a modal may have been removed from the dom before this callback executes
                if (!modal.$element.parent().length) {
                    that.destroyModal(modal);
                } else if (modal.$backdrop){
                    var transition = $.support.transition && modal.$element.hasClass('fade');

                    // trigger a relayout due to firebox's buggy transition end event 
                    if (transition) { modal.$element[0].offsetWidth; }
                    $.support.transition && modal.$element.hasClass('fade') ?
                        modal.$backdrop.one($.support.transition.end, function () { modal.destroy(); }) :
                        modal.destroy();
                } else {
                    modal.destroy();
                }

            }));

            modal.$element.on('destroyed.modalmanager', targetIsSelf(function (e) {
                that.destroyModal(modal);
            }));
        },

        getOpenModals: function () {
            var openModals = [];
            for (var i = 0; i < this.stack.length; i++){
                if (this.stack[i].isShown) openModals.push(this.stack[i]);
            }

            return openModals;
        },

        hasOpenModal: function () {
            return this.getOpenModals().length > 0;
        },

        setFocus: function () {
            var topModal;

            for (var i = 0; i < this.stack.length; i++){
                if (this.stack[i].isShown) topModal = this.stack[i];
            }

            if (!topModal) return;

            topModal.focus();
        },

        destroyModal: function (modal) {
            modal.$element.off('.modalmanager');
            if (modal.$backdrop) this.removeBackdrop(modal);
            this.stack.splice(this.getIndexOfModal(modal), 1);

            var hasOpenModal = this.hasOpenModal();

            this.$element.toggleClass('modal-open', hasOpenModal);

            if (!hasOpenModal){
                this.$element.removeClass('page-overflow');
            }

            this.removeContainer(modal);

            this.setFocus();
        },

        getModalAt: function (index) {
            return this.stack[index];
        },

        getIndexOfModal: function (modal) {
            for (var i = 0; i < this.stack.length; i++){
                if (modal === this.stack[i]) return i;
            }
        },

        replace: function (callback) {
            var topModal;

            for (var i = 0; i < this.stack.length; i++){
                if (this.stack[i].isShown) topModal = this.stack[i];
            }

            if (topModal) {
                this.$backdropHandle = topModal.$backdrop;
                topModal.$backdrop = null;

                callback && topModal.$element.one('hidden',
                    targetIsSelf( $.proxy(callback, this) ));

                topModal.hide();
            } else if (callback) {
                callback();
            }
        },

        removeBackdrop: function (modal) {
            modal.$backdrop.remove();
            modal.$backdrop = null;
        },

        createBackdrop: function (animate, tmpl) {
            var $backdrop;

            if (!this.$backdropHandle) {
                $backdrop = $(tmpl)
                    .addClass(animate)
                    .appendTo(this.$element);
            } else {
                $backdrop = this.$backdropHandle;
                $backdrop.off('.modalmanager');
                this.$backdropHandle = null;
                this.isLoading && this.removeSpinner();
            }

            return $backdrop;
        },

        removeContainer: function (modal) {
            modal.$container.remove();
            modal.$container = null;
        },

        createContainer: function (modal) {
            var $container;

            $container = $('<div class="modal-scrollable">')
                .css('z-index', getzIndex('modal', this.getOpenModals().length))
                .appendTo(this.$element);

            if (modal && modal.options.backdrop != 'static') {
                $container.on('click.modal', targetIsSelf(function (e) {
                    modal.hide();
                }));
            } else if (modal) {
                $container.on('click.modal', targetIsSelf(function (e) {
                    modal.attention();
                }));
            }

            return $container;

        },

        backdrop: function (modal, callback) {
            var animate = modal.$element.hasClass('fade') ? 'fade' : '',
                showBackdrop = modal.options.backdrop &&
                    this.backdropCount < this.options.backdropLimit;

            if (modal.isShown && showBackdrop) {
                var doAnimate = $.support.transition && animate && !this.$backdropHandle;

                modal.$backdrop = this.createBackdrop(animate, modal.options.backdropTemplate);

                modal.$backdrop.css('z-index', getzIndex( 'backdrop', this.getOpenModals().length ));

                if (doAnimate) modal.$backdrop[0].offsetWidth; // force reflow

                modal.$backdrop.addClass('in');

                this.backdropCount += 1;

                doAnimate ?
                    modal.$backdrop.one($.support.transition.end, callback) :
                    callback();

            } else if (!modal.isShown && modal.$backdrop) {
                modal.$backdrop.removeClass('in');

                this.backdropCount -= 1;

                var that = this;

                $.support.transition && modal.$element.hasClass('fade')?
                    modal.$backdrop.one($.support.transition.end, function () { that.removeBackdrop(modal) }) :
                    that.removeBackdrop(modal);

            } else if (callback) {
                callback();
            }
        },

        removeSpinner: function(){
            this.$spinner && this.$spinner.remove();
            this.$spinner = null;
            this.isLoading = false;
        },

        removeLoading: function () {
            this.$backdropHandle && this.$backdropHandle.remove();
            this.$backdropHandle = null;
            this.removeSpinner();
        },

        loading: function (callback) {
            callback = callback || function () { };

            this.$element
                .toggleClass('modal-open', !this.isLoading || this.hasOpenModal())
                .toggleClass('page-overflow', $(window).height() < this.$element.height());

            if (!this.isLoading) {

                this.$backdropHandle = this.createBackdrop('fade', this.options.backdropTemplate);

                this.$backdropHandle[0].offsetWidth; // force reflow

                var openModals = this.getOpenModals();

                this.$backdropHandle
                    .css('z-index', getzIndex('backdrop', openModals.length + 1))
                    .addClass('in');

                var $spinner = $(this.options.spinner)
                    .css('z-index', getzIndex('modal', openModals.length + 1))
                    .appendTo(this.$element)
                    .addClass('in');

                this.$spinner = $(this.createContainer())
                    .append($spinner)
                    .on('click.modalmanager', $.proxy(this.loading, this));

                this.isLoading = true;

                $.support.transition ?
                    this.$backdropHandle.one($.support.transition.end, callback) :
                    callback();

            } else if (this.isLoading && this.$backdropHandle) {
                this.$backdropHandle.removeClass('in');

                var that = this;
                $.support.transition ?
                    this.$backdropHandle.one($.support.transition.end, function () { that.removeLoading() }) :
                    that.removeLoading();

            } else if (callback) {
                callback(this.isLoading);
            }
        }
    };

    /* PRIVATE METHODS
    * ======================= */

    // computes and caches the zindexes
    var getzIndex = (function () {
        var zIndexFactor,
            baseIndex = {};

        return function (type, pos) {

            if (typeof zIndexFactor === 'undefined'){
                var $baseModal = $('<div class="modal hide" />').appendTo('body'),
                    $baseBackdrop = $('<div class="modal-backdrop hide" />').appendTo('body');

                baseIndex['modal'] = +$baseModal.css('z-index');
                baseIndex['backdrop'] = +$baseBackdrop.css('z-index');
                zIndexFactor = baseIndex['modal'] - baseIndex['backdrop'];

                $baseModal.remove();
                $baseBackdrop.remove();
                $baseBackdrop = $baseModal = null;
            }

            return baseIndex[type] + (zIndexFactor * pos);

        }
    }());

    // make sure the event target is the modal itself in order to prevent
    // other components such as tabsfrom triggering the modal manager.
    // if Boostsrap namespaced events, this would not be needed.
    function targetIsSelf(callback){
        return function (e) {
            if (e && this === e.target){
                return callback.apply(this, arguments);
            }
        }
    }


    /* MODAL MANAGER PLUGIN DEFINITION
    * ======================= */

    $.fn.modalmanager = function (option, args) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('modalmanager');

            if (!data) $this.data('modalmanager', (data = new ModalManager(this, option)));
            if (typeof option === 'string') data[option].apply(data, [].concat(args))
        })
    };

    $.fn.modalmanager.defaults = {
        backdropLimit: 999,
        resize: true,
        spinner: '<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',
        backdropTemplate: '<div class="modal-backdrop" />'
    };

    $.fn.modalmanager.Constructor = ModalManager

    // ModalManager handles the modal-open class so we need 
    // to remove conflicting bootstrap 3 event handlers
    $(function () {
        $(document).off('show.bs.modal').off('hidden.bs.modal');
    });

}(jQuery); 




!function ($) {

    "use strict"; // jshint ;_;

    /* MODAL CLASS DEFINITION
    * ====================== */

    var Modal = function (element, options) {
        this.init(element, options);
    };

    Modal.prototype = {

        constructor: Modal,

        init: function (element, options) {
            var that = this;

            this.options = options;

            this.$element = $(element)
                .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this));

            this.options.remote && this.$element.find('.modal-body').load(this.options.remote, function () {
                var e = $.Event('loaded');
                that.$element.trigger(e);
            });

            var manager = typeof this.options.manager === 'function' ?
                this.options.manager.call(this) : this.options.manager;

            manager = manager.appendModal ?
                manager : $(manager).modalmanager().data('modalmanager');

            manager.appendModal(this);
        },

        toggle: function () {
            return this[!this.isShown ? 'show' : 'hide']();
        },

        show: function () {
            var e = $.Event('show');

            if (this.isShown) return;

            this.$element.trigger(e);

            if (e.isDefaultPrevented()) return;

            this.escape();

            this.tab();

            this.options.loading && this.loading();
        },

        hide: function (e) {
            e && e.preventDefault();

            e = $.Event('hide');

            this.$element.trigger(e);

            if (!this.isShown || e.isDefaultPrevented()) return;

            this.isShown = false;

            this.escape();

            this.tab();

            this.isLoading && this.loading();

            $(document).off('focusin.modal');

            this.$element
                .removeClass('in')
                .removeClass('animated')
                .removeClass(this.options.attentionAnimation)
                .removeClass('modal-overflow')
                .attr('aria-hidden', true);

            $.support.transition && this.$element.hasClass('fade') ?
                this.hideWithTransition() :
                this.hideModal();
        },

        layout: function () {
            var prop = this.options.height ? 'height' : 'max-height',
                value = this.options.height || this.options.maxHeight;

            if (this.options.width){
                this.$element.css('width', this.options.width);

                var that = this;
                this.$element.css('margin-left', function () {
                    if (/%/ig.test(that.options.width)){
                        return -(parseInt(that.options.width) / 2) + '%';
                    } else {
                        return -($(this).width() / 2) + 'px';
                    }
                });
            } else {
                this.$element.css('width', '');
                this.$element.css('margin-left', '');
            }

            this.$element.find('.modal-body')
                .css('overflow', '')
                .css(prop, '');

            if (value){
                this.$element.find('.modal-body')
                    .css('overflow', 'auto')
                    .css(prop, value);
            }

            var modalOverflow = $(window).height() - 10 < this.$element.height();
            
            if (modalOverflow || this.options.modalOverflow) {
                this.$element
                    .css('margin-top', 0)
                    .addClass('modal-overflow');
            } else {
                this.$element
                    .css('margin-top', 0 - this.$element.height() / 2)
                    .removeClass('modal-overflow');
            }
        },

        tab: function () {
            var that = this;

            if (this.isShown && this.options.consumeTab) {
                this.$element.on('keydown.tabindex.modal', '[data-tabindex]', function (e) {
                    if (e.keyCode && e.keyCode == 9){
                        var elements = [],
                            tabindex = Number($(this).data('tabindex'));

                        that.$element.find('[data-tabindex]:enabled:visible:not([readonly])').each(function (ev) {
                            elements.push(Number($(this).data('tabindex')));
                        });
                        elements.sort(function(a,b){return a-b});
                        
                        var arrayPos = $.inArray(tabindex, elements);
                        if (!e.shiftKey){
                                arrayPos < elements.length-1 ?
                                    that.$element.find('[data-tabindex='+elements[arrayPos+1]+']').focus() :
                                    that.$element.find('[data-tabindex='+elements[0]+']').focus();
                            } else {
                                arrayPos == 0 ?
                                    that.$element.find('[data-tabindex='+elements[elements.length-1]+']').focus() :
                                    that.$element.find('[data-tabindex='+elements[arrayPos-1]+']').focus();
                            }
                        
                        e.preventDefault();
                    }
                });
            } else if (!this.isShown) {
                this.$element.off('keydown.tabindex.modal');
            }
        },

        escape: function () {
            var that = this;
            if (this.isShown && this.options.keyboard) {
                if (!this.$element.attr('tabindex')) this.$element.attr('tabindex', -1);

                this.$element.on('keyup.dismiss.modal', function (e) {
                    e.which == 27 && that.hide();
                });
            } else if (!this.isShown) {
                this.$element.off('keyup.dismiss.modal')
            }
        },

        hideWithTransition: function () {
            var that = this
                , timeout = setTimeout(function () {
                    that.$element.off($.support.transition.end);
                    that.hideModal();
                }, 500);

            this.$element.one($.support.transition.end, function () {
                clearTimeout(timeout);
                that.hideModal();
            });
        },

        hideModal: function () {
            var prop = this.options.height ? 'height' : 'max-height';
            var value = this.options.height || this.options.maxHeight;

            if (value){
                this.$element.find('.modal-body')
                    .css('overflow', '')
                    .css(prop, '');
            }

            this.$element
                .hide()
                .trigger('hidden');
        },

        removeLoading: function () {
            this.$loading.remove();
            this.$loading = null;
            this.isLoading = false;
        },

        loading: function (callback) {
            callback = callback || function () {};

            var animate = this.$element.hasClass('fade') ? 'fade' : '';

            if (!this.isLoading) {
                var doAnimate = $.support.transition && animate;

                this.$loading = $('<div class="loading-mask ' + animate + '">')
                    .append(this.options.spinner)
                    .appendTo(this.$element);

                if (doAnimate) this.$loading[0].offsetWidth; // force reflow

                this.$loading.addClass('in');

                this.isLoading = true;

                doAnimate ?
                    this.$loading.one($.support.transition.end, callback) :
                    callback();

            } else if (this.isLoading && this.$loading) {
                this.$loading.removeClass('in');

                var that = this;
                $.support.transition && this.$element.hasClass('fade')?
                    this.$loading.one($.support.transition.end, function () { that.removeLoading() }) :
                    that.removeLoading();

            } else if (callback) {
                callback(this.isLoading);
            }
        },

        focus: function () {
            var $focusElem = this.$element.find(this.options.focusOn);

            $focusElem = $focusElem.length ? $focusElem : this.$element;

            $focusElem.focus();
        },

        attention: function (){
            // NOTE: transitionEnd with keyframes causes odd behaviour

            if (this.options.attentionAnimation){
                this.$element
                    .removeClass('animated')
                    .removeClass(this.options.attentionAnimation);

                var that = this;

                setTimeout(function () {
                    that.$element
                        .addClass('animated')
                        .addClass(that.options.attentionAnimation);
                }, 0);
            }


            this.focus();
        },


        destroy: function () {
            var e = $.Event('destroy');

            this.$element.trigger(e);

            if (e.isDefaultPrevented()) return;

            this.$element
                .off('.modal')
                .removeData('modal')
                .removeClass('in')
                .attr('aria-hidden', true);
            
            if (this.$parent !== this.$element.parent()) {
                this.$element.appendTo(this.$parent);
            } else if (!this.$parent.length) {
                // modal is not part of the DOM so remove it.
                this.$element.remove();
                this.$element = null;
            }

            this.$element.trigger('destroyed');
        }
    };


    /* MODAL PLUGIN DEFINITION
    * ======================= */

    $.fn.modal = function (option, args) {
        return this.each(function () {
            var $this = $(this),
                data = $this.data('modal'),
                options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option);

            if (!data) $this.data('modal', (data = new Modal(this, options)));
            if (typeof option == 'string') data[option].apply(data, [].concat(args));
            else if (options.show) data.show()
        })
    };

    $.fn.modal.defaults = {
        keyboard: true,
        backdrop: true,
        loading: false,
        show: true,
        width: null,
        height: null,
        maxHeight: null,
        modalOverflow: false,
        consumeTab: true,
        focusOn: null,
        replace: false,
        resize: false,
        attentionAnimation: 'shake',
        manager: 'body',
        spinner: '<div class="loading-spinner" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',
        backdropTemplate: '<div class="modal-backdrop" />'
    };

    $.fn.modal.Constructor = Modal;


    /* MODAL DATA-API
    * ============== */

    $(function () {
        $(document).off('click.modal').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
            var $this = $(this),
                href = $this.attr('href'),
                $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))), //strip for ie7
                option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data());

            e.preventDefault();
            $target
                .modal(option)
                .one('hide', function () {
                    $this.focus();
                })
        });
    });

}(window.jQuery);

/////-- ==============================

function Events(n){var t={};n=n||this,n.on=function(n,e,o){t[n]||(t[n]=[]),t[n].push({f:e,c:o})},n.off=function(n,e){n||(t={});for(var o=t[n]||[],f=o.length=e?o.length:0;f-->0;)e==o[f].f&&o.splice(f,1)},n.emit=function(){var n,e=Array.apply([],arguments),o=t[e.shift()]||[],f=o.length;for(n=0;f>n;n++)o[n].f.apply(o[n].c,e)}}var u,module,cjs=module!=u;(cjs?module:window)[cjs?"exports":"Events"]=Events;


/////////// promise
function TcPromise() {
    
    var __result = undefined;

    var __fullfillFn = null;
    var __rejectFn   = null;

    // 0 = pending
    // 1 = success
    // 2 = reject
    var __state = 0; 

    var checkIfDone = function () {

        if ((typeof __result === 'undefined') || (__state == 0)) {
            return false;
        }

        if ((__state == 1) && (typeof __fullfillFn === 'function'))  {
            return __fullfillFn(__result);
        }
        else if ((__state == 2) && (typeof __rejectFn === 'function')) {
            return __rejectFn(__result);
        }
    };


    this.fullfill = function (result) {
        __state = 1;
        __result = (result ? result : null);

        checkIfDone();
    };

    this.reject = function (result) {
        __state = 1;
        __result = (result ? result : null);

        checkIfDone();
    };

    this.then = function (fFn, rFn) {

        if (typeof fFn === 'function') {
            __fullfillFn = fFn;
        }

        if (typeof rFn === 'function') {
            __rejectFn = fFn;
        }

        checkIfDone();
    };
}


/////////////////////////////////////////
(function () {

    var keyLinks = [
        {
            "key" : "AIzaSyA_23vD6J4HP66zTNF6nUurYgKfKEWoWRM",
            "cx" : "012744046524069566398:s1g4ecdxv-w"
        },
        {
            "key" : "AIzaSyBHKDLnFMS9B0BDtJFkEqlmRI0gQhRbRgM",
            "cx" : "006652794455649602714:lcgl7y8maxi"
        },
        {
            "key" : "AIzaSyAuWJWIIA06IADYbDwhChM7i1eCzsSoAEI",
            "cx" : "006480218139815248284:x_b8wqnjudm"
        },
        {
            "key": "AIzaSyBHKDLnFMS9B0BDtJFkEqlmRI0gQhRbRgM",
            "cx" : "006652794455649602714:lcgl7y8maxi"
        },
        {
            "key": "AIzaSyCo5xmpHeUhEZQUit8R5nywko_sGiOcE9k",
            "cx" : "006652794455649602714:lcgl7y8maxi"
        }
    ];

    var keyImages = [
        {
            "key": "AIzaSyCo5xmpHeUhEZQUit8R5nywko_sGiOcE9k",
            "cx" : "006652794455649602714:2umfbgq3ay8"
        },
        {
            "key" : "AIzaSyA_23vD6J4HP66zTNF6nUurYgKfKEWoWRM",
            "cx" : "012744046524069566398:yp7ejwetzre"
        },
        {
            "key" : "AIzaSyBHKDLnFMS9B0BDtJFkEqlmRI0gQhRbRgM",
            "cx" : "006652794455649602714%3A2umfbgq3ay8"
        },
        {
            "key" : "AIzaSyAuWJWIIA06IADYbDwhChM7i1eCzsSoAEI",
            "cx" : "006480218139815248284:ghkxugeo2lc"
        },
        {
            "key": "AIzaSyBHKDLnFMS9B0BDtJFkEqlmRI0gQhRbRgM",
            "cx" : "006652794455649602714:2umfbgq3ay8"
        }
    ];

    var lastKeyLink = -1;

    function getKeyLink() {
        lastKeyLink ++;

        if (!keyLinks[lastKeyLink]) {
            /*lastKeyLink = -1;
            return keyLinks[0]; */
            throw "GOOGLE SEARCH API REACH DAILY LIMIT: " + lastKeyLink;
        }

        return keyLinks[lastKeyLink];
    }

    var lastKeyImage = -1;

    function getKeyImage() {
        lastKeyImage ++;

        if (!keyImages[lastKeyImage]) {
            console.log('image key reach and end');
            // lastKeyImage = -1;
            //return keyImages[0];
            throw "GOOGLE SEARCH API REACH DAILY LIMIT";
        }

        return keyImages[lastKeyImage];
    }


    window.getKeyImage = getKeyImage;
    window.getKeyLink  = getKeyLink;

})();

(function(window) {

    window.getHeroExpImage = function (expImages) {

        if (!expImages || !expImages.length) {
            return null;
        }

        for (var i = 0; i < expImages.length; i++) {
            if (expImages[i].heroImage) {
                return expImages[i].heroImage;
            }
        }

        return expImages[0];
    } 

    /* infi scroll */
    var infiScroll = function (ele, fn, options) {

        var $ele  = $(ele);
        this.$ele = $ele;

        var _loading;


        if (!options) {
            options = {};
        }

        if (!options.direction) {
            options.direction = 'down';
        }

        this.options = options;

        // 
        var callback = function () {

            // alert('infi callback ' + $(_loading)[0].className);
                
            var sel;

            if (options.loadingElementClass) {
                sel = '.' + options.loadingElementClass;
            }
            else {
                sel = 'wait-wrapper';
            }

            // remove
            $(sel).remove();

            // _loading.parentNode.removeChild(_loading);
            // $loading.remove();
        };

        var self = this;
        self.offsetHeight = (options.offsetHeight ? options.offsetHeight : 0);

        $ele.on('scroll', function () {

            var scrollTop;
            var scrollHeight;

            if (this === window) {
                scrollHeight = document.body.clientHeight;
                // + $(this).height()
                scrollTop    = ($(this).scrollTop());
            }
            else {
                // + $(this).height()
                scrollTop = (this.scrollTop);
                scrollHeight = this.scrollHeight;
            }

            //
            // console.log('scrollTop', scrollTop, 'scrollHeight', scrollHeight, 'offsetHeight', self.offsetHeight);
            
            var scrollPosition = $(this).scrollTop();
            
            if (self.scrollMatch(scrollTop, scrollHeight, scrollPosition)) {

                // loading
                var _loading;
                
                var rs = fn(callback);

                if (rs !== false) {
                    if (options.loadingElement) {
                        _loading = document.createElement(options.loadingElement);

                        // var cl = '.wait-wrapper';

                        if (options.loadingElementClass) {
                            // cl                 = '.' + options.loadingElementClass;
                            _loading.className = options.loadingElementClass;
                        }

                        if (options.loadingElementHtml) {
                            _loading.innerHTML = options.loadingElementHtml;
                        }
                        else {
                            _loading.innerHTML = '<div class="wait-wrapper"></div>';
                        }

                        if (this !== window) {
                            // $ele.find(cl).remove();
                            $ele.append(_loading);
                        }
                        else {
                            // $('body').find(cl).remove();
                            $('body').append(_loading);
                        }
                    }
                }
            }

            //
            self.lastScrollPosition = scrollPosition;

        });
    }

    infiScroll.prototype.scrollMatch = function (scrollTop, scrollHeight, scrollPosition) {

        var eleHeight = this.$ele.height();

        if (this.options.direction == 'down') {
            // console.log('down down', this.lastScrollPosition, scrollPosition);
            if (((scrollTop + eleHeight) >= (scrollHeight - this.offsetHeight)) && (this.lastScrollPosition <= scrollPosition)) {
                // console.log('matchesss');
                return true;
            }

            return false;
        }
        else {
            
            if ((scrollTop <= this.offsetHeight) && (this.lastScrollPosition >= scrollPosition)) {
                return true;
            }

            return false;
        }
    };

    window.infiScroll = infiScroll;

    function placeCaretAtEnd(el) {
        el.focus();
        if (typeof window.getSelection != "undefined"
                && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(el);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(el);
            textRange.collapse(false);
            textRange.select();
        }
    }

    window.placeCaretAtEnd = placeCaretAtEnd;

    Date.prototype.sameDateAs = function(pDate){
        return ((this.getFullYear()==pDate.getFullYear())&&(this.getMonth()==pDate.getMonth())&&(this.getDate()==pDate.getDate()));
    };

    String.prototype.ucfirst = function() {
        return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
    };
    
    window.loadCss = function (url) {
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", url);

        if (typeof fileref!="undefined") {
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }
    };

    window.require = function(url, callback) {
        
        var js = document.createElement("script");
        js.type = "text/javascript";
        js.src  = url;

        if (js.readyState) {
            js.onreadystatechange = function () {
                if (this.readyState == 'complete') {
                    callback();
                }
            };
        }
        else {
            js.onload = function() {
                callback();
            };
        }
        
        // append to body
        document.getElementsByTagName('body')[0].appendChild(js);
    };


    function getDateFromDStr(dStr) {
        var parts = dStr.split('-');
        
        if (parts.length < 3) {
            return false;
        }

        var date  = new Date();

        date.setFullYear(parts[0]);
        date.setMonth(parts[1]);
        date.setDate(parts[2]);

        if (undefined !== parts[3]) {
            date.setHours(parts[3]);
        }

        if (undefined !== parts[4]) {
            date.setMinutes(parts[4]);
        }

        if (undefined !== parts[5]) {
            date.setSeconds(parts[5]);
        }

        return date;
    }

    function getDStrFromDate(date) {
        var parts = [];
        parts.push(date.getFullYear());
        parts.push(date.getMonth());
        parts.push(date.getDate());
        parts.push(date.getHours());
        parts.push(date.getMinutes());
        parts.push(date.getSeconds());

        return parts.join('-');
    }

    function olderThanToday(date) {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        if (date.getTime() < today.getTime()) {
            return true;
        }

        return false;
    }

    function isToday(date) {
        var today = new Date();
        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        today.setMilliseconds(0);

        var d = new Date(date);
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);
        d.setMilliseconds(0);

        if (today.getTime() == d.getTime()) {
            return true;
        }

        return false;
    }

    // ajax call wrapper
    var client = {};

    var makeRequest = function(url, method, data, success, fail) {
        var a = $.ajax({
            'url': url,
            'type': method,
            'dataType': 'text',
            'data': data
        });

        if (success && (typeof success == 'function')) {
            a.done(
                function (rspText) {
                    // remove while(1);
                    success(rspText.substring(9));
                }
            );
        }

        if (fail && (typeof fail == 'function')) {
            a.fail(fail);
        }
    };

    client.post = function(url, data, success, fail) {
        makeRequest(url, 'POST', data, success, fail);
    };

    client.get = function(url, data, success, fail) {
        makeRequest(url, 'GET', data, success, fail);
    };

        
    (function () {

        window.initFacebookButton = function (buttonId, didLogged, callback) {

            $(buttonId).click(function () {
                var l = Ladda.create(this);
                l.start();

                if (window.FB && (typeof Parse !== 'undefined') && !didLogged) {
                    Pace.track(function () {
                        FB.login(function(response) {
                           
                            if (response.status == 'connected') {

                                FB.api('/me', function (me) {
                                    var post = {
                                        fbid: me.id,
                                        firstName: me.first_name,
                                        lastName: me.last_name,
                                        email: me.email
                                    };

                                    TcClient.post('/user/login/facebook', post, function (text) {
                                        
                                        var rsp = JSON.parse(text);
                                        
                                        if (rsp.result && rsp.user) {
                                            var raw = rsp.user;

                                            if (rsp.existed) {
                                                raw.existed = true;
                                            }
                                            else {
                                                raw.existed = false;
                                            }

                                            callback(true, raw);
                                        }
                                        else {
                                            callback(false, null);
                                        }
                                    });
                                });
                            }

                        }, {scope: 'public_profile,email'});
                    });
                }
            });
        };

        window.initLoginButton = function (buttonId, didLogged, callback) {

            $(buttonId).click(function() {
                
                var l = Ladda.create(this);
                l.start();

                if (window.FB && (typeof Parse !== 'undefined') && !didLogged) {

                    var createSession = function (rawUser) {
                        TcClient.post('/newsession', {userId: rawUser.id}, function(rsp) {
                            /// ok we have the session
                            $('#login').remove();
                            $('.tile').removeClass('blurry');

                            l.stop();

                            if (typeof callback === 'function') {
                                callback(true, rawUser);
                            }

                        }, function(error, rsp) {
                            // error, show error
                            // Pace.stop();
                            l.stop();
                        });
                    };

                    Pace.track(function () {
                        Parse.FacebookUtils.logIn('email',
                            {
                                success: function(user) {
                                    // TcClient.get('/sessions', {}, function (msg) {});

                                    var rawUser = {
                                        id: user.id,
                                        existed: true,
                                    };

                                    if (user.get('userType') == 'guide') {
                                        rawUser.type = 'guide';
                                    }
                                    else {
                                        rawUser.type = 'traveller';
                                    }

                                    if (!user.existed() || !user.get('firstName') || !user.get('avatar_url') || !user.get('facebookId')) {

                                        FB.api('/me', function (resp) {
                                            // save the information
                                            user.setEmail(resp.email);

                                            if (!user.get('firstName')) {
                                                user.set('firstName', resp.first_name);
                                                user.set('lastName', resp.last_name);
                                            }

                                            user.set('facebookId', resp.id);

                                            if (!user.get('userType')) {
                                                user.set('userType', 'traveller');
                                            }
                                            
                                            if (!user.get('avatar_url')) {
                                                var ppurl = 'http://graph.facebook.com/' + resp.id + '/picture?width=180&height=180';
                                                user.set('avatar_url', ppurl);
                                            }              

                                            user.save();

                                            // set the current user;
                                            TcUser.set(user);

                                            rawUser.email   = resp.email;
                                            rawUser.existed = false;
                                            createSession(rawUser);
                                        });
                                    }
                                    else {
                                        rawUser.email = user.get('email');
                                        createSession(rawUser);
                                    }
                                },
                                error: function(resp) {
                                    Pace.stop();
                                    // error, show error
                                }
                            }
                        );
                    });
                }
                else {
                    $('#fb-unavailable').modal();
                }

                // return false;
            });
        };


        window.facebookInit = function() {  
            window.fbAsyncInit = function() {
                // init the FB JS SDK
                Parse.FacebookUtils.init({
                  appId      : window.fbAppId,                  // App ID from the app dashboard
                  channelUrl : window.fbChannelUrl,    // Channel file for x-domain comms
                  status     : true,                                    // Check Facebook Login status
                  cookie     : true,                                    // enable cookies to allow Parse to access the session
                  xfbml      : true                                  // Look for social plugins on the page
                });
            };

            (function(d, s, id){
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) {return;}
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/all.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        };

        //
        window.loginAnonymous = function (callback) {
            TcClient.post('/user/anonymous', {ok: 1}, function (txt) {
                try {

                    var rsp = JSON.parse(txt);

                    if (rsp.result && rsp.id) {
                        
                        eventCenter().emit('login.anonymous.success', {userId: rsp.id});

                        if (typeof callback === 'function')
                        {
                            callback(rsp.id);
                        }

                        /*TcClient.post('/newsession', {userId: rsp.id}, function(rsp) {
                            eventCenter().emit('login.anonymous.success', {userId: rsp.id});

                            if (typeof callback === 'function')
                            {
                                callback(rsp.id);
                            }
                        });*/
                    }
                    else {
                        if (typeof callback === 'function')
                        {
                            callback(false);
                        }
                    }
                } catch (e) {
                    if (typeof callback === 'function')
                    {
                        callback(false);
                    }
                    throw e;
                }
            });
        };

    })();


    /// user
    var User = {};
    var userInstance = null;

    User.set = function (object) {
        userInstance = object;
    };

    User.get = function() {
        return userInstance;
    };

    if (undefined != window.__user) {
        User.set(window.__user);
    }

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    var escapeHtml = function(string) {
        return String(string).replace(/[&<>"'\/]/g, function (s) {
            return entityMap[s];
        });
    };

    var decodeEntityMap = {
        "&amp;"   : "&",
        "&lt;"    : "<",
        "&gt;"    : ">",
        '&quot;'  : '"',
        '&#39;'   : "'",
        '&#x2F;'  : "/"
    };

    var htmlDecode = function (string) {
        var str = string;

        for (var k in decodeEntityMap) {
            str = str.replace(new RegExp(k, 'g'),   decodeEntityMap[k]);
        }

        return str;
    }

    var utcTimestamp = function(time) {

        if (undefined == time) {
            var time = new Date();
        }

        // return milisecond
        var now = time.getTime() + (time.getTimezoneOffset() * 60 * 1000);
        return now;
    };


    function getFriendlyDateStr(d, time) {
        var month = [];
        month[0]="January";
        month[1]="February";
        month[2]="March";
        month[3]="April";
        month[4]="May";
        month[5]="June";
        month[6]="July";
        month[7]="August";
        month[8]="September";
        month[9]="October";
        month[10]="November";
        month[11]="December";

        var str = d.getDate() + ' ' + month[d.getMonth()] + ' ' + d.getFullYear();

        if (time) {

            var hour   = ((d.getHours() + "").length == 2) ? d.getHours() : ('0' + d.getHours());
            var minute = ((d.getMinutes() + "").length == 2) ? d.getMinutes() : ('0' + d.getMinutes());
            str = str + ' at ' + hour + ':' + minute; 
        }

        return str;
    }

    var __eventCenter = new Events();

    function eventCenter() {
        return __eventCenter;
    }

    window.eventCenter = eventCenter;

    window.olderThanToday = olderThanToday;
    window.isToday        = isToday;
    // exports
    // window.util = util;
    window.facebookInit = facebookInit;
    
    window.TcClient = client;
    window.TcUser = User;
    window.getDStrFromDate = getDStrFromDate;
    window.getDateFromDStr = getDateFromDStr;
    window.escapeHtml = escapeHtml;
    window.htmlDecode = htmlDecode;
    window.utc = utcTimestamp;
    window.getFriendlyDateStr = getFriendlyDateStr;
    
})(window);


window.Base64 = (function() {
    "use strict";

    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    var _utf8_encode = function (string) {

        var utftext = "", c, n;

        string = string.replace(/\r\n/g,"\n");

        for (n = 0; n < string.length; n++) {

            c = string.charCodeAt(n);

            if (c < 128) {

                utftext += String.fromCharCode(c);

            } else if((c > 127) && (c < 2048)) {

                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);

            } else {

                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);

            }

        }

        return utftext;
    };

    var _utf8_decode = function (utftext) {
        var string = "", i = 0, c = 0, c1 = 0, c2 = 0;

        while ( i < utftext.length ) {

            c = utftext.charCodeAt(i);

            if (c < 128) {

                string += String.fromCharCode(c);
                i++;

            } else if((c > 191) && (c < 224)) {

                c1 = utftext.charCodeAt(i+1);
                string += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;

            } else {

                c1 = utftext.charCodeAt(i+1);
                c2 = utftext.charCodeAt(i+2);
                string += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;

            }

        }

        return string;
    };

    var _hexEncode = function(input) {
        var output = '', i;

        for(i = 0; i < input.length; i++) {
            output += input.charCodeAt(i).toString(16);
        }

        return output;
    };

    var _hexDecode = function(input) {
        var output = '', i;

        if(input.length % 2 > 0) {
            input = '0' + input;
        }

        for(i = 0; i < input.length; i = i + 2) {
            output += String.fromCharCode(parseInt(input.charAt(i) + input.charAt(i + 1), 16));
        }

        return output;
    };

    var encode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = _utf8_encode(input);

        while (i < input.length) {

            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }

            output += _keyStr.charAt(enc1);
            output += _keyStr.charAt(enc2);
            output += _keyStr.charAt(enc3);
            output += _keyStr.charAt(enc4);

        }

        return output;
    };

    var decode = function (input) {
        var output = "", chr1, chr2, chr3, enc1, enc2, enc3, enc4, i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        while (i < input.length) {

            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output += String.fromCharCode(chr1);

            if (enc3 !== 64) {
                output += String.fromCharCode(chr2);
            }
            if (enc4 !== 64) {
                output += String.fromCharCode(chr3);
            }

        }

        return _utf8_decode(output);
    };

    var decodeToHex = function(input) {
        return _hexEncode(decode(input));
    };

    var encodeFromHex = function(input) {
        return encode(_hexDecode(input));
    };

    return {
        'encode': encode,
        'decode': decode,
        'decodeToHex': decodeToHex,
        'encodeFromHex': encodeFromHex
    };
}());


/**
 * External Video Services Embedded Code Generator.
 *
 * Currently supports Dailymotion, Vimeo and YouTube services, more to come
 *
 * @author Nicolas Perriault <nperriault at gmail dot com>
 */
 
var EmbedMediaParser = function(url) {
        this.url = url;

        this.defaults = {
            width: 400,
            height: 300,
            previewWidth: 320,
            previewHeight: 200
        };
        
        this.services = {
            /*dailymotion: {
                pattern: /^((https?:\/\/)?(www\.)?dailymotion\.com\/video\/)([a-z0-9]+)(_(.*)?)$/,
                replace: '//www.dailymotion.com/swf/$4',
                service: 'dailymotion'
            },
            vimeo: {
                pattern: /^((https?:\/\/)?(www\.)?vimeo\.com\/)(\d+)(.*)?$/,
                replace: '//vimeo.com/moogaloop.swf?clip_id=$4&amp;server=vimeo.com&amp;show_title=1&amp;show_byline=1&amp;show_portrait=0&amp;color=&amp;fullscreen=1',
                service: 'vimeo'
            },*/
            youtube: {
                pattern: /^((https?:\/\/)?(www\.)?youtube\.com\/watch\?v=)([a-zA-Z0-9-_]+)(.*)?$/,
                replace: '$4',
                // replace: '//www.youtube.com/embed/$4?modestbranding=1&showinfo=0&theme=light&controls=2&color=white&autoplay=0',
                service: 'youtube'
            },
            youtube2: {
                pattern: /^((https?:\/\/)?(www\.)?youtu\.be\/)([a-zA-Z0-9-_]+)(.*)?$/,
                replace: '$4',
                //replace: '//www.youtube.com/v/$4&amp;fs=1&amp;modestbranding=1&amp;showinfo=0&amp;theme=light&amp;controls=2&amp;color=white&amp;autohide=1&amp;rel=0',
                service: 'youtube'
            }
        };
        
        this.debug = function(o) {
            try {
                console.log(o);
            } catch (e) {
            }
        };
        
        this.parse = function() {
            for (var serviceName in this.services) {
                var service = this.services[serviceName];
                var movieUrl = this.url.replace(service.pattern, service.replace);
                if (this.url != movieUrl) {
                    //
                    this.serviceName = serviceName;
                    return movieUrl;
                }
            }
            throw 'Could not parse url ' + this.url;
        };
        
        this.getEmbedCode = function(width, height, movieUrl, serviceName) {

            if (!movieUrl) {
                console.log('parse from here');
                movieUrl = this.parse();
            }

            if (!serviceName) {
                serviceName = this.serviceName;
            }

            //console.log('movieUrl', movieUrl);

            width  = width  ? width  : this.defaults.width;
            height = height ? height : this.defaults.height;
            
            if ((serviceName != 'youtube') && (serviceName != 'youtube2')) {
                return '<object data-service="' + serviceName + '" class="embedded">'
                + "\n" + '  <param name="allowfullscreen" value="true" />'
                + "\n" + '  <param name="allowscriptaccess" value="always" />'
                + "\n" + '  <param name="movie" value="' + movieUrl + '" />'
                + "\n" + '  <embed src="' + movieUrl + '" '
                + "\n" + '    type="application/x-shockwave-flash" '
                + "\n" + '    allowfullscreen="true" '
                + "\n" + '    allowscriptaccess="always" '
                + "\n" + '    width="' + width + '" '
                + "\n" + '    height="' + height + '"></embed>'
                + "\n" + '</object>';
            } else {
                var idStr  = 'ytplayer-' + (new Date().getTime());

                var div = document.createElement('div');
                div.id  = idStr;

                setTimeout(function () {
                    var player = new YT.Player(div, {
                      height: '390',
                      width: '640',
                      videoId: movieUrl,
                      events: {
                        onReady: function () {
                        },
                        onStateChange: function (ev) {
                            if (ev.data == YT.PlayerState.PLAYING) {
                                $('body').addClass('video-play');
                            }
                            else if (ev.data == YT.PlayerState.PAUSED) {
                                $('body').removeClass('video-play');
                            }
                        }
                      }
                    });
                }, 2000);

                return div;
                /// return '<iframe class="embedded" data-service="' + serviceName + '" src="' + movieUrl + '&enablejsapi=1" frameborder="0" allowfullscreen></iframe>';
            }
        };
};

function loadDestinationsForGuide(guideId, callback) {
    TcClient.get('/destinations/' + guideId, {}, function (msg) {
        try {
            var rsp = JSON.parse(msg);

            if (rsp.destinations) {
                callback(rsp.destinations);
            }
            else {
                callback(false);
            }
        } catch (e) {
            callback(false);
        }
    });
}


jQuery.fn.selectText = function(){
   var doc = document;
   var element = this[0];
   console.log(this, element);
   if (doc.body.createTextRange) {
       var range = document.body.createTextRange();
       range.moveToElementText(element);
       range.select();
   } else if (window.getSelection) {
       var selection = window.getSelection();        
       var range = document.createRange();
       range.selectNodeContents(element);
       selection.removeAllRanges();
       selection.addRange(range);
   }
};

function validateURL(textval) {
  var urlregex = new RegExp(
        "^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
  return urlregex.test(textval);
}


function validateEmailAddress(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}


function getMapStyle() {
    var styles = [{"featureType":"road","elementType":"labels","stylers":[{"visibility":"simplified"},{"lightness":20}]},{"featureType":"administrative.land_parcel","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape.man_made","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"hue":"#a1cdfc"},{"saturation":30},{"lightness":49}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"hue":"#f49935"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"hue":"#fad959"}]}]

    return new google.maps.StyledMapType(styles,
        {name: "Styled Map"}
    );
}

$(document).ready(function () {
    $('.btn-modal-close').on('click', function () {
        var modal = this.getAttribute('data-modal');
        if (!modal) {
            return false;
        }
        $('#' + modal).modal('hide');
        return false;
    });
});

$(function() {
    $('a[href*=#]:not([href=#])').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });
});


/* Bowser */
!function(e,t){typeof module!="undefined"&&module.exports?module.exports.browser=t():typeof define=="function"?define(t):this[e]=t()}("bowser",function(){function t(t){function n(e){var n=t.match(e);return n&&n.length>1&&n[1]||""}var r=n(/(ipod|iphone|ipad)/i).toLowerCase(),i=/like android/i.test(t),s=!i&&/android/i.test(t),o=n(/version\/(\d+(\.\d+)?)/i),u=/tablet/i.test(t),a=!u&&/[^-]mobi/i.test(t),f;/opera|opr/i.test(t)?f={name:"Opera",opera:e,version:o||n(/(?:opera|opr)[\s\/](\d+(\.\d+)?)/i)}:/windows phone/i.test(t)?f={name:"Windows Phone",windowsphone:e,msie:e,version:n(/iemobile\/(\d+(\.\d+)?)/i)}:/msie|trident/i.test(t)?f={name:"Internet Explorer",msie:e,version:n(/(?:msie |rv:)(\d+(\.\d+)?)/i)}:/chrome|crios|crmo/i.test(t)?f={name:"Chrome",chrome:e,version:n(/(?:chrome|crios|crmo)\/(\d+(\.\d+)?)/i)}:r?(f={name:r=="iphone"?"iPhone":r=="ipad"?"iPad":"iPod"},o&&(f.version=o)):/sailfish/i.test(t)?f={name:"Sailfish",sailfish:e,version:n(/sailfish\s?browser\/(\d+(\.\d+)?)/i)}:/seamonkey\//i.test(t)?f={name:"SeaMonkey",seamonkey:e,version:n(/seamonkey\/(\d+(\.\d+)?)/i)}:/firefox|iceweasel/i.test(t)?(f={name:"Firefox",firefox:e,version:n(/(?:firefox|iceweasel)[ \/](\d+(\.\d+)?)/i)},/\((mobile|tablet);[^\)]*rv:[\d\.]+\)/i.test(t)&&(f.firefoxos=e)):/silk/i.test(t)?f={name:"Amazon Silk",silk:e,version:n(/silk\/(\d+(\.\d+)?)/i)}:s?f={name:"Android",version:o}:/phantom/i.test(t)?f={name:"PhantomJS",phantom:e,version:n(/phantomjs\/(\d+(\.\d+)?)/i)}:/blackberry|\bbb\d+/i.test(t)||/rim\stablet/i.test(t)?f={name:"BlackBerry",blackberry:e,version:o||n(/blackberry[\d]+\/(\d+(\.\d+)?)/i)}:/(web|hpw)os/i.test(t)?(f={name:"WebOS",webos:e,version:o||n(/w(?:eb)?osbrowser\/(\d+(\.\d+)?)/i)},/touchpad\//i.test(t)&&(f.touchpad=e)):/bada/i.test(t)?f={name:"Bada",bada:e,version:n(/dolfin\/(\d+(\.\d+)?)/i)}:/tizen/i.test(t)?f={name:"Tizen",tizen:e,version:n(/(?:tizen\s?)?browser\/(\d+(\.\d+)?)/i)||o}:/safari/i.test(t)?f={name:"Safari",safari:e,version:o}:f={},/(apple)?webkit/i.test(t)?(f.name=f.name||"Webkit",f.webkit=e,!f.version&&o&&(f.version=o)):!f.opera&&/gecko\//i.test(t)&&(f.name=f.name||"Gecko",f.gecko=e,f.version=f.version||n(/gecko\/(\d+(\.\d+)?)/i)),s||f.silk?f.android=e:r&&(f[r]=e,f.ios=e);var l="";r?(l=n(/os (\d+([_\s]\d+)*) like mac os x/i),l=l.replace(/[_\s]/g,".")):s?l=n(/android[ \/-](\d+(\.\d+)*)/i):f.windowsphone?l=n(/windows phone (?:os)?\s?(\d+(\.\d+)*)/i):f.webos?l=n(/(?:web|hpw)os\/(\d+(\.\d+)*)/i):f.blackberry?l=n(/rim\stablet\sos\s(\d+(\.\d+)*)/i):f.bada?l=n(/bada\/(\d+(\.\d+)*)/i):f.tizen&&(l=n(/tizen[\/\s](\d+(\.\d+)*)/i)),l&&(f.osversion=l);var c=l.split(".")[0];if(u||r=="ipad"||s&&(c==3||c==4&&!a)||f.silk)f.tablet=e;else if(a||r=="iphone"||r=="ipod"||s||f.blackberry||f.webos||f.bada)f.mobile=e;return f.msie&&f.version>=10||f.chrome&&f.version>=20||f.firefox&&f.version>=20||f.safari&&f.version>=6||f.opera&&f.version>=10||f.ios&&f.osversion&&f.osversion.split(".")[0]>=6?f.a=e:f.msie&&f.version<10||f.chrome&&f.version<20||f.firefox&&f.version<20||f.safari&&f.version<6||f.opera&&f.version<10||f.ios&&f.osversion&&f.osversion.split(".")[0]<6?f.c=e:f.x=e,f}var e=!0,n=t(typeof navigator!="undefined"?navigator.userAgent:"");return n._detect=t,n})

$(document).ready(function () {
    if (bowser.msie && (bowser.version <= 10)) {
      document.body.innerHTML = '<div style="position:absolute;top:0;left:0;right:0,bottom:0;width:100%;height:100%;background:#f1f1f1;text-align:center"><div style="font-family:\'Helvetica Nueue\',Helvetica,Arial,\'Sans Serif\';color:#333;height: 300px;margin: auto 0px auto 0px;position: relative;top: 40%;margin-top: -75px;"><img src="https://s3.amazonaws.com/static.tripchum.com/images/tclogo.png" width="200px"/><h3 style="font-weight:300;font-size:2em;">TripChum has been optimised for use with modern browsers</h3><p style="font-weight:300">We recommend using the Chrome browser.</p><p>You can download it <a href="https://www.google.com/intl/en/chrome/browser/">here</a> then please try TripChum again</p></div></div>';
    }
});