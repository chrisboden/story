/*
    Huy Nguyen - 2014
*/

"use strict";

function getImageGridLayout(numb) {
    
    // console.log('grid layout', numb);

    var max       = 3;
    var layoutStr = '';

    var getColNumber = function () {
        
        var random = Math.random();
        var _max   = (numb <= max) ? numb : max;
        
        var column = Math.ceil(_max * random);
        numb -= column;

        // console.log('column', column, 'number', numb);

        layoutStr += "" + column;

        if (numb > 0) {
            getColNumber();
        }
    }

    getColNumber();

    // 
    return layoutStr;
}

//
function setChange() {
    $(document).trigger('story.change');
}

window.setChange = setChange;

(function () {
    ////////////////// image modal ////////

    var __settingCover = false;
    var __onlyUseCover = false;

    var comp;

    function settingCover(setting) {
        __settingCover = (setting ? true : false);
    }

    function onlyUseCover(only) {
        __onlyUseCover = only ? true : false;
    }

    function setComposerObject(composer) {
        comp = composer;
    }

    window.setComposerObject  = setComposerObject;
    window.settingHeaderCover = settingCover;
    window.onlyUseHeaderCover = onlyUseCover;

    var _onClickCb = function () {

        var $t = $(this);
        
        if (__settingCover || __onlyUseCover) {

            var url;
            var $img = $(this).find('img');

            if ($img.attr('data-link')) {
                url = $img.attr('data-link');
            }
            else {
                url = $img.attr('src');
            }

            if (url) {

                comp.setCoverImage(url);

                if (__settingCover) {
                    __settingCover = false;
                }
            }

            // hide the modal
            closeImageModal();
        }
        else {

            if ($t.hasClass('active')) {
                $t.removeClass('active');
            }
            else {
                $t.addClass('active');
            }
        }

        return false;
    };

    /// 
    function renderImageResult(results, divId, more, afterLoadFn)
    {

        var frag = document.createDocumentFragment();

        for (var i = 0; i < results.items.length; i++) {

            var li = imageSearchCreateResultLi(results.items[i], _onClickCb, false);

            frag.appendChild(li);
        }

        var $ul = $(divId);
        $ul.append(frag);

        if (!more && !$ul.hasClass('waterfall'))
        {

            $ul.css('display', 'none');

            $ul.waterfall({
                colMinWidth: 260,
                maxCols: 5,
                autoresize: true
            });

            $ul.addClass('waterfall');
        }
        
        $ul.imagesLoaded(function () {
            $ul.css('display', 'block');
            $ul.data('waterfall').reflow();

            if (typeof afterLoadFn === 'function') {
                afterLoadFn();
            }
        });
    }

    function openImageModal() {
        $('#image-modal').modal({modalOverflow: true});
        $('#image-search-text').focus();
    }

    function closeImageModal() {
        $('#image-modal').modal('hide');
    }

    function initImageSearchModalForComposer() {
        var __qs;

        // image search
        $('#image-search-button').on('click', function () {

            var qs = $('#image-search-text').val();

            if (!qs) {
                return false;
            }

            __qs = qs;

            $('#loading-spin').css('display', 'block');

            var stillSearch = 2;

            var checkStillSearch = function () {
                stillSearch = stillSearch - 1;

                if (stillSearch == 0) {
                    $('#loading-spin').css('display', 'none');
                }
            };

            // google search
            imageSearchLegacy(qs, 0, function (results, more) {
                var ul = document.createElement('ul');
                ul.id = 'image-search-result';

                $('#image-search-result').replaceWith(ul);
                // console.log('results', results);
                renderImageResult(results, '#image-search-result', false, checkStillSearch);
            });

            // flickr search
            searchFlickr(qs, true, function (results) {
                var ul = document.createElement('ul');
                ul.id = 'image-search-result-flickr';

                $('#image-search-result-flickr').replaceWith(ul);;
                renderImageResult(results, '#image-search-result-flickr', false, checkStillSearch);
            });

            return false;
        });


        $('#image-search-more').on('click', function () {

            $('#loading-spin').css('display', 'block');
            // google search
            imageSearchLegacy(__qs, 10, function (results, more) {
                renderImageResult(results, '#image-search-result', true);
                $('#loading-spin').css('display', 'none');
            });

            return false;
        });

        $('#image-search-more-flickr').on('click', function () {
            $('#loading-spin').css('display', 'block');
            // flickr search
            searchFlickr(__qs, false, function (results) {
                renderImageResult(results, '#image-search-result-flickr', true);
                $('#loading-spin').css('display', 'none');
            });

            return false;
        });

        var s = new infiScroll('#image-search-result-scroll', function (cb) {
            
            if ($('#tab-google').hasClass('active')) {
                $('#image-search-more').click();
            }
            else {
                $('#image-search-more-flickr').click();
            }
            
            setTimeout(function () {
                cb();
            }, 3000);

        }, {loadingElement: 'li', loadingElementClass: 'loading-item'});


        $('#image-search-text').on('keydown', function (ev) {
            if (ev.keyCode == 13) {
                return $('#image-search-button').click();
            }
        });

        /// image use
        $('#image-use').on('click', function () {

            var $_imgs = $('#image-modal').find('.exp-image.active img');
 
            var pset = new Photoset();

            // process
            pset.process(function (div) {

                var time  = new Date().getTime();
                var count = 0;
                var max;

                var checkFinish = function () {
                    count ++;

                    if (count == max) {
                        
                    }
                };

                var doUpload = function (_img, cb) {

                    var idStr = (time + '_' + count);

                    var transloadit = new TransloaditXhr({
                        authKey: getTransloadItKey(),
                        templateId: "926dac00c90411e3bddc9d5ca01e5705",

                        successCb: function(fileObj) {

                            $('img[data-id="' + idStr + '"]').attr('src', fileObj['original.jpg'][0].ssl_url);

                            setChange();

                            if (cb)
                            {
                                cb();
                            }

                            // parent of the div is the part, dumb ass
                            comp.markPartAsWorking($(div).parent()[0], true);
                            finishProgress(div);
                        },
                        progressCb: function (progress) {
                            updateProgress(div, progress);
                        },
                        errorCb: function(error) {
                            if (cb) {
                                cb();
                            }
                        }
                    });
                    
                    //
                    _img.setAttribute('data-id', idStr);
                    transloadit.importFile(_img.src);

                    count++;
                };

                closeImageModal();

                // now start the upload
                var _imgs = [];

                $(div).find('img').each(function () {
                    _imgs.push(this);
                });

                var part = comp.addWidget('photoset', div);
                comp.markPartAsWorking(part);

                max = _imgs.length;

                for (var i = 0; i < _imgs.length; i++) {
                    doUpload(_imgs[i], checkFinish);
                }

            }, false, $_imgs);

            return false;
        });

        $('.image-result-tab a').on('click', function () {
            $('ul.waterfall').each(function () {
                $(this).data('waterfall').reflow();
            });
            $(this).tab('show');
            return false;
        });
    }

    window.initImageSearchModalForComposer = initImageSearchModalForComposer;
    window.openImageSearchModal  = openImageModal;
    window.closeImageSearchModal = closeImageModal;

    function onDragNo() {
        return false;
    }

    function onDropNo() {
        return false;
    }

    var Photoset = function () {

        // reset the modal
        $('#image-search-result').html('');
        $('#image-search-result-flickr').html('');
        $('#image-upload-dropzone ul').html('');

        // __files
        this.files = [];

        // images
        this.images = [];

        this.dropzoneImageCount = 0;
    };

    Photoset.prototype.createImageList = function ($imgs, callback) {

        // create the grid container
        var div              = document.createElement('div');
        div.className        = 'photoset-grid-custom';
        // div.style.visibility = 'hidden';

        var self = this;

        $imgs.each(function () {
            div.appendChild(this);
            //
            self.images.push(this);
        });

        // each
        /* $imgs.each(function () {
            // console.log('this', this);

            var imgItem = document.createElement('img');
            imgItem.src = this.src;
            imgItem.className = this.className;

            div.appendChild(imgItem);

            imgItem.setAttribute('data-field', this.getAttribute('data-field'));

            //
            self.images.push(imgItem);
        }); */

        
        var layoutStr = getImageGridLayout($imgs.length);
        // console.log('layout string', layoutStr);

        $(div).photosetGrid({
            // Set the gutter between columns and rows
            gutter: '0px',
            // Manually set the grid layout
            layout: layoutStr
        });

        // $('body').append($imgs[0]);

        if (callback) {
            callback(div);
        }
    }

    Photoset.prototype.addImageToDropZone = function (f) {
        var $ul = $('#image-upload-dropzone ul');

        var self = this;

        imageFromFile(f, 500, 500, function (image) {
            
            var li = document.createElement('li');
            li.className = 'uploaded-image';
            li.appendChild(image);

            image.setAttribute('data-field', 'file_' + self.dropzoneImageCount);
            $(image).addClass('uploaded');

            image.ondragstart = onDragNo;
            image.ondrop      = onDropNo;

            // deleter button
            var delButt = document.createElement('a');
            delButt.className = 'delete-action';
            delButt.innerHTML = 'x';
            delButt.href      = '#';
            delButt.onClick   = function () {
                $(this).parent().remove();
                return false;
            };

            li.appendChild(delButt);

            //
            $ul.append(li);

            //
            self.dropzoneImageCount++;
            // self.images.push(image);
        });
    };

    Photoset.prototype.setFileList = function (files, callback) {

        // reset __images
        // __images = [];
        var self = this;
        
        // make a reference to the file list;
        this.files = [];
        this.dropzoneImageCount = 0;

        var count = files.length;
        var done  = 0;

        var checkIfDone = function () {
            done++;

            if ((done == count) && (typeof callback === 'function')) {
                // console.log('done', done, count);
                callback(self);
            }
        };


        for (var i = 0, f; f = files[i]; i++) {
            // var number = i + 0;
            //this.addImageToDropZone(f);
            
            imageFromFile(f, 500, 500, function (image, fileObject) {
                
                self.images.push(image);
                self.files.push(fileObject);

                image.setAttribute('data-field', 'file_' + self.dropzoneImageCount);
                self.dropzoneImageCount ++;
                checkIfDone();
            });
        }
    };

    Photoset.prototype.process = function (processCb, successCb, $imgs) {
        // get the images
        // var $imgs = $('#image-modal').find('.exp-image.active img, .uploaded-image img');

        // console.log('$imgs', $imgs, $imgs.length);

        var self = this;

        if (!$imgs) {
            //console.log('no images');
            $imgs = $(this.images);
        }
        else {
            
            self.images = [];

            $($imgs).each(function () {
                var img = document.createElement('img');
                
                img.src = this.src;
                img.setAttribute('data-field', 'file_' + self.dropzoneImageCount);

                self.images.push(img);
                /*this.setAttribute('data-field', 'file_' + self.dropzoneImageCount);*/
            });
        }

        // console.log('image count', this.images.length);

        // console.log('$imgs.length', $imgs.length, this.images.length, $imgs[0]);
        this.createImageList($(this.images), function (div) {

            // console.log('helloooo');

            // trigger change
            setChange();

            var withProgress = initProgressMarkup(div);
            self.element     = withProgress;

            // console.log('file leng', __files.length);
            
            if (self.files) {
                self.uploadImage(successCb);
            }

            if (processCb) {
                processCb(self.element);
            }
        });
    };

    Photoset.prototype.getImageObject = function (fieldName) {

        for (var i = 0; i < this.images.length; i++) {

            if (this.images[i].getAttribute('data-field') == fieldName) {
                return this.images[i];
            }
        }

        return false;
    };

    Photoset.prototype.uploadImage = function (successCb) {
        var self = this;

        var transloadit = new TransloaditXhr({
            authKey: getTransloadItKey(),
            templateId: "68a28300edf811e3b22bb576fd84875d",
            
            successCb: function(fileObj) {
                
                // console.log('image obj', fileObj);

                var orig = fileObj['original.jpg'];

                if (!orig) {
                    return;
                }

                for (var i = 0; i < orig.length; i++) {

                    var imageObj = self.getImageObject(orig[i].field);

                    if (imageObj) {
                        
                        // console.log('image object found', orig[i].ssl_url);
                        imageObj.src = orig[i].ssl_url;
                        $(imageObj).removeClass('binary-image');

                        setChange();
                    }
                    else {
                        // console.log('no image object found', self.images.length);
                    }
                }

                if (successCb) {
                    successCb.call();
                }

                comp.markPartAsWorking(self.element, true);
                finishProgress(self.element);
            },

            progressCb: function (progress) {
                // console.log('progress: ' + progress);
                updateProgress(self.element, progress);
            },

            errorCb: function(error) {
                alert(error);
            }
        });

        // console.log('now upload files', this.files.length);
        transloadit.uploadFile(this.files);
    };

    //
    window.Photoset = Photoset;

})();

