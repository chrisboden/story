!(function () {

    function loadExperience(id, callback) {
        TcClient.get('/experiences/' + id, {}, function (msg) {
            try {
                var rsp = JSON.parse(msg);

                if (rsp.experience) {
                    callback(rsp.experience);
                }
            }
            catch (e) {
                callback(false);
            }
        });
    }

    window.loadSingleExperience = loadExperience;

})();

function renderExperienceCard(id) {
        
    var expBox = document.createElement('div');
    expBox.className = 'exp-box w100 box-v';

    loadSingleExperience(id, function (exp) {

        /* create embed card */

        var cardTop = document.createElement('div');
        cardTop.className = 'card-top';

        if (exp.experienceImages && exp.experienceImages.length) {

            var blurDiv = document.createElement('div');
            blurDiv.className = 'blur-bg';

            var blurImg = document.createElement('img');
            if (typeof exp.experienceImages[0] === 'object') {
                blurImg.src = exp.experienceImages[0].imageUrl;
            }
            else {
                blurImg.src = exp.experienceImages[0];
            }

            blurDiv.appendChild(blurImg);
            cardTop.appendChild(blurDiv);

            var galleryDiv = document.createElement('div');
            galleryDiv.className = 'gallery photoset-grid-basic';
            galleryDiv.setAttribute('data-layout', '22');

            for (var i = 0; i < exp.experienceImages.length; i++) {
                var img = document.createElement('img');

                if (typeof exp.experienceImages[i] === 'object') {
                    img.src = exp.experienceImages[i].imageUrl;
                }
                else {
                    img.src = exp.experienceImages[i];
                }

                galleryDiv.appendChild(img);
            }

            cardTop.appendChild(galleryDiv);
        }

        var expMetaBox = document.createElement('div');
        expMetaBox.className = 'exp-meta-box box-v box-b box-l';
        expMetaBox.innerHTML = '<h4>' + exp.experienceName + '</h4><p>' + exp.experienceAddress + '</p>';

        cardTop.appendChild(expMetaBox);


        var cardBottom = document.createElement('div');
        cardBottom.className = 'card-bottom box h';
        
        var categBox   = document.createElement('div');
        categBox.className = 'categ-box m c ' + exp.experienceType + '-see';
        cardBottom.appendChild(categBox);

        if (exp.userFirstName) {
            var authorBox  = document.createElement('div');
            authorBox.className = 'author-box box-v box-m box-c';
            authorBox.innerHTML = '<img class="avatar-box m c" src="' + exp.userAvatar + '"/><span class="name-box m c">' + exp.userFirstName + '<br/>' + exp.userLastName + '</span>';
            cardBottom.appendChild(authorBox);
        }

        if (exp.experienceNotes && exp.experienceNotes.length) {
            var note = exp.experienceNotes[0];

            var infoBox = document.createElement('div');
            infoBox.className = 'info-box h m flex-1';
            infoBox.innerHTML = note.note;

            cardBottom.appendChild(infoBox);
        }

        expBox.appendChild(cardTop);
        expBox.appendChild(cardBottom);

        $(expBox).find('.gallery').photosetGrid();

        /// that.addWidget('experience', expBox);
    });

    return expBox;
};

function getViewport() {

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
}

