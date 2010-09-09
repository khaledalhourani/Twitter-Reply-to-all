// ==UserScript==
// @name          Twitter Reply to all
// @description   Reply to all without copy and paste
// @author        Khaled Alhourani
// @include       http://twitter.com*
// @include       http://www.twitter.com*
// @include       https://twitter.com*
// @include       https://www.twitter.com*
// @require       http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js
// @version       1.0
// ==/UserScript==


function getTweeps(status, sep) {
  var username = status.find('.status-content a.screen-name').text();
  var my_username = $('#profile #me_name').text();
  var tweeps = '@' + username;

  status.find('.entry-content a.username').each(function() {
    var tweep = $(this).text();
    if (my_username != tweep) {
      tweeps += sep + '@' + $(this).text();
    }
  });

  return tweeps;
}

function replyToAllHtml() {
  $('#timeline.statuses .status').each(function() {
    var status = $(this);
    var status_id = status.attr('id').replace(/status_/,"");
    var username = status.find('.status-content a.screen-name').text();
    var tweeps = getTweeps(status, '+');

    var reply_to_all_html = '<li><span class="reply_to_all"><span class="reply-to-all-icon icon"></span><a title="reply to all" href="/?status=' + tweeps + '&amp;in_reply_to_status_id=' + status_id + '&amp;in_reply_to=' + username + '">Reply to all</a></span></li>';

    status.find('.actions-hover').prepend(reply_to_all_html);
  });
}


$.fn.focusEnd = function() {
  return this.each(function() {
    var A = this;
    if (A.style.display!="none") {
      if ($.browser.msie) {
	A.focus();
	var B = A.createTextRange();
	B.collapse(false);
	B.select()
      } else {
	A.setSelectionRange(A.value.length,A.value.length);
	A.focus();
      }
    }
  }
)};


function init() {
  replyToAllHtml();

  $(".reply_to_all").live("click",function(event) {
    event.preventDefault();
    var E = $(this);
    var C = E.parents(".hentry:first");
    var G = C.attr("id").replace(/status_/,"");
    var B = getTweeps(C, ' ');
    var A = C.attr("class").match(/u-([A-Za-z0-9_]+)/);
    var R = A[1];

    if (!B) {
      alert(_("Whoops! Something went wrong. Please refresh the page and try again!"));return
    }

    if (C.hasClass("status") || C.hasClass("share")) {
      var F = $("#status");

      if (F.size()) {
	F.val(B+" ").trigger("update");
	$("#status").focusEnd();
	$("#in_reply_to_status_id").val(G);
	$("#in_reply_to").val(R);
	window.scroll(0,0);
      } else {
	window.location = E.find("a").attr("href");
	return false;
      }
    }

    window.scroll(0,0);
    return false;
  },this);
}


// Add event listener!
window.addEventListener('load', init, false);