/*function getViewport() {

    var viewPortWidth;
    var viewPortHeight;

    // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
    if (typeof window.innerWidth != 'undefined') {
        viewPortWidth = window.innerWidth,
        viewPortHeight = window.innerHeight
    }

    // IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
    else if (typeof document.documentElement != 'undefined'
        && typeof document.documentElement.clientWidth !=
        'undefined' && document.documentElement.clientWidth != 0) {
        viewPortWidth = document.documentElement.clientWidth,
        viewPortHeight = document.documentElement.clientHeight
    }

    // older versions of IE
    else {
        viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
        viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
    }
    return [viewPortWidth, viewPortHeight];
}*/

function imageFromFile(file, width, height, cb) {

    // console.log('file...', file);

    var canvas = document.createElement("canvas");

    if (FileReader && canvas.getContext) {

        try {
            var src = file;
            var fr = new FileReader();

            fr.onload = function() {
                var image = new Image();
                var imageCopy = new Image();

                var canvasCopy = document.createElement("canvas");
                var copyContext = canvasCopy.getContext("2d");

                var ctx    = canvas.getContext('2d');

                image.onload = function() {

                    var ratio = 1;

                    if (image.width > width) {
                        ratio = width / image.width;
                    }
                    else if (image.height > height) {
                        ratio = height / image.height;
                    }

                    // the image copy
                    imageCopy.width  = image.width * ratio;
                    imageCopy.height = image.height * ratio;

                    //

                    canvasCopy.width = image.width;
                    canvasCopy.height = image.height;
                    copyContext.drawImage(image, 0, 0);

                    canvas.width = image.width * ratio;
                    canvas.height = image.height * ratio;
                    ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);

                    imageCopy.src = canvas.toDataURL("image/png");
                };

                image.src = fr.result;   

                if (cb && (typeof cb === 'function')) {
                    imageCopy.className = 'binary-image';
                    cb(imageCopy, file);
                }
            };
            
            fr.readAsDataURL(src);

        } catch (e) {
            throw e;
        }
        
    } else {
        if (cb && (typeof cb === 'function')) {
            cb(null, file);
        }
    }
}


