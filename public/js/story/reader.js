$(document).ready(function () {

    var readers = {
        experience: function (element) {
            $(element).find('.placeholder-experience').each(function () {
                var id = this.getAttribute('data-id');

                if (!id) {
                    return;
                }

                console.log('render experience card id', id);

                var card = renderExperienceCard(id);
                $(this).replaceWith(card);
            });
        },
        pinterest: function (element) {
            if (typeof tripchumPinterestBuild === 'function') {
                tripchumPinterestBuild(element);
            }
        }
    };

    $('article .body .content').find('.part').each(function () {
        var wType = this.getAttribute('data-widget-type');

        if (typeof readers[wType] === 'function') {
            readers[wType](this);
        }
    });

    if (window.__cover) {
        var cover = window.__cover; 
        if (cover && cover.asBackground) {
            $('article.single').addClass('cover-background');
        }
    }


    var minH;

    function resizeHeaderHeight(width, height) {
        var $e = $('article.single');

        if ($e.hasClass('cover-background')) {
            // console.log('set min height with cover is background');
            var viewport = getViewport();
            minH = (viewport[1] * (width / viewport[0])) - 50;
            $e.find('.header').css('min-height', Math.round(minH) + 'px');
        }
        else {
            // console.log('set min height with NORMAL cover');
            var divWidth = $e.find('.header .cover').width();
            minH = ((divWidth/width) * height) - 50;
            $e.find('.header .cover').css('min-height', Math.round(minH) + 'px');
        }
    }


    var $img = $('article.single .header .cover img');
    
    if ($img.length) {
        $img.on('load', function () {
            resizeHeaderHeight($(this).width(), $(this).height());
        });

        resizeHeaderHeight($img.width(), $img.height());
        $(window).resize(function () {
            resizeHeaderHeight($img.width(), $img.height());
        });
    }

    // $('.header .cover').html(html).fitVids();
    $('article.single').fitVids();

    //
    var doCreateTrip = function (destId, guideId) {
        createTripWithDestId({destinationId: destId, guideId: guideId}, function (tripId) {
            if (tripId) {
                window.location = '/chats?t=' + tripId;
            }
        });
    };

    $('#story-start-chat').on('click', function () {
        var au = getAuthor();

        if (!au || !au.destinations || !au.destinations.length) {
            console.log('no dest');
            return false;
        }

        //
        var user = getLoggedUser();

        if (user) {
            doCreateTrip(au.destinations[0], au.id);
        }
        else {
            loginAnonymous(function () {
                doCreateTrip(au.destinations[0], au.id);
            });
        }

        return false;
    });
});
