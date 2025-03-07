// ==UserScript==
// @name          Mouse Gestures command file (with Wheel Gesture and Rocker Gesture)
// @namespace     http://space.geocities.yahoo.co.jp/gl/alice0775
// @description   Commands for Lightweight customizable mouse gestures. Add Reload and Edit commands menu
// @include       main
// @charset       UTF-8
// @author        Alice0775
// @compatibility  Firefox 137
// @version        2025/02/10 18:00 fix bug
// @version        2025/02/04 23:00 Bug 1880913 - Move BrowserSearch out of browser.js
// @version       2024/12/22 fix Bug 1936336 - Disallow inline event handlers
// @version       2024/05/10 Bug 1880914 - Move Browser* helper functions used from global menubar and similar commands to a single object in a separate file, loaded as-needed
// @version       2024/05/05 Bug 1892965 - Rename Sidebar launcher and SidebarUI
// @version       2023/09/07 remove to use nsIScriptableUnicodeConverter
// @version       2021/04/11 12:00 workaround 選択テキストで検索 Bug 360332
// @version       2020/12/19 15:00 fix typo
// @version       2020/11/29 20:00 add コンテナータブを指定してリンクを開く
// @version       2020/08/17 16:00 HighlightAll extension のトグル 方法 (Firefox userChrome.js greasemonkeyスクリプトｽﾚ41 595)
// @version       2020/01/20 00:00 fix 'Home'
// @version       2019/10/22 09:00 fix 71.0 fix web search

// @version       2019/10/22 08:00 fix 70.0 fix web search Bug 1587803 - Check BrowserContentHandler.jsm doSearch uses the right engine
// @version       2019/05/21 08:30 fix 69.0a1 Bug 1551320 - Replace all createElement calls in XUL documents with createXULElement
// @version       2019/01/21 01:00 reloadAllTabs to reloadTabs
// @version       2018/09/30 03:00 add dispatchEvent command( dispatch event to content from chrome)
// @version       2018/09/29 19:00 support zoomIn/Out/Reset for pdf.js
// @version       2018/09/29 01:00 add commands list (commands popop, toggle style)
// @version       2018/09/29 00:00 fix commands list (missing arguments webSearchPopup)
// @version       2018/09/29 00:00 add commands list ("Closed Tabs Popup" and "Session History Popup")
// @version       2018/09/28 23:20 fix, reload commands should be for all browser
// @version       2018/09/28 22:50 fix bug forgot to overwrite
// @version       2018/09/28 22:50 fix bug
// @version       2018/09/28 22:00
// ==/UserScript==
// @note          MouseGestures2_e10s.uc.jsより後で読み込むようにしておく
// @note          このファイルで定義されたコマンドでMouseGestures2_e10s.uc.jsの定義を上書きします
// @note          This overwrites the command in the MouseGestures2_e10s.uc.js file // @note          Linux and Mac are not supported.

