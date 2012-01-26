/**
 * Created by JetBrains PhpStorm.
 * User: mainUser
 * Date: 12/01/25
 * Time: 23:22
 * To change this template use File | Settings | File Templates.
 */
// Copyright 2012 utweb.jp. All Rights Reserved.
/**
 * @fileoverview Facebookのいいねボタンの「いいね！」を違う文字にかえるjQueryのプラグインです。
 * @author masamunet (Masamune Utsunomiya)
 */
;
/**
 * このスクリプトが所有する名前空間です。
 * @type {Object}
 */
var jp_utweb_jQueryPlugins = jp_utweb_jQueryPlugins || {};
(function($, namespace){
    //内部で子スレッドを作成するのでメインスレッドは一本に絞ります。
    if(!!namespace.copperDemoButtons){
        return;
    }
    namespace.copperDemoButtons = new Function();

    /**
     * このスクリプトのファイル名です。
     * @const
     * @type {String}
     */
    var FILE_NAME = 'copper-demo-button.js';
    /**
     * メインクラス
     * @constructor
     */
    function CopperDemoButton(){
        /**
         * スクリプトが呼び出された回数だけスレッドとして登録します。
         * @type {Array}
         */
        this.thread_ = [];
        /**
         * いいねボタンの存在チェックに使用するタイマーIDです。
         * @type {Number}
         */
        this.timerId_ = 0;
        /**
         * いいねボタンの存在チェックの限界を数えるためのカウンターです。
         * @type {Number}
         */
        this.timerCount_ = 0;
        /**
         * 初期化します。
         */
        this.init_ = function(){
            this.thread_ = [];
            this.addThread_();
            this.sortThread_();
        };
        /**
         * スクリプトの呼び出しを探してスレッドとして登録します。
         */
        this.addThread_ = function(){
            var thread = this.thread_;
            var setParameter = this.setParameter_;
            $(document).find('script').each(function(){
                //scriptタグのsrcがこのファイルじゃない場合は処理をしない
                var target = $(this);
                var src = target.attr('src');
                if(src === undefined){
                    return;
                }
                if(src.indexOf(FILE_NAME) < 0){
                    return;
                }
                //パラメーターをスレッドとして登録
                var params = setParameter(src);
                thread.push(params);
            });
        };
        /**
         * 呼び出し時にパラメーターが指定されているか調べる。指定されていれば{key:value}の形にして返します。
         * @param string {String} 呼び出しに使用された文字列です。
         * @return {Object} 呼び出し時にパラメーターが存在していれば{key:value}の形にして返します。
         */
        this.setParameter_ = function(string){
            var r = {};
            if(string.indexOf('?') < 0){
                return r;
            }
            var params = string.split('?')[1];
            var param = params.split('&');
            var l = param.length;
            for(var i = 0; i < l; i++){
                var target = param[i];
                if(target.indexOf('=') < 0){
                    break;
                }
                var p = target.split('=');
                r[p[0]] = p[1];
            }
            return r;
        };
        /**
         * ターゲットを指定しない全置換モードをスレッドの最初にくるように変更します。
         */
        this.sortThread_ = function(){
            var thread = this.thread_;
            thread = this.deleteAllMode(thread, []);
        };
        /**
         * 再帰的に全置換モードを削除します。
         * @param thread {Array} メインのまだ全置換モードが残っている可能性のあるスレッドです。
         * @param tmp {Array} メインスレッドから取り除いた全置換モードです。
         * @return {Array} 最終的に全置換モードを最初に並べ直して返します。
         */
        this.deleteAllMode = function(thread, tmp){
            var l = thread.length;
            for(var i = 0; i < l; i++){
                var params = thread[i];
                if(!this.isAllMode_(params)){
                    continue;
                }
                tmp.push(params);
                thread.splice(i, 1);
                return this.deleteAllMode(thread, tmp);
            }
            return tmp.concat(thread);
        };
        /**
         * スレッドが全置換モードかどうか調べます。
         * @param params {Object} 調査対象となるスレッドのパラメーターです。
         * @return {Boolean} 全置換モードだった場合trueを返します。
         */
        this.isAllMode_ = function(params){
            if(params.targetId === undefined){
                return true;
            }
            if(params.targetId === ""){
                return true;
            }
            if(params.targetId.length <= 0){
                return true;
            }
            if(params.targetId === "0"){
                return true;
            }
            return false;
        };
        /**
         * いいねボタンが存在するか調べます。ターマーイベントにて連続的に呼ばれます。
         */
        this.existsLikebutton_ = function(){
            var likebutton = $('.fb_ltr');
            if(likebutton.length > 0){
                this.clearTimer_();
            }
            if(++this.timerCount_ > 100){
                this.clearTimer_();
            }
            console.log(likebutton.length);
        };
        /**
         * 存在チェックのタイマーイベントを止めるためのメソッドです。
         */
        this.clearTimer_ = function(){
            var timerId = this.timerId_;
            var timerCount = this.timerCount_;
            clearInterval(timerId);
            timerCount = 0;
        };
        //初期化を実行。
        this.init_();
        //run
        this.run();
    }
    CopperDemoButton.prototype = {
        /**
         * 変換を実行します。
         */
        run:function(){
            var self = this;
            this.clearTimer_();
            this.timerId_ = setInterval(function(){self.existsLikebutton_()}, 100);
        }
    };
    /**
     * リプレーサーの抽象クラスです。このクラスが直接インスタンス化されることはありません。
     * @constractor
     */
    function AbstractReplacerState(){}
    AbstractReplacerState.prototype = {
        /**
         * 変換を実行するメソッドです。
         * @param text {String} 変換する文字列です。
         */
        replace:function(text){
            //あとで実装
        },
        /**
         * 変換する対象を取得します。
         */
        getTarget:function(){
            throw new Error('AbstractReplacerState.getTarget() is an Abstract method and must be overridden.');
        }
    };
    /**
     * 全てを変換するクラスです。
     * @constractor
     * @extends {AbstractReplacerState}
     */
    AllReplacerState = extend(AbstractReplacerState, function(){});
    AllReplacerState.prototype = {
        /**
         * いいねボタンを全て取得します。
         * @override
         */
        getTarget:function(){
            //
        }
    };
    /**
     * 指定されたIDのターゲットのみを変換するクラスです。
     * @constractor
     * @extends {AbstractReplaceState}
     */
    TargetReplacerState = extend(AbstractReplacerState, function(){});
    TargetReplacerState.prototype = {
        /**
         * 指定されたIDのターゲットを取得します。
         * @override
         */
        getTarget:function(){
            //
        }
    };
    /**
     * スレッドの状況に応じて置換モードを変えるステートマシンクラスです。
     * @constractor
     */
    function ReplacerStateMachine(){
        this.state_;
    }
    /**
     * @const
     * @type {String}
     */
    ReplacerStateMachine.ALL_REPLACE_MODE = "all_replace_mode";
    /**
     * @const
     * @type {String}
     */
    ReplacerStateMachine.TARGET_REPLACE_MODE = "target_replace_mode";
    ReplacerStateMachine.prototype = {
        /**
         * 変換します。
         * @param test {String} 変換する文字です。
         */
        replace:function(test){
            return this.state_.replace(test);
        },
        /**
         * 変換する対象を取得します。
         */
        getTarget:function(){
            return this.state_.getTarget();
        },
        /**
         * 変換するモードを設定します。
         * @param mode {String} 変換するモードです。
         */
        setState:function(mode){
            alert(ReplacerStateMachine.ALL_REPLACE_MODE)
            switch(mode){
                case ReplacerStateMachine.ALL_REPLACE_MODE:
                    this.state_ = new AllReplacerState();
                    break;
                case ReplacerStateMachine.TARGET_REPLACE_MODE:
                    this.state_ = new TargetReplacerState();
                    break;
                default:
                    this.state_ = null;
                    break;
            }
        }
    };

    /**
     * extend function
     * @param {Object} s superclass
     * @param {Function} c constructor
     */
    function extend(s, c)
    {
        function f(){};
        f.prototype = s.prototype;
        c.prototype = new f();
        c.prototype.__super__ = s.prototype;
        c.prototype.__super__.constructor = s;
        c.prototype.constructor = c;
        return c;
    };
    //
    $(function(){
        namespace.copperDemoButtons = new CopperDemoButton();
    });
})(jQuery, jp_utweb_jQueryPlugins);