function isDark(brightness) {

    if (brightness < (3 * 256 / 2)) {
        return true;
    }

    return false;
}

// http://jsfiddle.net/s7Wx2/
function getImageBrightness(img) {

    var colorSum = 0;

    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    var data = imageData.data;
    var r,g,b,avg;

      for(var x = 0, len = data.length; x < len; x+=4) {
        r = data[x];
        g = data[x+1];
        b = data[x+2];

        avg = Math.floor((r+g+b)/3);
        colorSum += avg;
    }

    var brightness = Math.floor(colorSum / (img.width * img.height));

    return brightness;
}

function initSvgIcons(ele, cb) {

    if (!ele) {
        ele = document;
    }

    var $icons = $(ele).find('img.icon-svg');

    var count  = $icons.length;
    var loaded = 0;

    var checkIfFinish = function () {
        loaded ++;

        if (loaded == count) {
            if (cb && (typeof cb === 'function')) {
                cb();
            }
        }
    }

    $icons.each(function () {

        var svgSrc = this.getAttribute('data-src');

        if (!svgSrc) {
            return;
        }

        var svgPath = '/assets/svg/' + svgSrc;

        var $t = $(this);

        $.ajax({
            'url': svgPath,
            'type': 'GET',
            dataType: 'html'
        }).done(function (svg) {
            var span = document.createElement('span');
            span.innerHTML = svg;
            span.className = $t.attr('data-class');

            // replace
            $t.replaceWith(span);

            checkIfFinish();
        });

    });
}


(function () {

    function getLabelContent(progress) {
        return Math.round(progress) + '%';
    }

    window.initProgressMarkup = function (div, startAt) {

        var wrapper = document.createElement('div');
        wrapper.className = 'with-progress';

        var inner   = document.createElement('div');
        inner.className   = 'inner';

        // progress
        var progressOverlay = document.createElement('div');
        progressOverlay.className = 'progress-overlay';

        // number
        var progressNumber  = document.createElement('span');
        progressNumber.className = 'progress-label';
        progressNumber.innerHTML = getLabelContent((startAt ? startAt : 0));

        progressOverlay.appendChild(progressNumber);

        wrapper.appendChild(inner);
        inner.appendChild(progressOverlay);
        inner.appendChild(div);

        $(div).addClass('progress-element');

        return wrapper;
    };

    window.updateProgress = function (wrapper, progress) {
        // wrapper
        var $w = $(wrapper);

        $w.find('.progress-label').html(getLabelContent(progress));
    };

    window.finishProgress = function (wrapper) {

        var $w = $(wrapper);

        var $ele = $w.find('.progress-element');

        if ($ele.length) {
            $w.replaceWith($ele);
        }
        else {
            $w.find('.progress-overlay').remove();
        }
    };

})();

function ohNo(ev) {
    ev.preventDefault();  
    ev.stopPropagation();
    return false;
}

