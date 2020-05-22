$(function () {
  web.ini();
  //barrage.ini();
});

var web = {
  navs: new Object(),

  ini: function () {
    var t = this;
    //
    t.navs = $("nav a");

    t.navClick();
    t.iniFloatMsg();
  },

  navClick: function () {
    var t = this;
    //
    t.navs.on("click", function () {
      t.setNavActive($(this));
    });
  },

  setNavActive: function (obj) {
    var t = this;
    //
    $("nav li").each(function () {
      $(this).removeClass("active");
    });
    obj.parent("li").addClass("active");
  },

  goHash: function (idStr) {
    var t = this;
    //
    if (idStr == "") {
      $("html, body").stop().animate({ scrollTop: 0 }, 300);
      t.setNavActive(t.navs.eq(0));
    } else {
      var top = $(".part-" + idStr).offset().top;
      top -= 90;
      top = top < 0 ? 0 : top;
      $("html, body")
        .stop()
        .animate({ scrollTop: top + "px" }, 300);
    }
  },

  iniFloatMsg: function () {
    $("#floatmsg .close").on("click", function () {
      $("#floatmsg").css("bottom", "-260px");
    });
  },

  msgSubmit: function () {
    var store = $.trim($("#f_store").val());
    if (string.empty(store)) {
      layer.showTips("请输入您的店铺名称");
      return false;
    }
    var qq = $.trim($("#f_qq").val());
    if (string.empty(qq)) {
      layer.showTips("请输入您的QQ");
      return false;
    }
    layer.load();
    $.post(
      "/",
      {
        send: "msgSubmit",
        store: store,
        qq: qq,
      },
      function (res) {
        layer.unload();
        if (res.re == "ok") {
          alert(res.cont);
          top.location.reload();
        } else {
          layer.showTips(res.cont);
        }
      },
      "JSON"
    );
  },
};

//弹幕
var barrage = {
  winWidth: 0,
  arrFontSize: ["14px", "16px", "18px", "20px", "24px"],
  arrColor: [
    "#b50000",
    "#ffe6d5",
    "#ffd556",
    "#fcff00",
    "#b9ff4a",
    "#1c6b00",
    "#11c04a",
    "#24f3cf",
    "#99dcff",
    "#2d5bd1",
    "#1004b6",
    "#8400ff",
    "#b120b3",
    "#d61f68",
  ],

  ini: function () {
    var t = this;
    //
    t.winWidth = $(window).width();

    t.listDo();

    $(window).on("resize", function () {
      t.winWidth = $(window).width();
      t.listDo();
    });
  },

  listDo: function () {
    var t = this;
    //
    $("#oDanmu .list").each(function () {
      var oThis = $(this);
      oThis.css({
        left: t.winWidth + t.randomFrom(10, 2000, 10) + "px",
        top: t.randomFrom(0, 460, 5) + "px",
        fontSize: t.arrFontSize[t.randomFrom(0, t.arrFontSize.length - 1, 1)],
        color: t.arrColor[t.randomFrom(0, t.arrColor.length - 1, 1)],
      });
      t.danmuStart(oThis);
    });
  },

  danmuStart: function (obj) {
    var t = this;
    //
    obj.animate(
      { left: "-600px" },
      t.randomFrom(15000, 35000, 500),
      "linear",
      function () {
        obj.css({
          left: t.winWidth + t.randomFrom(10, 2000, 10) + "px",
          top: t.randomFrom(0, 460, 5) + "px",
          fontSize: t.arrFontSize[t.randomFrom(0, t.arrFontSize.length - 1, 1)],
          color: t.arrColor[t.randomFrom(0, t.arrColor.length - 1, 1)],
        });
        t.danmuStart(obj);
      }
    );
  },
};

