var express = require('express');
var util    = require('cloud/util');
var hmac   = require('cloud/hmac-sha1.js');


//// create app
var app     = express();
var EJS = require('ejs');

// functions
function getQueryString(urlObj) {
    var parsedUrl = url.parse(urlObj);

    if (null == parsedUrl.query) {
        return {};
    }
    else {
        return qs.parse(parsedUrl.query);
    }
}

function __error(message, res, errorCode) {

    if (!errorCode) {
        errorCode = 400;
    }

    res.send({error: message}, errorCode);
};

function __errorPage(message, res) {
    res.send('ERROR: ' + message);
    return;
    console.log('ErrorPage Log: ' + message);
    res.redirect('/');
};

function __return(data, res, noSecure) {

    var stuff = '';

    if (!noSecure) {
        stuff = 'while(1);';
    }

    res.send(stuff + JSON.stringify(data));
};

var TRANSLOADIT_KEY      = "3b8de287c08b4733a4089f338fcbb55a";
var TRANSLOADIT_SECRET   = "e5ff1e338dce5665e62b9310af79658a355b68bf";
var TRANSLOADIT_TEMPLATE = "926dac00c90411e3bddc9d5ca01e5705";

function getTransloadItSignature(paramsText) {
    return hmac.myHMAC(paramsText, TRANSLOADIT_SECRET);
}

//// 
app.set('views', 'cloud/views');
app.set('view engine', 'ejs');

var parseExpressHttpsRedirect = require('parse-express-https-redirect');
var parseExpressCookieSession = require('parse-express-cookie-session');

// use
app.use(parseExpressHttpsRedirect());
app.use(express.bodyParser());

//
app.use(express.cookieParser('survivetheoutdoor'));
app.use(parseExpressCookieSession({ cookie: { maxAge: 3600000 } }));

/* read a story */
app.get('/story/read/:id', function (req, res) {

    var renderPage = function (user) {
        var id = req.params.id;

        var qr = new Parse.Query('story');
        qr.include('creator');

        qr.get(id, {
            success: function (story) {

                var locals = {};

                locals.story = {
                    id: story.id,
                    title: story.get('title'),
                    subtitle: story.get('subtitle'),
                    cover: story.get('cover'),
                    content: story.get('content'),
                    state: story.get('state'),
                    createdAt: story.createdAt
                };

                locals.canEdit = false;
                locals.noGenericMeta = true;
                locals.specialMeta = true;
                res.render('story.ejs', locals);
            },
            error: function () {
                return __error('No story found', res);
            }
        });
    };

    renderPage(false);
});

/* story composer */
app.get('/story/compose/:id', function (req, res) {

    var doRender = function (locals) {
        locals.canEdit = true;
        res.render('story.ejs', locals);
    };

    var id = req.params.id;

    if (id && (id != 'new')) {
        var qr = new Parse.Query('story');
        qr.include('creator');
        qr.get(id, {
            success: function (story) {

                var locals = {};

                locals.story = {
                    id: story.id,
                    title: story.get('title'),
                    subtitle: story.get('subtitle'),
                    cover: story.get('cover'),
                    content: story.get('content'),
                    state: story.get('state')
                };

                // 
                doRender(locals);
            },

            error: function () {
                return __error('No story found', res);
            }
        });
    }
    else {
        return doRender({story: false});
    }
});

app.post('/story/delete', function (req, res) {
    var post = req.body;

    if (!post.id) {
        return __error("Invalid input", res);
    }

    var qr = new Parse.Query('story');
    qr.get(post.id, {
        success: function (storyAgain) {
            storyAgain.destroy({
                success: function () {
                    return __return({id: post.id, result: true}, res);
                },
                error: function () {
                    return __error("Internal Error", res);
                }
            });
        },
        error: function () {
            return __error("No story found", res, 404);
        }
    });
});

app.post('/story/publish', function (req, res) {

    var allowedActs = ['publish', 'unpublish'];

    var post = req.body;

    if (!post.act || (allowedActs.indexOf(post.act) < 0) || !post.id) {
        return __error("Invalid input", res);
    }


    var qr = new Parse.Query('story');
    qr.get(post.id, {
        success: function (storyAgain) {

            var state;

            if (post.act == 'publish') {
                state = 1;
            }
            else {
                state = 2;
            }

            storyAgain.set('state', state);

            storyAgain.save({
                success: function (sa) {
                    return __return({id: sa.id, result: true}, res);
                },
                error: function () {
                    return __error("Internal Error", res);
                }
            });
        },
        error: function () {
            return __error("No story found", res, 404);
        }
    });
});

app.post('/story/save', function (req, res) {
    
    var doSave = function (story, post) {
        
        story.set('title', util.escapeJs(post.title));
        story.set('subtitle', util.escapeJs(post.subtitle));
        story.set('content', (post.content));

        if (post.cover) {
            try {
                var cover = JSON.parse(post.cover);
                story.set('cover', cover);
            }
            catch (e) {
                return __error("Invalid input", res);
            }
        }

        story.save({
            success: function (sAgain) {
                __return({result: true, id: sAgain.id}, res);
            },
            error: function (error, error2) {
                __error("Internal Error: Could not save story " + JSON.stringify(error) + ' ' + JSON.stringify(error2), res);
            }
        });
    };

    //
    var post = req.body;

    if (!post || !post.title || !post.subtitle || !post.content) {
        return __error("Invalid input", res);
    }

    if (post.id) {
        var qr = new Parse.Query('story');
        qr.get(post.id, {
            success: function (storyAgain) {
                doSave(storyAgain, post);
            },
            error: function () {
                return __error("No story found", res, 404);
            }
        });
    }
    else {
        var story = new Parse.Object('story');
        story.set('state', 0);
        doSave(story, post);
    }
});

app.post('/transloadit/signature', function (req, res) {

    var post = req.body;

    if (!post || !post.params_text) {
        return __error("invalid input", res);
    }

    var signature = getTransloadItSignature(post.params_text);
    return __return({signature: signature}, res);
});


Parse.Cloud.useMasterKey();
app.listen(3000);