var Composer = function (ele, options) {

    var self = this;//

    // data fields
    var __fields = {};

    var markAsChanged = function () {
        // console.log('on change called');
        self.markAsChanged();
    };

    $(document).on('story.change', function () {
        self.markAsChanged();
    });

    $(window).on('beforeunload', function () {
        // console.log(self.changed, self.callingOnChange);
        if (self.changed || self.callingOnChange) {
            self.callOnChange();
            return "There is unsaved work.";
        }
    });

    // check for change very 5 seconds
    setInterval(function () {
        
        self.tidyContent();

        if (self.changed) {
            self.callOnChange();
        }
        else {
            console.log('is not changed');
        }

    }, 5000);

    var addPlusOnClick = function (ev, noHide) {
        
        var $t = $(this);
        var o = $t.offset();

        if (self.$widgetToolbar) {
            self.$widgetToolbar.addClass('medium-editor-toolbar-active');
        }

        if (self.options.widgetToolbarPositionHandler) {
            self.options.widgetToolbarPositionHandler.call(self, o);
        }
        else {
            if (self.$widgetToolbar) {
                self.$widgetToolbar.css('left', ((o.left + 25) + 'px')).css('top', (o.top + 'px')).addClass('medium-editor-toolbar-active');
            }
        }

        $e.on('click', onDemandDocumentClick);

        if (!noHide) {
            // console.log('no hideee');
            // hide the plus
            $t.css('display', 'none');
        }

        return false;
    };

    this.setField = function (fName, value) {
        __fields[fName] = value;
        return this;
    };

    // initialize 

    self.options = options;

    var $e      = $(ele);
    var $header = $e.find('.header');

    this.$e      = $e;
    this.$header = $header;
    //
    /* var med = new MediumEditor('.body .content', {
        buttons:  ['bold', 'italic', 'underline', 'anchor', 'header2', 'quote', 'strikethrough', 'unorderedlist', 'orderedlist']
    });*/

    self.$editor = $('.editor');

    // ref to the content div
    var $content = $e.find('.body').find('.content');

    self.$content = $content;

    /// make sure all the paragraph have a class name
    $content.on('keydown', function (ev) {
        /*if (ev.keyCode == 13) {
            
            $(this).find('p').each(function () {
                var $t = $(this);

                if (!$t.hasClass('part')) {
                    console.log('init part on enter', this.innerHTML);
                    self.initPart(this);
                }
            });

            // tidy
            self.tidyContent();
        }*/
        // callOnChange();

    }).on('focus', function () {
        self.hidePseudoPart();
    }).on('paste', function () {
        // console.log('on paste');
        
        setTimeout(function () {
            self.tidyContent();
            self.markAsChanged();
        }, 100);
    }).on('keypress', function () {
        //  mark as change
        self.markAsChanged();
    }).focusout(function () {
        self.markAsChanged();
    });

    ///
    window.addEventListener("dragover",function(e){
        e = e || event;
        e.preventDefault();
    },false);

    window.addEventListener("drop",function(e){
        e = e || event;
        e.preventDefault();
    },false);

    // $content.on('dragover', ohNo).on('dragleave', ohNo).on('drop', ohNo);

    if (options.widgets) {

        if (!options.noPlus) {
            // add the plus
            var addPlus = document.createElement('button');
            addPlus.className = 'widget-add-trigger places-search-denied';
            addPlus.id        = 'widget-add-trigger';
            addPlus.innerHTML = '<i class="fa fa-plus"></i>';

            //
            addPlus.onmouseover = null;

            // add style
            this.$addPlus = $(addPlus);
            // add on click
            this.$addPlus.on('click', addPlusOnClick);

            // add addplus to body
            $('body').append(addPlus);
        }

        var onDemandDocumentClick = function () {
                
            //
            if (self.$addPlus) {
                self.$addPlus.css('display', 'none');
            }

            if (self.$widgetToolbar) {
                self.$widgetToolbar.removeClass('medium-editor-toolbar-active');
            }

            // $(this).off('click', onDemandDocumentClick);

            return false;
        };

        // widget toolbar
        var widgetToolbar       = document.createElement('div');
        widgetToolbar.className = 'medium-editor-toolbar medium-toolbar-arrow-bottom';
        //widgetToolbar.id        = 'widget-add-toolbar';
        this.$widgetToolbar     = $(widgetToolbar);


        // listener for widget button click
        var onWidgetButtonClick = function (ev) {
            
            // prevent default
            ev.preventDefault();
            ev.stopPropagation();

            var widgetIndex = this.getAttribute('data-widget-index');

            if ((undefined === widgetIndex) || (null === widgetIndex)) {
                return false;
            }

            /// trigger
            if ((self.options.widgets[widgetIndex].onClick) && 
                (typeof self.options.widgets[widgetIndex].onClick === 'function')) 
            {
                self.options.widgets[widgetIndex].onClick.call(self, ev, widgetToolbar, self.options.widgets[widgetIndex]);
            }

            // onDemandDocumentClick();

            // $('#widget-add-toolbar').removeClass('medium-editor-toolbar-active');

            return false;
        };

        

        var resetWidgetToolbar = function () {
            var $w = $(widgetToolbar);
            $w.find('div').css('display', 'none');
            $w.find('ul').css('display', 'block');
            return false;
        };

        var buttonUl = document.createElement('ul');
        buttonUl.className = 'medium-editor-toolbar-actions clearfix';
        // var i = 0;

        for (var wi in options.widgets) {

            var w = options.widgets[wi];
            var button = w.getButton();

            button.setAttribute('data-widget-index', wi);

            /// add click listener
            $(button).on('click', onWidgetButtonClick);

            var li = document.createElement('li');
            li.appendChild(button);

            buttonUl.appendChild(li);

            if (w.getControlElement) {
                var e = w.getControlElement(this);
                var a = document.createElement('a');
                
                a.innerHTML = 'x';
                a.href      = '#';
                a.onclick   = resetWidgetToolbar;

                // append the a
                e.appendChild(a);

                widgetToolbar.appendChild(e);
            }

            // i++;
        }

        widgetToolbar.appendChild(buttonUl);

        // append to body
        document.body.appendChild(widgetToolbar);


        // med
        $content.on('mouseover', function (ev) {

            var $addPlus = $('#widget-add-trigger');

            if ($addPlus.length) {
                // check if any active toolbar, if any, dont show the plus
                if ($('.medium-editor-toolbar-active').length) {
                    $addPlus.css('display', 'none');
                    return false;
                }
            }


            $(this).find('.part').each(function paragraphOffsetCompare(index) { 
                var $t = $(this);
                var o  = $t.offset();
                var h  = $t.height();

                var endY = o.top + h;

                if (endY > (ev.pageY + 5)) {
                    
                    if ($addPlus.length) {
                        $addPlus.css('left', (o.left));
                        $addPlus.css('top', (endY - 30));
                        $addPlus.css('display', 'inline-block');
                    }

                    self.currentParagraphIndex = index;

                    return false;
                }
            });
        }).on('keyup', function () {
            $('#widget-add-trigger').css('display', 'none');
        });

        /*
            .on('mouseleave', function () {
            $('#widget-add-trigger').css('display', 'none');
        })
        */

        //
        if (!this.options.noFitvids) {
            $content.fitVids();
        }
    }


    ////// add cover button
    /* $e.find('.cover-add').on('click', function () {


        if (typeof self.options.onCoverButtonClick === 'function') {
            self.options.onCoverButtonClick.call(this);
        }
        else {
            var mu = new MagicUploader({
                onSelect: function (files) {
                    self.setCoverImage(files[0]);
                }
            });

            //
            mu.open();
        }

        return false;
    }); */

    var hideToolbarHandler = function (ev) {

        ev.stopPropagation();
        ev.preventDefault();

        self.hideToolbar();
        $(this).off('click', hideToolbarHandler);
        return false;
    };

    //
    var showToolbarHandler = function (ev) {
        
        // hide all other active toolbar
        $('.medium-editor-toolbar').removeClass('medium-editor-toolbar-active');

        // alert('cover add called');
        self.options.onCoverButtonClick.call(this, ev, self);
        addPlusOnClick.call(this, ev, true);

        $e.on('click', hideToolbarHandler);

        return false;
    };

    var coverAddEvt = 'click';

    if (this.options.coverControlHover) {
        coverAddEvt = 'mouseover';
    }

    $e.find('.cover-add').on(coverAddEvt, showToolbarHandler);

    //
    if ($header.length) {
        $header[0].addEventListener('dragover', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();
            ev.dataTransfer.dropEffect = 'copy';
            $(this).addClass('image-dragged');
        }, false);

        $header[0].addEventListener('dragleave', function (ev) {
            $(this).removeClass('image-dragged');
        });

        $header[0].addEventListener('drop', function (ev) {
            ev.stopPropagation();
            ev.preventDefault();

            $(this).removeClass('image-dragged');

            //
            self.$e.find('.cover-delete').click();

            var files = ev.dataTransfer.files;
            self.setCoverImage(files[0]);

        }, false);
    }

    /// expand
    $e.find('.cover-expand').on('click', function () {
        $e.find('.cover-change').removeClass('active');
        $(this).addClass('active');
        $e.addClass('cover-background');

        //
        var $img = $e.find('.cover').find('img');

        if ($img.length) {
            $img.css('margin-top', 0);
            self.setHeaderMinHeight($img.width(), $img.height());
        }

        markAsChanged();

        return false;
    });

    $e.find('.cover-compress').on('click', function () {
        $e.find('.cover-change').removeClass('active');
        $(this).addClass('active');
        $e.removeClass('cover-background');

        $e.find('.header').css('min-height', '');

        markAsChanged();

        return false;
    });

    $e.find('.cover-delete').on('click', function () {
        
        $header.find('.cover').html('').css('background-image', '');
        
        $e.find('.cover-change').removeClass('active');
        $e.removeClass('with-cover');
        $e.find('.cover').find('img').css('margin-top', 0);
        
        //
        // $e.find('.cover-add').css('display', 'inline-block');

        // remove 
        $e.removeClass('cover-background');

        $header.css('min-height', '');

        markAsChanged();

        return false;
    });

    if (this.options.widgets && !this.options.noWidget) {
        /// load the svgs
        var floatLeftIcon = document.createElement('img');
        floatLeftIcon.setAttribute('data-src', 'image-float-left.svg');
        floatLeftIcon.setAttribute('data-class', 'svg-icon-left svg-icon-holder');
        floatLeftIcon.className = 'icon-svg';

        var floatRightIcon = document.createElement('img');
        floatRightIcon.setAttribute('data-src', 'image-float-right.svg');
        floatRightIcon.setAttribute('data-class', 'svg-icon-right svg-icon-holder');
        floatRightIcon.className = 'icon-svg';

        var floatCenterIcon = document.createElement('img');
        floatCenterIcon.setAttribute('data-src', 'image-float-center.svg');
        floatCenterIcon.setAttribute('data-class', 'svg-icon-center svg-icon-holder');
        floatCenterIcon.className = 'icon-svg';

        // append
        $e.append(floatCenterIcon).append(floatRightIcon).append(floatLeftIcon);
    }
    ///


    $e.find('.header .cover img').on('load', function () {
        // alert(this.src);
        var $t = $(this);
        self.setHeaderMinHeight($t.width(), $t.height());
        // $t.css('display', 'none');
    });

    $(window).on('resize', function () {
        var $t = $e.find('.header .cover img');

        if ($t.length) {
            self.setHeaderMinHeight($t.width(), $t.height());
        }
    });


    if (self.options.useMediumEditor && self.$e.find('.body .content').length) 
    {
        var contentEle = self.$e.find('.body .content')[0];
        self.mediumEditor = new MediumEditor(contentEle, {});
    }

    $e.find('.title, .meta').on('blur', function () {
            
        markAsChanged();

        var text = this.textContent.replace(/ /g,'');

        if (!text.length) {
            this.innerHTML = this.getAttribute('data-placeholder');
            $(this).addClass('placeholder');
        }

    }).on('click', function (ev) {

        var text = this.textContent.trim();

        if (text == this.getAttribute('data-placeholder')) {
            /*this.innerHTML = ' ';
            $(this).removeClass('placeholder');
            this.focus();*/

            $(this).selectText();
            ev.preventDefault();
            return false;
        }

    }).each(function () {
        var text = this.textContent.trim();

        if (!text.length) {
            this.innerHTML = this.getAttribute('data-placeholder');
            $(this).addClass('placeholder');
        }
    });

    /*.on('click', function () {
        this.focus();
        return false;
    });*/

    /* $e.find('.meta').on('blur', function () {
        callOnChange();
    }); */


    var selectWhenClick = function () {
        $(this).selectText();
    };

    $content.find('.placeholder').each(function () {
        this.innerHTML = this.getAttribute('data-placeholder');
        
        $(this).on('click', selectWhenClick);

    }).attr('contenteditable', true);

    $content.on('keydown', function () {
        var $t = $(this).find('.placeholder');

        if ($t.hasClass('placeholder')) {
            $t.removeClass('placeholder');
            $t.removeAttr('data-placeholder');
            $t.off('click', selectWhenClick);
        }
    });

    $content.find('> .part').each(function () {
        $(this).addClass('hey');
        $(this).attr('data-hey', 1);
    });
    
    /*if ($e.find('.cover img').length) {
        self.coverPositionEnable($e.find('.cover img')[0]);
    }*/

    if (!$('.saving-mark').length) {
        var savingMark = document.createElement('span');
        savingMark.className = 'saving-mark';
        savingMark.innerHTML = 'Saving...';
        $('body').append(savingMark);
    }

    this.$savingMark = $(savingMark);

    //
    initSvgIcons($e[0], function () {

        $content.find('.part').each(function () {
            self.initPart(this);
        });

        $content.find('.part-psedo').each(function () {
            if (!this.innerHTML) {
                $(this).remove();
            }
        });

        $content.on('blur', function () {
            markAsChanged();
        }).find('.w').each(function () {
            self.initWidget(this);
        });
    });
};

