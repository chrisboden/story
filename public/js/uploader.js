/*
    Huy Nguyen - 2013
    iFrame upload
*/

"use strict";

(function () {
    window.getTransloadItKey = function () {
        return '3b8de287c08b4733a4089f338fcbb55a';
    };
})();

/* This file handles uploading to Transloadit, a 3rd party service.
 It was originally written by the Transloadit team, but we may
 end up modifying it more in the future.
 */
(function(window) {

    var utcTimestamp = function(time) {

        if (undefined == time) {
            var time = new Date();
        }

        // return milisecond
        var now = time.getTime() + (time.getTimezoneOffset() * 60 * 1000);
        return now;
    };

    function formatDatePart(part) {

        part = part.toString();

        if (part.length < 2) {
            part = "0" + part;
        }

        return part;
    }

    function TransloaditXhr(opts) {
        this.authKey = opts.authKey;
        this.templateId = opts.templateId;
        this.steps = opts.steps || {};
        this.successCb = opts.successCb || null;    // Callback: Completed 
        this.errorCb = opts.errorCb || null;        // Callback: Failed
        this.progressCb = opts.progressCb || null;  // Callback: File upload progressed
        this.processCb = opts.processCb || null;    // Callback: File uploaded, still processing the file

        this.XMLHTTPRequestUpload = null;
    }

    TransloaditXhr.prototype.checkAssemblyStatus = function(assemblyUrl) {
        var self = this;

        assemblyUrl = assemblyUrl.replace(/http:/g, 'https:');

        $.ajax({
            url: assemblyUrl,
            type: "GET",
            dataType: "json",
            success: function(data, textStatus) {
                if (data.ok && data.ok == "ASSEMBLY_COMPLETED") {
                    if (typeof self.successCb === "function") {
                        self.successCb(data.results);
                    }
                    return;
                }

                if (data.ok == "ASSEMBLY_EXECUTING")
                    if (typeof self.processCb === "function")
                        self.processCb();

                if (data.error || (data.ok != "ASSEMBLY_EXECUTING" && data.ok != "ASSEMBLY_UPLOADING")) {
                    if (typeof self.errorCb === "function") {
                        self.errorCb("Failed to check assembly (" + textStatus + ")");
                    }
                    return;
                }

                setTimeout(function() {
                    self.checkAssemblyStatus(assemblyUrl);
                }, 1000);
            },
            error: function(XMLHttpRequest, textStatus) {
                if (typeof self.errorCb === "function") {
                    self.errorCb("Failed to check assembly (" + textStatus + ")");
                }
            }
        });
    };

    TransloaditXhr.prototype.onProgress = function(progressEvent) {
        if (typeof this.progressCb === "function")
            this.progressCb(100.0 * progressEvent.loaded / progressEvent.total);
    }

    TransloaditXhr.prototype.getDateString = function () {
        var myDate = new Date(utcTimestamp() + (10 * 60 * 60 * 1000));
        var myDateString = myDate.getFullYear() + "/" + formatDatePart((myDate.getMonth() + 1)) + "/" + formatDatePart(myDate.getDate()) + " " + formatDatePart(myDate.getHours()) + ":" + formatDatePart(myDate.getMinutes()) + ":00+00:00";
        return myDateString;
    }

    TransloaditXhr.prototype.post = function (formPost, paramsText) {

        var that = this;
        
        TcClient.post('/transloadit/signature', {params_text: paramsText}, function (text) {

            try {
                
                var rsp = JSON.parse(text);
                
                if (rsp && rsp.signature) {

                    console.log('now post to transloadit');

                    formPost.append('signature', rsp.signature);

                    var xhr = new XMLHttpRequest();
                    xhr.open("POST", "https://api2.transloadit.com/assemblies", true);
                    xhr.upload.self = that;
                    xhr.upload.onprogress = that.onProgress.bind(that);

                    xhr.onreadystatechange = function(event) {
                        var req = event.target;

                        if (req.readyState === 4) {
                            if (req.status === 200) {
                                var parsedData = jQuery.parseJSON(req.responseText);
                                that.checkAssemblyStatus(parsedData.assembly_url);
                            } else if (typeof that.errorCb === "function") {
                                if(req.responseText.length > 0) {
                                  that.errorCb(jQuery.parseJSON(req.responseText).message);
                                } else {
                                  that.errorCb("Failed to upload file");
                                }
                            }
                        }
                    };

                    xhr.send(formPost);
                }

            } catch (e) {
                throw e;
            }
        });
    };

    TransloaditXhr.prototype.importFile = function (url) {
        var dateStr = this.getDateString();

        var obj = {
            auth:
            {
                expires : dateStr,
                key     : this.authKey
            },
            template_id: this.templateId,
            steps:
            {
                "import" :
                {
                    url: url
                }
            },
            fields:
            {
                media_id: new Date().getTime()
            }
        };

        var paramsText = JSON.stringify(obj);

        var formPost = new FormData();
        formPost.append("params", paramsText);

        this.post(formPost, paramsText);
    };

    TransloaditXhr.prototype.uploadFile = function (file) {

        var myDateString = this.getDateString();
    
        var params = {
            auth: {key: this.authKey, expires: myDateString},
            "template_id": this.templateId,
            // steps: this.steps,
            fields: {media_id: new Date().getTime()}
        };
        
        var self = this;

        var formPost = new FormData();

        if (!file.length) {
            file = [file];
        }

        /*if (file.constructor !== Array) {
            formPost.append("file", file);
            params.fields['file'] = 'file';
        }
        else {*/
            
            for (var i = 0; i < file.length; i++) {
                formPost.append('file_' + i, file[i]);
                params.fields[('file_' + i)] = "file_" + i;
            }
        // }

        var paramsText = JSON.stringify(params);
        formPost.append("params", paramsText);

        this.post(formPost, paramsText);
    };

    window.TransloaditXhr = TransloaditXhr;

})(window);


