
$(document).ready(function () {
    
    var comp;
    var __saving   = false;
    var __lastSave = 0;

    var __id;


    var __settingCover = false;


    if (window.__storyId) {
        __id = window.__storyId;
    }

    // 
    if (__id) {
        $('article.single').addClass('edit-mode');
    }
    
    function saveStory(story, cb) {

        var now = new Date().getTime();

        //
        if (__saving) {
            
            cb(false);
            return false;
        }

        __saving = true;

        var post = {};

        post.title    = story.title;
        post.subtitle = story.subtitle;
        post.content  = story.content;

        if (__id) {
            post.id = __id;
        }

        if (story.cover) {
            var cv = story.cover;
            var $img = $('article.single .header .cover img');

            if ($img.length) {
                cv.height = $img.height();
                cv.width  = $img.width();
            }

            // 
            post.cover = JSON.stringify(cv);
        }
        TcClient.post('/story/save', post, function (rspText) {
                __saving = false;

                try {

                    var rsp = JSON.parse(rspText);

                    if (rsp && rsp.result && rsp.id) {

                        if (!__id) {
                            __id = rsp.id;

                            if (window.history) {
                                window.history.pushState({storyId: __id}, post.title, '/story/compose/' + __id);
                            }
                        }
 
                        if (!$('article.single').hasClass('edit-mode')) {
                            $('article.single').addClass('edit-mode');
                        }

                        __lastSave = new Date().getTime();

                        if (cb) {
                            cb(rsp);
                        }
                    }
                    else {
                        if (cb) {
                            cb(false);
                        }
                    }
                } catch (e) {
                    if (cb) {
                        cb(false);
                    }
                }
            }, 
            function () {
                __saving = false;
                cb(false);
            }
        );
    }

    /*$(document).on('story.change', function () {
        var story = comp.exportAsObject();

        if (story) {
            saveStory(story);
        }
    });*/

    if (window.__cover) {

        var cover = window.__cover;

        if (cover && cover.url) {
            $('article.single').addClass('with-cover');
        }

        if (cover && cover.asBackground) {
            $('article.single').addClass('cover-background');
        }

        // console.log('cover', cover, cover.url, cover.type);

        if (cover.url && (cover.type == 'embedded')) {
            // console.log('embedded cover');

            var parser = new EmbedMediaParser();
            var html   = parser.getEmbedCode(0, 0, cover.url, cover.service);
            // console.log('embed html', html);
            $('.header .cover').html(html).fitVids();

        } else if (cover.url) {
            var coverImg = document.createElement('img');
            coverImg.src = cover.url;

            if (cover.y) {
                coverImg.setAttribute('data-y', cover.y);
            }

            if (cover.margin) {
                coverImg.style.marginTop = cover.margin;
            }

            // $('.header .cover').append(coverImg);
        }
    }

    ///
    comp = new Composer($('.single')[0], {

        onCoverButtonClick: function () {
            onlyUseHeaderCover(true);
        },
        onChange: function (composer, cb) {
            var story = composer.exportAsObject();

            if (story) {
                saveStory(story, cb);
            }
            else {
                cb(false);
            }
        },
        onFileDragOver: function (ev, partEle) {

            var $el = $(partEle);

            /* if ($el.hasClass('drop-after')) {
                console.log('....', partEle.innerHTML);
                return false;
            }

            this.$e.find('.drop-after').removeClass('drop-after');
            $el.addClass('drop-after');*/

            this.insertPseudoPart(partEle);
        },
        coverChangeCallback: function () {
            onlyUseHeaderCover(false);
        },
        onFileDrop: function (ev) {

            //
            var self = this;


            var pset = new Photoset();

            ev.stopPropagation();
            ev.preventDefault();

            var files = ev.dataTransfer.files; // FileList object.
            // console.log('now set file list', files.length, files[0]);

            pset.setFileList(files, function (photoset) {
                
                // process
                var part;

                photoset.process(function (div) {
                    
                    part = self.addWidget('photoset', div, true);
                    self.markPartAsWorking(part, false);
                    setChange();

                }, function () {
                    if (part) {
                        self.markPartAsWorking(part, true);
                    }
                });
            });

        },
        widgets: {
            photoset: {
                isDynamic: false,
                //  upload image
                getButton: function () {
                    var btn = document.createElement('button');
                    btn.innerHTML = '<i class="fa fa-picture-o"></i>';
                    return btn;
                },
                onClick: function (ev, toolbar) {

                    /* $('#image-modal').modal({modalOverflow: true});
                    $('#image-modal').data('photoset', new Photoset());
                    
                    // reset file list
                    __files = null; */
                            // li    ul       toolbar
                    $(toolbar).find('ul').css('display', 'none');
                    $(toolbar).find('.medium-imagesearch-bar').css('display', 'block');

                    $('.toolbar-photoset-textinput').focus();

                    return;
                },
                getControls: function () {

                    // console.log('photoset get controls');

                    var shuffButt = document.createElement('button');
                    shuffButt.className = 'btn compose-control';
                    shuffButt.innerHTML = '<i class="fa fa-refresh"></i>';
                    shuffButt.onclick   = function () {

                        // widget element
                        var $w    = $(this).parent().parent();
                        var $pset = $w.find('.photoset-grid-custom');

                        if ($pset.length) {
                            
                            var newDiv = document.createElement('div');
                            newDiv.className = 'photoset-grid-custom';
                            var $imgs  = $pset.find('img');
                            var imgLen = $imgs.length;

                            if (imgLen <= 1) {
                                return false;
                            }

                            $imgs.each(function () {

                                var $t = $(this);
                                $t.removeAttr('width').removeAttr('height').css('margin', '');
                                newDiv.appendChild(this);
                            });

                            // new set
                            var layoutStr = getImageGridLayout(imgLen);
                            $(newDiv).photosetGrid({
                                // Set the gutter between columns and rows
                                gutter: '0px',
                                // Manually set the grid layout
                                layout: layoutStr
                            });

                            $pset.replaceWith(newDiv);

                            $w.height($(newDiv).height());
                        }

                        return false;
                    };

                    return shuffButt;
                },
                getControlElement: function (composer) {

                    var barDiv = document.createElement('div');
                    barDiv.className = 'medium-editor-toolbar-form-anchor medium-imagesearch-bar';

                    // input
                    var textInput         = document.createElement('input');
                    textInput.type        = 'text';
                    textInput.placeholder = 'Search for images';
                    textInput.className   = 'toolbar-photoset-textinput';

                    this.textInput = textInput;

                    $(textInput).on('keydown', function (ev) {
                        if (ev.keyCode == 13) {
                            var val = this.value;

                            if (!val) {
                                return false;
                            }

                            $('#image-search-text').val(val);
                            $('#image-search-button').click();

                            // __settingCover = false;
                            
                            //
                            openImageSearchModal();

                            composer.hideToolbar();

                            return false;
                        }
                    });

                    barDiv.appendChild(textInput);

                    return barDiv;
                }
            },
            embed: {
                isDynamic: false,
                getButton: function () {
                    var btn = document.createElement('button');
                    btn.innerHTML = '<i class="fa fa-film"></i>';
                    return btn;
                },
                getControlElement: function (composer) {

                    var div = document.createElement('div');
                    div.className = 'medium-editor-toolbar-form-anchor medium-media-control';

                    var input = document.createElement('input');
                    input.type = 'text';
                    input.setAttribute('placeholder', 'Type or paste a link (youtube, vimeo, soundcloud...)');
                    input.className = 'toolbar-embed-textinput';

                    $(input).on('keydown', function (ev) {

                        if (!this.value) {
                            return true;
                        }

                        if (!validateURL(this.value)) {
                            return false;
                        }

                        if (ev.keyCode == 13) {

                            ev.preventDefault();

                            var parser    = new EmbedMediaParser(this.value);
                            var embedCode = parser.getEmbedCode(560, 315); 

                            if (embedCode) {
                                var div = document.createElement('div');
                                
                                if (typeof embedCode !== 'object') {
                                    div.innerHTML = embedCode;
                                }
                                else {
                                    div.appendChild(embedCode);
                                }
                                
                                if (!__settingCover) {
                                    composer.addWidget('embed', div);
                                    $(div).fitVids();
                                }
                                else {
                                    composer.setCoverImage(div);
                                }
                            }
                            composer.hideToolbar();
                            return false;
                        }

                        return true;
                    });

                    //
                    div.appendChild(input);

                    return div;
                },
                onClick: function (ev, toolbar) {
                    $(toolbar).find('ul').css('display', 'none');
                    $(toolbar).find('.medium-media-control').css('display', 'block');
                    $('.toolbar-embed-textinput').focus();
                }
            },
            pinterest: {
                isDynamic: true,
                getButton: function () {
                    var btn = document.createElement('button');
                    btn.innerHTML = '<i class="fa fa-pinterest"></i>';
                    return btn;
                },
                getControlElement: function (composer) {

                    var div = document.createElement('div');
                    div.className = 'medium-editor-toolbar-form-anchor medium-pinterest-control';

                    var input = document.createElement('input');
                    input.type = 'text';
                    input.setAttribute('placeholder', 'Type or paste a link to your Pinterest profile or board');
                    input.className = 'toolbar-pinterest-textinput';

                    div.appendChild(input);

                    $(input).on('keydown', function (ev) {
                        if (ev.keyCode == 13) {

                            var url = this.value;

                            if (!validateURL(url)) {
                                return false;
                            }

                            if (url[(url.length - 1)] == '/') {
                                url = url.substring(0, (url.length - 1));
                            }

                            var div = document.createElement('div');

                            var a = document.createElement('a');
                            
                            // user or board
                            var partNumber = url.split('/').length;

                            if (partNumber == 4) {
                                a.setAttribute('data-pin-do', 'embedUser');
                            }
                            else if (partNumber == 5) {
                                a.setAttribute('data-pin-do', 'embedBoard');
                            }
                            else {
                                return false;
                            }

                            a.href = url;

                            div.appendChild(a);

                            composer.addWidget('pinterest', div);
                            composer.hideToolbar(); 

                            tripchumPinterestBuild(div);
                        }
                    });

                    return div;
                },
                onClick: function (ev, toolbar) {
                    $(toolbar).find('ul').css('display', 'none');
                    $(toolbar).find('.medium-pinterest-control').css('display', 'block');
                    $('.toolbar-pinterest-textinput').focus();
                }
            },
            rule: {
                getButton: function () {
                    var btn = document.createElement('button');
                    btn.innerHTML = '<i class="fa fa-minus"></i>';
                    return btn;
                },
                onClick: function (ev, toolbar) {
                    var hr = document.createElement('hr');
                    this.initPart(hr);
                    this.addElement(hr, true);

                    if (!hr.nextSibling || (hr.nextSibling.tagName.toLowerCase() != 'p'))
                    {
                        var p = document.createElement('p');
                        p.innerHTML = '<br>';
                        this.initPart(p);
                        this.addElement(p, false);
                    }

                    this.hideToolbar();
                }
            }
        }
    });

    // init 
    // console.log($('.body .content').html());

    $('.body .content').attr('data-no-find-modal', 1).attr('data-allow-newline', 1);

    // console.log('exts', exts);
    var editor = new MediumEditor('.body .content', {
        checkLinkFormat: true,
        // cleanPastedHTML: true,
        forcePlainText: true,
        disableReturn: false,
        buttons: ['bold', 'italic', 'underline', 'quote', 'anchor', 'header1', 'header2', 'header3', 'center'],
        placeholder: '',
        extensions: {
            'header3': new MediumButton({label:'H3', action: function (html, mark) {
                var sel = window.getSelection();
                
                if (sel) {
                    var node = sel.anchorNode;
                    // console.log('sel node', node);
                    if (node) {
                        var $n = $(node);
                        var $p = $n.parent();

                        if ($n.hasClass('centered') || $p.hasClass('centered')) {
                            
                            var newPart = document.createElement('p');

                            if ($n.hasClass('part')) {
                                newPart.innerHTML = $n.html();
                                $n.replaceWith(newPart);
                            }
                            else if ($p.hasClass('part')) {
                                newPart.innerHTML = $p.html();
                                $p.replaceWith(newPart);
                            }
                        } else {
                            var newH5 = document.createElement('h5');

                            if ($n.hasClass('part')) {
                                
                                newH5.innerHTML = $n.text();
                                $n.replaceWith(newH5);
                                return '';
                            }
                            else if ($p.hasClass('part')) {
                                newH5.innerHTML =  $p.text();
                                $p.replaceWith(newH5);
                                return '';
                            }
                        }
                    }
                }
                else {
                    // console.log('no sel');
                }
                $(document).trigger('story.change');
                return html;
            }, checkState: function (node) {
                var $n = $(node);
                var $p = $n.parent();

                if (($n[0].tagName.toLowerCase() == 'h5') || ($p[0].tagName.toLowerCase() == 'h5')) {
                    this.button.classList.add('medium-editor-button-active');
                }
            }}),
            'center': new MediumButton({label: '<i class="fa fa-align-center"></i>', action: function (html, mark) {
                
                var sel = window.getSelection();
                
                if (sel) {
                    var node = sel.anchorNode;
                    // console.log('sel node', node);
                    if (node) {
                        var $n = $(node);
                        var $p = $n.parent();

                        if ($n.hasClass('centered') || $p.hasClass('centered')) {
                            $p.removeClass('centered');
                            $n.removeClass('centered');
                        }
                        else {
                            if ($n.hasClass('part'))
                            {
                                $n.addClass('centered');
                                // return '';
                            }
                            else if ($p.hasClass('part')) {
                                $p.addClass('centered');
                                // return '';
                            }

                            // select the button
                            $(this).addClass();
                        }
                    }
                }
                else {
                    // console.log('no sel');
                }

                $(document).trigger('story.change');

                return html;
            }, checkState: function (node) {
                var $n = $(node);
                var $p = $n.parent();

                if ($n.hasClass('centered') || $p.hasClass('centered')) {
                    this.button.classList.add('medium-editor-button-active');
                }
            }})
        }
    });

    (function () {

        /// delete button
        $('#story-delete').on('click', function () {

            if (!__id) {
                return false;
            }

            TcClient.post('/story/delete', {id: __id}, function (textRsp) {
                try {

                    var rsp = JSON.parse(textRsp);

                    if (rsp.result && rsp.id) {
                        // delete success
                        window.location.href = '/story/compose/new';
                    }

                } catch (e) {
                    throw e;
                }
            });

            return false;
        });

        $('#story-publish').on('click', function () {

            if (!__id) {
                return false;
            }

            var act;
            var toRemoveClass;
            var toAddClass;

            var $t = $(this);

            if ($t.hasClass('btn-success')) {
                act = 'publish';
                toRemoveClass = 'btn-success';
                toAddClass    = 'btn-warning';
            }
            else {
                act = 'unpublish';
                toRemoveClass = 'btn-warning';
                toAddClass    = 'btn-success';
            }

            var post = {};
            post.id  = __id;
            post.act = act;

            var l = Ladda.create(this);
            l.start();

            TcClient.post('/story/publish', post, function (textRsp) {
                l.stop();

                try {

                    var rsp = JSON.parse(textRsp);

                    if (rsp.result && rsp.id)
                    {
                        $t.removeClass(toRemoveClass).addClass(toAddClass);
                    }

                } catch (e) {
                    throw e;
                }

            }, function () {
                l.stop();
            });

            return false;

        });

        initImageSearchModalForComposer();
        setComposerObject(comp);

    })();

});