Composer.prototype.lastCallOnChange = 0;

/// 
Composer.prototype.callOnChange = function () {

    var that = this;

    var cb = function () {
        that.callingOnChange = false;
        that.$savingMark.removeClass('active');
    };

    // only call onChange at max every 5 seconds;

    var now = new Date().getTime();

    if (this.options.onChange) {
        this.callingOnChange = true;
        this.$savingMark.addClass('active');
        this.options.onChange(this, cb);  
    }

    this.changed = false;
};

Composer.prototype.markAsChanged = function () {
    this.changed = true;
};

Composer.prototype.exportAsObject = function () {
    
    // tidy the content first
    this.tidyContent();

    /*var hasBinary = this.$e.find('.body .content p').find('.binary-image').length;

    if (hasBinary) {
        return false;
    }*/

    if (this.$content.find('.part-working').length) {
        /// console.log('part working exists');
        return false;
    }

    var obj = {};

    obj.title    = this.$e.find('.title').html().trim();
    obj.subtitle = this.$e.find('.meta').html().trim();

    var contentHtml = document.createElement('div');

    this.$e.find('.body .content .part').each(function () {

        if ($(this).hasClass('part-pseudo')) {
            return;
        }

        var div = document.createElement('div');

        if (this.getAttribute('data-html')) {
            div.innerHTML = this.getAttribute('data-html');
        }
        else {
            div.innerHTML = this.innerHTML;
        }

        //
        // console.log('part inner', div.innerHTML);
        // remove all controls
        $(div).find('.w-controls, .widget-add-trigger').remove();

        if (this.tagName.toLowerCase() == 'p') {
            var p = document.createElement('p');
            p.className = this.className;
            p.innerHTML = div.innerHTML;

            contentHtml.appendChild(p);
        }
        else if ((this.tagName.toLowerCase() == 'h3') || (this.tagName.toLowerCase() == 'h4') || (this.tagName.toLowerCase() == 'h5')) {
            var newEle = document.createElement(this.tagName.toLowerCase());
            newEle.className = this.className;
            newEle.innerHTML = this.innerHTML;

            contentHtml.appendChild(newEle);
        }
        else if (this.tagName.toLowerCase() == 'hr') {
            console.log('take a rule');
            var newHr = document.createElement('hr');
            newHr.className = this.className;

            contentHtml.appendChild(newHr);
        }
        else if (this.tagName.toLowerCase() == 'blockquote') {
            var newBlock = document.createElement('blockquote');
            newBlock.className = this.className;
            newBlock.innerHTML = this.innerHTML;
            contentHtml.appendChild(newBlock);
        }
        else {
            
            /*var widgetAttr = '';

            if (this.getAttribute('data-widget-type')) {
                widgetAttr = ' data-widget-type="' + this.getAttribute('data-widget-type') + '"';
            }*/
            
            var wDiv = document.createElement('div');
            wDiv.className = this.className;
            wDiv.setAttribute('data-widget-type', this.getAttribute('data-widget-type'));
            
            if (this.getAttribute('data-html')) {
                wDiv.setAttribute('data-html', this.getAttribute('data-html'));
            }

            wDiv.innerHTML = div.innerHTML;
            contentHtml.appendChild(wDiv);
        }
    });
        
    //
    // console.log('content html', contentHtml);

    //
    obj.content = contentHtml.innerHTML;

    // cover
    var $cover = this.$e.find('.header .cover img');

    if ($cover.length) {

        var cover = {};
        cover.url = $cover.attr('src');

        if (this.$e.hasClass('cover-background')) {
            cover.asBackground = true;
        }
        else {
            cover.asBackground = false;
        }

        cover.y     = $cover.attr('data-y') ? parseInt($cover.attr('data-y')) : 0;
        cover.margin = $cover.css('margin-top');

        //
        obj.cover = cover;
    }
    else {
        // video
        var cover = {type: 'embedded'};

        $cover = this.$e.find('.header .cover .embedded');

        if ($cover.length) {
            cover.url     = $cover.attr('src');
            cover.service = $cover.attr('data-service');

            if (this.$e.hasClass('cover-background')) {
                cover.asBackground = true;
            }
            else {
                cover.asBackground = false;
            }

            obj.cover = cover;
        }
    }

    console.log('exported object', obj);

    return obj;
};

