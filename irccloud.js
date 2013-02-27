window.onresize = doLayout;
var isLoading = false;

onload = function() {
  var webview = document.querySelector('webview');
  doLayout();
}

function doLayout() {
  var webview = document.querySelector('webview');
  var windowWidth = document.documentElement.clientWidth;
  var windowHeight = document.documentElement.clientHeight;
  var webviewWidth = windowWidth;
  var webviewHeight = windowHeight;

  webview.style.width = webviewWidth + 'px';
  webview.style.height = webviewHeight + 'px';

  var sadWebview = document.querySelector('#sad-webview');
  sadWebview.style.width = webviewWidth + 'px';
  sadWebview.style.height = webviewHeight + 'px';
}

setTimeout(function() {
  window.MainController.prototype.onDisconnect = function (failCount) {
    this.startingStream = false;
    this.clearStartTimeout();
    debug.debug('Controller', 'onDisconnect (hooked by Userscript)', '(failCount: ' + failCount + ')', '(restart: ' + this.restartStream + ')');

    if (this.isAuthed()) {
      if (navigator.onLine == false) {
        var notification = webkitNotifications.createNotification(
          'img/irccloud-128.png',
          'IRCCloud',
          'Internet link down'
        );
        notification.show();
      }

      this.view.disconnected();
      switch (failCount) {
        case 0:
        case 1:
        case 2:
          if (this.restartStream) {
            var notification = webkitNotifications.createNotification(
              'img/irccloud-128.png',
              'IRCCloud',
              'reconnecting in '+ failCount +' seconds!'
            );
            notification.show();

            this.start(failCount);
          }
          break;
        default:
          if (this.restartStream) {
            var notification = webkitNotifications.createNotification(
              'img/irccloud-128.png',
              'IRCCloud',
              'reconnecting in '+ failCount +' seconds!'
            );
            notification.show();
            this.start(10);
          }
          break;
      }
    }
  };
}, 10000);