var layer = {
  make: function (idStr, htmlStr, isClose) {
    var t = this;
    //
    var obj;
    if ($("#" + idStr).length > 0) obj = $("#" + idStr);
    else {
      $("body").append(htmlStr);
      obj = $("#" + idStr);
    }
    if (isClose == "close") {
      obj.append('<div class="layer-close-button" title="关闭"></div>');
      obj.find(".layer-close-button").on("click", function () {
        obj.fadeOut("fast", function () {
          obj.remove();
          t.unModal();
          t.unBg();
        });
      });
    }
    return obj;
  },

  //------------------------------------------------------------------------

  showModal: function () {
    var layer_modal = this.make(
      "layer_modal",
      '<div id="layer_modal" class="modal"></div>',
      ""
    );
    layer_modal
      .css({
        height: Math.max($(document).height(), $(window).height()) + "px",
      })
      .stop()
      .animate(
        {
          opacity: 0.4,
        },
        150
      );
  },

  unModal: function () {
    if ($("#layer_modal").length > 0) {
      $("#layer_modal")
        .stop()
        .animate(
          {
            opacity: 0,
          },
          150,
          function () {
            $("#layer_modal").remove();
          }
        );
    }
  },

  //------------------------------------------------------------------------

  bg: function () {
    var t = this;
    //
    var layer_bg = t.make(
      "layer_bg",
      '<div id="layer_bg" class="bg"></div>',
      ""
    );
    layer_bg.css({
      height: Math.max($(document).height(), $(window).height()) + "px",
    });
  },

  unBg: function () {
    if ($("#layer_bg").length > 0) {
      $("#layer_bg").remove();
    }
  },

  //------------------------------------------------------------------------

  load: function () {
    var t = this;
    //
    t.bg();
    var layer_loading = t.make(
      "layer_loading",
      '<div id="layer_loading" class="loading"></div>',
      ""
    );
  },

  unload: function () {
    var t = this;
    //
    if ($("#layer_loading").length > 0) {
      $("#layer_loading").remove();
    }
    t.unBg();
  },

  //------------------------------------------------------------------------

  /*
	args = {
		content: '文本内容'
		, timeout: 出现后的停留时间，单位：秒
	}
	//如果args不是对象，则args为text
	*/
  showTips: function (args) {
    var t = this;
    var content, timeout;
    if (typeof args == "object") {
      content = args.content;
      timeout = args.timeout;
    } else {
      content = args;
      timeout = 2;
    }

    var layer_tips = t.make(
      "jmr-layer-tips",
      '<div class="jmr-layer-tips" id="jmr-layer-tips"></div>',
      ""
    );
    layer_tips.html(content).css({
      left: ($(window).width() - layer_tips.width()) / 2 + "px",
      top: ($(window).height() - layer_tips.height()) / 2 + "px",
    });
    layer_tips.stop().animate({ opacity: 1 }, 200);

    timeout = timeout * 1000;
    setTimeout(function () {
      layer_tips.stop().animate({ opacity: 0 }, 200, function () {
        layer_tips.remove();
      });
    }, timeout);
  },
};

var math = {
  vNumber: function (value, re) {
    if (string.empty(value) || isNaN(value)) return re;
    else return parseInt(value);
  },

  vFloat: function (value, re) {
    if (string.empty(value) || isNaN(value)) return re;
    else return parseFloat(value);
  },

  round: function (value, how) {
    var cont = ((value * Math.pow(10, how)) / Math.pow(10, how)).toFixed(how);
    return parseFloat(cont);
  },

  rand: function (n, m) {
    var r = Math.floor(Math.random() * (m - n + 1) + n);
    return r;
  },
};

var string = {
  cNumber: function (str) {
    var t = this;
    //
    cont = str;
    if (t.empty(cont)) return "";
    var arr1 = new Array(
      "０",
      "１",
      "２",
      "３",
      "４",
      "５",
      "６",
      "７",
      "８",
      "９",
      "。",
      "－",
      "，"
    );
    var arr2 = new Array(
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      ".",
      "-",
      ","
    );
    for (var i = 0; i < arr1.length; i++) {
      cont = cont.replaceAll(arr1[i], arr2[i]);
    }
    return cont;
  },

  cLetter: function (str) {
    var t = this;
    //
    cont = str;
    if (t.empty(cont)) return "";
    var arr1 = new Array(
      "Ａ",
      "Ｂ",
      "Ｃ",
      "Ｄ",
      "Ｅ",
      "Ｆ",
      "Ｇ",
      "Ｈ",
      "Ｉ",
      "Ｊ",
      "Ｋ",
      "Ｌ",
      "Ｍ",
      "Ｎ",
      "Ｏ",
      "Ｐ",
      "Ｑ",
      "Ｒ",
      "Ｓ",
      "Ｔ",
      "Ｕ",
      "Ｖ",
      "Ｗ",
      "Ｘ",
      "Ｙ",
      "Ｚ",
      "ａ",
      "ｂ",
      "ｃ",
      "ｄ",
      "ｅ",
      "ｆ",
      "ｇ",
      "ｈ",
      "ｉ",
      "ｊ",
      "ｋ",
      "ｌ",
      "ｍ",
      "ｎ",
      "ｏ",
      "ｐ",
      "ｑ",
      "ｒ",
      "ｓ",
      "ｔ",
      "ｕ",
      "ｖ",
      "ｗ",
      "ｘ",
      "ｙ",
      "ｚ"
    );
    var arr2 = new Array(
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    );
    for (var i = 0; i < arr1.length; i++) {
      cont = cont.replaceAll(arr1[i], arr2[i]);
    }
    return cont;
  },

  cFull: function (str) {
    return this.cLetter(this.cNumber(str));
  },

  empty: function (value) {
    if (value == undefined || value == null || value == "") return true;
    else return false;
  },

  trim: function (str, dedu) {
    if (this.empty(str)) return "";
    if (this.empty(dedu)) return str;
    var cont = str;
    var len = dedu.length;
    while (cont.substr(0, len) == dedu) {
      cont = cont.substr(len);
    }
    while (cont.substr(cont.length - len) == dedu) {
      cont = cont.substr(0, cont.length - len);
    }
    return cont;
  },
};