// default current paragraph index
Composer.prototype.currentParagraphIndex = 0;

// 
Composer.prototype.initWidget = function (ele) {
    if (ele.innerHTML.trim() == '') {
        $(ele).remove();
        return;
    }

    ele.appendChild(this.createWidgetControl(ele.getAttribute('data-widget-type')));
    ele.setAttribute('contenteditable', false);
    ele.setAttribute('draggable', false);

    var wid = ele.getAttribute('data-widget-type');
    console.log('type', wid);

    if (!this.options.widgets[wid]) {
        $(ele).remove();
        return;
    }

    if ((typeof this.options.widgets[wid].revise === 'function')) {
        this.options.widgets[wid].revise(ele);
    }
};

//
Composer.prototype.coverPositionEnable = function (img) {

    var that = this;

    var $i = $(img);

    $i.on('mousedown', function coverPosMouseDown(ev) {
        this.setAttribute('data-moving', 1);
        this.setAttribute('data-y', ev.pageY);
        ev.preventDefault();
    });

    $i.on('mousemove', function coverPosMouseMove(ev) {
        
        ev.preventDefault();

        if (this.getAttribute('data-moving') != 1) {
            return;
        }

        var cy = this.getAttribute('data-y');
        var dy = (ev.pageY - cy);

        var oy = parseFloat(this.style.marginTop);
        oy = (oy ? oy : 0) ;

        var newY = (oy + dy);
        var $t = $(this);

        var h  = $t.height();
        var pH = $t.parent().height();

        if (newY > 0) {
            newY = 0;
        } else if (Math.abs(newY) > (h - pH)) {
            newY = -(h - pH);
        }

        $t.css('margin-top', newY + 'px');

        $t.attr('data-y', ev.pageY);
    });

    $i.on('mouseup', function coverPosMouseUp() {
        this.setAttribute('data-moving', 0);
        that.markAsChanged();
    });

    $i.on('mouseleave', function coverPosMouseLeave() {
        this.setAttribute('data-moving', 0);
        that.markAsChanged();
    });

    $i.on('dragstart', function () {
        return false;
    });
};

Composer.prototype.setHeaderMinHeight = function (width, height) {
            
    /* if (!this.$e.hasClass('cover-background')) {
        return false;
    }*/


    /*if (!viewport[0]) {
        return false;
    }*/
    var minH;

    if (this.$e.hasClass('cover-background')) {
        // console.log('set min height with cover is background');
        var viewport = getViewport();
        minH = (viewport[1] * (width / viewport[0])) - 50;
        this.$e.find('.header').css('min-height', Math.round(minH) + 'px');
    }
    else {
        // console.log('set min height with NORMAL cover');
        var divWidth = this.$e.find('.header .cover').width();
        minH = ((divWidth/width) * height) - 50;
        this.$e.find('.header .cover').css('min-height', Math.round(minH) + 'px');
    }
    //console.log('setHeaderMinHeight', viewport, minH);
    // console.log('header ', self.$e.find('.header').length);
    
    // this.$e.find('.header .cover').css('min-height', Math.round(minH) + 'px');
};