ucjsMouseGestures_menues = {
  defCommands: function() {

    // == config ==
    // This overwrites the command in the MouseGestures2_e10s.uc.js file 
    // These are the mouse gesture mappings. Customize this as you like. 

    // Gesture Sequence,  UDRL: right-click then move to up down right left
    // Wheel Gestures,    W+ : right-click then wheel turn down , W- : left-click then wheel turn up
    // Rocker Gestures,   L<R : right-click then left-click , L>R : left-click then right-click
    // Any Gesture Sequence,  *hogehoge :  Gesture Sequence following that any faesture
    // ucjsMouseGestures._lastX, ucjsMouseGestures._lastY  : start coordinates

    // ucjsMouseGestures._linkURLs ,ucjsMouseGestures._linkdocURLs : link url hover, ownerDocument url
    // ucjsMouseGestures._selLinkURLs ,ucjsMouseGestures._selLinkdocURLs: link url in selected, ownerDocument url
    // ucjsMouseGestures._docURL : ownerDocument url
    // ucjsMouseGestures._linkURL ,ucjsMouseGestures._linkTXT : ownerDocument url : link url, ownerDocument url
    // ucjsMouseGestures._imgSRC  _imgTYPE _imgDISP: src mime/type contentdisposition
    // ucjsMouseGestures._mediaSRC : media src
    // ucjsMouseGestures._selectedTXT : selected text
    // ucjsMouseGestures._version : browser major version

    try {
    ucjsMouseGestures.commands =
      [


        ['L', '戻る', function(){ document.getElementById("Browser:Back").doCommand(); } ],
        ['R', '進む', function(){ document.getElementById("Browser:Forward").doCommand(); } ],
        ['', 'Home', function(){ BrowserCommands.home(); } ],

        ['', 'タブの履歴をポップアップ', function(){ ucjsMouseGestures_helper.sessionHistoryPopup(); } ],

        ['RULD', 'ひとつ上の階層へ移動', function(){ ucjsMouseGestures_helper.goUpperLevel(); } ],
        ['ULDR', '数値を増やして移動', function(){ ucjsMouseGestures_helper.goNumericURL(+1); } ],
        ['DLUR', '数値を減らして移動', function(){ ucjsMouseGestures_helper.goNumericURL(-1); } ],

        ['UD', 'リロード', function(){ document.getElementById("Browser:Reload").doCommand(); } ],
        ['UDU', 'リロード(キャッシュ無視)', function(){ document.getElementById("Browser:ReloadSkipCache").doCommand(); } ],
        ['', 'すべてタブをリロード', function(){ typeof gBrowser.reloadTabs == "function" ? gBrowser.reloadTabs(gBrowser.visibleTabs) : gBrowser.reloadAllTabs(); } ],
        ['', 'コンテナータブを指定してリンクを開く', function(){ ucjsMouseGestures_helper.openLinkInContainerTab(); }],

        ['', 'テキストリンクを新しいタブに開く', function(){ ucjsMouseGestures_helper.openURLsInSelection(); } ],
        ['*RDL', '選択範囲のリンクをすべてタブに開く', function(){ ucjsMouseGestures_helper.openSelectedLinksInTabs(); } ],
        ['*RUL', '通過したリンクをすべてタブに開く', function(){ ucjsMouseGestures_helper.openHoverLinksInTabs(); } ],

        ['', '選択したリンクを保存', function(){ ucjsMouseGestures_helper.saveSelectedLinks(); } ],
        ['', '通過したリンクを保存', function(){ ucjsMouseGestures_helper.saveHoverLinks(); } ],

        ['', 'コピー', function(){ ucjsMouseGestures_helper.copyText(ucjsMouseGestures._selectedTXT); } ],
        ['', '通過したリンクをコピー', function(){ ucjsMouseGestures_helper.copyHoverLinks(); } ],
        ['', '選択したリンクをコピー', function(){ ucjsMouseGestures_helper.copySelectedLinks(); } ],

        ['UL', '前のタブ', function(){ gBrowser.tabContainer.advanceSelectedTab(-1, true); } ],
        ['UR', '次のタブ', function(){ gBrowser.tabContainer.advanceSelectedTab(+1, true); } ],
        ['', '新しいタブを開く', function(){ document.getElementById("cmd_newNavigatorTab").doCommand(); } ],
        ['', 'タブをピン留めトグル',
  			  function(){ var tab = gBrowser.selectedTab;
  			 	   tab.pinned ? gBrowser.unpinTab(tab) : gBrowser.pinTab(tab);
          } ],
        ['', 'タブを複製',
  			  function(){ 
            var orgTab = gBrowser.selectedTab;
  			 	  var newTab = gBrowser.duplicateTab(orgTab);
  				  gBrowser.moveTabTo(newTab, orgTab._tPos + 1);
          } ],
        ['LD', 'タブを閉じる', function(){ document.getElementById("cmd_close").doCommand(); } ],
        ['', '左側のタブをすべて閉じる', function(){ ucjsMouseGestures_helper.closeMultipleTabs("left"); } ],
        ['', '右側のタブをすべて閉じる', function(){ ucjsMouseGestures_helper.closeMultipleTabs("right"); } ],
        ['', '他のタブをすべて閉じる', function(){ gBrowser.removeAllTabsBut(gBrowser.selectedTab); } ],
        ['DRU', '閉じたタブを元に戻す', function(){ document.getElementById("History:UndoCloseTab").doCommand(); } ],
        ['', '閉じたタブのリストをポップアップ', function(){ ucjsMouseGestures_helper.closedTabsPopup(); } ],
        ['', 'タブのミュートをトグル', function(){ gBrowser.selectedTab.toggleMuteAudio(); } ],


        ['', '最小化', function(){ window.minimize(); } ],
        ['', '最大化/元のサイズ', function(){ window.windowState == 1 ? window.restore() : window.maximize(); } ],
        ['LDRU', 'フルスクリーン', function(){ document.getElementById("View:FullScreen").doCommand(); } ],

        ['RU', '上端へスクロール', function(){ goDoCommand("cmd_scrollTop"); } ],
        ['RD', '下端へスクロール', function(){ goDoCommand("cmd_scrollBottom"); } ],
        ['U', '上へスクロール', function(){ goDoCommand("cmd_scrollPageUp"); } ],
        ['D', '下へスクロール', function(){ goDoCommand("cmd_scrollPageDown"); } ],

        ['W-', 'ズームイン', function(){ ucjsMouseGestures_helper.zoomIn(); } ],
        ['W+', 'ズームアウト', function(){ ucjsMouseGestures_helper.zoomOut(); } ],
        ['L<R', 'ズームリセット', function(){ ucjsMouseGestures_helper.zoomReset(); } ],

        ['DL', 'ページ内検索バー',
          function(){
            if (ucjsMouseGestures._version <= "60") {
              if (gBrowser.getFindBar()) {
                gFindBar.hidden? gFindBar.onFindCommand(): gFindBar.close();
              } else {
                gLazyFindCommand("onFindCommand");
              }
            } else {
              // 61+
              gBrowser.getFindBar().then(findbar => {
                findbar.hidden? findbar.onFindCommand(): findbar.close();
              });
            }
          } ],

        ['', '選択テキストで検索',
          function(){
            ucjsMouseGestures_helper._loadSearchWithDefaultEngine(
              ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT,
              false);
          } ],
        ['DRD', '選択テキストで検索(検索エンジンポップアップ)', function(){ ucjsMouseGestures_helper.webSearchPopup(ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT); } ],
        ['DR', '選択テキストを検索バーにコピー',
          function(){ 
            if (document.getElementById("searchbar"))
              document.getElementById("searchbar").value = ucjsMouseGestures._selectedTXT || ucjsMouseGestures._linkTXT;
          } ],

        ['', 'CSS切り替え', function(){ var styleDisabled = gPageStyleMenu._getStyleSheetInfo(gBrowser.selectedBrowser).authorStyleDisabled; if (styleDisabled) gPageStyleMenu.switchStyleSheet(""); else gPageStyleMenu.disableStyle(); } ],

        ['UDUD', 'ジェスチャーコマンドをポップアップ', function(){ ucjsMouseGestures_helper.commandsPopop(); } ],
        ['', '再起動', function(){ ucjsMouseGestures_helper.restart(); } ],

        ['', 'ブックマークサイドバー', function(){ SidebarController.toggle("viewBookmarksSidebar"); } ],
        ['', '履歴サイドバー', function(){ SidebarController.toggle("viewHistorySidebar"); } ],

        ['', 'ブラウザーコンソール', function(){ ucjsMouseGestures_helper.openBrowserConsole(); } ],

        ['', 'weAutopagerizeのトグル',
          function(){
            ucjsMouseGestures_helper.dispatchEvent(
            { target: "document", type: "AutoPagerizeToggleRequest" } );
          } ],

        ['', 'HighlightAll extension のトグル 方法',
          function(){
            let tip = Cc["@mozilla.org/text-input-processor;1"].createInstance(Ci.nsITextInputProcessor);
            if (!tip.beginInputTransactionForTests(window)) {
              return;
            }
            let keyEventF8 = new KeyboardEvent("", {key: "F8", keyCode: KeyboardEvent.DOM_VK_F8});
            let keyEventCtrl = new KeyboardEvent("", {key: "Control", keyCode: KeyboardEvent.DOM_VK_CONTROL});
            tip.keydown(keyEventCtrl);
            tip.keydown(keyEventF8);
            tip.keyup(keyEventF8);
            tip.keyup(keyEventCtrl);
          } ],

     ];

    // == /config ==
    } catch(ex) {
       Services.console.logMessage(ex);
    }
  },

  // == config ==
  editor: "C:\\Program Files\\hidemaru\\hidemaru.exe",
  // editor: "/usr/bin/gedit",
  // == /config ==











  load: function() {
    this.defCommands();
    if (document.getElementById("ucjsMouseGestures_menues"))
      return;
    this.createMenu();
  },

  createMenu: function() {
    let ref = document.getElementById("menu_preferences");
    let menu = document.createXULElement("menu");
    menu.setAttribute("id", "ucjsMouseGestures_menues");
    menu.setAttribute("label", "ucjsMouseGestures");
    ref.parentNode.insertBefore(menu, ref);
    let menupopup = document.createXULElement("menupopup");
    menu.appendChild(menupopup);
    let menuitem = document.createXULElement("menuitem");
    menupopup.appendChild(menuitem);
    menuitem.setAttribute("id", "ucjsMouseGestures_menuepopup");
    menuitem.setAttribute("label", "Reload commands");
    menuitem.addEventListener("command", () => ucjsMouseGestures_menues.reloadCommands());
    //menuitem.setAttribute("oncommand", "ucjsMouseGestures_menues.reloadCommands();");

    menuitem = document.createXULElement("menuitem");
    menupopup.appendChild(menuitem);
    menuitem.setAttribute("id", "ucjsMouseGestures_menues_launchEditor");
    menuitem.setAttribute("label", "Edit commands");
    menuitem.addEventListener("command", () => ucjsMouseGestures_menues.launchEditor());
    //menuitem.setAttribute("oncommand", "ucjsMouseGestures_menues.launchEditor();");
  },

  launchEditor: function() {
    var editor = this.editor;
/*
    var UI = Components.classes['@mozilla.org/intl/scriptableunicodeconverter'].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);

    var platform = window.navigator.platform.toLowerCase();

    if(platform.indexOf('win') > -1){
      UI.charset = 'Shift_JIS';
    }else{
      UI.charset =  'UTF-8';
    }
    var path = Services.io.getProtocolHandler("file").
               QueryInterface(Components.interfaces.nsIFileProtocolHandler).
               getFileFromURLSpec(this.getThisFileUrl()).path
    path = UI.ConvertFromUnicode(path);
*/
    var path = Services.io.newURI(this.getThisFileUrl())
                 .QueryInterface(Ci.nsIFileURL).file.path;
                 
    var appfile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsIFile);
    appfile.initWithPath(editor);
    var process = Components.classes['@mozilla.org/process/util;1'].createInstance(Components.interfaces.nsIProcess);
    process.init(appfile);
    process.runw(false, [path], 1, {});

  },

  getThisFileUrl: function() {
        return Error().fileName.split(' -> ').pop().split('?')[0];
  },

  reloadCommands: function() {
    let url = this.getThisFileUrl();
    let file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
    let fileProtocolHandler = Services.io.getProtocolHandler("file").
                              QueryInterface(Ci.nsIFileProtocolHandler);
    let path = fileProtocolHandler.getFileFromURLSpec(url).path;
    file.initWithPath(path);

    let enumerator = Services.wm.getEnumerator("navigator:browser");
		while (enumerator.hasMoreElements()) { 
      let win = enumerator.getNext();
      Cc["@mozilla.org/moz/jssubscript-loader;1"].getService(Ci.mozIJSSubScriptLoader)
               .loadSubScriptWithOptions(url + "?" + this.getLastModifiedTime(file), {
                              target: win, ignoreCache: false
                      });
    }
  },

  getLastModifiedTime: function(aFile) {
    Components.classes["@mozilla.org/consoleservice;1"]
        .getService(Components.interfaces.nsIConsoleService)
        .logStringMessage(aFile.lastModifiedTime);
    return aFile.lastModifiedTime;
  }



}
if (typeof ucjsMouseGestures != "undefined")
  ucjsMouseGestures_menues.load();
