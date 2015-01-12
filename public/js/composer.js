(function () {
    var Composer = function (eleSelector, options) {

        // event center
        this.eventCenter = new Events();

        this.options = {
            backgroundInterval: 5000, // 5 seconds
            widgets: false
        };

        this.options = $.extend(this.options, options);


        // init element
        this.$e = $(eleSelector);

        //
        this.editorEvents = {
            onDragOver: function () {

            },
            onDrop: function () {

            }
        };

        //
        if (this.options.widgets) {
            
            if (!this.options.noPlus) {
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
                this.$addPlus.on('click', this.addPlusOnClick);

                // add addplus to body
                $('body').append(addPlus);
            }

            for (var widgetName in this.options.widgets) {
                
            }
        }
    };


    Composer.prototype.init = function () {
        
    };

})();