Composer.prototype.setCoverImage = function (file, extraObject) {

    if (!file) {
        return;
    }

    if (this.options.coverHandler) {
        this.options.coverHandler.call(this, file, extraObject);
        return;
    }

    var that = this;
    
    this.$e.find('.header').find('.cover').html('').css('background-image', '');

    if (file.tagName) // a HTML element
    {
        this.$e.find('.header').find('.cover').append(file);

        this.$e.addClass('with-cover');

        if (this.$header.hasClass('cover-background')) {
            this.$e.find('.cover-expand').addClass('active');
        }
        else {
            this.$e.find('.cover-compress').addClass('active');
        }

        // fit vids
        if (!this.options.noFitvids) {
            this.$e.find('.header').find('.cover').fitVids();
        }

        if (that.options.coverChangeCallback) {
            that.options.coverChangeCallback(file);
        }
    }
    else {

        if (this.options.coverChangeBefore) {
            this.options.coverChangeBefore.call(this);
        }

        if (typeof file !== 'string') {

            imageFromFile(file, 1600, 1600, function (image, f) {

                var withProgress = initProgressMarkup(image);
                // image.setAttribute('crossOrigin', "anonymous");
                
                var $e = that.$e;

                $e.find('.header').find('.cover').append(withProgress);
                var src = file;
                var fr = new FileReader();
                fr.onload = function () {
                    $e.find('.header').find('.cover').css('background-image', 'url(' + fr.result + ')');
                };
                fr.readAsDataURL(src);

                $e.addClass('with-cover');

                if (that.$header.hasClass('cover-background')) {
                    $e.find('.cover-expand').addClass('active');
                }
                else {
                    $e.find('.cover-compress').addClass('active');
                }

                if (that.options.beforeUploadHandler) {
                    that.options.beforeUploadHandler.call(that, image);
                }

                // now upload
                var transloadit = new TransloaditXhr({
                    authKey: getTransloadItKey(),
                    templateId: "68a28300edf811e3b22bb576fd84875d",

                    successCb: function(fileObj) {
                        // console.log('cover uploaded success', fileObj);

                        if (image && fileObj['original.jpg']) {
                            // console.log('Now replace canvas with the uploaded image');                    
                                
                            $(image).load(function () {
                                that.setHeaderMinHeight($(this).width(), $(this).height());
                            });

                            image.src = fileObj['original.jpg'][0].ssl_url;

                            $e.find('.header').find('.cover').css('background-image', 'url(' + image.src + ')');

                            that.coverPositionEnable(image);
                            that.markAsChanged();

                            if (that.options.coverChangeCallback) {
                                that.options.coverChangeCallback(image);
                            }
                        }

                        finishProgress(withProgress);
                    },
                    progressCb: function (progress) {
                        updateProgress(withProgress, progress);
                    },
                    errorCb: function(error) {
                        
                    }
                });

                transloadit.uploadFile(f);
            });
        } 
        else {

            var image = document.createElement('img');

            $(image).load(function () {
                that.setHeaderMinHeight($(this).width(), $(this).height());
            });

            image.src = file;
            
            var withProgress = initProgressMarkup(image);
            var $e = that.$e;

            $e.find('.header').find('.cover').append(withProgress);
            $e.find('.header').find('.cover').css('background-image', 'url(' + image.src + ')');

            $e.addClass('with-cover');

            if (that.$header.hasClass('cover-background')) {
                $e.find('.cover-expand').addClass('active');
            }
            else {
                $e.find('.cover-compress').addClass('active');
            }

            if (that.options.beforeUploadHandler) {
                that.options.beforeUploadHandler.call(that, image);
            }

            var transloadit = new TransloaditXhr({
                authKey: getTransloadItKey(),
                templateId: "926dac00c90411e3bddc9d5ca01e5705",

                successCb: function(fileObj) {

                    if (image && fileObj['original.jpg']) {
                        // console.log('Now replace canvas with the uploaded image');                    
                        
                        image.src = fileObj['original.jpg'][0].ssl_url;
                        
                        $e.find('.header').find('.cover').css('background-image', 'url(' + image.src + ')');

                        that.coverPositionEnable(image);

                        that.markAsChanged();

                        if (that.options.coverChangeCallback) {
                            console.log('call cover change callback', that.options.coverChangeCallback);
                            that.options.coverChangeCallback(image);
                        }
                    }

                    finishProgress(withProgress);
                },
                progressCb: function (progress) {
                    updateProgress(withProgress, progress);
                },
                errorCb: function(error) {
                }
            });

            transloadit.importFile(file);
        }

    }
    
};

// add element after the current paragraph
Composer.prototype.addElement = function (ele, replacePseudo) {
    /*var self = this;

    this.$editor.find('p').each(function (index) {
        //if (index == self.currentParagraphIndex) {
            if (!toReplace) {
                $(this).after(ele);
            }
            else {
                $(toReplace).replaceWith(ele);
            }
        // }
    });*/
    // this.$content.find('.part-pseudo').length

    if (replacePseudo) {
        // console.log('YES, Pseudo');
        $(this.pseudoPart).after(ele);
    }
    else {
        // console.log('NO. pseudo');
        var self = this;

        this.$content.find('.part').each(function (index) {
            if (index == self.currentParagraphIndex) {
                $(this).after(ele);
            }
        });
        
        //this.$content.append(ele);
    }

    this.hidePseudoPart();

    // all element off
    $('.medium-editor-toolbar').removeClass('medium-editor-toolbar-active');
};

Composer.prototype.createWidgetControl = function (widgetType) {
    
    var wControls = document.createElement('div');
    wControls.className = 'w-controls places-search-denied';
    wControls.setAttribute('contenteditable', false);

    // remove
    var removeA = document.createElement('button');
    removeA.className = 'btn compose-control control-delete';
    removeA.innerHTML = '<i class="fa fa-times"></i>';
    removeA.onclick   = this.widgetRemoveOnClick;

    // align
    /*var alignLeft = document.createElement('button');
    alignLeft.className = 'btn compose-control w-control-align svg-icon';
    alignLeft.innerHTML = this.$e.find('.svg-icon-left').html();
    alignLeft.onclick   = this.widgetAlignOnClick;
    alignLeft.setAttribute('data-align', 'left'); */
    

    var alignCenter = document.createElement('button');
    alignCenter.className = 'btn compose-control w-control-align active svg-icon';
    alignCenter.innerHTML = this.$e.find('.svg-icon-center').html();
    alignCenter.onclick   = this.widgetAlignOnClick;
    alignCenter.setAttribute('data-align', 'center');

    var alignFull = document.createElement('button');
    alignFull.className = 'btn compose-control w-control-align svg-icon';
    alignFull.innerHTML = this.$e.find('.svg-icon-center').html();
    alignFull.onclick   = this.widgetAlignOnClick;
    alignFull.setAttribute('data-align', 'full');



    //
    ///wControls.appendChild(alignLeft);
    wControls.appendChild(alignCenter);
    wControls.appendChild(alignFull);
    // wControls.appendChild(alignRight);
    //console.log('widget', this.options.widgets, widgetType);
    
    if (this.options.widgets[widgetType] && (typeof this.options.widgets[widgetType].getControls === 'function')) {
        // console.log('yeah there is a get controls function');
        var buttons = this.options.widgets[widgetType].getControls.call(this);

        if (buttons) {
            wControls.appendChild(buttons);
        }
    }

    wControls.appendChild(removeA);

    return wControls;
};

