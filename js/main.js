var MeoU = {
  DAICOHEN: 'daicohen',
  CONAN: 'conan',
  CONANCH1_1: 'conanch1_1',
  CONANCH1_2: 'conanch1_2',
  CONANCH1_3: 'conanch1_3',
  CONANCH1_4: 'conanch1_4',
  DORAPLUS1: 'doraplus1',
  DORAPLUS1CH2: 'doraplus1ch2',
  DORAPLUS1CH3: 'doraplus1ch3',
  DORAPLUS1CH4: 'doraplus1ch4',
  DORAPLUS1CH5: 'doraplus1ch5',
  DORAPLUS1CH6: 'doraplus1ch6',
  DORAPLUS1CH7: 'doraplus1ch7',
  DORAPLUS1CH8: 'doraplus1ch8',
  DORAPLUS1CH9: 'doraplus1ch9',
  DORAPLUS1CH10: 'doraplus1ch10',
  DORAPLUS1CH11: 'doraplus1ch11',
  DORAPLUS1CH12: 'doraplus1ch12',
  DORAPLUS1CH13: 'doraplus1ch13',
  DORAPLUS1CH14: 'doraplus1ch14'
};
MeoU.comics = [MeoU.DAICOHEN, MeoU.CONAN, MeoU.CONANCH1_1, MeoU.CONANCH1_2, MeoU.CONANCH1_3, MeoU.CONANCH1_4, MeoU.DORAPLUS1, MeoU.DORAPLUS1CH2, MeoU.DORAPLUS1CH3, MeoU.DORAPLUS1CH4, MeoU.DORAPLUS1CH5, MeoU.DORAPLUS1CH6, MeoU.DORAPLUS1CH7, MeoU.DORAPLUS1CH8, MeoU.DORAPLUS1CH9, MeoU.DORAPLUS1CH10, MeoU.DORAPLUS1CH11, MeoU.DORAPLUS1CH12, MeoU.DORAPLUS1CH13, MeoU.DORAPLUS1CH14];
MeoU.comic = MeoU.DORAPLUS1;
//MeoU.comic = MeoU.DAICOHEN;
MeoU.enableGA = null;
MeoU.page = 1;
var modal_overlays_showing = {};

MeoU.speaker = {};
try {
  MeoU.speaker.voices = window.speechSynthesis.getVoices();
  MeoU.speaker.speak = function(txt) {
    var utterance = new SpeechSynthesisUtterance(txt);
    // Should be using the voiceschanged or 'on voices ready' event callback because getVoices is loaded async
    var voices = window.speechSynthesis.getVoices();
    // XXX Alex is only OS X
    var voiceAlex = voices.filter(function(voice) { return voice.name == 'Alex'; })[0];
    if (voiceAlex === undefined) {
      // TODO fix
      voiceAlex = voices.filter(function(voice) { return voice.name == 'Google US English'; })[0];
    }
    var voiceUK = voices.filter(function(voice) { return voice.name == 'Google UK English Female'; })[0];
    sendGaEvent('TTS ' + txt);
    MeoU.userprofile.counts.increment('words_listened');
    utterance.voice = voiceAlex;
    window.speechSynthesis.speak(utterance);
    utterance.voice = voiceUK;
    window.speechSynthesis.speak(utterance);
  }
} catch (err) {
  MeoU.speaker = {voices: [], speak: function(txt) { return; }};
}

MeoU.keys_enabled = true;
MeoU.navbar = {};
MeoU.navbar.comics = [{name: 'Doraemon', data: [
                        {name: 'Chú Khủng Long Của Nobita', data: MeoU.DAICOHEN},
                        {name: 'Doraemon Plus Vol 1 Chap 1', data: MeoU.DORAPLUS1},
                        {name: 'Doraemon Plus Vol 1 Chap 2', data: MeoU.DORAPLUS1CH2},
                        {name: 'Doraemon Plus Vol 1 Chap 3', data: MeoU.DORAPLUS1CH3},
                        {name: 'Doraemon Plus Vol 1 Chap 4', data: MeoU.DORAPLUS1CH4},
                        {name: 'Doraemon Plus Vol 1 Chap 5', data: MeoU.DORAPLUS1CH5},
                        {name: 'Doraemon Plus Vol 1 Chap 6', data: MeoU.DORAPLUS1CH6},
                        {name: 'Doraemon Plus Vol 1 Chap 7', data: MeoU.DORAPLUS1CH7},
                        {name: 'Doraemon Plus Vol 1 Chap 8', data: MeoU.DORAPLUS1CH8},
                        {name: 'Doraemon Plus Vol 1 Chap 9', data: MeoU.DORAPLUS1CH9},
                        {name: 'Doraemon Plus Vol 1 Chap 10', data: MeoU.DORAPLUS1CH10},
                        {name: 'Doraemon Plus Vol 1 Chap 11', data: MeoU.DORAPLUS1CH11},
                        {name: 'Doraemon Plus Vol 1 Chap 12', data: MeoU.DORAPLUS1CH12},
                        {name: 'Doraemon Plus Vol 1 Chap 13', data: MeoU.DORAPLUS1CH13},
                        {name: 'Doraemon Plus Vol 1 Chap 14', data: MeoU.DORAPLUS1CH14} ]},
                      {name: 'Conan', data: [
                        {name: 'Conan Chap 1-1', data: MeoU.CONANCH1_1},
                        {name: 'Conan Chap 1-2', data: MeoU.CONANCH1_2},
                        {name: 'Conan Chap 1-3', data: MeoU.CONANCH1_3},
                        {name: 'Conan Chap 1-4', data: MeoU.CONANCH1_4} 
                        // {name: 'Conan Chap 1-1', data: MeoU.CONAN}
                      ]}];
MeoU.navbar.extraLinks = {}; // Giới thiệu -> show_dialog, Facebook -> link and GA event
MeoU.navbar.make_ul = function () {
  var ul;
  ul = '<ul class="nav navbar-nav">';
  // catname is Doraemon, Conan
  for (var i = 0; i < MeoU.navbar.comics.length; i++) {
    var catname = MeoU.navbar.comics[i].name;
    var data = MeoU.navbar.comics[i].data;
    var li;
    li = '';
    if (typeof data == 'string') {
      var link = '/truyen/' + MeoU.comic_export[data].slug;
      var a = '<a href="' + link + '" data-target="#" data-toggle="dropdown" aria-expanded="false" aria-controls="navbar" onclick="handle_switch_comic(\'' + data +'\'); return false;">' + catname + '<' + '/a><' + '/li>';
      li += '<li>' + a + '<' + '/li>';
    } else {
      var _ul;
      li = '<li role="presentation" class="dropdown">';
      li += '<a class="dropdown-toggle" data-target="#" data-toggle="dropdown" href="#" role="button" aria-controls="navbar" aria-haspopup="true" aria-expanded="false">' + catname + '<span class="caret"><' + '/span><' + '/a>';
      _ul = '<ul class="dropdown-menu">';
      _ul += data.map(function(item) {
        var link = '/truyen/' + MeoU.comic_export[item.data].slug;
        var checkbox = '<i id="checkbox-' + item.data + '" class="material-icons" style=" color: red; ">check_box_outline_blank<' + '/i>';
        var title = checkbox + ' ' + MeoU.comic_export[item.data].title.split(':')[0] + '<span class="subtitle">' + MeoU.comic_export[item.data].title.split(':')[1] + '</span>';
        // We don't support nested levels, so item.data should be a string not []
        var a = '<a href="' + link + '" data-target="#" data-toggle="collapse" aria-expanded="false" aria-controls="navbar" onclick="handle_switch_comic(\'' + item.data +'\'); return false;">' + title + '<' + '/a><' + '/li>';
        return '<li>' + a + '<' + '/li>';
      }).join('');
      _ul += '<' +'/ul>';
      li += _ul;
      li += '<' +'/li>';
    }
    ul += li;
  }
  ul += '<li><a href="#navbar" data-toggle="collapse" aria-expanded="false" aria-controls="navbar" onclick="show_dialog(\'.site-info.jumbotron\');">Giới thiệu<' + '/a><' + '/li>';
  ul += '<li><a href="https://goo.gl/OHOvsA" target="_blank" onclick="sendGaEvent(\'FB non-help\');">Facebook<' + '/a><' + '/li>';
  ul += '<' + '/ul>';

  return ul;
};

MeoU.code = {};
MeoU.code.code_btoa = 'SUxPVkVNRU9V';
MeoU.code.page_maxes = {};
MeoU.code.page_maxes[MeoU.CONAN] = 10;
MeoU.code.page_maxes[MeoU.CONANCH1_1] = 10;
MeoU.code.page_maxes[MeoU.CONANCH1_2] = 8;
MeoU.code.page_maxes[MeoU.CONANCH1_3] = 9;
MeoU.code.page_maxes[MeoU.CONANCH1_4] = 7;
MeoU.code.page_maxes[MeoU.DAICOHEN] = 20;
MeoU.code.page_maxes[MeoU.DORAPLUS1] = 8;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH2] = 6;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH3] = 9;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH4] = 6;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH5] = 9;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH6] = 7;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH7] = 9;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH8] = 14;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH9] = 8;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH10] = 10;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH11] = 7;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH12] = 7;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH12] = 7;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH13] = 7;
MeoU.code.page_maxes[MeoU.DORAPLUS1CH14] = 7;
MeoU.code.handle_valid_code = function () {
    if (MeoU.comic in MeoU.code.page_maxes) {
    } else {
      console.log('missing page max for comic ' + MeoU.comic);
    }
  }
MeoU.code.validate_code = function (code) {
    try {
      if (btoa(code) == MeoU.code.code_btoa) {
        history.pushState(null, null, '#' + btoa(code));
        return true;
      }
      code = code.toUpperCase(); // because people tried with wrong case
      if (btoa(code) == MeoU.code.code_btoa) {
        history.pushState(null, null, '#' + btoa(code));
        return true;
      }
    } catch (e) {
    }
    return false;
  };
MeoU.code.validate_hashcode = function () {
    if (location.hash != '') {
      if (location.hash == '#' + MeoU.code.code_btoa) {
        return true
      }
      // TODO growl error on bad code
    }
    return false;
  };
MeoU.code.validate_urlcode = function () {
    // e.g. /code-SUxPVkVNRU9V
    var code_url = location.pathname.match(/code-(.*)\.html/);
    if (code_url) {
      if (code_url[1] == 'THANKYOU') {
        // XXX Side effect
        MeoU.page = 5; // Go directly to page 5
        return true;
      } else {
        return MeoU.code.validate_code(code_url[1]);
      }
    }
    return false;
  };


MeoU.init_comic = function (comic) {
  MeoU.paneboxes.setupPaneboxes(comic)
  if (comic == MeoU.DAICOHEN) {
    bind_audio_boxes_daicohen();
    // TODO Remove now-playing
    // $('#now-playing-daicohen').show();
  } else if (comic == MeoU.CONAN) {
    // $('#now-playing-conan').show();
  } else if (comic == MeoU.DORAPLUS1) {
  }
  show_pane_boxes();
  initial_pane(); // also initialized in reset_gloss
  MeoU.resize.lastwidth = $(window).width();
  MeoU.fixmaindims();
  add_title_to_body_class(comic);
}
MeoU.fixmaindims = function () {
  var DIMS = {};
  DIMS[MeoU.DAICOHEN]     = {w: 820, h: 1160};
  DIMS[MeoU.DORAPLUS1]    = {w: 660, h: 980};
  DIMS[MeoU.DORAPLUS1CH2] = {w: 654, h: 974};
  DIMS[MeoU.DORAPLUS1CH3] = {w: 656, h: 976};
  DIMS[MeoU.DORAPLUS1CH4] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH5] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH6] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH7] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH8] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH9] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH10] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH11] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH12] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH13] = {w: 654, h: 971};
  DIMS[MeoU.DORAPLUS1CH14] = {w: 654, h: 971};
  DIMS[MeoU.CONANCH1_1]   = {w: 728, h: 1144};
  DIMS[MeoU.CONANCH1_2]   = {w: 728, h: 1144};
  DIMS[MeoU.CONANCH1_3]   = {w: 728, h: 1144};
  DIMS[MeoU.CONANCH1_4]   = {w: 728, h: 1144};
  var bg = DIMS[MeoU.comic];
  if (MeoU.comic == MeoU.CONAN) {
    $('.main').width('');
    $('.main').height('');
    $('.main').css('minHeight', '');
    return;
  }
  if ($(window).width() < 800) {
    var w = $(window).width();
    $('.main').width(w);
    var h = bg.h / (bg.w / w);
    $('.main').height(h);
  } else {
   // $('.manga.container').width(bg.w);
    $('.main').width(bg.w);
    $('.main').height(bg.h);
    $('.main').css('minHeight', 0);
  }
}
MeoU.resize = {};
MeoU.resize.lastwidth = null;
MeoU.resize.callback = function () {
  if (Math.abs(MeoU.resize.lastwidth - $(window).width()) > 10) {
    MeoU.resize.lastwidth = $(window).width();
    MeoU.fixmaindims();
  }
}


function click_nhap_ma(evt) {
  //console.log(evt);
  sendGaEvent('NhapMa: ' + $('#ghi-ma-so').val());
  if (MeoU.code.validate_code($('#ghi-ma-so').val()) == true) {
    $('#nhap-ma-success').show();
    $('#nhap-ma-error').hide();
    // XXX close_dialog triggers GA event
    setTimeout(function() { 
      var selecta = '.signup-info.jumbotron';
      modal_overlays_showing[selecta] = false;
      $(selecta).fadeOut(800);
    }, 2000);
    MeoU.code.handle_valid_code();
  } else {
    $('#nhap-ma-error').show();
    $('#nhap-ma-success').hide();
  }
}

if (MeoU.code.validate_hashcode() ||
    MeoU.code.validate_urlcode()) {
  MeoU.code.handle_valid_code();
}

// highlight initial pane of page
function initial_pane() {
  var nextPaneId = '#' + MeoU.comic + '-pane-p' + MeoU.page + '-1';
  $('.panebox.active').removeClass('active');
  $(nextPaneId).addClass('active');
  // don't scroll

  // body mode
  if ($('body').hasClass('mode-gloss-overlay')) {
    if (MeoU.comic == MeoU.DAICOHEN) {
      $('body').removeClass('mode-gloss-overlay');
    } else {
      load_pane_gloss_by_index(1);
    }
  }
}
function load_pane_gloss_by_index(panenum) {
  console.log('load page ' + (MeoU.page-1) + ' pane ' + (panenum-1));
  try {
   var pane = MeoU.glosses[MeoU.comic][MeoU.page-1][panenum-1];
   var selecta = '#' + MeoU.comic + '-pane-' + pane.paneid;
  } catch (e) {
   debugger; 
  }
  load_pane_gloss_by_id(selecta, pane.time.start, pane.time.stop);
}

function next_pane() {
  var pane = -1;
  var nextPaneId;
  if ($('.' + MeoU.comic + '-paneboxes .panebox.active').length == 0) {
    // no pane selected
    nextPaneId = '#' + MeoU.comic + '-pane-p' + MeoU.page + '-1';
  } else {
    var m = $('.panebox.active').attr('id').match(/^(.*)-p([0-9]+)-([0-9]+)$/);
    var prefix = m[1];
    // var MeoU.page = m[2];
    pane = parseInt(m[3]);
    nextPaneId = '#' + prefix + '-p' + MeoU.page + '-' + (pane + 1);
  }
  if ($(nextPaneId).length == 0) {
    // end of panes, probably
    // but check if we aren't on the last pane of the last page
    if (MeoU.page == MeoU.code.page_maxes[MeoU.comic]) {
      sendGaEvent('Reached last pane/page');
      // TODO popup to suggest reading a different comic
      return;
    }
    sendGaEvent('Next page via last pane');
    $('.panebox.active').removeClass('active');
    next_page();
    return; // XXX
  } else {
    sendGaEvent('Next pane: ' + nextPaneId);
  }
  $('.panebox.active').removeClass('active');
  $(nextPaneId).addClass('active');
  // body mode
  if ($('body').hasClass('mode-gloss-overlay')) {
    load_pane_gloss_by_index(pane+1);
  }

  //console.log("animate to " + $(nextPaneId).offset().top + " - " + $('.navbar').height());
  var scrollpos;
  if ($(window).width() > 900) {
    scrollpos = $(nextPaneId).offset().top - $('.navbar').height();
  } else {
    scrollpos = $(nextPaneId).offset().top - $('.modal-backdrop.gloss-overlay').height() - parseInt($('.modal-backdrop.gloss-overlay').css('margin-top'));
  }
  $('html, body').animate({
        // scrollTop: $(nextPaneId).offset().top - $('.navbar').height()
        scrollTop: scrollpos
  }, 500);
}

function update_page_buttons() {
  if (MeoU.page == 1) {
    $('.btn-page-prev').prop('disabled', true);
  } else {
    $('.btn-page-prev').prop('disabled', false);
  }
  if (MeoU.page == MeoU.code.page_maxes[MeoU.comic]) {
    $('.btn-page-next').prop('disabled', true);
    $('.next-page').html('');
  } else {
    $('.btn-page-next').prop('disabled', false);
    $('.next-page').html(MeoU.page + 1);
  }
  $('.current-page').html(MeoU.page);
}

function prev_page() {
  sendGaEvent('Prev');
  if (MeoU.page > 1) {
    MeoU.page -= 1;
    updateUrl(MeoU.page);
    reset_gloss();
  }
  update_page_buttons();
  // XXX
  $('.btn-page-next').prop('disabled', false);
}
function next_page() {
  MeoU.points.add(5);
  sendGaEvent('Next');
  if ($('.jumbotron.buttons-info').is(':visible')) {
    $('.buttons-info.jumbotron').fadeOut(500);
  }
  if (MeoU.page < MeoU.code.page_maxes[MeoU.comic]) {
    MeoU.page += 1;
    updateUrl(MeoU.page);
    MeoU.userprofile.counts.increment('pages_turned');
    MeoU.userprofile.pagemark.update();
    reset_gloss();
    MeoU.popquiz.enqueue_questions();
    // before: if (MeoU.page != 4 || MeoU.userprofile.competency_score != -1) {
    if (MeoU.page % 3 == 0) {
      if (MeoU.popquiz.load_random_quiz_question()) {
        MeoU.popquiz.open_quiz();
      } // else no questions to load
    }
    if (MeoU.page == 4) {
      if (MeoU.userprofile.competency_score == -1) {
        load_question(0);
        $('.quiz-overlay').show();
      } else {
        sendGaEvent('Skip question for c-score: ' + MeoU.userprofile.competency_score);
      }
    }
    // if (MeoU.page == page_max) {
    //  _show_dialog_noGA('.signup-info.jumbotron');
    // }
  }
  // XXX
  $('.btn-page-prev').prop('disabled', false);
  update_page_buttons();
}

// turns a button (layer is the number) green, others not green
// Append: layer can be a string, right now prepended by hypen, should be changed from numbers to strings
function greenify_button(layer) {
  $('.controls.btn-group .btn-success').removeClass('btn-success');
  $('#btn-layer' + layer).addClass('btn-success')
}

// returns the value of the url arg 'arg' in 'url' if it exists
// returns true if arg exists w/o a value
function urlarg(needle) {
  // substring(1) to remove prefixed '?'
  var url = location.search.substring(1);
  var v = url.split('&').filter(function(arg) {
    // filters for the matching arg name
    return (arg.split('=')[0] == needle);
  }).map(function(arg) {
    // naked arg
    if (arg.search('=') == -1) {
      return true;
    }
    // returns matching arg's value
    return arg.split('=')[1];
  });
  if (v.length > 0) {
    return v[0];
  } else {
    return null;
  }
}

function istracking() {
  if (MeoU.enableGA === null) {
    if (urlarg('test')) {
      MeoU.enableGA = false;
    } else if (location.port == '' || location.port == 80) {
      MeoU.enableGA = true;
    } else {
      MeoU.enableGA = false;
    }
  }
  return MeoU.enableGA;
}
function makeComicUrl(page) {
  return 'truyen/' + MeoU.comic_export[MeoU.comic].slug + '/' + page;
}
function updateUrl(newpage) {
  if (istracking()) {
    ga('set', 'page', makeComicUrl(newpage));
    ga('set', 'title', 'Page ' + newpage);
  }
  history.pushState(null, null, '/' + makeComicUrl(newpage));
  sendGaPageView();
}
// 'page' of ga object needs to be set before via updateUrl. This only does the sending.
function sendGaPageView() {
  if (!istracking()) {
    console.log('untracked pageview: ' + location.pathname);
    return;
  }
  ga('send', 'pageview');
}
function sendOriginalGaPageView() {
  ga('set', 'page', location.pathname);
  sendGaPageView();
}
function sendGaEvent(btn) {
  if (!istracking()) {
    console.log('untracked event: ' + btn);
    return;
  }

  var category = btn.split(' ')[0];
  // page is global
  ga('send', {
    hitType: 'event',
    eventCategory: category, // + ': p' + MeoU.page, // TODO this info is redundant within GA w/ proper page tracking
    eventAction: btn,
    eventLabel: MeoU.page + '-' + btn,
    eventValue: MeoU.page
  });
}
// type: translation|cloze|choice|..., qtext: question text itself, choice: answered index, iscorrect: true if correct answer
function sendGaQuizEvent(type, qtext, choice, iscorrect) {
  if (!istracking()) {
    console.log('untracked event: ' + [type, qtext, choice, iscorrect]);
    return;
  }

  ga('send', {
    hitType: 'event',
    eventCategory: 'Quiz',
    eventAction: (iscorrect ? 'Correct' : 'Incorrect') + ' Answer-' + type,
    eventLabel: qtext,
    eventValue: choice
  });
}
function reset_gloss() {
  var prefix;
  switch (MeoU.comic) {
    case MeoU.DAICOHEN:
      prefix = '';
      break;
    case MeoU.CONAN:
      prefix = MeoU.comic + '-';
      break;
    default:
      prefix = 'img/' + MeoU.comic + '-';
      break;
  }

  greenify_button(1); 
  show_layer1();
  show_pane_boxes();
  initial_pane();
  // Since this is triggered on page turn, cache new images
  if (MeoU.comic == MeoU.DAICOHEN) {
    $('.cache-layer-2').css('background-image', 'url("/' + (MeoU.comic == MeoU.DAICOHEN ? '' : MeoU.comic + '-') + 'gloss-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
    $('.cache-layer-3').css('background-image', 'url("/' + prefix + 'vi-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
  } else if (MeoU.comic == MeoU.CONAN) {
    $('.cache-layer-3').css('background-image', 'url("/' + (MeoU.comic == MeoU.DAICOHEN ? '' : MeoU.comic + '-') + 'vi-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
  } else {
    $('.cache-layer-3').css('background-image', 'url("/' + prefix + 'vi-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.png")');
  }

  // some pages are short and appear scrolled off when changing from a tall page, so scroll up
  var scrollpos = $('.main').offset().top - $('.navbar').height();
  if ($('body').hasClass('mode-gloss-overlay')) {
    if ($(window).width() > 900) {
    } else {
      scrollpos = $('.modal-backdrop.gloss-overlay').height() - parseInt($('.modal-backdrop.gloss-overlay').css('margin-top'));
    }
  }
  $('html, body').animate({
      scrollTop: scrollpos
    }, 500);
}
function click_english() {
  greenify_button(1);
  sendGaEvent('English');
  show_layer1();
}
function click_words() {
  if (MeoU.comic != MeoU.DAICOHEN) { return; }
  MeoU.points.add(2);
  greenify_button(2);
  sendGaEvent('Daicohen Gloss');
  show_layer2();
}
function click_viet() {
  MeoU.points.add(1);
  greenify_button(3);
  MeoU.userprofile.counts.increment('viet_switched');
  sendGaEvent('Vietnamese');
  show_layer3();
}
function show_layer1() {
  var prefix;
  switch (MeoU.comic) {
    case MeoU.DAICOHEN:
      prefix = '';
      break;
    case MeoU.CONAN:
      prefix = MeoU.comic + '-';
      break;
    default:
      prefix = 'img/' + MeoU.comic + '-';
      break;
  }
  if (MeoU.comic == MeoU.CONAN || MeoU.comic == MeoU.DAICOHEN) {
    $('.main').css('background-image', 'url("/' + (MeoU.comic == MeoU.DAICOHEN ? '' : MeoU.comic + '-') + 'en-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
  } else {
    $('.main').css('background-image', 'url("/'+ prefix + 'en-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.png"), url("/'+ prefix + 'bg-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
  }
}
function show_layer2() {
  $('.main').css('background-image', 'url("/' + (MeoU.comic == MeoU.DAICOHEN ? '' : MeoU.comic + '-') + 'gloss-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
}
function show_layer3() {
  var prefix;
  switch (MeoU.comic) {
    case MeoU.DAICOHEN:
      prefix = '';
      break;
    case MeoU.CONAN:
      prefix = MeoU.comic + '-';
      break;
    default:
      prefix = 'img/' + MeoU.comic + '-';
      break;
  }
  if (MeoU.comic == MeoU.CONAN || MeoU.comic == MeoU.DAICOHEN) {
    $('.main').css('background-image', 'url("/' + (MeoU.comic == MeoU.DAICOHEN ? '' : MeoU.comic + '-') + 'vi-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
  } else {
    $('.main').css('background-image', 'url("/' + prefix + 'vi-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.png"), url("/'+ prefix + 'bg-' + (MeoU.page < 10 ? '0' : '') + MeoU.page + '.jpg")');
  }
}
// use with dontStopPropagation if not from a click event
function close_dialog(selecta, dontStopPropagation) {
  var btn = 'Close ' + selecta;
  modal_overlays_showing[selecta] = false;
  if (dontStopPropagation !== true) {
    this.event.stopPropagation();
  }
  sendGaEvent(btn);
  $(selecta).fadeOut(200);
}
function close_modal_overlay_noGA(selecta) {
  modal_overlays_showing[selecta] = false;
  this.event.stopPropagation();
  $(selecta).hide();
}
function show_dialog(selecta) {
  var btn = 'Show ' + selecta;
  modal_overlays_showing[selecta] = true;
  sendGaEvent(btn);
  $(selecta).fadeIn(800);
}
function show_modal_overlay_noGA(selecta) {
  modal_overlays_showing[selecta] = true;
  //$(selecta).show();
  $(selecta).fadeIn(400);
}
function _show_dialog_noGA(selecta) {
  modal_overlays_showing[selecta] = true;
  $(selecta).fadeIn(800);
}
function add_title_to_body_class(title) {
  MeoU.comics.map(function(comic) { $('body').removeClass('comic-' + comic); });
  $('body').addClass('comic-' + title);
}
function add_mode_to_body_class(mode) {
  $('body').removeClass('mode-gloss-overlay');
  $('body').removeClass('mode-normal');
  $('body').addClass('mode-' + mode);
}
function update_comic_info_box(comic) {
  $('.comic-info h2').html(MeoU.comic_export[comic].title + ' - <span class="total-pages">' + MeoU.code.page_maxes[comic] + '</span> pages');
  $('.comic-info p').html(MeoU.comic_export[comic].about);
}
function handle_switch_comic(new_comic) {
  if (MeoU.comic == new_comic) return;

  sendGaEvent('Switch comic to ' + new_comic);
  MeoU.comic = new_comic;
  MeoU.page = 1;
  updateUrl(MeoU.page);
  reset_gloss();
  update_page_buttons();
  MeoU.init_comic(new_comic);
  update_comic_info_box(new_comic);

  MeoU.popquiz.question_queue = [];
  MeoU.popquiz.current_question = null;
  MeoU.popquiz.refresh_navbar_badge();

  if (! MeoU.userprofile.quiz_responses[new_comic]) {
    MeoU.popquiz.unpickle_quiz_responses(new_comic);
  }
}

function handle_coming_soon(title) {
  if (title != 'Dinosaur') {
    $('.jumbotron.coming-soon > h1').html(title);
    async_mailchimp();
    show_dialog('.jumbotron.coming-soon');
  }
  // console.log(title);
  sendGaEvent('Coming soon: ' + title);
}

function bgimage_click_handler(evt) {
  /* TODO */
  return;

  if (typeof modal_overlays_showing['.signup-info.jumbotron'] != 'undefined' && modal_overlays_showing['.signup-info.jumbotron'] === true) {
    return;
  }
  if (typeof modal_overlays_showing['.fbquestion-info.jumbotron'] != 'undefined' && modal_overlays_showing['.fbquestion-info.jumbotron'] === true) {
    return;
  }

  // This is the same div as .fbquestion-info, but different class for tracking purposes
  sendGaEvent('Background image click shows .general-help')
  show_dialog('.general-help.jumbotron');
}

function async_mailchimp() {
  var element = document.createElement("script");
  element.src = "//s3.amazonaws.com/downloads.mailchimp.com/js/mc-validate.js";
  document.body.appendChild(element);

  (function($) {window.fnames = new Array(); window.ftypes = new Array();fnames[0]='EMAIL';ftypes[0]='email';fnames[1]='FNAME';ftypes[1]='text';fnames[2]='LNAME';ftypes[2]='text';}(jQuery));var $mcj = jQuery.noConflict(true);
}

function fix_gloss_manga_widths() {
  if ($(window).width() > 900) {
    if ($(window).width() < $('.main').width() * 2) {
      $('.gloss-overlay').css('width', $(window).width() - $('.main').width());
      $('.manga').css('width', $('.main').width() + 10 );
    }
  }
}
MeoU.paneboxes = (function(){
  // Internal helper fns

  function pane_shrink(coord) {
    coord[0] +=.005;
    coord[1] += .005
    coord[2] -= .005;
    if (coord[3] != 1) {
      coord[3] -= .005;
    }
    return coord;
  }
  // Quarter rows
  function q1(x1, x2) { return pane_shrink([x1, 0, x2, .25]); }
  function q2(x1, x2) { return pane_shrink([x1, .25, x2, .5]); }
  function q3(x1, x2) { return pane_shrink([x1, .50, x2, .75]); }
  function q4(x1, x2) { return pane_shrink([x1, .75, x2, 1]); }
  // Half height row
  function h1(x1, x2) { return pane_shrink([x1, 0, x2, .5]); }
  function h_mid(x1, x2) { return pane_shrink([x1, 1/4, x2, 3/4]); }
  function h2(x1, x2) { return pane_shrink([x1, .5, x2, 1]); }

  var _paneDims = {}; // Dimensions
  _paneDims[MeoU.DAICOHEN] = {
    'p1-1': h1(0, 1),
    'p1-2': q3(.634, 1),
    'p1-3': q4(.634, 1),
    'p1-4': h2(0, .634),
    'p2-1': q1(2/3, 1),
    'p2-2': q1(0, 1/3),
    'p2-3': q2(2/3, 1),
    'p2-4': q2(1/3, 2/3),
    'p2-5': q2(0, 1/3),
    'p2-6': q3(.5, 1),
    'p2-7': q3(0, .5),
    'p2-8': q4(1/3, 1),
    'p2-9': q4(0, 1/3),
    'p3-1': q1(.6, 1),
    'p3-2': q1(0, .6),
    //'p3-3': q2(.5, 1),
    'p3-3': q2(0, .5),
    'p3-4': q3(0, .35),
    'p3-5': q4(0, 1),
    'p4-1': q1(.5, 1),
    'p4-2': q1(0, .5),
    'p4-3': q2(.5, 1),
    'p4-4': q2(0, .5),
    'p4-5': q3(0, .6),
    'p4-6': q4(2/3, 1),
    'p4-7': q4(1/3, 2/3),
    'p4-8': q4(0, 1/3),
    'p5-1': q1(.6, 1),
    'p5-2': q1(0, .6),
    'p5-3': h_mid(.39, 1),
    'p5-4': q2(0, .39),
    'p5-5': q3(0, .39),
    'p5-6': q4(.63, 1),
    'p5-7': q4(0, .63),
    /* No audio yet */
    /*
    'p6-1': q1(.44, 1),
    'p6-2': q1(0, .44),
    'p6-3': q2(.62, 1),
    'p6-4': q2(0, .62),
    'p6-5': q3(2/3, 1),
    'p6-6': q3(1/3, 2/3),
    'p6-7': q3(0, 1/3),
    'p6-8': q4(.58, 1),
    'p6-9': q4(0, .58),
    */
  };
  _paneDims[MeoU.CONAN] = {
    'p1-1': [.4, .1, .8, .3],
    'p1-2': [.62, .38, 1, .9],
    'p1-3': [0, .38, .62, .6],
    'p1-4': [0, .6, .62, .9],
    'p2-1': [.5, 0, 1, .5],
    'p3-1': [.58, 0, .99, .5],
    'p3-2': [0, 0, .58, .5],
    'p4-1': [0, 0, .95, .156],
    'p4-2': [0, .16, 1, .6],
  }
  _paneDims[MeoU.CONANCH1_1] = {
    'p1-1': [0.4, 0.1, 0.8, 0.3],
    'p1-2': [0.64, 0.4, 0.99, 0.93],
    'p1-3': [0.07, 0.4, 0.63, 0.64],
    'p1-4': [0, 0.65, 0.64, 0.93],
    'p2-1': [0.5, 0, 1, 0.5],
    'p3-1': [0.58, 0, 0.99, 0.41],
    'p3-2': [0, 0, 0.58, 0.41],
    'p3-3': [0, 0.43, 0.93, 0.58],
    'p3-4': [0, 0.59, 1, 1],
    'p4-1': [0, 0, 0, 0],
    'p4-2': [0.73, 0.48, 0.98, 0.93],
    'p4-3': [0.34, 0.48, 0.73, 0.68],
    'p4-4': [0.09, 0.48, 0.34, 0.68],
    'p4-5': [0, 0.68, 0.72, 1],
    'p5-1': [0.08, 0.31, 0.96, 0.49],
    'p5-2': [0.64, 0.5, 0.96, 1],
    'p5-3': [0.32, 0.5, 0.64, 0.78],
    'p5-4': [0.01, 0.5, 0.31, 0.78],
    'p6-1': [0.52, 0.07, 1, 0.67],
    'p6-2': [0.02, 0.07, 0.52, 0.31],
    'p6-3': [0.02, 0.33, 0.52, 0.5],
    'p6-4': [0.02, 0.52, 0.52, 0.67],
    'p6-5': [0.32, 0.69, 0.92, 0.99],
    'p6-6': [0.02, 0.69, 0.32, 0.99],
    'p7-1': [0.67, 0, 0.96, 0.46],
    'p7-2': [0.46, 0.08, 0.66, 0.46],
    'p7-3': [0.08, 0.08, 0.45, 0.27],
    'p7-4': [0.08, 0.29, 0.45, 0.46],
    'p7-5': [0.62, 0.47, 0.96, 0.68],
    'p7-6': [0.08, 0.47, 0.62, 0.68],
    'p7-7': [0, 0.68, 1, 1],
    'p8-1': [0.5, 0, 1, 0.44],
    'p8-2': [0.02, 0.08, 0.49, 0.26],
    'p8-3': [0.02, 0.27, 0.49, 0.44],
    'p8-4': [0.46, 0.46, 0.91, 0.64],
    'p8-5': [0.02, 0.46, 0.46, 0.64],
    'p8-6': [0.41, 0.66, 1, 1],
    'p8-7': [0.02, 0.66, 0.41, 1],
    'p9-1': [0.45, 0, 0.98, 1],
    'p9-2': [0, 0, 0.45, 0.34],
    'p9-3': [0, 0.36, 0.45, 0.62],
    'p9-4': [0.09, 0.64, 0.45, 0.93],
    'p10-1': [0.39, 0, 1, 0.43],
    'p10-2': [0.04, 0.1, 0.35, 0.43],
    'p10-3': [0.04, 0.45, 0.91, 0.7],
  }
  _paneDims[MeoU.CONANCH1_2] = {
    'p1-1': [0.63, 0, 0.97, 0.44],
    'p1-2': [0, 0, 0.63, 0.26],
    'p1-3': [0.09, 0.27, 0.63, 0.44],
    'p1-4': [0.66, 0.46, 0.97, 1],
    'p1-5': [0.09, 0.46, 0.66, 0.64],
    'p1-6': [0.35, 0.66, 0.66, 1],
    'p1-7': [0, 0.66, 0.34, 0.93],
    'p2-1': [0.67, 0, 1, 0.52],
    'p2-2': [0, 0.09, 0.66, 0.32],
    'p2-3': [0, 0.34, 0.66, 0.52],
    'p2-4': [0, 0.54, 1, 0.74],
    'p2-5': [0, 0.76, 1, 1],
    'p3-1': [0, 0, 0.95, 0.28],
    'p3-2': [0.07, 0.46, 0.95, 0.7],
    'p3-3': [0.63, 0.72, 0.95, 1],
    'p3-4': [0, 0.72, 0.63, 1],
    'p4-1': [0.36, 0, 1, 0.43],
    'p5-1': [0, 0.37, 0.97, 0.57],
    'p5-2': [0, 0.6, 0.97, 1],
    'p6-1': [0, 0, 0, 0],
    'p7-1': [0.03, 0, 0.96, 0.36],
    'p7-2': [0.08, 0.38, 0.96, 0.64],
    'p7-3': [0.5, 0.66, 0.96, 1],
    'p7-4': [0.03, 0.66, 0.5, 1],
    'p8-1': [0.03, 0, 0.97, 0.3],
    'p8-2': [0.57, 0.33, 0.97, 0.6],
    'p8-3': [0.03, 0.33, 0.57, 0.6],
    'p8-4': [0.03, 0.62, 0.96, 1]
  }
  _paneDims[MeoU.CONANCH1_3] = {
    'p1-1': [0.7, 0, 0.99, 0.38],
    'p1-2': [0.09, 0.09, 0.7, 0.38],
    'p1-3': [0.09, 0.4, 0.99, 0.68],
    'p1-4': [0.38, 0.71, 0.99, 1],
    'p1-5': [0.01, 0.71, 0.38, 1],
    'p2-1': [0.53, 0, 1, 0.49],
    'p2-2': [0.28, 0, 0.52, 0.49],
    'p2-3': [0.01, 0, 0.28, 0.49],
    'p2-4': [0.01, 0.51, 1, 0.68],
    'p2-5': [0.01, 0.69, 0.52, 1],
    'p3-1': [0.02, 0, 0.97, 0.35],
    'p3-2': [0.09, 0.36, 0.97, 0.54],
    'p3-3': [0.09, 0.55, 0.66, 0.78],
    'p3-4': [0.09, 0.78, 0.66, 1],
    'p4-1': [0, 0, 1, 0.4],
    'p4-2': [0, 0.42, 0.41, 0.71],
    'p4-3': [0.6, 0.73, 0.92, 0.99],
    'p4-4': [0, 0.73, 0.6, 0.99],
    'p5-1': [0.43, 0, 0.96, 0.43],
    'p5-2': [0.04, 0, 0.43, 0.43],
    'p5-3': [0.04, 0.44, 0.96, 0.64],
    'p5-4': [.04, .66, .96, 1],
    'p6-1': [0.34, 0, 0.99, 0.32],
    'p6-2': [0.01, 0, 0.33, 0.32],
    'p6-3': [0.01, 0.33, 0.99, 0.48],
    'p6-4': [0.48, 0.5, 0.99, 1],
    'p6-5': [0.01, 0.5, 0.47, 0.68],
    'p6-6': [0.01, 0.7, 0.47, 1],
    'p7-1': [0.54, 0.06, 0.99, 0.31],
    'p7-2': [0.08, 0.06, 0.53, 0.31],
    'p7-3': [0.08, 0.33, 0.99, 0.54],
    'p7-4': [0.63, 0.56, 0.99, 0.93],
    'p7-5': [0.31, 0.56, 0.63, 0.93],
    'p7-6': [0, 0.56, 0.31, 1],
    'p8-1': [0.01, 0, 0.99, 0.42],
    'p8-2': [0.67, 0.55, 0.99, 1],
    'p8-3': [0.27, 0.55, 0.67, 0.74],
    'p8-4': [0.01, 0.55, 0.26, 0.74],
    'p8-5': [0.01, 0.76, 0.67, 1],
    'p9-1': [0.48, 0, 0.97, 0.3],
    'p9-2': [0, 0, 0.46, 0.3],
    'p9-3': [0, 0.3, 0.97, 0.5],
    'p9-4': [0, 0.5, 0.97, 0.73],
    'p9-5': [0, 0.73, 0.97, 1],
  }
  _paneDims[MeoU.CONANCH1_4] = {
    'p1-1': [0.58, 0, 0.99, 0.46],
    'p1-2': [0.02, 0.04, 0.57, 0.46],
    'p1-3': [0.02, 0.48, 0.53, 0.62],
    'p1-4': [0.64, 0.64, 0.99, 1],
    'p1-5': [0.36, 0.64, 0.65, 1],
    'p1-6': [0.02, 0.64, 0.35, 1],
    'p2-1': [0.02, 0, 0.97, 0.56],
    'p2-2': [0.09, 0.58, 0.97, 0.72],
    'p2-3': [0.31, 0.73, 0.64, 1],
    'p2-4': [0.02, 0.73, 0.31, 1],
    'p3-1': [0.51, 0, 0.99, 0.43],
    'p3-2': [0.01, 0, 0.5, 0.24],
    'p3-3': [0.01, 0.26, 0.5, 0.43],
    'p3-4': [0.01, 0.44, 0.91, 0.6],
    'p3-5': [0.69, 0.62, 0.91, 0.93],
    'p3-6': [0.35, 0.62, 0.69, 0.93],
    'p3-7': [0.01, 0.62, 0.34, 1],
    'p4-1': [0.52, 0, 0.97, 0.34],
    'p4-2': [0.01, 0, 0.52, 0.34],
    'p4-3': [0.01, 0.36, 0.97, 0.53],
    'p4-4': [0.01, 0.55, 0.97, 0.72],
    'p4-5': [0.63, 0.73, 0.97, 1],
    'p4-6': [0.34, 0.73, 0.62, 1],
    'p4-7': [0.01, 0.73, 0.34, 1],
    'p5-1': [0.6, 0.01, 1, 0.46],
    'p5-2': [0, 0.01, 0.39, 0.46],
    'p5-3': [0, 0.47, 0.92, 0.64],
    'p5-4': [0, 0.66, 0.92, 0.83],
    'p6-1': [0.57, 0, 0.97, 0.52],
    'p6-2': [0.08, 0.08, 0.56, 0.27],
    'p6-3': [0.08, 0.28, 0.56, 0.52],
    'p6-4': [0.69, 0.53, 0.97, 0.92],
    'p6-5': [0.39, 0.53, 0.69, 0.92],
    'p6-6': [0.03, 0.53, 0.39, 1]
  }

  _paneDims[MeoU.DORAPLUS1] = {
    'p1-1': q1(0, 1),
    'p1-2': q2(1/3, 1),
    'p1-3': q2(0, 1/3),
    'p1-4': q3(.55, 1),
    'p1-5': q3(0, .55),
    'p1-6': q4(2/3, 1),
    'p1-7': q4(1/3, 2/3),
    'p2-1': q1(.6, 1),
    'p2-2': q1(0, .6),
    'p2-3': q2(.7, 1),
    'p2-4': q2(0, .7),
    'p2-5': q3(.5, 1),
    'p2-6': q3(0, .5),
    'p2-7': q4(0, 1),
    'p3-1': q1(.5, 1),
    'p3-2': q1(0, .5),
    'p3-3': q2(.6, 1),
    'p3-4': q2(0, .6),
    'p3-5': q3(.44, .77),
    'p3-6': q3(0, .44),
    'p3-7': q4(0, 1),
    'p4-1': q1(.72, 1),
    'p4-2': q2(0, 1),
    'p4-3': q3(1/3, 1),
    'p4-4': q3(0, 1/3),
    'p4-5': q4(.55, 1),
    'p4-6': q4(0, .55),
    'p5-1': q1(.627, 1),
    'p5-2': q1(0, .627),
    'p5-3': q2(.5, 1),
    'p5-4': q2(0, .5),
    'p5-5': h2(.4, 1),
    'p5-6': q4(0, .4),
    'p6-1': q1(0, 1),
    'p6-2': q2(0, 1),
    'p6-3': q3(.62, 1),
    'p6-4': q3(0, .62),
    'p6-5': q4(0, 1),
    'p7-1': q1(.29, 1),
    'p7-2': q1(0, .29),
    'p7-3': q2(.74, 1),
    'p7-4': q2(0, .46),
    'p7-5': q3(.53, 1),
    'p7-6': q3(0, .53),
    'p7-7': q4(.5, 1),
    'p7-8': q4(0, .5),
    'p8-1': q1(.6, 1),
    'p8-2': q1(0, .6),
    'p8-3': q2(.5, 1),
    'p8-4': q2(0, .5),
    'p8-5': h2(0, 1)
  }
  _paneDims[MeoU.DORAPLUS1CH2] = {
    'p1-1': [.56, .29, 1, .49],
    'p1-2': [.56, .5, 1, .71],
    'p1-3': [.56, .72, 1, 1],
    'p2-1': [.56, 0, 1, .17],
    'p2-2': [0, .36, 1, .83],
    'p3-1': q1(.32, 1),
    'p3-2': q2(0, 1),
    'p3-3': q3(.5, 1),
    'p3-4': q3(0, .5),
    'p3-5': q4(1/3, 2/3),
    'p3-6': q4(0, 1/3),
    'p4-1': q1(.5, 1),
    'p4-2': q2(.38, 1),
    'p4-3': q2(0, .37),
    'p4-4': q3(.5, 1),
    'p4-5': q4(.5, 1),
    'p5-1': q2(2/3, 1),
    'p5-2': q2(0, 2/3),
    'p5-3': q3(.5, 1),
    'p5-4': q3(0, .5),
    'p5-5': q4(1/3, 1),
    'p5-6': q4(0, 1/3),
    'p6-1': q1(0, .27),
    'p6-2': q2(.5, 1),
    'p6-3': q2(0, .5),
    'p6-4': q3(2/3, 1),
    'p6-5': q4(2/3, 1),
    'p6-6': h2(0, 2/3),
  }
  _paneDims[MeoU.DORAPLUS1CH3] = {
    'p1-1': [0, 0, 0.62, 0.27],
    'p1-2': [0, 0.28, 0.55, 0.42],
    'p1-3': [0, 0.43, 0.55, 0.57],
    'p1-4': [0, 0.58, 0.55, 0.7],
    'p1-5': [0, 0.72, 0.62, 1],
    'p2-1': q1(.5, 1),
    'p2-2': q1(0, .5),
    'p2-3': q2(2/3, 1),
    'p2-4': q2(1/3, 2/3),
    'p2-5': q2(0, 1/3),
    'p2-6': q3(.42, 1),
    'p2-7': q4(2/3, 1),
    'p2-8': q4(1/3, 2/3),
    'p2-9': q4(0, 1/3),
    'p3-1': q1(.37, 1),
    'p3-2': q1(0, .37),
    'p3-3': q2(2/3, 1),
    'p3-4': q2(1/3, 2/3),
    'p3-5': q2(0, 1/3),
    'p3-6': q3(.57, 1),
    'p3-7': q3(0, .57),
    'p3-8': q4(0, .41),
    'p4-1': q1(.5, 1),
    'p4-2': q1(0, .5),
    'p4-3': q2(2/3, 1),
    'p4-4': q2(1/3, 2/3),
    'p4-5': q2(0, 1/3),
    'p4-6': q3(.44, 1),
    'p4-7': q3(0, .44),
    'p4-8': q4(1/3, 1),
    'p4-9': q4(0, 1/3),
    'p5-1': q1(.45, 1),
    'p5-2': q1(0, .45),
    'p5-3': q2(.55, 1),
    'p5-4': q2(0, .55),
    'p5-5': q3(.5, 1),
    'p5-6': q4(.5, 1),
    'p5-7': q4(0, .5),
    'p6-1': q1(.5, 1),
    'p6-2': q1(0, .5),
    'p6-3': q2(.5, 1),
    'p6-4': q2(0, .5),
    'p6-5': q3(.5, 1),
    'p6-6': q3(0, .5),
    'p6-7': q4(.5, 1),
    'p6-8': q4(0, .5),
    'p7-1': q1(1/3, 1),
    'p7-2': q1(0, 1/3),
    'p7-3': q2(2/3, 1),
    'p7-4': q2(0, 2/3),
    'p7-5': q3(.5, 1),
    'p7-6': q3(0, .5),
    'p7-7': q4(0, .5),
    'p8-1': h1(1/3, 1),
    'p8-2': h1(0, 1/3),
    'p8-3': q4(.5, 1),
    'p8-4': q4(0, .5),
    'p9-1': q1(0, 1),
    'p9-2': q2(.62, 1),
    'p9-3': h2(0, 1)
  }

  _paneDims[MeoU.DORAPLUS1CH4] = {
    'p1-1': q1(.44, 1),
    'p1-2': q1(0, .44),
    'p1-3': q2(.37, 1),
    'p1-4': q2(0, .37),
    'p1-5': q3(.5, 1),
    'p1-6': q3(0, .5),
    'p1-7': q4(.54, 1),
    'p1-8': q4(.26, .53),
    'p1-9': q4(0, .26),
    'p2-1': q1(.66, 1),
    'p2-2': q1(0, .66),
    'p2-3': q2(.57, 1),
    'p2-4': q2(.29, .57),
    'p2-5': q2(0, .29),
    'p2-6': q3(.45, 1),
    'p2-7': q3(0, .45),
    'p2-8': q4(.66, 1),
    'p2-9': q4(0, .66),
    'p3-1': q1(.66, 1),
    'p3-2': q1(.33, .66),
    'p3-3': q2(.5, 1),
    'p3-4': q2(0, .5),
    'p3-5': q3(.5, 1),
    'p3-6': q3(0, .5),
    'p3-7': q4(0, .44),
    'p4-1': q1(.5, 1),
    'p4-2': q1(0, .5),
    'p4-3': q2(.76, 1),
    'p4-4': q3(.5, 1),
    'p4-5': q3(0, .5),
    'p4-6': q4(.29, .66),
    'p5-1': q1(.54, 1),
    'p5-2': q2(.62, 1),
    'p5-3': q2(0, .43),
    'p5-4': q3(.33, .66),
    'p5-5': q3(0, .33),
    'p6-1': q1(0, .35),
    'p6-2': q2(.55, 1),
    'p6-3': q2(.2, .55),
    'p6-4': q2(0, .2),
    'p6-5': h2(0, 1),
  };

  _paneDims[MeoU.DORAPLUS1CH5] = {
    'p1-1': [0.55, 0.6, 1, 0.8],
    'p1-2': [0, 0.6, 0.55, 0.8],
    'p1-3': [0.47, 0.8, 1, 1],
    'p1-4': [0, 0.8, 0.46, 1],
    'p2-1': q1(0, .57),
    'p2-2': q2(.5, 1),
    'p2-3': q2(0, .5),
    'p2-4': q3(0, .5),
    'p2-5': q4(0, .5),
    'p3-1': q1(0, .66),
    'p3-2': q2(.44, 1),
    'p3-3': q2(0, .44),
    'p3-4': q3(.66, 1),
    'p3-5': q3(.37, .66),
    'p3-6': q3(0, .37),
    'p3-7': q4(.44, 1),
    'p3-8': q4(0, .44),
    'p4-1': q1(.45, 1),
    'p4-2': q1(0, .45),
    'p4-3': q2(.6, 1),
    'p4-4': q2(0, .6),
    'p4-5': q3(.5, 1),
    'p4-6': q3(0, .5),
    'p4-7': q4(.5, 1),
    'p4-8': q4(0, .5),
    'p5-1': q1(.6, 1),
    'p5-2': q1(0, .6),
    'p5-3': q3(.38, 1),
    'p5-4': q3(0, .38),
    'p5-5': q4(0, .6),
    'p6-1': h1(0, .56),
    'p6-2': q3(.4, 1),
    'p6-3': q4(.5, 1),
    'p6-4': q4(0, .5),
    'p7-1': h1(.54, 1),
    'p7-2': h1(0, .54),
    'p7-3': q3(.5, 1),
    'p7-4': q3(0, .5),
    'p7-5': q4(.5, 1),
    'p7-6': q4(0, .5),
    'p8-1': q1(.35, 1),
    'p8-2': q2(0, 1),
    'p8-3': q3(.52, 1),
    'p8-4': q3(0, .51),
    'p8-5': q4(.47, 1),
    'p8-6': q4(0, .47),
    'p9-1': q1(.37, 1),
    'p9-2': q1(0, .37),
    'p9-3': q2(.37, 1),
    'p9-4': q2(0, .37)
  };

  _paneDims[MeoU.DORAPLUS1CH6] = {
    'p1-1': [0, 0, 0.61, 0.29],
    'p1-2': [0.05, 0.3, 0.61, 0.51],
    'p1-3': [0.34, 0.52, 0.61, 0.73],
    'p1-4': [0.05, 0.52, 0.33, 0.73],
    'p1-5': [0, 0.74, 0.61, 1],
    'p2-1': q1(.75,1),
    'p2-2': q1(.5,.75),
    'p2-3': q1(0,.5),
    'p2-4': q2(.54,1),
    'p2-5': q2(0,.53),
    'p2-6': q3(.7,1),
    'p2-7': q3(.45,.7),
    'p2-8': q3(0,.45),
    'p2-9': q4(.59,1),
    'p2-10': q4(0,.59),
    'p3-1': q1(.5,1),
    'p3-2': q1(0,.5),
    'p3-3': q2(.44,1),
    'p3-4': q3(.37,1),
    'p3-5': q3(0,.37),
    'p3-6': q4(.5,1),
    'p3-7': q4(0,.5),
    'p4-1': q1(.62,1),
    'p4-2': q1(0,.62),
    'p4-3': q2(.33,1),
    'p4-4': q2(0,.33),
    'p4-5': q3(0,.5),
    'p4-6': q4(.38,1),
    'p5-1': q1(0,.44),
    'p5-2': q2(.66,1),
    'p5-3': q3(0,1),
    'p6-1': q1(0,.5),
    'p6-2': q2(.5,1),
    'p6-3': q2(.18, .5),
    'p6-4': q3(.34, 1),
    'p6-5': q3(0, .33),
    'p6-6': q4(.54, 1),
    'p6-7': q4(0, .54),
    'p7-1': q1(0, .5),
    'p7-2': q2(.5, 1),
    'p7-3': q2(0, .5),
    'p7-4': h2(0, 1),
  };
  
  _paneDims[MeoU.DORAPLUS1CH7] = {
    'p1-1': [0, 0, 0.61, 0.29],
    'p1-2': [0.05, 0.3, 0.61, 0.5],
    'p1-3': [0.05, 0.52, 0.61, 0.72],
    'p1-4': [0, 0.73, 0.61, 1],
    'p2-1': q1(.5,1),
    'p2-2': q2(.56,1),
    'p2-3': q2(0,.55),
    'p2-4': q3(.67,1),
    'p2-5': q3(.41,.67),
    'p2-6': q4(.5,1),
    'p2-7': q4(0,.28),
    'p3-1': q1(0,.33),
    'p3-2': q2(.33,.7),
    'p3-3': q2(0,.33),
    'p3-4': q3(.67,1),
    'p3-5': q3(.33,.67),
    'p3-6': q3(0,.33),
    'p3-7': q4(.5,1),
    'p3-8': q4(0,.5),
    'p4-1': q1(.44,1),
    'p4-2': q1(0,.43),
    'p4-3': q3(.62,1),
    'p4-4': q3(0,.61),
    'p4-5': q4(.55,1),
    'p4-6': q4(0,.55),
    'p5-1': q1(.5,1),
    'p5-2': q1(0,.5),
    'p5-3': q2(.5,1),
    'p5-4': q2(0,.5),
    'p5-5': q3(.38,1),
    'p6-1': q1(.63,1),
    'p6-2': q1(0,.62),
    'p6-3': q2(.7,1),
    'p6-4': q2(.45,.7),
    'p6-5': q2(0,.44),
    'p6-6': q3(.63,1),
    'p6-7': q4(.33,1),
    'p6-8': q4(0,.33),
    'p7-1': q1(.67,1),
    'p7-2': q1(.25,.66),
    'p7-3': q2(.34,.57),
    'p7-4': q2(0,.33),
    'p7-5': q3(.42,1),
    'p7-6': q3(0,.41),
    'p7-7': q4(0,.5),
    'p8-1': q1(.62,1),
    'p8-2': q1(0,.62),
    'p8-3': q2(.62,1),
    'p8-4': q3(.5,1),
    'p8-5': q3(0,.5),
    'p8-6': q4(.5,1),
    'p8-7': q4(0,.5),
    'p9-1': q2(.29,.79),
    'p9-2': q2(0,.27),
    'p9-3': h2(0,1)
  };
  
  _paneDims[MeoU.DORAPLUS1CH8] = {
    'p1-1': q1(0,1),
    'p1-2': q2(0, .32),
    'p1-3': q3(.67,1),
    'p1-4': q4(.67,1),
    'p2-1': q1(0,.65),
    'p2-2': q2(.67,1),
    'p2-3': q2(.33,.65),
    'p2-4': q2(0,.33),
    'p2-5': q3(0,1),
    'p2-6': q4(.62,1),
    'p2-7': q4(0,.61),
    'p3-1': h1(0, 1),
    'p3-2': q3(.5, 1),
    'p3-3': q3(0, .5),
    'p3-4': q4(.67, 1),
    'p3-5': q4(.33, .66),
    'p3-6': q4(0, .33),
    'p4-1': q1(.62,1),
    'p4-2': q1(0,.6),
    'p4-3': q2(.5,1),
    'p4-4': q2(0,.5),
    'p4-5': q3(0,1),
    'p4-6': q4(.65, 1),
    'p4-7': q4(.34, .64),
    'p4-8': q4(0, .33),
    'p5-1': h1(.36,1),
    'p5-2': q1(0,.35),
    'p5-3': q2(0,.35),
    'p5-4': q3(0,1),
    'p5-5': q4(.67,1),
    'p5-6': q4(0,.66),
    'p6-1': q1(.66,1),
    'p6-2': q1(0,.65),
    'p6-3': q2(.66,1),
    'p6-4': q3(0,1),
    'p6-5': q4(.5,1),
    'p6-6': q4(0,.5),
    'p7-1': q1(.67,1),
    'p7-2': q1(.33,.66),
    'p7-3': q1(0,.33),
    'p7-4': q2(.37,1),
    'p7-5': q3(0,1),
    'p7-6': q4(0,.4),
    'p8-1': q1(0,1),
    'p8-2': q2(.5,1),
    'p8-3': q2(0,.5),
    'p8-4': q3(.5,1),
    'p8-5': q3(0,.5),
    'p8-6': q4(0,1),
    'p9-1': q1(.5,1),
    'p9-2': [0.41, 0.25, 1, 0.75],
    'p9-3': q2(0,.4),
    'p9-4': q3(0,.4),
    'p9-5': q4(.67,1),
    'p9-6': q4(.33, .66),
    'p9-7': q4(0, .33),
    'p10-1': q1(0,1),
    'p10-2': q2(.5,1),
    'p10-3': q2(0, .5),
    'p10-4': q3(.34, 1),
    'p10-5': q3(0, .33),
    'p10-6': q4(.5, 1),
    'p10-7': q4(0, .5),
    'p11-1': q1(.5, 1),
    'p11-2': q1(0, .5),
    'p11-3': q2(.63, 1),
    'p11-4': q3(.63, 1),
    'p11-5': [0, 0.25, 0.62, 0.75],
    'p11-6': q4(.5, 1),
    'p11-7': q4(0, .5),
    'p12-1': q1(.5,1),
    'p12-2': q1(0,.5),
    'p12-3': q2(.5,1),
    'p12-4': q2(0,.5),
    'p12-5': q3(.5,1),
    'p12-6': q3(0,.5),
    'p12-7': q4(.56,1),
    'p12-8': q4(0,.55),
    'p13-1': q1(0,1),
    'p13-2': q2(.5,1),
    'p13-3': q2(0,.5),
    'p13-4': q3(.5,1),
    'p13-5': q4(0,.5),
    'p14-1': q1(.5, 1),
    'p14-2': q1(0, .5),
    'p14-3': q2(.57, 1),
    'p14-4': q2(0, .57),
    'p14-5': q3(.62, 1),
    'p14-6': q4(.62, 1),
    'p14-7': h2(0, .61)
  };
  _paneDims[MeoU.DORAPLUS1CH9] = {
    'p2-1': q1(.5,1),
    'p2-2': q1(0, .5),
    'p2-3': q2(0, .66),
    'p2-4': q3(.5, 1),
    'p2-5': q3(0, .5),
    'p2-6': q4(.55, 1),
    'p2-7': q4(.28, .54),
    'p2-8': q4(0, .28),
    'p3-1': q1(.5, 1),
    'p3-2': q1(0, .5),
    'p3-3': q2(.5, 1),
    'p3-4': q2(0, .5),
    'p3-5': q3(.5, 1),
    'p3-6': q3(0, .5),
    'p3-7': q4(.55, 1),
    'p3-8': q4(0, .54),
    'p4-1': q1(0, 1/3),
    'p4-2': q2(.5, 1),
    'p4-3': q2(0, .5),
    'p4-4': q3(.5, 1),
    'p4-5': q4(.39, 1),
    'p4-6': q4(0, .38),
    'p5-1': q1(.56, 1),
    'p5-2': q1(.2, .56),
    'p5-3': q2(0, .5),
    'p5-4': q3(.56, 1),
    'p5-5': q3(0, .56),
    'p6-1': q1(0, .5),
    'p6-2': q2(.38, 1),
    'p6-3': q2(0, .38),
    'p6-4': q3(.33, .73),
    'p6-5': q3(0, .33),
    'p6-6': q4(0, .65),
    'p7-1': q1(.5, 1),
    'p7-2': q1(0, .5),
    'p7-3': q2(.55, 1),
    'p7-4': q2(0, .55),
    'p7-5': q3(0, 1),
    'p7-6': q4(.55, 1),
    'p7-7': q4(0, .55),
    'p8-1': q1(.5, 1),
    'p8-2': q1(0, .5),
    'p8-3': q2(.5, 1),
    'p8-4': h2(0, 1),
  };

  _paneDims[MeoU.DORAPLUS1CH10] = {
    'p2-1': q1(.5, 1),
    'p2-2': q1(0, .5),
    'p2-3': q2(1/3, 1),
    'p2-4': q2(0, 1/3),
    'p2-5': q3(2/3, 1),
    'p2-6': q3(0, 2/3),
    'p2-7': q4(1/3, 1),
    'p2-8': q4(0, 1/3),
    'p3-1': [0, 0, 1, 0.34],
    'p3-2': [0, 0.34, 1, 0.5],
    'p3-3': q3(.54, 1),
    'p3-4': q3(0, .54),
    'p3-5': q4(.67, 1),
    'p3-6': q4(.38, .67),
    'p3-7': q4(0, .37),
    'p4-1': q1(.75, 1),
    'p4-2': q1(.5, .75),
    'p4-3': q1(0, .5),
    'p4-4': q2(.75, 1),
    'p4-5': q2(0, .33),
    'p4-6': q3(.5, 1),
    'p4-7': q3(0, .5),
    'p4-8': q4(.33, 1),
    'p4-9': q4(0, .33),
    'p5-1': q1(0, .5),
    'p5-2': q2(.4, 1),
    'p5-3': q2(0, .4),
    'p5-4': q3(.5, 1),
    'p5-5': q3(0, .5),
    'p5-6': q4(0, .5),
    'p6-1': q1(.5, 1),
    'p6-2': q2(.75, 1),
    'p6-3': q2(.5, .75),
    'p6-4': q2(0, .5),
    'p6-5': q3(.5, 1),
    'p6-6': q3(0, .5),
    'p6-7': q4(.5, 1),
    'p6-8': q4(0, .5),
    'p7-1': q1(.5, 1),
    'p7-2': q1(0, .5),
    'p7-3': q2(.44, 1),
    'p7-4': q2(0, .44),
    'p7-5': q3(.5, 1),
    'p7-6': q4(0, 1),
    'p8-1': q1(.5, 1),
    'p8-2': q1(0, .5),
    'p8-3': q2(0, 1),
    'p8-4': q3(0, .5),
    'p8-5': q4(.71, 1),
    'p8-6': q4(.28, .71),
    'p8-7': q4(0, .27),
    'p9-1': q1(.66, 1),
    'p9-2': q1(0, .66),
    'p9-3': [0, 0.25, 1, 0.6],
    'p9-4': [0, 0.6, 1, 0.75],
    'p9-5': q4(.45, 1),
    'p9-6': q4(0, .45),
    'p10-1': q1(.5, 1),
    'p10-2': q1(0, .5),
    'p10-3': q2(0, 1),
    'p10-4': [0, 0.5, 1, 0.65],
    'p10-5': [0, 0.65, 1, 1],
  };

  _paneDims[MeoU.DORAPLUS1CH11] = {
    'p2-1': q1(0, 1),
    'p2-2': q3(.42, 1),
    'p2-3': q3(0, .41),
    'p2-4': q4(0, 1),
    'p3-1': q1(.65, 1),
    'p3-2': q1(0, .64),
    'p3-3': q2(.65, 1),
    'p3-4': q2(0, .64),
    'p3-5': q3(0, .5),
    'p3-6': q4(.6, 1),
    'p3-7': q4(0, .6),
    'p4-1': q1(.64, 1),
    'p4-2': q1(0, .63),
    'p4-3': q2(.44, 1),
    'p4-4': q2(0, .43),
    'p4-5': h2(.38, 1),
    'p4-6': q3(0, .37),
    'p4-7': q4(0, .37),
    'p5-1': q1(0, 1),
    'p5-2': q2(0, .58),
    'p5-3': q3(.33, 1),
    'p5-4': q3(0, .33),
    'p5-5': q4(0, .62),
    'p6-1': q1(.57, 1),
    'p6-2': q2(.42, 1),
    'p6-3': q2(0, .42),
    'p6-4': q3(.64, 1),
    'p6-5': h2(0, .63),
    'p7-1': q1(.63, 1),
    'p7-2': q1(0, .62),
    'p7-3': q2(.5, 1),
    'p7-4': q2(0, .5),
    'p7-5': h2(0, 1)
  }

  _paneDims[MeoU.DORAPLUS1CH12] = {
    'p1-1': [0.03, 0.01, 0.59, 0.29],
    'p1-2': [0.31, 0.3, 0.59, 0.51],
    'p1-3': [0.03, 0.3, 0.31, 0.51],
    'p1-4': [0.31, 0.52, 0.59, 0.72],
    'p1-5': [0.03, 0.52, 0.31, 0.72],
    'p1-6': [0, 0.74, 0.59, 1],
    'p2-1': q1(.56, 1),
    'p2-2': q1(0, .55),
    'p2-3': q2(.72, 1),
    'p2-4': q2(.43, .71),
    'p2-5': q2(0, .42),
    'p2-6': q3(.56, 1),
    'p2-7': q3(0, .55),
    'p2-8': q4(.32, 1),
    'p3-1': q1(.38, 1),
    'p3-2': q1(0, .37),
    'p3-3': q2(.75, 1),
    'p3-4': q2(.5, .75),
    'p3-5': q2(0, .5),
    'p3-6': q3(.37, 1),
    'p3-7': q3(0, .37),
    'p3-8': q4(.55, 1),
    'p3-9': q4(.25, .55),
    'p3-10': q4(0, .25),
    'p4-1': q1(.67, 1),
    'p4-2': q1(.34, .66),
    'p4-3': q1(0, .33),
    'p4-4': q2(.4, 1),
    'p4-5': q2(0, .4),
    'p4-6': q3(.58, 1),
    'p4-7': q3(0, .57),
    'p4-8': q4(.66, 1),
    'p4-9': q4(0, .66),
    'p5-1': q1(.74, 1),
    'p5-2': q1(.4, .73),
    'p5-3': q1(0, .38),
    'p5-4': q2(.5, 1),
    'p5-5': q2(0, .5),
    'p5-6': q3(.5, 1),
    'p5-7': q3(0, .5),
    'p5-8': q4(.38, 1),
    'p5-9': q4(0, .38),
    'p6-1': h1(.38, 1),
    'p6-2': q1(0, .37),
    'p6-3': q2(0, .37),
    'p6-4': q3(.5, 1),
    'p6-5': q3(0, .5),
    'p6-6': q4(.44, 1),
    'p6-7': q4(0, .44),
    'p7-1': q1(.5, 1),
    'p7-2': q1(0, .5),
    'p7-3': q2(.67, 1),
    'p7-4': q2(.38, .67),
    'p7-5': q2(0, .37),
    'p7-6': h2(0, 1),
  };

  _paneDims[MeoU.DORAPLUS1CH13] = {
    'p2-1': h1(.5, 1),
    'p2-2': q1(0, .5),
    'p2-3': q2(0, .5),
    'p2-4': q3(.33, 1),
    'p2-5': q3(0, .33),
    'p2-6': q4(.5, 1),
    'p2-7': q4(0, .5),
    'p3-1': q1(0, .5),
    'p3-2': q3(.67, 1),
    'p3-3': q3(.33, .67),
    'p3-4': q3(0, .33),
    'p3-5': q4(.4, 1),
    'p3-6': q4(0, .4),
    'p4-1': q1(.38, 1),
    'p4-2': q1(0, .37),
    'p4-3': q2(.5, 1),
    'p4-4': q2(0, .5),
    'p4-5': q3(.58, 1),
    'p4-6': q3(0, .58),
    'p4-7': q4(.33, .66),
    'p4-8': q4(0, .33),
    'p5-1': [0, 0, 1, 0.14],
    'p5-2': [0, 0.14, 1, 0.5],
    'p5-3': q3(.57, 1),
    'p5-4': q3(0, .57),
    'p5-5': q4(.38, 1),
    'p5-6': q4(0, .38),
    'p6-1': q1(.66, 1),
    'p6-2': q2(.5, 1),
    'p6-3': q2(0, .5),
    'p6-4': q3(.38, 1),
    'p6-5': q4(.73, 1),
    'p6-6': q4(.27, .73),
    'p6-7': q4(0, .27),
    'p7-1': q1(.38, 1),
    'p7-2': q1(0, .38),
    'p7-3': q2(.33, .66),
    'p7-4': q2(0, .33),
    'p7-5': h2(0, 1),
  };
  _paneDims[MeoU.DORAPLUS1CH14] = {
    'p1-1': q1(.66, 1),
    'p1-2': q1(0, .66),
    'p1-3': q2(.5, 1),
    'p1-4': q2(0, .5),
    'p1-5': q3(.5, 1),
    'p1-6': q4(.5, 1),
    'p2-1': q2(.67, 1),
    'p2-2': q2(0, .67),
    'p2-3': q3(.67, 1),
    'p2-4': q3(.33, .67),
    'p2-5': q3(0, .33),
    'p2-6': q4(.33,1),
    'p2-7': q4(0, .33),
    'p3-1': q1(.5, 1),
    'p3-2': q1(0, .5),
    'p3-3': q2(.67, 1),
    'p3-4': q3(.5, 1),
    'p3-5': q3(0, .5),
    'p3-6': q4(0, .67),
    'p4-1': q1(.72, 1),
    'p4-2': q1(.45, .72),
    'p4-3': q2(.5, 1),
    'p4-4': q2(0, .5),
    'p4-5': q3(0, .61),
    'p4-6': q4(.5, 1),
    'p4-7': q4(0, .5),
    'p5-1': q1(.37, 1),
    'p5-2': q1(0, .37),
    'p5-3': q4(.45, 1),
    'p5-4': q4(0, .45),
    'p6-1': q1(.5, 1),
    'p6-2': q3(.66, 1),
    'p6-3': q3(0, .66),
    'p6-4': q4(.5, 1),
    'p6-5': q4(0, .5),
    'p7-1': q1(.5, 1),
    'p7-2': q1(0, .5),
    'p7-3': q2(.5, 1),
    'p7-4': q2(0, .5),
    'p7-5': h2(0, 1),
  };
  var _panesCreated = {};

  return {
    // unused: _getPaneDims: function () { return _paneDims; },
    paneclick: function (event) {
      if (MeoU.comic == MeoU.DAICOHEN) {
        // still manually binding audio buttons as we don't have gloss structs
        return;
      }

      // el is the <button> in pane, or the whole <div class="panebox"> wrapper
      var btn_extra_class = (function () {
        var btn_classes = $(event.currentTarget).attr('class').split(' ');
        var btn_extra_class_idx;
        // Try 3 times to find one of 3 classes
        btn_extra_class_idx = btn_classes.indexOf('show-gloss-overlay');
        if (btn_extra_class_idx == -1) {
          btn_extra_class_idx = btn_classes.indexOf('play-normal');
        }
        if (btn_extra_class_idx == -1) {
          btn_extra_class_idx = btn_classes.indexOf('play-slow');
        }
        if (btn_extra_class_idx == -1) {
          btn_extra_class_idx = btn_classes.indexOf('panebox');
        }
        if (btn_extra_class_idx == -1) {
          console.log('button which is not gloss/normal/slow play or even div.panebox');
          return null;
        }
        return btn_classes[btn_extra_class_idx];
      })();

      var pane = (function() {
        var paneid;
        if (btn_extra_class == 'panebox') {
          paneid = $(event.currentTarget).attr('id');
        } else {
          paneid = $(event.currentTarget).parents('.panetrigger').attr('id');
        }
        $('.panebox.active').removeClass('active');
        $('#' + paneid).addClass('active');
        // Convert like doraplus1-pane-p1-4 to <comic>-pane-p<page>-<pane>
        var matches = paneid.match(/(.*)-pane-p([0-9]*)-([0-9]*)/);
        if (!matches) {
          console.log('bad format of .panetrigger id: ' + paneid);
          return;
        }
        // var comic = matches[1];
        var pagenum = matches[2];
        var panenum = matches[3];
        var pane = MeoU.glosses[MeoU.comic][pagenum-1][panenum-1];
        if (pane.paneid != 'p' + pagenum + '-' + panenum) {
          console.log('unexpected mismatch in paneid of page: ' + pagenum + ', pane: ' + panenum + ', but paneid: ' + pane.paneid);
          return null;
        }
        return pane;
      })();

      if (btn_extra_class === null || pane === null) {
        return;
      }

      var selecta = '#' + MeoU.comic + '-pane-' + pane.paneid;
      event.stopPropagation();
      if (btn_extra_class == 'show-gloss-overlay' || btn_extra_class == 'panebox') {
        // TODO use show_modal_overlay_noGA like .quiz-overlay
        $('.modal-backdrop.gloss-overlay').show();
        fix_gloss_manga_widths();
        add_mode_to_body_class('gloss-overlay');
        // After loading, Nghe button is bound to play_normal
        load_pane_gloss_by_id(selecta, pane.time.start, pane.time.stop);
      } else if (btn_extra_class == 'play-normal') {
        MeoU.player.play_normal(pane.time.start, pane.time.stop);
      } else if (btn_extra_class == 'play-slow') {
        MeoU.player.play_slow(pane.time.start, pane.time.stop);
      }
    },

    setupPaneboxes: function (comic) {
      if (comic in _panesCreated) {
        return;
      }

      if ($('.' + comic + '-paneboxes').length == 0) {
        $('.main').prepend('<div class="' + comic + '-paneboxes"></div>');
      }
      _panesCreated[comic] = true;
      // DOM element, insert into .doraplus1-paneboxes which already exists
      var paneboxes;
      paneboxes = Object.keys(_paneDims[comic]).map(function(key) {
        var pagenum = key.split('-');
        pagenum = pagenum[0];
        var showGlossBtn = btn_template("assignment", "show-gloss-overlay");
        if (comic == MeoU.DAICOHEN) {
            showGlossBtn = showGlossBtn.replace("<button ", "<button disabled ");
        }
        // var contents = '<div class="audio-lower-buttons">' + showGlossBtn + btn_template('record_voice_over', 'play-normal') + btn_template('slow_motion_video', 'play-slow') + '<'+'/div>';
        var playBtn = btn_template('record_voice_over', 'play-normal');
        if (comic == MeoU.DORAPLUS1CH14) {
            playBtn = playBtn.replace("<button ", "<button disabled ");
        }
        var contents = '<div class="audio-lower-buttons">' + showGlossBtn + playBtn + '<'+'/div>';
        return '<div class="panebox panetrigger pane-' + pagenum + '" id="' + comic + '-pane-' + key + '">' + contents + '<' + '/div>';
      }).join('\n');
      // XXX insertAfter?
      $('.' + comic + '-paneboxes').html(paneboxes);

      // Bind clicks on 3x buttons to ...
      $('.' + comic + '-paneboxes .panebox button').click(MeoU.paneboxes.paneclick);
      // Click anywhere in the pane to load glosses too
      $('.' + comic + '-paneboxes .panebox').click(MeoU.paneboxes.paneclick);

      // CSS
      var css = document.createElement("style");
      css.type = "text/css";

      css.innerHTML = Object.keys(_paneDims[comic]).map(function(key) {
        var xratio = 0.76;
        var yratio = 0.79;
        // TODO try to get these to 1.0 and then remove this code
        xratio = 1; yratio = .88;
        yratio = 1;
        if (comic == MeoU.DAICOHEN) { xratio = 0.97; }
        function xfix(x) { return (100 * xratio * x).toFixed(3) + '%'; }
        function yfix(y) { return (100 * yratio * y).toFixed(3) + '%'; }
        var tuple = _paneDims[comic][key];
        var ruleObj = {
          left: xfix(tuple[0]),
          top: yfix(tuple[1]),
          width: xfix(tuple[2] - tuple[0]),
          height: yfix(tuple[3] - tuple[1])
        };
        var selecta = '#' + comic + '-pane-' + key;
        var rules;
        if (tuple[0] == 0 && tuple[1] == 0 && tuple[2] == 0 && tuple[3] == 0) {
            rules = 'width: 0; height: 0; overflow: hidden;'; // cannot display: none, because becomes block
        } else {
          rules = Object.keys(ruleObj).map(function(attr) {
            return attr + ': ' + ruleObj[attr] + ';';
          }).join('');
        }
        return selecta + '{ ' + rules + ' }\n';
      }).join('');
      document.body.appendChild(css);
    }
  };
})();

MeoU.player = {
  howler: null,
  howler_soundid: null,
  chromeAudioContextFix_timerid: null,
  chromeAudioContextFix: function () {
    //if (MeoU.player.chromeAudioContextFix_timerid) return;
    if (MeoU.player.howler.playing()) return;
    // play a silent sound every 25s so Chrome's AudioContext doesn't suspend = no more sound
    new Howl({src: ['/audio/quietenglish.mp3'], autoplay: true });
  },
  audioprefixes: {
    daicohen: 'daicohen-p1-5',
    conan: 'conan-p1-10'
    // otherwise, default to same as MeoU.comic code
  },
  YTIDs: {
    daicohen:  {normal: 'XBGJ_upncvM', slow: 'E6Y5nLTVaPw'},
    conan:     {normal: 'AtdL5jr7yjo', slow: 'W15jeFhrAMM'},
    conanch1_1:{normal: 'KP2O41N1OFk', slow: 'DkCxtfeD6lw'},
    conanch1_2:{normal: 'n9OS5fYQ1VQ', slow: 'sDcKveqDFwA'},
    conanch1_3:{normal: 'JSYHqazfkhY', slow: '7Av-4IKcK9I'},
    conanch1_4:{normal: 'kAyqMlHhsIw', slow: 'd5HLBzsOyZc'},
    doraplus1: {normal: 'RARnlNwJCEI', slow: 'HYaG5YSy71c'},
    doraplus1ch2: {normal: 'tpW2_r7lNZc', slow: 'oYTHwLJNz8M'},
    doraplus1ch3: {normal: '0cJKPeSPqkw', slow: 't2xTKyCBAeU'},
    doraplus1ch4: {normal: 'ifE1Me9c0Vg', slow: 'zKB1sBLp2Ro'},
    doraplus1ch5: {normal: '9ZvlTr1_deU', slow: 'GyZPY1H0a64'},
    doraplus1ch6: {normal: 'Ts9e7ke8I40', slow: 'P94U8Huneq4'},
    doraplus1ch7: {normal: 'ylSEYK0po7Q', slow: '1MmBWxzx5Eg'},
    doraplus1ch8: {normal: 'wgMaILNHMx0', slow: '8RC5I5l5oWM'},
    doraplus1ch9: {normal: 'GBC7IpC47cQ', slow: '44Yx-zHMgqE'},
    doraplus1ch10: {normal: 'Ak7en0DuwIo', slow: 'Wjd8_YSY5sU'},
    doraplus1ch11: {normal: 'W5fpDb2xlyA', slow: '7WBR3TNhbls'},
    doraplus1ch12: {normal: 'YmRSU0nJrVo', slow: '-g0Jpov2cNg'},
    doraplus1ch13: {normal: '1WiOh2XF4gs', slow: 'hDQREJVSdBE'},
    doraplus1ch14: {normal: '', slow: ''}
  },
  pause: function () {
    event.preventDefault();
    sendGaEvent('Audio paused');
    this.howler.pause();
  },
  unpause: function () {
    event.preventDefault();
    sendGaEvent('Audio unpaused');
    this.howler.play(this.howler_soundid);
  },
  stop: function () {
    event.preventDefault();
    sendGaEvent('Audio stopped');
    this.howler.stop();
  },
  play: function (start, stop, isslow) {
    var speed = isslow ? 'slow' : '';
    var audioprefix = (MeoU.comic in this.audioprefixes ? this.audioprefixes[MeoU.comic] : MeoU.comic);
    var src = audioprefix + '-' + speed + 'stereo-t' + Math.round(start * 100) + '-' + Math.round(stop * 100);
    // XXX bug had switched slow/normal. Events with + 'slow' are buggy, events with nothing are buggy.
    sendGaEvent(MeoU.comic + ' Audio ' + (isslow ? 'realslow ' : 'realnormal ') + '(' +  start + ', ' + stop + ')');
    // TODO if (isios()) { $('.youtube-wrapper').show(); }
    $('.audio-more-info > a').attr('href', 'http://www.youtube.com/watch?v=' + this.YTIDs[MeoU.comic][isslow ? 'slow' : 'normal']);
    if (this.howler && this.howler.playing()) {
      this.howler.stop();
    }
    src = '/audio/' + src;
    if (!this.howler || this.howler._src != src) {
      if (!MeoU.player.chromeAudioContextFix_timerid) {
        MeoU.player.chromeAudioContextFix_timerid = setInterval(MeoU.player.chromeAudioContextFix, 25000);
      }
      this.howler = new Howl({
        src: [src + '.webm', src + '.mp3'],
        onload: function () {
          MeoU.player.howler_soundid = MeoU.player.howler.play();
        },
        onloaderror: function (id, err) {
          sendGaEvent('howler loaderror: ' + src);
          $('.unplayable').show();
          $(window).click(function() {
            $('.unplayable').hide();
          });
        },
        onplay: function () {
          $('.playing').show();
        },
        onend: function () {
          $('.playing').fadeOut(500);
        },
        onstop: function () {
          $('.playing').hide();
        }
      });
    }
  },
  play_normal: function (start, stop) {
    // TODO firebase check
    MeoU.userprofile.counts.increment('panes_listened');
    MeoU.player.play(start, stop, false);
  },
  play_slow: function (start, stop) {
    // TODO firebase check
    MeoU.userprofile.counts.increment('panes_listened_slowly');
    MeoU.player.play(start, stop, true);
  }
}

function bind_audio_button(selecta, start, stop) {
  // XXX this function also binds the show-gloss-overlay button
  if (MeoU.comic == MeoU.CONAN) {
    $(selecta + ' button.show-gloss-overlay').click(function(event) {
      event.stopPropagation();
      $('.modal-backdrop.gloss-overlay').show();
      add_mode_to_body_class('gloss-overlay');
      // After loading, Nghe button is bound to play_normal
      load_pane_gloss_by_id(selecta, start, stop);
    });
  }
  $(selecta + " button.play-slow").click(function(event) {
    event.stopPropagation();
    MeoU.player.play_slow(start, stop);
  });
  $(selecta + " button.play-normal").click(function(event) {
    event.stopPropagation();
    MeoU.player.play_normal(start, stop);
  });
}
/* just prepare clicks for all those boxes, do it once at startup not on layer change */
function bind_audio_boxes_daicohen() {
  bind_audio_button('#daicohen-pane-p1-1', 2.2, 12.2);
//  bind_audio_button('#daicohen-pane-p1-2', 5.8, 12.2);
  bind_audio_button('#daicohen-pane-p1-2', 12.4, 14.1);
  bind_audio_button('#daicohen-pane-p1-3', 14.2, 19.6);
  bind_audio_button('#daicohen-pane-p1-4', 19.6, 24.2);
  bind_audio_button('#daicohen-pane-p2-1', 24, 26.5);
  bind_audio_button('#daicohen-pane-p2-2', 27, 31.5);
  bind_audio_button('#daicohen-pane-p2-3', 31.6, 34.8);
  bind_audio_button('#daicohen-pane-p2-4', 35, 38);
  bind_audio_button('#daicohen-pane-p2-5', 38, 41);
  bind_audio_button('#daicohen-pane-p2-6', 41, 47.5);
  bind_audio_button('#daicohen-pane-p2-7', 47.5, 52.5);
  bind_audio_button('#daicohen-pane-p2-8', 52, 58.5);
  bind_audio_button('#daicohen-pane-p2-9', 59, 62);
  bind_audio_button('#daicohen-pane-p3-1', 62, 64);
  bind_audio_button('#daicohen-pane-p3-2', 64, 69);
  bind_audio_button('#daicohen-pane-p3-3', 69, 75);
  bind_audio_button('#daicohen-pane-p3-4', 75, 80);
  bind_audio_button('#daicohen-pane-p3-5', 80, 86.5);
  bind_audio_button('#daicohen-pane-p4-1', 87, 92);
  bind_audio_button('#daicohen-pane-p4-2', 92, 96.5);
  bind_audio_button('#daicohen-pane-p4-3', 96.5, 97.8);
  bind_audio_button('#daicohen-pane-p4-4', 98, 101);
  // left out dinosaur book titles
  // bind_audio_button('#daicohen-pane-p4-5', ...
  bind_audio_button('#daicohen-pane-p4-5', 101, 105.5);
  bind_audio_button('#daicohen-pane-p4-6', 105.5, 110);
  bind_audio_button('#daicohen-pane-p4-7', 110, 112);
  bind_audio_button('#daicohen-pane-p4-8', 112, 116);
  bind_audio_button('#daicohen-pane-p5-1', 116, 117);
  bind_audio_button('#daicohen-pane-p5-2', 117, 121);
  bind_audio_button('#daicohen-pane-p5-3', 121, 125);
  bind_audio_button('#daicohen-pane-p5-4', 125, 130);
  bind_audio_button('#daicohen-pane-p5-5', 130, 133);
  bind_audio_button('#daicohen-pane-p5-6', 133, 136);
  bind_audio_button('#daicohen-pane-p5-7', 136, 140);
}

function show_pane_boxes() {
  $('.panetrigger').hide();
  $('.' + MeoU.comic + '-paneboxes .panetrigger').hide();
  $('.' + MeoU.comic + '-paneboxes .panetrigger.pane-p' + MeoU.page).show();
}


function isios() {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;
  return /(iPad|iPhone|iPod)/g.test(userAgent);
}

// points is stored in cookie which gets read on boot
MeoU.points = {
  points: 0,
  add: function (c) {
    // error check, negative points not implemented yet
    if (c > 0) {
      this.points += c;
      createCookie('points', this.points);
      $('#points').html(this.points + ' points');
      $('#points').css('background-color', '#000');
      $('#points').animate({'backgroundColor': '#ddd'});
    }
  },
  init: function () {
    var cooked_points = readCookie('points');
    if (isNaN(Number(cooked_points))) {
      console.log('points is NaN');
      this.points = 0;
      return;
    }
    this.points = Number(cooked_points);
    $('#points').html(this.points + ' points');
  }
}

MeoU.userprofile = {};
MeoU.userprofile.init = function () {
  var score = readCookie('competency_score');
  if (score === null) {
    MeoU.userprofile.competency_score = -1;
  } else {
    MeoU.userprofile.competency_score = Number(score);
  }
  MeoU.userprofile.quiz_responses = {};
  MeoU.popquiz.unpickle_quiz_responses(MeoU.comic);
  MeoU.userprofile.popquiz_points.unpickle();
}
/* TODO merge completely into MeoU.userprofile.counts */
MeoU.userprofile.popquiz_points = (function () {
  return {
    counts: {'correct': 0, 'incorrect': 0},
    pickle: function () {
      createCookie('quiz_points_correct', this.counts.correct);
      createCookie('quiz_points_incorrect', this.counts.incorrect);
    },
    unpickle: function () {
      function _intify(s) {
        var n = parseInt(s);
        if (isNaN(n)) return 0;
        return n;
      }
      this.counts.correct = _intify(readCookie('quiz_points_correct'));
      this.counts.incorrect = _intify(readCookie('quiz_points_incorrect'));
    },
    increment: function (key) {
      this.counts[key]++;
      // TODO firebase check
      // key is 'correct' or 'incorrect'
      MeoU.userprofile.counts.increment('questions_answered_' + key + 'ly');
      this.pickle();
    },
    reset: function () {
      this.counts.correct = 0;
      this.counts.incorrect = 0;
      this.pickle();
    }
  }
})();
MeoU.userprofile.counts = (function () {
  return {
    val: {
      pages_turned: 0,
      words_listened: 0,
      panes_listened: 0,
      panes_listened_slowly: 0,
      panes_glossed: 0,
      viet_switched: 0,
      questions_answered_correctly: 0,
      questions_answered_incorrectly: 0,
      points: 0 // TODO maybe only questions_answered_correctly
    },
    update_from_firebase: function (snapshot) {
      //console.log(snapshot.val());
      if (snapshot.val() == null) {
        console.log('null snapshot');
        return;
      }
      Object.keys(snapshot.val()).map(function(key) {
        // TODO questions_answered_correctly -> MeoU.userprofile.popquiz_points.counts.correct
        if (key in this.val) {
          if (this.val[key] != snapshot.val()[key]) {
            if (key == 'questions_answered_correctly' || key == 'questions_answered_incorrectly') {
              var _key = (key == 'questions_answered_correctly' ? 'correct' : 'incorrect');
              console.log('take max of correct/incorrect from firebase vs cookie');
              if (snapshot.val()[key] < MeoU.userprofile.popquiz_points.counts[_key]) {
                this.val[key] = MeoU.userprofile.popquiz_points.counts[_key];
              } else {
                MeoU.userprofile.popquiz_points.counts[_key] = snapshot.val()[key];
              }
              if (_key == 'correct') {
                $('.user-score').html(snapshot.val()[key]);
              }
            } else {
              this.val[key] = snapshot.val()[key];
              console.log('updated ' + key);
            }
          }
        } else {
          console.log('unexpected key in counts: ' + key);
        }
      }.bind(this));
    },
    subscribe_firebase: function () {
      firebase.database().ref('user/' + MeoU.firebase.user.uid + '/counts').on('value', this.update_from_firebase.bind(this));
    },
    increment: function (key) {
      this.val[key]++;
      //this.pickle();
      if (MeoU.firebase.isloggedin) {
        firebase.database().ref('user/' + MeoU.firebase.user.uid + '/counts/' + key).set(this.val[key]);
      }
    }
  }
})();
MeoU.userprofile.pagemark = (function () {
  return {
    last_comic: null,
    last_page: -1,
    mark_by_comic: {},
    update: function () {
      this.last_comic = MeoU.comic;
      this.last_page = MeoU.page;
      if (!this.mark_by_comic) {
        this.mark_by_comic = {};
      }
      this.mark_by_comic[MeoU.comic] = MeoU.page;
      if (MeoU.page > 1) {
        $('#checkbox-' + MeoU.comic).html('check_box');
      }
      if (MeoU.firebase.isloggedin) {
        firebase.database().ref('user/' + MeoU.firebase.user.uid + '/pagemark').set({last_comic: this.last_comic, last_page: this.last_page, mark_by_comic: this.mark_by_comic});
      }
    },
    update_from_firebase: function (snapshot) {
      var pagemark = snapshot.val();
      if (pagemark == null) {
        console.log('null snapshot');
        return;
      }
      /* init: on first callback from .on */
      if (this.last_comic == null && this.last_page == -1) {
        $('.pagemark-info span.last-comic').html(MeoU.comic_export[pagemark.last_comic].title);
        $('.pagemark-info span.last-page').html(pagemark.last_page);
        if (MeoU.comic != pagemark.last_comic || MeoU.page != pagemark.last_page) {
          show_modal_overlay_noGA('.pagemark-info');
          $('.pagemark-info a.return-to-pagemark').click(function(e) {
            sendGaEvent('Panel return');
            close_dialog('.pagemark-info.jumbotron')
            handle_switch_comic(pagemark.last_comic);
            MeoU.page = pagemark.last_page;
            updateUrl(MeoU.page);
            reset_gloss();
            update_page_buttons();
          });
        }
        if (MeoU.comic != pagemark.last_comic) {
          //alert('Last time you were reading ' + pagemark.last_comic);
          this.last_comic = MeoU.comic;
        }
        if (MeoU.page != pagemark.last_page) {
          //alert('Last time you were on page ' + pagemark.last_page);
          this.last_page = MeoU.page;
        }
        for (var _comic in pagemark.mark_by_comic) {
          if (pagemark.mark_by_comic[_comic] > 1) {
            $('#checkbox-' + _comic).html('check_box');
          }
        }
        this.mark_by_comic = pagemark.mark_by_comic;
      } else {
        console.log('got pagemark update after initial');
      }
    },
    subscribe_firebase: function () {
      firebase.database().ref('user/' + MeoU.firebase.user.uid + '/pagemark').on('value', this.update_from_firebase.bind(this));
    }
  }
})();


function encodeFirebaseKey(s) { return encodeURIComponent(s).replace('.', '%2E'); }
MeoU.firebase = {
    facebook_access_token: null,
    user: null,
    isloggedin: false
};
MeoU.firebase.onLoginUpdate = function (user) {
  MeoU.firebase.user = user;
  MeoU.firebase.isloggedin = true;
  $('.user-displayName').html(user.displayName);
  $('.user-email').html(user.email);
  $('.user-image').css('backgroundImage', 'url(' + user.photoURL + ')');
  $('.login-link').hide();
  $('.account-link').show();
  try {
   ga('set', 'userId', MeoU.firebase.user.uid); // Set the user ID using signed-in user_id.
  } catch (e) { ; }
  firebase.database().ref('loginhistory/' + MeoU.firebase.user.uid + '/D' + (new Date()).toISOString().replace(/[^0-9T]/g, "").replace('T', '_').slice(0,13)).set(1);
  firebase.database().ref('user/' + MeoU.firebase.user.uid + '/info').set({
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL
  });
  MeoU.userprofile.counts.subscribe_firebase();
  MeoU.userprofile.pagemark.subscribe_firebase();
}
/** * Function called when clicking the Login/Logout button.  */
MeoU.firebase.toggleSignIn = function () {
  if (!firebase.auth().currentUser) {
    var provider = new firebase.auth.FacebookAuthProvider();
    // provider.addScope('user_birthday');
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      MeoU.firebase.facebook_access_token = result.credential.accessToken;
      MeoU.firebase.onLoginUpdate(result.user);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      sendGaEvent('Firebase login error (' + errorCode + '): ' + errorMessage + ' (from ' + email + ')');
      if (errorCode === 'auth/account-exists-with-different-credential') {
        alert('You have already signed up with a different auth provider for that email.');
        // If you are using multiple auth providers on your app you should handle linking
        // the user's accounts here.
      } else {
        console.error(error);
      }
    });
  } else {
    firebase.auth().signOut();
    MeoU.firebase.isloggedin = false;
    $('.login-link').show();
    $('.account-link').hide();
  }
}
MeoU.firebase.init = function () {
  var config = {
    apiKey: "AIzaSyCD8lCoYaxY3VwxGCmy1wBM77fqEh-Pj44",
    authDomain: "meo-u-english.firebaseapp.com",
    databaseURL: "https://meo-u-english.firebaseio.com",
    storageBucket: "meo-u-english.appspot.com",
  };
  firebase.initializeApp(config);

  // Listening for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // TODO MeoU.firebase.facebook_access_token = result.credential.accessToken;
      MeoU.firebase.onLoginUpdate(user);
      /* FIELDS:
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var refreshToken = user.refreshToken;
          var providerData = user.providerData;
          */
    } else {
      // User is signed out.
    }
  });
}

MeoU.glosses = {};

function clz_daicohen_glosses() {
  gloss1= [{'q': 'Whats yo name?', 'a_idx': 0, 'a': ['Mary', 'Joe', 'Bob']}, {'q': 'What yo number?', 'a_idx': 1, 'a': ['No have', 'Dunno', '911']}];

  var N = 'noun', V = 'verb', Art = 'article', Adj = 'adjective', Prep = 'preposition', Pron = 'pronoun';
  var Adv = 'adverb', Conj = 'conjunction', Intj = 'interjection', Det = 'determiner', Num = 'number';
  var X = 'undefined PoS', Punc = 'punctuation';
  var gloss1_1 = [['A', Art, 'một'],
    ['hundred', Det, 'trăm'],
    ['million', Det, 'triệu'],
    ['years', N, 'năm'],
    ['ago', X, 'trước đây']
      ];

  // 'A hundred millions years ago, during the cretaceous period. The Earth was a land of reptiles and among all of the creatures, tyrannosauraus was the most suitable one to be a king.';

  var pane1 = [
    {
      xlation: 'Một trăm triệu năm về trước, trong kỷ phấn trắng...',
      words: [['A', 'a_', Det],
        ['hundred', 'trăm', Num],
        ['million', 'triệu', N],
        ['years', 'những năm', N],
        ['ago', 'trước đây', Adv],
        ['during', 'trong khi', Prep],
        ['the', '_the', Det],
        ['cretaceous', 'kỳ phấn trắng', Adj],
        ['period', 'thời kỳ', N]]
    },  {
      xlation: 'Trái đất lúc ấy là vùng đất của loài bò sát',
      words:[['The', '_the', Det],
        ['earth', 'trái đất', N],
        ['was', 'be_', V],
        ['a', 'a_', Det],
        ['land', 'vùng đất', N],
        ['of', 'của', Prep],
        ['reptiles', 'loài bò sát', N]]
    }, {
      xlation: 'và khùng long bạo chúa là vua của loài khủng long',
      words: [['and', 'và', Conj],
        ['among', 'trong', Prep],
        ['all', 'tất cả', Det],
        ['of', 'của', Prep],
        ['the', 'the_', Det],
        ['creatures', 'loài sinh vật', N],
        ['tyrannosaurus', 'loài khủng long bạo chúa', N],
        ['was', 'be_', V],
        ['the most', 'nhất', Adv],
        ['suitable', 'thích hợp', Adj],
        ['one', 'a_', N],
        ['to be', 'be_', V],
        ['a', 'a_', Det],
        ['king', 'vua', N],
        ['.', '.', Punc]]
    }];

          /*
      xlation: 'và đây là hóa thạch móng chân của nó', words: 
      xlation: 'Nó đã được tìm thấy ở thung lùng Dinosaur ở Utah', words: 
      xlation: 'Đây là quà lưu niệm mà ba tớ', words: 
      xlation: 'Sao cơ ?  Đây thực sự là móng của con khủng long à?  Là thật sao?', words: 
  */
  var pane3 = [['is', 'be_', V],
    ['this', 'cái này', Det],
    ['real', 'thật sự', Adj],
    ['?', '', Punc],
    ['this', 'cái này', Det],
    ['is', 'be_', V],
    ['really', 'thật sự', Adv],
    ['a', 'a_', Det],
    ['part', 'phần', N],
    ['of', 'của', Prep],
    ['a', 'a_', Det],
    ['dinosaur', 'khủng long', N],
    ['?', '?', Punc],
    ['what', 'cái gì', Pron],
    ['?', '?', Punc]];
  var pane2 = [['and', 'và', Conj],
    ['here', 'đây là', Adv],
    ['is', 'be_', V],
    ['a', 'a_', Det],
    ['fossil', 'hóa thạch', N],
    ['of', 'của', Prep],
    ['its', 'its_', Pron],
    ['claw', 'móng', N],
    ['.', '.', Punc],
    ['it', 'nó', Pron],
    ['was', 'be_', V],
    ['found(find)', 'tìm thấy', V],
    ['in', 'ở', Prep],
    ['dinosaur', 'khủng long', N],
    ['valley', 'thung lũng', N],
    ['in', 'ở', Prep],
    ['Utah', 'Utah', N],
    ['.', '.', Punc],
    ['the', 'the_', Det],
    ['souvenir', 'quà lưu niệm', N],
    ['father', 'bố', N],
    ['brought(bring) back', 'mang về', V],
    ['back', '', Adv],
    ['from', 'từ', Prep],
    ['America', 'nước Mỹ', N],
    ['.', '', Punc]];
  var glosses1 = [pane1, pane2, pane3];

  return glosses1;
}

MeoU.glosses[MeoU.DORAPLUS1] = [[{"paneid":"p1-1","xlation":["Phòng của bạn lại dơ rồi."],"words":[[["Your","Của bạn"],["room","phòng"],["is","To be"],["untidy","không gọn gàng"],["again!","lại"]]],"time":{"start":"0","stop":"3"}},{"paneid":"p1-2","xlation":["Tôi phải hút bụi phòng này nên làm ơn tránh quá một bên."],"words":[[["I'd","Tôi"],["like","muốn"],["to vacuum","hút bụi"],["this","này"],["room","phòng"],["so","vì thế"],["please","làm ơn"],["move","chuyển"],["aside.","một bên"]]],"time":{"start":"3","stop":"7"}},{"paneid":"p1-3","xlation":["Tôi cần phải giặt đống đồ này nữa."],"words":[[["I","Tôi"],["need","cần"],["to do","làm"],["this","cái này"],["laundry","đồ cần giặt"],["as well...","cũng"]]],"time":{"start":"7","stop":"11"}},{"paneid":"p1-4","xlation":["Bữa trưa đã xong chưa?","Tôi đói lắm rồi."],"words":[[["Is","To be"],["lunch","bữa trưa"],["ready","sẵn sàng"],["yet?","chưa?"]],[["I'm","Tôi"],["starving.","chết đói"]]],"time":{"start":"11","stop":"15"}},{"paneid":"p1-5","xlation":["Đợi tôi giặt đồ xong đã."],"words":[[["Please","Làm ơn"],["wait","đợi"],["until","cho đến khi"],["I","Tôi"],["finish","kết thúc"],["doing","làm "],["the","mạo từ"],["laundry.","đồ dợ"]]],"time":{"start":"15","stop":"20"}},{"paneid":"p1-6","xlation":["Trời ơi, chuyện gì sẽ xảy ra khi tôi không ở nhà."],"words":[[["Geez, (Jesus)","Trời ơi"],["what","Cái gì"],["will","sẽ"],["happen","xảy ra"],["if","nếu"],["I'm","Tôi"],["not","không"],["at","ở"],["home?","nhà"]]],"time":{"start":"20","stop":"24"}},{"paneid":"p1-7","xlation":["Mọi người đều dựa vào tôi.","Họ có thể chết đói mất."],"words":[[["Everyone","Mọi người"],["is","to be"],["relying on","tin cậy"],["me.","tôi"]],[["They","Họ"],["might","có thể"],["die","chết"],["of","giới từ"],["starvation.","chết đói"]]],"time":{"start":"24","stop":"30"}}],[{"paneid":"p2-1","xlation":["Xin chào, vâng...","Cái gì?","Thật sao?"],"words":[[["Hello,","Xin chào,"],["yes...","vâng..."]],[["What!?","Cái gì?"]],[["Really?","Thật ư?"]]],"time":{"start":"30","stop":"34"}},{"paneid":"p2-2","xlation":["Mẹ của tôi đột nhiên ngã bệnh.","Hả?","Bà ư?"],"words":[[["My","Của tôi"],["mom","mẹ"],["suddenly","đột nhiên"],["became","trở thành"],["ill.","bệnh"]],[["Eh?","Hả?"]],[["Grandma?","Bà?"]]],"time":{"start":"34","stop":"39"}},{"paneid":"p2-3","xlation":["Trong trường hợp này, bạn nên về nhanh và chăm sóc cô ấy."],"words":[[["In","Trong"],["that","mạo từ"],["case,","trường hợp"],["you","bạn"],["better","tốt hơn"],["hurry","nhanh"],["and","và"],["take care of","Chăm sóc"],["her.","cô ấy"]]],"time":{"start":"39","stop":"42"}},{"paneid":"p2-4","xlation":["Nhưng còn bữa trưa thì sao?","Tôi sẽ làm mọi thứ, đừng lo lắng."],"words":[[["But","Nhưng"],["what","cái gì"],["about","về"],["lunch?","bữa trưa"]],[["I'll","Tôi sẽ"],["make","làm"],["everything,","mọi thứ"],["don't","đừng"],["worry","lo lắng"],["about","về"],["it.","nó"]]],"time":{"start":"42","stop":"47"}},{"paneid":"p2-5","xlation":["Bố ơi, chúng ta có thể tự làm bữa ăn trưa thật không?","Không, nhưng chúng ta không có sự lựa chọn khác, phải không?"],"words":[[["Papa,","Bố,"],["can","có thể"],["you","bạn"],["really","thật sự"],["make","làm"],["our","của chúng ta"],["lunch?","bữa trưa"]],[["Nope,","Không,"],["but","nhưng"],["now","bây giờ"],["we","chúng ta"],["don't","Không,"],["have","có "],["any","bất kì"],["other","khác"],["choice,","lựa chọn"],["do","làm"],["we?","chúng ta"]]],"time":{"start":"47","stop":"53"}},{"paneid":"p2-6","xlation":["Sẽ vui lắm, đợi đi rồi bạn sẽ thấy.","Chúng tôi lo lắng."],"words":[[["It'll","Nó sẽ"],["be","to be"],["fun,","vui"],["wait","đợi"],["and","và"],["see.","xem."]],[["We","Chúng tôi"],["are","to be"],["worried.","lo lắng"]]],"time":{"start":"53","stop":"58"}},{"paneid":"p2-7","xlation":["Ôi không!","Tôi cắt trúng tay rồi!","Chết tiệt!","tôi nhầm muối thành đường!","Trời!","tôi không bỏ đủ nước nên cơm cháy rồi!","Để tôi nếm thử..."],"words":[[["Oh,","Oh,"],["no!","không!"]],[["I","Tôi"],["cut","cắt"],["my","của tôi"],["finger!","ngón tay"]],[["Darn!","Chết tiệt!"]],[["I've","Tôi"],["used","sử dụng"],["salt","muối"],["instead of","thay vì"],["sugar!","đường!"]],[["Oops!","Oops!"]],[["I","Tôi "],["didn't","không"],["use","sử dụng"],["enough","đủ"],["water,","nước,"],["the","mạo từ"],["rice","gạo"],["has",""],["burnt!","cháy"]],[["Let","Hãy"],["me","tôi"],["taste","nếm"],["it...","nó..."]]],"time":{"start":"58","stop":"70"}}],[{"paneid":"p3-1","xlation":["Hãy gọi dịch vụ chuyển phát thôi. Yay!"],"words":[[["Let's","Hãy"],["call","gọi"],["a","mạo từ"],["delivery","vận chuyển"],["service.","dịch vụ"],["Yay!","Yay!"]]],"time":{"start":"70","stop":"74"}},{"paneid":"p3-2","xlation":["Hôm nay đóng cửa ư?"],"words":[[["You're","Bạn"],["closed","đóng"],["today?","hôm nay?"]]],"time":{"start":"74","stop":"76"}},{"paneid":"p3-3","xlation":["Chúng ta làm gì bây giờ?","Tôi đói lắm rồi, tôi chết mất."],"words":[[["What","Cái gì"],["will","sẽ"],["we","chúng ta"],["do","làm"],["now?","bây giờ?"]],[["I'm","Tôi"],["so","rất"],["hungry,","đói"],["I'm","Tôi"],["going","sắp"],["to die","chết"]]],"time":{"start":"76","stop":"81"}},{"paneid":"p3-4","xlation":["Im lặng nào.","Bạn không thể nói như thế. "],"words":[[["Please","Làm ơn"],["be","to be"],["quiet.","yên lặng"]],[["You","Bạn"],["can't","không thể"],["say","nói"],["that!","điều đó!"]]],"time":{"start":"81","stop":"85"}},{"paneid":"p3-5","xlation":["Đúng rồi!","Tôi có cái này!"],"words":[[["That's","Cái đó"],["right!","đúng"]],[["I","Tôi"],["have","có"],["that","cái đó"],["thing!","thứ"]]],"time":{"start":"85","stop":"88"}},{"paneid":"p3-6","xlation":["Bàn ăn thượng lưu.  "],"words":[[["A","Mạo từ"],["partial","một phần"],["gourmet","chất lượng tốt và đắt tiền"],["table.","bàn"]]],"time":{"start":"88","stop":"91"}},{"paneid":"p3-7","xlation":["Trải nó ra bàn...","Bây giờ bạn muốn ăn gì?","Cái gì cũng được. Miễn là tôi có thể ăn."],"words":[[["Roll","Cuộn"],["it","nó"],["out","ngoài"],["on","trên"],["the","mạo từ"],["table...","cái bàn..."]],[["Now,","Bây giờ,"],["what","cái gì"],["do","làm"],["you","bạn"],["want","muốn"],["to eat?","ăn?"]],[["Anything","bất cứ gì"],["is","to be"],["fine.","ổn"],["As long as","Miễn là"],["I","Tôi"],["can","có thể"],["eat.","ăn"]]],"time":{"start":"91","stop":"100"}}],[{"paneid":"p4-1","xlation":["Trong trường hợp này, chúng ta ăn katsudon và cơm cà ri được không?"],"words":[[["In","Trong"],["that","kia, đó"],["case,","trường hợp,"],["how","như thế nào"],["about","về"],["katsudon","cơm thịt heo cốt lết chiên xù"],["and","và "],["curry","cà ri"],["rice?","cơm?"]]],"time":{"start":"100","stop":"106"}},{"paneid":"p4-2","xlation":["Chuyện gì đã xảy ra vậy?","Sao có thể...","Đừng nghĩ gì vào lúc này.","Chỉ cần ăn món nào mình thích. "],"words":[[["What","Cái gì"],["happened?","đã xảy ra?"]],[["How","Như thế nào"],["could","có thể"],["these...","điều này..."]],[["Don't","Đừng"],["think","nghĩ"],["of","giới từ"],["anything","bất cứ cái gì"],["right","đúng"],["now.","bây giờ."]],[["Just","Chỉ"],["eat","ăn"],["what","cái gì"],["you","bạn"],["like.","thích."]]],"time":{"start":"106","stop":"114"}},{"paneid":"p4-3","xlation":["Thật ngon.","Đây là lần đầu tiên tôi được ăn ngon như thế này. "],"words":[[["It's","Nó"],["delicious.","ngon."]],[["This","điều này"],["is","to be"],["the","mạo từ"],["first","đầu tiên"],["time","lần"],["I've","Tôi"],["eaten","đã ăn"],["something","vài thứ"],["as","như"],["delicious","ngon"],["as","bằng"],["this.","cái này."]]],"time":{"start":"114","stop":"120"}},{"paneid":"p4-4","xlation":["Còn có tráng miệng nữa. "],"words":[[["There are","Có"],["some","vài"],["desserts","tráng miệng"],["too.","cũng."]]],"time":{"start":"120","stop":"122"}},{"paneid":"p4-5","xlation":["Nước trái cây, bánh pudding và cà fe. "],"words":[[["Fruit","Trái cây"],["punch,","nước"],["pudding,","bánh pudding"],["and","và "],["coffee.","cà fe"]]],"time":{"start":"122","stop":"125.5"}},{"paneid":"p4-6","xlation":["Ah, tôi no quá."],"words":[[["Ah,","Ah,"],["I'm","Tôi"],["so","rất"],["full.","no."]]],"time":{"start":"125.5","stop":"128"}}],[{"paneid":"p5-1","xlation":["3h rồi.","Bạn muốn ăn xế cái gì?. "],"words":[[["It's","Nó"],["3","3"],["o'clock.","giờ"]],[["What","Cái gì"],["do","trợ đông từ"],["you","bạn"],["want","muốn"],["for","cho"],["a","một"],["snack?","ăn xế?"]]],"time":{"start":"128","stop":"133"}},{"paneid":"p5-2","xlation":["Tôi không muốn ăn bất cứ cái gì nữa."],"words":[[["I","Tôi"],["don't","không "],["want","muốn"],["to eat","ăn"],["anymore.","chút nào nữa."]]],"time":{"start":"133","stop":"135"}},{"paneid":"p5-3","xlation":["Tôi vẫn muốn sử dụng cái này.","Bạn không thể dùng cái này nếu bạn không thật sự muốn ăn cái gì."],"words":[[["I","Tôi"],["still","vẫn"],["want","muốn"],["use","sử dụng"],["this.","cái này."]],[["You","Bạn"],["can't","không thể"],["use","sử dụng"],["it","nó"],["unless","nếu không"],["you","bạn"],["really","thật sự"],["want","muốn"],["to eat","ăn"],["something.","vài thứ"]]],"time":{"start":"135","stop":"142"}},{"paneid":"p5-4","xlation":["Vậy thì để mọi người dùng."],"words":[[["Let's","Hãy"],["treat","đối xử"],["everyone","mọi người"],["then.","sau đó"]]],"time":{"start":"142","stop":"144"}},{"paneid":"p5-5","xlation":["Tôi vừa mới thưởng thức tại nhà hàng Pháp hạng sang.","Tôi ăn ốc sến và thịt bò sốt vang trước và tiếp tục với súp và fettuccini, sau đó là bò phi lê dùng với sốt kem.","Bạn sẽ không cảm nhận được nếu không được ăn nó.","Nhưng tôi e là bạn sẽ không đủ tiền để ăn. "],"words":[[["I","Tôi"],["just","chỉ"],["had","có"],["some","vài"],["cuisine","thói quen ăn uống"],["from","từ"],["that","đó"],["first","đầu tiên"],["class","tầng lớp"],["French","Pháp"],["restaurant.","nhà hàng."]],[["I","Tôi"],["started","bắt đầu"],["with","với "],["escargot","ốc sên"],["and","và "],["bourguignon,","thịt bò sốt vang"],["and","và"],["continued","tiếp tục"],["with","với "],["the","mạo từ"],["soup","canh"],["and","và"],["fettuccini,","một loại mì ý"],["then","sau đó"],["had","có"],["the","mạo từ"],["fillet","cuộn"],["steak","thịt cắt để nướng"],["with","với"],["the","mạo từ"],["cream","kem"],["sauce.","nước sốt."]],[["You","Bạn"],["wouldn't","sẽ không"],["understand","hiểu"],["unless","nếu không"],["you","bạn"],["ate","ăn"],["it","nó"],["yourself.","chính bạn."]],[["But","Nhưng"],["I","tôi"],["doubt","nghi ngờ"],["that","rằng"],["you","bạn"],["can","có thể"],["even","ngay cả"],["afford","đủ"],["it.","nó."]]],"time":{"start":"144","stop":"164"}},{"paneid":"p5-6","xlation":["Nó không còn hiếm nữa.","Bạn có muốn ăn lại lần nữa không?","Cái gì?"],"words":[[["It","Nó."],["won't","sẽ không"],["be","to be"],["a","mạo từ"],["rare","hiếm"],["occasion","dịp"],["anymore.","chút nào nữa"]],[["Do","trợ động từ"],["you","bạn"],["want","muốn"],["eat","ăn"],["it","nó"],["again?","lại?"]],[["What!?","Cái gì?"]]],"time":{"start":"164","stop":"171"}}],[{"paneid":"p6-1","xlation":["Nhưng bằng cách nào?","Không phải nó mắc lắm sao?","Tôi không có đủ tiền.","Đừng có hứa lèo. "],"words":[[["But","Nhưng"],["how?","như thế nào?"]],[["Isn't","Không"],["it","nó"],["expensive?","đắt"]],[["I","Tôi"],["don't","không"],["have","có "],["enough","đủ"],["money.","tiền."]],[["Don't","Không"],["just","chỉ"],["make","làm"],["fake","giả dối"],["promises,","hứa,"],["that","diều đó"],["would","sẽ"],["just","chỉ"],["be","to be"],["mean.","có ý"]]],"time":{"start":"171","stop":"180"}},{"paneid":"p6-2","xlation":["Xin hỏi, các bạn muốn ăn gì?","Ốc sên và thịt bò sốt vang. Súp nấm. Fettuccini và cá kình."],"words":[[["May","Có thể"],["I","Tôi"],["have","có"],["your","của bạn"],["order","yêu cầu"],["please?","làm ơn?"]],[["Escargot","Ốc sên"],["and","và"],["bourguignon.","thịt bò sốt vang"],["Truffle","nấm"],["soup.","súp"],["Fettucini","mì ý"],["and","và"],["tilefish.","cá kình"]]],"time":{"start":"180","stop":"190"}},{"paneid":"p6-3","xlation":["Bạn viết ra đi!","Tôi sẽ viết, Bây giờ hãy cho chúng tôi thấy phép thuật của bạn!"],"words":[[["You","Bạn"],["write","viết"],["it!","nó!"]],[["I","Tôi"],["will,","sẽ,"],["now","bây giờ"],["show","cho thấy"],["us","chúng tôi"],["your","của bạn"],["magic!","ma thuật!"]]],"time":{"start":"190","stop":"194"}},{"paneid":"p6-4","xlation":["Nhưng đồ ăn có thật sự xuất hiện không?","Bất kì loại nào đều có thể. "],"words":[[["But","Nhưng"],["will","sẽ"],["the","mạo từ"],["food","thức ăn"],["really","thật sự"],["appear?","xuất hiện?"]],[["All","Tất cả"],["kinds","loại"],["of",""],["food","thức ăn"],["can.","có thể"]]],"time":{"start":"194","stop":"201"}},{"paneid":"p6-5","xlation":["Bạn thấy không?"],"words":[[["You","Bạn"],["see!?","thấy!?"]]],"time":{"start":"201","stop":"203"}}],[{"paneid":"p7-1","xlation":["Nhìn thật là ngon.","Quan trọng là hương vị.","Vậy hãy ăn đi. "],"words":[[["It","Nó"],["looks","nhìn"],["delicious.","ngon."]],[["What's","Cái gì"],["important","quan trọng"],["is","to be"],["the","mạo từ"],["flavor.","hương vị."]],[["Eat","Ăn"],["it","nó"],["then.","sau đó."]]],"time":{"start":"203","stop":"210"}},{"paneid":"p7-2","xlation":["Thật là ngon!"],"words":[[["It","Nó"],["is","to be"],["delicious!","ngon!"]]],"time":{"start":"211","stop":"212.5"}},{"paneid":"p7-3","xlation":["Tôi đồng ý."],"words":[[["I","Tôi"],["agree.","đồng ý."]]],"time":{"start":"213","stop":"214"}},{"paneid":"p7-4","xlation":["Thật là ngon.","Tôi không muốn thừa nhận nhưng tôi không thể ngừng ăn.  "],"words":[[["It's","Nó"],["so","rất"],["good!","tốt!"]],[["I","Tôi"],["don't","không"],["want","muốn"],["to admit","thừa nhận"],["it,","nó,"],["but","nhưng"],["I","tôi"],["can't","không thể"],["stop","dừng"],["eating!","ăn!"]]],"time":{"start":"214","stop":"220"}},{"paneid":"p7-5","xlation":["Ah, tôi đói nữa rồi.","Hãy chuẩn bị bữa tối thôi."],"words":[[["Ah,","Ah,"],["I'm","Tôi"],["hungry","đói"],["again.","lại."]],[["Let's","Hãy"],["prepare","chuẩn bị"],["some","vài"],["dinner.","ăn tối."]]],"time":{"start":"220","stop":"225"}},{"paneid":"p7-6","xlation":["Đồ ăn Trung Quốc thì sao?","Ý kiến hay đó. Nó sẽ sẵn sàng ngay thôi. "],"words":[[["How","Như thế náo"],["about","về"],["Chinese","Trung Quốc"],["food?","thức ăn?"]],[["Good","Tốt"],["idea.","ý kiến."],["It'll","Nó sẽ"],["be","to be"],["ready","sẵn sàng"],["soon.","sớm."]]],"time":{"start":"225","stop":"232"}},{"paneid":"p7-7","xlation":["Thật vui vì không nghiêm trọng lắm.","Tha thứ cho tôi vì đã làm bạn lo lắng. "],"words":[[["I'm","Tôi"],["glad","vui"],["that",""],["it's","Nó"],["not","không"],["serious.","nghiêm trọng"]],[["Forgive","Tha thứ"],["me","tôi"],["for",""],["giving","cho"],["you","bạn"],["such","như thế"],["a","mạo từ"],["fright.","sự hoảng sợ."]]],"time":{"start":"232","stop":"237"}},{"paneid":"p7-8","xlation":["Trời đã tối rồi.","Tối nay hãy ở lại đây.","Nhưng tôi lo lắng cho gia đình tôi."],"words":[[["It's","Nó"],["already","rồi"],["dark","tối"],["now.","bây giờ."]],[["Please","Làm ơn"],["spend","trải qua"],["the","mạp từ"],["night","buổi tối"],["here.","ở đây."]],[["I'm","Tôi"],["worried","lo lắng"],["about","về"],["my","của tôi"],["family,","gia đình"],["though.","mặc dù."]]],"time":{"start":"237","stop":"245"}}],[{"paneid":"p8-1","xlation":["A, trời mưa rồi. Đáng lẽ tôi nên ở lại bố bố mẹ. "],"words":[[["Ah,","Ah,"],["it's","nố"],["raining.","mưa"],["I","Tôi"],["should have","nên"],["stayed","ở lại"],["with","với"],["my","của tôi"],["parents.","gia đình"]]],"time":{"start":"245","stop":"251"}},{"paneid":"p8-2","xlation":["Nhưng tôi không thể. Mọi người đang chờ tôi nấu cơm. "],"words":[[["But","Nhưng"],["I","Tôi"],["can't.","không thể"],["Everyone","Mọi người"],["is","to be"],["waiting","đang đợi"],["for",""],["me","tôi"],["to",""],["prepare","chuẩn bị"],["some","vài"],["food.","thức ăn."]]],"time":{"start":"251","stop":"256"}},{"paneid":"p8-3","xlation":["Cuối cùng đã về tới nhà. "],"words":[[["Finally...","Cuối cùng..."],["I...","Tôi...."],["Am...","to be"],["Home...","nhà..."]]],"time":{"start":"256","stop":"261"}},{"paneid":"p8-4","xlation":["Chào mừng về nhà.","Chúng tôi đều rất no đến nổi không di chuyển được. "],"words":[[["Welcome","Chào mừng"],["home.","nhà."]],[["We","Chúng tôi"],["are","to be"],["so","rất"],["full,","no,"],["we","chúng tôi"],["can't","khồng thể"],["even","thậm chí"],["move.","chuyển động"]]],"time":{"start":"261","stop":"266"}},{"paneid":"p8-5","xlation":["Tại sao cô ấy lại buồn?","Tất cả chúng ta đã làm gì sai?"],"words":[[["Why","Tại sao"],["is","to be"],["she","cô ấy"],["so","rất"],["upset?","buồn?"]],[["What","Cái gì"],["have",""],["we","chúng ta"],["all","tất cả"],["done","đã làm"],["wrong?","sai?"]]],"time":{"start":"266","stop":"271"}}]];
MeoU.glosses[MeoU.DORAPLUS1CH2] = [[
  {"paneid":"p1-1",
   "xlation":["Cái gì vậy?","Tôi mua tàu hũ"],
   "words":[[["What","Cái gì"],["is","to be"],["that?","đó"]],[["I","tôi"],["bought","mua"],["some","một ít"],["tofu","tàu hũ"]]],
   "time":{"start":0,"stop":4}},
  {"paneid":"p1-2",
   "xlation":["Mẹ dặn tôi cẩn thận khi bưng nó về nhà."],
   "words":[[["Mom","mẹ"],["told","nói với"],["me","tôi"],["to be","to be"],["careful","cẩn thận"],["while","trong lúc"],["carrying","mang"],["it","nó, cái đó"],["home","nhà"]]],
   "time":{"start":4,"stop":8}},
  {"paneid":"p1-3",
   "xlation":["Bạn không biết rằng bạn nên mang tàu hũ trên đầu sao?"],
   "words":[[["Didn't","(dạng rút ngắn của did not) không làm"],["you","bạn"],["know","biết"],["that","cái đó"],["you","bạn"],["were","to be"],["supposed","được cho là"],["to","(đứng trước một động từ chưa chia, không có nghĩa)"],["carry","mang"],["tofu","tàu hũ"],["on","trên"],["top","phía trên"],["of","của"],["your","của bạn"],["head?","cái đầu"]]],
   "time":{"start":8,"stop":12}}],
 [{"paneid":"p2-1",
   "xlation":["Thật vậy sao?"],
   "words":[[["Is","To be"],["that","đó"],["so?","như vậy"]]],
   "time":{"start":12,"stop":14}},
  {"paneid":"p2-2",
   "xlation":["Cù lét.","Bạn đang làm gì vậy?"],
   "words":[[["Tickle, tickle.","cù"]],[["What","cái gì"],["are","to be"],["you","bạn"],["doing?","làm"]]],
   "time":{"start":14,"stop":17}}],
 [{"paneid":"p3-1",
   "xlation":["Dừng lại!","Coi chừng tàu hũ, đừng di chuyển"],
   "words":[[["Stop it!","Dừng lại"]],[["Watch","coi chừng"],["your","của bạn"],["tofu,","đậu hũ"],["don't","đừng"],["move","di chuyển"],["around!","xung quanh"]]],
   "time":{"start":17,"stop":22}},
  {"paneid":"p3-2",
   "xlation":["Oh không!","Mẹ chắc chắn sẽ la tôi.","Đó là lỗi của bạn, bạn làm rớt nó.","Tôi không làm gì cả"],
   "words":[[["Oh","Oh"],["no!","không!"]],[["Mother","Mẹ"],["will","sẽ"],["yell","la mắng"],["at","giới từ"],["me","tôi"],["for","giới từ"],["sure!","chắc chắn"]],[["It's","Nó"],["your","của bạn"],["fault","lỗi"],["you","bạn"],["dropped","đánh rơi"],["it.","nó"]],[["I","Tôi"],["had","có"],["nothing","không có gì"],["to","giới từ"],["do","làm"],["with","với"],["it.","nó"]]],
   "time":{"start":22,"stop":30}},
  {"paneid":"p3-3",
   "xlation":["Cái gì?","Thật là ích kỉ"],
   "words":[[["What?!","Cái  gì?"]],[["That's","Cái đó"],["so","rất"],["mean!","ích kỉ"]]],
   "time":{"start":30,"stop":33}},
  {"paneid":"p3-4",
   "xlation":["Đừng khóc nữa!","Bạn không muốn trả thù họ sao?","Nhưng bằng cách nào?","Họ có hai người..."],
   "words":[[["Stop","Dừng lại, ngưng"],["crying!","khóc"]],[["Don't","(dạng rút ngắn của do not) không làm"],["you","bạn"],["want","muốn"],["to","giới từ"],["get back at","trả thù"],["them?","họ?"]],[["But","Nhưng"],["how?","như thế nào?"]],[["There","Có"],["are","to be"],["two","hai"],["of","của"],["them.","họ"]]],
   "time":{"start":33,"stop":39}},
  {"paneid":"p3-5",
   "xlation":["Găng tay gây cười"],
   "words":[[["A","Mạo từ, một"],["tickling","ngứa, gây ngứa"],["glove.","găng tay"]]],
   "time":{"start":39,"stop":41}},
  {"paneid":"p3-6",
   "xlation":["Nếu bạn mang cái này"],
   "words":[[["If","Nếu"],["you","bạn"],["wear","mặc"],["this...","cái này..."]]],
   "time":{"start":41,"stop":43}}],
 [{"paneid":"p4-1",
   "xlation":["Và làm như thế này"],
   "words":[[["And","Và"],["do","làm"],["this...","điều này..."]]],
   "time":{"start":43,"stop":45}},
  {"paneid":"p4-2",
   "xlation":["Nó có thể dài đến 5 mét.","Hiểu rồi."],
   "words":[[["It","Nó"],["can","có thể"],["reach","đạt đến, với tới"],["up to","đến"],["5","5"],["meters.","mét"]],[["Got it","hiểu rồi"]]],
   "time":{"start":45,"stop":49}},
  {"paneid":"p4-3",
   "xlation":["Suneo và Giant, tôi sẽ cù lét các bạn cho tới chết."],
   "words":[[["Suneo","Suneo"],["and","và"],["Giant,","Giant,"],["I","tôi"],["will","sẽ"],["tickle","cù"],["them","chúng, họ"],["to","đến"],["death.","cái chết"]]],
   "time":{"start":49,"stop":53}},
  {"paneid":"p4-4",
   "xlation":["Hãy tập trước"],
   "words":[[["Let","Hãy"],["me","tôi"],["practice","thực hành"],["first.","trước"]]],
   "time":{"start":53,"stop":55}},
  {"paneid":"p4-5",
   "xlation":["Anh ấy đây rồi"],
   "words":[[["There","Có"],["he","anh ấy"],["is.","to be"]]],
   "time":{"start":55,"stop":56}}],
 [{"paneid":"p5-1",
   "xlation":["Bạn ngưng cười chưa?"],
   "words":[[["Are","to be"],["you","bạn"],["done","xong"],["laughing?","cười"]]],
   "time":{"start":56,"stop":58}},
  {"paneid":"p5-2",
   "xlation":["Bạn đang cười vào mặt tôi phải không?","Điều đó không đúng..."],
   "words":[[["You","Bạn"],["were","to be "],["laughing","cười"],["at","giới từ"],["my","của tôi"],["face,","mặt"],["weren't","to be"],["you?","bạn"]],[["That's","Điều đó"],["not","không"],["true...","đúng"]]],
   "time":{"start":58,"stop":63}},
  {"paneid":"p5-3",
   "xlation":["Tôi sẽ không để bạn trốn thoát đâu."],
   "words":[[["I","Tôi"],["won't","sẽ không"],["let","để"],["you","bạn"],["get away with it","trốn thoát"]]],
   "time":{"start":63,"stop":65}},
  {"paneid":"p5-4",
   "xlation":["Ah, cảm ơn vì đã mời tôi.","Giọng nói đó..."],
   "words":[[["Ah,","Ah,"],["thank you","cảm ơn"],["for","giới từ"],["inviting","mời "],["me.","tôi"]],[["That","đó"],["voice...","giọng"]]],
   "time":{"start":65,"stop":71}},
  {"paneid":"p5-5",
   "xlation":["Suneo luôn cư xử rất tốt.","Mọi người nên giống anh ấy"],
   "words":[[["Suneo","Suneo"],["always","luôn luôn"],["has","có"],["good","tốt"],["manners.","cách cư xử"]],[["Everyone","Mọi người"],["should","nên"],["be","to be"],["like","giống"],["him","anh ấy"]]],
   "time":{"start":71,"stop":77}},
  {"paneid":"p5-6",
   "xlation":["Bạn nói đúng!","Cù lét."],
   "words":[[["You","Bạn"],["are","to be "],["right!","đúng"]],[["Tickle, tickle.","cù"]]],
   "time":{"start":77,"stop":80}}],
 [{"paneid":"p6-1",
   "xlation":["Chưa xong đâu.","Thêm nữa nè!"],
   "words":[[["I'm","Tôi"],["not","không"],["finished","hoàn thành"],["yet.","chưa"]],[["Here's","Đây là"],["some","một vài "],["more!","hơn"]]],
   "time":{"start":80,"stop":83}},
  {"paneid":"p6-2",
   "xlation":["Tôi đã cười quá nhiều."],
   "words":[[["I've","Tôi"],["laughed","cười"],["too","quá"],["much.","nhiều"]]],
   "time":{"start":83,"stop":85}},
  {"paneid":"p6-3",
   "xlation":["Đó là một thành công lớn.","Rất vui khi nghe thấy điều đó."],
   "words":[[["It","Nó"],["was","to be"],["a","mạo từ"],["huge","lớn"],["success.","thành công"]],[["Glad","vui"],["to","giới từ"],["hear","nghe"],["that.","điều đó"]]],
   "time":{"start":85,"stop":89}},
  {"paneid":"p6-4",
   "xlation":["Chuyện gì đã xảy ra với tàu hũ?"],
   "words":[[["What","Cái gì"],["happened","xảy ra"],["to","giới từ"],["this","này"],["tofu?","đậu hũ"]]],
   "time":{"start":89,"stop":91}},
  {"paneid":"p6-5",
   "xlation":["Tôi đx dặn bạn phải cẩn thận phải không?"],
   "words":[[["I","Tôi"],["told","đã nói"],["you","bạn"],["to be","to be "],["careful,","cẩn thận"],["didn't","trợ động từ"],["I?","tôi?"]]],
   "time":{"start":91,"stop":94}},
  {"paneid":"p6-6",
   "xlation":["Bạn thật bướng bỉnh, hahaha.","Bây giờ tôi không sợ bị la nữa."],
   "words":[[["You","Bạn"],["really","thạt sự"],["are","to be"],["a","mạo từ"],["naughty","bướng bỉnh"],["boy,","con trai"],["hahaha.","hahaha."]],[["I'm","Tôi"],["not","không"],["afraid","e sợ"],["to be","to be"],["scolded","la mắng"],["anymore","chút nào nữa"],["now.","bây giờ"]]],
   "time":{"start":94,"stop":101}}]];

MeoU.glosses[MeoU.DORAPLUS1CH3] = [[
  {"paneid":"p1-1",
   "xlation":["Thật tuyệt!"],
   "words":[[["It's","nó thì"],["so","rất"],["cool!","tuyệt, đã"]]],
   "time":{"start":0,"stop":4.4}},
  {"paneid":"p1-2",
   "xlation":["Đó không phải là chiếc Porsche 935 Turbo sao?"],
   "words":[[["Isn't","không phải"],["it","nó"],["a","mạo từ, một"],["Porsche","Porsche"],["935","935"],["Turbo?","Turbo?"]]],
   "time":{"start":4.4,"stop":7.3}},
  {"paneid":"p1-3",
   "xlation":["Và đây là 10 cốc mỳ."],
   "words":[[["And","và"],["here","ở đây"],["are","to be"],["10","10"],["cups","ly"],["of","giới từ"],["noodles.","mì"]]],
   "time":{"start":7.3,"stop":10}},
  {"paneid":"p1-4",
   "xlation":["Tôi luôn ao ước được ăn từng này mỳ.","Tôi cần ăn thêm 6 cốc nữa."],
   "words":[[["It's","nó"],["been","to be"],["my","của tôi"],["dream","giấc mơ"],["to","giới từ"],["eat","ăn"],["all","tất cả"],["of","giới từ"],["this.","cái này"]],[["I","tôi"],["need","cần"],["to","giới từ"],["force","bắt buộc"],["myself","chính tôi"],["to","giới từ"],["eat","ăn"],["6","6"],["more","hơn"],["cups.","ly"]]],
   "time":{"start":10,"stop":16.2}},
  {"paneid":"p1-5",
   "xlation":["Ôi...","tôi bị ói mất!"],
   "words":[[["Gulp...","nuốt"]],[["I'm","tôi"],["sick!","bệnh"]]],
   "time":{"start":16.2,"stop":18.4}}],
 [{"paneid":"p2-1",
   "xlation":["Tôi thật ngu ngốc!","Tôi thật ngu ngốc!","Tại sao tôi không thể ăn hết 10 cốc mỳ yêu thích."],
   "words":[[["I'm","tôi"],["such","thật là"],["an","mạo từ"],["idiot!","kẻ ngốc"]],[["I'm","tôi"],["an","một"],["idiot!","kẻ ngốc"]],[["Why","tại sao"],["can't","không thể"],["I","tôi"],["finish","kết thúc"],["10","10"],["cups","ly"],["of","giới từ"],["my","của tôi"],["favorite","yêu thích"],["food?","thức ăn"]]],
   "time":{"start":18.4,"stop":25}},
  {"paneid":"p2-2",
   "xlation":["Đáng lẽ, tôi nên mua bộ ghép hình.","Nhưng tôi do dự.","Tôi muốn lấy lại tiền."],
   "words":[[["I","tôi"],["should","nên"],["have bought","mua"],["a","mạo từ, một"],["plastic","nhựa"],["model","mẫu"],["instead.","thay vào đó"]],[["But","nhưng"],["I","tôi"],["hesitated.","do dự"]],[["I","tôi"],["want","muốn"],["my","của tôi"],["money","tiền"],["back!","trở lại"]]],
   "time":{"start":25,"stop":31.6}},
  {"paneid":"p2-3",
   "xlation":["Bạn đang nói về 1000 yen bác bạn cho phải không?"],
   "words":[[["Are","to be"],["you","bạn"],["talking","nói"],["about","về"],["the","mạo từ"],["1000","1000"],["yen","đơn vị tiền tệ của Nhật"],["you","bạn"],["got","có từ"],["from","từ"],["your","của bạn"],["uncle?","cậu"]]],
   "time":{"start":31.6,"stop":35.4}},
  {"paneid":"p2-4",
   "xlation":["Nếu cộng với tiền tiết kiệm thì bạn sẽ có đủ 1300 yen?"],
   "words":[[["If","nếu"],["you","bạn"],["added","thêm"],["that","điều đó"],["to","giới từ"],["what","cái gì"],["you","bạn"],["had saved","tiết kiệm"],["it","nó"],["would","sẽ"],["be","to be"],["1300","1300"],["yen?","đơn vị tiền Nhật"]]],
   "time":{"start":35.4,"stop":41.1}},
  {"paneid":"p2-5",
   "xlation":["Và bạn đang nghĩ đến việc mua 10 ly mỳ?"," Thật là ngốc!"],
   "words":[[["And","và"],["you","bạn"],["were","to be "],["thinking","nghĩ"],["to","đến"],["buy","mua"],["10","10"],["cups","ly"],["of","giới từ"],["noodles","mỳ"],["with","với "],["it?!","nó?!"]],[["What","cái gì"],["a","mạo từ, một"],["fool!","kẻ ngốc!"]]],
   "time":{"start":41.1,"stop":46.9}},
  {"paneid":"p2-6",
   "xlation":["Bởi vì bạn quá hấp tấp.","Chuyện đã xảy ra rồi, chúng ta không thể thay đổi."," Hãy nhớ rằng từ bây giờ trở đi..."],
   "words":[[["It's","nó là"],["because","bởi vì"],["you're","bạn"],["so","quá"],["rash.","hấp tấp"]],[["Since","Vì"],["it","nó"],["already","rồi"],["happened,","đã xảy ra"],["we","chúng ta"],["can't","không thể"],["do","làm"],["anything","bất cứ gì"],["about","giới từ"],["it.","nó"]],[["Just","chỉ"],["remember","nhớ"],["from now on","kể từ bây giờ"]]],
   "time":{"start":46.9,"stop":54.2}},
  {"paneid":"p2-7",
   "xlation":["Bạn nghĩ tôi là một kẻ ngốc?","Thật tệ"],
   "words":[[["You","bạn"],["think","nghĩ"],["I'm","tôi là"],["a","mạo từ, một"],["fool?","kẻ ngốc"]],[["That's","nó thì"],["too","quá"],["bad.","tệ"]]],
   "time":{"start":54.2,"stop":59.5}},
  {"paneid":"p2-8",
   "xlation":["Tôi vừa nảy ra một ý kiến.","Cho dù tôi có thất bại như thế nào, tôi vẫn có thể sửa lại được."],
   "words":[[["I","tôi"],["just","vừa mới"],["had","có"],["an","một"],["idea.","ý kiến, ý tưởng"]],[["No matter","bất kể"],["how","như thế nào"],["much","nhiều"],["I've","tôi"],["failed,","thất bại"],["I","tôi"],["can","có thể"],["still","vẫn"],["fix","sửa"],["it.","nó"]]],
   "time":{"start":59.5,"stop":66}},
  {"paneid":"p2-9",
   "xlation":["Bởi vì chúng ta có cố máy thời gian, phải không?"],
   "words":[[["Because","bởi vì"],["we","chúng ta"],["have","có "],["a","mạo từ, một"],["time","thời gian"],["machine,","máy móc"],["don't we?","phải vậy không?"]]],
   "time":{"start":66,"stop":69.3}}],
 [{"paneid":"p3-1",
   "xlation":["Tôi sẽ bảo Nobita một giờ trước mua bộ ghép hình.","4 ly mỳ là đủ rồi.","Dừng lại!"],
   "words":[[["I'll","tôi sẽ"],["tell","nói"],["Nobita","Nobita"],["from","từ"],["one","một"],["hour","tiếng"],["ago","cách đây"],["to","giới từ"],["buy","mua"],["a","mạo từ|một"],["plastic","nhựa"],["model.","mẫu"]],[["Four","Bốn"],["cups","ly"],["of","giới từ"],["noodles","mỳ"],["are","to be"],["more than","hơn"],["enough.","đủ"]],[["Stop!","dừng!"]]],
   "time":{"start":69.3,"stop":78.8}},
  {"paneid":"p3-2",
   "xlation":["Bạn không thể thay đổi sự việc đã xảy ra trong quá khứ"],
   "words":[[["You","bạn"],["can't","không thể"],["change","thay đổi"],["something","vài thứ"],["that's","nó thì đã"],["happened","xảy ra"],["in","trong"],["the","mạo từ"],["past!","quá khứ"]]],
   "time":{"start":78.8,"stop":82.4}},
  {"paneid":"p3-3",
   "xlation":["Tại sao không?","Bỏi vì..."],
   "words":[[["Why","tại sao"],["not?","không"]],[["Because...","bởi vì"]]],
   "time":{"start":82.4,"stop":85.7}},
  {"paneid":"p3-4",
   "xlation":["Thậm chí khi bạn quay lại chỉ để thay đổi chính mình, nó vẫn sẽ ảnh hưởng mọi người xung quanh"],
   "words":[[["Even","thậm chí"],["if","nếu"],["you","bạn"],["only","chỉ"],["return","quay lại"],["to","giới từ"],["change","thay đổi"],["yourself,","chính bạn"],["it","nó"],["will","sẽ"],["still","vẫn"],["affect","hưởng"],["people","con người"],["around","xung quanh"],["you!","bạn"]]],
   "time":{"start":85.7,"stop":91.4}},
  {"paneid":"p3-5",
   "xlation":["Bạn có thể làm đảo lộn cả lịch sử"],
   "words":[[["You","bạn"],["can","có thể"],["mess up","xáo trộn, đảo lộn"],["all","tất cả"],["of","giới từ"],["history!","lịch sử"]]],
   "time":{"start":91.4,"stop":94.1}},
  {"paneid":"p3-6",
   "xlation":["Bạn quan trọng hoá vấn đề quá.","Ly mỳ và lịch sử thì có liên quan gì đến nhau chứ?"],
   "words":[[["You","bạn"],["make","làm"],["it","nó"],["sound ","nghe"],["like","có vẻ như"],["it's","nó"],["a","mạo từ, một"],["big","lớn"],["deal.","vấn đề"]],[["What's","cái gì"],["the","mạo từ"],["connection","sự liên kết"],["between","giữa"],["noodles","mỳ"],["and","và"],["history","lịch sử"],["anyway?","dầu sao đi nữa"]]],
   "time":{"start":94.1,"stop":101.4}},
  {"paneid":"p3-7",
   "xlation":["Nó sẽ ảnh hưởng đến toàn bộ quá khứ!","Đó là lý do tại sao bạn không thể thay đổi nó!","Thôi nào, mọi chuyện sẽ ổn thôi."],
   "words":[[["It","nó"],["will","sẽ"],["still","vẫn"],["influence","ảnh hưởng"],["the","mạo từ"],["whole","tất cả"],["past!","quá khứ!"]],[["That's","nó thì"],["why","tại sao"],["you","bạn"],["can't","không thể"],["change","thay đổi"],["it!","nó"]],[["Come on,","Thôi nào"],["it'll","nó sẽ"],["be","to be"],["fine.","ổn"]]],
   "time":{"start":101.4,"stop":109.9}},
  {"paneid":"p3-8",
   "xlation":["Cảm ơn rất nhiều"],
   "words":[[["Thank you","Cảm ơn"],["very","rất"],["much.","nhiều"]]],
   "time":{"start":109.9,"stop":112.5}}],
 [{"paneid":"p4-1",
   "xlation":["Quay lại sớm nhé."],
   "words":[[["Please","làm ơn"],["come","đến"],["back","trở lại"],["soon.","sớm"]]],
   "time":{"start":112.5,"stop":115}},
  {"paneid":"p4-2",
   "xlation":["Tiền tiết kiệm của tôi bây giờ là 1300 yen.","Tôi không thể tin mình có nhiều tiền đến vậy"],
   "words":[[["My","của tôi"],["savings","tiền tiết kiệm"],["is","to be"],["now","bây giờ"],["1300","1300"],["yen.","đơn vị tiền tệ Nhật"]],[["I","tôi"],["can't","không thể"],["believe","tin"],["I","tôi"],["have","có "],["so","rất"],["much","nhiều"],["money.","tiền"]]],
   "time":{"start":115,"stop":121.8}},
  {"paneid":"p4-3",
   "xlation":["Tôi sẽ dùng nó mua bộ ghép hình"],
   "words":[[["I'll","tôi sẽ"],["use","sử dụng"],["it","nó"],["to","giới từ"],["buy","mua"],["a","mạo từ, một"],["plastic","nhựa"],["model.","mẫu"]]],
   "time":{"start":121.8,"stop":124.7}},
  {"paneid":"p4-4",
   "xlation":["Nhưng tôi cũng muốn ăn 10 ly mỳ"],
   "words":[[["But","nhưng"],["I","tôi"],["want","muốn"],["to","giới từ"],["eat","ăn"],["10","10"],["cups","ly"],["of","giới từ"],["noodles","mỳ"],["too.","cũng"]]],
   "time":{"start":124.7,"stop":128.2}},
  {"paneid":"p4-5",
   "xlation":["Cái nào tốt hơn?"],
   "words":[[["Which one","Cái nào"],["is","to be"],["better?","tốt hơn"]]],
   "time":{"start":128.2,"stop":130.4}},
  {"paneid":"p4-6",
   "xlation":["Bộ ghép hình quá trẻ con.","Thế nên mình sẽ mua mỳ.","Anh ấy ngốc quá!"],
   "words":[[["A","mạo từ, một"],["plastic","nhựa"],["model","mẫu"],["is","to be"],["so","rất"],["childish.","trẻ con"]],[["So","vì thế"],["I'll","tôi sẽ"],["buy","mua"],["noodle","mỳ"],["cups","ly"],["instead!","thay vào đó"]],[["He's","Anh ấy"],["so","rất"],["stupid!","ngu ngốc"]]],
   "time":{"start":130.4,"stop":138.5}},
  {"paneid":"p4-7",
   "xlation":["Đồ ngốc, hãy mua bộ ghép hình"],
   "words":[[["Buy","Mua"],["a","mạo từ, một"],["plastic","nhựa"],["model,","kiểu, mẫu"],["you","bạn"],["fool!","kẻ ngốc!"]]],
   "time":{"start":138.5,"stop":141.4}},
  {"paneid":"p4-8",
   "xlation":["Bạn không thể ăn hết mười ly mỳ được, đồ ngốc!","Cái gì, cậu là tôi 1 tiếng sau?","Cậu đình nói \" đồ ngốc\" bao nhiều lần nữa?","Tôi không thể chịu đựng nữa!"],
   "words":[[["You","bạn"],["can't","không thể"],["finish","kết thúc"],["10","10"],["noodle","mì"],["cups,","ly"],["how","như thế náo"],["foolish!","ngốc nghếch"]],[["What,","cái gì"],["you","bạn"],["are","to be"],["me","tôi"],["from","từ"],["an","một, mạo từ"],["hour","giờ"],["from","từ"],["now?","bây giờ"]],[["How many","bao nhiêu"],["more","thêm"],["times","lần"],["do","trợ động từ"],["you","bạn"],["want","muốn"],["to","giới từ"],["say","nói"],["\"fool\"?","ngốc nghếch"]],[["I","tôi"],["can't","không thể"],["stand","chịu đựng"],["it.","nó"]]],
   "time":{"start":141.4,"stop":153.9}},
  {"paneid":"p4-9",
   "xlation":["Hãy nhìn vào thực tế đi.","4  ly mỳ là quá đủ cho bạn ăn rồi!"],
   "words":[[["Look ","nhìn"],["at","giới từ"],["reality.","thực tế"]],[["Four","Bốn"],["cups","ly"],["are","to be"],["more than","hơn"],["enough","đủ"],["for","cho|"],["you","bạn"],["to","giới từ"],["eat!","ăn"]]],
   "time":{"start":153.9,"stop":159.8}}],
 [{"paneid":"p5-1",
   "xlation":["Bạn nói như vậy.","Nghe thật sự có lý.","Mừng quá, cậu cũng hiểu rồi."],
   "words":[[["Now","bây giờ"],["that","rằng"],["you","bạn"],["say","nói"],["it...","nó"]],[["It","nó"],["really","thật sự"],["makes sense.","có ý nghĩa"]],[["I'm","tôi"],["glad","vui"],["he","anh ấy"],["understands.","hiểu"]]],
   "time":{"start":159.8,"stop":166.6}},
  {"paneid":"p5-2",
   "xlation":[" Vậy bạn vẫn sẽ mua bộ ghép hình chứ!","Tôi sẽ mua.","Đễ tôi làm."],
   "words":[[["So","vì thế"],["you'll","bạn sẽ"],["buy","mua"],["a","mạo từ, một"],["plastic","nhựa"],["model?","mẫu, kiểu"]],[["I","tôi"],["will.","sẽ"]],[["Just","chỉ"],["leave","để lại"],["it","nó"],["to","giới từ"],["me.","tôi"]]],
   "time":{"start":166.6,"stop":172.6}},
  {"paneid":"p5-3",
   "xlation":["Bạn thấy chưa?","Rất dễ dàng.","Cậu nói sao cũng được"],
   "words":[[["You","bạn"],["see?","xem"]],[["It","nó"],["was","to be"],["easy.","dễ dàng"]],[["Whatever","bất kể cái gì"],["you","bạn"],["say.","nói"]]],
   "time":{"start":172.6,"stop":177.2}},
  {"paneid":"p5-4",
   "xlation":["Bây giờ chúng ta đã thay đổi quá khứ,  chuyện sẽ khác"],
   "words":[[["Now","bây giờ"],["that","rằng"],["we've","chúng ta"],["changed","thay đổi"],["the","mạo từ"],["past,","quá khứ"],["something","vài thứ"],["has got to","phải"],["be","to be"],["different.","khác nhau"]]],
   "time":{"start":177.2,"stop":181.8}},
  {"paneid":"p5-5",
   "xlation":["Những cái ly này không thể ở đây.","tôi phải có bộ ghép hình ngay lúc này."],
   "words":[[["These","những"],["cups","ly "],["aren't","to be"],["supposed","cho rằng"],["to","giói từ"],["be","to be"],["here.","ở đây"]],[["I","tôi"],["should","nên"],["have","có "],["my","của tôi"],["model","mẫu, kiểu"],["by now","bây giờ"]]],
   "time":{"start":181.8,"stop":188}},
  {"paneid":"p5-6",
   "xlation":["Nếu Nobita một tiếng trước đã mua bộ hình thì tớ phaỉ có đó ngay bây giờ phải không?"],
   "words":[[["If","nếu"],["Nobita","Nobita"],["from","từ"],["one","một"],["hour","tiếng"],["ago","cách đây"],["bought","mua"],["a","mạo từ, một"],["plastic","nhựa"],["model,","mẫu"],["then","sau đó"],["I","tôi"],["should","nên"],["have","có "],["it,","nó"],["right?","đúng"]]],
   "time":{"start":188,"stop":194.5}},
  {"paneid":"p5-7",
   "xlation":["Tôi muốn kiểm tra 1 lần nữa"],
   "words":[[["I","tôi"],["want","muốn"],["to","giới từ"],["check","kiểm tra"],["one more time","một lần nữa"]]],
   "time":{"start":194.5,"stop":197.7}}],
 [{"paneid":"p6-1",
   "xlation":["Ah..","Anh ấy không có ở đây"],
   "words":[[["Ah...","ah"]],[["He's","Anh ấy"],["not","không"],["here.","ở đây"]]],
   "time":{"start":197.7,"stop":200.7}},
  {"paneid":"p6-2",
   "xlation":["Tôi vừa đi đâu?","Bạn vừa đi ra ngoài mua cái gì đó."],
   "words":[[["Where","Ở đâu"],["am","to be"],["I","tôi"],["going?","đang đi"]],[["You","bạn"],["went","đi"],["out","ngoài"],["to","giới từ"],["buy","mua"],["something.","vài thứ"]]],
   "time":{"start":200.7,"stop":204.4}},
  {"paneid":"p6-3",
   "xlation":["Anh ấy đi mua bộ ghép hình ah?","Tôi cảm thấy bất an"],
   "words":[[["Did","Trợ động từ"],["he","anh ấy"],["go","đi"],["to","giới từ"],["buy","mua"],["a","mạo từ, một"],["plastic","nhựa"],["model?","kiểu, mẫu"]],[["I","tôi"],["feel","cảm thấy"],["uneasy.","bất an"]]],
   "time":{"start":204.4,"stop":209.4}},
  {"paneid":"p6-4",
   "xlation":["Hey, bạn có thấy tôi vừa đi đâu không?"],
   "words":[[["Hey,","này"],["did","trợ động từ"],["you","bạn"],["see","xem, thấy"],["where","nơi nào"],["I","tôi"],["was","to be"],["going?","đi"]]],
   "time":{"start":209.4,"stop":212.4}},
  {"paneid":"p6-5",
   "xlation":["Tôi có đi đến cửa hàng đò chơi không?.","Cảm ơn"],
   "words":[[["Was","to be"],["I","tôi"],["going","sắp"],["to","giới từ"],["the","mạo từ"],["plastic","nhựa"],["model","kiểu, mẫu"],["store?","của hàng"]],[["Thanks.","Cảm ơn"]]],
   "time":{"start":212.4,"stop":217.1}},
  {"paneid":"p6-6",
   "xlation":["Anh ấy không có ở đây."],
   "words":[[["He's","Anh ấy"],["not","không"],["here.","ở đây"]]],
   "time":{"start":217.1,"stop":218.7}},
  {"paneid":"p6-7",
   "xlation":["Cái gì?","Tôi vừa đến cửa hàng một mình nhưng lại ra ngoài với một tôi khác nữa?"],
   "words":[[["What?","cái gì"]],[["I","tôi"],["was","to be"],["going","đang đi"],["to","giới từ"],["the","mạo từ"],["store","của hàng"],["by myself","một mình"],["but","nhưng"],["went","đi"],["out","ngoài"],["with","với "],["another","còn lại, khác"],["me?","tôi"]]],
   "time":{"start":218.7,"stop":224.6}},
  {"paneid":"p6-8",
   "xlation":["Chuyện gì đang xảy ra vậy?!"],
   "words":[[["What","cái gì"],["is","to be"],["going on?!","diễn ra"]]],
   "time":{"start":224.6,"stop":227.4}}],
 [{"paneid":"p7-1",
   "xlation":["Hey, ngừng lại!"],
   "words":[[["Hey,","này"],["stop","dừng"],["it!","nó"]]],
   "time":{"start":227.4,"stop":229.5}},
  {"paneid":"p7-2",
   "xlation":["Bạn đang làm gì vậy?","Và ai kia?"],
   "words":[[["What","cái gì"],["are","to be"],["you","bạn"],["doing?","làm"]],[["And","và"],["who","ai"],["is","to be"],["that?","đó"]]],
   "time":{"start":229.5,"stop":232.8}},
  {"paneid":"p7-3",
   "xlation":["Tôi là bạn trong 1 tiếng sau"],
   "words":[[["I","tôi"],["am","to be"],["you","bạn"],["in","trong"],["the","mạo từ"],["next","kế tiếp"],["hour.","giờ"]]],
   "time":{"start":232.8,"stop":235.4}},
  {"paneid":"p7-4",
   "xlation":["Bạn muốn mua bộ ghép hình phải không?","Ngưng mọi chuyện ngay bây giờ!","It's too complicated already.","Thế thì cậu thôi đi!"],
   "words":[[["You","bạn"],["should","nên"],["want","muốn"],["a","mạo từ, một"],["plastic","nhựa"],["model","kiểu, mẫu"],["too,","cũng"],["right?","đúng"]],[["Stop","dừng"],["all","tất cả"],["this","điều này"],["right now.","ngay bây giờ"]],[["It's","nó"],["too","quá"],["complicated","phức tạp"],["already!","rồi"]],[["Then","sau đó"],["cut","cắt"],["it","nó"],["out!","ngoài"]]],
   "time":{"start":235.4,"stop":245.1}},
  {"paneid":"p7-5",
   "xlation":["Nghe tôi này!","Bạn thật sự thích mỳ, nhưng..."],
   "words":[[["Listen","Nghe"],["to","giới từ"],["me!","tôi"]],[["You","bạn"],["really","thật sự"],["like","thích"],["noodles,","mỳ"],["but...","nhưng"]]],
   "time":{"start":245.1,"stop":249.1}},
  {"paneid":"p7-6",
   "xlation":["Đó có phải là một cách tiêu tiền có ý nghĩa?","Đừng dùng nó để mua một thứ vô dụng"],
   "words":[[["Is","to be"],["it","nó"],["a","mạo từ, một"],["meaningful","ý nghĩa"],["way","cách"],["to","giới từ"],["spend","trải qua"],["our","của chúng ta"],["money?","tiền"]],[["Don't","đừng"],["use","sử dụng"],["it","nó"],["to","giới từ"],["buy","mua"],["something","vài thứ"],["useless!","vô dụng"]]],
   "time":{"start":249.1,"stop":254.7}},
  {"paneid":"p7-7",
   "xlation":["Hãy quyết định ngay bây giờ!","Cái nào?","Bộ ghép hình?","Hay mỳ?"],
   "words":[[["Please","làm ơn"],["decide","quyết định"],["now!!","bây giờ"]],[["Which","cái nào, loại nào"],["one!?","một"]],[["A","mạo từ, một"],["plastic","nhựa"],["model?!","kiểu, mẫu"]],[["Cups","ly"],["of","giới từ"],["noodles!?","mỳ"]]],
   "time":{"start":254.7,"stop":261.1}}],
 [{"paneid":"p8-1",
   "xlation":["Hey, hey!","Dừng lại!","Bạn không thể đánh chính mình được!"],
   "words":[[["Hey,","này"],["hey!","này"]],[["Stop","dừng"],["it!","nó"]],[["You","bạn"],["can't","không thể"],["fight","đánh "],["with","với "],["yourself!","chính bạn"]]],
   "time":{"start":261.1,"stop":265.2}},
  {"paneid":"p8-2",
   "xlation":["Ây da!","Dừng lại!"],
   "words":[[["Ouch!","Ấy da!"]],[["Stop","dừng"],["it!","nó"]]],
   "time":{"start":265.2,"stop":267.2}},
  {"paneid":"p8-3",
   "xlation":["Tất cả các bạn...","Làm ơn ngưng lại"],
   "words":[[["All","tất cả"],["of","giới từ"],["you...","bạn"]],[["Please","làm ơn"],["stop","dừng"],["doing","làm"],["this.","điều này"]]],
   "time":{"start":267.2,"stop":270.6}},
  {"paneid":"p8-4",
   "xlation":["Eh?","Các bạn là chúng tôi sau khi đánh nhau ư?"],
   "words":[[["Eh?","hả"]],[["Are","to be"],["you","bạn"],["us","chúng tôi"],["after","sau đó"],["the","mạo từ"],["fight?","cuộc đấu"]]],
   "time":{"start":270.6,"stop":274}}],
 [{"paneid":"p9-1",
   "xlation":["Chúng tôi quyết định ngừng đánh nhau, nhưng..","Chúng tôi không biết Nobita nào nên trở về thời gian nào.","Hãy nói chúng tôi biết nên làm gì."],
   "words":[[["We","chúng ta"],["decided","quyết định"],["to","giới từ"],["stop","dừng"],["fighting,","đánh "],["but...","nhưng"]],[["We","chúng ta"],["don't","không"],["know","biết"],["which Nobita","Nobita nào"],["should","nên"],["return","quay lại"],["to","giới từ"],["which time.","thời gian nào"]],[["Please","làm ơn"],["tell","nói với"],["us","chúng tôi"],["what","cái gì"],["to","giới từ"],["do","làm"],["now.","bây giờ"]]],
   "time":{"start":274,"stop":283.7}},
  {"paneid":"p9-2",
   "xlation":["Tôi không thể nói được.","Hãy trở về thời gian mà các bạn thuộc về."],
   "words":[[["I","tôi"],["can't","không thể"],["say.","nói"]],[["Just","chỉ"],["return","quay lại"],["to","giới từ"],["when","khi"],["you","bạn"],["belong.","thuộc về"]]],
   "time":{"start":283.7,"stop":289}},
  {"paneid":"p9-3",
   "xlation":["Được thôi, tôi quyết định mua bộ ghéo hình của ly mỳ.","Nhưng nó không vui chút nào..."],
   "words":[[["Well,","Vâng,"],["I","tôi"],["decided","quyết định"],["to","giới từ"],["buy","mua"],["a","một"],["plastic","nhựa"],["model","kiểu, mẫu"],["of","giới từ"],["a","mạo từ, một"],["noodle","mỳ"],["cup.","ly"]],[["But","nhưng"],["it's","nó thì"],["not","không"],["very","rất"],["fun...","vui"]]],
   "time":{"start":289,"stop":294.6}}]];

MeoU.glosses[MeoU.DORAPLUS1CH4] = [[
  {"paneid":"p1-1",
   "xlation":["Trả nó lại đây!","Tôi vẫn chưa đọc đâu."],
   "words":[[["Give","Trả"],["it","nó"],["back"," lại"],["now!","bây giờ"]],[["I","tôi"],["haven't got to ","được"],["read","đọc"],["it","nó"],["yet.","chưa"]]],
   "time":{"start":0,"stop":3.9}},
  {"paneid":"p1-2",
   "xlation":["Tôi nên làm gì đây?"],
   "words":[[["What","Cái gì"],["should","nên"],["I","tôi"],["do?","làm?"]]],
   "time":{"start":3.9,"stop":5.6}},
  {"paneid":"p1-3",
   "xlation":["Tôi mượn sách từ Suneo.","Nhưng tôi làm mất nó rồi."],
   "words":[[["I","tôi"],["borrowed","mượn"],["a book","một cuốn sách"],["from","từ"],["Suneo.","Suneo"]],[["But","nhưng"],["I","tôi"],["lost","mất"],["it.","nó"]]],
   "time":{"start":5.6,"stop":9.8}},
  {"paneid":"p1-4",
   "xlation":["Thật ư?","Hết cách rồi"],
   "words":[[["Really?","thật ư?"]],[["It can't be helped","Hết cách rồi."]]],
   "time":{"start":9.8,"stop":12.6}},
  {"paneid":"p1-5",
   "xlation":["Tấm vé thay thế"],
   "words":[[["Substitute","thay thế"],["stickers.","tấm vé"]]],
   "time":{"start":12.6,"stop":14.8}},
  {"paneid":"p1-6",
   "xlation":["Đưa tôi bất kì cuốn sách nào"],
   "words":[[["Give","Đưa "],["me","tôi"],["any","bất kì"],["kind","loại"],["of","giới từ"],["book.","cuốn sách"]]],
   "time":{"start":14.8,"stop":17.2}},
  {"paneid":"p1-7",
   "xlation":["Còn cuốn danh bạ điện thoại cũ này thì sao?"],
   "words":[[["How about","Còn"],["an","mạo từ"],["old","cũ"],["phone book?","danh bạ điện thoại"]]],
   "time":{"start":17.2,"stop":19.4}},
  {"paneid":"p1-8",
   "xlation":["Lấy một tấm vé và..."],
   "words":[[["Take","Lấy"],["one","một"],["sticker","tấm vé"],["and...","và"]]],
   "time":{"start":19.4,"stop":22.1}},
  {"paneid":"p1-9",
   "xlation":["Cuốn truyện của Suneo"],
   "words":[[["Suneo's","của Suneo"],["comic.","cuốn truyện"]]],
   "time":{"start":22.1,"stop":23.7}}],
 [{"paneid":"p2-1",
   "xlation":["Dán nó vào"],
   "words":[[["Put it on","dán nó lên"]]],
   "time":{"start":23.7,"stop":25.2}},
  {"paneid":"p2-2",
   "xlation":["Bây giờ bạn có thể trả lại cho anh ấy rồi.","Bạn đùa tôi phải không?","Họ sẽ đánh tôi chết mất!"],
   "words":[[["You","bạn"],["can","có thể"],["give","đưa"],["it","nó"],["to","giới từ"],["him","anh ấy"],["now.","bây giờ"]],[["Are","to be"],["you","bạn"],["kidding?","đùa?"]],[["They'll","Họ sẽ"],["beat","đánh"],["me","tôi"],[" to death!","đến chết"]]],
   "time":{"start":25.2,"stop":31.2}},
  {"paneid":"p2-3",
   "xlation":["Đây là của sách của bạn phải không?"],
   "words":[[["Is","to be"],["this","này"],["your","của bạn"],["book?","cuốn sách"]]],
   "time":{"start":31.2,"stop":32.9}},
  {"paneid":"p2-4",
   "xlation":["Chính nó!","Đưa nó cho tôi"],
   "words":[[["It is!","Chính là nó!"]],[["Give","Đưa"],["it","nó"],["to","giới từ"],["me!","tôi!"]]],
   "time":{"start":32.9,"stop":35.2}},
  {"paneid":"p2-5",
   "xlation":["Bạn có thể đọc nó bây giờ, giant.","Cảm ơn"],
   "words":[[["You","bạn"],["can","có thể"],["read","đọc"],["it","nó"],["now,","bây giờ"],["Giant.","Giant."]],[["Thanks.","cảm ơn"]]],
   "time":{"start":35.2,"stop":38.7}},
  {"paneid":"p2-6",
   "xlation":["Nó hay, đúng không?"],
   "words":[[["It's","nó"],["good,","tốt, hay"],["isn't it?","phải không?"]]],
   "time":{"start":38.7,"stop":40.9}},
  {"paneid":"p2-7",
   "xlation":["Tấm vé thay thế, à?"],
   "words":[[["Substitute","thay thế"],["stickers,","tấm vé"],["huh?","À?"]]],
   "time":{"start":40.9,"stop":42.9}},
  {"paneid":"p2-8",
   "xlation":["Làm ơn cho tôi thấy bài kiểm tra của bạn."],
   "words":[[["Please","làm ơn"],["show","cho thấy"],["me","tôi"],["your","của bạn"],["test.","bài kiểm tra"]]],
   "time":{"start":42.9,"stop":46.1}},
  {"paneid":"p2-9",
   "xlation":["Tôi lại bị điểm không rồi.","Làm gì bây giờ?"],
   "words":[[["I","tôi"],["got","đạt, có"],["a zero","số không"],["again.","nữa"]],[["What'll","Cái gì + will, sẽ"],["I","tôi"],["do?","làm"]]],
   "time":{"start":46.1,"stop":50.9}}],
 [{"paneid":"p3-1",
   "xlation":["Tôi biết rồi.","Tôi sẽ dán tấm vé lên tờ quảng cáo này."],
   "words":[[["I","tôi"],["know.","biết"]],[["I'll","tôi sẽ"],["put","đặt, dán"],["a sticker","một tấm vé"],["on","lên"],["this","này"],["ad....","tờ quảng cáo.."]]],
   "time":{"start":50.9,"stop":55}},
  {"paneid":"p3-2",
   "xlation":["Mọi thứ đều thấp!","Giảm giá!"],
   "words":[[["Everything","mọi thứ"],["is","to be"],["low!","thấp!"]],[["Bargain sale!","giảm giá!"]]],
   "time":{"start":55,"stop":58.3}},
  {"paneid":"p3-3",
   "xlation":["Điểm thấp quá.","Nhưng vẫn tốt hơn điểm không."],
   "words":[[["What a low score.","Điểm thấp quá"]],[["But","Nhưng"],["it's","nó"],["better than","tốt hơn"],["zero","điểm không"]]],
   "time":{"start":58.3,"stop":62.4}},
  {"paneid":"p3-4",
   "xlation":["Mấy tấm vé này vui quá!","Tôi muốn chơi với chúng.","Không được!"],
   "words":[[["These","này"],["stickers","những tấm vé"],["are ","to be"],["fun!","vui"]],[["I ","tôi"],["want","muốn"],["to","giới từ"],["play","chơi"],["with ","với"],["them.","chúng"]],[["No way!","Không được!"]]],
   "time":{"start":62.4,"stop":68.2}},
  {"paneid":"p3-5",
   "xlation":["Bạn luôn như thế...."],
   "words":[[["You're","bạn"],["always","luôn luôn"],["like","giống"],["that...","như thế này..."]]],
   "time":{"start":68.2,"stop":70.2}},
  {"paneid":"p3-6",
   "xlation":["Thật phiền phức"],
   "words":[[["Give me a break","Thật phiền phức"]]],
   "time":{"start":70.2,"stop":71.7}},
  {"paneid":"p3-7",
   "xlation":["Làm ơn ở lại đây."],
   "words":[[["Please","làm ơn"],["stay","ở lại"],["there.","đây."]]],
   "time":{"start":71.7,"stop":74.6}}],
 [{"paneid":"p4-1",
   "xlation":["Hãy đi chơi đi."],
   "words":[[["Let's","hãy"],["play.","chơi"]]],
   "time":{"start":74.6,"stop":76.9}},
  {"paneid":"p4-2",
   "xlation":["Tôi phải mang cái này đến nhà Yamada-san."],
   "words":[[["I","tôi"],["have to ","phải"],["take","mang"],["this","này"],["to","đến"],["Yamada-san's","của Yamada-san's"],["house.","ngôi nhà"]]],
   "time":{"start":76.9,"stop":80.1}},
  {"paneid":"p4-3",
   "xlation":["Xa lắm"],
   "words":[[["That's","Nó"],["really","thật sự"],["far.","xa"]]],
   "time":{"start":80.1,"stop":84.8}},
  {"paneid":"p4-4",
   "xlation":["có ai ở nhà không?"],
   "words":[[["Anyone","bất kì ai"],["home?","nhà"]]],
   "time":{"start":84.8,"stop":86.8}},
  {"paneid":"p4-5",
   "xlation":["Cảm ơn.","Chuyện gì đang xảy ra vậy?"],
   "words":[[["Thank you.","Cảm ơn "]],[["What's","cái gì"],["going on?","đang xảy ra?"]]],
   "time":{"start":86.8,"stop":90.2}},
  {"paneid":"p4-6",
   "xlation":["Cuốn truyện này không hay tí nào"],
   "words":[[["This","này"],["comic","truyện"],["is","to be"],["not","không"],["interesting","hấp dẫn"],["at all","chút nào"]]],
   "time":{"start":90.2,"stop":93.1}}],
 [{"paneid":"p5-1",
   "xlation":["không phải đây là danh bạ điện thoại sao?"],
   "words":[[["Isn't it","không phải nó là"],["a phone book?","danh bạ"]]],
   "time":{"start":93.1,"stop":97}},
  {"paneid":"p5-2",
   "xlation":["Tôi không thấy cái vịn đâu cả."],
   "words":[[["I","tôi"],["don't","không"],["see","thấy"],["a handle.","cái vịn"]]],
   "time":{"start":97,"stop":101.5}},
  {"paneid":"p5-3",
   "xlation":["Nhột quá"],
   "words":[[["That tickles!","nhột quá"]]],
   "time":{"start":101.5,"stop":103.2}},
  {"paneid":"p5-4",
   "xlation":["Có ai ở nhà không?"],
   "words":[[["Is","to be"],["anyone","bất kì ai"],["home?","nhà"]]],
   "time":{"start":103.2,"stop":104.9}},
  {"paneid":"p5-5",
   "xlation":["Tôi nghĩ bạn nhầm tôi với..."],
   "words":[[["I","tôi"],["think","nghĩ"],["you","bạn"],["mistook","nhầm"],["me","tôi"],["for...","giới từ"]]],
   "time":{"start":104.9,"stop":107.9}}],
 [{"paneid":"p6-1",
   "xlation":["Tôi nghĩ là chúng ta la anh ấy đủ rồi."],
   "words":[[["I","tôi "],["guess","đoán"],["we've","chúng ta"],["scolded","la mắng"],["him","anh ấy"],["enough.","đủ"]]],
   "time":{"start":107.9,"stop":110.4}},
  {"paneid":"p6-2",
   "xlation":["Bạn đã học được một bài học rồi phải không?.","Bây giờ hãy về nhà nào."],
   "words":[[["You've","bạn"],["learned","đã học"],["your","của bạn"],["lesson,","bài học"],["right?","đúng không"]],[["Let's","hãy"],["go home","đi về nhà"],["now.","bây giờ"]]],
   "time":{"start":110.4,"stop":114.2}},
  {"paneid":"p6-3",
   "xlation":["Tôi sợ về nhà"],
   "words":[[["I'm","tôi"],["afraid","e sợ"],["to","giới từ"],["go home","đi về nhà"]]],
   "time":{"start":114.2,"stop":116.3}},
  {"paneid":"p6-4",
   "xlation":["Hả?","Nó khoá rồi"],
   "words":[[["Eh?","Hả"]],[["It's","nó"],["locked.","bị khoá"]]],
   "time":{"start":116.3,"stop":118.3}},
  {"paneid":"p6-5",
   "xlation":["Chuyện gì vậy?","Bạn không ăn ah.","Bạn bị cảm lạnh sao?"],
   "words":[[["What's wrong?","Chuyện gì vậy?"]],[["You're","bạn"],["not","không"],["eating.","ăn"]],[["Did","trợ động từ"],["you","bạn"],["catch","mắc "],["a cold?","cảm lạnh"]]],
   "time":{"start":118.3,"stop":122.9}}]];

MeoU.glosses[MeoU.DORAPLUS1CH5] = [[
  {"paneid":"p1-1",
   "xlation":["Hôm nay trời đẹp.","Chúng ta đang  dự định đi đồi xanh.","Đi thôi nào!"],
   "words":[[["It's","Nó là "],["a","mạo từ"],["nice","đẹp, tốt"],["day","ngày"],["today.","hôm nay"]],[["We're","Chúng ta"],["planning","lên kế hoạch"],[" to go","đi"],["to","giới từ"],["Green","Xanh"],["Hill.","đồi"]],[["Let's","hãy"],["go!","đi"]]],
   "time":{"start":0,"stop":6.3}},
  {"paneid":"p1-2",
   "xlation":["Tôi phải mang cặp về nhà trước"],
   "words":[[["I","tôi"],["have to ","phải"],["take","mang"],["my","của tôi"],["bag","cặp"],["home","nhà"],["first.","trước"]]],
   "time":{"start":6.3,"stop":8.8}},
  {"paneid":"p1-3",
   "xlation":["Tôi về rồi.","Tôi đi đây"],
   "words":[[["I'm","tôi"],["home!","nhà"]],[["I'm","Tôi"],["leaving.","rời khỏi"]]],
   "time":{"start":8.8,"stop":11.5}},
  {"paneid":"p1-4",
   "xlation":["Bạn lúc nào cũng ra ngoài chơi!","Kể từ bây giờ, bạn sẽ ở nhà và học bài!"],
   "words":[[["You're","bạn"],["always","luôn luôn"],["out","ngoài"],["playing!","chơi"]],[["From now on","từ bây giờ"],["you'll","bạn sẽ"],["stay","ở"],["home","nhà"],["and","và"],["study!","học!"]]],
   "time":{"start":11.5,"stop":16.8}}],
 [{"paneid":"p2-1",
   "xlation":["Anh ấy không ở đây"],
   "words":[[["He's","anh ấy"],["not","không"],["here.","ở đây"]]],
   "time":{"start":16.8,"stop":20.5}},
  {"paneid":"p2-2",
   "xlation":["Chán thật.","Họ đang đợi tôi"],
   "words":[[["How annoying.","Chán thật"]],[["They're","Họ "],["all","tất cả"],["waiting","đang đợi"],["for","giới từ"],["me.","tôi"]]],
   "time":{"start":20.5,"stop":24.4}},
  {"paneid":"p2-3",
   "xlation":["Tôi nên đi thì tốt hơn"],
   "words":[[["I","tôi"],["better","tốt hơn"],["go","đi"],["then.","sau đó"]]],
   "time":{"start":24.4,"stop":26.3}},
  {"paneid":"p2-4",
   "xlation":["Đừng nghĩ tới việc ra khỏi phòng này."],
   "words":[[["Don't","đừng"],["even","thậm chí"],["think","nghĩ"],["about","về"],["leaving","rời khỏi"],["this","này"],["room.","phòng"]]],
   "time":{"start":26.3,"stop":29.6}},
  {"paneid":"p2-5",
   "xlation":["Cái gì đây?"],
   "words":[[["What's","cái gì"],["this?","cái này"]]],
   "time":{"start":29.6,"stop":33.5}}],
 [{"paneid":"p3-1",
   "xlation":["Nhột quá"],
   "words":[[["That tickles.","Nhột quá"]]],
   "time":{"start":33.5,"stop":36.3}},
  {"paneid":"p3-2",
   "xlation":["Bạn đã phá huỷ cuộc hẹn của tôi và Mii-chan"],
   "words":[[["You","bạn"],["ruined","phá huỷ"],["my","của tôi"],["date","cuộc hẹn"],["with","giới từ"],["Mii-chan.","Mii-chan."]]],
   "time":{"start":36.3,"stop":38.9}},
  {"paneid":"p3-3",
   "xlation":["Đây là đám mây du lịch"],
   "words":[[["This","đây"],["is","to be"],["a","mạo từ"],["\"traveling half cloud\"","đám mây du lịch"]]],
   "time":{"start":38.9,"stop":42.3}},
  {"paneid":"p3-4",
   "xlation":["bên trong cái này"],
   "words":[[["Inside ","bên trong "],["of","của"],["this,","cái này"]]],
   "time":{"start":42.3,"stop":44}},
  {"paneid":"p3-5",
   "xlation":["Chúng ta sẽ đặt hạt giống mây"],
   "words":[[["We'll","chúng ta sẽ"],["put","đặt"],["cloud","mây"],["seeds...","hạt giống"]]],
   "time":{"start":44,"stop":46.1}},
  {"paneid":"p3-6",
   "xlation":["Và nó sẽ lớn lên"],
   "words":[[["And","và"],["one","thay thế cho \"seed\""],["will","sẽ"],["grow.","lớn lên"]]],
   "time":{"start":46.1,"stop":47.9}},
  {"paneid":"p3-7",
   "xlation":["Chia làm hai"],
   "words":[[["Split","chia làm hai"],["it.","nó"]]],
   "time":{"start":47.9,"stop":49}},
  {"paneid":"p3-8",
   "xlation":["Nếu bạn cho đầu mình vào cái này..."],
   "words":[[["If","nếu"],["you","bạn"],["put","đặt, để"],["your","của bạn"],["head","cái đầu"],["in","trong"],["this one...","cái này..."]]],
   "time":{"start":49,"stop":51.8}}],
 [{"paneid":"p4-1",
   "xlation":["Nó sẽ xuất hiện ở trên này"],
   "words":[[["It","nó"],["will","sẽ"],["appear","xuất hiện"],["on","trên"],["this one.","cái này"]]],
   "time":{"start":51.8,"stop":54}},
  {"paneid":"p4-2",
   "xlation":["Bạn có thể đi bất cứ đâu với chỉ cái đầu."],
   "words":[[["You","bạn"],["can","có thể"],["go","đi"],["anywhere","bất kì nơi nào"],["with","với"],["just","chỉ"],["a head.","cái đầu"]]],
   "time":{"start":54,"stop":56.7}},
  {"paneid":"p4-3",
   "xlation":["Chân của bạn sẽ ở lại đó."],
   "words":[[["Your","của bạn"],["legs","chân"],["stay","ở lại"],["there.","đó"]]],
   "time":{"start":56.7,"stop":58.6}},
  {"paneid":"p4-4",
   "xlation":["Để về nhà, cúi đầu bạn xuống...","Và nó sẽ xuất hiện ở đây"],
   "words":[[["To come","để về"],["home,","nhà"],["duck","cúi"],["your","của bạn"],["head...","cái đầu"]],[["And","và"],["it","nó"],["will","sẽ"],["appear","xuất hiện"],["here.","ở đây"]]],
   "time":{"start":58.6,"stop":63.3}},
  {"paneid":"p4-5",
   "xlation":["Với cái này, Tôi có thể đi đến đồi xanh rồi.","Đúng thế, đi nào."],
   "words":[[["With","với"],["this,","cái này"],["I","tôi"],["can","có thể"],["go","đi"],["to","giới từ"],["Green","xanh"],["Hill.","đồi"]],[["Yeah,","Yeah,"],["so","vậy thì"],["let's","hãy"],["go.","đi"]]],
   "time":{"start":63.3,"stop":68.6}},
  {"paneid":"p4-6",
   "xlation":["Bạn tốt hơn hết hãy ở nhà và gọi tôi về nếu mẹ gọi tôi .","Cái gì?"],
   "words":[[["You'd","bạn"],["better","tốt hơn"],["stay","ở"],["home","nhà"],["and","và"],["call","gọi"],["me","tôi"],["if","nếu"],["Mama","mẹ"],["calls","gọi"],["me.","tôi"]],[["What?","cái gì"]]],
   "time":{"start":68.6,"stop":73.2}},
  {"paneid":"p4-7",
   "xlation":["Như vậy thật lén lút.","Tôi đi đây!"],
   "words":[[["That's","Điều đó"],["sneaky.","lén lút"]],[["I'm","tôi"],["going!","đi"]]],
   "time":{"start":73.2,"stop":76.4}},
  {"paneid":"p4-8",
   "xlation":["Bạn không thể đi!"],
   "words":[[["You","bạn"],["can't","không thể"],["go!","đi"]]],
   "time":{"start":76.4,"stop":78}}],
 [{"paneid":"p5-1",
   "xlation":["Anh ấy sẽ phải ăn đòn!"],
   "words":[[["He's","anh ấy"],["going ","sẽ"],[" to get","nhận"],["it!","nó"]]],
   "time":{"start":78,"stop":79.8}},
  {"paneid":"p5-2",
   "xlation":["Mẹ đang lên đấy!"],
   "words":[[["Mama's","mẹ"],["coming!","đang đến"]]],
   "time":{"start":79.8,"stop":81.3}},
  {"paneid":"p5-3",
   "xlation":["Tôi ở đây"],
   "words":[[["I'm","tôi"],["right here","ở ngay đây"]]],
   "time":{"start":81.3,"stop":82.8}},
  {"paneid":"p5-4",
   "xlation":["Thật kì lạ"],
   "words":[[["That's","điều này"],["weird.","kì lạ"]]],
   "time":{"start":82.8,"stop":84.4}},
  {"paneid":"p5-5",
   "xlation":["Đám mây nhanh như tên lửa"],
   "words":[[["This","này"],["cloud","đám mây"],["is","to be"],["as fast as","nhanh như"],["a jet.","tên lửa"]]],
   "time":{"start":84.4,"stop":86.6}}],
 [{"paneid":"p6-1",
   "xlation":["Thật sự là nên bay trên trời."],
   "words":[[["It's","nó"],["better","tốt hơn"],["to fly","bay"],["in the air","trên trời"],["actually","thật sự"]]],
   "time":{"start":86.6,"stop":89.6}},
  {"paneid":"p6-2",
   "xlation":["Chúng ta đi bộ lâu quá.","Tôi mệt hết hơi rồi.","Chúng ta gần tới rồi"],
   "words":[[["We've","chúng ta"],["been","to be"],["walking","đi"],["for ages.","lâu"]],[["I'm","tôi"],["out of breath.","mệt hết hơi"]],[["We're","chúng ta"],["almost","gần"],["there.","ở đó"]]],
   "time":{"start":89.6,"stop":96.4}},
  {"paneid":"p6-3",
   "xlation":["Chân của bạn đâu?.","Ở nhà rồi"],
   "words":[[["Where's","ở đâu"],["your","của bạn"],["legs?","chân"]],[["At","tại"],["home.","nhà"]]],
   "time":{"start":96.4,"stop":99.2}},
  {"paneid":"p6-4",
   "xlation":["Mặc dù chỉ còn cái đầu, tôi vẫn có thể chơi"],
   "words":[[["Even though","mặc dù"],["I'm","tôi là"],["only","chỉ"],["a head,","cái đầu"],["I","tôi"],["can","có thể"],["still","vẫn"],["play.","chơi"]]],
   "time":{"start":99.2,"stop":102.4}}],
 [{"paneid":"p7-1",
   "xlation":["Cố lên nào các cậu.","Chúng ta săp tới đỉnh rồi."],
   "words":[[["Come on","Cố lên "],["everyone.","mọi người"]],[["We're","Chúng ta"],["almost","gàn như"],["at","ở"],[" the top.","đỉnh"]]],
   "time":{"start":102.4,"stop":105.5}},
  {"paneid":"p7-2",
   "xlation":["Hoan hô!","Chúng ta tới nơi rồi!","Phong cảnh thật đẹp"],
   "words":[[["Yay!","hoan hô!"]],[["We're","Chúng ta"],["here!","ở đây"]],[["What","Thật là"],["a","mạo từ"],["beautiful","đẹp"],["view.","cảnh"]]],
   "time":{"start":105.5,"stop":109.7}},
  {"paneid":"p7-3",
   "xlation":["Tôi khát nước.","Chúng ta đáng lẽ nên mang nước"],
   "words":[[["I'm","tôi"],["thirsty","khát nước"],["now.","bây giờ"]],[["We","chúng ta"],["should have ","đáng lẽ nên"],["brought","mang"],["some","một vài"],["drinks.","đồ uống"]]],
   "time":{"start":109.7,"stop":113.7}},
  {"paneid":"p7-4",
   "xlation":["Đợi một chút"],
   "words":[[["Wait a minute","đợi một chút"]]],
   "time":{"start":113.7,"stop":115}},
  {"paneid":"p7-5",
   "xlation":["Chào mừng trở về nhà"],
   "words":[[["Welcome","chào mừng"],["home.","nhà"]]],
   "time":{"start":115,"stop":116.1}},
  {"paneid":"p7-6",
   "xlation":["Tôi lại đi đây"],
   "words":[[["I'm","tôi"],["leaving","rời khỏi"],["again.","lại"]]],
   "time":{"start":116.1,"stop":117.5}}],
 [{"paneid":"p8-1",
   "xlation":["Cảm ơn vì đã đợi.","Thật tiện lợi"],
   "words":[[["Thanks","cảm ơn"],["for","giới từ"],["waiting."," đợi"]],[["That's so handy","Thật tiện lợi"]]],
   "time":{"start":117.5,"stop":120.8}},
  {"paneid":"p8-2",
   "xlation":["Cởi giày ra dễ chịu lắm.","Cậu nói đúng thật.","Đất ở đây mềm quá.","Giống như tấm thảm vậy"],
   "words":[[["It","nó"],["feels","cảm thấy"],["so","rất"],["good","tốt"],["if","nếu"],["you","bạn"],["take off","cởi"],["your","của bạn"],["shoes.","giày"]],[["You're","bạn"],["right.","đúng"]],[["The grounds","mặt đất"],["so","rất"],["soft.","mềm"]],[["It's","Nó"],["like","giống như"],["a carpet.","tấm thảm"]]],
   "time":{"start":120.8,"stop":129.1}},
  {"paneid":"p8-3",
   "xlation":["Tôi cũng vậy"],
   "words":[[["Me too!","tôi cũng vậy"]]],
   "time":{"start":129.1,"stop":130.7}},
  {"paneid":"p8-4",
   "xlation":["Bây giờ chân của anh ấy mất tiêu rồi."],
   "words":[[["Now","bây giờ"],["even","thậm chí"],["his","của anh ấy"],["legs","chân"],["are","to be"],["gone.","biến mất"]]],
   "time":{"start":130.7,"stop":133.2}},
  {"paneid":"p8-5",
   "xlation":["Bạn đang giúp anh ấy!"],
   "words":[[["You're","bạn"],["helping","đang giúp"],["him!","anh ấy"]]],
   "time":{"start":133.2,"stop":134.7}},
  {"paneid":"p8-6",
   "xlation":["Đám mây gì đây?","Ném nó ra!","Ah, đó là"],
   "words":[[["What's","cái gì"],["with","giới từ"],["this","này"],["cloud?","đám mây"]],[["Throw it away!","ném nó đi"]],[["Ah,","ah"],["that's...","đó là"]]],
   "time":{"start":134.7,"stop":139.1}}],
 [{"paneid":"p9-1",
   "xlation":["Gió đẩy nó đi rồi.","Liệu nó có dừng lại  không?"],
   "words":[[["The wind","Gió"],["carried it off.","mang nó đi"]],[["Will","sẽ"],["it","nó"],["stop?","dừng?"]]],
   "time":{"start":139.1,"stop":142.6}},
  {"paneid":"p9-2",
   "xlation":["Trời tối rồi.","Chúng ta nên về thôi."],
   "words":[[["It's","Trời"],["getting","đang"],["dark.","tối"]],[["We","chúng ta"],["should","nên"],["go","đi"],["home","nhà"],["now.","bây giờ"]]],
   "time":{"start":142.6,"stop":145.7}},
  {"paneid":"p9-3",
   "xlation":["Tôi không cần đi bộ, tôi có thể bay về."],
   "words":[[["I","tôi"],["don't","không"],["need","cần"],[" to walk","đi"],["home,","nhà"],["I","tôi"],["can","có thể"],["fly","bay"],["back.","trở lại"]]],
   "time":{"start":145.7,"stop":148.8}},
  {"paneid":"p9-4",
   "xlation":["Hẹn gặp lại!"],
   "words":[[["See you!","hạn gặp lại"]]],
   "time":{"start":148.8,"stop":150}}]];

MeoU.glosses[MeoU.DORAPLUS1CH6] = [[
  {"paneid":"p1-1",
   "xlation":["Đủ rồi đấy!"],
   "words":[[["I've","Tôi"],["had","có"],["enough","đủ"],["with","với "],["you","bạn"],["all!","tất cả"]]],
   "time":{"start":0,"stop":2.5}},
  {"paneid":"p1-2",
   "xlation":["Phù, đáng sợ quá.","Thật là hung bạo"],
   "words":[[["Phew,","Phù,"],["that","điều đó"],["was","to be"],["scary.","đáng sợ"]],[["How brutal","Thật là hung bạo"]]],
   "time":{"start":2.5,"stop":6.3}},
  {"paneid":"p1-3",
   "xlation":["Bất cứ khi nào Giant đến công viên thì chúng ta đều không chơi được"],
   "words":[[["Anytime","bất kì khi nào"],["Giant","Giant"],["comes","đến"],["to","giới từ"],[" the park,","công viên"],["we","chúng ta"],["will","sẽ"],["never","không bao giờ"],["be","to be"],["able to","có thể"],["play!","chơi"]]],
   "time":{"start":6.3,"stop":11.3}},
  {"paneid":"p1-4",
   "xlation":["Nhưng chúng ta không có ai khoẻ mạnh để trả đũa cả."],
   "words":[[["But,","nhưng"],["we","chúng ta"],["don't","không"],["have","có"],["strong","mạnh mẽ"],["friends","những người bạn"],["to","giới từ"],["help","giúp đỡ"],["us","chúng tôi"],["avenge","báo thù"],["him.","anh ấy"]]],
   "time":{"start":11.3,"stop":15.4}},
  {"paneid":"p1-5",
   "xlation":["Vậy bạn muốn anh ấy cứ làm những gì anh ấy thích mà không quan tâm đến cảm xúc của chúng ta ah?","Đành chịu thôi.","Anh ấy khoẻ lắm."],
   "words":[[["So","vì thế"],["you","bạn"],["want","muốn"],["him","anh ấy"],["to","giới từ"],["keep","duy trì"],["doing","làm"],["what","cái gì"],["he","anh ấy"],["likes","thích"],["without","không có"],["considering","xem xét"],["our","của chúng ta"],["feelings?","cảm xúc"]],[["Can't be helped","Đành chịu thôi"]],[["He's","anh ấy"],["so","rất"],["strong.","khoẻ"]]],
   "time":{"start":15.4,"stop":23.2}}],
 [{"paneid":"p2-1",
   "xlation":["Nếu chúng ta đánh anh ấy một mình thì thua là cái chắc"],
   "words":[[["If","nếu"],["we're","chúng ta"],["fighting","đánh"],["him","anh ấy"],["alone","một mình"],["we","chúng ta"],["will","sẽ"],["surely","một cách chắc chắn"],["be","to be"],["defeated.","bị đánh bại"]]],
   "time":{"start":23.2,"stop":27.4}},
  {"paneid":"p2-2",
   "xlation":["Đúng rồi!, Từ nay chúng ta hãy cùng tẩy chay Giant"],
   "words":[[["That's it!","đúng rồi"]],[["Everyone,","mọi người"],["let's","hãy"],["all","tất cả"],["ignore","làm ngơ"],["Giant","Giant"],["from now on?","kể từ bây giờ"]]],
   "time":{"start":27.4,"stop":31.6}},
  {"paneid":"p2-3",
   "xlation":["Chúng ôi hứa rằng sẽ coi Giant như kẻ thù!"],
   "words":[[["We","chúng ta"],["promise","hứa"],["to","giới từ"],["make","khiến"],["Giant","Giant"],["our","của chúng ta"],["enemy!","kẻ thù!"]]],
   "time":{"start":31.6,"stop":34.7}},
  {"paneid":"p2-4",
   "xlation":["Chúng ta sẽ dạy anh ấy một bài học!","Đúng!","Ai sợ anh ấy chứ!"],
   "words":[[["We'll","chúng ta sẽ"],["teach","dạy"],["him","anh ấy"],["a lesson!","một bài học"]],[["Right!","đúng!"]],[["Who","ai"],["is","to be"],["afraid","e sợ"],["of","giới từ"],["him!","anh ấy"]]],
   "time":{"start":34.7,"stop":38.5}},
  {"paneid":"p2-5",
   "xlation":["Bạn đang nói về tôi à?"],
   "words":[[["Are","to be"],["you","bạn"],["talking","đang nói"],["about","về"],["me?","tôi"]]],
   "time":{"start":38.5,"stop":41.1}},
  {"paneid":"p2-6",
   "xlation":["Đùn rồi.","Chúng tôi nói rằng Giant là muốn người tốt và rất khoẻ mạnh"],
   "words":[[["Yes.","vâng"]],[["We","chúng tôi"],["said","nói"],["that","rằng"],["Giant","Giant"],["was","to be"],["a","mạo từ"],["good","tốt"],["person.","người"]],[["And","và"],["strong","mạnh khoẻ"],["indeed.","thật sự"]]],
   "time":{"start":41.1,"stop":46.2}},
  {"paneid":"p2-7",
   "xlation":["Tốt.","Bây giờ bạn có thể đi chợ dùm tôi."],
   "words":[[["Good.","tốt"]],[["You","bạn"],["can","có thể"],["go","đi"],["shopping","mua sắm"],["for","cho"],["me","tôi"],["now.","bây giờ"]]],
   "time":{"start":46.2,"stop":49}},
  {"paneid":"p2-8",
   "xlation":["Chúng ta sẽ gặp lại nhau ở đây.","Tuân lệnh"],
   "words":[[["We'll","chúng ta sẽ"],["be","to be"],["meeting","gặp"],["again","lại"],["here.","ở đây"]],[["Yes,","vâng"],["sir.","ngài"]]],
   "time":{"start":49,"stop":52.3}},
  {"paneid":"p2-9",
   "xlation":["Anh ấy là kẻ thù, anh ấy là kẻ thù..."],
   "words":[[["He's","anh ấy"],["my","của tôi"],["enemy,","kẻ thù"],["he's","anh ấy"],["my","của tôi"],["enemy...","kẻ thù..."]]],
   "time":{"start":52.3,"stop":54.5}},
  {"paneid":"p2-10",
   "xlation":["\"Anh ấy\" là ai?","Waaa, làm ơn tha cho tôi"],
   "words":[[["Who","ai"],["is","là"],["this","này"],["\"he\"?","anh ấy"]],[["Waa,","Waa,"],["please","làm ơn"],["forgive","tha thứ"],["me.","tôi"]]],
   "time":{"start":54.5,"stop":59}}],
 [{"paneid":"p3-1",
   "xlation":["Đó là sáng kiến của Nobita.","ANh ấy đã nói cái gì?"],
   "words":[[["It","nó"],["was","to be"],["Nobita's","của Nobita"],["idea.","ý tưởng"]],[["What","cái gì"],["did","trợ động từ"],["he","anh ấy"],["say?","nói"]]],
   "time":{"start":59,"stop":62.5}},
  {"paneid":"p3-2",
   "xlation":["Cái gi?","Anh ấy bảo tôi xấu xa ư?"],
   "words":[[["What?","cái gì"]],[["He","anh ấy"],["refers","ám chỉ"],["to","giới từ"],["me","tôi"],["as","như là"],["a","mạo từ"],["bad","tệ"],["guy?","chàng trai"]]],
   "time":{"start":62.5,"stop":65.8}},
  {"paneid":"p3-3",
   "xlation":["Nobita!","Đợi đó!","Tôi không muốn đến gần kẻ thù"],
   "words":[[["Nobita!","Nobita"]],[["Wait!","đợi"]],[["I","tôi"],["don't","không"],["want","muốn"],["to","giới từ"],["get close to","đến gần"],["my","của tôi"],["enemy.","kẻ thù"]]],
   "time":{"start":65.8,"stop":70.4}},
  {"paneid":"p3-4",
   "xlation":["Vậy là mọi người đã phản bội bạn?"],
   "words":[[["So","như vậy"],["everyone","mọi người"],[" has betrayed","đã phản bội"],["you?","bạn"]]],
   "time":{"start":70.4,"stop":72.8}},
  {"paneid":"p3-5",
   "xlation":["Không thể tha thứ được!","Tôi sẽ sử dụng nó"],
   "words":[[["Unforgivable!","không thể tha thứ được"]],[["I","tôi"],["will","sẽ"],["use","sử dụng"],["it.","nó"]]],
   "time":{"start":72.8,"stop":75.4}},
  {"paneid":"p3-6",
   "xlation":["Sô cô la đoàn kết"],
   "words":[[["A","mạo từ"],["friendship","tình bạn"],["chocolate.","Sô cô la"]]],
   "time":{"start":75.4,"stop":76.9}},
  {"paneid":"p3-7",
   "xlation":["Bất kì ai ăn nó sẽ là đồng minh của bạn"],
   "words":[[["Anyone","bất kì ai"],["who","mà"],["eats","ăn"],["this","cái này"],["will","sẽ"],["be","to be"],["your","của bạn"],["ally.","đồng minh"]]],
   "time":{"start":76.9,"stop":79.8}}],
 [{"paneid":"p4-1",
   "xlation":["Bạn phải là người đầu tiên ăn sô cô la này"],
   "words":[[["You","bạn"],["have to","phải"],["be","to be"],["the","mạo từ"],["first","đầu tiên"],["person","người"],["who","người"],["eats","ăn"],["this","này"],["chocolate.","sô cô la"]]],
   "time":{"start":79.8,"stop":83}},
  {"paneid":"p4-2",
   "xlation":["Mặc dù bạn tốt bụng cho tôi sô cô la nhưng tôi không đền đáp lại gì đâu "],
   "words":[[["Even though","mặc dù"],["you're","bạn"],["being","to be"],["nice"," tốt"],["and","và"],["giving","cho"],["me","tôi"],["this","này"],["chocolate...","sô cô la"]],[["I","tôi"],["will","sẽ"],["give","đưa"],["you","bạn"],["nothing","không có gì"],["in return","đáp lại"]]],
   "time":{"start":83,"stop":88}},
  {"paneid":"p4-3",
   "xlation":["Tại sao Nobita lại cho tụi mình sô cô la?","Thiệt lạ.","Họ sẽ trờ thành đồng minh của mình"],
   "words":[[["Why","tại sao"],["did","trợ động từ"],["Nobita","Nobita"],["give","cho"],["us","chúng tôi"],["chocolate?","sô cô la"]],[["It's","nó"],["unusual.","bất thường"]],[["They'll","họ sẽ"],["become","trở thành"],["my","của tôi"],["allies!","đồng minh"]]],
   "time":{"start":88,"stop":94}},
  {"paneid":"p4-4",
   "xlation":["Kể từ bây giờ, mọi người sẽ đối xử với Giant như kẻ thù"],
   "words":[[["From now on","kể từ"],["everyone","mọi người"],["will","sẽ"],["treat","đối xử"],["Giant","Giant"],["as","như là"],["the enemy!","kẻ thù!"]]],
   "time":{"start":94,"stop":97.5}},
  {"paneid":"p4-5",
   "xlation":["Sao chúng ta phải đi làm việc vặt cho Giant?","Anh ấy không phải là vui!"],
   "words":[[["How","Làm sao"],["could","có thể"],["Giant","Giant"],["asked","yêu cầu"],["us","chúng tôi"],["to do","làm"],["his","của anh ấy"],["errand?","việc lặt vặt"]],[["He's","anh ấy"],["not","không"],["a king!","vua!"]]],
   "time":{"start":97.5,"stop":101.7}},
  {"paneid":"p4-6",
   "xlation":["Xin lỗi vì những rắc rối"],
   "words":[[["Sorry","XIn lỗi"],["for","giới từ"],["the trouble","rắc rối"]]],
   "time":{"start":101.7,"stop":103.2}}],
 [{"paneid":"p5-1",
   "xlation":["Họ đi đâu rồi?"],
   "words":[[["Where","nơi nào"],["are","to be"],["they","họ"],["going?","đi?"]]],
   "time":{"start":103.2,"stop":104.4}},
  {"paneid":"p5-2",
   "xlation":["Không phải chuyện của tôi"],
   "words":[[["It's","nó là"],["none","không"],["of","giới từ"],["my","của tôi"],["business.","chuyện"]]],
   "time":{"start":104.4,"stop":106.1}},
  {"paneid":"p5-3",
   "xlation":["Mọi người ơi.","Sô cô la ngon lắm!"],
   "words":[[["Here","ở đây"],["everyone.","mọi người"]],[["Let","hãy để"],["me","tôi"],["give","đưa"],["you","bạn"],["some","một vài"],["delicious","ngon"],["chocolate.","sô cô la"]]],
   "time":{"start":106.1,"stop":110.1}}],
 [{"paneid":"p6-1",
   "xlation":["Thật là một kẻ ngốc"],
   "words":[[["What an idiot","thật là một kẻ ngốc"]]],
   "time":{"start":110.1,"stop":111.3}},
  {"paneid":"p6-2",
   "xlation":["Vì mọi người là đồng minh của tôi...Tôi có thể an toàn ở bất cứ đâu."],
   "words":[[["Since","vì"],["everyone","mọi người"],["is","to be"],["my","của tôi"],["comrade...","đồng minh"]],[["I","tôi"],["can","có thể"],["have","có"],["peace","bình yên"],["anywhere","bất kì đâu"],["I'm","tôi"],["going","đi"],["now.","bây giờ"]]],
   "time":{"start":111.3,"stop":116.6}},
  {"paneid":"p6-3",
   "xlation":["Tôi nghĩ bạn vừa phạm phải sai lầm giống như Giant đã làm.","Rồi cậu sẽ cảm thấy tồi tệ.","Bạn nghĩ vậy sao, Shizu-chan."],
   "words":[[["I","tôi"],["think","nghĩ"],["you","bạn"],["just","vừa mới"],["made","làm"],["a","mạo từ"],["big","lớn"],["mistake","lỗi"],["like","như"],["Giant","Giant"],["did.","đã làm"]],[["It","nó"],["will","sẽ"],["make","khiến"],["you","bạn"],["feel","cảm thấy"],["bad","tệ"],["eventually.","cuối cùng"]],[["Do","trợ động từ"],["you","bạn"],["think","nghĩ"],["so?","vậy?"]],[["Shizu-chan.","Shizu-chan."]]],
   "time":{"start":116.6,"stop":125.6}},
  {"paneid":"p6-4",
   "xlation":["Mọi người đang làm gì ở đây vậy?","Chúng tôi không biết, đột nhiên chúng tôi muốn gặp Shizu-chan."],
   "words":[[["What's","cái gì"],["everyone","mọi người"],["doing","đang làm"],["here?","ở đây"]],[["We","chúng ta"],["don't","không"],["know.","biết"]],[["We","chúng ta"],["wanted","muốn"],["to","giới từ"],["visit","thăm"],["Shizu-chan","Shizu-chan"],["all of a sudden","đột nhiên"]]],
   "time":{"start":125.6,"stop":131.9}},
  {"paneid":"p6-5",
   "xlation":["Đúng rồi!","Mọi người đều có cảm xúc giống tôi"],
   "words":[[["That's right","Đúng rồi"],["Everyone","mọi người"],["is","to be"],["sharing","chia sẽ"],["the","mạo từ"],["same","giống nhau"],["feelings","cảm xúc"],["as","như"],["me.","tôi"]]],
   "time":{"start":131.9,"stop":135.9}},
  {"paneid":"p6-6",
   "xlation":["Có vẻ như rất nhiều người đang đến nhà của tôi"],
   "words":[[["Looks like","có vẻ như"],["a lot of","nhiều"],["people","con người"],["are","to be"],["coming","đang đến"],["to","giới từ"],["my","của tôi"],["house.","ngôi nhà"]]],
   "time":{"start":135.9,"stop":138.8}},
  {"paneid":"p6-7",
   "xlation":["Chắc hẳn là những người vừa rồi.","Hy vọng là về nhà thì họ cũng làm theo"],
   "words":[[["It","nó"],["must","chắc hẳn là "],["be","to be"],["the ones","những người"],["from earlier","lúc nãy"],["I","tôi"],["hope","hy vọng"],["everyone","mọi người"],["will","sẽ"],["go","đi"],["home","nhà"],["as","như"],["I","tôi"],["do.","làm"]]],
   "time":{"start":138.8,"stop":143.9}}],
 [{"paneid":"p7-1",
   "xlation":["Đừng lo lắng nhiều quá.","Mọi người sẽ trở lại bình thường vào ngày mai.","May quá"],
   "words":[[["Don't","đừng"],["worry","lo lắng"],["too","quá"],["much.","nhiều"]],[["Everyone","mọi người"],["will","sẽ"],["return","quay lại"],["to","giới từ"],["normal","bình thường"],["by","vào"],["morning.","buổi sáng"]],[["Glad to hear","May quá"]]],
   "time":{"start":143.9,"stop":150}},
  {"paneid":"p7-2",
   "xlation":["Tôi sẽ chợp mắt trước khi ăn tối"],
   "words":[[["I","tôi"],["will","sẽ"],["take a nap","chợp mắt"],["before","trước"],["dinner","buổi ăn tối"],["time.","giờ"]]],
   "time":{"start":150,"stop":152.3}},
  {"paneid":"p7-3",
   "xlation":["Muộn quá rồi mà vẫn chưa có cơm tối"],
   "words":[[["It's","nó"],["way"," nhấn mạnh too late"],["too","quá"],["late","trễ"],["for","cho"],["dinner.","bữa tối"]]],
   "time":{"start":152.3,"stop":154.2}},
  {"paneid":"p7-4",
   "xlation":["Mẹ chắc là cũng ăn sô cô la đó rồi"],
   "words":[[["Mama","mẹ"],["must","hẳn là"],["also","cũng"],[" have eaten","đã ăn"],["that","đó"],["chocolate.","sô cô la"]]],
   "time":{"start":154.2,"stop":157}}]];

MeoU.glosses[MeoU.DORAPLUS1CH7] = [[
  {"paneid":"p1-1",
   "xlation":["Đây chắc chắc là một kỉ lục mới.","Có một học sinh luôn bị điểm không bài kiểm tra.","Quên làm bài tập, ngủ gật trong lớp và đi trễ.","Ngay cả thầy cũng chịu thua em rồi"],
   "words":[[["This","Đây"],["is","to be"],["surely","một cách chắc chắn"],["a","mạo từ"],["new","mới"],["record.","kỉ lục"]],[["To","giới từ"],["have","có"],["a student","học sinh"],["who","người"],["always","luôn luôn"],["gets","đạt được"],["a","mạo từ"],["0","điểm không"],["on","trên"],["his","của anh ấy"],["test","bài kiểm tra"],["that","mà"],["is.","to be"]],[["Forgetting","quên"],["his","của anh ấy"],["homework,","bài tập về nhà"],["sleeping","ngủ"],["during","trong khi"],["the lectures,","buổi học"],["and","và"],["coming","đến"],["late","trễ"],["to","giới từ"],["class.","lớp"]],[["Even","ngay cả"],["sensei","thầy giáo"],["gives up on ","từ bỏ"],["you.","bạn"]]],
   "time":{"start":0,"stop":14.6}},
  {"paneid":"p1-2",
   "xlation":["Bạn có thể về"],
   "words":[[["You","bạn"],["may","có thể"],["be","to be"],["dismissed.","ra  về"]]],
   "time":{"start":14.6,"stop":17.1}},
  {"paneid":"p1-3",
   "xlation":["Kỉ lục mới?","Tuyệt quá nhỉ?"],
   "words":[[["A","mạo từ"],["new","mới"],["record?","kỉ lục"]],[["Isn't","phải không"],["it","nó"],["amazing?","tuyệt vời"]]],
   "time":{"start":17.1,"stop":20.4}},
  {"paneid":"p1-4",
   "xlation":["Nếu mẹ của bạn nghe được thì phản ứng của bác ấy sẽ ra sao?","Tôi rất nóng lòng muốn xem.","Không phải chuyện của cậu"],
   "words":[[["If","nếu"],["your","của bạn"],["mother","mẹ"],["heard","nghe"],["about","về"],["this,","điều này"],["what","cái gì"],["would","sẽ"],["her","của cô ấy"],["reaction","phản ứng"],["be?","to be"]],[["I'd","tôi"],["be","to be"],["delighted","vui"],["to","giới từ"],["see","thấy"],["it.","nó"]],[["It's","nó"],["none of your business!","không phải chuyện của bạn"]]],
   "time":{"start":20.4,"stop":28}}],
 [{"paneid":"p2-1",
   "xlation":["Nhưng mà thật sự tôi lo lắng lắm.","Tôi nên làm gì?"],
   "words":[[["But","nhưng"],["actually","thật sự"],["I","tôi"],["do","trợ động từ"],["worry.","lo lắng"]],[["What","cái gì"],["should","nên"],["I","tôi"],["do?","làm"]]],
   "time":{"start":28,"stop":31.6}},
  {"paneid":"p2-2",
   "xlation":["Khi bạn về nhà, hãy nói \" tadaima\".","Tadaima..."],
   "words":[[["When","khi"],["you","bạn"],["come","đến"],["home","nhà"],["please","làm ơn"],["say","nói"],["\"tadaima\".","\"tadaima\"."]],[["Tadaima...","Tadaima..."]]],
   "time":{"start":31.6,"stop":35.7}},
  {"paneid":"p2-3",
   "xlation":["Doraemon không có ở đây.","Vào những lúc như thế này...","Anh ấy thật vô dụng"],
   "words":[[["Doraemon","Doraemon"],["isn't","không"],["here.","ở đây"]],[["At","tại"],["a time","thời gian"],["like","giống"],["this...","thế này"]],[["He's","anh ấy"],["so","rất"],["useless.","vô dụng"]]],
   "time":{"start":35.7,"stop":40.7}},
  {"paneid":"p2-4",
   "xlation":["Mặc dù mẹ đã quên bài kiểm tra rồi nhưng không sớm thì muộn mẹ sẽ nhớ thôi"],
   "words":[[["Even though","mặc dù"],["Mama","mẹ"],["forgot","quên"],["about","về"],["my","của tôi"],["test","bài kiểm tra"],["now,","bây giờ"],["she","cô ấy"],["will","sẽ"],["remember","nhớ"],["it","nó"],["sooner or later","không sớm thì muộn"]]],
   "time":{"start":40.7,"stop":46.4}},
  {"paneid":"p2-5",
   "xlation":["Đúng rồi"],
   "words":[[["That's right!","đúng rồi"]]],
   "time":{"start":46.4,"stop":47.5}},
  {"paneid":"p2-6",
   "xlation":["Mình sẽ sử dụng bút máy của bố để đổi điểm từ 0 thành 10"],
   "words":[[["Using","Sử dụng"],["Papa's","của bố"],["fountain pen","bút máy"],["I'll","tôi sẽ"],["change","thay đổi"],["my","của tôi"],["grade","điểm"],["from","từ"],["0","điểm không"],["to","đến"],["10","điểm 10"]]],
   "time":{"start":47.5,"stop":52.3}},
  {"paneid":"p2-7",
   "xlation":["Nó bị hết mực ư?"],
   "words":[[["Is","to be"],["it","nó"],["running out of","hết"],["ink?","mực?"]]],
   "time":{"start":52.3,"stop":54}}],
 [{"paneid":"p3-1",
   "xlation":["Oái!","Mình làm hỏng cây bút rồi."],
   "words":[[["Eek!","Oái!"]],[["I've","tôi"],["broken","làm hỏng"],[" the pen.","cây bút"]]],
   "time":{"start":54,"stop":56.3}},
  {"paneid":"p3-2",
   "xlation":["vâng, nhà Nobi đây.","Ah, Nobita?"],
   "words":[[["Yes,","vâng"],["Nobi's","của Nobi"],["residence.","nhà"]],[["Ah,","ah"],["Nobita?","nobita?"]]],
   "time":{"start":56.3,"stop":60.1}},
  {"paneid":"p3-3",
   "xlation":["Bạn đã nói cho mẹ biết chưa?","Rằng bạn đạt được kỉ lục mới đó."],
   "words":[[["Did","trợ động từ"],["you","bạn"],["tell","nói"],["your","của bạn"],["mother","mẹ"],["about","về"],["it?","nó"]],[["That","Rằng"],["you've","bạn"],["got","có"],["a","mạo từ"],["new","mới"],["record","kỉ lục"],["from","từ"],["Sensei.","thầy giáo"]]],
   "time":{"start":60.1,"stop":65.2}},
  {"paneid":"p3-4",
   "xlation":["Tôi đã nói đó không phai là chuyện của bạn!","Để tôi yên, được không?"],
   "words":[[["I","tôi"],["told","đã nói"],["you","bạn"],["it","nó"],["was","to be"],["none of your business.","không phải chuyện của bạn"]],[["Just","bây giờ"],["leave","để"],["me","tôi"],["alone,","một mình"],["would you?","được không?"]]],
   "time":{"start":65.2,"stop":69.7}},
  {"paneid":"p3-5",
   "xlation":["Tôi không thể làm vậy.","Đó là để tốt cho cậu thôi.","Cậu nên nói với mẹ thì hơn"],
   "words":[[["I","tôi"],["can't","không thể"],["do","làm"],["that.","điều đó"]],[["It's","nó"],["for your own good","tốt cho bạn"],["anyway.","dầu sao đi nữa"]],[["You","bạn"],["had better","tốt hơn hết"],["tell","nói với"],["her","cô ấy"],["sooner rather than later","sớm thì tốt hơn"]]],
   "time":{"start":69.7,"stop":76.4}},
  {"paneid":"p3-6",
   "xlation":["Nếu khó đến vậy, tớ sẵn lòng giúp cậu nói"],
   "words":[[["If","nếu"],["it's","nó"],["so","rất"],["hard","khó"],["for","cho"],["you","bạn"],["to","giới từ"],["tell","nói"],["her,","cô ấy"],["then","thì"],["I'll","tôi sẽ"],["be","to be"],["happy","hạnh phúc"],["to","giới từ"],["help","giúp đỡ"],["you.","bạn"]]],
   "time":{"start":76.4,"stop":80.4}},
  {"paneid":"p3-7",
   "xlation":["Ai vậy?"],
   "words":[[["Who","ai"],["was","to be"],["that?","đó"]]],
   "time":{"start":80.4,"stop":81.4}},
  {"paneid":"p3-8",
   "xlation":["Mẹ ơi, mẹ không muốn đi đâu ư?","Tôi đi rồi"],
   "words":[[["Mama,","mẹ"],["don't","không "],["you","bạn"],["want","muốn"],["to","giới từ"],["go","đi"],["somewhere?","nơi nào đó"]],[["I","tôi"],["already","rồi"],["did.","trợ động từ"]]],
   "time":{"start":81.4,"stop":85.6}}],
 [{"paneid":"p4-1",
   "xlation":["Nhưng bạn nên đi ra ngoài một lát.","Đi bất cứ đâu bạn thích.","Mua sắm, xem phim, cái gì cũng được"],
   "words":[[["But","nhưng"],["you","bạn"],["better","tốt hơn"],["leave","rời"],["home","nhà"],["for a while.","một lát"]],[["Go","đi"],["anywhere","bất kì nơi nào"],["you","bạn"],["like.","thích"]],[["Shopping,","mua sắm"],["watching","xem"],["movies,","phim"],["whatever.","bất kể cái gì"]]],
   "time":{"start":85.6,"stop":92.4}},
  {"paneid":"p4-2",
   "xlation":["Đừng nói những điều linh tinh như thế!"],
   "words":[[["Don't","đừng"],["say","nói"],["such","như thế"],["a","mạo từ"],["ridiculous","nực cười"],["thing!","thứ"]]],
   "time":{"start":92.4,"stop":96.6}},
  {"paneid":"p4-3",
   "xlation":["Thật là xấu tính!"],
   "words":[[["That's","Thật là"],["so","rất"],["mean!","xấu tính!"]]],
   "time":{"start":96.6,"stop":99}},
  {"paneid":"p4-4",
   "xlation":["Nhưng đó là lỗi của bạn, phải không?","Tôi hiểu, kể từ bây giờ tôi sẽ học chăm chỉ.","Làm ơn giúp tôi lần này thôi!"],
   "words":[[["But","nhưng"],["it","nó"],["was","to be"],["your","của bạn"],["fault,","lỗi"],["wasn't it?","phải không?"]],[["I","tôi"],["understand.","hiểu"]],[["I'll","tôi sẽ"],["study","học"],["hard","chăm chỉ"],["from now on","kể từ bây giờ"],["Just","chỉ"],["please","làm ơn"],["help","giúp đỡ"],["me","tôi"],["this","này"],["time!","lần!"]]],
   "time":{"start":99,"stop":106.8}},
  {"paneid":"p4-5",
   "xlation":[" Vậy thì tôi sẽ sử dụng nó"],
   "words":[[["I'll","tôi sẽ"],["have to ","phải"],["use","sử dụng"],["it,","nó"],["thẹn","vậy thì"]]],
   "time":{"start":106.8,"stop":108.6}},
  {"paneid":"p4-6",
   "xlation":["Chú chó giữ bí mật"],
   "words":[[["A","mạo từ"],["\"Secret","bí mật"],["Keeper","giữ"],["Dog\".","chó"]]],
   "time":{"start":108.6,"stop":110.4}}],
 [{"paneid":"p5-1",
   "xlation":["Nó được tạo ra để giữ bí mật của cậu mãi mãi.","Bây giờ, hãy viết bí mật của cậu ra giây"],
   "words":[[["He","anh ấy"],["was created","được tạo ra"],["to","giới từ"],["keep","giữ"],["your","của bạn"],["secret","bí mật"],["forever.","mãi mãi"]],[["Now,","bây giờ"],["write","viết"],["your","của bạn"],["secret","bí mật"],["on","trên"],["a","mạo từ"],["piece","mảnh"],["of","giới từ"],["paper.","giấy"]]],
   "time":{"start":110.4,"stop":116.8}},
  {"paneid":"p5-2",
   "xlation":["Kết quả bài kiểm tra.","Bút máy của bố"],
   "words":[[["My","của tôi"],["test","bài kiểm tra"],["result.","kết quả"]],[["Papa's","của Papa"],["fountain pen","bút máy"]]],
   "time":{"start":116.8,"stop":119.8}},
  {"paneid":"p5-3",
   "xlation":["Ăn nó"],
   "words":[[["Eat","ăn"],["it.","nó"]]],
   "time":{"start":119.8,"stop":120.8}},
  {"paneid":"p5-4",
   "xlation":["XIn chào, tôi muốn gặp mẹ của Nobita"],
   "words":[[["Good afternoon","chào buổi trưa"],["I'd","tôi"],["like","muốn"],["to","giới từ"],["meet","gặp"],["Nobita's","của nobita"],["mother.","mẹ"]]],
   "time":{"start":120.8,"stop":125}},
  {"paneid":"p5-5",
   "xlation":["Suneo tới rồi.","Vâng, ai vậy?"],
   "words":[[["Suneo","suneo"],["is","to be"],["here.","ở đây"]],[["Yes,","vâng"],["who","ai"],["is","to be"],["it?","nó?"]]],
   "time":{"start":125,"stop":130.4}}],
 [{"paneid":"p6-1",
   "xlation":["Cho hỏi...","có ai ở nhà không?"],
   "words":[[["Excuse me...","cho hỏi..."]],[["Is","to be"],["anyone","bất kì ai"],["home?","nhà"]]],
   "time":{"start":130.4,"stop":133.1}},
  {"paneid":"p6-2",
   "xlation":["Này Suneo.","Đi chơi bóng chày nào."],
   "words":[[["Hey,","này"],["Suneo.","suneo"]],[["We","chúng ta"],["are","to be"],["going to ","sắp"],["play","chơi"],["baseball","bóng chày"],["now.","bây giờ"]]],
   "time":{"start":133.1,"stop":136.7}},
  {"paneid":"p6-3",
   "xlation":["Nhưng tôi có việc quan trọng phải làm"],
   "words":[[["But","nhưng"],["I","tôi"],["have","có"],["something","vài thứ"],["important","quan trọng"],["to","trợ động từ"],["do.","trợ động từ"]]],
   "time":{"start":136.7,"stop":139.4}},
  {"paneid":"p6-4",
   "xlation":["Bạn không thể đơn giản là nó \" vâng, thưa ông\"?"],
   "words":[[["Can't","không thể"],["you","bạn"],["just","chỉ cần"],["simply","đơn giản"],["say","nói"],["\"yes, sir\"?","\"vâng, thưa ngài\"?"]]],
   "time":{"start":139.4,"stop":142.3}},
  {"paneid":"p6-5",
   "xlation":["Vâng, thưa ông"],
   "words":[[["Yes,","vâng"],["sir.","ngài"]]],
   "time":{"start":142.3,"stop":143.3}},
  {"paneid":"p6-6",
   "xlation":["Xin lỗi vi để bạn đợi"],
   "words":[[["Sorry","xin lỗi"],["for","vì"],["waiting.","đợi"]]],
   "time":{"start":143.3,"stop":144.7}},
  {"paneid":"p6-7",
   "xlation":["Cảm ơn bạn rất nhiều"],
   "words":[[["Thank you","cảm ơn"],["you","bạn"],["very","rất"],["much.","nhiều"]]],
   "time":{"start":144.7,"stop":146.1}},
  {"paneid":"p6-8",
   "xlation":["Đúng rồi"],
   "words":[[["That's right","đúng rồi"]]],
   "time":{"start":146.1,"stop":147.1}}],
 [{"paneid":"p7-1",
   "xlation":["Hôm nay Nobita sẽ được trả bài kiểm tra"],
   "words":[[["Nobita","nobita"],["is","to be"],["supposed","được cho rằng"],["to","giới từ"],["get","nhận được"],["his","của anh ấy"],["test","bài kiểm tra"],["back","lại"],["today.","hôm nay"]]],
   "time":{"start":147.1,"stop":150}},
  {"paneid":"p7-2",
   "xlation":["Đừng lo lắng"],
   "words":[[["Don't","đừng"],["worry.","lo lắng"]]],
   "time":{"start":150,"stop":151.5}},
  {"paneid":"p7-3",
   "xlation":["Mình vừa định làm gì nhỉ?"],
   "words":[[["What","cái gì"],["was","to be"],["I","tôi"],["going to ","dự định"],["do","làm"],["earlier?","trước?"]]],
   "time":{"start":151.5,"stop":155.6}},
  {"paneid":"p7-4",
   "xlation":["Thôi quên đi.","Cuối cùng cũng sẽ nhớ ra mà."],
   "words":[[["Just","c"],["forget","quên"],["it.","nó"]],[["I'll","tôi sẽ"],["remember","nhớ"],["it","nó"],["eventually.","cuối cùng"]]],
   "time":{"start":155.6,"stop":159}},
  {"paneid":"p7-5",
   "xlation":["Tôi nhẹ nhõm rồi.","Vậy thì tốt, vậy thì bây giờ cậu có thể bắt đầu học"],
   "words":[[["I'm","tôi"],["relieved","nhẹ nhõm"],["now!","bây giờ"]],[["That's","Vậy thì"],["good,","tốt"],["so","vậy"],["you","bạn"],["can","có thể"],["start","bắt đầu"],["studying.","học"]]],
   "time":{"start":159,"stop":163.7}},
  {"paneid":"p7-6",
   "xlation":["Thiệt phiền phức.","Tại sao tôi nên làm vậy chứ?"],
   "words":[[["What","Thật là"],["a burden.","gánh nặng"]],[["Why","tại sao"],["should","nên"],["I","tôi"],["do","làm"],["that?","điều này?"]]],
   "time":{"start":163.7,"stop":166.6}},
  {"paneid":"p7-7",
   "xlation":["Cậu phải biết dừng lại đi chứ!","Bí mật của tớ sẽ không bao giờ bị tiết lộ nữa.","Tôi chẳng quan tâm đến nó nữa"],
   "words":[[["You've","bạn"],["got to","phải"],["learn","học"],["how","như thế nào"],["to","trợ động từ"],["give up!","từ bỏ!"]],[["My","của tôi"],["secret","bí mật"],["can","có thể"],["never","không bao giờ"],[" be revealed","bị tiết lộ"],["now.","bây giờ"]],[["I","tôi"],["don't","không"],["even","thậm chí"],["care","quan tâm"],["about","về"],["it","nó"],["anymore.","chút nào nữa"]]],
   "time":{"start":166.6,"stop":174.3}}],
 [{"paneid":"p8-1",
   "xlation":["Bởi vì tôi đến nhà cậu mà  gặp Giant.","Bây giờ anh ấy bắt tôi chạy marathon cả ngày hôm nay"],
   "words":[[["Because","bởi vì"],["I","tôi"],["went","đi"],["to","giới từ"],["your","của bạn"],["house,","ngôi nhà"],["I","tôi"],["ran into","vô tình gặp"],["Giant.","giant"]],[["Now,","bây giờ"],["he's","anh ấy"],["assigned","bắt buộc"],["me","tôi"],["to","giới từ"],["a marathon","cjay marathon"],["all","cả"],["day","ngày"],["long.","dài"]]],
   "time":{"start":174.3,"stop":181.1}},
  {"paneid":"p8-2",
   "xlation":["Chú chó ấy thật tuyệt.","Bạn đang nói về cái gì vậy?"],
   "words":[[["A","mạo từ"],["\"secret","bí mật"],["keeper","người giữ"],["dog\"","chó"],["is","to be"],["surely","một cách chắc chắn"],["amazing.","tuyệt vời"]],[["What","cái gì"],["are","to be"],["you","bạn"],["talking","đang nói"],["about?","về"]]],
   "time":{"start":181.1,"stop":186.1}},
  {"paneid":"p8-3",
   "xlation":["EH?","Thiệt hả?","Nó sẽ giữ bí mật của bjan mãi mãi"],
   "words":[[["Eh?","hả"]],[["Seriously?","thiệt sao?"]],[["He","anh ấy"],["will","sẽ"],["keep","giữ"],["your","của bạn"],["secret","bí mật"],["forever.","mãi mãi"]]],
   "time":{"start":186.1,"stop":190.4}},
  {"paneid":"p8-4",
   "xlation":["Làm ơn giữ của tôi nữa"],
   "words":[[["Please","làm ơn"],["do","làm"],["mine","của tôi"],["too.","cũng"]]],
   "time":{"start":190.4,"stop":192.2}},
  {"paneid":"p8-5",
   "xlation":["Cậu không thể đưa nhiều cái một lần được!","Tôi cần giấu mẹ những bí mật này.","Cậu muốn phản đối hả?"],
   "words":[[["You","bạn"],["can't","không thể"],["give","đưa"],["me","tôi"],["lots of","nhiều"],["them","cái"],["at once.","vào một lúc"]],[["I","tôi"],["need","cần"],["to","giới từ"],["keep","giữ"],["these","điều này"],["secrets","bí mật"],["from","giới từ"],["my","của tôi"],["mother.","mẹ"]],[["Do","trợ động từ"],["you","bạn"],["have","có"],["any","bất kì"],["objection?","phản đối?"]]],
   "time":{"start":192.2,"stop":199.4}},
  {"paneid":"p8-6",
   "xlation":["Tôi biết là nó quá nhiều nhưng làm ơn ăn hết dùm tôi"],
   "words":[[["I","tôi"],["know","biết"],["it's","nó"],["too","quá"],["much","nhiều"],["for","với"],["you,","bạn"],["but","nhưng"],["please","làm ơn"],["eat","ăn"],["them","chúng"],["all.","tất cả"]]],
   "time":{"start":199.4,"stop":202.7}},
  {"paneid":"p8-7",
   "xlation":["Có vẻ như nó sắp nổ"],
   "words":[[["Seems like","Có vẻ như"],["he's","anh ấy"],["about to","sắp"],["burst.","nổ"]]],
   "time":{"start":202.7,"stop":204.8}}],
 [{"paneid":"p9-1",
   "xlation":["Tôi quên viết một lá thư quan trọng"],
   "words":[[["I","tôi"],["forgot","quên"],["to","giới từ"],["write","viết"],["an","mạo từ"],["important","quan trọng"],["letter.","lá thư"]]],
   "time":{"start":204.8,"stop":207.5}},
  {"paneid":"p9-2",
   "xlation":["Tôi cũng quên hỏi Nobita về bài kiểm tra"],
   "words":[[["I","tôi"],["also","cũng"],["forgot","quên"],["to","trợ động từ"],["ask","hỏi"],["Nobita","nobita"],["about","về"],[" the test.","bài kiểm tra"]]],
   "time":{"start":207.5,"stop":210.7}},
  {"paneid":"p9-3",
   "xlation":["Đây có lẽ là cái kết tốt nhất cho Nobita"],
   "words":[[["This","đây"],["is","to be"],["probably","có thể"],["the","mạo từ"],["best","tốt nhất"],["end","cái kết"],["for","cho"],["Nobita","Nobita"],["himself.","chính anh ấy"]]],
   "time":{"start":210.7,"stop":213.8}}]];

MeoU.glosses[MeoU.DORAPLUS1CH8] = [[
  {"paneid":"p1-1",
   "xlation":["Đợi tôi với!"],
   "words":[[["Wait","đợi"],["for","giới từ"],["me!","tôi"]]],
   "time":{"start":0,"stop":1}},
  {"paneid":"p1-2",
   "xlation":["Ai gọi đấy!"],
   "words":[[["Who","ai"],["is","to be"],["calling?"," đang gọi?"]]],
   "time":{"start":1,"stop":2}},
  {"paneid":"p1-3",
   "xlation":["Tôi không có thời gian để giải thích!","Nhanh lên, mở ti vi lên"],
   "words":[[["I","tôi"],["don't","không"],["have","có"],["time","thời gian"],["to","giới từ"],["explain!","giải thích"]],[["Quick,","Nhanh lên,"],["turn on ","mở"],[" the television!","ti vi"]]],
   "time":{"start":2,"stop":5.6}},
  {"paneid":"p1-4",
   "xlation":["Bật kênh X lên"],
   "words":[[["Turn on","mở lên"],["channel","kênh"],["X","X"]]],
   "time":{"start":5.6,"stop":7.1}}],
 [{"paneid":"p2-1",
   "xlation":["Bạn làm gì thế?","Chúng ta phải xem kênh X"],
   "words":[[["What","cái gì"],["are","to be"],["you","bạn"],["doing?","đang làm?"]],[["We","chúng tôi"],["have to","phải"],["watch","xem"],["channel","kênh"],["X.","X."]]],
   "time":{"start":7.1,"stop":10.9}},
  {"paneid":"p2-2",
   "xlation":["Ai nó thế?"],
   "words":[[["Who","ai"],["said","nói"],["that?","điều đó?"]]],
   "time":{"start":10.9,"stop":12.3}},
  {"paneid":"p2-3",
   "xlation":["Ai?"],
   "words":[[["Who?","ai?"]]],
   "time":{"start":12.3,"stop":13}},
  {"paneid":"p2-4",
   "xlation":["Nghe quen lắm, nhưng tôi không nhớ ra!"],
   "words":[[["It","nó"],["sounded","nghe"],["familiar,","quen thuộc"],["but","nhưng"],["I","tôi"],["can't","không thể"],["remember!","nhớ"]]],
   "time":{"start":13,"stop":15.8}},
  {"paneid":"p2-5",
   "xlation":["Tên tôi là Honekawa Suneo, lớp 4.","Ah!","Chính là giọng của anh ấy!","Suneo lên ti vi.","Thật bất ngờ!"],
   "words":[[["My","của tôi"],["name","tên"],["is","to be"],["Honekawa Suneo","Honekawa Suneo"],["4th","thứ 4"],["grade.","lớp"]],[["Ah!","Ah!"]],[["It","Nó"],["was","to be"],["his","của anh ấy"],["voice!","giọng!"]],[["Suneo","Suneo"],["is","to be"],["on","trên"],["television.","ti vi"]],[["What ","Thật là"],["a surprise!","bất ngờ!"]]],
   "time":{"start":15.8,"stop":25.7}},
  {"paneid":"p2-6",
   "xlation":["Hãy đến và tham gia cùng với tôi.","Đừng chỉ đợi và ngắm nhìn từ xa."],
   "words":[[["Come","đến"],["and","và"],["join","tham gia"],["me.","tôi"]],[["Don't","đừng"],["just","chỉ"],["wait","đợi"],["and","và"],["watch","ngắm nhìn"],["from","từ"],["far away","xa"]]],
   "time":{"start":25.7,"stop":30.2}},
  {"paneid":"p2-7",
   "xlation":["Anh ấy hay thật.","Không có gì đặc biệt."],
   "words":[[["He's","anh ấy"],["good.","tốt"]],[["It's","nó"],["nothing","không có gì"],["special.","đặc biệt"]]],
   "time":{"start":30.2,"stop":33}}],
 [{"paneid":"p3-1",
   "xlation":["Tôi thấy bạn trên ti vi.","Bạn trông thật tuyệt.","Lúc đó bạn có lo lắng không?","Cậu bé đó đã lên ti vi.","Tôi muốn làm quen với anh ấy.","Bây giờ cậu ấy đã trở nên nổi tiếng "],
   "words":[[["I","tôi"],["saw","thấy"],["you","bạn"],["on","trên"],["television.","ti vi"]],[["You","bạn"],["looked","trông thật"],["great.","tuyệt vời"]],[["Were","to be"],["you","bạn"],["nervous?","lo lắng?"]],[["That","đó"],["kid,","đứa bé"],["he","anh ấy"],["was","to be"],["on","trên"],["television.","ti vi"]],[["I'd love","tôi muốn"],["to","giới từ"],["be","to be"],["his","của anh ấy"],["friend.","bạn"]],[["He's","anh ấy"],["so","rất"],["popular","nổi tiếng"],["now.","bây giờ"]]],
   "time":{"start":33,"stop":45.4}},
  {"paneid":"p3-2",
   "xlation":["Cho tôi xin chữ ký"],
   "words":[[["Please","làm ơn"],["sign","kí tên"],["my","của tôi"],["notebook","cuốn sổ"]]],
   "time":{"start":45.4,"stop":48.1}},
  {"paneid":"p3-3",
   "xlation":["Tôi cũng muốn có chữ ký  của bạn!","Nobita!"],
   "words":[[["I","tôi"],["want","muốn"],["your","của bạn"],["autograph","chữ ký"],["too!","cũng"]],[["Nobita!","Nobita!"]]],
   "time":{"start":48.1,"stop":51.6}},
  {"paneid":"p3-4",
   "xlation":["Thái độ đó là gì?","Bạn không thấy xấu hổ sao ?"],
   "words":[[["What","cái gì"],["kind","loại"],["of","giới từ"],["attitude","thái độ"],["is","to be"],["that?","đó"]],[["Are","to be"],["you","bạn"],["not","không"],["ashamed","xấu hổ"],["of","giới từ"],["yourself?","chính bạn"]]],
   "time":{"start":51.6,"stop":55.8}},
  {"paneid":"p3-5",
   "xlation":["Tôi nghĩ ai đó đang ganh tị"],
   "words":[[["I","tôi"],["think","nghĩ"],["someone","ai đó"],["is","to be"],["getting","đang cảm thấy"],["jealous.","ganh tị"]]],
   "time":{"start":55.8,"stop":58}},
  {"paneid":"p3-6",
   "xlation":["Tôi nói chuyện với nhầm người rồi."],
   "words":[[["I","tôi"],["spoke","nói chuyện"],["to","giới từ"],["the","mạo từ"],["wrong","sai"],["person.","người"]]],
   "time":{"start":58,"stop":59.8}}],
 [{"paneid":"p4-1",
   "xlation":["Bạn chưa từng nghĩ đến việc lên ti vi ah?"],
   "words":[[["Have","trợ động từ"],["you","bạn"],["never","không bao giờ"],["thought","nghĩ"],["of","về"],["being","to be"],["on","lên"],["television","ti vi"],["yourself?","chính bạn"]]],
   "time":{"start":59.8,"stop":63}},
  {"paneid":"p4-2",
   "xlation":["Có.","Nhưng người như tôi thì không thể, đúng không?","Không gì là không thể.","Chừng nào cậu còn có tớ bên cạnh."],
   "words":[[["I","tôi"],["have.","có"]],[["But","nhưng"],["it's","nó"],["impossible","không thể"],["for","giới từ"],["someone","một ai đó"],["like","giống như"],["me,","tôi"],["right?","đúng không?"]],[["Nothing","không có gì"],["is","là"],["impossible.","không thể"]],[["As long as","miễn là"],["you","bạn"],["have","có"],["me.","tôi"]]],
   "time":{"start":63,"stop":71.3}},
  {"paneid":"p4-3",
   "xlation":["Thật sao?","Tôi sẽ làm bạn nổi tiếng như Suneo"],
   "words":[[["Seriously?","Thật sao?"]],[["I","tôi"],["will","sẽ"],["make","khiến"],["you","bạn"],["as","như"],["famous","nổi tiếng"],["as","như"],["Suneo.","Suneo"]]],
   "time":{"start":71.3,"stop":75.4}},
  {"paneid":"p4-4",
   "xlation":["Bổn phận của tôi là giúp cậu mà.","Nghe thật hứa hẹn!"],
   "words":[[["It's","nó là"],["my","của tôi"],["job","công việc"],["to","giới từ"],["help","giúp đỡ"],["you","bạn"],["anyway.","dầu sao đi nữa"]],[["Sounds","nghe có vẻ"],["promising.","đầy hứa hẹn"]]],
   "time":{"start":75.4,"stop":79.5}},
  {"paneid":"p4-5",
   "xlation":["Mọi người, Nobita sẽ lên ti vi.","Mọi người nhanh về coi đi."],
   "words":[[["Everyone,","mọi người"],["Nobita","Nobita"],["will","sẽ"],["be","to be"],["on","lên"],["television.","ti vi"]],[["Please","làm ơn"],["go","đi"],["home","nhà"],["right away","ngay lập tức"],["to","giới từ"],["watch","xem"],["him.","anh ấy"]]],
   "time":{"start":79.5,"stop":84.8}},
  {"paneid":"p4-6",
   "xlation":["Sẽ không uổng phí thời gian của các bạn đâu"],
   "words":[[["It","nó"],["won't","sẽ không"],["be","to be"],["a waste","sự lãng phí"],["of","của"],["time.","thời gian"]]],
   "time":{"start":84.8,"stop":86.5}},
  {"paneid":"p4-7",
   "xlation":["Xin hãy làm ngay"],
   "words":[[["Please","làm ơn"],["do","làm"],["it.","nó"]]],
   "time":{"start":86.5,"stop":88.7}},
  {"paneid":"p4-8",
   "xlation":["Tôi nghĩ chúng ta đang làm quá rồi.","Bạn có ý gì?"],
   "words":[[["I","tôi"],["think","nghĩ"],["we're","chúng ta"],["overdoing","làm quá"],["this.","điều này"]],[["What","cái gì"],["do","trợ động từ"],["you","bạn"],["mean?","có ý"]]],
   "time":{"start":88.7,"stop":92.2}}],
 [{"paneid":"p5-1",
   "xlation":["Cậu không muốn lên cái thứ này ah?"],
   "words":[[["Don't","không"],["you","bạn"],["want","muốn"],["to","trợ động từ"],["be","to be"],["on","lên"],["that","này"],["thing?","thứ?"]]],
   "time":{"start":92.2,"stop":94.2}},
  {"paneid":"p5-2",
   "xlation":["Tớ không có ý đó.","Vậy thì đừng tự ti nữa"],
   "words":[[["That's","điều đó"],["not","không"],["what","cái gì"],["I","tôi"],["meant.","có ý"]],[["Then,","Vậy thì"],["stop","ngưng"],["being","to be"],["so","quá"],["timid.","rụt rè"]]],
   "time":{"start":94.2,"stop":97.9}},
  {"paneid":"p5-3",
   "xlation":["Hả, cái gì?"],
   "words":[[["Eh,","hả"],["what?","cái gì?"]]],
   "time":{"start":97.9,"stop":99.3}},
  {"paneid":"p5-4",
   "xlation":["Đúng rồi.","Lên ti vi không chỉ đơn giản là đến cửa hàng được.","Cậu thật không đáng tin chút nào."],
   "words":[[["That's","điều đó"],["true.","đúng"]],[["Being","to be"],["on","lên"],["television","ti vi"],["is","to be"],["not","không"],["simply","đơn giản"],["a matter","một vấn đề"],["of","của"],["going","đi"],["to","đến"],["the store.","của hàng"]],[["You're","bạn"],["not","không"],["reliable","đáng tin"],["after all","rốt cuộc"]]],
   "time":{"start":99.3,"stop":107.2}},
  {"paneid":"p5-5",
   "xlation":["Bạn đang hỏi về tiêu chuẩn để lên ti vi ư?","Ah, trước tiên bạn chắc chắn phải luyện tập trước/"],
   "words":[[["You're","bạn"],["asking","đang hỏi"],["me","tôi"],["about","về"],[" the criteria","tiêu chuẩn"],["to be","to be"],["on","lên"],["television?","ti vi"]],[["Well,","được thôi"],["for sure","chắc chắn là"],["you","bạn"],["need","cần"],["training","huấn luyện"],["first.","trước"]]],
   "time":{"start":107.2,"stop":114.6}},
  {"paneid":"p5-6",
   "xlation":["Sau đó chúng tôi sẽ chọn ra thí sinh giỏi nhất"],
   "words":[[["Then","sau đó"],["we","chúng ta"],["will","sẽ"],["pick","chọn"],["the","mạo từ"],["best","tốt nhất"],["one","bằng nghĩa candidate"],["out of","trong "],[" the candidates.","những thí sinh"]]],
   "time":{"start":114.6,"stop":117.9}}],
 [{"paneid":"p6-1",
   "xlation":["kế tiếp"],
   "words":[[["Next.","kế tiếp"]]],
   "time":{"start":117.9,"stop":119}},
  {"paneid":"p6-2",
   "xlation":["Bạn tên là gì và học lớp mấy.","Lớp 4.","Tôi tên Nobi..."],
   "words":[[["Please","làm ơn"],["tell","nói"],["me","tôi"],["your","của bạn"],["name","tên"],["and","và"],["grade.","tuổi"]],[["Fourth","4"],["grade","lớp"],["in","trong"],["elementary","tiểu học"],["school.","trường"]],[["My","của tôi"],["name","tên"],["is","to be"],["Nobi...","Nobi..."]]],
   "time":{"start":119,"stop":128}},
  {"paneid":"p6-3",
   "xlation":["Hãy thử hát 1 bài"],
   "words":[[["Let's","hãy"],["try","thử"],["to","trợ động từ"],["sing","hát"],["a song.","bài hát"]]],
   "time":{"start":128,"stop":129.6}},
  {"paneid":"p6-4",
   "xlation":["Thật thô lỗ.","Tôi đã nói người như tôi không thể lên ti vi mà.","Chúng tôi đã xem ti vi cả ngày.","Nhưng chẳng thấy đâu cả."],
   "words":[[["That","điều đó"],["was","to be"],["rude.","thô lỗ"]],[["I","tôi"],["told","đã nói"],["you","bạn"],["it","nó"],["was","to be"],["impossible","không thể"],["for","cho"],["someone","ai đó"],["like","như"],["me","tôi"],["to be","to be"],["on","lên"],["television.","ti vi"]],[["Hey,","này"],["we","chúng tôi"],["watched","xem"],["television","ti vi"],["all"," cả"],["day","ngày"],["long.","dài"]],[["But","nhưng"],["we","chúng tôi"],["didn't","không"],["see","thấy"],["you","bạn"],["at all","chút nào"]]],
   "time":{"start":129.6,"stop":140.5}},
  {"paneid":"p6-5",
   "xlation":["Nhưng suy cho cùng việc Nobita lên tivi thật khó tin"],
   "words":[[["But","nhưng"],["to","để"],["think","nghĩ"],["that","rằng"],["Nobita","nobita"],["would","sẽ"],["be","to be"],["on","lên"],["television,","ti vi"],["I","tôi"],["think","nghĩ"],["it","nó"],["was","to be"],["a lie.","lời nói dối"]]],
   "time":{"start":140.5,"stop":145.5}},
  {"paneid":"p6-6",
   "xlation":["Anh ấy sắp lên rồi!"],
   "words":[[["He's","anh ấy"],["just about to ","sắp"],["be","to be"],["on!","lên!"]]],
   "time":{"start":145.5,"stop":147.5}}],
 [{"paneid":"p7-1",
   "xlation":["Kênh nào?","Tất cả các kênh"],
   "words":[[["On","lên"],["what","cái gì"],["channel?","kênh?"]],[["Every","mọi"],["channel.","kênh"]]],
   "time":{"start":147.5,"stop":150.1}},
  {"paneid":"p7-2",
   "xlation":["Mấy giờ?","Nó sẽ bắt đầu tỏng 10 phút nữa"],
   "words":[[["What","mấy"],["time?","giờ"]],[["It","nó"],["will","sẽ"],["start","bắt đầu"],["in","trong"],["10","10"],["minutes.","phút"]]],
   "time":{"start":150.1,"stop":153.2}},
  {"paneid":"p7-3",
   "xlation":["Chương trình có tên \" Nobita Show\" chỉ nói về Nobita thôi"],
   "words":[[["It's","nó"],["called","được gọi "],["\"The","mạo từ"],["Nobita","Nobita"],["Show\"","chương trình"],["where","nơi"],["everything","mọi thứ"],["is","to be"],["about","về"],["Nobita.","Nobita"]]],
   "time":{"start":153.2,"stop":157}},
  {"paneid":"p7-4",
   "xlation":["Này, đừng nói những điều vô lý như vậy.","Cứ để đó cho tôi"],
   "words":[[["Hey,","này"],["don't","đừng"],["speak","nói"],["such","như thế"],["nonsense!","vô lý"]],[["Just","cứ"],["leave it to me","để đó cho tôi"]]],
   "time":{"start":157,"stop":161.4}},
  {"paneid":"p7-5",
   "xlation":["Làm ơn chạm vào camera.","Để làm gì?"],
   "words":[[["Please","làm ơn"],["touch","chạm"],["the camera.","máy quay"]],[["What's","cái gì"],["this","điều này"],["for?","cho?"]]],
   "time":{"start":161.4,"stop":164.5}},
  {"paneid":"p7-6",
   "xlation":["Được , nó đang hoạt động tốt"],
   "words":[[["Yup,","được,"],["it's","nó"],["working.","hoạt động"]]],
   "time":{"start":164.5,"stop":165.8}}],
 [{"paneid":"p8-1",
   "xlation":["Mọi người mau về nhà bật ti vi lên đi!","Chương trình \" Nobita Show\" đang chiếu đó"],
   "words":[[["Everyone,","mọi người"],["please","làm ơn"],["go","đi"],["home","nhà"],["and","và"],["turn on","bật"],["your","của bạn"],["television!","ti vi!"]],[[" The Nobita","Nobita"],["Show\"","chương trình"],["is","to be"],["on the way","đang diễn ra"]]],
   "time":{"start":165.8,"stop":171.3}},
  {"paneid":"p8-2",
   "xlation":["Nó đang chiếu bây giờ ư?"],
   "words":[[["It's","nó"],["on","chiếu"],["now?","bây giờ"]]],
   "time":{"start":171.3,"stop":173.2}},
  {"paneid":"p8-3",
   "xlation":["Tôi xem rồi.","Nhưng phải nói là chương trình ấy dở lắm"],
   "words":[[["I","tôi"],["saw","xem"],["it.","nó"]],[["But","nhưng"],["I","tôi"],["must","phải"],["say","nói"],["that","rằng"],["it","nó"],["was","to be"],["disappointing.","gây thất vọng"]]],
   "time":{"start":173.2,"stop":176.6}},
  {"paneid":"p8-4",
   "xlation":["Tất cả những gì anh ấy làm là ngủ"],
   "words":[[["All","tất cả"],["he's","anh ấy"],["doing","đang làm"],["is","to be"],["taking a nap","chợp mắt"]]],
   "time":{"start":176.6,"stop":178.6}},
  {"paneid":"p8-5",
   "xlation":["Thật là ngốc"],
   "words":[[["What a fool","Thật là ngốc"]]],
   "time":{"start":178.6,"stop":179.7}},
  {"paneid":"p8-6",
   "xlation":["Bạn đang lên ti vi đó.","Bạn đang làm gì vậy?","Cái gì?","Bạn lên ti vi nãy giờ rồi"],
   "words":[[["You're","bạn"],["on","lên"],["television","ti vi"],["now.","bây giờ"]],[["What're","Cái gì"],["you","bạn"],["doing?","đang làm"]],[["What?","cái gì"]],[["You've","bạn"],["been","to be"],["on","trên"],["television","ti vi "],["this","này"],["whole","tất cả"],["time!","thời gian!"]]],
   "time":{"start":179.7,"stop":186}}],
 [{"paneid":"p9-1",
   "xlation":["Thật là xấu hổ"],
   "words":[[["I'm","tôi"],["so","quá"],["embarrassed!","xấu hổ"]]],
   "time":{"start":186,"stop":188}},
  {"paneid":"p9-2",
   "xlation":["Làm ơn đừng đến đây.","Dù bạn có ghét nó như thế nào, nó vẫn sẽ đuổi theo người đã chạm vào nó."],
   "words":[[["Don't","đừng"],["come in ","đến"],["here,"," đây"],["please.","làm ơn"]],[["No matter","bất kể"],["how","như thế nào"],["much","nhiều"],["you","bạn"],["hate","ghét"],["it,","nó"],["it","nó"],["will","sẽ"],["keep","duy trì"],["chasing","đuổi theo"],[" the person","người"],["who","mà"],["touched","chạm"],["it.","nó"]]],
   "time":{"start":188,"stop":193.6}},
  {"paneid":"p9-3",
   "xlation":["Thật là một kẻ ngốc"],
   "words":[[["What a fool","thật là một kẻ ngốc"]]],
   "time":{"start":193.6,"stop":194.6}},
  {"paneid":"p9-4",
   "xlation":["Anh ấy chỉ đang cố chạy thoát khỏi máy quay"],
   "words":[[["He's","anh ấy"],["just","chỉ"],["trying to","cố"],["run away","chạy khỏi"],["from","từ"],["the camera.","máy quay"]]],
   "time":{"start":194.6,"stop":197.2}},
  {"paneid":"p9-5",
   "xlation":["Thật là sai lầm khi để anh ấy lên ti vi"],
   "words":[[["It's","nó"],["been","to be"],["a","mạo từ"],["big","lớn"],["mistake","lỗi"],["to put","để"],["him","anh ấy"],["on","lên"],["television.","ti vi"]]],
   "time":{"start":197.2,"stop":200.1}},
  {"paneid":"p9-6",
   "xlation":["Người đẹp trai và tài năng như mình xưng đáng hơn"],
   "words":[[["It","nó"],["ought to ","nên"],["be","to be"],["someone","ai đó"],["handsome","đẹp trai"],["and","và"],["talented","tài năng"],["like","như"],["me.","tôi"]]],
   "time":{"start":200.1,"stop":203.1}},
  {"paneid":"p9-7",
   "xlation":["Phải xem chính xác chuyện gì đang xảy ra"],
   "words":[[["Let","đẻ"],["me","tôi"],["see","xem"],["exactly","chính xác"],["what's","cái gì"],["going on","diễn ra"]]],
   "time":{"start":203.1,"stop":205.4}}],
 [{"paneid":"p10-1",
   "xlation":["Ai đó làm ơi ngừng nó lại!","Ah, đây là cơ hội của tôi"],
   "words":[[["Somebody,","ai đó"],["please","làm ơn"],["stop","ngưng"],["it!","nó"]],[["Ah,","ah"],["this","đây là"],["is","to be"],["my","của tôi"],["chance!","cơ hội"]]],
   "time":{"start":205.4,"stop":208.9}},
  {"paneid":"p10-2",
   "xlation":["Đuổi theo tôi nào!"],
   "words":[[["Chase","Đuổi theo"],["me","tôi"],["now!","bây giờ"]]],
   "time":{"start":208.9,"stop":210.2}},
  {"paneid":"p10-3",
   "xlation":["Tôi sẽ mang bạn về nhà."],
   "words":[[["I","tôi"],["will","sẽ"],["take","mang"],["you","bạn"],["home.","nhà"]]],
   "time":{"start":210.2,"stop":211.4}},
  {"paneid":"p10-4",
   "xlation":["Xin hãy đừng chạy đi.","Cuối cùng thì coi anh ấy vẫn tốt hơn."],
   "words":[[["Please","làm ơn"],["don't","đừng"],["run away.","đi xa"]],[["It's","nó"],["better","tốt hơn"],[" to watch","xem"],["him","anh ấy"],["after all.","rốt cuộc"]]],
   "time":{"start":211.4,"stop":215.9}},
  {"paneid":"p10-5",
   "xlation":["Tôi muốn xem cái khác"],
   "words":[[["I","tôi"],["want","muốn"],[" to watch","xem"],["something","vài thứ"],["else.","khác"]]],
   "time":{"start":215.9,"stop":217.5}},
  {"paneid":"p10-6",
   "xlation":["Đúng rồi.","Kênh nào  bây giờ cũng chiếu anh ấy"],
   "words":[[["That's","điều đó"],["right.","đúng"]],[["Every","Mỗi"],["channel","kênh"],["will","sẽ"],["be","to be"],["broadcasting","chiếu"],["him","anh ấy"],["now.","bây giờ"]]],
   "time":{"start":217.5,"stop":221.1}},
  {"paneid":"p10-7",
   "xlation":["Tốt hơn là tôi nên lấy máy quay lại"],
   "words":[[["I","tôi"],["better","tốt hơn"],["take","lấy"],["my","của tôi"],["camera","máy quay"],["back.","lại"]]],
   "time":{"start":221.1,"stop":222.9}}],
 [{"paneid":"p11-1",
   "xlation":["Cái gì?","Suneo  lấy máy quay ah?"],
   "words":[[["What?","cái gì?"]],[["Suneo","Suneo"],["took","lấy"],["your","của bạn"],["camera?","máy quay"]]],
   "time":{"start":222.9,"stop":225.5}},
  {"paneid":"p11-2",
   "xlation":["Hãy trả lại cho Doremon.","Tôi sắp bắt đầu chương trình"],
   "words":[[["Please","làm ơn"],["return","trả "],["it","nó"],["to","giới từ"],["Doraemon.","Doraemon."]],[["I'm","tôi"],["just","chỉ"],["about to","sắp"],["start","bắt đầu"],["my","của tôi"],["show.","chương trình"]]],
   "time":{"start":225.5,"stop":230}},
  {"paneid":"p11-3",
   "xlation":["Hả?","Với cái máy này sao?"],
   "words":[[["Eh?","hả"]],[["With","với"],["this","này"],["camera?","mấy quay"]]],
   "time":{"start":230,"stop":231.8}},
  {"paneid":"p11-4",
   "xlation":["Tôi luôn muốn làm điều này"],
   "words":[[["I've","tôi"],["always","luôn luôn"],["wanted","muốn"],["to do","làm"],["this.","điều này"]]],
   "time":{"start":231.8,"stop":233.4}},
  {"paneid":"p11-5",
   "xlation":["Trả máy lại cho tôi"],
   "words":[[["Give","trả"],["me","tôi"],["back","lại"],["my","của tôi"],["camera!","máy quay!"]]],
   "time":{"start":233.4,"stop":235.3}},
  {"paneid":"p11-6",
   "xlation":["Im đi!","Bạn ồi ào quá!"],
   "words":[[["Shut up!","Im lặng"]],[["You're","bạn"],["making","gây"],["so","quá"],["much","nhiều"],["noise!","tiếng ồn!"]]],
   "time":{"start":235.3,"stop":237.9}},
  {"paneid":"p11-7",
   "xlation":["Tôi nên làm gì bây giờ?"],
   "words":[[["What","cái gì"],["should","nên"],["I","tôi"],["do","làm"],["now?","bây giờ"]]],
   "time":{"start":237.9,"stop":239.4}}],
 [{"paneid":"p12-1",
   "xlation":["Đau đầu quá"],
   "words":[[["My","của tôi"],["head","cái đầu"],["hurts.","đau"]]],
   "time":{"start":239.4,"stop":240.8}},
  {"paneid":"p12-2",
   "xlation":["Muốn chuyển kênh cũng không được!"],
   "words":[[["Even","ngay cả"],["changing","chuyển"],["the channel","kênh"],["is","to be"],["useless!","vô dụng"]]],
   "time":{"start":240.8,"stop":243.2}},
  {"paneid":"p12-3",
   "xlation":["Ca hát luôn khiến chúng ta đúng không mọi người?","Tại sao chúng ta không đặt một ít thức ăn?"],
   "words":[[["Everyone,","mọi người"],["singing","ca hát"],["always","luôn luôn"],["makes","khiến"],["us","chúng tôi"],["hungry","đói"],["doesn't it?","phải không?"]],[["Why ","tại sao"],["don't","không"],["we","chúng ta"],["order","đặt"],["some","một ít"],["food?","thức ăn"]]],
   "time":{"start":243.2,"stop":248.4}},
  {"paneid":"p12-4",
   "xlation":["Cửa hàng sush iah?","Vâng, tôi muốn đặt một phần sishi hảo hạng nhất.","Phần lớn nhất nhé"],
   "words":[[["Sushi","sushi"],["shop?","cửa hàng?"]],[["Yes,","vâng"],["I'd like","tôi muốn"],[" to order","đặt"],["your","của bạn"],["best","tốt nhất"],["sushi","súhi"],["set.","phần"]],[["The","mạo từ"],["largest","lớn nhất"],["portion","khâu phần"],["you","bạn"],["have.","có"]]],
   "time":{"start":248.4,"stop":254.4}},
  {"paneid":"p12-5",
   "xlation":["2000 Yen cho hai người"],
   "words":[[["2000","2000"],["Yen","đơn vị tiền tệ của nhật|đơn vị tiền nhật|đơn vị tiền tệ nhật"],["for","cho"],["two","hai"],["people.","con người"]]],
   "time":{"start":254.4,"stop":256.5}},
  {"paneid":"p12-6",
   "xlation":["Ông ấy luôn làm ra sushi tinh tế nhất, ai có thể đánh bại ông ấy?"],
   "words":[[["That","đó"],["man","người đàn ông"],["always","luôn luôn"],["make","làm"],["such","như thế"],["exquisite","tinh tế"],["sushi,","sushi,"],["who","ai"],["can","có thể"],["beat","đánh"],["him?","anh ấy"]]],
   "time":{"start":256.5,"stop":260.4}},
  {"paneid":"p12-7",
   "xlation":["Tôi sẽ trả tiền cho bạn trong giờ quảng cáo"],
   "words":[[["I","tôi"],["will","sẽ"],["pay","trả tiền"],["you","bạn"],["during","trong"],["the","mạo từ"],["commercial","quảng cáo"],["break.","giờ nghỉ"]]],
   "time":{"start":260.4,"stop":262.6}},
  {"paneid":"p12-8",
   "xlation":["Thà ra ngoài còn hơn xem anh ta cả ngày"],
   "words":[[["It's","nó"],["better","tốt hơn"],["to go","đi"],["out","ngoài"],["than","hơn"],["to watch","xem"],["him","anh ấy"],["all","cả"],["day.","ngày"]]],
   "time":{"start":262.6,"stop":265.4}}],
 [{"paneid":"p13-1",
   "xlation":["Chương trình ti vi  lạ quá nhỉ?","Tất cả các kênh đều  chiếu Suneo.","Lỗi của ai đây?"],
   "words":[[["Today's","của hôm nay"],["television","ti vi"],["programming","chương trình"],["is","to be"],["weird,","kì lạ"],["isn't it?","phải không"]],[["All","tất cả"],["channels","kênh"],["are","to be"],["just","chỉ"],["showing","chiếu"],["Suneo.","Suneo"]],[["Whose","của ai"],["fault","lỗi"],["is","to be"],["this?","đây?"]]],
   "time":{"start":265.4,"stop":273.4}},
  {"paneid":"p13-2",
   "xlation":["Tôi đã thay đồ.","Hãy bắt đầu phần thứ hai của chương trình nào.","Suneo!"],
   "words":[[["I've","tôi"],["changed","thay đổi"],["my","của tôi"],["clothes,","quần áo"],["everyone.","mọi người"]],[["Let's","hãy"],["start","bắt đầu"],["the","mạo từ"],["second","thứ hai"],["part","phần"],["of","của"],["our","của chúng ta"],["show.","chương trình"]],[["Suneo!","Suneo!"]]],
   "time":{"start":273.4,"stop":278.4}},
  {"paneid":"p13-3",
   "xlation":["Cái gì?","Mọi người đều ra ngoài chơi và không ai coi chương trình của chúng ta.","Tốt hơn hết là chúng ta nên dừng chương trình.","Thật là xấu hổ"],
   "words":[[["What?","cái gì?"]],[["Everyone","mọi người"],["is","to be"],["playing","đang chơi"],["outside","ngoài"],["and","và"],["nobody","không có ai"],["is","to be"],["watching","đang xem"],["television?","ti vi?"]],[["We","chúng ta"],["better","tốt hơn"],["stop","ngừng"],["this","này"],["show.","chương trình"]],[["It's","nó"],["embarrassing.","đáng xấu hổ"]]],
   "time":{"start":278.4,"stop":285.4}},
  {"paneid":"p13-4",
   "xlation":["Biến đi"],
   "words":[[["Go away!","biến đi"]]],
   "time":{"start":285.4,"stop":286.3}},
  {"paneid":"p13-5",
   "xlation":["Đủ rồi!","Đồ máy quay cứng đầu!"],
   "words":[[["I've had enough!","đủ rồi!"]],[["What","thật là"],["a","một"],["tenacious","cứng đầu"],["camera.","máy quay"]]],
   "time":{"start":286.3,"stop":289.1}}],
 [{"paneid":"p14-1",
   "xlation":["Chúng ta không có nơi nào để trốn"],
   "words":[[["We","chúng ta"],["have","có"],["nowhere","không nơi nào"],["to escape","trốn"]]],
   "time":{"start":289.1,"stop":290.8}},
  {"paneid":"p14-2",
   "xlation":["Tôi phải đi mua ít đồ lặt vặt.","Thật không công bằng!"],
   "words":[[["I","tôi"],["need","cần"],["to run ","chạy"],["some","một vài"],["errands.","việc lặt vặt"]],[["That's","điều đó"],["not","không"],["fair!","công bằng!"]]],
   "time":{"start":290.8,"stop":293.7}},
  {"paneid":"p14-3",
   "xlation":["Ai đó cứu tôi với!"],
   "words":[[["Somebody,","ai đó"],["please","làm ơn"],["help","giúp đỡ"],["me!","tôi"]]],
   "time":{"start":293.7,"stop":296}},
  {"paneid":"p14-4",
   "xlation":["Tốt hơn hết chúng ta nên giúp Suneo-san"],
   "words":[[["We","chúng ta"],["better","tốt hơn"],["help","giúp đỡ"],["Suneo-san.","Suneo-san."]]],
   "time":{"start":296,"stop":297.8}},
  {"paneid":"p14-5",
   "xlation":["Nếu cậu ta chịu trả lại máy quay"],
   "words":[[["As if","nếu"],["he","anh ấy"],["wants","muốn"],["to return","trả lại"],["my","của tôi"],["camera.","máy quay"]]],
   "time":{"start":297.8,"stop":300.1}},
  {"paneid":"p14-6",
   "xlation":["Tôi hiểu rồi.","XIn hãy tha thứ cho những việc làm trước đây của tôi"],
   "words":[[["I","tôi"],["understand.","hiểu"]],[["Forgive","tha thứ"],["me","tôi"],["for","giới từ"],["what","cái gì"],["happened","đã xảy ra"],["earlier.","trước đây"]]],
   "time":{"start":300.1,"stop":303.3}},
  {"paneid":"p14-7",
   "xlation":["Làm ơn làm nó dừng lại bây giờ đi.","Tôi muốn xem anh ấy chút nữa"],
   "words":[[["Please","làm ơn"],["make","làm"],["it","nó"],["stop","dừng lại"],["now!","bây giờ"]],[["I","tôi"],["want","muốn"],[" to watch","xem"],["him","anh ấy"],["just","chỉ"],["a little while","một chút"],["longer.","lâu hơn"]]],
   "time":{"start":303.3,"stop":308.4}}]];
MeoU.glosses[MeoU.DORAPLUS1CH9] = [[
  {"paneid":"p1-1",
   "xlation":[],
   "words":[],
   "time":{"start":0,"stop":2}}],
 [{"paneid":"p2-1",
   "xlation":["Tôi lại về nhà trễ nữa rồi.","Mẹ sẽ nói gì đây?"],
   "words":[[["I","tôi"],["came","về"],["home","nhà"],["late","trễ"],["again.","lại"]],[["What","cái gì"],["will","sẽ"],["mama","mẹ"],["say","nói"],["about","về"],["this?","điều này?"]]],
   "time":{"start":2,"stop":6}},
  {"paneid":"p2-2",
   "xlation":["Mình sẽ đi đường tắt"],
   "words":[[["I'll","tôi sẽ"],["take a short cut.","đi đường tắt"]]],
   "time":{"start":6,"stop":7.4}},
  {"paneid":"p2-3",
   "xlation":["Loại đất này thật cứng"],
   "words":[[["This","này"],["ground","đất"],["is","to be"],["so","quá"],["stiff.","cứng"]]],
   "time":{"start":7.4,"stop":9.2}},
  {"paneid":"p2-4",
   "xlation":["Đau quá, tốt hơn hết mình nên dừng lại"],
   "words":[[["It","nó"],["just","chỉ"],["gives","đưa"],["me","tôi"],["a lot of","nhiều"],["pain","cơn đau"],["so","vì thế"],["maybe","có thể"],["I","tôi"],["better","tốt hơn"],["stop","dừng"],["doing","làm"],["it.","nó"]]],
   "time":{"start":9.2,"stop":12.9}},
  {"paneid":"p2-5",
   "xlation":["Ah, chào mừng về nhà.","Ssh"],
   "words":[[["Ah,","ah"],["welcome","chào mừng"],["home.","nhà"]],[["Ssh.","Ssh."]]],
   "time":{"start":12.9,"stop":15.3}},
  {"paneid":"p2-6",
   "xlation":["Thế là sau giờ học bạn bị thầy la bởi vì bạn quên nộp bài tập về nhà sao?"],
   "words":[[["So","vì thế,"],["you","bạn"],["were","to be"],["scolded","la mắng"],["by","bởi"],["Sensei","thầy giáo"],["after school","sau giờ học"],["because","bởi vì"],["you","bạn"],["forgot","quên"],["to hand in","nộp"],["your","của bạn"],["homework?","bài tập về nhà"]]],
   "time":{"start":15.3,"stop":20.2}},
  {"paneid":"p2-7",
   "xlation":["Tại sao bạn không làm bài tập về nhà ngay khi bạn mới về nhà?"],
   "words":[[["Why","tại sao"],["don't","không"],["you","bạn"],["do","làm"],["your","của bạn"],["homework","bài tập về nhà"],["as soon as","ngay khi"],["you","bạn"],["come","về"],["home","nhà"],["then?","vậy?"]]],
   "time":{"start":20.2,"stop":23.3}},
  {"paneid":"p2-8",
   "xlation":["Nói thì dễ lắm"],
   "words":[[["Easy","dễ dàng"],["for","cho"],["you","bạn"],["to","để"],["say.","nói"]]],
   "time":{"start":23.3,"stop":24.8}}],
 [{"paneid":"p3-1",
   "xlation":["Thật khó để tôi có thể tập trung vào một thứ khi ngồi vào bàn này.","Hết cách rồi."],
   "words":[[["It's","Nó"],["hard","khó"],["for","cho"],["me","tôi"],["to focus on ","để tập trung"],["one","một"],["thing","thứ"],["when","khi"],["I","tôi"],["face","đối diện"],["this","này"],["table.","cái bàn"]],[["Can't be helped","hết cách rồi"]]],
   "time":{"start":24.8,"stop":30.1}},
  {"paneid":"p3-2",
   "xlation":["Thật là một gánh nặng.","Tối nay chúng ta sẽ ăn gì?","Tôi có muốn ra ngoài chơi ko?","Tôi biết là tôi muốn đọc truyện."],
   "words":[[["What","thật là"],["a burden.","một gánh nặng"]],[["What","cái gì"],["will","sẽ"],["we","chúng ta"],["have","có"],["for","giới từ"],["dinner","bữa tối"],["today?","hôm nay"]],[["Do","trợ động từ"],["I","tôi"],["want","muốn"],["to play","chơi"],["outside?","ngoài"]],[["I","tôi"],["know","biết"],["that","rằng"],["I","tôi"],["want","muốn"],["to read","đọc"],["comics.","truyện tranh"]]],
   "time":{"start":30.1,"stop":38.3}},
  {"paneid":"p3-3",
   "xlation":["Tôi không làm nữa!","Đầu tôi đau mỗi khi tôi ép chính mình tập trung"],
   "words":[[["I","tôi"],["can't","không thể"],["do","làm"],["this!","điều này"]],[["My","của tôi"],["head","cái đầu"],["hurts","đau"],["when","khi"],["I","tôi"],["force","ép"],["myself","chính tôi"],["to concentrate.","tập trung"]]],
   "time":{"start":38.3,"stop":42.9}},
  {"paneid":"p3-4",
   "xlation":["Tôi mệt.","Tôi muốn ngủ một giấc.","Đây là lý do tại sao thầy la bạn mỗi ngày"],
   "words":[[["I'm","tôi"],["tired.","mệt"]],[["I","tôi"],["want","muốn"],["to take a nap.","chợp mắt"]],[["This","điều này"],["is","to be"],["why","tại sao"],["Sensei","thầy giáo"],["scolds","la"],["you","bạn"],["everyday.","mỗi ngày"]]],
   "time":{"start":42.9,"stop":48.4}},
  {"paneid":"p3-5",
   "xlation":["Đúng rồi!","Tôi thật sự cần học cách tập trung như thế nào!"],
   "words":[[["That's it!","Đúng rồi!"]],[["I","tôi"],["really","thật sự"],["need","cần"],["to learn","học"],["how","như thế nào"],["to focus!","tập trung!"]]],
   "time":{"start":48.4,"stop":51.8}},
  {"paneid":"p3-6",
   "xlation":["Bong bóng tập trung"],
   "words":[[["A concentration soap helmet","Bong bóng tập trung"]]],
   "time":{"start":51.8,"stop":53.8}},
  {"paneid":"p3-7",
   "xlation":["Nếu bạn xịt cái này, bạn sẽ được bao bọc bởi một lớp bong bóng giúp bạn tập trung"],
   "words":[[["If","nếu"],["you're","bạn"],["sprayed","được xịt"],["with","giới từ"],["this thing,","thứ này"],["you","bạn"],["will","sẽ"],["be surrounded","được bao bọc"],["by","bởi"],["a soap","xà phòng"],["helmet","mũ"],["and","và"],["you'll","bạn sẽ"],["be able to ","có  thể"],["concentrate.","tập trung"]]],
   "time":{"start":53.8,"stop":60}},
  {"paneid":"p3-8",
   "xlation":["Chúng ta thử nó nhé"],
   "words":[[["Let's","hãy"],["try","thử"],["it","nó"],["shall we?","được không?"]]],
   "time":{"start":60,"stop":61.3}}],
 [{"paneid":"p4-1",
   "xlation":["Nó hoạt động rồi!"],
   "words":[[["It","Nó"],["works!","hoạt động"]]],
   "time":{"start":61.3,"stop":62.3}},
  {"paneid":"p4-2",
   "xlation":["Nếu bạn đội cái mũ này, không có gì có thể làm phiền bạn cho đến bạn hoàn thành"],
   "words":[[["If","nếu"],["you're","bạn"],["wearing","đeo"],["that helmet,","cái mũ đó"],["you","bạn"],["won't","sẽ không"],["be bothered","bị làm phiền"],["by","vào"],["anything","bất cứ gì"],["else","khác"],["until","cho đến khi"],["you're","bạn"],["done.","làm xong"]]],
   "time":{"start":62.3,"stop":66.4}},
  {"paneid":"p4-3",
   "xlation":["Bạn có muốn nghỉ không?","Bạn không muốn ăn nhẹ sao?"],
   "words":[[["Do","trợ động từ"],["you","bạn"],["want","muốn"],["to take a break?","nghỉ ngơi"]],[["Don't","không"],["you","bạn"],["want","muốn"],[" to have","có"],["a snack?","ăn xế"]]],
   "time":{"start":66.4,"stop":69.6}},
  {"paneid":"p4-4",
   "xlation":["Truyện này thật thú vị"],
   "words":[[["This","này"],["comic","truyện"],["is","to be"],["so","quá"],["interesting.","hấp dẫn"]]],
   "time":{"start":69.6,"stop":73.3}},
  {"paneid":"p4-5",
   "xlation":["Bạn không thể nói \"Tadaima\" khi bạn về nhà sao?"],
   "words":[[["Can't","không thể"],["you","bạn"],["say","nói"],["tadaima","tadaima"],["when","khi"],["you","bạn"],["come","đến"],["home?","nhà"]]],
   "time":{"start":73.3,"stop":75.7}},
  {"paneid":"p4-6",
   "xlation":["Anh ấy đang làm bài tập.","Không có gì có thể làm phiền anh ấy.","Thật lạ"],
   "words":[[["He's","anh ấy"],["doing","đang làm"],["his","của anh ấy"],["homework.","bài tập về nhà"]],[["He","anh ấy"],["can't","không thể"],["be bothered","bị làm phiền"],["by","bởi"],["anything","bất cứ gì"],["else.","khác"]],[["How","thật"],["unusual.","bất thường"]]],
   "time":{"start":75.7,"stop":80.5}}],
 [{"paneid":"p5-1",
   "xlation":["Vậy thì hãy làm hết sức của bạn"],
   "words":[[["Please","làm ơn"],["do","làm"],["your","của bạn"],["best","tốt nhất"],["then.","vậy"]]],
   "time":{"start":80.5,"stop":81.8}},
  {"paneid":"p5-2",
   "xlation":["Được rồi, làm xong rồi"],
   "words":[[["Okay,","Được "],["you","bạn"],["are done","làm xong "],["now.","bây giờ"]]],
   "time":{"start":81.8,"stop":83.2}},
  {"paneid":"p5-3",
   "xlation":["Không thể tin được!","Tôi đã làm xong bài tập về nhà!","Bởi vì bạn đã tập trung"],
   "words":[[["I","tôi"],["can't","không thể"],["believe","tin"],["it!","nó"]],[["I","tôi"],["finished","hoàn thành"],["my","của tôi"],["homework!","bài tập về nhà"]],[["It's","đó là"],["because","bởi vì"],["you","bạn"],["are","to be"],["focused.","tập trung"]]],
   "time":{"start":83.2,"stop":87.8}},
  {"paneid":"p5-4",
   "xlation":["Tôi muốn chơi với cái này"],
   "words":[[["I","tôi"],["want","muốn"],["to play","chơi"],["with","giới từ"],["this","này"],["thing.","thứ"]]],
   "time":{"start":87.8,"stop":89.7}},
  {"paneid":"p5-5",
   "xlation":["Đây là tất cả nhũng gì bạn đã làm?","CHo tôi nghỉ ngơi đi"],
   "words":[[["This","này"],["is","to be"],["all","tất cả"],["you've","bạn"],["done?","đã làm"]],[["Give me a break","cho tôi nghĩ một lúc"]]],
   "time":{"start":89.7,"stop":92.8}}],
 [{"paneid":"p6-1",
   "xlation":["Bất kể khó khăn như thế nào, mọi người sẽ có thể hoàn thành nó"],
   "words":[[["No matter","bất kể"],["how","như thế nào"],["hard","khó khăn"],["it","nó"],["is,","to be"],["everyone","mọi người"],["will","sẽ"],["be able to ","có thể"],["finish","hoàn thành"],["it.","nó"]]],
   "time":{"start":92.8,"stop":96.1}},
  {"paneid":"p6-2",
   "xlation":["Trời!","Tại sao chúng tôi phải gặp họ?"],
   "words":[[["Crap!","Trời!"]],[["Why","tại sao"],["do","trợ động từ"],["I","tôi"],["have to","phải"],["meet","gặp"],["them?","họ"]]],
   "time":{"start":96.1,"stop":98.1}},
  {"paneid":"p6-3",
   "xlation":["Đưa nó cho chúng tôi!"],
   "words":[[["Give","đưa"],["it","nó"],["to","giới từ"],["us!","chúng tôi"]]],
   "time":{"start":98.1,"stop":99.2}},
  {"paneid":"p6-4",
   "xlation":["Ah!","Kiến!","Kiến có gì đặc biệt?"],
   "words":[[["Ah!","ah"]],[["Ants!","Kiến"]],[["What's","cái gì"],["so","rất"],["special","đặc biệt"],["about","về"],["ants?","kiến"]]],
   "time":{"start":99.2,"stop":102.9}},
  {"paneid":"p6-5",
   "xlation":["Những con kiến này đang tha những con gián to đùng"],
   "words":[[["Those","này"],["ants","kiến"],["are","to be"],["carrying","đang mang"],["a","mạo từ"],["big","lớn"],["cockroach!","gián"]]],
   "time":{"start":102.9,"stop":105.3}},
  {"paneid":"p6-6",
   "xlation":["Bạn nghĩ chúng sẽ mang đi đâu?","Những con kiến này nhỏ, nhưng rất khỏe mạnh"],
   "words":[[["Where","ở đâu"],["do","trợ động từ"],["you","bạn"],["think","nghĩ"],["they","họ"],["will","sẽ"],["bring","mang"],["him?","anh ấy"]],[["These","này"],["ants","kiến"],["are","to be"],["small,","nhỏ"],["yet","nhưng"],["they","chúng"],["are","to be"],["so","rất"],["strong.","mạnh mẽ"]]],
   "time":{"start":105.3,"stop":110.3}}],
 [{"paneid":"p7-1",
   "xlation":["Bạn có muốn tập trung vào thứ gì đó không?","Tôi muốn"],
   "words":[[["Do","Trợ động từ"],["you","bạn"],["need","cần"],["to concentrate","để tập trung"],["on","giới từ"],["something?","vài thứ"]],[["I do","tôi cần"]]],
   "time":{"start":110.3,"stop":113.8}},
  {"paneid":"p7-2",
   "xlation":["Tôi đã làm cái áo ấm này từ năm ngoái.","Nhưng tôi vẫn chưa làm xong"],
   "words":[[["I've","tôi"],["been","to be"],["making","làm"],["this","này"],["sweater","áo ấm"],["since","kể từ"],["last","trước"],["year.","năm"]],[["But","nhưng"],["I","tôi"],["haven't","trợ động từ"],["been","to be"],["able to","có thể"],["finish","hoàn thành"],["it.","nó"]]],
   "time":{"start":113.8,"stop":118}},
  {"paneid":"p7-3",
   "xlation":["Sẵn sàng để đội mũ chưa?"],
   "words":[[["Ready","sẵn sàng"],["for","cho"],["the helmet?","cái mũ"]]],
   "time":{"start":118,"stop":119}},
  {"paneid":"p7-4",
   "xlation":["Chúc may mắn"],
   "words":[[["Good luck","chúc may mắn"]]],
   "time":{"start":119,"stop":119.8}},
  {"paneid":"p7-5",
   "xlation":["Bất cứ ai cần tập trung, hãy xếp hàng!","Tôi cần học để thi.","Con trai tôi cũng cần học.","Tôi muốn huấn luyện chó.","Tôi muốn giải xong trò xếp hình"],
   "words":[[["Whoever","Bất cứ ai"],["needs","cần"],["to concentrate,","tập trung"],["please","làm ơn"],["line up!","xếp hàng"]],[["I","tôi"],["need","cần"],["to study","học"],["for","giới từ"],["the entrance","đầu vào"],["exam.","kì thi"]],[["My","của tôi"],["boy","con trai"],["needs","cần"],["to study","học"],["as well.","cũng"]],[["I","tôi"],["want","muốn"],["to train","huấn luyện"],["my","của tôi"],["dog.","con chó"]],[["I","tôi"],["want","muốn"],[" to finish","hoàn thành"],["my","của tôi"],["puzzle ","xếp hình"],["game.","trò chơi"]]],
   "time":{"start":119.8,"stop":131.2}},
  {"paneid":"p7-6",
   "xlation":["Tôi đã giúp rất nhiều người .","Hôm nay là một ngày không thể quên"],
   "words":[[["I've","tôi"],["helped","đã giúp đỡ"],["a lot of","nhiều"],["people.","con người"]],[["Today","hôm nay"],["will","sẽ"],["be","to be"],["an","mạo từ"],["unforgettable","không thể quên"],["day.","ngày"]]],
   "time":{"start":131.2,"stop":135.1}},
  {"paneid":"p7-7",
   "xlation":["Sune-chama vẫn chưa về.","Tôi cũng lo cho con tôi"],
   "words":[[["Sune-chama","Sune-chama"],["hasn't returned","quay lại"],["yet.","chưa"]],[["I'm","tôi"],["worried","lo lắng"],["about","về"],["my","của tôi"],["son","con trai"],["too.","cũng"]]],
   "time":{"start":135.1,"stop":139.3}}],
 [{"paneid":"p8-1",
   "xlation":["Này, bạn đã cho người khác đội mũ phải không?","Phải, có vấn đề gì?"],
   "words":[[["Hey,","Hey,"],["did","trợ động từ"],["you","bạn"],["put","đội"],["the helmet","mũ"],["on","lên"],["other","khác"],["people?","con người"]],[["I did,","tôi đã làm"],["what's","cái gì"],["the","mạo từ"],["big","lớn"],["deal?","vấn đề"]]],
   "time":{"start":139.3,"stop":143.8}},
  {"paneid":"p8-2",
   "xlation":["Miễn là bạn đội mũ, bạn sẽ không bao giờ ngưng được việc bạn đang làm!","Cái gì?"],
   "words":[[["As long as","miễn là"],["they","họ"],["wear","mặc"],["the helmet,","nón "],["they","họ"],["will","sẽ"],["never","không bao giờ"],["be able to ","có thể"],["stop","ngừng"],["doing","làm"],["what","cái gì"],["they're","họ"],["doing","đang làm"],["right now.","ngay bây giờ"]],[["What?!","cái gì?"]]],
   "time":{"start":143.8,"stop":149.7}},
  {"paneid":"p8-3",
   "xlation":["Tôi không thấy ai nữa.","Nhưng tôi không thể ngừng xem nó"],
   "words":[[["I","tôi"],["don't","không"],["see","thấy"],["those","họ"],["ants","kiến"],["anymore.","chút nào nữa"]],[["But","nhưng"],["I","tôi"],["can't","không thể"],["stop","ngừng"],["watching","xem"],["it","nó"],["somehow.","vì một lý do nào đó"]]],
   "time":{"start":149.7,"stop":154.9}},
  {"paneid":"p8-4",
   "xlation":["Làm ơn dừng  lại!"],
   "words":[[["Please","làm ơn"],["stop","dừng"],["it","nó"],["already!","rồi"]]],
   "time":{"start":154.9,"stop":156.8}}]];
MeoU.glosses[MeoU.DORAPLUS1CH10] = [[
  {"paneid":"p1-1",
   "xlation":[],
   "words":[],
   "time":{"start":0,"stop":2}}],
 [{"paneid":"p2-1",
   "xlation":["Tôi đã rửa xong những bức ảnh hôm qua đi dã ngoại "],
   "words":[[["I've","tôi"],["printed","đã in "],["the photos","những tấm hình"],["we","chúng tôi"],["took","chụp"],["during","trong khi"],["the hike.","chuyến dã ngoại"]]],
   "time":{"start":2,"stop":4.7}},
  {"paneid":"p2-2",
   "xlation":["Đây là của Giant.","Cảm ơn"],
   "words":[[["These","Đây là"],["are","to be"],["Giant's.","của Giant"]],[["Thank you.","Cảm ơn"]]],
   "time":{"start":4.7,"stop":6.8}},
  {"paneid":"p2-3",
   "xlation":["Bạn có chắc là chúng tôi không cần trả tiền lại cho bạn không?","Chắc chắn.","Của Sizuka đây.","Cảm ơn.","Nobita thật là hào phóng"],
   "words":[[["Are","to be"],["you","bạn"],["sure","chắc chắn"],["we","chúng ta"],["don't","không"],["need","cần"],["to pay","trả tiền"],["you","bạn"],["back?","lại?"]],[["Positive.","Chắc chắn"]],[["Here,","đây"],["Shizu-chan.","Shizu-chan"]],[["Thank you","cảm ơn"],["so","rất"],["much.","nhiều"]],[["You're","bạn"],["so","thật là"],["generous.","hào phóng"]]],
   "time":{"start":6.8,"stop":15}},
  {"paneid":"p2-4",
   "xlation":["Nobita chỉ có một tấm"],
   "words":[[["Nobita","Nobita"],["only","chỉ"],["gets","có"],["one","một"],["shot.","tấm"]]],
   "time":{"start":15,"stop":16.8}},
  {"paneid":"p2-5",
   "xlation":["Vì miễn phí nên các bạn tốt hơn là đừng kêu ca gì hết"],
   "words":[[["Since","vì"],["I","tôi"],["gave","đưa"],["it","nó"],["to","giới từ"],["you","bạn"],["for","giới từ"],["free,","miễn phí"],["you","bạn"],["better","tốt hơn"],["not","không"],["complain.","phàn nàn"]]],
   "time":{"start":16.8,"stop":20.4}},
  {"paneid":"p2-6",
   "xlation":["Những tấm hình này nhìn chán quá.","Hầu hết đều được chụp từ cùng một góc"],
   "words":[[["These","những"],["photos","tấm hình"],["are","to be"],["so","quá"],["boring.","chán"]],[["Most","Hầu hết"],["of","giới từ"],["them","họ"],["were taken","được chụp"],["from","từ"],["the same","giống nhau"],["angle.","góc"]]],
   "time":{"start":20.4,"stop":25.3}},
  {"paneid":"p2-7",
   "xlation":["Chúng tôi đi dã ngoại cùng nhau nhưng tôi chỉ có trong một tấm hình"],
   "words":[[["We","chúng ta"],["went","đi"],["hiking","dã ngoại"],["together","cùng với nhau"],["but","nhưng"],["I","tôi"],["was","to be"],["only","chỉ"],["in","trong"],["one","một"],["of","giới từ"],["the photos.","tấm hình"]]],
   "time":{"start":25.3,"stop":29.1}},
  {"paneid":"p2-8",
   "xlation":["Còn nữa, hãy nhìn vào tấm hình này"],
   "words":[[["Plus,","Thêm"],["look","nhìn"],["at","giới từ"],["this","này"],["picture.","bức hình"]]],
   "time":{"start":29.1,"stop":31.2}}],
 [{"paneid":"p3-1",
   "xlation":["Không phải quá đáng sao?","Sao anh ấy có thể làm vậy với tôi"],
   "words":[[["Isn't","không"],["that","điều đó"],["mean?","ích kỉ?"]],[["How","Sao"],["could","có thể"],["he","anh ấy"],["do","làm"],["that","điều đó"],["to","đến"],["me?","tôi"]]],
   "time":{"start":31.2,"stop":34.7}},
  {"paneid":"p3-2",
   "xlation":["Tôi đề nghị chụp hình cả nhóm, nhưng Suneo không cho và nói cứ để anh ấy lo.","Có rất nhiều cảnh núi đẹp.","Nhưng chẳng có cái nào được chụp cả"],
   "words":[[["I","tôi"],["offered","đề nghị"],["to","giới từ"],["take","chụp"],[" a picture","tấm hình"],["of","của"],["us,","chúng tôi"],["but","nhưng"],["Suneo","Suneo"],["didn't","không"],["allow","cho phép"],["it","nó"],["and","và"],["said","nói"],["to leave","để lại"],["everything","mọi thứ"],["to","giới từ"],["him.","anh ấy"]],[["There was","có"],["a lot of","nhiều"],["beautiful","đẹp"],["scenery","cảnh"],["at","tại"],["the mountain.","ngọn núi"]],[["But","nhưng"],["none","không"],["was","to be"],["captured.","được chụp"]]],
   "time":{"start":34.7,"stop":45.5}},
  {"paneid":"p3-3",
   "xlation":["Đừng khóc nữa.","Tôi có thể chỉnh bức hình của bạn"],
   "words":[[["Stop","ngừng"],["crying.","khóc"]],[["I","tôi"],["can","có thể"],["fix","sửa"],["your","của bạn"],["photo.","tấm hình"]]],
   "time":{"start":45.5,"stop":48.3}},
  {"paneid":"p3-4",
   "xlation":["Máy rửa ảnh như ý"],
   "words":[[["A preference        photo        printer.","Máy rửa ảnh như ý"]]],
   "time":{"start":48.3,"stop":50.2}},
  {"paneid":"p3-5",
   "xlation":["Nếu có bất kì tấm hình nào bạn không thích, chỉ cần đặt nó vào trong và nó sẽ được sửa ngay"],
   "words":[[["If","nếu"],["there's","có"],["any","bất kì"],["picture","tấm hình"],["you","bạn"],["don't","không"],["like,","thích"],["just","chỉ"],["put","đặt"],["it","nó"],["inside","bên trong"],["this","cái này"],["machine,","máy móc"],["and","và"],["it","nó"],["will","sẽ"],["be","to be"],["fixed","được sửa"],["immediately.","ngay lập tức"]]],
   "time":{"start":50.2,"stop":56.2}},
  {"paneid":"p3-6",
   "xlation":["Hãy sửa cái này"],
   "words":[[["Let's","hãy"],["fix","sửa"],["this","này"],["one.","cái"]]],
   "time":{"start":56.2,"stop":57.5}},
  {"paneid":"p3-7",
   "xlation":["Chúng ta\tcó thể\tthấy\tnó\ttrên\t\tmàn hình."],
   "words":[[["We","chúng ta"],["can","có thể"],["see","thấy"],["it","nó"],["on","trên"],["the monitor.","màn hình"]]],
   "time":{"start":57.5,"stop":59.1}}],
 [{"paneid":"p4-1",
   "xlation":["Tôi muốn mình được hiện ra đầy đủ"],
   "words":[[["I","Tôi"],["want","muốn"],["myself","chính tôi"],["to","giới từ"],[" be exposed.","được hiện diện"]]],
   "time":{"start":59.1,"stop":61}},
  {"paneid":"p4-2",
   "xlation":["Vậy thì chúng ta sẽ kéo bức hình qua bên phải"],
   "words":[[["So","vậy thì"],["we","chúng ta"],["need","cần"],["to drag","kéo"],["the picture","tấm hình"],["to the right","về phía bên phải"]]],
   "time":{"start":61,"stop":63.6}},
  {"paneid":"p4-3",
   "xlation":["Nó được sửa rồi"],
   "words":[[["It's","nó"],["fixed!","được sửa!"]]],
   "time":{"start":63.6,"stop":64.6}},
  {"paneid":"p4-4",
   "xlation":["In nó ra!"],
   "words":[[["Print","In "],["it!","nó!"]]],
   "time":{"start":64.6,"stop":65.3}},
  {"paneid":"p4-5",
   "xlation":["Cái máy này có thể sửa bất kì bức hình nào"],
   "words":[[["This","này"],["machine","máy móc"],["can","có thể"],["fix","sửa"],["any","bất kì"],["kind","loại"],["of","giới từ"],["picture.","tấm hình"]]],
   "time":{"start":65.3,"stop":67.9}},
  {"paneid":"p4-6",
   "xlation":["Tôi sẽ hỏi Shizu-chan xem cô ấy có muốn sửa tấm hình nào không"],
   "words":[[["I'll","tôi sẽ"],["ask","hỏi"],["Shizu-chan","Shizu-chan"],["if","liệu"],["she","cô ấy"],["wants","muốn"],["to fix","sửa"],["her","của cô ấy"],["pictures.","tấm hình"]]],
   "time":{"start":67.9,"stop":71.3}},
  {"paneid":"p4-7",
   "xlation":["Nhưng, tôi có tin bạn được không, Nobita?","Dĩ nhiên rồi"],
   "words":[[["But,","nhưng"],["can","có thể"],["I","tôi"],["trust","tin tưởng"],["you,","bạn"],["Nobita?","Nobita"]],[["Certainly.","tất nhiên rồi"]]],
   "time":{"start":71.3,"stop":75.2}},
  {"paneid":"p4-8",
   "xlation":["Mấy tấm hình này thật sự xấu.","Vậy thì hãy sửa nó nhanh thôi"],
   "words":[[["These","đây"],["are","to be"],["indeed","thật sự"],["some","một vài"],["bad","tệ"],["pictures.","tấm hình"]],[["Then","Vậy thì"],["let's","hãy"],["fix","sửa"],["them","chúng"],["quickly.","một cách nhanh chóng"]]],
   "time":{"start":75.2,"stop":79.9}},
  {"paneid":"p4-9",
   "xlation":["Chúng ta sẽ bắt đầu với tấm này"],
   "words":[[["We'll","chúng ta sẽ"],["start","bắt đầu"],["with","với"],["this","này"],["one.","thay thế \"picture\""]]],
   "time":{"start":79.9,"stop":81.5}}],
 [{"paneid":"p5-1",
   "xlation":["Tôi chưa  chuẩn bị thì SUneo đã chụp rồi.","Sẽ tốt hơn nếu chúng ta thay đổi góc "],
   "words":[[["I","Tôi"],["didn't","không"],["have","có"],["time","thời gian"],["to","để"],["pose","tạo dáng"],["when","khi"],["Suneo","Suneo"],["took","chụp"],["this","này"],["picture.","tấm hình"]],[["Maybe","có thể"],["it's","nó"],["better","tốt hơn"],["if","nếu"],["we","chúng ta"],["turn","chuyển"],["the angle.","góc"]]],
   "time":{"start":81.5,"stop":87.5}},
  {"paneid":"p5-2",
   "xlation":["Ah!","Nó thế nào?"],
   "words":[[["Ah!","ah"]],[["How","như thế nào"],["is","to be"],["it?","nó"]]],
   "time":{"start":87.5,"stop":89.1}},
  {"paneid":"p5-3",
   "xlation":["Tuyệt vời!","Tối đã nói rằng cái gì cũng sửa được mà"],
   "words":[[["Awesome!","Tuyệt vời"]],[["I","tôi"],["just","chỉ"],["want to","muốn"],["impress","nhấn mạnh"],["upon","giới từ"],["you","bạn"],["that","rằng"],["anything","bất cứ cái gì"],["can","có thể"],["be fixed.","được chỉnh sửa"]]],
   "time":{"start":89.1,"stop":93.9}},
  {"paneid":"p5-4",
   "xlation":["Còn cái này thì sao?"],
   "words":[[["What about","Còn"],["this?","cái này?"]]],
   "time":{"start":93.9,"stop":95.1}},
  {"paneid":"p5-5",
   "xlation":["Họ đang trêu chọc tôi vì đi chậm.","Để xem chuyện gì đang xảy ra chuyện gì phái bên phải"],
   "words":[[["They","họ"],["were","to be"],["mocking","chọc "],["me","tôi"],["since","vì"],["I","tôi"],["was","to be"],["so","quá"],["slow.","chậm"]],[["Let's","hãy"],["see","xem"],["what","cái gì"],["happened","xảy ra"],["on","bên"],["the","mạo từ"],["right","phải"],["side","phía"],["of","của"],["this","này"],["scene.","cảnh"]]],
   "time":{"start":95.1,"stop":101}},
  {"paneid":"p5-6",
   "xlation":["Tôi tìm thấy bạn rồi.","Bạn tốt hơn hết là không nên in tấm đó"],
   "words":[[["I","tôi"],["found","tìm thấy"],["you.","bạn"]],[["You","bạn"],["better","tốt hơn"],["not","không"],["print","in"],["that","đó"],["one","thay thế \"picture\""],["out.","ra"]]],
   "time":{"start":101,"stop":104.6}}],
 [{"paneid":"p6-1",
   "xlation":["Tôi là người đã thấy bông hoa này đầu tiên!"],
   "words":[[["I'm","Tôi"],["the one","người"],["who","mà"],["saw","thấy"],["this","này"],["flower","bông hoa"],["first!","đầu tiên!"]]],
   "time":{"start":104.6,"stop":106.8}},
  {"paneid":"p6-2",
   "xlation":["Nhưng SUneo đã đẩy tôi ra"],
   "words":[[["But","nhưng"],["Suneo","Suneo"],["pushed","đẩy"],["me","tôi"],["aside!","một bên"]]],
   "time":{"start":106.8,"stop":108.8}},
  {"paneid":"p6-3",
   "xlation":["Trong trường hợp này, hãy quay lại những gì đã xảy ra trước đó."],
   "words":[[["In","trong"],["that","đó"],["case,","trường hợp"],["let's","hãy"],["go","đi"],["back","trở lại"],["to","giới từ"],["what","cái gì"],["had happened","đã xảy ra"],["earlier.","trước đây"]]],
   "time":{"start":108.8,"stop":112.1}},
  {"paneid":"p6-4",
   "xlation":["Khoảng thời gian này?"],
   "words":[[["Around","khoản"],["this","này"],["time?","thời gian?"]]],
   "time":{"start":112.1,"stop":113.4}},
  {"paneid":"p6-5",
   "xlation":["Sớm hơn một tí, tôi đoán"],
   "words":[[["A","mạo từ"],["little","chút"],["earlier,","sớm"],["I","tôi"],["guess.","đoán"]]],
   "time":{"start":113.4,"stop":115.1}},
  {"paneid":"p6-6",
   "xlation":["Đây rồi!"],
   "words":[[["There you go !","đây rồi!"]]],
   "time":{"start":115.1,"stop":116.1}},
  {"paneid":"p6-7",
   "xlation":["Và còn về cái này?"],
   "words":[[["And","và"],["how about","còn"],["this","này"],["one?","cái?"]]],
   "time":{"start":116.1,"stop":117.6}},
  {"paneid":"p6-8",
   "xlation":[" Được rồi đấy"],
   "words":[[["Yup,","được"],["that's good","tốt đấy"]]],
   "time":{"start":117.6,"stop":118.7}}],
 [{"paneid":"p7-1",
   "xlation":["Nói về cái ống nhòm đó..."],
   "words":[[["Speaking","Nói "],["of","giới từ"],["binoculars...","ống nhòm"]]],
   "time":{"start":118.7,"stop":120.7}},
  {"paneid":"p7-2",
   "xlation":["Mỗi người đều có cơ hội để xem"],
   "words":[[["Everyone","mọi người"],["got","có"],["a turn","một cơ hội"],["to","giới từ"],["see","thấy"],["something.","vài thứ"]]],
   "time":{"start":120.7,"stop":123.4}},
  {"paneid":"p7-3",
   "xlation":["Nhưng tôi không được xem.","Anh ấy nói tôi sẽ làm hỏng nó mất"],
   "words":[[["But","nhưng"],["I","tôi"],["didn't","không"],["get","có"],["a","mạo từ"],["single","đơn"],["look.","nhìn"]],[["He","anh ấy"],["said","nói"],["that","rằng"],["I","tôi"],["would have","sẽ"],["broken","làm hỏng"],["his","của anh ấy"],["binoculars.","ống nhòm"]]],
   "time":{"start":123.4,"stop":128.8}},
  {"paneid":"p7-4",
   "xlation":["Có nhiều chim và động vậy, nhưng tôi không có cơ hội để xem chúng"],
   "words":[[["There","có"],["were","to be"],["a lot of","nhiều"],["birds","chim"],["and","và"],["animals,","động vật"],["but","nhưng"],["I","tôi"],["didn't","không"],["get","nhận được"],["a chance","cơ hội"],["to","giới từ"],["see","thấy"],["them","chúng"],["at all!","chút nào!"]]],
   "time":{"start":128.8,"stop":133.3}},
  {"paneid":"p7-5",
   "xlation":["Đừng lo lắng!","Ta vẫn có thể in bất kì thứ gì từ ống nhóm của họ.","Cậu đùa ah ?"],
   "words":[[["Don't","Đừng"],["worry!","lo lắng"]],[["We","chúng ta"],["can","có thể"],["also","cũng"],["print","in"],["anything","bất cứ gì"],["they","họ"],["saw","thấy"],["from","từ"],["the binoculars.","ống nhòm"]],[["Are","to be"],["you","bạn"],["serious?","nghiêm túc?"]]],
   "time":{"start":133.3,"stop":139.4}},
  {"paneid":"p7-6",
   "xlation":["In !"],
   "words":[[["Print!","In!"]]],
   "time":{"start":139.4,"stop":142.9}}],
 [{"paneid":"p8-1",
   "xlation":["In !"],
   "words":[[["Print!","In!"]]],
   "time":{"start":142.9,"stop":143.6}},
  {"paneid":"p8-2",
   "xlation":["Anh ấy đang nhìn vào cái gì vậy?","Suneo chết tiệt!"],
   "words":[[["What","Cái gì?"],["was","to be"],["he","anh ấy"],["looking","nhìn"],["at?","giới từ?"]],[["Darn","chết tiệt"],["Suneo!","Suneo"]]],
   "time":{"start":143.6,"stop":146.7}},
  {"paneid":"p8-3",
   "xlation":["In!"],
   "words":[[["Print!","In!"]]],
   "time":{"start":146.7,"stop":148.9}},
  {"paneid":"p8-4",
   "xlation":["Bây giờ tôi có rất nhiều tấm hình đẹp"],
   "words":[[["I've","tôi"],["got","có"],["lots of","nhiều"],["good","tốt"],["pictures","tấm hình"],["now.","bây giờ"]]],
   "time":{"start":148.9,"stop":151.1}},
  {"paneid":"p8-5",
   "xlation":["Vậy thì tớ cất cái máy này đi."],
   "words":[[["In","trong"],["that"," này"],["case,","trường hợp"],["I'll","tôi sẽ"],["remove","cất"],["the machine.","máy móc"]]],
   "time":{"start":151.1,"stop":153.6}},
  {"paneid":"p8-6",
   "xlation":["Tôi có thể sử dụng nó một chút được không?","Cho việc gì?"],
   "words":[[["Can","có thể"],["I","tôi"],["use","sử dụng"],["it","nó"],["a","mạo từ"],["little","chút"],["more?","thêm?"]],[["What","cái gì"],["for?","cho việc gì?"]]],
   "time":{"start":153.6,"stop":156.6}},
  {"paneid":"p8-7",
   "xlation":["Hôm đó trời mưa cả ngày"],
   "words":[[["It","nó"],["was","to be"],["raining","mưa"],["that","đó"],["day.","ngày"]]],
   "time":{"start":156.6,"stop":158}}],
 [{"paneid":"p9-1",
   "xlation":["Chúng tôi thấy một cái cầu vồng lớn nhưng chúng tôi hết phim"],
   "words":[[["We","Chúng tôi"],["saw","thấy"],["this","này"],["huge","lớn"],["rainbow,","cầu vồng"],["but","nhưng"],["we","chúng ta"],["were","to be"],["running out of","hết"],["film.","phim"]]],
   "time":{"start":158,"stop":161.5}},
  {"paneid":"p9-2",
   "xlation":["Để xem nào.","Miễn là tôi có thời điểm, thời gian và góc nhìn đúng thì đều có thể in được"],
   "words":[[["Let's","để"],["see","xem"],["it.","nó"]],[["As long as","miễn là"],["I","tôi"],["have","có"],["the","mạo từ"],["right","đúng"],["time,","thời gian"],["place,","nơi chốn"],["and","và"],["angle","góc nhìn"],["anything","bất cứ gì"],["can","có thể"],["be printed.","được in"]]],
   "time":{"start":161.5,"stop":167.6}},
  {"paneid":"p9-3",
   "xlation":["Nó kia rồi"],
   "words":[[["There it is!","nó kia rồi!"]]],
   "time":{"start":167.6,"stop":168.6}},
  {"paneid":"p9-4",
   "xlation":["Cầu vồng đẹp tuyệt phải không?","Hãy in nó và đưa cho mọi người"],
   "words":[[["It","nó"],["was","to be"],["a","mạo từ"],["beautiful","đẹp"],["rainbow,","cầu vồng"],["wasn't it?","phải không?"]],[["Let's","hãy"],["print","in "],["it","nó"],["and","và"],["give","đưa"],["it","nó"],["to","giới từ"],["everyone.","mọi người"]]],
   "time":{"start":168.6,"stop":173.4}},
  {"paneid":"p9-5",
   "xlation":[" tới cảnh này chúng tôi sắp đi đến con suôi"],
   "words":[[["In","trong"],["this","này"],["frame","cảnh"],["we","chúng ta"],["were","to be"],["going to","sắp"],["to","giới từ"],["see","xem"],["the river","con suối"]]],
   "time":{"start":173.4,"stop":175.9}},
  {"paneid":"p9-6",
   "xlation":["Xem này!","Tôi thấy cái gì đó đằng sau bụi cây!","Trông có vẻ quan trọng."],
   "words":[[["Wait!","đợi đã!"]],[["I","tôi"],["saw","thấy"],["something","vài thứ"],["behind","đàng sau"],["that bush.","bụi cây"]],[["Looks like","Trông có vẻ"],["something","vài thứ"],["important.","quan trọng"]]],
   "time":{"start":175.9,"stop":180.5}}],
 [{"paneid":"p10-1",
   "xlation":["Ống nhòm của Suneo"],
   "words":[[["Suneo's","của Suneo"],["binoculars!","Ống nhòm"]]],
   "time":{"start":180.5,"stop":182.2}},
  {"paneid":"p10-2",
   "xlation":["Anh ấy quên mang nó về nhà"],
   "words":[[["He","anh ấy"],["forgot","quên"],["to carry","mang"],["them","chúng"],["home.","nhà"]]],
   "time":{"start":182.2,"stop":183.9}},
  {"paneid":"p10-3",
   "xlation":["May cho anh ấy là không ai lấy chúng"],
   "words":[[["He's","anh ấy"],["lucky","may mắn"],["that","rằng"],["nobody","không có ai"],["took","lấy"],["them.","chúng"]]],
   "time":{"start":183.9,"stop":185.7}},
  {"paneid":"p10-4",
   "xlation":["Đừng nói dối nữa!","Chẳng phải bạn đã mang ống nhòm theo khi đi dã ngoại sao?","Mẹ nhầm rồi mẹ ơi."],
   "words":[[["Stop","đừng"],["lying","nói dối"],["to","giới từ"],["me!","tôi"]],[["Didn't","không phải"],["you","bạn"],["bring","mang"],["those","những"],["binoculars","ống nhòm"],["with","với"],["you","bạn"],["when","khi"],["you","bạn"],["were","to be"],["hiking?","đi dã ngoại"]],[["You're","bạn"],["mistaken,","nhầm"],["mama.","mẹ"]]],
   "time":{"start":185.7,"stop":192.4}},
  {"paneid":"p10-5",
   "xlation":["Tôi thề là tôi chưa bao giờ thấy những cái ống nhòm này trước đây.","Có vẻ như Suneo đang gặp rắc rối"],
   "words":[[["I","tôi"],["swear","thề "],["that","rằng"],["I've","tôi"],["never","không bao giờ"],["seen","thấy"],["those","này"],["binoculars.","ống nhòm"]],[["Looks like","trông có vẻ"],["Suneo","Suneo"],["is","to be"],["in trouble","gặp vấn đề"]]],
   "time":{"start":192.4,"stop":197.5}}]];
MeoU.glosses[MeoU.DORAPLUS1CH11] = [[
  {"paneid":"p1-1",
   "xlation":[],
   "words":[],
   "time":{"start":0,"stop":1.9}}],
 [{"paneid":"p2-1",
   "xlation":["Trả lại cột tóc đây!","Nếu muốn lấy lại thì tự đến đây mà lấy"],
   "words":[[["Give","trả"],["me","tôi"],["back","lại"],["my","của tôi"],["ribbon!","cột tóc"]],[["If","nếu"],["you","bạn"],["want","muốn"],["us","chúng tôi"],["to return","trả"],["it,","nó"],["you'll","bạn sẽ"],["need","cần"],["to take","lấy"],["it","nó"],["yourself.","chính bạn"]]],
   "time":{"start":1.9,"stop":7.4}},
  {"paneid":"p2-2",
   "xlation":["Này!"],
   "words":[[["Hey,","này"],["you!","bạn"]]],
   "time":{"start":7.4,"stop":8.3}},
  {"paneid":"p2-3",
   "xlation":["Chuyện gì?","Có gì muốn nói ư?"],
   "words":[[["What's up?","chuyện gì?"]],[["Do","trợ động từ"],["you","bạn"],["have","có"],["anything","bất cứ gì"],["to","giới từ"],["say?","nói?"]]],
   "time":{"start":8.3,"stop":11}},
  {"paneid":"p2-4",
   "xlation":["Tôi tưởng là anh ấy sẽ ngăn họ lại"],
   "words":[[["And","và"],["I","tôi"],["thought","nghĩ"],["he","anh ấy"],["was","to be"],["going to","sắp"],["stop","ngăn"],["them.","họ"]]],
   "time":{"start":11,"stop":13.4}}],
 [{"paneid":"p3-1",
   "xlation":["Hai bọn họ lúc nào cũng ăn hiếp người yếu"],
   "words":[[["Those","này"],["two","hai"],["always","luôn luôn"],["bully","bắt nạt"],["anyone","bất kì ai"],["weaker","yếu "],["than","hơn"],["them.","họ"]]],
   "time":{"start":13.4,"stop":16.8}},
  {"paneid":"p3-2",
   "xlation":["Có cách nào để tôi ngăn họ lại không?","Bất kì thứ gì cho Sizuka"],
   "words":[[["Is","to be"],["there","có"],["anything","bất cứ gì"],["I","tôi"],["can","có thể"],["do","làm"],["to","giới từ"],["stop","ngăn"],["them?","họ"]],[["Anything","bất cứ gì"],["for","cho"],["Shizu-chan","Shizu-chan"],[".",""]]],
   "time":{"start":16.8,"stop":21.4}},
  {"paneid":"p3-3",
   "xlation":["Thỏi son con voi"],
   "words":[[["An","mạo từ"],["elephant trunk lipstick.","thỏi son con voi"]]],
   "time":{"start":21.4,"stop":23.4}},
  {"paneid":"p3-4",
   "xlation":["Nếu tôi bôi cái này lên và đợi một lúc"],
   "words":[[["If","nếu"],["I","tôi"],["put","đặt"],["this","này"],["on,","lên"],["and","và"],["wait","đợi"],["for ","trong "],["a sec...","một giây"]]],
   "time":{"start":23.4,"stop":27}},
  {"paneid":"p3-5",
   "xlation":["Ai vậy?","Ai đó vừa đụng vào đầu tôi"],
   "words":[[["Who","ai"],["is","to be"],["it?","nó"]],[["Someone","ai đó"],["just","vừa mới"],["touched","chạm"],["my","của tôi"],["head.","cái đầu"]]],
   "time":{"start":27,"stop":29.8}},
  {"paneid":"p3-6",
   "xlation":["Nhìn kĩ hơn"],
   "words":[[["Look","nhìn"],["closer.","kĩ hơn"]]],
   "time":{"start":29.8,"stop":30.9}},
  {"paneid":"p3-7",
   "xlation":["Tôi trông giống một con voi phải không?","Môi của tôi thì đang giãn ra.","Chúng ta sẽ không thua Giant nữa."],
   "words":[[["I","tôi"],["look like","nhìn giống"],["an elephant,","một con voi"],["don't I?","phải không"]],[["My","của tôi"],["lips","môi"],["are","to be"],["stretching.","dài ra"]],[["You","bạn"],["won't","sẽ không"],["lose","thua"],["against","chống lại"],["Giant.","Giant"]]],
   "time":{"start":30.9,"stop":37.3}}],
 [{"paneid":"p4-1",
   "xlation":["Vừa rồi tôi chạy trốn.","Thật là hèn nhát."],
   "words":[[["I","Tôi"],["ran","chạy"],["away","khỏi"],["earlier.","vùa rồi"]],[["What","thật là"],["a coward.","người hèn nhát"]]],
   "time":{"start":37.3,"stop":40.3}},
  {"paneid":"p4-2",
   "xlation":["Lần này, tôi sẽ không chạy trốn!","Quyết định rồi.","Tôi luôn nhờ Doremon giúp đỡ nhưng lần này thì không."],
   "words":[[["This","này"],["time,","lần"],["I","tôi"],["will","sẽ"],["not","không"],["run away!","trốn chạy"]],[["It's","nó"],["decided"," được quyết định"],["then.","vậy thì"]],[["I've","tôi"],["always","luôn luôn"],["asked","yêu cầu"],["for","giới từ"],["Doraemon's","của Doraemon"],["help","giúp đỡ"],["but","nhưng"],["this","này"],["time...","lần"]]],
   "time":{"start":40.3,"stop":48.2}},
  {"paneid":"p4-3",
   "xlation":["Kể từ nay trở đi, tôi sẽ bảo về những ai bị Giant ăn hiếp.","Thật ư?"],
   "words":[[["From","kể từ"],["today","hôm nay"],["onwards,","về sau"],["I","tôi"],["will","sẽ"],["protect","bảo vệ"],["anyone","bất kì ai"],["who","người"],["gets","bị"],["bullied","bắt nạt"],["by","bởi"],["Giant!","Giant"]],[["Really?","Thật ư?"]]],
   "time":{"start":48.2,"stop":53.9}},
  {"paneid":"p4-4",
   "xlation":["Vật thì đi với chúng tôi"],
   "words":[[["Come","đi"],["with","với"],["us,","chúng tôi"],["then.","vậy thì"]]],
   "time":{"start":53.9,"stop":55.2}},
  {"paneid":"p4-5",
   "xlation":["Chúng tôi định chơi ở đây thì anh ấy đến chơi bóng chày và đuổi chúng tôi đi.","Tất cả mọi người hãy nghe đây!"],
   "words":[[["We","chúng tôi"],["were","to be"],["planning","lên kế hoạch"],["to","giới từ"],["play","chơi"],["at","tại"],["this","này"],["park,","công viên"],["but","nhưng"],["he","anh ấy"],["suddenly","đột nhiên"],["came","đến"],["to","giới từ"],["play","chơi"],["baseball","bóng chày"],["and","và"],["threw","ném"],["us","chúng tôi"],["out.","ngoài"]],[["Everyone,","mọi người"],["please","làm ơn"],["listen","nghe"],["to","giới từ"],["me.","tôi"]]],
   "time":{"start":55.2,"stop":62.8}},
  {"paneid":"p4-6",
   "xlation":["Nobita sẽ đánh bại Giant cho chúng ta!","Hãy cùng xem pha hành động của anh ấy!"],
   "words":[[["Nobita","Nobita"],["will","sẽ"],["defeat","hạ gục"],["Giant","Giant"],["for","cho"],["us!","chúng tôi"]],[["Let's","hãy"],["watch","coi chừng"],["him","anh ấy"],["in","giới từ"],["action!","hành động"]]],
   "time":{"start":62.8,"stop":67.2}},
  {"paneid":"p4-7",
   "xlation":["Xin lỗi, hãy để tôi gọi Doremon trước"],
   "words":[[["Sorry,","xin lỗi"],["let","hãy để"],["me","tôi"],["call","gọi"],["Doraemon","Doraemon"],["first.","trước"]]],
   "time":{"start":67.2,"stop":70.1}}],
 [{"paneid":"p5-1",
   "xlation":["Vậy là cậu khỏe mạnh lại rồi ah?","Tôi không nói thế.","Nobita-san!","Hãy cố lên"],
   "words":[[["So","Vậy là"],["you","bạn"],["got","trở nên"],["strong","mạnh mẽ"],["huh,","à"],["Nobita?","Nobita"]],[["I","tôi"],["didn't","không"],["say","nói"],["that.","thế"]],[["Nobita-san!","Nobita-san!"]],[["Do","Làm"],["your","của bạn"],["best!","tốt nhất"]]],
   "time":{"start":70.1,"stop":77.3}},
  {"paneid":"p5-2",
   "xlation":["Sau cùng thì anh ấy chỉ là một kẻ yếu đuối"],
   "words":[[["He's","Anh ấy"],["just","chỉ"],["a","mạo từ"],["weakling","kẻ yếu đuối"],["after","sau"],["all.","tất cả"]]],
   "time":{"start":77.3,"stop":79.9}},
  {"paneid":"p5-3",
   "xlation":["Chúng lại làm vậy nữa rồi.","Được rồi!"],
   "words":[[["They","họ"],["did","làm"],["it","nó"],["again.","nữa"]],[["Fine!","được rồi!"]]],
   "time":{"start":79.9,"stop":82.5}},
  {"paneid":"p5-4",
   "xlation":["Mình sẽ  dùng cái này"],
   "words":[[["I'll","tôi sẽ"],["put ","đặt"],["this","cái này"],["on.","lên"]]],
   "time":{"start":82.5,"stop":83.9}},
  {"paneid":"p5-5",
   "xlation":["Tại sao bạn đánh tôi?","Tớ phải hỏi lại mới đúng"],
   "words":[[["Why","tại sao"],["did","trợ động từ"],["you","bạn"],["hit","đánh"],["me?","tôi"]],[["I","tôi"],["can","có thể"],["ask","hỏi"],["you","bạn"],["the","mạo từ"],["same","giống nhau"],["thing!","thứ"]]],
   "time":{"start":83.9,"stop":87.4}}],
 [{"paneid":"p6-1",
   "xlation":["Vậy thì là Nobita!"],
   "words":[[["It","Nó"],["was","to be"],["Nobita,","Nobita"],["then!","vậy thì!"]]],
   "time":{"start":87.4,"stop":89.1}},
  {"paneid":"p6-2",
   "xlation":["Không được bắt nạt Nobita nữa!"],
   "words":[[["Don't","không"],["ever","bao giờ"],["bully","bắt nạt"],["Nobita","Nobita"],["again!","nữa!"]]],
   "time":{"start":89.1,"stop":91.7}},
  {"paneid":"p6-3",
   "xlation":["Bạn đang làm gì, Shizu-chan?","Phải chăng là.."],
   "words":[[["What","cái gì"],["are","to be"],["you","bạn"],["doing,","đang làm"],["Shizu-chan?","Shizu-chan"]],[["Could","có thể"],["it","nó"],["be...","là"]]],
   "time":{"start":91.7,"stop":95.1}},
  {"paneid":"p6-4",
   "xlation":["Bạn là người đánh chúng tôi?"],
   "words":[[["You're","bạn"],["the","mạo từ"],["one","người"],["who","mà"],["hit","đánh"],["us?","chúng tôi?"]]],
   "time":{"start":95.1,"stop":96.9}},
  {"paneid":"p6-5",
   "xlation":["Xin hãy để chúng tôi đi!","Cảm ơn nhiều Shizu-chan"],
   "words":[[["Please","làm ơn"],["let","hãy để"],["me","tôi"],["go!","đi"]],[["Thank you","Cảm ơn"],["so","rất"],["much,","nhiều"],["Shizu-chan.","Shizu-chan"]]],
   "time":{"start":96.9,"stop":101.5}}],
 [{"paneid":"p7-1",
   "xlation":["Nhưng mà để một người con gái cứu, thì thật đáng xấu hổ"],
   "words":[[["But","Nhưng"],["to","giới từ"],["think","nghĩ"],["that","rằng"],["I","tôi"],["was saved","được cứu"],["by","bởi"],["a girl,","một cô gái"],["how","thật"],["embarrassing!","đáng xấu hổ"]]],
   "time":{"start":101.5,"stop":107}},
  {"paneid":"p7-2",
   "xlation":["Tôi cũng muốn sử dụng son môi này.","Tôi không có nó nữa."],
   "words":[[["I","tôi"],["want","muốn"],["to use","sử dụng"],["that","đó"],["lipstick","son môi"],["too.","cũng"]],[["I","tôi"],["don't","không"],["have","có"],["it","nó"],["with","với"],["me","tôi"],["anymore.","nữa"]]],
   "time":{"start":107,"stop":111.5}},
  {"paneid":"p7-3",
   "xlation":["Bạn chỉ đang cố lừa tôi thôi!","Không phải đâu"],
   "words":[[["You","bạn"],["were","to be"],["just","chỉ"],["trying","cố"],["to deceive","lừa"],["me!","tôi"]],[["That's","nó"],["not","không"],["it.","nó"]]],
   "time":{"start":111.5,"stop":115.4}},
  {"paneid":"p7-4",
   "xlation":["Lần này, tôi sẽ thực sự bảo vệ các bạn"],
   "words":[[["This","này"],["time,","lần"],["I'll","tôi sẽ"],["really","thật sự"],["protect","bảo vệ"],["you guys.","các bạn"]]],
   "time":{"start":115.4,"stop":118.1}},
  {"paneid":"p7-5",
   "xlation":["Nobita, đó là thỏi son mực"],
   "words":[[["Nobita,","Nobita"],["that's","đó là"],["an","mạo từ"],["octopus ink lipstick!","thỏi son mực!"]]],
   "time":{"start":118.1,"stop":121.7}}]];

MeoU.glosses[MeoU.DORAPLUS1CH12] = [[
  {"paneid":"p1-1",
   "xlation":["Này, Có chuyện gì vậy?","Bạn nhìn căng thẳng quá!"],
   "words":[[["Hey,","này"],["what's up?","có chuyện gì vậy?"]],[["You","bạn"],["look","trông  có vẻ"],["so","rất"],["serious.","nghiêm trọng"]]],
   "time":{"start":0,"stop":3}},
  {"paneid":"p1-2",
   "xlation":["Hôm nay là sinh nhật Shizu-chan.","Tôi không biết tặng cậu ấy món quà đặc biệt nào cả."],
   "words":[[["Today","hôm nay"],["is","là"],["Shizu-chan's","của Shizu-chan"],["birthday.","sinh nhật"]],[["I","tôi"],["don't","không"],["know","biết"],["what","cái gì"],["special","đặc biệt"],["gift","quà"],["I","tôi"],["should","nên"],["give","đưa"],["her.","cô ấy"]]],
   "time":{"start":3,"stop":7.9}},
  {"paneid":"p1-3",
   "xlation":["Tôi từng nghe thấy cô ấy thích hộp âm nhạc.","Nhưng nó mắc quá"],
   "words":[[["I","tôi"],["heard","đã nghe"],["once","một lần"],["that","rằng"],["she","cô ấy"],["wants","muốn"],["a","một"],["music","âm nhạc"],["box.","hộp"]],[["But","nhưng"],["it's","nó"],["so","quá"],["expensive.","đắt"]]],
   "time":{"start":7.9,"stop":13}},
  {"paneid":"p1-4",
   "xlation":["Đành chịu thôi.","Đó là ước muốn của cô ấy.","Với lại cô ấy có nhiều búp bê rồi."],
   "words":[[["Can't be helped.","hết cách rồi"]],[["It's","Nó là"],["her","của cô ấy"],["wish.","điều ước"]],[["Besides,","bên cạnh đó"],["she","cô ấy"],["already","rồi"],["has","có"],["a lot of","nhiều"],["dolls.","búp bê"]]],
   "time":{"start":13,"stop":18.7}},
  {"paneid":"p1-5",
   "xlation":["Thật sự vì tôi thích Shizu-chan, tôi chẳng phiền khi tặng cô ấy món quà đắt tiền đâu."],
   "words":[[["Actually,","thật sự"],["since","vì"],["I","tôi"],["like","thích"],["Shizu-chan,","Shizu-chan"],["I","tôi"],["don't","không"],["mind","bận tâm"],["giving","cho"],["her","cô ấy"],["an","mạo từ"],["expensive","đắt"],["gift.","quà"]]],
   "time":{"start":18.7,"stop":23.9}},
  {"paneid":"p1-6",
   "xlation":["Ngốc quá!","Quan trọng nhất là tấm lòng của cậu.","Tôi sẽ tốn nhiều tiền mua quà cho cô ấy đâu.","Cậu nói có lý"],
   "words":[[["Fool!","Ngốc quá!"]],[["What","điều"],["matters","vấn đề"],["most","nhất"],["is","to be"],["that","rằng"],["it","nó"],["comes","đến"],["from","từ"],["your","của bạn"],["heart.","trái tim"]],[["I","tôi"],["won't","sẽ không"],["spend","chi"],["a lot of","nhiều"],["money","tiền"],["on","giới từ"],["her","của cô ấy"],["gift.","quà"]],[["Well,","Được thôi, "],["you've","bạn"],["got a point.","có lý"]]],
   "time":{"start":23.9,"stop":32.3}}],
 [{"paneid":"p2-1",
   "xlation":["Tôi hoàn toàn quên mất nó.","Doremon!"],
   "words":[[["I","Tôi"],["completely","hoàn toàn"],["forgot","quên"],["about","về"],["it.","nó"]],[["Doraemon!","Doraemon!"]]],
   "time":{"start":32.3,"stop":36.3}},
  {"paneid":"p2-2",
   "xlation":["Chuyện gì đã xảy ra?","Hãy cho tôi một hộp âm nhạc."],
   "words":[[["What's","cái gì"],["going on?","đang xảy ra"]],[["Please","làm ơn"],["give","cho"],["me","tôi"],["a music box.","hộp âm nhạc"]]],
   "time":{"start":36.3,"stop":41.2}},
  {"paneid":"p2-3",
   "xlation":["Món quà không cần mắc.","Quan trọng nhất là từ trái tim cậu."],
   "words":[[["A present","món quà"],["doesn't","không"],["need","cần"],["to be","to be"],["expensive.","đắt"]],[["What","điều"],["matters","vấn đề"],["the most","nhất"],["is","to be "],["your","của bạn"],["heart.","trái tim."]]],
   "time":{"start":41.2,"stop":46.4}},
  {"paneid":"p2-4",
   "xlation":["Bạn dạy đời thì chẳng giúp được gì đâu.","Làm gì đó đi!"],
   "words":[[["You","bạn"],["won't","sẽ không"],["help","giúp đỡ"],["me","tôi"],["by","bằng"],["lecturing.","giảng dạy"]],[["Do","làm"],["something!","điều gì đó"]]],
   "time":{"start":46.4,"stop":50.4}},
  {"paneid":"p2-5",
   "xlation":["Tôi không có hộp âm nhạc, nhưng..."],
   "words":[[["I","tôi"],["don't","không"],["have","có"],["a","mạo từ"],["music","âm nhạc"],["box,","hộp"],["but...","nhưng"]]],
   "time":{"start":50.4,"stop":53.3}},
  {"paneid":"p2-6",
   "xlation":["Thế còn bông hoa phát nhạc thì sao?"],
   "words":[[["What about","còn"],["a flower        recorder?","bông hoa phát nhạc?"]]],
   "time":{"start":53.3,"stop":56.6}},
  {"paneid":"p2-7",
   "xlation":["Đó không phải là hạt giống sao?","Đúng thế.","Hãy tìm một cái chậu để đựng nó."],
   "words":[[["Isn't","không phải"],["that","đó là"],["a seed?","hạt giống?"]],[["Yup.","được"]],[["Let's","hãy"],["find","tìm"],["a pot","một cái chậu"],["to","để"],["put","đặt"],["this","cái này"],["in.","trong"]]],
   "time":{"start":56.6,"stop":62.8}},
  {"paneid":"p2-8",
   "xlation":["Của bạn đây.","Kế tiếp, chúng ta mở nhạc lên để giúp hạt giống phát triển."],
   "words":[[["Here you go.","Của bạn đây"]],[["Next,","kế tiếp"],["we","chúng ta"],["put","đặt"],["some","một vài"],["music","âm nhạc"],["on","lên"],["to","để"],["help","giúp đỡ"],["the seed","hạt giống"],["grow.","lớn lên"]]],
   "time":{"start":62.8,"stop":68.4}}],
 [{"paneid":"p3-1",
   "xlation":["Âm nhạc sẽ là chất dinh dưỡng nuôi cây lớn lên"],
   "words":[[["The music","âm nhạc"],["will","sẽ"],["be","to be"],["a nutrient","chất dinh dưỡng"],["for","cho"],["the seed","hạt giống"],["to","để"],["grow.","lớn lên"]]],
   "time":{"start":68.4,"stop":72.9}},
  {"paneid":"p3-2",
   "xlation":["Khi hoa nở, nó sẽ phát lại tất cả âm nhạc mà nó đã nghe trong qua trình lớn lên"],
   "words":[[["When","khi"],["the flower","hoa"],["blooms,","nở"],["it","nó"],["will","sẽ"],["be","to be"],["play","chơi"],[" the music","nhạc"],["it's","nó"],["been listening","đã nghe"],["to","giới từ"],["all ","tất cả"],["the time.","thời gian"]]],
   "time":{"start":72.9,"stop":78.7}},
  {"paneid":"p3-3",
   "xlation":["Nhìn này"],
   "words":[[["Look.","nhìn"]]],
   "time":{"start":78.7,"stop":79.9}},
  {"paneid":"p3-4",
   "xlation":["Nó bắt đầu nảy mầm rồi"],
   "words":[[["It's","nó"],["already","rồi"],["starting","bắt đầu"],["to","giới từ"],["sprout.","nảy mầm."]]],
   "time":{"start":79.9,"stop":82.5}},
  {"paneid":"p3-5",
   "xlation":["Và nó cũng đã bắt đầu thu âm.","Hay quá"],
   "words":[[["And","và"],["it","nó"],["started","bắt đầu"],["recording","thu âm"],["too.","cũng"]],[["This","cái này"],["is","to be"],["fun!","vui"]]],
   "time":{"start":82.5,"stop":87}},
  {"paneid":"p3-6",
   "xlation":["Nobi-chan!","Đừng vào trong quá trình thu âm!"],
   "words":[[["Nobi-chan!","Nobi-chan!"]],[["Don't","đừng"],["come in","vào"],["during","trong"],["the","mạo từ"],["recording","ghi âm"],["process!","quá trình"]]],
   "time":{"start":87,"stop":91.9}},
  {"paneid":"p3-7",
   "xlation":["Mặc dù bạn đang nghỉ hè, nhưng bạn vẫn phải làm bài tập về nhà.","Đừng chỉ nghe nhạc cả ngày!"],
   "words":[[["Even though","mặc dù"],["you're","bạn"],["on","trong"],["summer break","kì nghỉ hè"],["you","bạn"],["still","vẫn"],["need","cần"],["to do","làm"],["your","của bạn"],["homework!","bài tập về nhà"]],[["Don't","đừng"],["just","chỉ"],["listen to","nghe"],["music","nhạc"],["all","cả"],["day","ngày"],["long!","dài"]]],
   "time":{"start":91.9,"stop":98.9}},
  {"paneid":"p3-8",
   "xlation":["Tôi sẽ làm bài tạp về nhà, và làm ơn yên lặng!"],
   "words":[[["I","tôi"],["will","sẽ"],["do","làm"],["my","của tôi"],["homework,","bài tập về nhà"],["but","nhưng"],["please","làm ơn"],["be","to be"],["quiet.","yên lặng"]]],
   "time":{"start":98.9,"stop":102.3}},
  {"paneid":"p3-9",
   "xlation":["Tôi nói thế thôi nhưng thật sự thì bất kì khi nào tôi ngồi vào bàn này thì đều buồn ngủ."],
   "words":[[["I","tôi"],["said","đã nói"],["that","như thế"],["but","nhưng"],["in fact","thật sự"],["anytime","bất kì khi nào"],["I'm","tôi"],["sitting","ngồi"],["at","tại"],["my","của tôi"],["table,","bàn"],["I","tôi"],["feel","cảm thấy"],["sleepy.","buồn ngủ"]]],
   "time":{"start":102.3,"stop":108.3}},
  {"paneid":"p3-10",
   "xlation":["Ngáy"],
   "words":[[["Snore.","ngáy"]]],
   "time":{"start":108.3,"stop":110.2}}],
 [{"paneid":"p4-1",
   "xlation":["Còn ba tiếng nữa cho tới khi nó trờ thành một bông hoa hoàn hảo."],
   "words":[[["Three","ba"],["more","hơn"],["hours","tiếng"],["until","cho đến khi"],["it","nó"],["turns into","chuyển thành"],["a","mạo từ"],["perfect","hoàn hảo"],["flower.","bông hoa"]]],
   "time":{"start":110.2,"stop":114.5}},
  {"paneid":"p4-2",
   "xlation":["Chán quá.","Cái radio sẽ tự chơi nhạc"],
   "words":[[["I'm","tôi"],["bored.","chán"]],[["The radio","radio"],["will","sẽ"],["keep","tiếp tục "],["playing","mở"],["by itself"," bằng chính nó"]]],
   "time":{"start":114.5,"stop":118.7}},
  {"paneid":"p4-3",
   "xlation":["Tôi sẽ đi ra ngoài"],
   "words":[[["I'm","tôi"],[" going to","sẽ đi"],["play","chơi"],["outside.","ngoài"]]],
   "time":{"start":118.7,"stop":121.1}},
  {"paneid":"p4-4",
   "xlation":["Ai đã để chậu hoa trong phòng khách và quên tắt nhạc thế này?"],
   "words":[[["Who","ai"],["put","đặt"],["the flower pot","chậu hoa"],["in","trong"],["the living room","phòng khách"],["and","và"],["forgot","quên"],["turn off","tắt"],["the stereo?","máy cát sét"]]],
   "time":{"start":121.1,"stop":126.1}},
  {"paneid":"p4-5",
   "xlation":["Chắc là Nobita rồi"],
   "words":[[["Must","hẳn"],["be","là"],["Nobita.","Nobita"]]],
   "time":{"start":126.1,"stop":127.9}},
  {"paneid":"p4-6",
   "xlation":["Chào buổi trưa.","Nobita có nhà không?"],
   "words":[[["Good afternoon.","Chào buổi trưa"]],[["Is","to be"],["Nobita","Nobita"],["home?","nhà"]]],
   "time":{"start":127.9,"stop":132}},
  {"paneid":"p4-7",
   "xlation":["Tớ đang học, nhưng tớ có thể nói chuyện với cậu.","Tớ không nghĩ cậu đang học."],
   "words":[[["Well,","được thôi"],["I'm","tôi"],["studying","đang học"],["now,","bây giờ"],["but,","nhưng"],["we","chúng ta"],["can","có thể"],["talk.","nói chuyện"]],[["I","tôi"],["don't","không"],["think","nghĩ"],["you're","bạn "],["studying.","đang học"]]],
   "time":{"start":132,"stop":138.7}},
  {"paneid":"p4-8",
   "xlation":["Tôi muốn nói chuyện về quà sinh nhật của Shzi-chan.","Tôi không biết phải mua gì cả"],
   "words":[[["I","tôi"],["want","muốn"],["to talk","nói"],["about","về"],["the matter","vấn đề"],["of","của"],["Shizu-chan's","của Shizu-chan"],["present.","quà"]],[["I","tôi"],["still","vẫn"],["have no idea","không ý kiến"],["what","cái gì"],["to","giới từ"],["buy.","mua"]]],
   "time":{"start":138.7,"stop":145.2}},
  {"paneid":"p4-9",
   "xlation":["Cậu có kế hoạch gì không?","Tớ đang nghĩ về có cái gì đó không tiêu hao nhiều tiền"],
   "words":[[["Are","to be"],["you","bạn"],["up to","dự định"],["to","giới từ"],["something?","vài thứ?"]],[["I'm","tôi"],["thinking","nghĩ"],["about","về"],["it","nó"],["too,","cũng"],["something","thứ nào đó"],["that","mà"],["doesn't","không"],["require","yêu cầu"],["a lot of","nhiều"],["money.","tiền"]]],
   "time":{"start":145.2,"stop":152.1}}],
 [{"paneid":"p5-1",
   "xlation":["Nhưng vì tôi thích Shizu-chan, tôi muốn tặng cô ấy món quà thật đặc biệt"],
   "words":[[["But","Nhưng "],["since","vì"],["I","tôi"],["like","thích"],["Shizu-chan,","Shizu-chan"],["I","tôi"],["want","muốn"],["to give","tặng"],["her","cô ấy"],["something","thứ gì đó"],["special.","đặc biệt"]]],
   "time":{"start":152.1,"stop":156.4}},
  {"paneid":"p5-2",
   "xlation":["Cậu khùng ah?","Tiêu tiền cho một món qùa ngu ngốc để làm gì?"],
   "words":[[["Are","to be"],["you","bạn"],["stupid?","ngu ngốc"]],[["What's","điều"],["the point","mục đích"],["of","của"],["spending","tiêu"],["your","của bạn"],["money","tiền"],["on","giới từ"],["a","mạo từ"],["stupid","ngu ngốc"],["gift?","quà?"]]],
   "time":{"start":156.4,"stop":161.5}},
  {"paneid":"p5-3",
   "xlation":["Còn bạn thì sao?","Bạn không mua bất cứ cái gì cho cô ấy ah?","Dĩ nhiên không!"],
   "words":[[["What about","Còn"],["you?","bạn"]],[["You","bạn"],["didn't","không"],["buy","mua"],["anything","bất kì cái gì"],["for","cho"],["her?","cô ấy?"]],[["Of course","dĩ nhiên"],["not!","không"]]],
   "time":{"start":161.5,"stop":166.7}},
  {"paneid":"p5-4",
   "xlation":["Điều quan trọng nhật là trái tim của bạn mà, phải không?","Được thôi, nếu bạn đõ điều đó"],
   "words":[[["What","điều"],["matters","gây vấn đề"],["the most","nhất"],["is","là"],["your","của bạn"],["heart,","trái tim"],["right?","đúng không?"]],[["Well,","vâng"],["if","nếu"],["you","bạn"],["say","nói"],["so.","như thế"]]],
   "time":{"start":166.7,"stop":172.7}},
  {"paneid":"p5-5",
   "xlation":["Thật là ngu ngốc!","Tại sao anh ấy để bông hoa ở đây?"],
   "words":[[["What","Thật là"],["a fool!","kẻ ngốc"]],[["Why","tại sao"],["did","trợ động từ"],["he","anh ấy"],["put","đặt"],["the","mạo từ"],["flower","bông hoa"],["here?","ở đây"]]],
   "time":{"start":172.7,"stop":176.4}},
  {"paneid":"p5-6",
   "xlation":["Được rồi!","Tôi sẽ tặng cô ấy điều gì từ trái của tôi.","Chúc may mắn."],
   "words":[[["Okay!",""]],[["I","tôi"],["will","sẽ"],["give","đưa"],["her","cô ấy"],["something","những thứ"],["special","đặc biệt"],["from","từ"],["my","của tôi"],["heart.","trái tim"]],[["Good luck","Chúc may mắn"]]],
   "time":{"start":176.4,"stop":181.3}},
  {"paneid":"p5-7",
   "xlation":["Tiện thể, còn quà của tôi thì sao?"],
   "words":[[["By the way,","nói cách khac"],["what about","còn"],["my","của tôi"],["gift?","quà"]]],
   "time":{"start":181.3,"stop":184.5}},
  {"paneid":"p5-8",
   "xlation":["Nhìn này, nó phát triển gần như hoàn chỉnh rồi đấy"],
   "words":[[["Look,","nhìn kìa, "],["it","nó"],["grew","phát triển"],["nearly","gần như"],["perfectly!","hoàn chỉnh"]]],
   "time":{"start":184.5,"stop":187.7}},
  {"paneid":"p5-9",
   "xlation":["Bông hoa sẽ nở trong bữa tiệc nên giữ bí mật nhé"],
   "words":[[["The","mạo từ"],["flower","bông hoa"],["will","sẽ"],["bloom","nở"],["during","trong"],["the party","bữa tiệc"],["so","thì thế"],["let's","hãy"],["keep","giữ"],["it","nó"],[" a secret.","bí mật"]]],
   "time":{"start":187.7,"stop":191.9}}],
 [{"paneid":"p6-1",
   "xlation":["SInh nhật vui vẻ, Shizu-chan"],
   "words":[[["Happy","vui vẻ"],["birthday,","sinh nhật"],["Shizu-chan!","Shizu-chan"]]],
   "time":{"start":191.9,"stop":194.8}},
  {"paneid":"p6-2",
   "xlation":["Hoa đã nở"],
   "words":[[["The","mạo từ"],["flower","hoa"],["has","đã"],["bloomed!","nở"]]],
   "time":{"start":194.8,"stop":197.1}},
  {"paneid":"p6-3",
   "xlation":["Tuyệt vời, làm sao một bông hoa như thế này có thể hát một bài hát?"],
   "words":[[["Amazing,","tuyệt vời"],["how","như thế nào"],["could","có thể"],["this","này"],["flower","hoa"],["sing","hát"],[" a song?","bái hát"]]],
   "time":{"start":197.1,"stop":200.9}},
  {"paneid":"p6-4",
   "xlation":["Tức quá, anh ấy lừa mình!","Không thể tha thứ được"],
   "words":[[["Darn,","chết tiệt"],["he's","anh ấy"],["tricked up !","lừa đảo"]],[["Unforgivable!","không thể tha thứ được"]]],
   "time":{"start":200.9,"stop":204.6}},
  {"paneid":"p6-5",
   "xlation":["Nobi-chan!"],
   "words":[[["Nobi-chan!","Nobi-chan!"]]],
   "time":{"start":204.6,"stop":206.2}},
  {"paneid":"p6-6",
   "xlation":["Có chút rắc rối trong lúc thu âm.","Bạn hãy lắng nghe nhé"],
   "words":[[["Something","vài thứ"],["went wrong","vấn đề"],["wrong","sai"],["during","trong khi"],["the","mạo từ"],["recording","ghi âm"],["process.","tiến hành"]],[["Please","làm ơn"],["enjoy","thưởng thức "],["the rest","phần còn lại"],["of","của"],["it.","nó"]]],
   "time":{"start":206.2,"stop":213}},
  {"paneid":"p6-7",
   "xlation":["Nó không phát nhạc nữa.","Nó ghi âm lại tất cả những gì nó nghe thấy."],
   "words":[[["It","nó"],["no longer","không còn nữa"],["plays","chơi"],["music.","music."]],[["It","nó"],["recorded","được ghi âm lại"],["everything","mọi thứ"],["it","nó"],["heard.","nghe"]]],
   "time":{"start":213,"stop":218.1}}],
 [{"paneid":"p7-1",
   "xlation":["Ai đã đặt chậu hoa vào trong phòng khách và quên đèn phòng vệ sinh.","Cái gì đây?"],
   "words":[[["Who","Ai "],["put","đặt"],["the flower pot","chậu hoa"],["in","trong"],["the","mạo khác"],["and","và"],["forgot","quên"],["to turn off","tắt"],["the stereo?","máy nghe nhạc"]],[["What's","cái gì"],["this?","đây?"]]],
   "time":{"start":218.1,"stop":225.2}},
  {"paneid":"p7-2",
   "xlation":["Nó không phát bất kì các gì vào lúc này nữa.","Thật bất kì"],
   "words":[[["It's","nó"],["not","không"],["playing","ang chơi"],["anything","bất cứ gì"],["at all","cả"],["now.","bây giờ"]],[["That's","thật"],["weird.","kì lạ"]]],
   "time":{"start":225.2,"stop":230.3}},
  {"paneid":"p7-3",
   "xlation":["Vâng, bây giờ tôi đang học.","Nghe quen quá"],
   "words":[[["Well,","vậy"],["I'm","tôi"],["studying","đang học"],["now,","bây giờ"],["but..","nhưng"]],[["It","nó"],["sounds","nghe có vẻ"],["familiar.","quen thuộc"]]],
   "time":{"start":230.3,"stop":235.7}},
  {"paneid":"p7-4",
   "xlation":["Cái gi?"," Bông hoa được để  trong phòng tôi ư"],
   "words":[[["What?","cái gì?"]],[["The","mạo từ"],["flower",""],["had been","có"],["in","trong"],["my","của tôi"],["room?","phòng"]]],
   "time":{"start":235.7,"stop":239.5}},
  {"paneid":"p7-5",
   "xlation":["Mục đích của việc tốn tiền cho một món quà ngu ngốc để làm gì?","Im đi!"],
   "words":[[["What's","cái gì"],["the point ","mục đích"],["of","giới từ"],["spending","chi tiền"],["your","của bạn"],["money","tiền"],["on","giới từ"],["a","mạo từ"],["stupid","ngu ngốc"],["gift?","quà?"]],[[" Shut up!","im đi"]]],
   "time":{"start":239.5,"stop":244.8}},
  {"paneid":"p7-6",
   "xlation":["Sinh nhật vui vẻ, Shizuchan!"],
   "words":[[["Happy","hạnh phúc"],["birthday,","sinh nhật"],["Shizu-chan!","Shizu-chan"]]],
   "time":{"start":244.8,"stop":247.8}}]];
[[
  {"paneid":"p1-1",
   "xlation":[],
   "words":[],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p2-1",
   "xlation":["Trời ơi, nóng quá.","Nếu chúng ta có thể đi biển thì tuyệt biết mấy.","Tôi muốn đi đến đó ngay bây giờ"],
   "words":[[["Geez,","Trời"],["it's","trời"],["so","quá"],["hot.","nóng"]],[["It'd","Nó"],["be","to be"],["nice","tốt"],["if","nếu"],["we","chúng ta"],["could","có thể"],["go","đi"],["to","đến"],["the beach.","biển"]],[["I","tôi"],["want","muốn"],["to go","đi"],["there","đó"],["now.","bây giờ"]]],
   "time":{"start":0,"stop":7.3}},
  {"paneid":"p2-2",
   "xlation":["Nhưng bố mẹ sẽ không cho chúng ta đi đâu, phải không?","Chắc là thế rồi!"],
   "words":[[["But","nhưng"],["our","của chúng ta"],["parents","bố mẹ"],["wouldn't","sẽ không"],["let","để"],["us","chúng ta"],["children","con"],["go","đi"],["by ourselves","một mình"],["would they?","đúng không?"]],[["Most","hầu hết"],["likely","có vẻ như"],["not...","không"]]],
   "time":{"start":7.3,"stop":13.3}},
  {"paneid":"p2-3",
   "xlation":["Tôi thì không.","Tôi có thể đi bất cứ lúc nào với cánh cửa thần kỳ."],
   "words":[[["Not","không"],["for","dành cho"],["me.","tôi"]],[["I","tôi"],["can","có thể"],["go","đi"],["anytime","bất kì khi nào"],["with","với"],["the teleport        door.","cách cửa thần kì"]]],
   "time":{"start":13.3,"stop":17.8}},
  {"paneid":"p2-4",
   "xlation":["Bạn thật may mắn!","Chúng tôi có thể di với bạn không?","Làm ơn...","Tôi biết mà"],
   "words":[[["You're","bạn"],["lucky!","may mắn"]],[["Can","có thể"],["we","chúng tôi"],["go","đi"],["with","với"],["you?","bạn"]],[["Please...","làm ơn"]],[["I","tôi"],["knew","biết"],["it.","nó"]]],
   "time":{"start":17.8,"stop":22.9}},
  {"paneid":"p2-5",
   "xlation":["Nếu vậy thì, tất cả mọi người hãy nói rằng\" Cảm ơn Nobita đã cho tụi tớ đi cùng\""],
   "words":[[["In","trong"],["that","này"],["case,","trường hợp"],["everyone,","mọi người"],["please","làm ơn"],["say","nói"],["Nobita-kun,        ","Nobita-kun,      "],["thank you","cảm ơn"],["so","rất"],["much","nhiều"],["for","vì"],["taking","mang"],["us","chúng tôi"],["with","với"],["you","bạn"]]],
   "time":{"start":22.9,"stop":28.5}},
  {"paneid":"p2-6",
   "xlation":[" Cảm ơn đã cho tụi tớ đi cùng.","Và đừng quên mang thức ăn đấy.","Chúng ta sẽ ăn trưa tại bờ biển"],
   "words":[[["Thank you","Cảm ơn"],["so","rất"],["much","nhiều"],["for","vì"],["taking","dắt"],["us","chúng tôi"],["with","với"],["you.","bạn"]],[["And","và"],["don't","đừng"],["forget","quên"],["to bring","mang"],["lots of","nhiều"],["snacks.","đồ ăn nhẹ"]],[["We","chúng ta"],["will","sẽ"],["eat","ăn"],["by","gần"],["the coast","bãi biển"],["for","giới từ"],["lunch.","bữa trưa"]]],
   "time":{"start":28.5,"stop":37.1}},
  {"paneid":"p2-7",
   "xlation":["Có chuyện gì với anh ấy vậy?","Anh ấy cư xử như thể mình là một ông vua"],
   "words":[[["What's wrong","Chuyện gì"],["with","với"],["him?","anh ấy"]],[["He","anh ấy"],["acts","cư xử"],["as if","như thể"],["he's","anh ấy"],["a king","vua"]]],
   "time":{"start":37.1,"stop":40.9}}],
 [{"paneid":"p3-1",
   "xlation":["Anh ấy thật hiểu mình"],
   "words":[[["He","anh ấy"],["understands","hiểu"],["me","tôi"],["well.","tốt"]]],
   "time":{"start":40.9,"stop":44.1}},
  {"paneid":"p3-2",
   "xlation":["Tôi làm được rồi"],
   "words":[[["I","tôi"],["made","làm được "],["it.","nó"]]],
   "time":{"start":44.1,"stop":45.8}},
  {"paneid":"p3-3",
   "xlation":["Vì trời lúc nãy nóng quá nên tôi đi đến Nan Cực.","Nhưng tôi lỡ khóa cửa"],
   "words":[[["Since","Vì"],["it","trời"],["was","to be"],["so","quá"],["hot","nóng"],["earlier,","lúc nãy"],["I","tôi"],["went","đi"],["to","đến"],["the","mạo từ"],["South","Nam"],["Pole.","cực"]],[["But","nhưng"],["I","tôi"],["accidentally","vô tình"],["locked","khoá"],["the door.","cửa"]]],
   "time":{"start":45.8,"stop":51.6}},
  {"paneid":"p3-4",
   "xlation":["Tôi phải tìm đường vền hà bằng mọi giá, vì thế tôi đâm đầu vào cửa"],
   "words":[[["I","tôi"],["had to","phải"],["find","tìm"],["a way","cách"],["to get home","về nhà"],["regardless,","bằng mọi giá"],["so","vì thế"],["I","tôi"],["rammed","đụng "],["my","của tôi"],["head","đầu"],["into","vào trong"],["the door.","cửa"]]],
   "time":{"start":51.6,"stop":57.2}},
  {"paneid":"p3-5",
   "xlation":["Đợi đã!","Vậy có nghĩa là chúng ta không thể sử dụng nó bây giờ sao?","Sau khi tôi sửa bạn có thể xài."],
   "words":[[["Wait!","đợi đã"]],[["So","vậy"],["it","nó"],["means","có nghĩa là"],["that","rằng"],["we","chúng ta"],["can't","không thể"],["use","sử dụng"],["the door","cánh cửa"],["now?","bây giờ"]],[["You","bạn"],["can","có thể"],["use","sử dụng"],["it","nó"],["after","sau khi"],["I","tôi"],["fix","sửa"],["it.","nó"]]],
   "time":{"start":57.2,"stop":63.1}},
  {"paneid":"p3-6",
   "xlation":["Tôi sẽ làm ji bây giờ?"],
   "words":[[["What","cái gì"],["will","sẽ"],["I","tôi"],["do","làm"],["now?","bây giờ?"]]],
   "time":{"start":63.1,"stop":64.8}}],
 [{"paneid":"p4-1",
   "xlation":["Tôi đã hứa sẽ mang mọi người ra biển.","Tôi đã nó bạn là đừng có hứa cuội rồi."],
   "words":[[["I","tôi"],["promised","hứa"],["everyone","mọi người"],["I'd","tôi"],["take","dắt"],["them","họ"],["to","giới từ"],["the beach.","biển"]],[["I","tôi"],["told","đã nói"],["you","bạn"],["not","không"],["to","giới từ"],["make","làm"],["unreal","không thật"],["promises!","lời hứa"]]],
   "time":{"start":64.8,"stop":71.6}},
  {"paneid":"p4-2",
   "xlation":["Để xem tôi có thể giúp gì cho bạn"],
   "words":[[["Let","để"],["me","tôi"],["see","xem"],["what","cái gì"],["I","tôi"],["can","có thể"],["do","làm"],["for","cho "],["you.","bạn"]]],
   "time":{"start":71.6,"stop":74.2}},
  {"paneid":"p4-3",
   "xlation":["Chân nến ảo giác"],
   "words":[[["A mirage candle","Chân nến ảo giác"]]],
   "time":{"start":74.2,"stop":76.3}},
  {"paneid":"p4-4",
   "xlation":["Lấy một cái nến đi"],
   "words":[[["Bring","mang"],["me","tôi"],["a candlestick.","nến"]]],
   "time":{"start":76.3,"stop":78.2}},
  {"paneid":"p4-5",
   "xlation":["Biển và nến....","Chẳng thấy liên quan gì đến nhau"],
   "words":[[["The ocean","biển"],["and","và"],["a candlestick...","nến"]],[["I","tôi"],["can","có thể"],["hardly","khó lòng"],["see","thấy"],["the connection.","sự liên kết"]]],
   "time":{"start":78.2,"stop":83.5}},
  {"paneid":"p4-6",
   "xlation":["Sao tối vậy?","Đưa tôi cây nến"],
   "words":[[["Why","tại sao"],["is","to be"],["it","nó"],["so","quá"],["dark?","tối"]],[["Give","đưa"],["me","tôi"],["the candle.","nến"]]],
   "time":{"start":83.5,"stop":87.2}},
  {"paneid":"p4-7",
   "xlation":["Trong lúc tôi giữ cây nến này"],
   "words":[[["While","trong lúc"],["I'm","tôi"],["holding","đang giữ"],["this","này"],["candle...","nến"]]],
   "time":{"start":87.2,"stop":89.8}},
  {"paneid":"p4-8",
   "xlation":["Tôi sẽ cố tưởng tượng cảnh ở Nam Cực lúc nãy"],
   "words":[[["I'll","tôi sẽ"],["try","thử"],["to imagine","tưởng tượng"],["the scene","cảnh"],["at","tại"],["the South","phía Nam"],["Pole","cực"],["where","nơi"],["I","tôi"],["was","to be"],["at","giới từ"],["earlier.","lúc nãy"]]],
   "time":{"start":89.8,"stop":94.7}}],
 [{"paneid":"p5-1",
   "xlation":["Trời đang sáng hơn.","Bạn thấy gì?"],
   "words":[[["It's","nó"],["getting","trở nên"],["brighter.","sáng hơn"]],[["What","cái gì"],["do","trợ động từ"],["you","bạn"],["see?","thấy?"]]],
   "time":{"start":94.7,"stop":98.1}},
  {"paneid":"p5-2",
   "xlation":["Nam Cực"],
   "words":[[["The South","Nam "],["Pole!","Cực"]]],
   "time":{"start":98.1,"stop":100.2}},
  {"paneid":"p5-3",
   "xlation":["Tôi muốn chơi với chim cánh cụt"],
   "words":[[["I","tôi"],["want","muốn"],["to play","chơi"],["with","với"],["those","những"],["penguins!","chim cánh cụt"]]],
   "time":{"start":100.2,"stop":103.3}},
  {"paneid":"p5-4",
   "xlation":["Đừng quên là chúng ta vẫn ở trong phòng bạn"],
   "words":[[["Don't","đừng"],["forget","quên"],["that","rằng"],["we're","chúng ta"],["still","vẫn"],["in","trong"],["your","của bạn"],["room.","phòng"]]],
   "time":{"start":103.3,"stop":106.2}},
  {"paneid":"p5-5",
   "xlation":["Vậy đây là bức tường ư?","Nhưng có cảm giác như giống như cậu đang ở Nam Cực phải không?"],
   "words":[[["So","vậy"],["this","đây"],["is","to be"],["a wall?","tường"]],[["But","nhưng"],["it","nó"],["feels","cảm thấy"],["as if","như thể"],["you're","bạn "],["really","thật sự"],["at","ở"],[" the South","Nan"],["Pole,","Cực"],["doesn't it?","phải không?"]]],
   "time":{"start":106.2,"stop":112.2}},
  {"paneid":"p5-6",
   "xlation":["Với cây nến này, tôi cũng có thể đi biển phải không?","Đúng vậy"],
   "words":[[["With","với"],["this","này"],["candle,","nến"],["can","có thể"],["I","tôi"],["also","cũng"],["go","đi"],["to","giới từ"],["the beach?","biển?"]],[["That's right","chính xác"]]],
   "time":{"start":112.2,"stop":117}}],
 [{"paneid":"p6-1",
   "xlation":["ảo giác của bãi biển.."],
   "words":[[["A mirage","ảo giác"],["of","của"],["a sea","biển"]]],
   "time":{"start":117,"stop":119.7}},
  {"paneid":"p6-2",
   "xlation":["Cát thật ấm.","Tôi nghĩ thế này là được rồi"],
   "words":[[["The sand","cát"],["is","to be"],["pretty","khá"],["warm.","ấm"]],[["This","này"],["is","to be"],["good","tốt"],["enough,","đủ"],["I","tôi"],["guess.","đoán"]]],
   "time":{"start":119.7,"stop":124}},
  {"paneid":"p6-3",
   "xlation":["Chúng tôi tới đây"],
   "words":[[["We're","chúng tôi"],["coming.","đang đến"]]],
   "time":{"start":124,"stop":125.6}},
  {"paneid":"p6-4",
   "xlation":["Tuyệt quá!"],
   "words":[[["Wonderful!","Thật tuyệt"]]],
   "time":{"start":125.6,"stop":128.9}},
  {"paneid":"p6-5",
   "xlation":["LÀm ơn đừng bơi xa quá"],
   "words":[[["Please","làm ơn"],["don't","đừng"],["swim","bơi"],["too","quá"],["far.","xa"]]],
   "time":{"start":128.9,"stop":131.4}},
  {"paneid":"p6-6",
   "xlation":["Tôi bơi nhanh không này?"],
   "words":[[["I'm","tôi"],["a","mạo từ"],["fast","nhanh"],["swimmer,","người bơi"],[" aren't I?","đúng không?"]]],
   "time":{"start":131.4,"stop":134.1}},
  {"paneid":"p6-7",
   "xlation":["Nếu bạn bơi xa hơn 3 mét sẽ rất nguy hiểm đó"],
   "words":[[["It'll","nó sẽ"],["be","to be"],["dangerous","nguy hiểm"],["if","nếu"],["you","bạn"],["swim","bơi"],[" more than","hơn"],["three","ba"],["meters.","mét"]]],
   "time":{"start":134.1,"stop":137.8}}],
 [{"paneid":"p7-1",
   "xlation":["Tôi vừa mới đụng vào htuws gì đóvô hình.","Chúng ta nên ăn trưa bây giờ.","Đập dưa hấu thôi"],
   "words":[[["I","tôi"],["just","vừa mới"],["bumped","đụng"],["into","vào "],["something","thứ gì đó"],["invisible.","vô hình"]],[["We","chúng ta"],["should","nên"],["eat","ăn"],["our","của chúng ta"],["lunch","bữa trưa"],["now.","bây giờ"]],[["Let's","hãy"],["break","bổ"],["this","này"],["watermelon.","dưa hấu"]]],
   "time":{"start":137.8,"stop":144.8}},
  {"paneid":"p7-2",
   "xlation":["Dừng lại!","Bạn sẽ đập trúng cửa mất!"],
   "words":[[["Stop!","dừng lại"]],[["You're","bạn"],["going to","sẽ"],["hit","đánh"],["the door!","cửa"]]],
   "time":{"start":144.8,"stop":147.8}},
  {"paneid":"p7-3",
   "xlation":["Nến sắp tắt rồi"],
   "words":[[["Our","của chúng ta"],["candle","ngọn nến"],["is","to be"],["running out","hết"]]],
   "time":{"start":147.8,"stop":150.2}},
  {"paneid":"p7-4",
   "xlation":["Mọi người về nhà đi"],
   "words":[[["Please","làm ơn"],["go","đi về"],["home","nhà"],["now,","bây giờ"],["everyone.","mọi người"]]],
   "time":{"start":150.2,"stop":152.8}},
  {"paneid":"p7-5",
   "xlation":["Trời ơi, họ để rác khắp nơi.","Họ thật vô trách nhiệm!"],
   "words":[[["Geez,","Trời ơi"],["they","họ"],["left","để lại"],["their","của họ"],["trash","rác"],["everywhere.","khắp nơi"]],[["They","họ"],["are","to be"],["all","tất cả"],["so","quá"],["irresponsible!","vô trách nhiệm"]]],
   "time":{"start":152.8,"stop":158.1}}]]
MeoU.glosses[MeoU.DORAPLUS1CH13] = [[
  {"paneid":"p1-1",
   "xlation":[],
   "words":[],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p2-1",
   "xlation":["Trời ơi, nóng quá.","Nếu chúng ta có thể đi biển thì tuyệt biết mấy.","Tôi muốn đi đến đó ngay bây giờ"],
   "words":[[["Geez,","Trời"],["it's","trời"],["so","quá"],["hot.","nóng"]],[["It'd","Nó"],["be","to be"],["nice","tốt"],["if","nếu"],["we","chúng ta"],["could","có thể"],["go","đi"],["to","đến"],["the beach.","biển"]],[["I","tôi"],["want","muốn"],["to go","đi"],["there","đó"],["now.","bây giờ"]]],
   "time":{"start":0,"stop":7}},
  {"paneid":"p2-2",
   "xlation":["Nhưng bố mẹ sẽ không cho chúng ta đi đâu, phải không?","Chắc là thế rồi!"],
   "words":[[["But","nhưng"],["our","của chúng ta"],["parents","bố mẹ"],["wouldn't","sẽ không"],["let","để"],["us","chúng ta"],["children","con"],["go","đi"],["by ourselves","một mình"],["would they?","đúng không?"]],[["Most","hầu hết"],["likely","có vẻ như"],["not...","không"]]],
   "time":{"start":7,"stop":13}},
  {"paneid":"p2-3",
   "xlation":["Tôi thì không.","Tôi có thể đi bất cứ lúc nào với cánh cửa thần kỳ."],
   "words":[[["Not","không"],["for","dành cho"],["me.","tôi"]],[["I","tôi"],["can","có thể"],["go","đi"],["anytime","bất kì khi nào"],["with","với"],["the teleport        door.","cách cửa thần kì"]]],
   "time":{"start":13,"stop":17.5}},
  {"paneid":"p2-4",
   "xlation":["Bạn thật may mắn!","Chúng tôi có thể di với bạn không?","Làm ơn...","Tôi biết mà"],
   "words":[[["You're","bạn"],["lucky!","may mắn"]],[["Can","có thể"],["we","chúng tôi"],["go","đi"],["with","với"],["you?","bạn"]],[["Please...","làm ơn"]],[["I","tôi"],["knew","biết"],["it.","nó"]]],
   "time":{"start":17.5,"stop":22.6}},
  {"paneid":"p2-5",
   "xlation":["Nếu vậy thì, tất cả mọi người hãy nói rằng\" Cảm ơn Nobita đã cho tụi tớ đi cùng\""],
   "words":[[["In","trong"],["that","này"],["case,","trường hợp"],["everyone,","mọi người"],["please","làm ơn"],["say","nói"],["Nobita-kun,        ","Nobita-kun,      "],["thank you","cảm ơn"],["so","rất"],["much","nhiều"],["for","vì"],["taking","mang"],["us","chúng tôi"],["with","với"],["you","bạn"]]],
   "time":{"start":22.6,"stop":28.2}},
  {"paneid":"p2-6",
   "xlation":[" Cảm ơn đã cho tụi tớ đi cùng.","Và đừng quên mang thức ăn đấy.","Chúng ta sẽ ăn trưa tại bờ biển"],
   "words":[[["Thank you","Cảm ơn"],["so","rất"],["much","nhiều"],["for","vì"],["taking","dắt"],["us","chúng tôi"],["with","với"],["you.","bạn"]],[["And","và"],["don't","đừng"],["forget","quên"],["to bring","mang"],["lots of","nhiều"],["snacks.","đồ ăn nhẹ"]],[["We","chúng ta"],["will","sẽ"],["eat","ăn"],["by","gần"],["the coast","bãi biển"],["for","giới từ"],["lunch.","bữa trưa"]]],
   "time":{"start":28.2,"stop":36.8}},
  {"paneid":"p2-7",
   "xlation":["Có chuyện gì với anh ấy vậy?","Anh ấy cư xử như thể mình là một ông vua"],
   "words":[[["What's wrong","Chuyện gì"],["with","với"],["him?","anh ấy"]],[["He","anh ấy"],["acts","cư xử"],["as if","như thể"],["he's","anh ấy"],["a king","vua"]]],
   "time":{"start":36.8,"stop":40.6}}],
 [{"paneid":"p3-1",
   "xlation":["Anh ấy thật hiểu mình"],
   "words":[[["He","anh ấy"],["understands","hiểu"],["me","tôi"],["well.","tốt"]]],
   "time":{"start":40.6,"stop":43.8}},
  {"paneid":"p3-2",
   "xlation":["Tôi làm được rồi"],
   "words":[[["I","tôi"],["made","làm được "],["it.","nó"]]],
   "time":{"start":43.8,"stop":45.5}},
  {"paneid":"p3-3",
   "xlation":["Vì trời lúc nãy nóng quá nên tôi đi đến Nan Cực.","Nhưng tôi lỡ khóa cửa"],
   "words":[[["Since","Vì"],["it","trời"],["was","to be"],["so","quá"],["hot","nóng"],["earlier,","lúc nãy"],["I","tôi"],["went","đi"],["to","đến"],["the","mạo từ"],["South","Nam"],["Pole.","cực"]],[["But","nhưng"],["I","tôi"],["accidentally","vô tình"],["locked","khoá"],["the door.","cửa"]]],
   "time":{"start":45.5,"stop":51.3}},
  {"paneid":"p3-4",
   "xlation":["Tôi phải tìm đường vền hà bằng mọi giá, vì thế tôi đâm đầu vào cửa"],
   "words":[[["I","tôi"],["had to","phải"],["find","tìm"],["a way","cách"],["to get home","về nhà"],["regardless,","bằng mọi giá"],["so","vì thế"],["I","tôi"],["rammed","đụng "],["my","của tôi"],["head","đầu"],["into","vào trong"],["the door.","cửa"]]],
   "time":{"start":51.3,"stop":56.9}},
  {"paneid":"p3-5",
   "xlation":["Đợi đã!","Vậy có nghĩa là chúng ta không thể sử dụng nó bây giờ sao?","Sau khi tôi sửa bạn có thể xài."],
   "words":[[["Wait!","đợi đã"]],[["So","vậy"],["it","nó"],["means","có nghĩa là"],["that","rằng"],["we","chúng ta"],["can't","không thể"],["use","sử dụng"],["the door","cánh cửa"],["now?","bây giờ"]],[["You","bạn"],["can","có thể"],["use","sử dụng"],["it","nó"],["after","sau khi"],["I","tôi"],["fix","sửa"],["it.","nó"]]],
   "time":{"start":56.9,"stop":62.8}},
  {"paneid":"p3-6",
   "xlation":["Tôi sẽ làm ji bây giờ?"],
   "words":[[["What","cái gì"],["will","sẽ"],["I","tôi"],["do","làm"],["now?","bây giờ?"]]],
   "time":{"start":62.8,"stop":64.5}}],
 [{"paneid":"p4-1",
   "xlation":["Tôi đã hứa sẽ mang mọi người ra biển.","Tôi đã nó bạn là đừng có hứa cuội rồi."],
   "words":[[["I","tôi"],["promised","hứa"],["everyone","mọi người"],["I'd","tôi"],["take","dắt"],["them","họ"],["to","giới từ"],["the beach.","biển"]],[["I","tôi"],["told","đã nói"],["you","bạn"],["not","không"],["to","giới từ"],["make","làm"],["unreal","không thật"],["promises!","lời hứa"]]],
   "time":{"start":64.5,"stop":71.3}},
  {"paneid":"p4-2",
   "xlation":["Để xem tôi có thể giúp gì cho bạn"],
   "words":[[["Let","để"],["me","tôi"],["see","xem"],["what","cái gì"],["I","tôi"],["can","có thể"],["do","làm"],["for","cho "],["you.","bạn"]]],
   "time":{"start":71.3,"stop":73.9}},
  {"paneid":"p4-3",
   "xlation":["Chân nến ảo giác"],
   "words":[[["A mirage candle","Chân nến ảo giác"]]],
   "time":{"start":73.9,"stop":76}},
  {"paneid":"p4-4",
   "xlation":["Lấy một cái nến đi"],
   "words":[[["Bring","mang"],["me","tôi"],["a candlestick.","nến"]]],
   "time":{"start":76,"stop":77.9}},
  {"paneid":"p4-5",
   "xlation":["Biển và nến....","Chẳng thấy liên quan gì đến nhau"],
   "words":[[["The ocean","biển"],["and","và"],["a candlestick...","nến"]],[["I","tôi"],["can","có thể"],["hardly","khó lòng"],["see","thấy"],["the connection.","sự liên kết"]]],
   "time":{"start":77.9,"stop":83.2}},
  {"paneid":"p4-6",
   "xlation":["Sao tối vậy?","Đưa tôi cây nến"],
   "words":[[["Why","tại sao"],["is","to be"],["it","nó"],["so","quá"],["dark?","tối"]],[["Give","đưa"],["me","tôi"],["the candle.","nến"]]],
   "time":{"start":83.2,"stop":86.9}},
  {"paneid":"p4-7",
   "xlation":["Trong lúc tôi giữ cây nến này"],
   "words":[[["While","trong lúc"],["I'm","tôi"],["holding","đang giữ"],["this","này"],["candle...","nến"]]],
   "time":{"start":86.9,"stop":89.5}},
  {"paneid":"p4-8",
   "xlation":["Tôi sẽ cố tưởng tượng cảnh ở Nam Cực lúc nãy"],
   "words":[[["I'll","tôi sẽ"],["try","thử"],["to imagine","tưởng tượng"],["the scene","cảnh"],["at","tại"],["the South","phía Nam"],["Pole","cực"],["where","nơi"],["I","tôi"],["was","to be"],["at","giới từ"],["earlier.","lúc nãy"]]],
   "time":{"start":89.5,"stop":94.4}}],
 [{"paneid":"p5-1",
   "xlation":["Trời đang sáng hơn.","Bạn thấy gì?"],
   "words":[[["It's","nó"],["getting","trở nên"],["brighter.","sáng hơn"]],[["What","cái gì"],["do","trợ động từ"],["you","bạn"],["see?","thấy?"]]],
   "time":{"start":94.4,"stop":97.8}},
  {"paneid":"p5-2",
   "xlation":["Nam Cực"],
   "words":[[["The South","Nam "],["Pole!","Cực"]]],
   "time":{"start":97.8,"stop":99.9}},
  {"paneid":"p5-3",
   "xlation":["Tôi muốn chơi với chim cánh cụt"],
   "words":[[["I","tôi"],["want","muốn"],["to play","chơi"],["with","với"],["those","những"],["penguins!","chim cánh cụt"]]],
   "time":{"start":99.9,"stop":103}},
  {"paneid":"p5-4",
   "xlation":["Đừng quên là chúng ta vẫn ở trong phòng bạn"],
   "words":[[["Don't","đừng"],["forget","quên"],["that","rằng"],["we're","chúng ta"],["still","vẫn"],["in","trong"],["your","của bạn"],["room.","phòng"]]],
   "time":{"start":103,"stop":105.9}},
  {"paneid":"p5-5",
   "xlation":["Vậy đây là bức tường ư?","Nhưng có cảm giác như giống như cậu đang ở Nam Cực phải không?"],
   "words":[[["So","vậy"],["this","đây"],["is","to be"],["a wall?","tường"]],[["But","nhưng"],["it","nó"],["feels","cảm thấy"],["as if","như thể"],["you're","bạn "],["really","thật sự"],["at","ở"],[" the South","Nan"],["Pole,","Cực"],["doesn't it?","phải không?"]]],
   "time":{"start":105.9,"stop":111.9}},
  {"paneid":"p5-6",
   "xlation":["Với cây nến này, tôi cũng có thể đi biển phải không?","Đúng vậy"],
   "words":[[["With","với"],["this","này"],["candle,","nến"],["can","có thể"],["I","tôi"],["also","cũng"],["go","đi"],["to","giới từ"],["the beach?","biển?"]],[["That's right","chính xác"]]],
   "time":{"start":111.9,"stop":116.7}}],
 [{"paneid":"p6-1",
   "xlation":["ảo giác của bãi biển.."],
   "words":[[["A mirage","ảo giác"],["of","của"],["a sea","biển"]]],
   "time":{"start":116.7,"stop":119.4}},
  {"paneid":"p6-2",
   "xlation":["Cát thật ấm.","Tôi nghĩ thế này là được rồi"],
   "words":[[["The sand","cát"],["is","to be"],["pretty","khá"],["warm.","ấm"]],[["This","này"],["is","to be"],["good","tốt"],["enough,","đủ"],["I","tôi"],["guess.","đoán"]]],
   "time":{"start":119.4,"stop":123.7}},
  {"paneid":"p6-3",
   "xlation":["Chúng tôi tới đây"],
   "words":[[["We're","chúng tôi"],["coming.","đang đến"]]],
   "time":{"start":123.7,"stop":125.3}},
  {"paneid":"p6-4",
   "xlation":["Tuyệt quá!"],
   "words":[[["Wonderful!","Thật tuyệt"]]],
   "time":{"start":125.3,"stop":128.6}},
  {"paneid":"p6-5",
   "xlation":["LÀm ơn đừng bơi xa quá"],
   "words":[[["Please","làm ơn"],["don't","đừng"],["swim","bơi"],["too","quá"],["far.","xa"]]],
   "time":{"start":128.6,"stop":131.1}},
  {"paneid":"p6-6",
   "xlation":["Tôi bơi nhanh không này?"],
   "words":[[["I'm","tôi"],["a","mạo từ"],["fast","nhanh"],["swimmer,","người bơi"],[" aren't I?","đúng không?"]]],
   "time":{"start":131.1,"stop":133.8}},
  {"paneid":"p6-7",
   "xlation":["Nếu bạn bơi xa hơn 3 mét sẽ rất nguy hiểm đó"],
   "words":[[["It'll","nó sẽ"],["be","to be"],["dangerous","nguy hiểm"],["if","nếu"],["you","bạn"],["swim","bơi"],[" more than","hơn"],["three","ba"],["meters.","mét"]]],
   "time":{"start":133.8,"stop":137.5}}],
 [{"paneid":"p7-1",
   "xlation":["Tôi vừa mới đụng vào htuws gì đóvô hình.","Chúng ta nên ăn trưa bây giờ.","Đập dưa hấu thôi"],
   "words":[[["I","tôi"],["just","vừa mới"],["bumped","đụng"],["into","vào "],["something","thứ gì đó"],["invisible.","vô hình"]],[["We","chúng ta"],["should","nên"],["eat","ăn"],["our","của chúng ta"],["lunch","bữa trưa"],["now.","bây giờ"]],[["Let's","hãy"],["break","bổ"],["this","này"],["watermelon.","dưa hấu"]]],
   "time":{"start":137.5,"stop":144.5}},
  {"paneid":"p7-2",
   "xlation":["Dừng lại!","Bạn sẽ đập trúng cửa mất!"],
   "words":[[["Stop!","dừng lại"]],[["You're","bạn"],["going to","sẽ"],["hit","đánh"],["the door!","cửa"]]],
   "time":{"start":144.5,"stop":147.5}},
  {"paneid":"p7-3",
   "xlation":["Nến sắp tắt rồi"],
   "words":[[["Our","của chúng ta"],["candle","ngọn nến"],["is","to be"],["running out","hết"]]],
   "time":{"start":147.5,"stop":149.9}},
  {"paneid":"p7-4",
   "xlation":["Mọi người về nhà đi"],
   "words":[[["Please","làm ơn"],["go","đi về"],["home","nhà"],["now,","bây giờ"],["everyone.","mọi người"]]],
   "time":{"start":149.9,"stop":152.5}},
  {"paneid":"p7-5",
   "xlation":["Trời ơi, họ để rác khắp nơi.","Họ thật vô trách nhiệm!"],
   "words":[[["Geez,","Trời ơi"],["they","họ"],["left","để lại"],["their","của họ"],["trash","rác"],["everywhere.","khắp nơi"]],[["They","họ"],["are","to be"],["all","tất cả"],["so","quá"],["irresponsible!","vô trách nhiệm"]]],
   "time":{"start":152.5,"stop":157.8}}]];
MeoU.glosses[MeoU.DORAPLUS1CH14] = [[
  {"paneid":"p1-1",
   "xlation":["Trời ơi, nhìn bạn kìa"],
   "words":[[["My, my","trời ơi"],["look","nhìn"],["at","giới từ"],["you.","bạn"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p1-2",
   "xlation":["Tôi vừa mới chơi bóng chày xong.","Tất nhiên sẽ dơ rồi.","Bạn toàn giỏi kiếm cớ thôi"],
   "words":[[["I","tôi"],["just","vừa mới"],["finished","kết thúc"],["playing","chơi"],["baseball.","bóng chày"]],[["Of course","dĩ nhiên"],["I'd","tôi"],["be","to be"],["all","tất cả"],["dirty.","dơ"]],[["You're","bạn"],["good","giỏi"],["at","giới từ"],["making","tạo"],["excuses.","cớ"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p1-3",
   "xlation":["Nhân tiện, bạn giúp tôi mua vài thứ được không?"],
   "words":[[["By the way,","Nhân tiện"],["would","sẽ"],["you","bạn"],["help","giúp đỡ"],["me","tôi"],["with","giới từ"],["some","vài"],["shopping?","mua sắm"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p1-4",
   "xlation":["Tôi sẽ liệt kê ra những thứ cần mua"],
   "words":[[["I'll","tôi sẽ"],["make","làm"],["a list","danh sách"],["of","của"],["what","cái gì"],["you","bạn"],["need","cần"],["to buy.","mua"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p1-5",
   "xlation":["Không được.","Tôi hứa đi chơi với Shizu-chan rồi"],
   "words":[[["No way.","không thể nào"]],[["I","tôi"],["promised","hứa"],["to play","chơi"],["with","với"],["Shizu-chan.","shizu-chan"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p1-6",
   "xlation":["Vì Nobita mà chúng ta thua trận.","Vậy nên chúng tôi sẽ đánh bạn tơi bời "],
   "words":[[["It","Nó"],["was","to be"],["Nobita's","của Nobita"],["fault","lỗi"],["that","mà"],["we","chúng ta"],["lost","thua"],["the game.","trò chơi"]],[["We","Chúng ta"],["will","sẽ"],["beat","đánh"],["you","bạn"],["to","giới từ"],["death","cái chết"],["for","vì"],["that!","điều đó"]]],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p2-1",
   "xlation":["Nữa sao?"],
   "words":[[["Again?","lại"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p2-2",
   "xlation":["Tội nghiệp Nobita"],
   "words":[[["Poor","Tội nghiệp"],["Nobita.","Nobita."]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p2-3",
   "xlation":["Bạn biết chưa?","Đây là cái áo cuối cùng rồi"],
   "words":[[["Are","to be"],["we","chúng ta"],["clear?","rõ ràng?"]],[["This","này"],["shirt","áo"],["is","to be"],["the","mạo từ"],["last","cuối cùng"],["one.","cái áo"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p2-4",
   "xlation":["Nên hãy cẩn thận.","Tôi hiểu rồi"],
   "words":[[["So","vì thế"],["please","làm ơn"],["be","to be"],["careful.","cẩn thận"]],[["I","tôi"],["understand.","hiểu"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p2-5",
   "xlation":["Giờ bạn có thể đi mua đồ được rồi.","Tôi sẽ đi"],
   "words":[[["In","trong"],["that","này"],["case,","trường hợp"],["you","bạn"],["can","có thể"],["go","đi"],["shopping","mua sắm"],["now.","bây giờ"]],[["I","tôi"],["will.","sẽ"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p2-6",
   "xlation":["Khi mua xong, đừng quên tưới cây và ném những thùng rỗng này đi.","Cái gì?","Nó rất nặng"],
   "words":[[["When","khi"],["you're","bạn"],["done,","làm xong"],["don't","đừng"],["forget","quên"],["to water","tưới nước"],["the garden","khu vườn"],["and","và"],["throw away","ném đi"],["those","này"],["empty","rỗng"],["boxes.","thùng"]],[["What?","cái gì"]],[["They're","chúng"],["so","rất"],["heavy!","nặng"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p2-7",
   "xlation":["Tôi sẽ làm"],
   "words":[[["I'll","tôi sẽ"],["do","làm"],["it.","nó"]]],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p3-1",
   "xlation":["Tôi đang đợi bạn"],
   "words":[[["I've","tôi"],["been","to be"],["waiting","đợi"],["for","giới từ"],["you.","bạn"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p3-2",
   "xlation":["XIn lỗi, tôi phải  đi mua đồ"],
   "words":[[["Sorry,","xin lỗi"],["I","tôi"],["have to","phải"],["run","chạy"],["some ","một vài"],["errands.","việc lặt vặt"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p3-3",
   "xlation":["Tốt.","Anh ấy đang làm việc mẹ yêu cầu"],
   "words":[[["Good.","tốt"]],[["He's","Anh ấy"],["doing","đang làm"],["what","những gì"],["Mama","mẹ"],["asked","yêu cầu"],["him","anh ấy"],["to do.","làm"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p3-4",
   "xlation":["Vết dơ sô cô la"],
   "words":[[["A chocolate","sô cô la"],["stain!","vết bẩn"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p3-5",
   "xlation":["Đây là cái áo cuối cùng của tôi hôm nay"],
   "words":[[["This","đây"],["is","to be"],["my","của tôi"],["last","cuối cùng"],["shirt","áo"],["for","cho"],["today.","hôm nay"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p3-6",
   "xlation":["Tại sao họ lại quá đáng như vậy ?"],
   "words":[[["Why","tại sao"],["do","trợ động từ"],["they","họ"],["have to","phải"],["be","to be"],["so","quá"],["mean?","xấu tính"]]],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p4-1",
   "xlation":["Tôi sẽ giúp anh ấy"],
   "words":[[["I","tôi"],["will","sẽ"],["help","giúp đỡ"],["him.","anh ấy"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p4-2",
   "xlation":["Con ong may mắn"],
   "words":[[["A","mạo từ"],["lucky       ","may mắn"],["bee","ong"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p4-3",
   "xlation":["Nó chắc chắn sẽ giúp anh ấy"],
   "words":[[["It","nó"],["will","sẽ"],["definitely","chắc chắn"],["help","giúp đỡ"],["him.","anh ấy"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p4-4",
   "xlation":["Một con ông lớn"],
   "words":[[["A","mạo từ"],["giant","lớn"],["bee!","con ong!"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p4-5",
   "xlation":["Ôi, tôi xin lỗi.","Đó chỉ là tai nạn"],
   "words":[[["Oops,","oops"],["I'm","tôi"],["sorry.","xin lỗi"]],[["It","nói"],["was","to be"],["an accident","tai nạn"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p4-6",
   "xlation":["Tôi sẽ làm sạch áo của bạn.","Bạn hãy tắm trong lúc chờ.","Được thôi nếu bạn không phiền"],
   "words":[[["I","tôi"],["will","sẽ"],["clean","làm sạch"],["your","của bạn"],["shirt.","áo"]],[["Please","làm ơn"],["take a shower","tắm"],["for the time being.","trong lúc này"]],[["Well,","được thôi"],["if","nếu"],["you","bạn"],["don't","không"],["mind.","phiền"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p4-7",
   "xlation":["Nhưng chưa xong đâu!","Tôi phải về nhà sớm để tưới cây và ném những thùng này đi!"],
   "words":[[["But","nhưng"],["it's","nó"],["not","không"],["finished","hoàn thành"],["yet!","chưa"]],[["I","tôi"],["have to","phải"],["come","về"],["home","nhà"],["soon","sớm"],["to","để"],["water","tưới nước"],["the garden","vườn"],["and","và"],["throw","ném"],["those","này"],["boxes","thùng"],["away.","đi khỏi"]]],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p5-1",
   "xlation":["Trời, anh ấy  chậm quá"],
   "words":[[["Geez,","trời ơi"],["he's","anh ấy"],["so","quá"],["slow.","chậm"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p5-2",
   "xlation":["Vậy chúng ta sẽ làm ji với cái này bây giờ?","Có thể trả lại cho mẹ anh ấy"],
   "words":[[["What","điều gì"],["will","sẽ"],["we","chúng ta"],["do","làm"],["with","với"],["this","điều này"],["then?","vậy"]],[["Might","có thể"],["as well","cũng"],["return","trả"],["it","nó"],["to","giới từ"],["his","của anh ấy"],["mother.","mẹ"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p5-3",
   "xlation":["Vậy bạn muốn mua carrot ư?","Tôi sẽ lấy  cho bạn"],
   "words":[[["So","Vì thế"],["you","bạn"],["want","muốn"],["to","giới từ"],["buy","mua"],["some","một vài"],["carrots?","caà rốt"]],[["I'll","tôi sẽ"],["get","lấy"],["them","chúng"],["for","cho"],["you.","bạn"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p5-4",
   "xlation":["Tại sao chúng ta phải mua những thứ này cho anh ấy?"],
   "words":[[["Why","tại sao"],["do","trợ động từ"],["we","chúng ta"],["have to","phải"],["to buy","mua"],["these","này"],["things","thứ"],["for","cho "],["him?","anh ấy?"]]],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p6-1",
   "xlation":["Nó đang đến"],
   "words":[[["It's","nó"],["coming!","đang đến"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p6-2",
   "xlation":["Một cái ống nước"],
   "words":[[["A hose!","ống nước"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p6-3",
   "xlation":["Xịt nước nó đi"],
   "words":[[["Spray","Xịt"],["it","nó"],["with","với"],["water.","nước"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p6-4",
   "xlation":["Nó bay qua kia.","Ở kia, ở kia!"],
   "words":[[["It","Nó"],["flew","bay"],["over there.","ở bên kia"]],[["Over there,","oở bên kia"],["over there!","ở bên kia"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p6-5",
   "xlation":["Giant!","Chúng ta núp dưới mấy hộp này và chạy thôi"],
   "words":[[["Giant!","GIant!"]],[["We","chúng ta"],["can","có thể"],["hide","núp"],["under","dưới"],["these","này"],["boxes","thùng"],["and","và"],["run","chạy"],["away.","khỏi"]]],
   "time":{"start":0,"stop":0}}],
 [{"paneid":"p7-1",
   "xlation":["Nó vẫn chạy theo chúng ta.","Chạy thôi!"],
   "words":[[["It's","Nó"],["still","vẫn"],["chasing","đuổi theo"],["us.","chúng ta"]],[["Keep","cứ"],["running!","chạy"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p7-2",
   "xlation":["Okay, Nó đi rồi.","Để rác của bạn ở đây"],
   "words":[[["Okay,","được rồi"],["it's","nó"],["gone","biến mất"],["now.","bây giờ"]],[["Put","để"],["your","của bạn"],["trash","rác"],["here.","ở đây"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p7-3",
   "xlation":["Tôi không làm bẩn cáo của tôi, nhưng.."],
   "words":[[["I","tôi"],["didn't","không"],["stain","làm bẩn"],["my","của tôi"],["shirt,","áo"],["but...","nhưng"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p7-4",
   "xlation":["Tôi vẫn chưa làm xong cái gì hết.","Đừng lo lắng về nó"],
   "words":[[["I","tôi"],["still","vẫn"],["haven't","chưa"],["done","làm xong"],["anything","bất kì cái gì"],["else.","khác"]],[["Don't","đừng"],["worry","lo lắng"],["about","về"],["it.","nó"]]],
   "time":{"start":0,"stop":0}},
  {"paneid":"p7-5",
   "xlation":["Vậy là bạn đã hoàn thành xong mọi việc.","Tôi sẽ cho bạn thêm tiền tiêu"],
   "words":[[["So","vậy "],["you","bạn"],["did","đã làm"],["everything","tất cả mọi thứ"],["I","tôi"],["told","đã nói"],["you.","bạn"]],[["In","trong"],["that","này"],["case,","trường hợp"],["I'll","tôi sẽ"],["increase","nâng cao"],["your","của bạn"],["allowance.","tiền thêm"]]],
   "time":{"start":0,"stop":0}}]];


// scratch: wordsIPA
var wordsIPA = {"2":"2","3":"3","5":"5","yes":"jɛs","the":"ðə","culprit":"ˈkʌlprɪt","jumped":"ʤʌmpt","from":"frʌm","one":"wʌn","window":"ˈwɪndoʊ","to":"tu","other":"ˈʌðər","before":"bɪˈfɔr","everyone":"ˈɛvriˌwʌn","heard":"hɜrd","victim's":"ˈvɪktəmz",
  "scream":"skrim","and":"ænd","came":"keɪm","running":"ˈrʌnɪŋ","we":"wi","know":"noʊ","this":"ðɪs","because":"bɪˈkɔz","there":"ðeər","are":"ɑr","no":"noʊ","footprints":"ˈfʊtˌprɪnts","outside":"ˈaʊtˈsaɪd","but":"bʌt","that's":"ðæts","ridiculous":"rɪˈdɪkjələs",
  "they're":"ðɛr","meters":"ˈmitərz","apart":"əˈpɑrt","it's":"ɪts","not":"nɑt","even":"ˈivɪn","climb":"klaɪm","up":"ʌp","wall":"wɔl","roof":"ruf","it":"ɪt","wouldn't":"ˈwʊdənt","have":"hæv","occurred":"əˈkɜrd","me":"mi","had":"hæd","i":"aɪ","known":"noʊn",
  "house's":"ˈhaʊsɪz","unique":"juˈnik","structure":"ˈstrʌkʧər","at":"æt","time":"taɪm","was":"wʌz","only":"ˈoʊnli","person":"ˈpɜrsən","who":"hu","could":"kʊd","walk":"wɔk","throughout":"θruˈaʊt","house":"haʊs","unsuspected":"ˌʌnsəˈspɛktɪd","out":"aʊt","with":"wɪð",
  "you":"ju","sir":"sɜr","host":"hoʊst","stop":"stɑp","joking":"ˈʤoʊkɪŋ","look":"lʊk","my":"maɪ","leg":"lɛg","still":"stɪl","should":"ʃʊd","give":"gɪv","acting":"ˈæktɪŋ","wretched":"ˈrɛʧɪd","your":"jʊər","secret":"ˈsikrət","is":"ɪz","exposed":"ɪkˈspoʊzd",
  "already":"ɔlˈrɛdi","healed":"hild","months":"mʌnθs","ago":"əˈgoʊ","isn't":"ˈɪzənt","that":"ðæt","right":"raɪt","inspector":"ɪnˈspɛktər","megure":"megure","doctors":"ˈdɑktərz","told":"toʊld","us":"ʌs","everything":"ˈɛvriˌθɪŋ","shit":"ʃɪt","hey":"heɪ","wait":"weɪt","you're":"jʊr","going":"ˈgoʊɪŋ","anywhere":"ˈɛniˌwɛr",
  "room":"rum","untidy":"ənˈtaɪdi","again":"əˈgɛn","i'd":"aɪd","like":"laɪk","to":"tu","vacuum":"ˈvækjum","so":"soʊ","please":"pliz","move":"muv","aside":"əˈsaɪd","need":"nid","do":"du","laundry":"ˈlɔndri","as":"æz","well":"wɛl","lunch":"lʌnʧ","ready":"ˈrɛdi",
  "yet":"jɛt","i'm":"aɪm","starving":"ˈstɑrvɪŋ","until":"ənˈtɪl","finish":"ˈfɪnɪʃ","doing":"ˈduɪŋ","geez":"ʤiz","(jesus)":"(ˈʤizəs)","what":"wʌt","will":"wɪl","happen":"ˈhæpən","if":"ɪf","home":"hoʊm","relying":"riˈlaɪɪŋ","on":"ɑn","they":"ðeɪ","might":"maɪt",
  "die":"daɪ","of":"ɑv","starvation":"stɑrˈveɪʃən","hello":"həˈloʊ","really":"ˈrɪli","mom":"mɑm","suddenly":"ˈsʌdənli","became":"bɪˈkeɪm","ill":"ɪl","eh":"ɛ","grandma":"ˈgræmɑ","in":"ɪn","case":"keɪs","better":"ˈbɛtər","hurry":"ˈhɜri","take":"teɪk","care":"kɛr",
  "her":"hɜr","about":"əˈbaʊt","i'll":"aɪl","make":"meɪk","don't":"doʊnt","worry":"ˈwɜri","papa":"ˈpɑpə","can":"kæn","our":"ˈaʊər","nope":"noʊp","now":"naʊ","any":"ˈɛni","choice":"ʧɔɪs","it'll":"ˈɪtəl","be":"bi","fun":"fʌn","see":"si","worried":"ˈwɜrid",
  "oh":"oʊ","cut":"kʌt","finger":"ˈfɪŋgər","darn":"dɑrn","i've":"aɪv","used":"juzd","salt":"sɔlt","instead":"ɪnˈstɛd","sugar":"ˈʃʊgər","oops":"ups","didn't":"ˈdɪdənt","use":"juz","enough":"ɪˈnʌf","water":"ˈwɔtər","rice":"raɪs","has":"hæz","burnt":"bɜrnt",
  "let":"lɛt","taste":"teɪst","let's":"lɛts","call":"kɔl","a":"ə","delivery":"dɪˈlɪvəri","service":"ˈsɜrvəs","yay":"jeɪ","closed":"kloʊzd","today":"təˈdeɪ","hungry":"ˈhʌŋgri","quiet":"ˈkwaɪət","can't":"kænt","say":"seɪ","thing":"θɪŋ","partial":"ˈpɑrʃəl",
  "gourmet":"ˈgʊrˌmeɪ","table":"ˈteɪbəl","roll":"roʊl","want":"wɑnt","eat":"it","anything":"ˈɛniˌθɪŋ","fine":"faɪn","long":"lɔŋ","how":"haʊ","katsudon":"katsudon","curry":"ˈkʌri","happened":"ˈhæpənd","these":"ðiz","think":"θɪŋk","just":"ʤʌst","delicious":"dɪˈlɪʃəs",
  "first":"fɜrst","eaten":"ˈitən","something":"ˈsʌmθɪŋ","there":"ðeər","are":"ɑr","some":"sʌm","desserts":"dɪˈzɜrts","too":"tu","fruit":"frut","punch":"pʌnʧ","pudding":"ˈpʊdɪŋ","coffee":"ˈkɑfi","ah":"ɑ","full":"fʊl","o'clock":"əˈklɑk","for":"fɔr","snack":"snæk",
  "anymore":"ˌɛniˈmɔr","unless":"ənˈlɛs","treat":"trit","then":"ðɛn","cuisine":"kwɪˈzin","class":"klæs","french":"frɛnʧ","restaurant":"ˈrɛstəˌrɑnt","started":"ˈstɑrtəd","escargot":"escargot","bourguignon":"ˌbʊrginˈjoʊn","continued":"kənˈtɪnjud","soup":"sup",
  "fettuccini":"fettuccini","fillet":"fəˈleɪ","steak":"steɪk","cream":"krim","sauce":"sɔs","understand":"ˌʌndərˈstænd","ate":"eɪt","yourself":"jərˈsɛlf","doubt":"daʊt","afford":"əˈfɔrd","won't":"woʊnt","rare":"rɛr","occasion":"əˈkeɪʒən","expensive":"ɪkˈspɛnsɪv",
  "money":"ˈmʌni","fake":"feɪk","promises":"ˈprɑməsəz","would":"wʊd","mean":"min","may":"meɪ","order":"ˈɔrdər","truffle":"ˈtrʌfəl","fettucini":"fettucini","tilefish":"tilefish","write":"raɪt","show":"ʃoʊ","magic":"ˈmæʤɪk","food":"fud","appear":"əˈpɪr","all":"ɔl",
  "kinds":"kaɪndz","looks":"lʊks","what's":"wʌts","important":"ɪmˈpɔrtənt","flavor":"ˈfleɪvər","agree":"əˈgri","good":"gʊd","admit":"ədˈmɪt","eating":"ˈitɪŋ","prepare":"priˈpɛr","dinner":"ˈdɪnər","chinese":"ʧaɪˈniz","idea":"aɪˈdiə","soon":"sun","glad":"glæd",
  "serious":"ˈsɪriəs","forgive":"fərˈgɪv","giving":"ˈgɪvɪŋ","such":"sʌʧ","fright":"fraɪt","dark":"dɑrk","spend":"spɛnd","night":"naɪt","here":"hir","family":"ˈfæməli","though":"ðoʊ","raining":"ˈreɪnɪŋ","should":"ʃʊd","have":"hæv","stayed":"steɪd","parents":"ˈpɛrənts","waiting":"ˈweɪtɪŋ","finally":"ˈfaɪnəli","am":"æm","welcome":"ˈwɛlkəm","why":"waɪ","she":"ʃi","upset":"əpˈsɛt","done":"dʌn","wrong":"rɔŋ",
  "bought":"bɑt","tofu":"ˈtoʊfu","to":"tu","be":"bi","careful":"ˈkɛrfəl","while":"waɪl","carrying":"ˈkæriɪŋ","were":"wɜr","supposed":"səˈpoʊzd","carry":"ˈkæri","top":"tɑp","head":"hɛd","tickle":"ˈtɪkəl","stop":"stɑp","it":"ɪt","watch":"wɑʧ","around":"əˈraʊnd","mother":"ˈmʌðər","yell":"jɛl","sure":"ʃʊr","fault":"fɔlt","dropped":"drɑpt","nothing":"ˈnʌθɪŋ","crying":"ˈkraɪɪŋ","get":"gɛt","back":"bæk","at":"æt","them":"ðɛm","two":"tu","tickling":"ˈtɪkəlɪŋ","glove":"glʌv","wear":"wɛr","reach":"riʧ","up":"ʌp","got":"gɑt","suneo":"suneo","giant":"ˈʤaɪənt","death":"dɛθ","practice":"ˈpræktəs","he":"hi","laughing":"ˈlæfɪŋ","face":"feɪs","weren't":"ˈwɜrənt","true":"tru","away":"əˈweɪ","with":"wɪð","thank":"θæŋk","you":"ju","inviting":"ɪnˈvaɪtɪŋ","voice":"vɔɪs","always":"ˈɔlˌweɪz","manners":"ˈmænərz","him":"hɪm","finished":"ˈfɪnɪʃt","here's":"hɪrz","more":"mɔr","laughed":"læft","much":"mʌʧ","huge":"hjuʤ","success":"səkˈsɛs","hear":"hir","naughty":"ˈnɔti","boy":"bɔɪ","hahaha":"hahaha","afraid":"əˈfreɪd","scolded":"ˈskoʊldəd",
  "cool":"kul","porsche":"ˈpɔrʃə","turbo":"ˈtɜrboʊ","cups":"kʌps","noodles":"ˈnudəlz","been":"bɪn","dream":"drim","force":"fɔrs","myself":"ˌmaɪˈsɛlf","gulp":"gʌlp","sick":"sɪk","an":"ən","idiot":"ˈɪdiət","favorite":"ˈfeɪvərɪt","have":"hæv","bought":"bɑt","plastic":"ˈplæstɪk","model":"ˈmɑdəl","hesitated":"ˈhɛzɪˌteɪtɪd","talking":"ˈtɔkɪŋ","yen":"jɛn","uncle":"ˈʌŋkəl","added":"ˈædəd","had":"hæd","saved":"seɪvd","thinking":"ˈθɪŋkɪŋ","buy":"baɪ","fool":"ful","rash":"ræʃ","since":"sɪns","remember":"rɪˈmɛmbər","from":"frʌm","now":"naʊ","on":"ɑn","bad":"bæd","no":"noʊ","matter":"ˈmætər","failed":"feɪld","fix":"fɪks","machine":"məˈʃin","don't":"doʊnt","we":"wi","tell":"tɛl","nobita":"nobita","hour":"ˈaʊər","four":"fɔr","more":"mɔr","than":"ðæn","change":"ʧeɪnʤ","past":"pæst","return":"rɪˈtɜrn","affect":"əˈfɛkt","people":"ˈpipəl","mess":"mɛs","up":"ʌp","history":"ˈhɪstəri","sound":"saʊnd","big":"bɪg","deal":"dil","connection":"kəˈnɛkʃən","between":"bɪˈtwin","anyway":"ˈɛniˌweɪ","influence":"ˈɪnfluəns","whole":"hoʊl","come":"kʌm","thank":"θæŋk","you":"ju","very":"ˈvɛri","savings":"ˈseɪvɪŋz","believe":"bɪˈliv","which":"wɪʧ","one":"wʌn","childish":"ˈʧaɪldɪʃ","noodle":"ˈnudəl","he's":"hiz","stupid":"ˈstupəd","foolish":"ˈfulɪʃ","how":"haʊ","many":"ˈmɛni","times":"taɪmz","\"fool\"":"\"ful\"","stand":"stænd","look":"lʊk","reality":"ˌriˈæləˌti","makes":"meɪks","sense":"sɛns","understands":"ˌʌndərˈstændz","you'll":"jul","leave":"liv","easy":"ˈizi","whatever":"ˌwʌˈtɛvər","we've":"wiv","changed":"ʧeɪnʤd","has":"hæz","got":"gɑt","to":"tu","different":"ˈdɪfərənt","aren't":"ˈɑrənt","by":"baɪ","check":"ʧɛk","time":"taɪm","where":"wɛr","went":"wɛnt","did":"dɪd","go":"goʊ","feel":"fil","uneasy":"əˈnizi","store":"stɔr","thanks":"θæŋks","another":"əˈnʌðər","going":"ˈgoʊɪŋ","next":"nɛkst","right":"raɪt","complicated":"ˈkɑmpləˌkeɪtəd","listen":"ˈlɪsən","meaningful":"ˈminɪŋfəl","way":"weɪ","useless":"ˈjusləs","decide":"ˌdɪˈsaɪd","fight":"faɪt","ouch":"aʊʧ","after":"ˈæftər","decided":"ˌdɪˈsaɪdɪd","fighting":"ˈfaɪtɪŋ","when":"wɛn","belong":"bɪˈlɔŋ","cup":"kʌp",
  "goal":"goʊl","borrow":"ˈbɑˌroʊ","help":"hɛlp","once":"wʌns","kudou-kun":"kudou-kʌn","through":"θru","you've":"juv","tough":"tʌf","crack":"kræk","great":"greɪt","kudou":"kudou","shinichi":"ʃɪˈniʧi","high":"haɪ","school":"skul","student":"ˈstudənt","detective":"dɪˈtɛktɪv","solves":"sɑlvz","teitan":"teitan","junior":"ˈʤunjər","surely":"ˈʃʊrli","saviour":"saviour","japanese":"ˌʤæpəˈniz","police":"pəˈlis","department":"dɪˈpɑrtmənt","dork":"dork","mouri":"mouri","ran":"ræn","mad":"mæd","angry":"ˈæŋgri","father":"ˈfɑðər","work":"wɜrk","dad's":"dædz","getting":"ˈgɛtɪŋ","sucks":"sʌks","said":"sɛd","captain":"ˈkæptən","karate":"kəˈrɑti","team":"tim","ball":"bɔl","huh":"hʌ","hadn't":"ˈhædənt","quit":"kwɪt","soccer":"ˈsɑkər","you'd":"jud","national":"ˈnæʃənəl","hero":"ˈhɪroʊ","played":"pleɪd","develop":"dɪˈvɛləp","reflexes":"ˈriflɛksəz","necessary":"ˈnɛsəˌsɛri","holmes":"hoʊmz","practiced":"ˈpræktəst","fencing":"ˈfɛnsɪŋ","book":"bʊk","knows":"noʊz","amazing":"əˈmeɪzɪŋ","composed":"kəmˈpoʊzd","brimming":"ˈbrɪmɪŋ","intelligence":"ɪnˈtɛləʤəns","refinement":"rəˈfaɪnmənt","his":"hɪz","reasoning":"ˈrizənɪŋ","observation":"ˌɑbzərˈveɪʃən","skills":"skɪlz","peerless":"ˈpɪrlɪs","professional":"prəˈfɛʃənəl","violinist":"vaɪəˈlɪnəst","conan":"ˈkoʊnən","doyle":"dɔɪl","created":"kriˈeɪtəd","sherlock":"ˈʃɜrˌlɑk","world's":"wɜrldz","greatest":"ˈgreɪtəst","mystery":"ˈmɪstəri","novels":"ˈnɑvəlz","world":"wɜrld","doyle's":"dɔɪlz","bout":"baʊt","ya":"jɑ","wanna":"ˈwɑnə","read":"rid","rather":"ˈræðər","catch":"kæʧ","disease":"dɪˈziz","fan":"fæn","letters":"ˈlɛtərz","loves":"lʌvz","otaku":"otaku","mind":"maɪnd","ga-ga":"gɑ-gɑ","over":"ˈoʊvər","girls":"gɜrlz","ought":"ɔt","narrow":"ˈnɛroʊ","down":"daʊn","brother":"ˈbrʌðər","staring":"ˈstɛrɪŋ","stick":"stɪk","into":"ˈɪntu","cases":"ˈkeɪsəz","end":"ɛnd","real":"riəl","trouble":"ˈtrʌbəl","maybe":"ˈmeɪbi","love":"lʌv","those":"ðoʊz","stories":"ˈstɔriz","writer":"ˈraɪtər","detectives":"dɪˈtɛktɪvz","heisei":"heisei","excited":"ɪkˈsaɪtəd","thrill":"θrɪl","moment":"ˈmoʊmənt","foil":"fɔɪl","schemes":"skimz","criminal":"ˈkrɪmənəl","sensation":"sɛnˈseɪʃən","start":"stɑrt","forget":"fərˈgɛt","promise":"ˈprɑməs","tomorrow":"təˈmɑˌroʊ","won":"wʌn","city":"ˈsɪti","tournament":"ˈtʊrnəmənt","amusement":"əmˈjuzmənt","park":"pɑrk","never":"ˈnɛvər","anyways":"ˈɛniˌweɪz","hang":"hæŋ","writing":"ˈraɪtɪŋ","c'mon":"kəˈmɑn","course":"kɔrs","remembered":"rɪˈmɛmbərd","tropical":"ˈtrɑpɪkəl","land":"lænd","possible":"ˈpɑsəbəl","paying":"ˈpeɪɪŋ",
  "haven't":"ˈhævənt","borrowed":"ˈbɑˌroʊd","lost":"lɔst","helped":"hɛlpt","substitute":"ˈsʌbstəˌtut","stickers":"ˈstɪkərz","kind":"kaɪnd","old":"oʊld","phone":"foʊn","sticker":"ˈstɪkər","suneo's":"suneo's","comic":"ˈkɑmɪk","put":"pʊt","kidding":"ˈkɪdɪŋ","they'll":"ðeɪl","beat":"bit","test":"tɛst","zero":"ˈzɪroʊ","what'll":"ˈwʌtəl","ad":"æd","low":"loʊ","bargain":"ˈbɑrgən","sale":"seɪl","score":"skɔr","play":"pleɪ","break":"breɪk","stay":"steɪ","yamada-san's":"jəˈmɑdə-sænz","far":"fɑr","anyone":"ˈɛniˌwʌn","interesting":"ˈɪntrəstɪŋ","handle":"ˈhændəl","tickles":"ˈtɪkəlz","mistook":"mɪsˈtʊk","guess":"gɛs","learned":"lɜrnd","lesson":"ˈlɛsən","locked":"lɑkt","cold":"koʊld",
  "nice":"naɪs","day":"deɪ","we're":"wir","planning":"ˈplænɪŋ","green":"grin","hill":"hɪl","bag":"bæg","leaving":"ˈlivɪŋ","playing":"ˈpleɪɪŋ","study":"ˈstʌdi","annoying":"əˈnɔɪɪŋ","ruined":"ˈruənd","date":"deɪt","mii-chan":"mii-ʧæn","traveling":"ˈtrævəlɪŋ","half":"hæf","cloud":"klaʊd","inside":"ɪnˈsaɪd","we'll":"wil","seeds":"sidz","grow":"groʊ","split":"splɪt","legs":"lɛgz","duck":"dʌk","yeah":"jæ","mama":"ˈmɑmə","calls":"kɔlz","sneaky":"ˈsniki","mama's":"ˈmɑməz","coming":"ˈkʌmɪŋ","weird":"wɪrd","fast":"fæst","jet":"ʤɛt","fly":"flaɪ","air":"ɛr","actually":"ˈækʧuəli","walking":"ˈwɔkɪŋ","ages":"ˈeɪʤəz","breath":"brɛθ","almost":"ˈɔlˌmoʊst","where's":"wɛrz","beautiful":"ˈbjutəfəl","view":"vju","thirsty":"ˈθɜrsti","brought":"brɔt","drinks":"drɪŋks","minute":"ˈmɪnət","handy":"ˈhændi","feels":"filz","off":"ɔf","shoes":"ʃuz","grounds":"graʊndz","soft":"sɑft","carpet":"ˈkɑrpət","gone":"gɔn","helping":"ˈhɛlpɪŋ","throw":"θroʊ","wind":"wɪnd","carried":"ˈkærid",
  "phew":"fju","scary":"ˈskɛri","brutal":"ˈbrutəl","anytime":"ˈɛniˌtaɪm","comes":"kʌmz","able":"ˈeɪbəl","strong":"strɔŋ","friends":"frɛndz","avenge":"əˈvɛnʤ","keep":"kip","likes":"laɪks","without":"wɪˈθaʊt","considering":"kənˈsɪdərɪŋ","feelings":"ˈfilɪŋz","alone":"əˈloʊn","defeated":"dɪˈfitəd","ignore":"ɪgˈnɔr","enemy":"ˈɛnəmi","teach":"tiʧ","indeed":"ɪnˈdid","shopping":"ˈʃɑpɪŋ","meeting":"ˈmitɪŋ","\"he\"":"\"hi\"","waa":"waa","nobita's":"nobita's","refers":"rəˈfɜrz","guy":"gaɪ","close":"kloʊs","betrayed":"bɪˈtreɪd","unforgivable":"ˌʌnfɔrˈgɪvəbəl","friendship":"ˈfrɛndʃɪp","chocolate":"ˈʧɔklət","eats":"its","ally":"ˈælaɪ","being":"ˈbiɪŋ","unusual":"ənˈjuʒˌuəl","become":"bɪˈkʌm","allies":"ˈælaɪz","asked":"æskt","errand":"ˈɛrənd","king":"kɪŋ","sorry":"ˈsɑri","none":"nʌn","business":"ˈbɪznəs","comrade":"ˈkɑmˌræd","peace":"pis","made":"meɪd","mistake":"mɪsˈteɪk","eventually":"ɪˈvɛnʧəwəli","shizu-chan":"shizu-ʧæn","wanted":"ˈwɑntəd","visit":"ˈvɪzət","sudden":"ˈsʌdən","sharing":"ˈʃɛrɪŋ","same":"seɪm","lot":"lɑt","must":"mʌst","ones":"wʌnz","earlier":"ˈɜrliər","hope":"hoʊp","normal":"ˈnɔrməl","morning":"ˈmɔrnɪŋ","nap":"næp","late":"leɪt","also":"ˈɔlsoʊ",
  "0":"0","10":"10","new":"nu","record":"ˈrɛkərd","gets":"gɛts","forgetting":"fərˈgɛtɪŋ","homework":"ˈhoʊmˌwɜrk","sleeping":"ˈslipɪŋ","during":"ˈdʊrɪŋ","lectures":"ˈlɛkʧərz","sensei":"sensei","gives":"gɪvz","dismissed":"dɪˈsmɪst","reaction":"riˈækʃən","delighted":"dɪˈlaɪtəd","tadaima":"tadaima","doraemon":"doraemon","forgot":"fərˈgɑt","sooner":"ˈsunər","or":"ɔr","later":"ˈleɪtər","using":"ˈjuzɪŋ","papa's":"ˈpɑpəz","fountain":"ˈfaʊntən","pen":"pɛn","grade":"greɪd","ink":"ɪŋk","eek":"eek","broken":"ˈbroʊkən","nobi's":"nobi's","residence":"ˈrɛzɪdəns","own":"oʊn","hard":"hɑrd","happy":"ˈhæpi","somewhere":"ˈsʌmˌwɛr","watching":"ˈwɑʧɪŋ","movies":"ˈmuviz","wasn't":"ˈwɑzənt","thẹn":"ˈtiˈeɪʧẹɛn","secret":"ˈsikrət","keeper":"ˈkipər","dog":"dɔg","forever":"fəˈrɛvər","piece":"pis","paper":"ˈpeɪpər","result":"rɪˈzʌlt","afternoon":"ˌæftərˈnun","meet":"mit","excuse":"ɪkˈskjus","baseball":"ˈbeɪsˈbɔl","simply":"ˈsɪmpli","relieved":"rɪˈlivd","studying":"ˈstʌdiɪŋ","burden":"ˈbɜrdən","learn":"lɜrn","revealed":"rɪˈvild","assigned":"əˈsaɪnd","marathon":"ˈmɛrəˌθɑn","seriously":"ˈsɪriəsli","mine":"maɪn","lots":"lɑts","secrets":"ˈsikrəts","objection":"əbˈʤɛkʃən","seems":"simz","burst":"bɜrst","letter":"ˈlɛtər","ask":"æsk","probably":"ˈprɑbəbli","best":"bɛst","himself":"hɪmˈsɛlf",
  "2000":"2000","calling":"ˈkɔlɪŋ","explain":"ɪkˈspleɪn","quick":"kwɪk","turn":"tɜrn","television":"ˈtɛləˌvɪʒən","channel":"ˈʧænəl","x":"ɛks","sounded":"ˈsaʊndəd","familiar":"fəˈmɪljər","name":"neɪm","honekawa":"honekawa","4th":"4ˈtiˈeɪʧ","surprise":"sərˈpraɪz","join":"ʤɔɪn","special":"ˈspɛʃəl","saw":"sɔ","looked":"lʊkt","nervous":"ˈnɜrvəs","kid":"kɪd","friend":"frɛnd","popular":"ˈpɑpjələr","sign":"saɪn","notebook":"ˈnoʊtˌbʊk","autograph":"ˈɔtəˌgræf","attitude":"ˈætəˌtud","ashamed":"əˈʃeɪmd","someone":"ˈsʌmˌwʌn","jealous":"ˈʤɛləs","spoke":"spoʊk","thought":"θɔt","impossible":"ɪmˈpɑsəbəl","famous":"ˈfeɪməs","job":"ʤɑb","sounds":"saʊndz","promising":"ˈprɑməsɪŋ","waste":"weɪst","overdoing":"ˈoʊvərˈduɪŋ","meant":"mɛnt","timid":"ˈtɪmɪd","reliable":"rɪˈlaɪəbəl","asking":"ˈæskɪŋ","criteria":"kraɪˈtɪriə","training":"ˈtreɪnɪŋ","pick":"pɪk","candidates":"ˈkændədeɪts","fourth":"fɔrθ","elementary":"ˌɛləˈmɛntri","nobi":"nobi","try":"traɪ","sing":"sɪŋ","song":"sɔŋ","rude":"rud","watched":"wɑʧt","lie":"laɪ","every":"ˈɛvəri","minutes":"ˈmɪnəts","called":"kɔld","show":"ʃoʊ","speak":"spik","nonsense":"ˈnɑnsɛns","touch":"tʌʧ","camera":"ˈkæmərə","yup":"jʌp","working":"ˈwɜrkɪŋ","disappointing":"ˌdɪsəˈpɔɪntɪŋ","taking":"ˈteɪkɪŋ","what're":"ˈwʌtər","embarrassed":"ɪmˈbɛrəst","hate":"heɪt","chasing":"ˈʧeɪsɪŋ","touched":"tʌʧt","trying":"ˈtraɪɪŋ","run":"rʌn","handsome":"ˈhænsəm","talented":"ˈtæləntəd","exactly":"ɪgˈzæktli","somebody":"ˈsʌmˌbɑdi","chance":"ʧæns","chase":"ʧeɪs","else":"ɛls","broadcasting":"ˈbrɔdˌkæstɪŋ","took":"tʊk","shut":"ʃʌt","making":"ˈmeɪkɪŋ","noise":"nɔɪz","hurts":"hɜrts","changing":"ˈʧeɪnʤɪŋ","singing":"ˈsɪŋɪŋ","doesn't":"ˈdʌzənt","sushi":"ˈsuʃi","shop":"ʃɑp","set":"sɛt","largest":"ˈlɑrʤəst","portion":"ˈpɔrʃən","man":"mən","exquisite":"ˈɛkskwəzət","pay":"peɪ","commercial":"kəˈmɜrʃəl","today's":"təˈdeɪz","programming":"ˈproʊˌgræmɪŋ","channels":"ˈʧænəlz","showing":"ˈʃoʊɪŋ","whose":"huz","clothes":"kloʊðz","second":"ˈsɛkənd","part":"pɑrt","nobody":"ˈnoʊˌbɑˌdi","embarrassing":"ɪmˈbɛrəsɪŋ","tenacious":"təˈneɪʃəs","nowhere":"ˈnoʊˌwɛr","escape":"ɪˈskeɪp","errands":"ˈɛrəndz","fair":"fɛr","suneo-san":"suneo-sæn","wants":"wɑnts","little":"ˈlɪtəl","longer":"ˈlɔŋgərf",
  "things":"ˈθɪŋz","met":"mɛt","partner":"ˈpɑrtnər","professor":"prəˈfɛsər","watson":"ˈwɑtsən","military":"ˈmɪləˌtɛri","doctor":"ˈdɑktər","afghanistan":"æfˈgænəˌstæn","handshake":"ˈhændˌʃeɪk","gymnastics":"ʤɪmˈnæstɪks","she's":"ʃiz","calluses":"ˈkæləsɪz","hand":"hænd","woman":"ˈwʊmən","worked":"wɜrkt","iron":"ˈaɪərn","bars":"bɑrz","tennis":"ˈtɛnəs","figured":"ˈfɪgjərd","blew":"blu","skirt":"skɜrt","mark":"mɑrk","crotch":"krɑʧ","level":"ˈlɛvəl","accomplished":"əˈkɑmplɪʃt","master":"ˈmæstər","vertical":"ˈvɜrtɪkəl","constant":"ˈkɑnstənt","key":"ki","knew":"nu","shook":"ʃʊk","cheater":"ˈʧitər","pass":"pæs","ahead":"əˈhɛd","shouldn't":"ˈʃʊdənt","bother":"ˈbɑðər","truth":"truθ","looking":"ˈlʊkɪŋ","forward":"ˈfɔrwərd","um":"ʌm","expect":"ɪkˈspɛkt","fall":"fɔl","departing":"dɪˈpɑrtɪŋ","warm":"wɔrm","there's":"ðɛrz","accident":"ˈæksədənt","ambulance":"ˈæmbjələns","kishida-kun":"kishida-kʌn","awful":"ˈɑfəl","aniki":"aniki","unlucky":"ənˈlʌki","bastard":"ˈbæstərd","murder":"ˈmɜrdər","killer":"ˈkɪlər","rode":"roʊd","coaster":"ˈkoʊstər","victim":"ˈvɪktəm","seven":"ˈsɛvən","bullshit":"ˈbʊlˌʃɪt","outta":"ˈaʊtə","kudoukun":"kudoukun","wow":"waʊ","unbelievably":"ˌʌnbəˈlivəbli","tricky":"ˈtrɪki","savior":"ˈseɪvjər",
  "short":"ʃɔrt","ground":"graʊnd","stiff":"stɪf","pain":"peɪn","ssh":"ssh","focus":"ˈfoʊkəs","comics":"ˈkɑmɪks","concentrate":"ˈkɑnsənˌtreɪt","tired":"ˈtaɪərd","scolds":"skoʊldz","everyday":"ˈɛvriˈdeɪ","concentration":"ˌkɑnsənˈtreɪʃən","soap":"soʊp","helmet":"ˈhɛlmət","sprayed":"spreɪd","surrounded":"səˈraʊndəd","shall":"ʃæl","works":"wɜrks","wearing":"ˈwɛrɪŋ","bothered":"ˈbɑðərd","okay":"ˌoʊˈkeɪ","focused":"ˈfoʊkəst","crap":"kræp","ants":"ænts","cockroach":"ˈkɑˌkroʊʧ","bring":"brɪŋ","small":"smɔl","sweater":"ˈswɛtər","last":"læst","year":"jɪr","luck":"lʌk","whoever":"huˈɛvər","needs":"nidz","line":"laɪn","entrance":"ˈɛntrəns","exam":"ɪgˈzæm","train":"treɪn","puzzle":"ˈpʌzəl","game":"geɪm","unforgettable":"ˌʌnfərˈgɛtəbəl","sune-chama":"sune-chama","hasn't":"ˈhæzənt","returned":"rɪˈtɜrnd","son":"sʌn","somehow":"ˈsʌmˌhaʊ",
  "printed":"ˈprɪntəd","photos":"ˈfoʊˌtoʊz","hike":"haɪk","giant's":"ˈʤaɪənts","positive":"ˈpɑzətɪv","generous":"ˈʤɛnərəs","shot":"ʃɑt","gave":"geɪv","free":"fri","complain":"kəmˈpleɪn","boring":"ˈbɔrɪŋ","most":"moʊst","taken":"ˈteɪkən","angle":"ˈæŋgəl","hiking":"ˈhaɪkɪŋ","together":"təˈgɛðər","plus":"plʌs","picture":"ˈpɪkʧər","offered":"ˈɔfərd","allow":"əˈlaʊ","scenery":"ˈsinəri","mountain":"ˈmaʊntən","captured":"ˈkæpʧərd","photo":"ˈfoʊˌtoʊ","preference":"ˈprɛfərəns","printer":"ˈprɪntər","fixed":"fɪkst","immediately":"ɪˈmidiətli","monitor":"ˈmɑnətər","drag":"dræg","print":"prɪnt","pictures":"ˈpɪkʧərz","trust":"trʌst","certainly":"ˈsɜrtənli","quickly":"ˈkwɪkli","pose":"poʊz","awesome":"ˈɑsəm","impress":"ˈɪmˌprɛs","upon":"əˈpɑn","mocking":"ˈmɑkɪŋ","slow":"sloʊ","side":"saɪd","scene":"sin","found":"faʊnd","flower":"ˈflaʊər","pushed":"pʊʃt","speaking":"ˈspikɪŋ","binoculars":"bəˈnɑkjələrz","single":"ˈsɪŋgəl","birds":"bɜrdz","animals":"ˈænəməlz","remove":"riˈmuv","rainbow":"ˈreɪnˌboʊ","film":"fɪlm","place":"pleɪs","frame":"freɪm","river":"ˈrɪvər","behind":"bɪˈhaɪnd","bush":"bʊʃ","lucky":"ˈlʌki","lying":"ˈlaɪɪŋ","mistaken":"mɪsˈteɪkən","swear":"swɛr","seen":"sin",
  "ribbon":"ˈrɪbən","bully":"ˈbʊli","weaker":"ˈwikər","elephant":"ˈɛləfənt","trunk":"trʌŋk","lipstick":"ˈlɪpˌstɪk","sec":"sɛk","closer":"ˈkloʊsər","lips":"lɪps","stretching":"ˈstrɛʧɪŋ","lose":"luz","against":"əˈgɛnst","coward":"ˈkaʊərd","doraemon's":"doraemon's","onwards":"ˈɑnwərdz","protect":"prəˈtɛkt","bullied":"ˈbʊlid","threw":"θru","defeat":"dɪˈfit","action":"ˈækʃən","nobita-san":"nobita-sæn","weakling":"ˈwiklɪŋ","hit":"hɪt","ever":"ˈɛvər","girl":"gɜrl","deceive":"dɪˈsiv","guys":"gaɪz","octopus":"ˈɑktəˌpʊs",
  "shizu-chan's":"shizu-ʧænz","birthday":"ˈbɜrθˌdeɪ","gift":"gɪft","music":"ˈmjuzɪk","box":"bɑks","wish":"wɪʃ","besides":"bɪˈsaɪdz","dolls":"dɑlz","matters":"ˈmætərz","heart":"hɑrt","point":"pɔɪnt","completely":"kəmˈplitli","present":"ˈprɛzənt","lecturing":"ˈlɛkʧərɪŋ","recorder":"rɪˈkɔrdər","seed":"sid","find":"faɪnd","pot":"pɑt","nutrient":"ˈnutriənt","blooms":"blumz","listening":"ˈlɪsənɪŋ","starting":"ˈstɑrtɪŋ","sprout":"spraʊt","recording":"rəˈkɔrdɪŋ","nobi-chan":"nobi-ʧæn","process":"ˈprɑˌsɛs","summer":"ˈsʌmər","fact":"fækt","sitting":"ˈsɪtɪŋ","sleepy":"ˈslipi","snore":"snɔr","three":"θri","hours":"ˈaʊərz","turns":"tɜrnz","perfect":"ˈpɜrˌfɪkt","bored":"bɔrd","radio":"ˈreɪdiˌoʊ","itself":"ɪtˈsɛlf","living":"ˈlɪvɪŋ","stereo":"ˈstɛriˌoʊ","talk":"tɔk","require":"ˌriˈkwaɪər","spending":"ˈspɛndɪŋ","grew":"gru","nearly":"ˈnɪrli","perfectly":"ˈpɜrfəktli","bloom":"blum","party":"ˈpɑrti","bloomed":"blumd","tricked":"trɪkt","enjoy":"ɛnˈʤɔɪ","rest":"rɛst","plays":"pleɪz","recorded":"rəˈkɔrdəd",
  "jetcoaster":"ʤɛtˈkoʊstər","signs":"saɪnz","mechanical":"məˈkænɪkəl","failure":"ˈfeɪljər","circumstances":"ˈsɜrkəmˌstænsəz","suicide":"ˈsuəˌsaɪd","unlikely":"ənˈlaɪkli","correct":"kəˈrɛkt","clearly":"ˈklɪrli","exclude":"ɪkˈsklud","ran-kun":"ræn-kʌn","suspects":"səˈspɛkts","car":"kɑr","b":"bi","riding":"ˈraɪdɪŋ","third":"θɜrd","lover":"ˈlʌvər","c":"si","men":"mɛn","black":"blæk","d":"di","e":"i","however":"ˌhaʊˈɛvər","safety":"ˈseɪfti","guards":"gɑrdz","unable":"əˈneɪbəl","killed":"kɪld","eyes":"aɪz","ice":"aɪs","kill":"kɪl","countless":"ˈkaʊntləs","numbers":"ˈnʌmbərz","feeling":"ˈfilɪŋ","woman's":"ˈwʊmənz","aiko":"aiko","along":"əˈlɔŋ","bitch":"bɪʧ","easier":"ˈiziər","seemed":"simd","fishy":"ˈfɪʃi","couple's":"ˈkʌpəlz","women":"ˈwɪmən","suspect":"ˈsʌˌspɛkt","pull":"pʊl","knife":"naɪf","aiko's":"aiko's","sever":"ˈsɛvər","human":"ˈhjumən","especially":"əˈspɛʃli","strength":"strɛŋkθ","plenty":"ˈplɛnti","chances":"ˈʧænsəz","toss":"tɔs","weapon":"ˈwɛpən","cover":"ˈkʌvər","cloth":"klɔθ","hide":"haɪd","beforehand":"bɪˈfɔrˌhænd","seats":"sits","couldn't":"ˈkʊdənt","speed":"spid","steel":"stil","hoop":"hup","piano":"piˈænoʊ","wire":"ˈwaɪər","assistance":"əˈsɪstəns","officers":"ˈɔfəsərz","murderer":"ˈmɜrdərər","guard":"gɑrd","lowered":"ˈloʊərd","object":"ˈɑbʤɛkt","ta-da":"tɑ-dɑ","quite":"kwaɪt","easily":"ˈizəli","prepared":"priˈpɛrd","hook":"hʊk","stretch":"strɛʧ","body":"ˈbɑdi","backwards":"ˈbækwərdz","neck":"nɛk","darkness":"ˈdɑrknəs","tunnel":"ˈtʌnəl","act":"ækt","attached":"əˈtæʧt","tossed":"tɔst","onto":"ˈɑntu","rail":"reɪl","power":"ˈpaʊər","outrageous":"aʊˈtreɪʤəs","proof":"pruf","pearl":"pɜrl","necklace":"ˈnɛkləs","ride":"raɪd","likely":"ˈlaɪkli","exchanged":"ɪksˈʧeɪnʤd","string":"strɪŋ","hidden":"ˈhɪdən","furthermore":"ˈfɜrðərˌmɔr","gymnast":"ˈʤɪmnəst","unlike":"ənˈlaɪk","finely":"ˈfaɪnli","trained":"treɪnd","balance":"ˈbæləns","rollercoaster":"ˈroʊlərˌkoʊstər","suspicious":"səˈspɪʃəs","innocent":"ˈɪnəsənt","stuck":"stʌk","killing":"ˈkɪlɪŋ","shed":"ʃɛd","tear":"tɛr","left":"lɛft","realized":"ˈriəˌlaɪzd","dead":"dɛd","seconds":"ˈsɛkəndz","station":"ˈsteɪʃən","words":"wɜrdz","large":"lɑrʤ","tears":"tɛrz","saying":"ˈseɪɪŋ","hitomi":"hitomi","teartracks":"teartracks","unshakable":"ənˈʃeɪkəbəl","[roller":"[ˈroʊlər","coaster]":"ˈkoʊstər]","flow":"floʊ","sideways":"ˈsaɪˌdweɪz","dumped":"dʌmpt","college":"ˈkɑlɪʤ","framing":"ˈfreɪmɪŋ","quantity":"ˈkwɑntəti","pills":"pɪlz","appeared":"əˈpɪrd","crime":"kraɪm","discovered":"dɪˈskʌvərd","pearls":"pɜrlz","few":"fju","reflected":"rəˈflɛktəd","dying":"ˈdaɪɪŋ","light":"laɪt","setting":"ˈsɛtɪŋ","sun":"sʌn",
  "100":"100","cry":"kraɪ","calm":"kɑm","scenes":"sinz","bodies":"ˈbɑdiz","pieces":"ˈpisəz","god":"gɑd","happens":"ˈhæpənz","does":"dʌz","checked":"ʧɛkt","roller":"ˈroʊlər","impatient":"ɪmˈpeɪʃənt","problem":"ˈprɑbləm","whoa":"woʊ","least":"list","million":"ˈmɪljən","complete":"kəmˈplit","company's":"ˈkʌmpəniz","gun":"gʌn","smuggling":"ˈsmʌglɪŋ","compared":"kəmˈpɛrd","stuff":"stʌf","sake":"seɪk","filthy":"ˈfɪlθi","hyenas":"haɪˈinəz","trailing":"ˈtreɪlɪŋ","guns":"gʌnz","pigs":"pɪgz","wandering":"ˈwɑndərɪŋ","poison":"ˈpɔɪzən","organization":"ˌɔrgənəˈzeɪʃən","developed":"dɪˈvɛləpt","tested":"ˈtɛstəd","humans":"ˈhjumənz","this'll":"ˈðɪsəl","guinea":"ˈgɪni","pig":"pɪg","hot":"hɑt","bones":"boʊnz","melting":"ˈmɛltɪŋ","breathing":"ˈbriðɪŋ","paramedics":"ˌpɛrəˈmɛdɪks","alive":"əˈlaɪv","damn":"dæm","head's":"hɛdz","bloody":"ˈblʌdi","policeman":"pəˈlismən","bunch":"bʌnʧ","wake":"weɪk",
  "it'd":"ˈɪtəd","beach":"biʧ","children":"ˈʧɪldrən","ourselves":"aʊərˈsɛlvz","teleport":"ˈtɛləˈpɔrt","door":"dɔr","nobita-kun":"nobita-kʌn","snacks":"snæks","coast":"koʊst","acts":"ækts","south":"saʊθ","pole":"poʊl","accidentally":"ˌæksəˈdɛntəli","regardless":"rəˈgɑrdləs","rammed":"ræmd","means":"minz","promised":"ˈprɑməst","unreal":"ənˈril","mirage":"məˈrɑʒ","candle":"ˈkændəl","candlestick":"ˈkændəlˌstɪk","ocean":"ˈoʊʃən","hardly":"ˈhɑrdli","holding":"ˈhoʊldɪŋ","imagine":"ɪˈmæʤən","brighter":"ˈbraɪtər","penguins":"ˈpɛŋgwənz","sea":"si","sand":"sænd","pretty":"ˈprɪti","wonderful":"ˈwʌndərfəl","swim":"swɪm","swimmer":"ˈswɪmər","dangerous":"ˈdeɪnʤərəs","bumped":"bʌmpt","invisible":"ɪnˈvɪzəbəl","watermelon":"ˈwɔtərˌmɛlən","their":"ðɛr","trash":"træʃ","everywhere":"ˈɛvriˌwɛr","irresponsible":"ɪrəˈspɑnsəbəl",
  "dirty":"ˈdɜrti","excuses":"ɪkˈskjusɪz","list":"lɪst","poor":"pur","clear":"klɪr","shirt":"ʃɜrt","garden":"ˈgɑrdən","empty":"ˈɛmpti","boxes":"ˈbɑksəz","heavy":"ˈhɛvi","stain":"steɪn","bee":"bi","definitely":"ˈdɛfənətli","clean":"klin","shower":"ˈʃaʊər","carrots":"ˈkærəts","hose":"hoʊz","spray":"spreɪ","flew":"flu","under":"ˈʌndər","increase":"ˈɪnˌkris","allowance":"əˈlaʊəns"};
function word2ipa(word) {
  word = word.replace(/[.,!?"]*/g, '').toLocaleLowerCase();
  if (word in wordsIPA) {
    return wordsIPA[word];
  }
  return '';
}

function divy(atts, inner) {
  return '<div ' + atts + '>' + inner + '<' + '/div>';
}
function linky(atts, inner) {
  return '<a ' + atts + '>' + inner + '<' + '/a>';
}

MeoU.glosses[MeoU.CONANCH1_1] = [[
  {"paneid":"p1-1",
   "xlation":["Đúng vậy."],
   "words":[[["Yes","vâng"]]],
   "time":{"start":0,"stop":1.5}},
  {"paneid":"p1-2",
   "xlation":["Hung thủ đã nhảy từ ô cửa sổ này qua ô cửa sổ khác...","Trước khi mọi người nghe tiếng hét của nạn nhân và chạy tới...","Và chúng ta biết điều này vì không hề có dấu chân nào ngoài cửa sổ..."],
   "words":[[["The culprit","Hung thủ"],["jumped","nhảy"],["from","từ"],["one","một"],["window","cửa sổ"],["to","đến"],["the other...","khác"]],[["Before","Trước"],["everyone","mọi người"],["heard","nghe"],["the","mạo từ"],["victim's","của nạn nhân"],["scream","tiếng hét"],["and","và"],["came","đến"],["running...","chạy"]],[["And","Và"],["we","Chúng ta"],["know","biết"],["this","điều này"],["because","bởi vì"],["there are","Có"],["no","không"],["footprints","dấu chân"],["outside","ngoài"],["the","mạo từ"],["window","cửa sổ"]]],
   "time":{"start":1.5,"stop":13.8}},
  {"paneid":"p1-3",
   "xlation":["Thật vô lý!","Chúng cách nhau 5 mét!","Nếu leo lên mái thì chỉ chưa đến 2 mét...","Nếu tôi không biết về cấu trúc đặc biệt của ngôi nhà, tôi đã không biết điều này..."],
   "words":[[["But","Nhưng"],["that's","Nó thì"],["ridiculous!","nực cười"]],[["They're","Chúng"],["5 meters","5 mét"],["apart!!","xa"]],[["It's","Nó thì"],["not","không"],["even","ngay cả"],["2 meters","2 mét"],["to","đến"],["climb","leo"],["up","lên"],["the wall","tường"],["to","đến"],["the roof...","mái nhà"]],[["It","Nó"],["wouldn't have","đã có thể không"],["occurred","xảy ra"],["to","với"],["me","tôi"],["had","có"],["I","Tôi"],["not","không"],["known","biết"],["this","này"],["house's","của ngôn nhà"],["unique","đặc biệt"],["structure...","cấu trúc"]]],
   "time":{"start":13.8,"stop":28.9}},
  {"paneid":"p1-4",
   "xlation":["Vào lúc đó, chỉ duy nhất một người có thể tự do đi lại mà không bị nghi ngờ...","Hãy nói đi!","Đó là ai?","Đó là..."],
   "words":[[["And","Và"],["at","tại"],["the","mạo từ"],["time","thời gian"],["there","có"],["was","to be"],["only","duy nhất"],["one","một"],["person","người"],["who","Ai"],["could","có thể"],["walk","đi"],["throughout","xuyên qua"],["the","mao từ"],["house","ngôi nhà"],["unsuspected...","không bị nghi ngờ"]],[["Out","Ngoài"],["with","với "],["it!","nó"]],[["Who","Ai"],["was","to be"],["it?","nó"]],[["It","Nó"],["was...","là"]]],
   "time":{"start":28.9,"stop":44}}],
 [{"paneid":"p2-1",
   "xlation":["Chính chồng bà ấy."],
   "words":[[["You","Bạn"],["sir","Ngài"],["the host","chủ"]]],
   "time":{"start":44,"stop":47.5}}],
 [{"paneid":"p3-1",
   "xlation":["Cậu đùa gì vậy...","Nhìn này, chân của ta...","Ông đừng đóng kịch nữa."],
   "words":[[["Stop","dừng"],["joking...","đùa giỡn"]],[["Look","Nhìn"],["at","ở"],["my","của tôi"],["leg,","chân"],["it's","Nó"],["still...","vẫn"]],[["You","Bạn"],["should","nên"],["give up","từ bỏ"],["the","mạo từ"],["acting,","diễn xuất"],["sir,","ngài"],["it's","Nó thì"],["wretched...","tội nghiệp"]]],
   "time":{"start":47.5,"stop":56.3}},
  {"paneid":"p3-2",
   "xlation":["Tất cả đã bại lộ rồi!","Ông chủ, chân ông."],
   "words":[[["And","Và"],["your","của bạn"],["secret","bí mật"],["is","to be"],["exposed!","tiết lộ"]],[["Sir,","Ngài"],["your","của bạn"],["leg...","chân"]]],
   "time":{"start":56.3,"stop":62.2}},
  {"paneid":"p3-3",
   "xlation":["Chân ông đã khỏi từ 3 tháng trước!","Phải vậy không, thanh tra Megure?","Từ bỏ!","Hãy thú nhận đi, bác sĩ của ông đã khai ra hết rồi..."],
   "words":[[["Your","Của bạn"],["leg","chân"],["was","to be"],["already","rồi"],["healed","lành"],["3 months","3 tháng"],["ago!","cách đây"]],[["Isn't","không"],["that","mạo từ"],["right","đúng"],["Inspector","thanh tra"],["Megure?","Tên"]],[["Give it up!","Từ bỏ"]],[["Your","Của bạn"],["doctors","những bác sỹ"],["told","đã nói"],["us","chúng tôi"],["everything...","tất cả mọi thứ"]]],
   "time":{"start":62.2,"stop":73.1}},
  {"paneid":"p3-4",
   "xlation":["Khốn kiếp!","Này, đứng lại.","Định chạy hả?"],
   "words":[[["Shit!","Khốn kiếp!"]],[["Hey,","Này"],["wait...","đợi"]],[["You're","Bạn"],["not","không"],["going","đi"],["anywhere...","đau"]]],
   "time":{"start":73.1,"stop":78.6}}],
 [{"paneid":"p4-1",
   "xlation":[],
   "words":[],
   "time":{"start":78.6,"stop":82.6}},
  {"paneid":"p4-2",
   "xlation":["Trúng đích!!"],
   "words":[[["Goal!!"," mục tiêu, vào"]]],
   "time":{"start":82.6,"stop":84.2}},
  {"paneid":"p4-3",
   "xlation":["Bây giờ, đi ngay!","Oh, được thôi.","Ôi, lần này lại nhờ cậu giúp đỡ rồi Kudou-Kun!"],
   "words":[[["Now,","bây giờ "],["walk!","đi "]],[["Oh,","oh "],["well..."," được thôi"]],[["Well,"," Được thôi"],["looks like","có vẻ như"],["we","chúng ta, chúng tôi "],["had to","phải"],["borrow","mượn"],["your","của bạn "],["help","giúp đỡ"],["once ","một lần"],["again,","lại "],["Kudou-kun!","Tên"]]],
   "time":{"start":84.2,"stop":93.5}},
  {"paneid":"p4-4",
   "xlation":["Cậu luôn làm tốt...","Không, không.."],
   "words":[[["You","bạn "],["always","luôn luôn"],["come","đến"],["through...","xuyên qua"]],[["No,","không "],["no...","không "]]],
   "time":{"start":93.5,"stop":97}},
  {"paneid":"p4-5",
   "xlation":["Nếu bạn gặp vụ án khó nào, cứ để thiên tài Kudou Shinichi giải quyết!!"],
   "words":[[["If","nếu "],["you've"," bạn"],["got"," có"],["a","mạo từ, một "],["tough"," khó, dai"],["case","trường hợp "],["to","giới từ"],[" crack,"," làm nứt, vỡ"],["just","chỉ "],["leave"," rời khỏi, bỏ lại"],["it","nó "],["to","giới từ"],["the","mạo từ"],["great","tuyệt vời"],["Kudou","Tên"],["Shinichi!!","Tên"]]],
   "time":{"start":97,"stop":104.1}}],
 [{"paneid":"p5-1",
   "xlation":["Thám tử học sinh lại phá án!"],
   "words":[[["High school","trường phổ thông"],["student"," học sinh"],["detective"," thám tử"],["solves","giải quyết"],["another"," khác"],["case!!","trường hợp "]]],
   "time":{"start":104.1,"stop":108.8}},
  {"paneid":"p5-2",
   "xlation":["Kudoi Shinichi, Học sinh trường cấp ba Teitan."],
   "words":[[["Kudou"," Tên"],["Shinichi,"," Tên"],["Teitan","Tên"],["High Junior","trường phổ thông"]]],
   "time":{"start":108.8,"stop":113.3}},
  {"paneid":"p5-3",
   "xlation":["Bạn đã nghe gì chưa?","Thám tử học sinh lại phá án rồi."],
   "words":[[["Did","Trợ động từ"],["you","bạn "],["hear?","nghe"]],[["That","Điều đó, cái đó"],["high"," cao"],["school"," trường"],["detective"," thám tử"],["did"," trợ động từ"],["it","nó "],["again!","lại "]]],
   "time":{"start":113.3,"stop":118.1}},
  {"paneid":"p5-4",
   "xlation":["Chúc có chắn chắn có thể gọi anh ấy là vị cứu tinh của ngành cảnh sát Nhật Bản"],
   "words":[[["We","chúng ta, chúng tôi"],["can","có thể "],["surely"," một cách chắc chắn"],["call","gọi "],["him,","anh ấy"],["the","mạo từ "],["saviour"," vị cứu tinh"],["of","giới từ"],["the","mạo từ "],["Japanese","Nhật Bản"],["Police"," cảnh sát"],["Department!"," bộ, ban"]]],
   "time":{"start":118.1,"stop":124}}],
 [{"paneid":"p6-1",
   "xlation":["Nhìn bạn kìa, hành động như một tên ngố...","Mouri Ran - học sinh trường Teitan."],
   "words":[[["Look","nhìn "],["at","ở, tại "],["you,","bạn "],["acting","diễn xuất "],["like","muốn, thích "],["such","như thế "],["a","mạo từ, một "],["dork..."," con người ngu ngốc"]],[["Mouri","tên"],["Ran,","tên"],["Teitan"," tên"],["High Junior"," Trường phổ thông"]]],
   "time":{"start":124,"stop":132.3}},
  {"paneid":"p6-2",
   "xlation":["Cậu khó chịu gì vậy Ran?","Oh, không có gì...","Tôi không khó chịu tí nào dù vì cậu mà bố tôi..."],
   "words":[[["What","cái gì "],["are","to be "],["you","bạn "],["mad","điên"],["about,","về "],["Ran?"," tên"]],[["Oh,","oh "],["nothing..."," không có gì"]],[["I'm","tôi "],["not","không "],["angry"," tức giận"],["at","ở, tại"],["all","tất cả"],["that","mạo từ, điều đó, cái đó, kia đó, đó, rằng, (?)"],["it's"," nó thì "],["your","của bạn "],["fault","lỗi"],["my","của tôi "],["father...","cha, bố"]]],
   "time":{"start":132.3,"stop":140.8}},
  {"paneid":"p6-3",
   "xlation":["thất nghiệp!!","Cái gì?","Bố cậu vẫn là một thám tử ư?"],
   "words":[[["Can't","không thể"],["get","lấy được"],["any","bất kì "],["work!!","công việc"]],[["What?","cái gì "]],[["Your","của bạn "],["dad's"," bố "],["still","vẫn "],["a","mạo từ, một "],["detective?"," thám tử"]]],
   "time":{"start":140.8,"stop":146.3}},
  {"paneid":"p6-4",
   "xlation":["Nhưng không phải vì tôi mà bố cậu thất nghiệp, bỏi vì trình độ của ông ấy..."],
   "words":[[["But","nhưng "],["it's"," nó thì "],["not","không "],["my","của tôi "],["fault"," lỗi"],["he's"," anh ấy thì"],["not","không"],["getting"," lấy được"],["any","bất kì "],["work,","làm việc"],["it's","nó thì"],["because","bởi vì "],["he","anh ấy"],["sucks"," mắc kẹt"],["at","ở, tại "],["it...","nó"]]],
   "time":{"start":146.3,"stop":153.2}},
  {"paneid":"p6-5",
   "xlation":["Tôi nói rồi, tôi không tức giận gì cả!"],
   "words":[[["I","tôi "],["said,","nói"],["I'm","tôi thì"],["not","không "],["mad"," điên"],["about","về "],["anything!!"," bất cứ cái gì "]]],
   "time":{"start":153.2,"stop":157.3}},
  {"paneid":"p6-6",
   "xlation":["Cậu đúng là đội trưởng đội Karate..."],
   "words":[[["That's","cái đó, nó thì "],["the","mạo từ"],["captain"," thuyền trưởng, đội trưởng"],["of"," của "],["the","mạo từ"],["karate"," võ karate"],["team"," đội"],["for","cho"],["you...","bạn "]]],
   "time":{"start":157.3,"stop":161.9}}],
 [{"paneid":"p7-1",
   "xlation":["Lấy quả bóng dùm với!","Hả?"],
   "words":[[["Get","Lấy"],["the","mạo từ"],["ball","quả bóng"],["for","cho"],["us!","chúng tôi"]],[["Huh?","Huh?"]]],
   "time":{"start":161.9,"stop":165.8}},
  {"paneid":"p7-2",
   "xlation":["Của bạn đây!"],
   "words":[[["Here you go!","Của bạn đây!"]]],
   "time":{"start":165.8,"stop":167.6}},
  {"paneid":"p7-3",
   "xlation":["Nếu trước đây bạn không bỏ đội tuyển bóng đá, bây giờ chắc bạn đã trở thành siêu sao rồi"],
   "words":[[["If","nếu"],["you","bạn"],["hadn't","đã không"],["quit","từ bỏ"],["the","mạo từ"],["soccer","bóng đá"],["team,","đội,"],["Shinichi,","Shinichi,"],["you'd","bạn sẽ"],["be","to be"],["a","mạo từ, một"],["national","quốc gia"],["hero","anh hùng"],["by now...","bây giờ..."]]],
   "time":{"start":167.6,"stop":173.1}},
  {"paneid":"p7-4",
   "xlation":["Tôi chỉ chơi bóng để tăng khả năng phản xạ cần thiết cho một thám tử thôi.","Bạn biết đấy, Holmes tập đấu kiếm"],
   "words":[[["I","Tôi"],["only","chỉ"],["played","chơi"],["soccer","bóng đá"],["to","giới từ"],["develop","phát triển"],["the","mạo từ"],["reflexes","sự phản xạ"],["necessary","cần thiết"],["for","cho"],["a","mạo từ, một"],["detective","thám tử"],["to","giới từ"],["have...","có "]],[["You","bạn"],["know,","biết"],["Holmes","Holmes"],["practiced","tập"],["fencing...","đấu kiếm"]]],
   "time":{"start":173.1,"stop":182.7}},
  {"paneid":"p7-5",
   "xlation":["Nhưng đó chỉ là trong sách..","Nhưng tất cả mọi người đều biết ông ấy là ai."],
   "words":[[["But","nhưng"],["that's","điều đó"],["in","trong"],["a","mạo từ, một"],["book...","cuốn sách"]],[["But","nhưng"],["everyone","mọi người"],["knows","biết"],["who","ai"],["he","anh ấy"],["is!","to be"]]],
   "time":{"start":182.7,"stop":187.3}},
  {"paneid":"p7-6",
   "xlation":["Ông ấy rất tuyệt vời!","Luôn luôn điềm tĩnh!","Luôn tràn đầy thông minh và tinh tế.","Khả năng lập luận và óc quan sát không ai sánh bằng.","Và hơn hết, ông ấy là một nghệ sỹ vỹ cầm chuyên nghiệp."],
   "words":[[["He's","Anh ấy"],["amazing!","tuyệt vời"]],[["Always","luôn luôn"],["cool","ngầu"],["and","và"],["composed!","điềm tĩnh"]],[["Brimming","Tràn đầy"],["with","giới từ"],["intelligence","sự thông minh"],["and","và"],["refinement!","sự tinh tế"]],[["His","Của anh ấy"],["reasoning","lập luận"],["and","và"],["observation","óc quan sát"],["skills","kĩ năng"],["are","to be"],["peerless!","không ai sánh bằng "]],[["And","Và"],["on","trên"],["top","đỉnh"],["of","giới từ"],["that,","điều đó"],["he","anh ấy"],["was","to be"],["good","tốt"],["enough","đủ"],["to","giới từ"],["be","to be, là"],["a","mạo từ, một"],["professional","chuyên nghiệp"],["violinist!","người chơi đàn vĩ cầm"]]],
   "time":{"start":187.3,"stop":204.2}},
  {"paneid":"p7-7",
   "xlation":["Conan Doyle đã tạo ra Sherlock Holmes, thám tử lừng danh nhất thế giới."],
   "words":[[["Conan Doyle","Conan Doyle"],["created","đã tạo ra"],["Sherlock Holmes","Sherlock Holmes"],["the","mạo từ"],["world's","của thế giới"],["greatest","tuyệt nhất"],["detective!","thám tử"]]],
   "time":{"start":204.2,"stop":210.2}}],
 [{"paneid":"p8-1",
   "xlation":["Tôi không chỉ có các tiểu thuyết bí ẩn của Conan Doyle mà tất cả trên thế giới ở nhà tôi"],
   "words":[[["I've","Tôi"],["got","có"],["all","tất cả"],["the","mạo từ"],["mystery","bí ẩn"],["novels","tiểu thuyết"],["in","trong"],["the","mạo từ"],["world","thế giới"],["at","tại"],["my","của tôi"],["house,","ngôi nhà"],["not","không"],["just","chỉ"],["Conan Doyle's"," của Conan Doyle"]]],
   "time":{"start":210.2,"stop":217.1}},
  {"paneid":"p8-2",
   "xlation":["Bạn thấy như thế nào?","Có muốn đọc thử không?","Không, cảm ơn.","Tôi tốt hơn hết không nên mắc chứng bệnh thám tử như bạn"],
   "words":[[["How","như thế nào"],["bout","về"],["it?","nó"]],[["Ya","Ya"],["wanna","muốn"],["read","đọc"],["one?","tiểu thuyết"]],[["No","không"],["thanks.","cảm ơn"]],[["I'd rather","tôi tốt hơn nên"],["not","không"],["catch","mắc"],["your","của bạn"],["detective","thám tử"],["disease.","bệnh"]]],
   "time":{"start":217.1,"stop":224.7}},
  {"paneid":"p8-3",
   "xlation":["Nhưng mà xem nè, thư của người hâm mộ...","Mọi người đều yêu mến thám tử.","Oh, thiệt vậy sao"],
   "words":[[["But","nhưng"],["look,","nhìn "],["fan","người hâm mộ"],["letters...","thư"]],[["Everyone","mọi người"],["loves","yêu mến"],["a","mạo từ, một"],["detective","thám tử"],["otaku!","otaku!"]],[["Oh","oh"],["really...","thật vậy sao"]]],
   "time":{"start":224.7,"stop":231.8}},
  {"paneid":"p8-4",
   "xlation":["Tôi không quan tâm chuyện bạn  điên cuồng với mấy cô này...","Nhưng bạn thật sự chỉ nên chọn một thôi.","Chọn một thôi hả?"],
   "words":[[["I","tôi"],["don't","không"],["mind","bận tâm"],["you","bạn"],["going","sắp đi"],["ga-ga","điên cuồng"],["over","giới từ"],["these","này"],["girls...","các cô gái"]],[["But","nhưng"],["you","bạn"],["really","thật sự"],["ought to","nên"],["narrow","thu hẹp"],["it","nó"],["down to ","xuống đến"],["one!","một"]],[["Down to ","xuống đến"],["one,","một"],["eh...","hả"]]],
   "time":{"start":231.8,"stop":241.3}},
  {"paneid":"p8-5",
   "xlation":["Thôi nào..."],
   "words":[[["Oh, brother...","thôi nào"]]],
   "time":{"start":241.3,"stop":243.5}},
  {"paneid":"p8-6",
   "xlation":["Bạn nhìm chằm chằm tôi có ý gì?","Không có gì.","Mỗi lần bạn dính đến mấy chuyện này là thế nào cũng gặp rắc rối.","Có thể!"],
   "words":[[["What","cái gì"],["are","to be"],["you","bạn"],["staring","nhìn chằm chằm"],["at","giới từ"],["me","tôi"],["for?","vì"]],[["Oh,","oh"],["nothing...","không có gì..."]],[["One","một"],["of","giới từ"],["these","mạo từ"],["times","lần"],["when","khi"],["you","bạn"],["stick your head ","liên quan đến"],["into","vào trong"],["these","này"],["cases","trường hợp"],["you're","bạn"],["going to","sẽ"],["end up ","kết thúc"],["in","trong"],["real","thật"],["trouble!","vấn đề!"]],[["Maybe!","Có thể!"]]],
   "time":{"start":243.5,"stop":255.3}},
  {"paneid":"p8-7",
   "xlation":["Tại sao bạn phải là thám tử?","Nếu bạn thích mấy câu chuyện bí ẩn đến vậy, bạn có thể trở thành nhà văn mà.","Tôi không muốn viết văn...","Tôi muốn trở thành thám tử!"],
   "words":[[["Why","tại sao"],["do","trợ động từ"],["you","bạn"],["have to","phải"],["be","to be"],["a","mạo từ, một"],["detective?","thám tử"]],[["If","nếu"],["you","bạn"],["love","yêu"],["those","mạo từ"],["detective","thám tử"],["stories","câu chuyện"],["so","rất"],["much,","nhiều"],["you","bạn"],["should","nên"],["be","to be"],["a","mạo từ"],["writer...","người viết văn"]],[["I","tôi"],["don't","không"],["want","muốn"],["to","giới từ"],["write","viết"],["about","về"],["detectives...","thám tử"]],[["I","tôi|"],["want","muốn"],["to","giới từ"],["be","to be, là"],["one!","nhà thám từ"]]],
   "time":{"start":255.3,"stop":266.7}}],
 [{"paneid":"p9-1",
   "xlation":["Heisei Sherlock Holmes!"],
   "words":[[["The","mạo từ"],["Heisei","Heisei"],["Sherlock","Sherlock"],["Holmes!","Holmes!"]]],
   "time":{"start":266.7,"stop":269.8}},
  {"paneid":"p9-2",
   "xlation":["Càng nhiều vụ án, tôi càng hưng phấn.","Cảm giác rùng mình khi mình ngăn chạn được âm mưu của bọn tội phạm.","Cảm giác đó!","Một khi bạn đã bắt đầu, bạn không thể dừng lại..."],
   "words":[[["The more","Càng nhiều"],["cases,","vụ án"],["the more","càng"],["excited","hào hứng"],["I","tôi"],["get!","cảm thấy"]],[["The","mạo từ"],["thrill","sư rùng mình"],["of","giới từ|"],["that","đó"],["moment","giây phút"],["when","khi"],["I","tôi"],["foil","ngăn chặn"],["the","mạo từ"],["schemes","kế hoạch"],["of","giới từ|"],["the","mạo từ"],["criminal!","tội phạm"]],[["The","mạo từ"],["sensation!","cảm giác"]],[["Once","một khi"],["you","bạn"],["start,","bắt đầu,"],["you","bạn"],["can't","không thể"],["stop...","dừng"]]],
   "time":{"start":269.8,"stop":281.5}},
  {"paneid":"p9-3",
   "xlation":["Đó chính là thám tử!"],
   "words":[[["That's","Đó là"],["what","những gì"],["detectives","thám tử"],["are","to be"],["like!","giống"]]],
   "time":{"start":281.5,"stop":284}},
  {"paneid":"p9-4",
   "xlation":["Hẹn gặp lại!","Này, đợi đã!","Bạn không quên cuộc hẹn ngày mai đó chứ?","Cuộc hẹn?"],
   "words":[[["See ya!","Hẹn gặp lại"]],[["Hey,","này"],["wait!","đợi"]],[["You","bạn"],["didn't","không"],["forget","quên"],["about","giới từ"],["your","của bạn"],["promise","hẹn"],["for","cho"],["tomorrow,","ngày mai"],["did you...?","phải không"]],[["Promise...?","cuộc hẹn"]]],
   "time":{"start":284,"stop":293.3}}],
 [{"paneid":"p10-1",
   "xlation":["Không phải bạn đã nói sao?","Bạn nói là nếu tôi thắng vòng thi đấu thành phố, bạn sẽ dắt tôi đến công viên giải trí."],
   "words":[[["Weren't","không phải"],["you","bạn"],["the","mạo từ"],["one","người"],["who","ai"],["said","nói"],["it?!","nó"]],[["You","bạn"],["said","nói"],["if","nếu"],["I","tôi"],["won","thắng"],["the","mạo từ"],["city","thành phố"],["tournament,","vòng thi đấu"],["you'd","bạn sẽ"],["take","dắt"],["me","tôi"],["to","đến"],["the","mạo từ"],["amusement park","công viên giải trí"]]],
   "time":{"start":293.3,"stop":300.3}},
  {"paneid":"p10-2",
   "xlation":["Huh?","Bạn đang nói cái gì vậy?","Oh, đừng bận tâm.","Tôi không đi với bạn nữa"],
   "words":[[["Huh?","Huh?"]],[["What","cái gì"],["are","to be"],["you","bạn"],["talking","đang nói"],["about?","về"]],[["Oh,","oh"],["never mind!","đừng bận tâm"]],[["I","tôi"],["didn't","không"],["want","muốn"],["to","giới từ"],["go","đi"],["with","với "],["you","bạn"],["anyways!","dù sao đi nữa!"]]],
   "time":{"start":300.3,"stop":307.7}},
  {"paneid":"p10-3",
   "xlation":["Bạn có thể đi chơi với bất kì cô gái nào viết thư cho bạn...","Thôi nào, tôi chỉ đùa thôi!","Đừng nổi điên!","Dĩ nhiên là tôi nhớ.","Vùng đất nhiệt đới ngày mai vào lúc 10h.","Sao tôi có thể quên được cơ chứ?","Đừng quên là bạn trả tiền hết đó...","Tôi hả ?"],
   "words":[[["You","bạn"],["can","có thể"],["go","đi"],["hang out","chơi"],["with","với "],["one","một"],["of","trong"],["the","mạo từ"],["girls"," những cô gái"],["writing","viết"],["you","bạn"],["fan","người hâm mộ"],["letters...","thư"]],[["I","tôi"],["was","to be|"],["just","chỉ"],["joking!","đùa giỡn"]],[["C'mon,","Thôi nào"],["don't","đừng"],["get","cảm thấy"],["mad!","điên"]],[["Of course","Tất nhiên"],["I","tôi"],["remembered!","nhớ"]],[["Tropical Land","Vùng đất nhiệt đới"],["tomorrow","ngày mai"],["at","vào lúc"],["10","10"],["o'clock!","giờ"]],[["How","Làm sao"],["could","có thể"],["I","tôi"],["possible","có thể"],["forget?","quên?"]],[["Don't","đừng"],["forget","quên"],["that","rằng"],["you're","bạn"],["paying","trả"],["for","cho"],["all","tất cả"],["of","giới từ"],["this...","điều này"]],[["Was I...?","là tôi sao?"]]],
   "time":{"start":307.7,"stop":330.6}}]];
MeoU.glosses[MeoU.CONANCH1_2] = [[
  {"paneid":"p1-1",
   "xlation":["Bạn biết đấy...","một trong những điều tuyệt vời về Holmes"],
   "words":[[["So","Váy"],["you see...","bạn biết đấy..."]],[["One","một"],["of","trong"],["the amazing","tuyệt vời"],["things","thứ"],["about","về"],["Holmes","Holmes"],["is...","to be"]]],
   "time":{"start":0,"stop":4.8}},
  {"paneid":"p1-2",
   "xlation":["Trong lần đầu tiên gặp cộng sư của mình là Giáo Sư Watson, ông ấy có thể biết được Watson là một bác sỹ tỏng quân đội chỉ qua một cái bắt tay"],
   "words":[[["The","mạo từ"],["first","đầu tiên"],["time","lần"],["he","anh ấy"],["met","đã gặp"],["his","của anh ấy"],["partner,","cộng sự"],["Professor","Giáo sư"],["Watson,","Watson,"],["he","anh ấy"],["could","có thể"],["tell","biết"],["he","anh ấy"],["was","to be"],["a","một"],["military","quân đội"],["doctor","bác sỹ"],["in","trong"],["Afghanistan,","Afghanistan,"],["just","chỉ"],["from","từ"],["a","một"],["handshake...","bắt tay..."]]],
   "time":{"start":4.8,"stop":13.5}},
  {"paneid":"p1-3",
   "xlation":["Chỉ như thế này...","Hả?"],
   "words":[[["Just","chỉ"],["like","như"],["this...","thế này..."]],[["Eh?","hả"]]],
   "time":{"start":13.5,"stop":15.9}},
  {"paneid":"p1-4",
   "xlation":["Bạn trong đội thể dục phải không?","Làm sao bạn biết được điều đó?"],
   "words":[[["You're","bạn"],["on","trong"],["a","một"],["gymnastics","thể dục"],["team,","đội"],["right?","đúng không"]],[["How","như thế nào"],["did","trợ động từ"],["you","bạn"],["know","biết"],["that...?","điều đó"]]],
   "time":{"start":15.9,"stop":20.8}},
  {"paneid":"p1-5",
   "xlation":["Bạn có biết thằng nhóc đó không?","Tôi nghĩ là không...","Cô ấy có những vết chai sần trên tay.","Phụ nữ có những vết chai những thế sẽ hay tiếp xúc với các thanh sắt.","Nhưng chơi tennis cũng có vết chai sần mà."],
   "words":[[["Do","trợ động từ"],["you","bạn"],["know","biết"],["that","mạo từ"],["kid?","đứa trẻ"]],[["I","tôi"],["don't","không"],["think","nghĩ"],["so...","vậy..."]],[["She's","Cô ấy"],["got","có"],["calluses","vết chai sần"],["on","trên"],["her","cô ấy"],["hand!","bàn tay"]],[["The","mạo từ"],["only","duy nhất"],["woman","phụ nữ"],["who","ai"],["would","sẽ"],["get","có"],["calluses","vết chai sần"],["like that","như thế"],["would","sẽ"],["be","to be"],["one","một"],["who","ai"],["worked","làm việc"],["with","với "],["iron","sắt"],["bars!","thanh"]],[["But","nhưng"],["you'd","bạn"],["get","có"],["calluses","vết chai sần"],["from","từ"],["playing","chơi "],["tennis,","tennis,"],["too....","cũng"]]],
   "time":{"start":20.8,"stop":36}},
  {"paneid":"p1-6",
   "xlation":["Thật ra, tôi biết điều này trước rồi khi gió tốc váy cô ấy lên.","Có một dấu hiệu đặc biệt ở đũng quần cô ấy mà chỉ những chuyên gia sử dụng xà dọc mới có"],
   "words":[[["Actually,","Thật sự"],["I","tôi"],["figured it out","phát hiện ra"],["when","khi"],["the","mạo từ"],["wind","gió"],["blew","thôi"],["up","lên"],["her","cô ấy"],["skirt","váy"],["earlier!","trước đó!"]],[["There","có"],["was","to be"],["a","mạo từ, một"],["unique","đặc biệt"],["mark","dấu vết"],["at","tại"],["the","mạo từ"],["crotch","đũng quần"],["level","vị trí"],["that","điều đó"],["could","có thể"],["only","chỉ là"],["be","to be"],["a","một"],["sign","dấu hiệu"],["of","của"],["an","mạo từ, một"],["accomplished","tài năng"],["master","chuyên gia"],["of","giới từ"],["the","mạo từ"],["vertical bars","xà dọc"]]],
   "time":{"start":36,"stop":47.5}},
  {"paneid":"p1-7",
   "xlation":["Óc quan sả cẩn thận và kiên định là chìa khoá để trở thành một thám tử.","Bạn ngạo mạn quá đi.","Bạn biết điều ấy trước khi bắt tay với cô ấy...","Bạn thật ăn gian"],
   "words":[[["Constant,","kiên định"],["careful","cẩn thận"],["observation","sự quan sát"],["is","to be"],["the","mạo từ"],["key","chìa khoá"],["to","giới từ"],["being","to be, là"],["a","một"],["detective...","thám tử"]],[["You","bạn"],["are","to be"],["so","rất"],["full of yourself!","ngạo mạn"]],[["You","bạn"],["knew","biết"],["that","diều đó"],["even","thậm chí"],["before","trước khi"],["you","bạn"],["shook","rung, lắc"],["her","cô ấy"],["hand...","tay"]],[["you","bạn"],["cheater!","ăn gian!"]]],
   "time":{"start":47.5,"stop":57.2}}],
 [{"paneid":"p2-1",
   "xlation":["Này!","Bạn đang cố quyến rũ bạn gái tôi phải không?","Ah, thì ra anh là bạn của cô ấy"],
   "words":[[["Hey!","này"]],[["Don't","không phải"],["you","bạn"],["be","to be"],["trying","cố"],["to","giới từ"],["make a pass at ","quyến rũ"],["my","của tôi"],["friend,","bạn"],["yeah?!","yeah?!"]],[["Oh,","oh"],["so","vậy là"],["you're","bạn là"],["her","cô ấy"],["friend...","bạn..."]]],
   "time":{"start":57.2,"stop":63.1}},
  {"paneid":"p2-2",
   "xlation":["Bạn có muốn lên trước chúng tôi không?","Không, cảm ơn.","Chúng ta không nên làm phiền họ!"],
   "words":[[["Would you like","Bạn có muốn"],["to","giới từ"],["cut ahead of","lên trước"],["us,","chúng tôi"],["then?","vậy"]],[["No,","không"],["thank you.","cảm ơn"]],[["We","chúng ta"],["shouldn't","không nên"],["bother","làm phiền"],["them!","họ"]]],
   "time":{"start":63.1,"stop":69.9}},
  {"paneid":"p2-3",
   "xlation":["Ran..","Sự thật là tôi đã thích bạn từ lâu lắm rồi.","Tôi cũng vậy..","Nhanh nào, đến lượt chúng ta rồi!"],
   "words":[[["Ran...","Ran..."]],[["The","mạo từ"],["truth","sự thật"],["is","to be"],["I've","tôi"],["been in love with","yêu"],["you","bạn"],["for","trong"],["a","một"],["long","dài"],["time","thời gian"],["now...","cho đến bây giờ"]],[["Me too","tôi cũng vậy"],["Shinichi...","Shinichi..."]],[["C'mon,","Nhanh nào"],["c'mon,","nhanh nào"],["we're","chúng ta"],["next!","kế tiếp"]]],
   "time":{"start":69.9,"stop":79.5}},
  {"paneid":"p2-4",
   "xlation":["Sau đó Holmes..","Đi nào!","Chúng tôi trước!","Bạn hiểu không?","Điều mà Cona Doyle muốn nói là Holmes..."],
   "words":[[["So anyways,","dù sao đi nữa"],["then","sau đó"],["Holmes...","Holmes..."]],[["Move!","di chuyển"]],[["We're","chúng tôi"],["first!","trước"]],[["You","bạn"],["get it?","hiểu không?"]],[["What","cái gì"],["Conan Doyle","Conan Doyle"],["was trying","đang cố gắng"],["to","giới từ"],["say","nói"],["is","to be"],["that","rằng"],["this","này"],["Holmes","Holmes"],["guy...","chàng trai..."]]],
   "time":{"start":79.5,"stop":90.2}},
  {"paneid":"p2-5",
   "xlation":["Bạn có thể đừng nói về Holmes như thế này, Conan Doyle như thế kia nữa được không?","Bạn đó, đồ kì lạ!"],
   "words":[[["Would","sẽ"],["you","bạn"],["just","chỉ"],["shut up","im lặng"],["with","với "],["the","mạo từ"],["Holmes","Holmes"],["this,","như thế này"],["Conan","Conan"],["Doyle","Doyle"],["that","như thế kia"],["already?","rồi chứ"]],[["You","bạn"],["mystery","bí ẩn"],["otaku!","chỉ những người rất đam mêm một thứ gì đó"]]],
   "time":{"start":90.2,"stop":97.4}}],
 [{"paneid":"p3-1",
   "xlation":["Tôi rất mong được đến đây với bạn, Shinichi.","Tại sao bạn không thể hiểu cảm giác của tôi.","Ran..."],
   "words":[[["I","tôi"],["was","to be"],["really","thật sự"],["looking forward to ","mong chờ"],["coming","đến"],["here","ở đây"],["with","với"],["you,","bạn"],["Shinichi!","Shinichi!"]],[["Why","tại sao"],["can't","không thể"],["you","bạn"],["understand","hiểu"],["my","của tôi"],["feelings?","cảm giác"]],[["Ran...","Ran..."]]],
   "time":{"start":97.4,"stop":105}},
  {"paneid":"p3-2",
   "xlation":["Um, Tôi...","Bạn biết đấy...","tại sao bạn căng thẳng vậy, đồ ngốc?","Tôi chỉ đùa thôi.","Hả?","Đừng mong trở thành thám tử khi bị lừa như thế."],
   "words":[[["Um,","um, "],["well,",""],["I...","tôi.."]],[["You","bạn"],["see...","biết đấy"]],[["What","cái gì"],["are","to be"],["you","bạn"],["getting ","trở nên"],["nervous","lo lắng"],["about,","về"],["idiot?","đồ ngốc"]],[["I'm","tôi"],["just","chỉ"],["kidding!","đùa"]],[["Eh?","hả"]],[["You","bạn"],["can't","không thể"],["expect","mong chờ"],["to","giới từ"],["be","to be"],["a","một"],["detective","thám tử"],["if","nếu"],["you","bạn"],["fall","thất bại"],["for","cho"],["something","những thứ"],["like that!","như thế này"]]],
   "time":{"start":105,"stop":118.3}},
  {"paneid":"p3-3",
   "xlation":["Bây giờ, khỏi hành thôi!"],
   "words":[[["Now","bây giờ"],["departing!","khởi hành!"]]],
   "time":{"start":118.3,"stop":120.4}},
  {"paneid":"p3-4",
   "xlation":["Nhưng.."],
   "words":[[["But...","nhưng"]]],
   "time":{"start":120.4,"stop":121.1}}],
 [{"paneid":"p4-1",
   "xlation":["Tôi thật sự mong chờ điều này!","Hả?"],
   "words":[[["I","tôi"],["was","to be"],["really","thật sự"],["looking forward to ","mong chờ"],["this!","điều này"]],[["Eh?","hả"]]],
   "time":{"start":121.1,"stop":125.3}}],
 [{"paneid":"p5-1",
   "xlation":["Hả?","Cái gì đây!","Nước ư?","Hả?"],
   "words":[[["Eh?","hả"]],[["What's","cái gì"],["this?","đây là"]],[["Water?","nước"]],[["Huh?","Huh?"]]],
   "time":{"start":125.3,"stop":130.3}},
  {"paneid":"p5-2",
   "xlation":["Cái gì vậy?","Nó ấm!","Tôi không thấy cái gì!","Nó quá tối!","Cái gì?","Đó là cái gì?"],
   "words":[[["What","cái gì"],["is","to be"],["that?!","này?"]],[["It's","nó"],["warm!","ấm"]],[["I","tôi"],["can't","không thể"],["see","thấy"],["anything.","bất cứ cái gì"]],[["It's","nó"],["too","quá"],["dark!","tối"]],[["What?!","cái gì"]],[["What","cái gì"],["is","to be"],["it?!","nó"]]],
   "time":{"start":130.3,"stop":137.3}}],
 [{"paneid":"p6-1",
   "xlation":["[]"],
   "words":[[["[empty]","[empty]"]]],
   "time":{"start":137.3,"stop":139.3}}],
 [{"paneid":"p7-1",
   "xlation":["Có tai nạn kìa!","Mau gọi xe cấp cứu!","Và gọi cảnh sát nữa"],
   "words":[[["There's ","Có"],["been","to be"],["an accident!","tai nạn"]],[["Call","gọi"],["an ambulance!","xe cấp cứu"]],[["And","và"],["get","gọi"],["the","mạo từ"],["police","cảnh sát"],["too!","cũng"]]],
   "time":{"start":139.3,"stop":144.7}},
  {"paneid":"p7-2",
   "xlation":["Sao chuyện này lại xảy ra với anh vậy Kishida-kun?","Kinh khủng quá.","Shinichi.","Aniki"],
   "words":[[["Why","tại sao"],["did","trợ động từ"],["this","điều này"],["happen","xảy ra"],["to","giới từ"],["Kishida-kun?","Kishida-kun?"]],[["How awful!","Kinh khủng quá!"]],[["Shinichi...","Shinichi..."]],[["Aniki","Aniki [ Anh trai Yakuza]"]]],
   "time":{"start":144.7,"stop":152.9}},
  {"paneid":"p7-3",
   "xlation":["Một gã xấu xố...","Đợi đã!","Đay không phải là một vụ tai nạn!","Đó là một vụ giết người!"],
   "words":[[["Unlucky","không may mắn"],["bastard...","kẻ tàn nhẫn"]],[["Wait!","đợi"]],[["This","điều này"],["was","to be, là"],["not","không"],[" an accident!","tai nạn"]],[["It's","nó thì"],[" a murder!","vụ giết người"]]],
   "time":{"start":152.9,"stop":159.1}},
  {"paneid":"p7-4",
   "xlation":["Và kẻ giết người...","Ngồi cùng chuyến tàu với nạn nhân"],
   "words":[[["And","và"],["the","mạo từ"],["killer...","kẻ giết người"]],[["Rode","ngồi"],["on","trên"],["the coaster","tàu lượn"],["with","với "],["the victim...","nạn nhân"]]],
   "time":{"start":159.1,"stop":162.8}}],
 [{"paneid":"p8-1",
   "xlation":["Một trong bảy chúng ta!"],
   "words":[[["One","một"],["of","trong"],["us","chúng tôi"],["seven!","bảy"]]],
   "time":{"start":162.8,"stop":164.2}},
  {"paneid":"p8-2",
   "xlation":["Shinichi...","Chết tiệt.","Chúng ta ra khỏi đây thôi"],
   "words":[[["Shinichi...","Shinichi..."]],[["Bullshit.","chết tiệt"]],[["We're","Chúng ta"],["outta","[out of] ra khỏi"],["here","ở đây"]]],
   "time":{"start":164.2,"stop":169.1}},
  {"paneid":"p8-3",
   "xlation":["Tránh ra, tránh ra!","Cảnh sát đây!","Khốn khiếp!","Oh!","Kudou-kun hả !","Thanh tra Megure!","Cái gì?","Kodou?"],
   "words":[[["Move,","di chuyển"],["move!","di chuyển"]],[["This","đây"],["is","to be, là"],["the police!","cảnh sát!"]],[["Shit!","khốn kiếp"]],[["Oh!","oh"]],[["Kudoukun!","kudoukun!"]],[["Ah,","ah"],["Inspector","thanh tra"],["Megure...","Megure..."]],[["What?!","cái gì"]],[["Kudou?!","Kudou?!"]]],
   "time":{"start":169.1,"stop":179.6}},
  {"paneid":"p8-4",
   "xlation":["Wow!","Hoá ra đó là thám tử học sinh nổi tiếng Shinichi Kudou đó sao?","Người có thể phá những vụ án hóc búa nhất!","Vị cứu tinh của cảnh sát Nhật Bản!","Nhanh đến đây mau.","Đó là Kudou đất!","Phải xem thôi!"],
   "words":[[["Wow!","wow!"]],[["So","Vậy"],["that's","đó là"],["the famous","nổi tiếng"],["high  school","trường trung học"],["detective,","thám tử"],["Kudou Shinichi?","Kudou Shinichi"]],[["The one","người"],["they","họ"],["say","nói"],["solves","giải quyết"],["all","tất cả"],["those","này"],["unbelievably","không thể tin được"],["tricky","khó"],["cases...","vụ án"]],[["The savior","vị cứu tinh"],["of","giới từ"],["the","mạo từ"],["Japanese","Nhật bản"],["police","cảnh sát"],["department!","bộ"]],[["Quick,","nhanh lên"],["come!","đến đây"]],[["It's","Nó"],["Kudou-kun!","Kudou-kun!"]],[["I","tôi"],["have  got to","phải"],["see","xem"],["this!","điều này!"]]],
   "time":{"start":179.6,"stop":197.7}}]];
MeoU.glosses[MeoU.CONANCH1_3] = [[
  {"paneid":"p1-1",
   "xlation":["Để tôi xem xét lại điều này, Kudon, Kun"],
   "words":[[["Let","Để "],["me","tôi"],["see","xem"],["if","nếu"],["I","tôi"],["have","có "],["this","cái này"],["right,","đúng "],["Kudou-kun...","Kudou-kun..."]]],
   "time":{"start":0,"stop":3.3}},
  {"paneid":"p1-2",
   "xlation":["Trên tàu lượn không có bất kì dấu hiệu nào của tai nạn hay trục trặc kỹ thuật cả.","Đúng vậy bác Mergue !","Đây rõ ràng là một vụ giết người.","Nếu ngoại trừ bạn và Ran.","Chúng ta có 5 nghi phạm"],
   "words":[[["On","trên"],["this","này"],["jetcoaster","tàu lượn"],["itself","bản thân nó"],["there","có"],["are","to be"],["no","không"],["signs","dấu hiệu"],["of","của"],["an accident","một vụ tai nạn"],["or","hoặc là"],["mechanical","thuộc về kỹ thuật"],["failure...","hư hỏng"]],[["From","từ"],["the circumstances,","hiện trường"],["suicide","tự tử"],["is","to be"],["unlikely...","không giống"]],[["Correct,","Chính xác"],["inspector!","thanh tra"]],[["This","đây"],["is","to be"],["clearly","rõ ràng"],["a murder...","vụ giết người"]],[["If","nếu"],["we","chúng ta"],["exclude","ngoài"],["you","bạn"],["and","và"],["Ran-kun,","Ran-kun,"],["we","chúng ta"],["have","có "],["5","5"],["suspects!","kẻ tình nghi!"]]],
   "time":{"start":3.3,"stop":19.9}},
  {"paneid":"p1-3",
   "xlation":["Trong xe đầu tiên , chúng ta có bạn của nạn nhân là A và B.","Ngồi cùng toa với anh ta là bạn gái cô C.","Cuối cùng hai người đàn ông mặc áo đen ngồi đăng sau là D và E"],
   "words":[[["In","trong"],["the","mạo từ"],["first","đầu tiên"],["car,","xe"],["we","chúng tôi"],["have","có "],["the victim's","của nạn nhân"],["friend","bạn"],["A","A..."],["and","và"],["friend","bạn "],["B...","B..."]],[["Riding","lái"],["in","trong"],["the third","thứ ba"],["car","xe"],["with","với "],["the victim","nạn nhân"],["was","to be"],["the victim's","của nạn nhân"],["friend","bạn"],["and","và"],["lover","người yêu"],["C...","C..."]],[["Finally,","cuối cùng"],["the men","người đàn ông"],["in","trong"],["black","đen"],["riding","toa xe"],["behind","đằng sau"],["the victim","nạn nhân"],["D","D"],["and","và"],["E...","E..."]]],
   "time":{"start":19.9,"stop":36.5}},
  {"paneid":"p1-4",
   "xlation":["Tuy nhiên, mọi người đều thắt dây an toàn và không thể di chuyển.","Người duy nhất có thể cắt cổ nạn nhân và người ngồi kế bên anh ấy.","Này, nhanh lên nào!"],
   "words":[[["However,","Tuy nhiên"],["with","với "],["everyone","mọi người"],["wearing","đeo"],["the","mạo từ"],["safety guards","đai an toàn"],["and","và"],["unable to","không thể"],["move...","di chuyển"]],[["the","mạo từ"],["only","duy nhất"],["one","người"],["who","mà"],["could","có thể"],["have killed","giết"],["him","anh ấy"],["is","to be"],["the woman","người phụ nữ"],["was","to be"],["sitting","ngồi"],["next to ","kế"],["him...","anh ấy"]],[["Hey,","này"],["hurry","nhanh"],["it","nó"],["up!","lên"]]],
   "time":{"start":36.5,"stop":47.5}},
  {"paneid":"p1-5",
   "xlation":["Chúng tôi không có thời gian cho trò chơi thám tử dở hơi này.","Ah, đại ca.."],
   "words":[[["We","chúng tôi"],["don't","không"],["have","có "],["time","thời gian"],["for","cho"],["this","này"],["bullshit","dở hơi"],["detective","thám tử"],["game...","trò chơi"]],[["A,","mạo từ"],["aniki...","đại ca..."]]],
   "time":{"start":47.5,"stop":53}}],
 [{"paneid":"p2-1",
   "xlation":["Ánh mắt lạnh như băng.","Anh mắt của kể giết hàng loạt người mà không gớm tay"],
   "words":[[["Those","này"],["eyes,","mắt"],["as","như"],["cold","lạnh"],["as","như"],["ice!!","bằng"]],[["The","mạo từ"],["eyes","mắt"],["of","của"],["someone","người"],["who","mà"],["could","có thể"],["kill","giết"],["countless","không đếm được"],["numbers","số"],["of","của"],["people","người"],["without","mà không"],["feeling","cảm giác"],["a thing!","điều gì"]]],
   "time":{"start":53,"stop":61.8}},
  {"paneid":"p2-2",
   "xlation":["Ông ấy là ai?"],
   "words":[[["Who","ai"],["is","to be"],["he?!","anh ấy"]]],
   "time":{"start":61.8,"stop":63.3}},
  {"paneid":"p2-3",
   "xlation":["Thanh tra!","Chúng tôi tìm thấy cái này trong túi của cô gái này!","Không thể nào"],
   "words":[[["Inspector!","thanh tra"]],[["We","chúng tôi"],["found","tìm thấy"],["this","này"],["in","trong"],["this","này"],["woman's","của phụ nữ"],["bag!","túi!"]],[["It","nó"],["can't","không thể"],["be...","to be"]]],
   "time":{"start":63.3,"stop":68.8}},
  {"paneid":"p2-4",
   "xlation":["Không phải của tôi!","Tôi không biết tại sao nó lại ở đó nữa!"],
   "words":[[["That's","nó thì"],["not","không"],["mine!","của  tôi"]],[["I","tôi"],["don't","không"],["know","biết"],["how","như thế nào"],["it","nó"],["got","tới"],["there!","đó"]]],
   "time":{"start":68.8,"stop":74.1}},
  {"paneid":"p2-5",
   "xlation":["Aiko...","Sao bạn có thể làm như thế?"],
   "words":[[["Aiko...","Aiko..."]],[["How","Sao"],["could","có thể"],["you","bạn"],["do","làm"],["such","như thế"],["a thing?","thứ?"]]],
   "time":{"start":74.1,"stop":77.4}}],
 [{"paneid":"p3-1",
   "xlation":["Không!","Không phải tôi!","Tôi cứ nghĩ rằng hai người yêu thương nhau lắm!","Tại sao?","Vậy là con ả này chính là thủ phạm!","Hãy để chúng tôi đi , Thanh tra"],
   "words":[[["No!","không"]],[["It","nó"],["wasn't","không phải"],["me!","tôi"]],[["I","tôi"],["thought","nghĩ"],["you","bạn"],["said","nói"],["you","bạn"],["two","hai"],["were","to be"],["getting along well...","thân thiết"]],[["Why...","tại sao"]],[["Okay,","Được thôi"],["so","vậy thì"],["the bitch","con ả"],["did","đã làm"],["it!","nó"]],[["Let","hãy để"],["us","chúng tôi"],["go","đi"],["now,","bây giờ"],["detective!","Thanh tra"]]],
   "time":{"start":77.4,"stop":88.4}},
  {"paneid":"p3-2",
   "xlation":["Oh!","Họ đã tìm ra thủ phạm dễ hơn tôi nghĩ.","Tôi thấy người phụ nữ đó rất đáng nghi.","Chắc đó chỉ do mâu thuẫn tình cảm.","Phụ nữ thật đáng sợ"],
   "words":[[["Oh...","oh"]],[["they","họ"],["found","tìm thấy"],["the killer","kẻ giết người"],["easier than","dễ hơn"],["I","tôi"],["thought","nghĩ"],["they","họ"],["would have.","sẽ"]],[["I","tôi"],["thought","nghĩ"],["that","rằng"],["woman","phụ nữ"],["seemed","trông có vẻ"],["a litte","một chút"],["fishy...","đáng nghi"]],[["So","vì thế"],["it","nó"],["was","to be"],["just","chỉ"],["a","mạo từ"],["couple's","của cặp đôi"],["fight,","cuộc chiến"],["eh?","hả"]],[["Women","phụ nữ"],["are","to be"],["scary...","đáng sợ"]]],
   "time":{"start":88.4,"stop":100.8}},
  {"paneid":"p3-3",
   "xlation":["Đúng rồi.","Bắt lấy cô ấy!","Không được !","Đợi một chút đã thanh tra, cô ấy không phải kẻ giết người!"],
   "words":[[["Right,","đúng"],["take","bắt lấy"],["her","cô ấy"],["in","trong"],["as","như"],["a suspect!","kẻ tình nghi"]],[["You","bạn"],["can't!","không thể"]],[["Wait","đợi"],["a minute","một phút"],["inspector...","thanh tra"]],[["That","đó"],["person","người"],["is","to be"],["not","không"],["the killer","kẻ giết người"]]],
   "time":{"start":100.8,"stop":109.7}},
  {"paneid":"p3-4",
   "xlation":["Kẻ giết người là..."],
   "words":[[["The killer","kẻ giết người"],["is...","to be"]]],
   "time":{"start":109.7,"stop":111.6}}],
 [{"paneid":"p4-1",
   "xlation":["Bạn!","Cái gì?","Cái gì?","Bạn đang nói cái ji vậy?","Bạn không thấy con dao được lấy ra từ túi của Akio sao?","không thể cắt đầu người bằng cái đó được.","Đặc biệt là sức của phụ nữ"],
   "words":[[["You!","bạn"]],[["What?!","cái gì"]],[["What?","cái gì"]],[["What","cái gì"],["are","to be"],["you","bạn"],["talking","đang nói"],["about?","về"]],[["Didn't","không"],["you","bạn"],["see","thấy"],["them","họ"],["pull","kéo"],["the knife","con dao"],["out of","ra khỏi"],["Aiko's","của Aiko"],["bag?","cái túi"]],[["You","bạn"],["can't","không thể"],["sever","cắt"],["a human","người"],["head","đầu"],["with","với"],["that...","thứ đó"]],[["Especially","Đặc biệt là"],["not","không"],["with","với "],["a woman's","của người phụ nữ"],["strength...","sức mạnh"]]],
   "time":{"start":111.6,"stop":126.1}},
  {"paneid":"p4-2",
   "xlation":["Và nếu thật sự cô ấy đã giết cô ấy, có rất nhiều cơ hội để phi tang vũ khí!","Không cần phải dấu diếm trong túi xách!"],
   "words":[[["And","Và"],["if","nếu"],["she","cô ấy"],["did","đã làm"],["kill","giết"],["him,","anh ta"],["there","có"],["would have been","sẽ có"],["plenty of","nhiều"],["chances","cớ  hội"],["to","để"],["toss","ném"],["the weapon!","vụ khí"]],[["No","không"],["need","cần"],["to","giới từ"],["cover","che đậy"],["it","nó"],["with","với"],["a","một"],["cloth","vải"],["and","và"],["hide","dấu"],["it","nó"],["in","trong"],["the bag","túi xách"]]],
   "time":{"start":126.1,"stop":135.5}},
  {"paneid":"p4-3",
   "xlation":["Không phải bạn đã để nó vào cặp của cô ấy trước đó rồi sao?","Dĩ nhiên không"],
   "words":[[["DIdn't","không phải"],["you","bạn"],["put","để"],["that","nó"],["in","vào trong"],["her","cô ấy"],["bag","túi"],["beforehand?","trước đó?"]],[["Of course","dĩ nhiên"],["I","tôi"],["didn't!","không"]]],
   "time":{"start":135.5,"stop":141}},
  {"paneid":"p4-4",
   "xlation":["Tôi ngồi trước Kishida-kun 2 ghế!","Làm sao tôi có thể cắt đầu anh ta?","Chính bạn cũng nói...","rằng không thể làm việc đó bằng sức của phụ nữ!","Đúng là với sức phụ nữ thì không thể."],
   "words":[[["I","tôi"],["was","to be"],["sitting","ngồi"],["two","hai"],["seats","chỗ"],["ahead","trước"],["of","giới từ"],["Kishida-kun!","Kishida-kun!"]],[["How","làm sao"],["could","có thể"],["I","tôi"],["have cut off","cắt"],["his","của anh ấy"],["head?","đầu?"]],[["You","bạn"],["were","to be"],["the one","là người"],["who","mà"],["said","nói"],["it","nó"],["first!","trước"]],[["That","Rằng"],["a woman","phụ nữ"],["couldn't","không thể"],["cut off","cắt"],["his","của anh ấy"],["head...","đầu"]],[["It","nó"],["certainly","dĩ nhiên"],["would","sẽ"],["be","to be"],["impossible","không thể"],["with","với "],["a woman's","của người phụ nữ"],["strength...","sức"]]],
   "time":{"start":141,"stop":155.4}}],
 [{"paneid":"p5-1",
   "xlation":["Tuy nhiên, với vận tốc của con tài và sợi thép làm bằng dây đàn thì hoàn toàn có thể được!"],
   "words":[[["However,","Tuy nhiên"],["with","với "],["the speed ","vận tốc"],["of","của"],["the coaster","con tàu"],["and","và"],["a","mạo từ"],["steel","thép"],["hoop","vòng"],["made","làm"],["from","từ"],["piano","đàn"],["wire,","dây"],["it","nó"],["can","có thể"],["be done!","được làm"]]],
   "time":{"start":155.4,"stop":162.9}},
  {"paneid":"p5-2",
   "xlation":["Tôi nhờ sự hỗ trợ  của các anh một chút được không?"],
   "words":[[["May","có thể"],["I","tôi"],["have","có "],["your","của bạn"],["assistance","sự hỗ trợ"],["for a moment","một chút"],["officers?","các nhân viên"]]],
   "time":{"start":162.9,"stop":166.6}},
  {"paneid":"p5-3",
   "xlation":["Mọi người thấy chứ?","Tôi là kẻ giết người và thanh tra sẽ là nạn nhân!"],
   "words":[[["See","Thấy"],["everyone?","mọi người"]],[["I","tôi"],["am","to be"],["the murderer","kẻ giết người"],["and","và"],["the inspector","thanh tra"],["is","to be"],["the victim","nạn nhân"]]],
   "time":{"start":166.6,"stop":173.3}},
  {"paneid":"p5-4",
   "xlation":["Đầu tiên, khi đai an toàn hạ xuống, chèn một cái túi sau lưng ","","là có thể ra được dễ dàng!","Tiếp theo sau đó, đã có sự chuẩn bị từ trước, hung thủ lấy ra một vật giống như móc câu."],
   "words":[[["First,","đầu tiên"],["when","khi"],["the safety guard","dây an toàn"],["is","to be"],["lowered,","thấp xuống"],["with","với "],["an object","một thứ"],["like","giống như"],["a bag","cái túi"],["on","trên"],["your","của bạn"],["back...","lưng"]],[["Ta-da!","Ta-da!"]],[["You","bạn"],["can","có thể"],["get out ","ra ngoài"],["quite","khá"],["easily...","dễ dàng"]],[["And","và"],["then","sau đó"],["next,","kế tiếp"],["prepared"," đã chuẩn bị"],["beforehand,","trước"],["you","bạn"],[" pick up","lấy ra"],["something","vài thứ"],["like","giống như"],["a hoop","vòng"],["with","với "],["a hook","một cái móc câu"],["at the end","cuối cùng"]]],
   "time":{"start":173.3,"stop":190.9}}],
 [{"paneid":"p6-1",
   "xlation":["Sau đó, vẫn giữ chân ở dây bảo hiểm, hung thủ nhoài người ra phía sau, quàng vào cổ nạn nhân.","Tất nhiên những việc này được thực hiện trong đường hầm tối."],
   "words":[[["Then,","sau đó"],["with","với"],["your","của bạn"],["legs","chân"],["in","trong"],["the guard","khung bảo hiểm"],["you","bạn"],["stretch","kéo"],["your","của bạn"],["body","cơ thể"],["backwards,","về phía sau"],["throw","ném"],["it","nó"],["around","xung quanh"],["the victim's","của nạn nhân"],["neck...","cổ"]],[["and","và"],["all","tất cả"],["of","giới từ"],["this","điều này"],["in","trong"],["the darkness","bóng  tối"],["of","giới từ"],["the tunnel","đường hầm"],["of course","dĩ nhiên"]]],
   "time":{"start":190.9,"stop":201.6}},
  {"paneid":"p6-2",
   "xlation":["Cuối cùng, nèm móc câu vào đường ray"],
   "words":[[["To","để"],["finish","kết thúc"],["the act","hành động"],["the hook","móc câu"],["attached","gắn"],["to","với"],["the hoop","vòng"],["is","to be"],["tossed","được ném"],["onto","vào"],["the rail","đường ray"]]],
   "time":{"start":201.6,"stop":207}},
  {"paneid":"p6-3",
   "xlation":["Và với sức mạnh và tốc độ của tàu siêu tốc, đầu anh ta sẽ đứt ngay lập tức"],
   "words":[[["And","Và"],["with","với "],["the power","sức mạnh"],["and","và"],["speed","tốc độ"],["of","của"],["the coaster","tàu siêu tốc"],["his","của anh ấy"],["head","đầu"],["comes","đi"],[" right off","ngay lập tức"]]],
   "time":{"start":207,"stop":212.7}},
  {"paneid":"p6-4",
   "xlation":["Thật không thể chấp nhận được!","Bằng chứng đâu?","Vậy thì để tôi hỏi.","Vòng cổ ngọc trai bạn đeo trước khi lên tàu đâu?"],
   "words":[[["That","điều này"],["is","to be"],["outrageous!","không chấp nhận được"]],[["Where's","ở đâu"],["your","của bạn"],["proof?!","bằng chứng"]],[["Let","hãy"],["me","tôi"],["ask","hỏi"],["you...","bạn"]],[["The pearl","ngọc trai"],["necklace","vòng đeo cổ"],["you","bạn"],["were","to be "],["wearing"," đeo"],["before","trước"],["the ride","chuyến đi"],["just","chỉ"],["where","ở đâu"],["is","to be"],["it","nó"],["now?","bây giờ"]]],
   "time":{"start":212.7,"stop":223.9}},
  {"paneid":"p6-5",
   "xlation":["Chắc chắn là chị đã thay dây vòng bằng dây piano và giấu móc câu trong túi xách"],
   "words":[[["You","bạn"],["most likely","gần như"],["exchanged","thay đổi"],["the necklace","vòng cổ"],["string","dây"],["for","cho"],["the piano","piano"],["wire,","dây"],["and","và"],["had","trợ động từ"],["the hook","cái móc"],["hidden","giấu"],["in","trong"],["your","của bạn"],["bag!","túi!"]]],
   "time":{"start":223.9,"stop":231.4}},
  {"paneid":"p6-6",
   "xlation":["Hơn thế nữa, bạn là vận động viên thể dục.","Không giống như những người phụ nữ khác, với khả năng giữ thăng bằng tốt, chỉ có chị mới có thể làm được như vậy khi ở trên tàu lượn.","Bây giờ, đợi chút.."],
   "words":[[["Furthermore,","Hơn nữa"],["you","bạn"],["are","to be"],["a gymnast!","vận động viên thể dục dụng cụ"]],[["Unlike","không giống"],["the","mạo từ"],["other","khác"],["woman,","phụ nữ"],["with","với "],["your","của bạn"],["finely","tốt"],["trained"," được huấn luyện"],["sense of balance","sự cân bằng"],["only","duy nhất"],["you","bạn"],["could","có thể"],["do","làm"],["this","điều này"],["on","trên"],["a rollercoaster!","tàu lượn"]],[["Now","bây giờ"],["just","chỉ"],["wait","đợi"],["a minute","một phút"]]],
   "time":{"start":231.4,"stop":243}}],
 [{"paneid":"p7-1",
   "xlation":["Thế còn hai người kia?","Làm từ vị trí của họ sẽ dễ dàng hơn rất nhiều!","Họ rất đáng nghi nhưng vô tội!"],
   "words":[[["What about","còn"],["those","những"],["two?","hai"]],[["Couldn't","có thể"],["they","họ"],["have","trợ động từ"],["done","đã làm"],["it","nó"],["more","hơn"],["easily","dễ dàng"],["from","từ"],["behind?","phía sau"]],[["They","họ"],["are","to be"],["certainly","chắc chắn"],["suspicious,","đáng nghi"],["but","nhưng"],["they","họ"],["are","to be"],["innocent!","vô tội!"]]],
   "time":{"start":243,"stop":252.1}},
  {"paneid":"p7-2",
   "xlation":["Tôi không biết họ là ai...","nhưng tôi thấy họ bối rối khi thây cảnh sáy đến.","Nếu họ làm điều này thì họ biết trước rồi mưới phải!"],
   "words":[[["I","tôi"],["don't","không"],["know","biết"],["who","ai"],["they","họ"],["are...","to be"]],[["but","nhưng"],["they","họ"],["would","sẽ"],["not","không"],["have","trợ động từ"],["stuck around","mắc kẹt"],["when","khi"],["the police","cảnh sát"],["came!","đến"]],[["They","họ"],["would have","sẽ"],["known","biết"],["this","điều này"],["would","sẽ"],["happen","xảy ra"],["if","nếu"],["they","họ"],["had","có"],["done","đã làm"],["it!","nó"]]],
   "time":{"start":252.1,"stop":260.7}},
  {"paneid":"p7-3",
   "xlation":["và hung thủ hiểu rằng, cô ấy sắp giết nạn nhân, nên cô đã rơi nước mắt trước khi ra tay"],
   "words":[[["And","và"],["the murderer","hung thủ"],["knew","biết"],["she","cô ấy"],["was","to be"],["killing","giết"],["the victim","nạn nhân"],["so","vì thế"],["she","cô ấy"],["shed a tear","ứa nước mắt"],["before","trước"],["she","cô ấy"],["did","làm nó"],["it...","nó"]]],
   "time":{"start":260.7,"stop":267.9}},
  {"paneid":"p7-4",
   "xlation":["Khi chúng ta ra khỏi đường hầm và nhận ra nạn nhân đã chết, chỉ mất hai hoặc 3 giây để về ga.","Trong khoảng thời gian đó, ngoài hung thủ ra không ai có thể khóc nheieuf như vậy được"],
   "words":[[["Once","Khi"],["we","chúng tôi"],["left","rời khỏi"],["the tunnel","đường hầm"],["and","và"],["realized","nhận ra"],["he","anh ấy"],["was","to be"],["dead,","chết"],["it","nó"],["was","to be"],["maybe","có thể"],["two","hai"],["or","hoặc"],["three","ba"],["seconds","giây"],["until","cho đến khi"],["we","chúng ta"],["got into","vào trong"],["the station..","trạm"]],[["In other words","nói cách khác"],["no","không"],["one","ai"],["riding","lái"],["the coaster","tàu siêu tốc"],["other","khác"],["than","hơn"],["the killer","kẻ giết người"],["would have been","sẽ"],[" able to","có thể"],["shed","rơi"],["such","như thế"],["large","lớn"],["tears.","nước mắt"]]],
   "time":{"start":267.9,"stop":282.9}},
  {"paneid":"p7-5",
   "xlation":["Vậy ý bạn là  bạn đã thấy Hitomi khóc trên tàu hả?","Cậu có bằng chứng gì không?","Nước mắt của cô ấy chính là bằng chứng"],
   "words":[[["So","vậy"],["are","to be"],["you","bạn"],["saying","nói"],["you","bạn"],["saw","thấy"],["Hitomi","Hitomi"],["crying","khóc"],["on","trên"],["the ride?","đường ray"]],[["Do","trợ động từ"],["you","bạn"],["have","có "],["any","bất kì"],["proof?","bằng chứng?"]],[["Her","cô ấy"],["teartracks"," nước mắt"],["are","to be"],["unshakable","chắc chắn"],["proof.","bằng chứng"]]],
   "time":{"start":282.9,"stop":292.5}},
  {"paneid":"p7-6",
   "xlation":["CHỉ duy nhất trên tàu lượn siêu tốc"],
   "words":[[["Only","duy nhất"],["on","trên"],["a jet coaster","tàu lượn siêu tốc"],["[roller",""],["coaster]...",""]]],
   "time":{"start":292.5,"stop":295}}],
 [{"paneid":"p8-1",
   "xlation":["Thì nước mắt mới tạt sang hai bên như vậy"],
   "words":[[["Would","sẽ"],["tears","nước mắt"],["flow","bay"],["sideways...","hai bên"]]],
   "time":{"start":295,"stop":299.2}},
  {"paneid":"p8-2",
   "xlation":["Anh ta rất tồi tệ!","Anh ta đã đá tôi!"],
   "words":[[["He","Anh"],["was","to be"],["awful","tệ"],["everyone!","mọi người"]],[["He","anh ấy"],["dumped","chia tay"],["me!","tôi"]]],
   "time":{"start":299.2,"stop":303.1}},
  {"paneid":"p8-3",
   "xlation":["Hitomi..","Ý bạn là bạn đã hẹn hò với Kishida-kun?","Đúng vậy.","Chúng tôi đã yêu nhau một thời gian dài trước khi tôi gặp bạn ở đại học"],
   "words":[[["Hitomi...","Hitomi..."]],[["You","bạn"],["mean","có ý"],["you","bạn"],["went out with","hẹn hò"],["Kishida-kun?","Kishida-kun?"]],[["Yes!","đúng"]],[["We","chúng tôi"],["were in love","yêu nhau"],["a","mạo từ"],["long","dài"],["time","thời gian"],["before","trước"],["I","tôi"],["met","gặp"],["you","bạn"],["in","trong"],["college!","đại học"]]],
   "time":{"start":303.1,"stop":311.4}},
  {"paneid":"p8-4",
   "xlation":["Và sau đó...","Anh ấy đã bỏ rơi tôi vì một người phụ nữ như Aiko.","VÌ thế"],
   "words":[[["And","và"],["then...","sau đó"]],[["he","anh ấy"],["dumped","chia tay"],["me","tôi"],["for","vì"],["a woman","người phụ nữ"],["like","như"],["Aiko...","Aiko..."]],[["So...","vì thế"]]],
   "time":{"start":311.4,"stop":317}},
  {"paneid":"p8-5",
   "xlation":["Tại nơi mà chúng tôi hẹn hò lần đầu tiên...","tôi đã dùng chiếc vòng anh ấy tặng...","và đổ tội cho Aiko"],
   "words":[[["At","tại"],["the place","nơi"],["where","mà"],["we","chúng tôi"],["went on ","diễn ra"],["our","của chúng tôi"],["first","đầu tiên"],["date...","ngày hẹn"]],[["with","với "],["the necklace","vòng cổ"],["he","anh ấy"],["gave","đưa"],["me...","tôi"]],[["framing","đổ tội"],["Aiko","Aiko"],["for","giới từ"],["it...","nó"]]],
   "time":{"start":317,"stop":324.8}}],
 [{"paneid":"p9-1",
   "xlation":["Tôi muốn giết anh ta!"],
   "words":[[["I","tôi"],["wanted","muốn"],["to","giới từ"],["kill","giết"],["him!","anh ấy!"]]],
   "time":{"start":324.8,"stop":327.9}},
  {"paneid":"p9-2",
   "xlation":["Một lượng lớn thuốc ngủ đã được tìm thấy trong túi của cô ấy.","Có vẻ cô ấy muốn tự tử ngay sau đó"],
   "words":[[["A","mạo từ"],["large","lớn"],["quantity","số lượng"],["of","giới từ"],["sleeping","ngủ"],["pills","thuốc"],["was found","được tìm"],["inside","bên trong"],["the woman's bag","của người phụ nữ"],["bag","túi"],["later...","sau đó...."]],[["It","nó"],["appeared","trông có  vẻ"],["she","cô ấy"],["was","to be"],["planning","có ý định"],["to","giới từ"],["die","chết"],["here...","ở đây"]]],
   "time":{"start":327.9,"stop":336}},
  {"paneid":"p9-3",
   "xlation":["Vòng cổ  dùng làm hung khí được tìm thấy sau hai giờ.","Nó thật sự được xâu bằng dây đàn piano"],
   "words":[[["The necklace","vòng cổ"],["used","sử dụng"],["in","trong"],["the crime","vụ án"],["was","to be"],["discovered","tìm thấy"],["two","hai"],["hours","tiếng"],["later.","sau đó"]],[["It","nó"],["was","to be"],["indeed","thật sự"],["a hoop","vòng"],["made","làm"],["from","từ"],["piano","piano"],["wire.","dây"]]],
   "time":{"start":336,"stop":344.3}},
  {"paneid":"p9-4",
   "xlation":["Hầu hết những hạt ngọc trai đã văng ra, chỉ còn một vài hạt ánh lên những tia nắng của nắng chiều"],
   "words":[[["Most","hầu hết"],["of","giới từ"],["the pearls","ngọc trai"],["had","trợ độgn từ"],["come off","văng ra"],["but","nhưng"],["the few","một ít"],["that","mà"],["were left","còn lại"],["reflected","phản chiếu"],["the","mạo từ"],["dying","nhuộn màu"],["light","ánh sáng"],["of","giới từ"],["the setting sun","trời chiều"]]],
   "time":{"start":344.3,"stop":351.4}},
  {"paneid":"p9-5",
   "xlation":["Giống như những giọt nước mắt"],
   "words":[[["Just like","giống như"],["large","lớn"],["tears...","nước mắt "]]],
   "time":{"start":351.4,"stop":354.3}}]];
MeoU.glosses[MeoU.CONANCH1_4] = [[
  {"paneid":"p1-1",
   "xlation":["Này, lại đây, đừng khóc nữa"],
   "words":[[["Hey,","này"],["c'mon [come on],","lại đây"],["don't","đừng"],["cry...","khóc"]]],
   "time":{"start":0,"stop":4.3}},
  {"paneid":"p1-2",
   "xlation":["Làm sao bạn có thể bình tĩnh đến thể!","Ah, Tớ ở nhiều hiện trường vụ án nên cũng quen với cảnh xác chết bị nát ra rồi!","Ôi trời!.","Thôi quên đi nhé, được không?","Ý tôi là."," Những chuyện này cũng xảy ra nhiều mà.","Không có đâu!"],
   "words":[[["How","Tại sao"],["can","có thể"],["you","bạn"],["be","to be"],["so","quá"],["calm","bình tĩnh"],["after","sau"],["that?","điều này?"]],[["Oh,","oh"],["I've","tôi"],["been","to be"],["around","xung quanh"],["lots of","nhiều"],["crime","tội"],["scenes","cảnh"],["so","vì thế"],["I","tôi"],["see","thấy"],["a lot of","nhiều"],["bodies","cơ thể"],["in","trong"],["pieces...","từng mảnh"]],[["Oh my god!","ôi trời"]],[["Hey,","này"],["just","hãy"],["forget","quên"],["about","về"],["it","nó"],["okay?","được không"]],[["I","tôi"],["mean...","có ý"]],[["this","điều này"],["kind ","loại"],["of","giới từ"],["thing","thứ"],["happens","xảy ra"],["a lot.","nhiều"]],[["It","nó"],["does","trợ động từ"],["not!","không"]]],
   "time":{"start":4.3,"stop":22.8}},
  {"paneid":"p1-3",
   "xlation":["Đó là một trong hai người đàn ông đáng nghi trên tàu."],
   "words":[[["That's","Đó là"],["one","một"],["of","giới từ"],["those","những"],["suspicious","đáng nghi"],["looking","trông có vẻ"],["guys","chàng trai"],["on","trên"],["the coaster","tàu lượn"]]],
   "time":{"start":22.8,"stop":28.5}},
  {"paneid":"p1-4",
   "xlation":["Xin lỗi Ran.","Cậu đi trước đi!"],
   "words":[[["Sorry,","Xin lỗi"],["Ran!","Ran!"]],[["Go on","Tiếp tục"],["ahead of","trước"],["me!","tôi"]]],
   "time":{"start":28.5,"stop":32.9}},
  {"paneid":"p1-5",
   "xlation":["Tôi sẽ bắt kịp bạn ngay!","Anh ấy đi rồi..."],
   "words":[[["I'll","tôi sẽ"],["catch up with","bắt kịp"],["you","bạn"],["right away!","ngay lập tức"]],[["He's","Anh ấy"],["leaving...","đi khỏi"]]],
   "time":{"start":32.9,"stop":37.8}},
  {"paneid":"p1-6",
   "xlation":["Shinichi.","Tại sao tôi lại có cảm giác này?"],
   "words":[[["Shinichi...","Shinichi..."]],[["Why","tại sao"],["did","trợ động từ"],["I","tôi"],["have","có "],["that","này"],["feeling?","cảm giác?"]]],
   "time":{"start":37.8,"stop":41.6}}],
 [{"paneid":"p2-1",
   "xlation":["Có cảm giác rằng tôi không bao giờ gặp lại bạn ấy nữa.","Một linh cảm rất xấu"],
   "words":[[["The feeling","cảm giác"],["that","rằng"],["I","tôi"],["would","sẽ"],["never","không bao giờ"],["see","thấy"],["him","anh ây"],["again.","lại"]],[["A","mạo từ"],["very","rất"],["bad","tệ"],["feeling.","cảm giác"]]],
   "time":{"start":41.6,"stop":47.4}},
  {"paneid":"p2-2",
   "xlation":["Xin lỗi, tôi để bạn chờ, ông CEO.","Tôi đi một mình như lời ông dặn đây"],
   "words":[[["Sorry","Xin lỗi"],["I","tôi"],["made","khiến"],["you","bạn"],["wait,","đợi"],["Mr.","Ông"],["CEO...","CEO..."]],[["Look,","nhìn này"],["I","tôi"],["came","đến"],["by myself","chính tôi"],["just like","chỉ giống như"],["you","bạn"],["said!","nói"]]],
   "time":{"start":47.4,"stop":54.9}},
  {"paneid":"p2-3",
   "xlation":["Tôi biết.","Lúc nãy tôi đã quan sát ông lúc ở trên tàu lượn siêu tốc.","Mau đưa tôi thứ đó đi."],
   "words":[[["I","tôi"],["know","biết"],["you","bạn"],["did...","trợ động từ"]],[["I","tôi"],["checked","đã kiểm tra"],["to","giới từ"],["make sure","chắc chắn"],["from","từ"],["the top","đỉnh"],["of","giới từ"],["that","đó"],["roller coaster.","tàu lượn siêu tốc"]],[["Come on,","lại đây"],["give","đưa"],["me","tôi"],["the thing","thứ đó"]]],
   "time":{"start":54.9,"stop":62.3}},
  {"paneid":"p2-4",
   "xlation":["Đừng vội thế.","Đưa tiền trước đây.."],
   "words":[[["Don't","đừng"],["be","to be"],["so","quá"],["impatient...","thiếu kiên nhẫn"]],[["The money","tiền"],["comes","đến"],["first.","đầu tiên"]]],
   "time":{"start":62.3,"stop":65.6}}],
 [{"paneid":"p3-1",
   "xlation":["Đây.","Không vấn đề, phải không?"],
   "words":[[["Here!","ở đây"]],[["No problem,","không vẫn đề"],["right?","đúng"]]],
   "time":{"start":65.6,"stop":68.8}},
  {"paneid":"p3-2",
   "xlation":["Whoa.","Chỗ đó ít nhất lên đến cả trăm triệu Yên."],
   "words":[[["Whoa...","Whoa..."]],[["There's got","có"],["to","giới từ"],["be","to be"],["at","tại"],["least","ít nhất"],["100","100"],["million","triệu"],["yen","yen"],["in","trong"],["there...","đó...."]]],
   "time":{"start":68.8,"stop":73.4}},
  {"paneid":"p3-3",
   "xlation":["Được rồi.","Thỏa thuận hoàn thành!","Bây giờ hãy đưa cuộn phim cho tôi!","Cuộn phim ư?"],
   "words":[[["Right.","được rồi"]],[["The deal","thỏa thuận"],["is","to be"],["complete!","hoàn thành"]],[["Now","bây giờ"],["give","đưa"],["me","tôi"],["the film.","cuộn phim"]],[["Film?","cuộn phim?"]]],
   "time":{"start":73.4,"stop":78.4}},
  {"paneid":"p3-4",
   "xlation":["Của bạn đây!","Cuộn phim quay lại công ty bạn buôn lậu.","Lần sau đừng làm chuyện bậy bạ nữa nhé!"],
   "words":[[["Here you go!","Của bạn đây!"]],[["Film","cuộn phim"],["of","giới từ"],["your","của bạn"],["company's","công ty của bạn"],["gun","súng"],["smuggling...","buôn lậu"]],[["You","bạn"],["shouldn't","không nên"],["be","to be"],["so","quá"],["naughty!","hư hỏng!"]]],
   "time":{"start":78.4,"stop":85.4}},
  {"paneid":"p3-5",
   "xlation":["Chuyện này là thật sao?"],
   "words":[[["Is","to be"],["this","điều này"],["serious?","nghiêm túc?"]]],
   "time":{"start":85.4,"stop":88.2}},
  {"paneid":"p3-6",
   "xlation":["Im đi!","So với những chuyện các ông làm thì chúng tôi...","Tôi sẽ không nói nữa đâu, cẩn thận mồm miệng đó"],
   "words":[[["Shut up!","Im đi"]],[["Compared","So sánh"],["to","giới từ"],["the stuff","những việc"],["you guys","các bạn"],["do,","làm"],["we're...","chúng tôi"]],[["I","tôi"],["wouldn't","sẽ không"],["say","nói"],["any more","thêm nữa"],["for","vì"],["your ","của bạn"],["sake","lợi ích"]]],
   "time":{"start":88.2,"stop":95.2}},
  {"paneid":"p3-7",
   "xlation":["Im đi!","Đồ bẩn thỉu xấu xa!","Trò chơi thám tử của bạn!"],
   "words":[[["Shut up!","Im đi!"]],[["You","bạn"],["filthy","bẩn thỉu"],["hyenas!","tàn bạo"]],[["Your","của bạn"],["detective","thán tử"],["game...","trò chơi"]]],
   "time":{"start":95.2,"stop":99.7}}],
 [{"paneid":"p4-1",
   "xlation":["Kết thúc rồi!"],
   "words":[[["Is","to be"],["over!","kết thúc"]]],
   "time":{"start":99.7,"stop":101.8}},
  {"paneid":"p4-2",
   "xlation":["Đại ca...","Thằng oách này theo dõi chúng ta.."],
   "words":[[["Aniki...","Đại ca.."]],[["This","này"],["little","nhỏ"],["shit","khốn kiếp"],["was","to be"],["trailing","theo đuôi"],["us...","chúng ta"]]],
   "time":{"start":101.8,"stop":105.8}},
  {"paneid":"p4-3",
   "xlation":["Chúng ta có nên giết nó không?","Không, không được dùng súng!","Bọn cớm vẫn còn lãng vãng quanh đây sau vụ hồi nãy."],
   "words":[[["Should","nên"],["we","chúng ta"],["kill","giết"],["him?","anh ta?"]],[["No,","không"],["no","không"],["guns!","súng"]],[["The pigs","người thô tục"],["are","to be"],["still","vẫn"],["wandering","lãng vãng"],["around","xung quanh"],["because of","bởi vì"],["that","đó"],["shit","khốn kiếp"],["earlier!","lúc nãy!"]]],
   "time":{"start":105.8,"stop":112.4}},
  {"paneid":"p4-4",
   "xlation":["Chúng tôi sẽ sử dụng cái này...","Một loại độc dược tổ chức chúng ta mới sáng chế"],
   "words":[[["We'll","Chúng ta sẽ"],["use","sử dụng"],["this...","này"]],[["The","mạo từ"],["new","mới"],["poison","thuốc độc"],["the organization","tổ chức"],["developed...","đã phát triển"]]],
   "time":{"start":112.4,"stop":117.2}},
  {"paneid":"p4-5",
   "xlation":["Bạn không thể tìm thấy bất kì dấu hiệu của thuốc độc sau khi sử dụng thứ này.","Bọn ta vẫn chưa thử nghiệm trên người"],
   "words":[[["You","bạn"],["can't","không thể"],["find","tìm thấy"],["any","bất kì"],["signs","dấu hiệu"],["of","giới từ"],["poison","thuốc độc"],["on","trên"],["the body","cơ thể"],["with","với "],["this stuff.","thứ này"]],[["We","chúng ta"],["haven't","không thể"],["tested","kiểm tra"],["it","nó"],["on","trên"],["humans","con người"],["yet.","chưa"]]],
   "time":{"start":117.2,"stop":125.3}},
  {"paneid":"p4-6",
   "xlation":["Vậy thì đây sẽ là vậy thí nghiệm của chúng ta"],
   "words":[[["So","vì thế"],["this'll","điều này sẽ"],["be","to be"],["our","của chúng ta"],["little","nhỏ"],["guinea pig","người thí nghiệm"]]],
   "time":{"start":125.3,"stop":128.2}},
  {"paneid":"p4-7",
   "xlation":["Đại ca, nhanh lên"],
   "words":[[["Aniki,","Đại ca"],["hurry up","nhanh lên"]]],
   "time":{"start":128.2,"stop":130.8}}],
 [{"paneid":"p5-1",
   "xlation":["Tạm biệt, thám tử"],
   "words":[[["So long,","tạm biệt"],["detective!","thám tử"]]],
   "time":{"start":130.8,"stop":134}},
  {"paneid":"p5-2",
   "xlation":["Cơ thể của tôi.","Nó nóng!"],
   "words":[[["My body.","Cơ thể của tôi."]],[["It's","Nó"],["hot!","nóng!"]]],
   "time":{"start":134,"stop":136.6}},
  {"paneid":"p5-3",
   "xlation":["Giống như xương của tôi đang tan chảy..."],
   "words":[[["Like","giống như"],["my","của tôi "],["bones,","xương cốt"],["like","giống như"],["they're","chúng"],["melting...","tan chảy"]]],
   "time":{"start":136.6,"stop":140.1}},
  {"paneid":"p5-4",
   "xlation":["Không tốt rồi..."],
   "words":[[["No","không"],["good...","tốt"]]],
   "time":{"start":140.1,"stop":142.8}}],
 [{"paneid":"p6-1",
   "xlation":["Này, lại đây!","Có người chết ở đây!","Cái gì?"],
   "words":[[["Hey,","này"],["come","lại"],["here!","đây"]],[["We've","Chúng tôi"],["got","có"],["a","một"],["dead","chết"],["body!","cơ thể"]],[["What?","cái gì"]]],
   "time":{"start":142.8,"stop":147.7}},
  {"paneid":"p6-2",
   "xlation":["Vậy là mình đã chết rồi"],
   "words":[[["So","vậy là"],["I","tôi"],["really","thật sự"],["am","to be"],["dead...","chết..."]]],
   "time":{"start":147.7,"stop":151.9}},
  {"paneid":"p6-3",
   "xlation":["Đợi, anh ấy vẫn thở!","Gọi cấp cứu nhanh lên!"],
   "words":[[["Wait,","đợi"],["he's","anh ấy"],["still","vẫn"],["breathing!","thở"]],[["Hurry,","nhanh lên"],["call","gọi"],["the paramedics!","nhân viên y tế"]]],
   "time":{"start":151.9,"stop":156.8}},
  {"paneid":"p6-4",
   "xlation":["Tôi còn sống ư?","Vậy là thuốc độc không có tác dụng trên con người.","Đầu anh ta chảy máu nhiều quá.","May mắn quá"],
   "words":[[["I'm","tôi"],["alive?","còn sống"]],[["So","vậy là"],["the poison","thuốc độc"],["doesn't","không"],["work","hoạt động"],["on","trên"],["humans.","con người"]],[["Damn,","chết tiệt"],["his","của anh ấy"],["head's","đầu"],["all","tất cả"],["bloody...","chảy máu"]],[["I'm","tôi"],["lucky...","may mắn"]]],
   "time":{"start":156.8,"stop":166.5}},
  {"paneid":"p6-5",
   "xlation":["Cảnh sát, nhiều quá.","Này, tỉnh dậy đi!","Bạn ổn không?","Thật tuyệt!","Vậy là bây giờ tôi có thể kể với mọi người chuyện gì vừa xảy ra."],
   "words":[[["Policeman,","cảnh sát"],["a bunch","một đống"],["of","giới từ"],["them...","chúng.."]],[["Hey,","này"],["wake up!","tỉnh dậy đi"]],[["You","bạn"],["okay?","ổn không"]],[["This","điều này"],["is","to be"],["great!","tuyệt"]],[["Now","bây giờ"],["I","tôi"],["can","có thể"],["tell","nói"],["everyone","mọi người"],["what","cái gì"],["they","họ"],["were","to be"],["doing!","đang làm"]]],
   "time":{"start":166.5,"stop":177.2}},
  {"paneid":"p6-6",
   "xlation":["Bạn có thể đứng lên không, cậu nhóc?","Cậu nhóc?"],
   "words":[[["Can","có thể"],["you","bạn"],["stand up","đứng lên"],["little","nhỏ"],["boy?"," trai"]],[["Little","nhỏ"],["boy?!","trai?!"]]],
   "time":{"start":177.2,"stop":182}}]];
MeoU.glosses[MeoU.CONAN] = [[
  {"paneid":"p1-1",
   "xlation":["Đúng vậy."],
   "words":[[["Yes","vâng"]]],
   "time":{"start":"0","stop":"1.5"}},
  {"paneid":"p1-2",
   "xlation":["Hung thủ đã nhảy từ ô cửa sổ này qua ô cửa sổ khác...","Trước khi mọi người nghe tiếng hét của nạn nhân và chạy tới...","Và chúng ta biết điều này vì không hề có dấu chân nào ngoài cửa sổ..."],
   "words":[[["The culprit","Hung thủ"],["jumped","nhảy"],["from","từ"],["one","một"],["window","cửa sổ"],["to","đến"],["the other...","khác"]],[["Before","Trước"],["everyone","mọi người"],["heard","nghe"],["the","mạo từ"],["victim's","của nạn nhân"],["scream","tiếng hét"],["and","và"],["came","đến"],["running...","chạy"]],[["And","Và"],["we","Chúng ta"],["know","biết"],["this","điều này"],["because","bởi vì"],["there are","Có"],["no","không"],["footprints","dấu chân"],["outside","ngoài"],["the","mạo từ"],["window","cửa sổ"]]],
   "time":{"start":"1.5","stop":"13"}},
  {"paneid":"p1-3",
   "xlation":["Thật vô lý!","Chúng cách nhau 5 mét!","Nếu leo lên mái thì chỉ chưa đến 2 mét...","Nếu tôi không biết về cấu trúc đặc biệt của ngôi nhà, tôi đã không biết điều này..."],
   "words":[[["But","Nhưng"],["that's","Nó thì"],["ridiculous!","nực cười"]],[["They're","Chúng"],["5 meters","5 mét"],["apart!!","xa"]],[["It's","Nó thì"],["not","không"],["even","ngay cả"],["2 meters","2 mét"],["to","đến"],["climb","leo"],["up","lên"],["the wall","tường"],["to","đến"],["the roof...","mái nhà"]],[["It","Nó"],["wouldn't have","đã có thể không"],["occurred","xảy ra"],["to","với"],["me","tôi"],["had","có"],["I","Tôi"],["not","không"],["known","biết"],["this","này"],["house's","của ngôn nhà"],["unique","đặc biệt"],["structure...","cấu trúc"]]],
   "time":{"start":"13","stop":"29"}},
  {"paneid":"p1-4",
   "xlation":["Vào lúc đó, chỉ duy nhất một người có thể tự do đi lại mà không bị nghi ngờ...","Hãy nói đi!","Đó là ai?","Đó là..."],
   "words":[[["And","Và"],["at","tại"],["the","mạo từ"],["time","thời gian"],["there","có"],["was","to be"],["only","duy nhất"],["one","một"],["person","người"],["who","Ai"],["could","có thể"],["walk","đi"],["throughout","xuyên qua"],["the","mao từ"],["house","ngôi nhà"],["unsuspected...","không bị nghi ngờ"]],[["Out","Ngoài"],["with","với "],["it!","nó"]],[["Who","Ai"],["was","to be"],["it?","nó"]],[["It","Nó"],["was...","là"]]],
   "time":{"start":"29","stop":"44"}}],
 [{"paneid":"p2-1",
   "xlation":["Chính chồng bà ấy."],
   "words":[[["You","Bạn"],["sir","Ngài"],["the host","chủ"]]],
   "time":{"start":"44","stop":"47"}}],
 [{"paneid":"p3-1",
   "xlation":["Cậu đùa gì vậy...","Nhìn này, chân của ta...","Ông đừng đóng kịch nữa."],
   "words":[[["Stop","dừng"],["joking...","đùa giỡn"]],[["Look","Nhìn"],["at","ở"],["my","của tôi"],["leg,","chân"],["it's","Nó"],["still...","vẫn"]],[["You","Bạn"],["should","nên"],["give up","từ bỏ"],["the","mạo từ"],["acting,","diễn xuất"],["sir,","ngài"],["it's","Nó thì"],["wretched...","tội nghiệp"]]],
   "time":{"start":"47","stop":"56"}},
  {"paneid":"p3-2",
   "xlation":["Tất cả đã bại lộ rồi!","Ông chủ, chân ông."],
   "words":[[["And","Và"],["your","của bạn"],["secret","bí mật"],["is","to be"],["exposed!","tiết lộ"]],[["Sir,","Ngài"],["your","của bạn"],["leg...","chân"]]],
   "time":{"start":"56","stop":"61"}}],
 [{"paneid":"p4-1",
   "xlation":["Chân ông đã khỏi từ 3 tháng trước!","Phải vậy không, thanh tra Megure?","Từ bỏ!","Hãy thú nhận đi, bác sĩ của ông đã khai ra hết rồi..."],
   "words":[[["Your","Của bạn"],["leg","chân"],["was","to be"],["already","rồi"],["healed","lành"],["3 months","3 tháng"],["ago!","cách đây"]],[["Isn't","không"],["that","mạo từ"],["right","đúng"],["Inspector","thanh tra"],["Megure?","Tên"]],[["Give it up!","Từ bỏ"]],[["Your","Của bạn"],["doctors","những bác sỹ"],["told","đã nói"],["us","chúng tôi"],["everything...","tất cả mọi thứ"]]],
   "time":{"start":"62","stop":"73"}},
  {"paneid":"p4-2",
   "xlation":["Khốn kiếp!","Này, đứng lại.","Định chạy hả?"],
   "words":[[["Shit!","Khốn kiếp!"]],[["Hey,","Này"],["wait...","đợi"]],[["You're","Bạn"],["not","không"],["going","đi"],["anywhere...","đau"]]],
   "time":{"start":"73","stop":"78"}}]];

function selector_to_gloss_struct(selecta) {
  // an artifact from audio pane days: e.g. "#conan-pane-p1-1"
  var matches = selecta.match(/#([^-]*)-pane-p([0-9]+)-([0-9]+)/);
  if (matches == null) { console.log('Unexpected pane selecta'); return; }
  var comic = matches[1];
  var pagenum = parseInt(matches[2]) - 1;
  var panenum = parseInt(matches[3]) - 1;
  return MeoU.glosses[MeoU.comic][pagenum][panenum];
}
function load_pane_gloss_by_id(selecta, start, stop) {
  // TODO firebase check
  MeoU.userprofile.counts.increment('panes_glossed');
  $('.gloss-content-wrapper').html(load_pane_gloss(selector_to_gloss_struct(selecta), start, stop));
  //var a_ = '<a href="#" onclick="MeoU.keys_enabled = false;show_dialog(\'.pron-info.tutor-info.modal-backdrop\');">';
  // $('.gloss-overlay-bottom').html(a_ + 'Improve your pronunciation fast with MeoU Pronunciation Coaching. Private online sessions with a native English speaker. FREE trial and assessment. &lt;Click for info&gt;</a>');
  var a_video = '1. <a href="https://www.youtube.com/watch?v=we5H6eZKkXU" onclick="sendGaEvent(\'Watch Nouns1\'); window.open(\'https://www.youtube.com/watch?v=we5H6eZKkXU\', \'_blank\');">Mất gốc tiếng Anh thì phải làm thế nào? Học từ vựng: Xem 100 danh từ Tiếng Anh đầu tiên bạn cần biết. Nhớ những từ này sẽ giúp bạn đọc hiểu nhanh hơn rất nhiều !</a><br>';
  var a_hotwords = '2. <a href="http://hotwords.meouenglish.com" onclick="sendGaEvent(\'Ad HotWords\'); window.open(\'http://hotwords.meouenglish.com\', \'_blank\');">Advanced English: Learn 1000s of English words by reading w/ new <strong>MeoU HotWords</strong> app.</a>';
  $('.gloss-overlay-bottom').html(a_video + a_hotwords);
//  $('.gloss-overlay-bottom').html(a_ + 'Bạn cần một gia sư giỏi? Click để biết thêm thông tin</a>');



}
function click_gloss_nghe_paneid(paneid) {
  sendGaEvent('Dictation nghe');
  MeoU.player.play_normal(start, stop);
}
function click_gloss_nghe(start, stop) {
  sendGaEvent('Gloss nghe');
  MeoU.player.play_normal(start, stop);
}
function click_gloss_nghe_cham(start, stop) {
  sendGaEvent('Gloss nghe cham');
  MeoU.player.play_slow(start, stop);
}

// Pass in a piece of the gloss of this pane
// pane: list of xlation/words objects
function load_pane_gloss(pane, start, stop) {
  var linenum = 1;
  var thehtml = '';
  sendGaEvent('Pane gloss / ' + MeoU.comic + ' (' + pane.paneid + ')');
  var nghebutton = '<button type="button" class="play-normal btn btn-default btn-raised btn-warning" onclick="click_gloss_nghe(' + start + ', ' + stop + ')"><i class="material-icons">volume_down<' + '/i> Nghe<' + '/button>';
  var nghechambutton = '<button type="button" class="play-slow btn btn-default btn-raised btn-warning" onclick="click_gloss_nghe_cham(' + start + ', ' + stop + ')"><i class="material-icons">volume_down<' + '/i> Nghe chậm<' + '/button>';
  if (MeoU.comic == MeoU.DORAPLUS1CH14) {
    nghebutton = nghechambutton = '';
  }
  var nextpanebutton = '<button id="btn-next-pane" type="button" class="btn btn-default btn-raised btn-success" onclick="next_pane()"><span class="keyboardkey">n<' + '/span><span class="khung-key-title">Khung tiếp theo <' + '/span><i class="material-icons">trending_down<' + '/i><' + '/button>';

  for (var sentenceidx = 0; sentenceidx < pane.xlation.length; sentenceidx++) {
    thehtml += '<div class="gloss-line ' + (linenum == 1 ? 'line-first' : '') + '" id="gline' + linenum + '">';
    for (var j = 0; j < pane.words[sentenceidx].length; j++) {
      var word = pane.words[sentenceidx][j];
      var eword = word[0];
      var vword = word[1];
      if (typeof eword != 'string') {
        debugger;
      }
      vword = (vword == '' ? '&nbsp;' : vword);
      thehtml += divy('class="gloss-word-wrapper' + (j == 0 ? ' word-first"' : '"'),
       divy('class="gloss-word original"', eword) +
       divy('class="gloss-word ipa"', linky('onclick="MeoU.speaker.speak($(this).parents(\'.gloss-word.ipa\').siblings(\'.gloss-word.original\').text())" href="javascript:void(0)"', eword.split(' ').map(word2ipa).join(' '))) +
       divy('class="gloss-word translation"', vword)
       );
    }
    thehtml += divy('class="gloss-translation-sentence"', '"' + pane.xlation[sentenceidx] + '"');
    if (sentenceidx == pane.xlation.length - 1) {
      thehtml += '<div class="gloss-buttons">' + nghebutton + nghechambutton + nextpanebutton + '<' + '/div>';
    }
    thehtml += '<' + '/div>';
    linenum += 1;
  }
  thehtml += '<' + '/div>';
  return thehtml;
}

/* XXX Interstitial survey, not the quiz - TODO rename survey */
MeoU.quiz = {}
// q is question, a is answers, a_idx is correct answer index
MeoU.quiz.questions = [{'q': 'Khi đọc Mèo Ú, bạn hiểu:', 'a_idx': null, 'a': ['Dưới 25%', 'Khoảng 50%', 'Nhiều hơn 90%', 'Không biết']}, {'q': 'What yo number?', 'a_idx': 1, 'a': ['No have', 'Dunno', '911']}];
MeoU.quiz.choose_answer = function (q_idx, a_idx) {
  if (MeoU.quiz.questions[q_idx].a_idx === null) {
    // Special case for quick survey question
   if (1) {
    sendGaEvent('[Quiz] ' + MeoU.quiz.questions[q_idx].q + ' ' + MeoU.quiz.questions[q_idx].a[a_idx]);
    createCookie('competency_score', [25, 50, 90, 0][a_idx]);
    setTimeout(function() { $('.quiz-overlay').toggle('fade'); }, 400);
   }
  }
};
MeoU.popquiz = {}
MeoU.popquiz.question_queue = [];
MeoU.popquiz.current_question = null;
MeoU.popquiz.questions = {};
MeoU.popquiz.questions[MeoU.CONANCH1_1] = [[{"type":"translation","question":"VICTIM - \"Before everyone heard the victim's scream and came running\"","choices":["nạn nhân","luật sư","kẻ cắp","cảnh sát"]},{"type":"translation","question":"CULPRIT - \"The culprit jumped from one window to the other\"","choices":["thủ phạm","nạn nhân","thám tử","luật sư"]},{"type":"cloze","question":"There ______ no footprints outside the windows","choices":["are","is","has","was"]},{"type":"cloze","question":"Before everyone heard the victim's scream and ______ running","choices":["came","come","coming","had come"]},{"type":"mistake","question":"That is [ridiculously]","choices":[]},{"type":"mistake","question":"It's not even 2 [meter] to climb up the wall to the roof","choices":[]},{"type":"choice","question":"It would not have _______ to me","choices":["occurred","occurring","occur","to occur"]},{"type":"choice","question":"Choose the word which is not like the others:","choices":["meter","climb","run","jump"]},{"type":"antonym","question":"UNSUSPECTED - \"Who could walk through the house unsuspected?\"","choices":["suspected","curious","found","recognize"]},{"type":"synonym","question":"UNIQUE - \"This house's unique structure\"","choices":["special","same","similar","common"]}],[{"type":"translation","question":"HOST - \"You are the host of this house\"","choices":["chủ nhà","khách","người hầu ","quản gia"]}],[{"type":"synonym","question":"WRETCHED - \"You should give up the acting, it's wretched\"","choices":["awful","pleasant","good","happy"]},{"type":"translation","question":"EXPOSED - \"And your secret is exposed\"","choices":["vạch trần","che dấu","ẩn nấp","bí mật"]},{"type":"cloze","question":"You should give ____ the acting","choices":["up","on","in","of"]},{"type":"choice","question":"Stop ____","choices":["joking","joke","to joke","joked"]},{"type":"mistake","question":"And your [secrets] is exposed","choices":[]},{"type":"translation","question":"HEALED - \"Your legs was already healed 3 months ago\"","choices":["lành","đau","gãy","sưng"]},{"type":"synonym","question":"HEALED - \"Your legs was already healed 3 months ago\"","choices":["recover","hurt","broke","pain"]},{"type":"translation","question":"INSPECTOR - \"Inspector Megure is inspecting the scene of the crime\"","choices":["thám tử","nạn nhân","nhân viên","cảnh sát"]},{"type":"mistake","question":"You are not [go] anywhere","choices":[]},{"type":"choice","question":"Choose the different word","choices":["give up","doctor","inspector","police"]}],[{"type":"translation","question":"TOUGH - \"If you have any tough case\"","choices":["khó","dễ","trung bình","nguy hiểm"]},{"type":"synonym","question":"TOUGH - \"If you have any tough case\"","choices":["difficult","strange","easy","dangerous"]},{"type":"antonym","question":"BORROW - \"We have (or had) to borrow your help again.\"","choices":["lend","hide","receive","give"]},
  {"type":"cloze","question":"You always _______ through","choices":["come","have","going","take"]},{"type":"mistake","question":"If you have any tough case to [cracking] then call Detective Conan","choices":[]}],[{"type":"translation","question":"DETECTIVE - \"High school student detective solves another case\"","choices":["thám tử","cảnh sát","nhà báo","sát thủ"]},{"type":"translation","question":"SAVIOUR - \"The saviour of the Japanese Police Department\"","choices":["vị cứu tinh","người tốt","anh hùng","người nổi tiếng"]},{"type":"choice","question":"\"Saviour\" is a ____","choices":["good person","bad person","victim","criminal"]},{"type":"cloze","question":"We can _____ call him","choices":["surely","sure","mostly","almost"]},{"type":"translation","question":"DEPARTMENT - \"The saviour of the Japanese Police Department\"","choices":["cục, bộ","khoa","ngành","phòng"]}],[{"type":"translation","question":"FAULT - \"It's your fault\"","choices":["lỗi","cảm ơn","niềm vui","công sức"]},{"type":"synonym","question":"FAULT - \"It's your fault\"","choices":["responsibility","happy","habit","routine"]},{"type":"cloze","question":"My father can't get _____work","choices":["any","every","several","mostly"]},{"type":"mistake","question":"What are you [madden] about","choices":[]},{"type":"cloze","question":"Look at you, ______ like such a dork","choices":["acting","act","to act","acted"]},{"type":"translation","question":"CAPTAIN - \"That's the captain of Karate team\"","choices":["đội trưởng","huấn luyện viên","học viên","quản lý"]},{"type":"synonym","question":"CAPTAIN - \"That's the captain of Karate team\"","choices":["leader","follower","coach","assistant"]},{"type":"mistake","question":"It's not my fault that he's not [get] any work!","choices":[]},{"type":"synonym","question":"MAD - \"I'm not mad about anything\"","choices":["angry","happy","lovely","sad"]},{"type":"cloze","question":"He's not good at his job. He sucks _____ it.","choices":["at","under","in","into"]}],[{"type":"synonym","question":"DEVELOP - \"He played soccer to develop physical reflexes.\"","choices":["improve","power","expose","heal"]},{"type":"synonym","question":"NECESSARY - \"Those reflexes are necessary for a detective to have.\"","choices":["needed","possible","responsible","difficult"]},{"type":"synonym","question":"NATIONAL - \"You could be a national soccer hero.\"","choices":["country-level","local","foreign","popular"]},{"type":"cloze","question":"And on top of that, he was good _____ to be a professional violinist.","choices":["enough","at","having","during"]},{"type":"mistake","question":"Everyone knows who he [are]","choices":[]}],[{"type":"cloze","question":"If you don't wash your hands you may catch a _____","choices":["disease","football","break","greeting"]},{"type":"cloze","question":"Stop staring ____ me.","choices":["at","to","on","for"]},
  {"type":"cloze","question":"There are many girls but you should narrow it ____ to just one.","choices":["down","less","single","up"]},{"type":"cloze","question":"If you aren't a careful detective you can end ____ in trouble.","choices":["up","to","on","down"]}],[{"type":"cloze","question":"Did you ____ about your promise for tomorrow?","choices":["forget","remember","listen","do"]}]];
MeoU.popquiz.questions[MeoU.DORAPLUS1] = [[{"type":"synonym","question":"UNTIDY - \"Your room is untidy again\"","choices":["Messy","Spoiled","Broken","Clean"]},{"type":"translation","question":"UNTIDY - \"Your room is untidy again\"","choices":["Bừa bộn","Hư hỏng","Gãy","Sạch sẽ"]},{"type":"cloze","question":"\"I'd like to vacuum this room so ____ move aside\"","choices":["please","must","you","my"]},{"type":"synonym","question":"STARVATION - \"They might die of starvation\"","choices":["Lack of food","Disease","Lack of water","Infection"]},{"type":"choice","question":"Choose the word which is not like the others:","choices":["Room","Launder","Cook","Vacuum"]},{"type":"dictation","question":"p1-2:[I'd like] to [vacuum] this [room so] please [move aside]","choices":[]}],
  [{"type":"translation","question":"SUDDENLY - \"My mom suddenly became ill\"","choices":["đột nhiên","bây giờ","tình cờ","vô tình"]},{"type":"synonym","question":"CASE - \"In that case, you better hurry and take care of her\"","choices":["Situation","Time","Manner","Difficult"]},{"type":"cloze","question":"\"In that case, you ____ hurry and take care of her\"","choices":["better","have","be","able to"]},{"type":"cloze","question":"\"It ___ be fun\"","choices":["will","are","have","do"]},{"type":"cloze","question":"\"Nope, but now we don't have any other choice, ____ we?\"","choices":["do","are","haven't","could"]},{"type":"translation","question":"WORRY - \"Don't worry about it.\"","choices":["lo lắng","suy nghĩ","bàn tán","nhắc lại"]},{"type":"choice","question":"Choose the phrase with correct grammar:","choices":["We are worried","We be worried","We to worry","We worrying"]},{"type":"translation","question":"ENOUGH - \"I didn't use enough water\"","choices":["đủ","số lượng","nhiều","ít"]},{"type":"dictation","question":"p2-3:In [that case], [you better hurry] and [take care of her].","choices":[]}],
  [{"type":"translation","question":"CLOSED - \"You're closed today?\"","choices":["đóng cửa","mở cửa","gần","gần gũi"]},{"type":"translation","question":"DELIVERY - \"Let's call a delivery service\"","choices":["giao hàng","người giao hàng","dịch vụ","phân phát"]},{"type":"mistake","question":"Now, [that] do you want to eat?","choices":[]},{"type":"mistake","question":"Now, what do [him] want to eat?","choices":[]},{"type":"mistake","question":"Now, what do you want [eating?]","choices":[]},{"type":"dictation","question":"p3-3:What [will we do now]? [I'm so hungry I'm going] to [die].","choices":[]}],
  [{"type":"choice","question":"Choose an example of dessert:","choices":["Pudding","Pizza","Pork","Peanuts"]},{"type":"translation","question":"DESSERT - \"There are some desserts too. Fruit punch, pudding...\"","choices":["tráng miệng","sa mạc","bánh ngọt","Nước trái cây"]},{"type":"dictation","question":"p4-3:It's [delicious]. [This is the first time] I've [eaten something as delicious as this].","choices":[]}],
  [{"type":"translation","question":"AFFORD - \"I doubt you could even afford it\"","choices":["có đủ tiền","thiếu","cho phép","mua"]},{"type":"translation","question":"TREAT - \"Let's treat everyone\"","choices":["đãi","trị bệnh","chơi xấu","lừa gạt"]},{"type":"translation","question":"SNACK - \"What do you want for a snack?\"","choices":["bữa ăn nhẹ","ăn sáng","ăn trưa ","ăn tối"]},{"type":"choice","question":"An example of a snack:","choices":["Crackers","Coca-Cola","Breakfast","Fork"]},{"type":"dictation","question":"p5-3:I [still want to use] this. You [can't use it unless] you [really want to] eat [something].","choices":[]}],
  [{"type":"translation","question":"PROMISE - Don't just make fake promises","choices":["hứa","thảo luận ","công việc","bữa ăn"]},{"type":"translation","question":"ENOUGH - I don't have enough money","choices":["đủ","số lượng","nhiều","quá ít"]},{"type":"translation","question":"MAGIC - Now show us your magic","choices":["ma thuật","năng lượng","kỹ năng","lý lẽ"]},{"type":"mistake","question":"May I [listen] your order, please?","choices":[]},{"type":"mistake","question":"[Do] I take your order, please?","choices":[]},{"type":"mistake","question":"May I have your order, [you?]","choices":[]},{"type":"dictation","question":"p6-1:[But how]? [Isn't it expensive]? I [don't have enough money]. [Don't just make fake promises, that] would [just be mean].","choices":[]}],
  [{"type":"translation","question":"ADMIT - \"I don't want to admit it, but I can't stop eating!\"","choices":["thừ nhận","trả lời","tiếp tục","hồi đáp"]},{"type":"translation","question":"WORRIED - \"I'm worried about my family\"","choices":["lo lắng","suy nghĩ","nói về","yêu mến"]},{"type":"cloze","question":"\"I'm ____ that it's not serious\"","choices":["glad","good","know","have"]},{"type":"cloze","question":"\"_________ me for giving you such a fright\"","choices":["Forgive","Thank","Let","Sorry"]},{"type":"mistake","question":"Please [spending] the night here.","choices":[]},{"type":"mistake","question":"Let's [preparing] some dinner","choices":[]},{"type":"synonym","question":"IMPORTANT - \"What's important is the flavor.\"","choices":["vital","need","want","admit"]},{"type":"dictation","question":"p7-1:It [looks delicious]. [What's important is the flavor]. Eat [it then].","choices":[]}],
  [{"type":"translation","question":"FINALLY - \"Finally, I am home.\"","choices":["cuối cùng","đầu tiên","thứ hai","đột nhiên"]},{"type":"synonym","question":"UPSET - \"Why is she so upset?\"","choices":["unhappy","glad","cry","hungry"]},{"type":"cloze","question":"\"What ________ we all done wrong?\"","choices":["have","was","were","did"]},{"type":"choice","question":"Choose the right form of word: Everybody is waiting for me ______ some food","choices":["to prepare","preparing","prepared","prepare"]},{"type":"mistake","question":"I should have [staying] with my friend","choices":[]},{"type":"antonym","question":"FULL - \"We are all so full we can't even move\"","choices":["hungry","angry","happy","lucky"]}]];
MeoU.popquiz.questions[MeoU.DORAPLUS1CH2] = [[{"type":"translation","question":"CARRY - \"You're supposed to carry tofu on top of your head.\"","choices":["mang","dắt","để","đẩy"]},{"type":"translation","question":"TOFU - \"My mom told me to buy tofu for dinner.\"","choices":["đậu phụ","kim chi","nước tương","nước mắm"]},{"type":"cloze","question":"\"My mom told me to be careful ______ carrying it home.\"","choices":["while","to","doing","having"]},{"type":"synonym","question":"CAREFUL - \"Be careful on the way home.\"","choices":["cẩn thận","được cho là","vụng về","chậm chạp"]},{"type":"cloze","question":"\"I bought _____ tofu.\"","choices":["some","a","ten","are"]},{"type":"dictation","question":"p1-3:[Didn't you know] that [you were] supposed [to carry tofu] on [top of your head] ?","choices":[]}],
  [{"type":"cloze","question":"\"What ____ you doing?\"","choices":["are","is","do","have"]},{"type":"translation","question":"TICKLE","choices":["cù","nhảy","đánh","gãi"]}],
  [{"type":"translation","question":"STOP - \"Stop it!\"","choices":["dừng","tiếp tục","nhanh nhẹn","chậm chạp"]},{"type":"translation","question":"FAULT - \"It's your fault, not mine.\"","choices":["lỗi","công ơn","sự giúp đỡ","vấn đề"]},{"type":"translation","question":"YELL - \"Oh no! Now my mother will yell at me!\"","choices":["la mắng","thưởng ","cảm ơn","lắng nghe"]},{"type":"cloze","question":"\"Don't move _____ or you'll drop your tofu!\"","choices":["around","out","jump","careful"]},{"type":"translation","question":"MEAN - \"What they did is so mean!\"","choices":["ích kỉ","rộng lượng","đúng đắn","đáng yêu"]},{"type":"dictation","question":"p3-4:[Stop crying]! [Don't you] want [to get back at them]? But how? [There are] two of them.","choices":[]}],
  [{"type":"choice","question":"What happened to the tofu? It...","choices":["dropped","moved","stop","crying"]},{"type":"translation","question":"REACH - \"It can reach up to 5 meters.\"","choices":["vươn tới","ngắn","chạy","kéo dài"]},{"type":"translation","question":"PRACTICE - \"I should practice before I use it.\"","choices":["thực hành","sử dụng","tập luyện","kéo dài"]},{"type":"dictation","question":"p4-2:[It can reach up to] 5 meters. [Got it].","choices":[]}],
  [{"type":"mistake","question":"Are you done [laugh] yet?","choices":[]},{"type":"cloze","question":"You ____ laughing at my face, weren't you?","choices":["were","was","is","to"]},{"type":"cloze","question":"I won't let you ____ away with it","choices":["get","run","go","bring"]},{"type":"translation","question":"MANNER - Suneo  always has good manners.","choices":["cách cư xử","lối sống","phong cách","đạo đức"]},{"type":"dictation","question":"p5-2:[You were laughing at] my [face], weren't you? [That's not true]...","choices":[]}],
  [{"type":"cloze","question":"I'm not finished_____","choices":["yet","already","soon","recently"]},{"type":"choice","question":"What did Suneo do?","choices":["laugh","cry","angry","sad"]},{"type":"translation","question":"SUCCESS - \" It was a huge success\"","choices":["thành công","thất bại","khả năng","công trình"]},{"type":"antonym","question":"CAREFUL - I told you to be careful, didn't I?","choices":["careless","carefully","watch out","observe"]},{"type":"translation","question":"NAUGHTY - You really are a naughty boy","choices":["nghịch ngợm","đáng yêu","ngoan ngoan","dễ mến"]},{"type":"cloze","question":"I'm not afraid to be scolded anymore","choices":["la mắng","thưởng","đánh","tức giận"]}]];
MeoU.popquiz.questions[MeoU.DORAPLUS1CH3] = [[{"type":"translation","question":"DREAM - \"It's my dream to eat 10 cups of noodles.\"","choices":[]},{"type":"cloze","question":"\"I dream about eating _____ of this.\"","choices":["all","many","one","almost"]},{"type":"cloze","question":"\"I ____ to force myself to eat.\"","choices":["need","must","haven't","depend"]},{"type":"synonym","question":"NEED - \"I need to force myself to eat.\"","choices":["must","can","will","did"]},{"type":"synonym","question":"COOL - \"Look at that cool sports car!\"","choices":["amazing","expensive","fast","cold"]},{"type":"mistake","question":"I just need to eat 6 [another] cups.","choices":[]},{"type":"dictation","question":"p1-4:[It's been my dream] to eat [all of this]. [I need to force myself to eat] 6 [more cups].","choices":[]}],
  [{"type":"cloze","question":"\"I should have bought a model instead. I want my money ____ !\"","choices":["back","more","pay","return"]},{"type":"dictation","question":"p2-2:[I should] have [bought a plastic model instead]. [But I hesitated]. [I want my money] back!","choices":[]},{"type":"dictation","question":"p2-5:And [you were thinking] to buy 10 [cups of] noodles [with it]? [What a fool]!","choices":[]},{"type":"dictation","question":"p2-8:[I just had an idea]. No [matter how much] I've [failed] I [can still fix] it.","choices":[]}],
  [{"type":"dictation","question":"p3-2:You [can't change something] that's [happened in the past]!","choices":[]},{"type":"dictation","question":"p3-4:[Even if you only return to change] yourself, [it will still affect people around] you!","choices":[]},{"type":"dictation","question":"p3-6:You [make it sound like] it's [a big deal]. [What's the connection between] noodles [and history], anyway?","choices":[]},{"type":"cloze","question":"If you travel back in time you will ____ the whole past!","choices":["influence","deal","history","happened"]}],
  [{"type":"choice","question":"Which one is different from the others?","choices":["coin","yen","dollar","VND"]},{"type":"choice","question":"Which one is different from the others?","choices":["better","stupid","fool","childish"]},{"type":"dictation","question":"p4-2:[My savings is now] 1300 yen. [I can't believe i have so much money].","choices":[]},{"type":"dictation","question":"p4-6:A [plastic model is so childish]. So I'll [buy noodle cups instead]! [He's so stupid]!","choices":[]},{"type":"dictation","question":"p4-8:You [can't finish] 10 [noodle cups], how foolish! What, [you are me an hour from now]? [How many more times do you want to say] \"fool\"? [I can't stand] it.","choices":[]}],
  [{"type":"mistake","question":"So you'll buy a plastic model? I will. Just leave it [for] me.","choices":[]},{"type":"cloze","question":"Which word CAN'T fill the blank? \"I'm ____ he understands.\"","choices":["foolish","glad","happy","sure"]},{"type":"dictation","question":"p5-4:[Now that we've changed the past], something [has got to be different].","choices":[]},{"type":"dictation","question":"p5-5:[These cups aren't supposed] to be [here]. I [should have my model by now].","choices":[]}],
  [{"type":"dictation","question":"p6-7:What? [I was going to the store by myself], but [went out with another] me?","choices":[]},{"type":"dictation","question":"p6-3:[Did he go to buy a plastic model]? I [feel uneasy].","choices":[]}],
  [{"type":"dictation","question":"p7-4:[You should want a plastic model] too, right? [Stop all this right now]! It's [too complicated already]! Then cut it out!","choices":[]},{"type":"dictation","question":"p7-6:[Is it a meaningful way to spend] our [money]? Don't [use it to buy something useless]!","choices":[]},{"type":"dictation","question":"p7-8:Please [decide now]! [Which one]?! A [plastic model]?! [Cups of noodles]?!","choices":[]}],
  [{"type":"dictation","question":"p8-1:Hey, hey! [Stop it]! [You can't fight with yourself]!","choices":[]}],
  [{"type":"cloze","question":"\"Please tell us what to do. Just ____ to when you belong.\"","choices":["return","back","decide","know"]}]];
MeoU.popquiz.questions[MeoU.DORAPLUS1CH4] = [[{"type":"cloze","question":"\"What should I ____?\"","choices":["do","done","did","doing"]},{"type":"dictation","question":"p1-1:Give [it back now]! [I haven't] got [to read it yet].","choices":[]}],
[{"type":"cloze","question":"You can give it to ____ now.","choices":["him","he","you","they"]},{"type":"translation","question":"SUBSTITUTE - You may substitute pork for chicken.","choices":["thay thế","số không","cuốn sách","danh bạ"]},{"type":"dictation","question":"p2-2:You [can give it to him now]. Are you [kidding]? They'll [beat me to death].","choices":[]}],
[{"type":"mistake","question":"You can [reading] it now, Giant.","choices":[]},{"type":"dictation","question":"p3-4:These [stickers are fun]! I want [to play with them]. No way!","choices":[]}],
[{"type":"antonym","question":"INTERESTING - This comic is not interesting at all.","choices":["boring","fun","exciting","stupid"]},{"type":"mistake","question":"This comic [are] not interesting at all!","choices":[]}],
[{"type":"mistake","question":"I think [me] mistook me for her.","choices":[]}]];
MeoU.popquiz.questions[MeoU.DORAPLUS1CH5] = [[{"type":"cloze","question":"\"I ____ to take my bag home first.\"","choices":["have","must","would","wanting"]},{"type":"dictation","question":"p1-1:It's a [nice day today]. We're [planning to go to] Green Hill. [Let's] go!","choices":[]},{"type":"dictation","question":"p1-4:You're [always out playing]! From [now on], you'll [stay home and study]!","choices":[]}],
[{"type":"synonym","question":"\"How annoying\"","choices":["very annoying","how much annoying","I'm annoying","more annoying"]},{"type":"dictation","question":"p2-4:Don't [even think] about [leaving this room].","choices":[]},{"type":"synonym","question":"BETTER: I better go then.","choices":["should","good","more than","be able to"]}],
[{"type":"dictation","question":"p3-2:You [ruined my date with] Mii-chan.","choices":[]},{"type":"translation","question":"SPLIT: Split the cloud after it grows from the seed.","choices":["chia làm hai","nhột","đặt, để","xuất hiện"]},{"type":"translation","question":"DATE: You ruined my date with Mii-chan.","choices":["cuộc hẹn","huỷ","du lịch","phòng"]}],
[{"type":"dictation","question":"p4-6:You'd [better stay home and call me if] Mama [calls me]. What?","choices":[]},{"type":"antonym","question":"APPEAR: To come home, duck your head... And it will appear here.","choices":["disappear","disappoint","look","split"]},{"type":"translation","question":"SNEAKY: You're going alone? That's sneaky.","choices":["lén lút","không thể","xuất hiện","phá huỷ"]}],
[{"type":"synonym","question":"RIGHT HERE: I'm right here.","choices":["here","correct","next to","left"]},{"type":"translation","question":"CLOUD: This Cloud is as fast as a jet.","choices":["đám mây","đồ uống","hạt giống","chia làm hai"]},{"type":"synonym","question":"WEIRD: That's weird. I thought he was gone.","choices":["strange","good","expected","new"]}],
[{"type":"dictation","question":"p6-2:We've [been walking for ages]. I'm out [of breath]. We're [almost there].","choices":[]},{"type":"mistake","question":"Even [thought] I'm only a head, I can still play.","choices":[]}],
[{"type":"dictation","question":"p7-3:I'm [thirsty now]. We should [have brought some drinks].","choices":[]},{"type":"translation","question":"BEAUTIFUL: What a beautiful view.","choices":["đẹp","khát nước","gần","kì lạ"]}],
[{"type":"dictation","question":"p8-2:It [feels so good if you take off your] shoes. You're right. The ground's [so soft]. It's [like a carpet].","choices":[]},{"type":"translation","question":"GROUND; The ground is soft.","choices":["mặt đất","mềm","tốt","giày"]}],
[{"type":"dictation","question":"p9-2:It's [getting dark]. We [should go home now].","choices":[]}]];
MeoU.popquiz.handle_click_background = function () {
  if ($('.quiz-correctness').is(':visible') == false) {
    sendGaEvent('Skip question');
  }
  MeoU.popquiz.close_quiz();
}
// For choice q: a_idx is the "true" index (before shuffling), and 0 (first) is always the correct answer
// For mistake q: a_idx is idx of word in split sentence, iscorrect is passed in
MeoU.popquiz.choose_answer = function (qpage, q_idx, a_idx, iscorrect) {
  var q = MeoU.popquiz.questions[MeoU.comic][qpage][q_idx];
  var choice = a_idx;
  sendGaQuizEvent(q.type, q.question, choice, iscorrect);
  if (typeof MeoU.userprofile.quiz_responses[MeoU.comic][qpage] == 'undefined') { debugger; }
  if (q_idx >=  MeoU.userprofile.quiz_responses[MeoU.comic][qpage].length) { debugger; }
  MeoU.userprofile.quiz_responses[MeoU.comic][qpage][q_idx] = (iscorrect ? 'C' : 'I') + a_idx;
  MeoU.userprofile.popquiz_points.increment(iscorrect ? 'correct' : 'incorrect');
  MeoU.popquiz.pickle_quiz_responses(MeoU.comic);
  MeoU.popquiz.show_evaluation(iscorrect);
  if (!iscorrect) {
    MeoU.popquiz.unpop_question();
  }
  MeoU.popquiz.current_question = null;
}
MeoU.popquiz.refresh_navbar_badge = function () {
  if ($('#quiz-count a > span.badge').html() == MeoU.popquiz.question_queue.length) { return; }
  $('#quiz-count').show();
  $('#quiz-count a > span.badge').html(MeoU.popquiz.question_queue.length);
  $('#quiz-count a > span.badge').css('backgroundColor', '#fff');
  $('#quiz-count a > span.badge').animate({backgroundColor: '#f13737'}, 1000);
}
// TODO make one similar for .tutor-info
MeoU.popquiz.close_quiz = function () {
  MeoU.keys_enabled = true;
  if (MeoU.popquiz.current_question) {
    MeoU.popquiz.unpop_question();
  }
  close_modal_overlay_noGA('.quiz-overlay');
}
MeoU.popquiz.open_quiz = function () {
  MeoU.popquiz.refresh_navbar_badge();
  MeoU.keys_enabled = false;
  show_modal_overlay_noGA('.quiz-overlay');
}
// Pop up Correct! or Wrong :( and score
MeoU.popquiz.show_evaluation = function (iscorrect) {
  var correct_variations = ['Correct!', 'Good job!', "You're right!", 'Yes!', 'Good!', 'Right on!'];
  var incorrect_variations = ['No, not correct.', 'Sorry, incorrect.', 'Wrong :(', 'No, try again.'];
  var correct_class = 'correct';
  var correct_value = correct_variations[getRandomInt(0, correct_variations.length)];
  if (!iscorrect) {
    correct_class = 'incorrect';
    correct_value = incorrect_variations[getRandomInt(0, incorrect_variations.length)];
  }
  var points = MeoU.userprofile.popquiz_points.counts.correct;
  var html = '<div class="quiz-correctness ' + correct_class + '">';
  html += '<div class="quiz-correctness-top">';
  html += ' <div class="close-dialog"><a href="#" onclick="MeoU.popquiz.close_quiz()"><i class="material-icons">clear</i></a></div>';
  //html += '<div class="correctness-value">' + correct_value + '</div><div> <a disabled href="javascript:void(0)" class="btn btn-raised btn-success" onclick="sendGaEvent(\'Wanted next question\')">Next Question</a><a href="javascript:void(0)" onclick="MeoU.popquiz.close_quiz()" class="btn btn-raised btn-success">Close Quiz &amp; Read Manga</a>  </div>   <div>  </div>';
  var next_disabled = (MeoU.popquiz.question_queue.length == 0 ? 'disabled' : '');
  html += '<div class="correctness-value">' + correct_value + '</div><div> <a ' + next_disabled + ' href="javascript:void(0)" class="btn btn-raised btn-success" onclick="sendGaEvent(\'Wanted / got next question\');MeoU.popquiz.load_random_quiz_question(true);">Next Question</a> <a href="javascript:void(0)" onclick="MeoU.popquiz.close_quiz()" class="btn btn-raised btn-success">Close Quiz &amp; Read Manga</a>  </div>   <div>  </div>';
  html += '</div>';
  html += '<div class="score-wrapper"> <span><span class="badge score">' + points + '</span> ' + (points == 1 ? 'point' : 'points') + '</span> </div>';
  html += '</div>'
  $('.quiz-question-wrapper').append(html);
};
MeoU.popquiz.show_dictation_evaluation = function (numcorrect, numincorrect) {
  var points = MeoU.userprofile.popquiz_points.counts.correct;
  var correct_class = (numincorrect == 0 ? 'correct' : 'incorrect');
  var html = '<div class="quiz-correctness dictation-correctness ' + correct_class + '">';
  html += '<div class="quiz-correctness-top">';
  html += ' <div class="close-dialog"><a href="#" onclick="MeoU.popquiz.close_quiz()"><i class="material-icons">clear</i></a></div>';
  var next_disabled = (MeoU.popquiz.question_queue.length == 0 ? 'disabled' : '');
  html += '<div class="correctness-value">' + numcorrect + ' / ' + (numcorrect + numincorrect) + '</div><div> <a ' + next_disabled + ' href="javascript:void(0)" class="btn btn-raised btn-success" onclick="sendGaEvent(\'Wanted / got next question\');MeoU.popquiz.load_random_quiz_question(true);">Next Question</a> <a href="javascript:void(0)" onclick="MeoU.popquiz.close_quiz()" class="btn btn-raised btn-success">Close Quiz &amp; Read Manga</a>  </div>   <div>  </div>';
  html += '</div>';
  html += '<div class="score-wrapper dictation-score-wrapper"> <span><span class="badge score">' + points + '</span> ' + (points == 1 ? 'point' : 'points') + '</span> </div>';
  html += '</div>'
  $('.quiz-question-wrapper').prepend(html);
  $('.quiz-question-wrapper .explain').hide();
};


// "quiz_response_" <comic> = object where keys are page indices, value is space-sep'd q/a values
// e.g. cookie quiz_response_doraplus1 = '{"0": "U U C0 I3 U U"}'
// U: unanswered, C<idx>: correct answer of index <idx>, I<idx>: incorrect answer
MeoU.popquiz.unpickle_quiz_responses = function (comic) {
  if (readCookie('quiz_responses_' + comic)) {
    var _c = JSON.parse(readCookie('quiz_responses_' + comic));
    var responses = {};
    Object.keys(_c).map(function(val, idx) {
      responses[val] = _c[val].split(' ')
        ;// punt on validating s[0] in ('U', 'C', 'I') or int()
        // .map(function(ans) { return ans; });
    });
    MeoU.userprofile.quiz_responses[comic] = responses;
  } else {
    MeoU.userprofile.quiz_responses[comic] = {0: ['U', 'U']}; // page idx starts at 0
  }
}
// Transform MeoU.userprofile.quiz_responses[comic] back into a cookie
// e.g. quiz_response_doraplus1 = '{"1": "U U C0 I3 U U", "2": "U U C0 I3 U U"}'
MeoU.popquiz.pickle_quiz_responses = function (comic) {
  var coo = '';
  var _resp = MeoU.userprofile.quiz_responses[comic];
  var cooked_resp = {};
  Object.keys(_resp).map(function(val, idx) {
    cooked_resp[val] = _resp[val].join(' ');
  });
  createCookie('quiz_responses_' + comic, JSON.stringify(cooked_resp));
}

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
// This side effects MeoU.userprofile.quiz_responses
// Returns nothing.
MeoU.popquiz.normalize_responses = function (qpage) {
  var _qr = MeoU.userprofile.quiz_responses[MeoU.comic];
  if (qpage in _qr) {
    if (!(qpage in MeoU.popquiz.questions[MeoU.comic])) {
      return; // no questions on this page
    }
    var lendiff = MeoU.popquiz.questions[MeoU.comic][qpage].length - _qr[qpage].length;
    if (lendiff > 0) {
      // Initialize past responses to 'U' in case their index doesn't exist (new questions added since)
      _qr[qpage] = _qr[qpage].concat(Array(lendiff).fill('U'));
    }
  } else {
    if (qpage in MeoU.popquiz.questions[MeoU.comic]) {
      _qr[qpage] = Array(MeoU.popquiz.questions[MeoU.comic][qpage].length).fill('U');
    } else {
      _qr[qpage] = ['U'];
    }
  }
}
MeoU.popquiz.enqueue_questions = function () {
  var qpage = MeoU.page;
  if (!(MeoU.comic in MeoU.popquiz.questions) || !(qpage in MeoU.popquiz.questions[MeoU.comic])) {
    return;
  }
  MeoU.popquiz.normalize_responses(qpage);
  var page_responses = MeoU.popquiz.get_normalized_responses(qpage);
  // add questions on qpage filtered on existing in queue or correctly answered in responses
  var _newq = MeoU.popquiz.questions[MeoU.comic][qpage].map(function(q, idx) {
    // check if q already in the queue
    if (MeoU.popquiz.question_queue.findIndex(function(keyq) { return qpage == keyq.page && idx == keyq.q_idx; }) != -1) {
      return false
    }
    if (page_responses[idx][0] == 'C') {
      return false;
    }
    return {page: qpage, q_idx: idx, q: q};
  }).filter(Boolean);

  MeoU.popquiz.question_queue = MeoU.popquiz.question_queue.concat(_newq)
  MeoU.popquiz.refresh_navbar_badge();
}

// at least normalize the length to quiz questions
MeoU.popquiz.get_normalized_responses = function (qpage) {
  var _qr = MeoU.userprofile.quiz_responses[MeoU.comic];
  if (!(qpage in _qr)) {
    MeoU.popquiz.normalize_responses(qpage);
  }
  if (!(qpage in MeoU.popquiz.questions[MeoU.comic])) {
    return [];
  }
  if (MeoU.popquiz.questions[MeoU.comic][qpage].length != _qr[qpage].length) { debugger; }
  return _qr[qpage];
}
MeoU.popquiz.take_quiz = function () {
  sendGaEvent('Take quiz');
  $('.quiz-question-wrapper').removeClass('pre-confirm');
  $('.confirm-take-quiz').hide();
  
}
MeoU.popquiz.pop_question = function () {
  var i = Math.floor(MeoU.popquiz.question_queue.length * Math.random());
  MeoU.popquiz.current_question = MeoU.popquiz.question_queue[i];
  MeoU.popquiz.question_queue.splice(i, 1);
  MeoU.popquiz.refresh_navbar_badge();
}
// Puts current question back onto queue
MeoU.popquiz.unpop_question = function () {
  MeoU.popquiz.question_queue.push(MeoU.popquiz.current_question);
  MeoU.popquiz.current_question = null;
  MeoU.popquiz.refresh_navbar_badge();
}
MeoU.popquiz.handle_click_quiz = function () {
  sendGaEvent('Click quiz @ ' + MeoU.popquiz.question_queue.length);
  if (MeoU.popquiz.load_random_quiz_question()) {
    MeoU.popquiz.open_quiz();
  }
}
// page is global, choose a random question unanswered by this user's cookies
// return true iff a question was loaded
MeoU.popquiz.load_random_quiz_question = function (isconfirmed) {
  // TODO don't call us at all if there are no questions.
  if (MeoU.popquiz.question_queue.length == 0) { return false; }

  MeoU.popquiz.pop_question();
  var q = MeoU.popquiz.current_question;
  var qpage = q.page;
  var q_idx = q.q_idx;

// TODO the rest of this function should be called render_question
  var confirm_html = '<div class="confirm-take-quiz"><a href="javascript:void(0)" onclick="MeoU.popquiz.take_quiz()" class="btn btn-raised btn-success">Take Quiz</a> <a href="javascript:void(0)" class="btn btn-raised btn-warning" onclick="sendGaEvent(\'Cancel quiz\');MeoU.popquiz.close_quiz();">Cancel Quiz</a></div>';
  var q = MeoU.popquiz.questions[MeoU.comic][qpage][q_idx];
  var explain = '';
  var vexplain = '';
  switch (q.type) {
    case 'synonym':
    case 'antonym':
    case 'translation':
    case 'cloze':
    case 'choice':
      var rethtml = '';
      switch (q.type) {
        case 'synonym':
          explain = 'Choose the word which is a synonym (has the most similar meaning)';
          vexplain = 'Chọn từ đồng nghĩa';
          break;
        case 'antonym':
          explain = 'Choose the word which is an antonym (has the opposite meaning)';
          vexplain = 'Chọn từ trái nghĩa';
          break;
        case 'translation':
          explain = 'Choose the Vietnamese word with the same meaning';
          vexplain = 'Nghĩa của từ'
          break;
        case 'cloze':
          explain = 'Choose the word which can go in the blank space';
          vexplain = 'Chọn từ điều vào chỗ trống'
          break;
        case 'choice':
          explain = 'Choose the word';
          vexplain = 'Chọn từ'
          break;
        default:
          break;
      }
      rethtml += '<span class="explain">' + explain + ' <span>[' + vexplain + ']<' + '/span><' + '/span>';
      // Swap correct (and first) answer with a random other choice. Leave others for now.
      var rand_idx = getRandomInt(0, q.choices.length);
      var swapped_choices = q.choices.map(function(val, idx) {
        if (idx == 0) {
          return {true_idx: rand_idx, choice: q.choices[rand_idx]};
        } else if (idx == rand_idx) {
          return {true_idx: 0, choice: q.choices[0]};
        } else {
          return {true_idx: idx, choice: q.choices[idx]};
        }
      });
      rethtml += '<div class="quiz-question">' + q.question + '</' + 'div>';
      rethtml += '<div class="quiz-answers form-group">';
      rethtml += swapped_choices.map(function(v, idx) {
        var choice_class = 'choice-q' + q_idx + '-a' + v.true_idx;
        return '<div class="checkbox"> <label> <input type="checkbox" onclick="MeoU.popquiz.choose_answer(' + qpage + ',' + q_idx + ', ' + v.true_idx + ', ' + (v.true_idx == 0) + ');"><span class="checkbox-material"><span class="check"></' + 'span></' + 'span> <span class="answer ' + choice_class + '">' + v.choice + '</' + 'span> </' + 'label> </' + 'div>';
      }).join('');
      rethtml += '</' + 'div>';
      if (!isconfirmed) {
        rethtml += confirm_html;
        $('.quiz-question-wrapper').addClass('pre-confirm');
      }
      $('.quiz-question-wrapper').html(rethtml);
      break;
    case 'mistake':
      explain = 'Pop quiz! Click on the mistake (wrong grammar)';
      vexplain = 'Chọn lỗi sai (sai ngữ pháp)'
      var rethtml = '<span class="explain">' + explain + ' <span>[' + vexplain + ']<' + '/span><' + '/span>:';
      rethtml += '<div class="quiz-question quiz-mistake">';
      rethtml += q.question.split(' ').map(function(word, idx) {
        // var esc_word = word.replace(/["]/g, "\\\"").replace(/[']/g, "\\'");
        var iscorrect = false;
        if (word.match(/^\[.*\]$/)) {
          // Correct answer is in [brackets]
          word = word.slice(1, -1); // trim brackets
          iscorrect = true;
        }
        return '<a href="#" onclick="MeoU.popquiz.choose_answer(' + [qpage, q_idx, idx, iscorrect].join(',') + ');">' + word + '</a>';
      }).join(' ');
      rethtml += '</div>';
      if (!isconfirmed) {
        rethtml += confirm_html;
        $('.quiz-question-wrapper').addClass('pre-confirm');
      }
      $('.quiz-question-wrapper').html(rethtml);
      break;
    case 'dictation':
      explain = 'Hearing test! Listen to the speech and type in the blanks what you hear';
      vexplain = 'Kiểm tra kỹ năng nghe! Nghe và điền vào chỗ trống';
      var rethtml = '<span class="explain">' + explain + ' <span>[' + vexplain + ']<' + '/span><' + '/span>';
      rethtml += '<div class="quiz-question quiz-dictation">';
      var colon = q.question.indexOf(':');
      if (colon == -1) {
        console.log('malformed dictation question');
        return false;
      }
      // paneid = p<page>-<pane> (1-indexed)
      var paneid = q.question.slice(0, colon);
      var m_paneid = paneid.match(/^p([0-9]*)-([0-9]*)$/);
      var pagenum, panenum;
      if (m_paneid) {
        pagenum = m_paneid[1];
        panenum = m_paneid[2];
      } else {
        debugger;
        return false;
      }
      var pane = MeoU.glosses[MeoU.comic][pagenum-1][panenum-1];
      var panetext = q.question.slice(colon+1);
      var nghebutton = '<button type="button" class="play-normal btn btn-default btn-raised btn-warning" onclick="click_gloss_nghe(' + pane.time.start + ', ' + pane.time.stop + ')"><i class="material-icons">volume_down<' + '/i> Nghe<' + '/button>';

      var fragments = [];
      // catches 2 groups, 1st is [<text>] and 2nd is everything after 1st
      var m = panetext.match(/(\[[^\]]*\])(.*)$/)
      while (m) {
        if (m.index == 0) {
          fragments.push(m[1]);
        } else {
          fragments.push(panetext.slice(0, m.index))
          fragments.push(m[1]);
        }
        panetext = m[2]
        m = panetext.match(/(\[[^\]]*\])(.*)$/)
      }
      if (panetext) {
        fragments.push(panetext);
      }

      // responses will be filled in on check_dictation
      var unresponses = {};
      var boxcnt = 0;
      var dictation_blank = function () { return '<input type="text" class="dictation-input form-control" id="dictation' + boxcnt + '" title="What did you hear?">'; }
      var question_form = fragments.map(function(frag) {
        if (frag.match(/^\[.*\]$/)) {
          boxcnt++;
          unresponses['dictation' + boxcnt] = {original: frag, response: null};
          return dictation_blank();
        } else {
          return '<span>' + frag + '<' + '/>';
        }
      }).join('');


      rethtml += nghebutton;
      rethtml += '<form class="form-inline" role="form"> <div class="form-group">' + question_form + '</div> </form>';
      rethtml += nghebutton;
      rethtml += '<a href="#" id="check-answer" class="btn btn-raised btn-success">Check answer</a>';


      rethtml += '</div>';
      if (!isconfirmed) {
        rethtml += confirm_html;
        $('.quiz-question-wrapper').addClass('pre-confirm');
      }
      $('.quiz-question-wrapper').html(rethtml);
      // XXX chance for race?
      $('#check-answer').click(function() {
        // bind click in order to keep responses in callback scope
        MeoU.popquiz.check_dictation(unresponses);
      });
      break;
    default:
      console.log('unsupported question type ' + q.type);
      return false;
      break
  }
  return true;
}
MeoU.popquiz.dictation_normalize = function (text) {
  return text.replace( /[^a-zA-Z ]/g, '').replace( /\s\s+/g, ' ' ).toLowerCase().replace(/\s\s+/g, ' ').trim();
}
MeoU.popquiz.check_dictation = function (unresponses) {
  var numcorrect = 0, numincorrect = 0;
  $('.quiz-dictation input[type=text]').each(function() {
    var id = $(this).attr('id');

    $('#' + id).attr('disabled', true);
    $('#check-answer').attr('disabled', true);
    if (MeoU.popquiz.dictation_normalize(($(this).val())) != MeoU.popquiz.dictation_normalize(unresponses[id].original)) {
      $('#' + id).addClass('dictation-incorrect');
      MeoU.userprofile.popquiz_points.increment('incorrect');
      numincorrect++;
    } else {
      $('#' + id).addClass('dictation-correct');
      MeoU.userprofile.popquiz_points.increment('correct');
      numcorrect++;
    }
  })

  if (numincorrect > 0) {
    MeoU.popquiz.unpop_question();
  }
  MeoU.popquiz.current_question = null;
  MeoU.popquiz.show_dictation_evaluation(numcorrect, numincorrect);
}
MeoU.popquiz.reset_quiz_responses = function (comic) {
  if (!comic) {
    comic = MeoU.comic;
  }
  MeoU.userprofile.quiz_responses[comic] = {0: ['U']};
  MeoU.popquiz.pickle_quiz_responses(comic);
}

function load_question(q_idx) {
  // pre
//  $('.quiz-question-wrapper').toggle('slide');

  // load while hidden
  var q = MeoU.quiz.questions[q_idx].q;
  var a = MeoU.quiz.questions[q_idx].a;
  var rethtml = '';
  var abcde = ['A', 'B', 'C', 'D', 'E'];
  //rethtml += '<div class="quiz-question">' + (q_idx + 1) + '. ' + q + '</' + 'div>';
  rethtml += '<div class="quiz-question">' + q + '</' + 'div>';
  rethtml += '<div class="quiz-answers form-group">';
  for (var i = 0; i < a.length; i++) {
    //rethtml += '<div class="checkbox"> <label> <input type="checkbox" onclick="load_question(' + (q_idx+1) + ');"><span class="checkbox-material"><span class="check"></' + 'span></' + 'span> ' + abcde[i] + '. ' + a[i] + ' </' + 'label> </' + 'div>';
    rethtml += '<div class="checkbox"> <label> <input type="checkbox" onclick="MeoU.quiz.choose_answer(' + q_idx + ', ' + i +   ');"><span class="checkbox-material"><span class="check"></' + 'span></' + 'span> <span class="answer">' + a[i] + '</' + 'span> </' + 'label> </' + 'div>';
  }
  rethtml += '</' + 'div>';
  
  $('.quiz-question-wrapper').html(rethtml);
  $('.quiz-question-wrapper').removeClass('pre-confirm');

  // display after 1s
//  setTimeout(function() { $('.quiz-question-wrapper').toggle('fade'); }, 1000);
}

function btn_template(iconname, extraclass) {
  return '<button class="' + extraclass + ' btn btn-raised btn-default"><i class="material-icons">' + iconname + '<' + '/i> <' + '/button>';
}

function onReady() {
  $.material.init();
  istracking(); // initializes and value is retained for rest of session
  $(window).resize(MeoU.resize.callback);
  reset_gloss();
  $('#navbar-dynamic-replace').html(MeoU.navbar.make_ul());
  $('#btn-tutor-next').click(function(event) {
    event.preventDefault();
    sendGaEvent('Tutor next');
    $('#tutor-copytext, #tutor-form-p1').slideToggle(200);
    $('#tutor-form-p2').slideToggle(200);
  });
  $('#inputName').change(function(x) { sendGaEvent('Namechange ' + $(this).val()); })
  $('#btn-gui-tutor').click(function(event) {
    event.preventDefault();
    sendGaEvent('Gui tutor');
    var city = $('.form-horizontal input[name=optionsCity]').val();
    var name = $('.form-horizontal #inputName').val();
    var email = $('.form-horizontal #inputEmail').val();
    var phone = ''; //$('.form-horizontal #inputPhone').val();
    var message = $('.form-horizontal #textMessage').val();

    var date = '/D' + (new Date()).toISOString().replace(/[^0-9T]/g, "").replace('T', '_').slice(0,13);
    var key = date + '_' + encodeFirebaseKey(name);
    var val = {name: name, email: email, phone: phone, message: message, city: city};
    firebase.database().ref('tutoring/' + key).set(val);

    $('.saving-tutor').fadeIn(400);
    setTimeout(function () {
      var dontStopPropagation = true;
      close_dialog('.pron-info.tutor-info.modal-backdrop', dontStopPropagation);
      MeoU.keys_enabled = true;
    }, 1500);
  });
  $('#btn-back-button').click(function(event) {
    event.preventDefault();
    $('#tutor-copytext, #tutor-form-p1').slideToggle(200);
    $('#tutor-form-p2').slideToggle(200);
  });
  if (MeoU.enable_firebase) {
    MeoU.firebase.init(); // Must go after navbar.make_ul
  }
  if (isios()) {
    $('.ios-warning').show();
  }

  if (typeof click_comic_choices == 'function') {
    click_comic_choices();
  }

  /* Fill in template html for each audio/pane box */
  // btn_template('play_circle_outline') +
  // '<button><i class="material-icons">restore</i> <span> chậm</span></button></div>'
  // $('.panebox.panetrigger').html('<div class="audio-lower-buttons">' + btn_template('assignment', 'show-gloss-overlay') + btn_template('record_voice_over', 'play-normal') + btn_template('slow_motion_video', 'play-slow') + '<'+'/div>');
  $('.panebox.panetrigger').html('<div class="audio-lower-buttons">' + btn_template('assignment', 'show-gloss-overlay') + btn_template('record_voice_over', 'play-normal') + '<'+'/div>');

  MeoU.init_comic(MeoU.comic);
  $(document).keydown(function(event) {
    if (!MeoU.keys_enabled) { return; }
    var somekeys = {'16': 'Shift',
      '17': 'Ctrl',
      '35': 'End',
      '37': 'Left',
      '38': 'Up',
      '39': 'Right',
      '40': 'Down',
      '50': 'Two',
      '65': 'Letter A',
      '69': 'Letter E',
      '71': 'Letter 71',
      '73': 'Letter 73',
      '86': 'Letter V',
      '87': 'Letter W',
      '175': 'Vol up',
      '174': 'Vol down',
      '229': 'XXX Android 229'};
    if (event.keyCode == 37) { // left
      prev_page();
    } else if (event.keyCode == 39) { // right
      next_page();
    } else if (event.keyCode == 68) { // 'd' for dictation
      /* XXX this is just for testing
      MeoU.popquiz.questions[MeoU.DORAPLUS1][0] = [{type: 'dictation', question:'p1-2:[I\'d like] to [vacuum] this [room so] please [move aside]'}];
      if (MeoU.page == 1) { debugger; MeoU.page = 2; }
      if (MeoU.popquiz.load_random_quiz_question()) {
        MeoU.popquiz.open_quiz()
      }
      */
    } else if (event.keyCode == 69) { // 'e'
      click_english(); // English
    } else if (event.keyCode == 78) { // 'n'
      next_pane();
    } else if (event.keyCode == 86) { // 'v'
      click_viet(); // Vietnamese
    } else if (event.keyCode == 87) { // 'w'
      click_words(); // Words
    } else {
      // Unhandled meaning ignored
      if (event.keyCode in somekeys) {
        sendGaEvent('Unhandled Keydown (' + somekeys[event.keyCode] + ')');
      } else {
        sendGaEvent('Unhandled Keydown (' + event.keyCode + ')');
      }
      return;
    }
    sendGaEvent('Keydown (' + somekeys[event.keyCode] + ')');
  });

  // $('.main').click(bgimage_click_handler);

  // Code nhap-ma
  $('#btn-nhap-ma').click(click_nhap_ma);
  $("#ghi-ma-so").keyup(function(event){
    if (event.keyCode == 13){
        $("#btn-nhap-ma").click();
    }
  });

  update_page_buttons();

  var truth_string = '1';
  var reset_cookie_days = 14;
  $('.tooltip').tooltipster({
      animation: 'grow',
      delay: 100,
      debug: true,
      hideOnCLick: true,
      /*
      functionBefore: function (instance, helper) {
        if (instance.hasClass('tooltip-already-seen')) {
          return false;
        }
        instance.addClass('tooltip-already-seen');
        return true;
      },
      */
      positionTracker: true, /* XXX taxes performance */
      trigger: 'hover',
      touchDevices: false,
      /* interactive: true, */
      /* iconTouch: true, // css span.tooltipster-icon display none */
      speed: 600,
      timer: 1000,
      theme: 'tooltipster-punk'
  });
  if (readCookie('noob_help_viewed') == truth_string) {
    setTimeout(function() { 
      $('.jumbotron.site-news').fadeOut(500);
      $('.jumbotron.quick-info').fadeOut(500);
    }, 3000);
  } else {
    createCookie('noob_help_viewed', truth_string, reset_cookie_days);
    setTimeout(function() { $('.jumbotron.site-news').fadeOut(2500); }, 5000);
    setTimeout(function() { $('.jumbotron.quick-info').fadeOut(2500); }, 10000);
    //$('.tooltip').tooltipster('show');
    setTimeout(function() { $('#btn-layer3').tooltipster('show'); }, 4000);
    setTimeout(function() { $('#btn-page-next').tooltipster('show'); }, 6000);
    setTimeout(function() { $('#btn-next-pane').tooltipster('show'); }, 8000);
    setTimeout(function() { $('.tooltip').tooltipster('disable'); }, 120000);
  }

  MeoU.userprofile.init();
  MeoU.points.init();
  $('#points').click(function() { sendGaEvent('WTF points'); })
  if (readCookie('lastbonussed') === null) {
    createCookie('lastbonussed', Date.now());
  } else {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    if (readCookie('lastbonussed') - Date.now() > oneDay) {
      sendGaEvent('Daily bonus');
      // console.log('daily return bonus!');
      MeoU.points.add(50);
      createCookie('lastbonussed', Date.now());
    }
  }

  var cloz_swipe = function () {
    // http://stackoverflow.com/questions/2264072/detect-a-finger-swipe-through-javascript-on-the-iphone-and-android
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;
    var yDown = null;

    function handleTouchStart(evt) {
      xDown = evt.touches[0].clientX;
      yDown = evt.touches[0].clientY;
    };

    function handleTouchMove(evt) {
      if ( ! xDown || ! yDown ) {
        return;
      }
      if (Object.keys(modal_overlays_showing).filter(function(key, idx) { return modal_overlays_showing[key] == true; }).length > 0) {
        return;
      }

      var xUp = evt.touches[0].clientX;
      var yUp = evt.touches[0].clientY;

      var xDiff = xDown - xUp;
      var yDiff = yDown - yUp;

      if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
          // console.log('left swipe');
          sendGaEvent('Left swipe');
          next_page(); // XXX This also sends 'Next' event
        } else {
          // console.log('right swipe');
          sendGaEvent('Right swipe');
          prev_page(); // XXX This also sends 'Prev' event
        }
      } else {
        // ignore up/down, but keep y-tracking to filter impure up/down swipes
      }
      /* reset values */
      xDown = null;
      yDown = null;
    };
  }();

}

/* borrowings */
// quirksmode implementation
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
