/*globals $:false, window:false, document:false */
$(function() {
  'use strict';
  function number(num) {
    if (num > 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num;
  }
  if ($('.buttons').css('display') !== 'none') {
    $('.button').click(
      function (event) {
        event.preventDefault();
        var $this = $(this);
        window.open(
          $this.attr('href'),
          $this.attr('title'),
          'width=640,height=300'
        );
      }
    );
    var url = encodeURIComponent(document.location.href.split('?')[0].split('#')[0]),
      border = '1px solid #ffa094',
      timeout = 2000;
    $.ajax({
      dataType: 'json',
      async: true,
      timeout: timeout,
      url: 'http://free.sharedcount.com/?apikey=d730c518430eabcabc46ab79528c744067afa17e&url=' + url,
      success: function (data) {
        if (data.GooglePlusOne !== 0) {
          $('.count-googleplus').html(number(data.GooglePlusOne)).fadeIn();
        }
      },
      error: function() {
        $('.icon-googleplus').css('border', border);
      }
    });
    // @see http://stackoverflow.com/questions/32172969/how-to-get-twitter-url-count
    // $.getJSON(
    //   'http://urls.api.twitter.com/1/urls/count.json?callback=?&url=' + url,
    //   function(json) {
    //     var count = json.count;
    //     if (count > 0) {
    //       $('.count-twitter').html(number(count)).fadeIn();
    //     }
    //   }
    // );
    // $.getJSON(
    //   'https://api.facebook.com/method/links.getStats?format=json&urls=' + url,
    //   function(json) {
    //     var count = json[0].total_count;
    //     if (count > 0) {
    //       $('.count-facebook').html(number(count)).fadeIn();
    //     }
    //   }
    // );
    $.ajax({
      dataType: 'json',
      async: true,
      timeout: timeout,
      url: 'https://www.linkedin.com/countserv/count/share?format=jsonp&callback=?&url=' + url,
      success: function(json) {
        var count = json.count;
        if (count > 0) {
          $('.count-linkedin').html(number(count)).fadeIn();
        }
      },
      error: function() {
        $('.icon-linkedin').css('border', border);
      }
    });
    $.ajax({
      dataType: 'json',
      async: true,
      timeout: timeout,
      url: 'http://www.reddit.com/api/info.json?jsonp=?&url=' + url,
      success: function(json) {
        var count = json.data.children.length;
        if (count > 0) {
          $('.count-reddit').html(number(count)).fadeIn();
        }
      },
      error: function() {
        $('.icon-reddit').css('border', border);
      }
    });
    // https://jsonp.afeld.me/
    $.ajax({
      dataType: 'jsonp',
      async: true,
      timeout: timeout,
      url: 'http://jsonp.afeld.me/?url=' +
        'http://www.stumbleupon.com/services/1.01/badge.getinfo%3Furl='
        + encodeURI(url),
      jsonp: 'callback',
      jsonpCallback: 'x',
      success: function(json) {
        var count = json.result.views;
        if (count > 0) {
          $('.count-stumbleupon').html(number(count)).fadeIn();
        }
      },
      error: function() {
        $('.icon-stumbleupon').css('border', border);
      }
    });
    $.ajax({
      dataType: 'json',
      async: true,
      timeout: timeout,
      url: 'http://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query="'
        + url.replace('http://www.yegor256.com', '')
        + '"',
      success: function(json) {
        var count = json.nbHits;
        if (count > 0) {
          $('.count-hackernews').html(number(count)).fadeIn();
        }
      },
      error: function() {
        $('.icon-hackernews').css('border', border);
      }
    });
  }
  $('h2').each(
    function (idx, element) {
      var $element = $(element), id = $element.attr('id');
      if (id) {
        $element.attr('name', id).append(
          $('<a/>').addClass('link')
            .attr('href', '#' + id)
            .append('<i class="icon icon-link notranslate"></i>')
        );
      }
    }
  );
  $('.main p a, .main ul a, .main ol a').each(
    function (idx, a) {
      if (a.hostname && a.hostname !== window.location.hostname) {
        $(this).append('<i class="icon icon-exit foreign"></i>');
      }
    }
  );
});