(function (window) {

    var __count = 0;
    var __opts  = {
        progressUpdateInterval: 500
    };

    function createId() {
        __count ++;
        return 'magic-' + __count;
    }

    function removeUploadElements(idStr) {
        var itemId = 'iframe-' + idStr;
        var item   = document.getElementById(itemId);
        item.parentNode.removeChild(item);

        itemId = 'form-' + idStr;
        item   = document.getElementById(itemId);
        item.parentNode.removeChild(item);
    }

    var MagicUploader = function (opts) {
        
        var self = this;

        // options
        var options = $.extend(__opts, opts);

        /*if (!options.url) {
            throw "How can you upload without an URL?";
            return false;
        }*/

        var __formUrl = '/story/media/upload';
        var __id = createId();

        // update interval
        var updateInterval;

        ///
        function onChange() {
            var that = this;

            var fs   = [];

            for (var i = 0; i < that.files.length; i++) {
                fs.push(that.files[i]);
            }

            if (options.onSelect && (typeof options.onSelect === 'function')) {
                options.onSelect.call(self, fs);
            }
        }

        // create form
        var form  = document.createElement('form');
        form.id   = 'form-' + __id;

        form.setAttribute('method', 'post');
        form.setAttribute('enctype', 'multipart/form-data');
        // form.setAttribute('target', iframe.id);
        form.setAttribute('action', __formUrl);

        // file input
        var file = document.createElement('input');
        file.type = 'file';
        file.name = 'file_' + __id;
        // file.setAttribute('type', 'file');
        // file.setAttribute('name', 'file_' + __id);
        
        // on change
        $(file).on('change', onChange);

        // multiple
        if (options['multiple']) {
            file.multiple = true;
        }

        this.file = file;

        // hidden
        /*var hidden = document.createElement('input');
        hidden.setAttribute('type', 'hidden');
        hidden.name  = 'id';
        hidden.value = __id;*/ 

        // form.appendChild(hidden);
        // form.appendChild(file);

        /*var wrapper = document.getElementById('magic-wrapper');
        wrapper.appendChild(form);

        // transloadit
        $(form).transloadit({
            wait: true,
            params: {
                auth: { key: "3b8de287c08b4733a4089f338fcbb55a" },
                steps:
                {
                    "import" :
                    {
                        use: ":original"
                    }
                }
            }
        });

        //
        this.$form = $(form);*/

        this.fileSelected = function () {
            
            if (file.value) {
                return true;
            }

            return false;
        };

        this.reset = function () {
            file.value = null;
        };

        this.getId = function () {
            return __id;
        };

        this.clean  = function () {
            removeUploadElements(__id);
        };

        this.submit = function (fields) { 

            var transloadit = new TransloaditXhr({
                authKey: getTransloadItKey(),
                templateId: "68a28300edf811e3b22bb576fd84875d",
                successCb: function(fileObj) {

                    if (options.onSuccess && (typeof options.onSuccess === 'function')) 
                    {
                        options.onSuccess.call(self, fileObj);
                    }

                    // console.log("Finished upload of file, amazon file url is:", fileUrl);
                },

                errorCb: function(error) {
                    alert(error);
                }
            });

            transloadit.uploadFile(this.file.files);
        };

        // trigger a click on the file input
        this.open = function () {
            $(file).click();
        };
    }
    
    // 
    var wrapper = document.createElement('div');
    wrapper.id  = 'magic-wrapper';

    // append
    $(wrapper).css('display', 'none');
    
    $(document).ready(function () {
        $('body').append(wrapper);
    });

    //
    MagicUploader.defaultOptions = function(opts) {
        __opts = $.extend(__opts, opts);
    };

    // eports
    window.MagicUploader = MagicUploader;



})(window);