Composer.prototype.widgetAlignOnClick = function (ev) {
    var align = this.getAttribute('data-align');

    if (!align) {
        return false;
    }

    // parent of the button parent is the widget element itself
    var w = this.parentNode.parentNode; 
    
    // remove all the align class
    w.className = w.className.replace(/w-align-(.*)$/, '');
    w.className = w.className.replace(/w100/, '');

    var cls;

    if (align != 'full') {
        cls = 'w-align-' + align;
    }
    else {
        cls = 'w100';
    }

    $(w).addClass(cls);

    // now deactive other other button
    var $t = $(this);

    $t.parent().find('.w-control-align').removeClass('active');
    $t.addClass('active');

    // false
    return false;
};

Composer.prototype.widgetRemoveOnClick = function (ev) {
    // remove event listeners
    // to prevent some memory leak (in theory...)
    $(this.parentNode).find('.compose-control').each(function removeEventListeners() {
        this.onclick = null;
    });

    // remove
    var w = this.parentNode.parentNode;
    w.parentNode.removeChild(w);

    //
    return false;
};

Composer.prototype.addWidget = function (type, ele, replacePseudo) {

    var w = this.options.widgets[type];

    if (!w) {
        return null;
    }

    var p = document.createElement('div');
    // p.className = 'part w w-align-center';

    p.setAttribute('contenteditable', false);
    p.appendChild(ele);

    // class
    $(p).addClass('w').addClass('w-' + type).attr('data-widget-type', type);

    this.initPart(p);

    // console.log('add widget', replacePseudo, p.tagName);

    if (replacePseudo) {
        this.addElement(p, true);
    }
    else {
        this.addElement(p, false);
    }

    // 
    if (w.isDynamic) {
        p.setAttribute('data-html', p.innerHTML);
    }

    p.insertBefore(this.createWidgetControl(type), ele);

    if (!p.nextSibling || (p.nextSibling.tagName.toLowerCase() != 'p'))
    {
        var p2 = document.createElement('p');
        p2.innerHTML = '<br>';
        this.initPart(p2);
        this.addElement(p2);

        /// 
        p2.focus();
    }
    
    return p;
};

Composer.prototype.setDark = function (onoff) {

    if (onoff) {
        this.$e.addClass('dark');
    }
    else {
        this.$e.removeClass('dark');
    }

    return this;
};

Composer.prototype.initPart = function (p) {

    if (!p || this.isPart(p)) {
        return;
    }

    var $p = $(p);

    if (!$p.hasClass('part')) {
        $p.addClass('part');
        // .addClass('clearfix');
    }

    var self = this;

    if ((typeof this.options.onFileDragOver === 'function') && (typeof this.options.onFileDrop === 'function')) 
    {
        this.initDragAndDrop(p);
    }

    $p.on('click', function () {
        this.focus();
    });

    $p.data('part-init', true);
};

Composer.prototype.isPart = function (ele) {
    if ($(ele).data('part-init')) {
        return true;
    }
    return false;
};

Composer.prototype.initDragAndDrop = function (ele, onlyDrop, replace) {
    
    var self = this;
    
    
    ele.addEventListener('dragover', function (ev) {

        self.options.onFileDragOver.call(self, ev, this);
        
        ev.stopPropagation();
        ev.preventDefault();
        ev.dataTransfer.dropEffect = 'copy';

        return false;

    }, false);
    

    ele.addEventListener('drop', function (ev) {
        ev.stopPropagation();
        ev.preventDefault();

        self.options.onFileDrop.call(self, ev, this);
        self.hidePseudoPart();

        return false;
    }, false);
    
    $(ele).addClass('has-drag-and-drop');
    // console.log('init drag and drop', ele.innerHTML);
};

Composer.prototype.placeCaretAtEnd = function (el) {
    
    if (!el) { 
        el = this.$content[0];
    }

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

Composer.prototype.tidyContent = function () {

    var self = this;

    if (!this.$content[0]) {
        return;
    }

    $(this.$content[0].childNodes).each(function () {

        if (this.nodeType == 3) {
            var p = document.createElement('p');
            p.innerHTML = this.wholeText;
            
            self.initPart(p);

            $(this).replaceWith(p);   
            return;
        }

        if (!$(this).hasClass('part')) {
            // if it's a header
            if ((this.tagName.toLowerCase() == 'h3') || (this.tagName.toLowerCase() == 'h4') || (this.tagName.toLowerCase() == 'h5')) {
                self.initPart(this);

                switch (this.tagName.toLowerCase()) {
                    case 'h3':
                        $(this).addClass('h1');
                        break;
                    case 'h4':
                        $(this).addClass('h2');
                        break;
                    case 'h5':
                        $(this).addClass('h3');
                        break;
                }

            }
            else if (this.tagName.toLowerCase() == 'blockquote') {
                self.initPart(this);
            }
        }
    });

    this.$content.find('> p').each(function () {
        // console.log('now init part for this p');
        self.initPart(this);
    });

    this.$content.find('> p.part').each(function () {
        // console.log('text content length', this.textContent.length);
        var textContent = this.innerHTML.replace(/ /g,'').replace(/(\r\n|\n|\r)/gm,"");
        
        if ((this.tagName.toLowerCase() == 'p')  && !textContent.length)
        {
            this.parentNode.removeChild(this);
        }

        // this is a hot fix for CHROME pasting
        $(this).find('> span').each(function () {
            var textNode = document.createTextNode(this.textContent);
            $(this).replaceWith(textNode);
            self.placeCaretAtEnd(textNode);
        });
    });

    var $last = this.$content.children().last();

    // a widget
    if ($last.hasClass('w')) {
        var p = document.createElement('p');
        this.initPart(p);
        this.$content.append(p);
    }   
};

Composer.prototype.insertPseudoPart = function (beforeElement) {

    if (!this.pseudoPart) {
        this.pseudoPart = document.createElement('p');
        this.pseudoPart.className = 'part part-pseudo image-dragged';
        // this.pseudoPart.innerHTML = 'DROP HERE';
        
        if ((typeof this.options.onFileDragOver === 'function') && (typeof this.options.onFileDrop === 'function')) 
        {
            this.initDragAndDrop(this.pseudoPart, false);
        }
    }
    $(this.pseudoPart).css('display', 'block');
    // add
    $(beforeElement).after(this.pseudoPart);
};

Composer.prototype.hidePseudoPart = function () {
    if (this.pseudoPart) {
        $(this.pseudoPart).css('display', 'none');
    }
};

Composer.prototype.markPartAsWorking = function (part, finish) {
    if (!finish) {
        $(part).addClass('part-working');
    }
    else {
        $(part).removeClass('part-working');
    }
};

Composer.prototype.hideToolbar = function () {
    this.$widgetToolbar.removeClass('medium-editor-toolbar-active');
};


