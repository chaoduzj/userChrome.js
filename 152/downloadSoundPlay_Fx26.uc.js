// ==UserScript==
// @name           downloadSoundPlay_Fx26.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    ダウンロードを監視し、状態に応じて音を鳴らす
// @include        main
// @async          true
// @compatibility  Firefox 152+
// @author         Alice0775 / modified for current Firefox
// @version        2026/07/15 replace removed(Bug 2033673) nsISound.play() with HTMLAudioElement
// @version        2023/10/13 use ChromeUtils.import instead of XPCOMUtils.defineLazyModuleGetter
// @version        2016/03/15 hack of selection change
// @version        2015/01/15 1:00 Fixed strictmode
// @version        2013/12/18 11:00 defineLazyModuleGetter for Firefox26
// @version        2013/12/18 Firefox26
// @version        2009/11/28
// ==/UserScript==

var downloadPlaySound = {
  // -- config --
  DL_START: null,
  DL_DONE: "file:///C:/WINDOWS/Media/chimes.wav",
  DL_CANCEL: null,
  DL_FAILED: null,
  // -- config --

  _list: null,
  _playingSounds: new Set(),

  init: function downloadPlaySound_init() {
    const { Downloads } = ChromeUtils.importESModule(
      "resource://gre/modules/Downloads.sys.mjs"
    );

    window.addEventListener("unload", this, false);

    // ダウンロード監視を追加
    if (!this._list) {
      Downloads.getList(Downloads.ALL)
        .then(list => {
          this._list = list;
          return this._list.addView(this);
        })
        .catch(Cu.reportError);
    }
  },

  uninit: function() {
    window.removeEventListener("unload", this, false);

    if (this._list) {
      this._list.removeView(this);
      this._list = null;
    }

    // Firefox終了時に再生中の音声を片付ける
    for (const audio of this._playingSounds) {
      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audio.remove();
      } catch (error) {
        Cu.reportError(error);
      }
    }

    this._playingSounds.clear();
  },

  onDownloadAdded: function(aDownload) {
    // ダウンロード開始
    if (this.DL_START) {
      this.playSoundFile(this.DL_START);
    }
  },

  onDownloadChanged: function(aDownload) {
    // ダウンロードキャンセル
    if (aDownload.canceled && this.DL_CANCEL) {
      this.playSoundFile(this.DL_CANCEL);
    }

    // ダウンロード失敗
    if (aDownload.error && this.DL_FAILED) {
      this.playSoundFile(this.DL_FAILED);
    }

    // ダウンロード完了
    if (
      typeof aDownload.downloadPlaySound == "undefined" &&
      aDownload.succeeded &&
      aDownload.stopped &&
      this.DL_DONE
    ) {
      aDownload.downloadPlaySound = true;
      this.playSoundFile(this.DL_DONE);
    }
  },

  playSoundFile: function(aFileURL) {
    if (!aFileURL) {
      return;
    }

    try {
      const uri = Services.io.newURI(aFileURL);
      const file = uri.QueryInterface(Ci.nsIFileURL).file;

      if (!file.exists() || !file.isFile()) {
        Cu.reportError(
          new Error(
            "downloadPlaySound: 音声ファイルが見つかりません: " + aFileURL
          )
        );
        return;
      }

      this.play(uri.spec);
    } catch (error) {
      Cu.reportError(error);
    }
  },

  play: function(aFileURL) {
    // nsISound.play()は現在のFirefoxから削除されたため、
    // ブラウザーUI上のHTMLAudioElementでWAVファイルを再生する。
    const audio = document.createElementNS(
      "http://www.w3.org/1999/xhtml",
      "audio"
    );

    audio.preload = "auto";
    audio.src = aFileURL;
    audio.volume = 1.0;

    this._playingSounds.add(audio);
    document.documentElement.appendChild(audio);

    const cleanup = () => {
      // ended/error/play()失敗が重複しても、一度だけ片付ける
      if (!this._playingSounds.delete(audio)) {
        return;
      }

      try {
        audio.pause();
        audio.removeAttribute("src");
        audio.load();
        audio.remove();
      } catch (error) {
        Cu.reportError(error);
      }
    };

    audio.addEventListener("ended", cleanup, { once: true });

    audio.addEventListener(
      "error",
      () => {
        Cu.reportError(
          new Error(
            "downloadPlaySound: 音声ファイルを再生できません: " + aFileURL
          )
        );
        cleanup();
      },
      { once: true }
    );

    try {
      const playPromise = audio.play();

      if (playPromise && typeof playPromise.catch == "function") {
        playPromise.catch(error => {
          Cu.reportError(error);
          cleanup();
        });
      }
    } catch (error) {
      Cu.reportError(error);
      cleanup();
    }
  },

  handleEvent: function(event) {
    if (event.type == "unload") {
      this.uninit();
    }
  },
};

downloadPlaySound.init();