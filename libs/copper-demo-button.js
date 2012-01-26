/**
 * Created by JetBrains PhpStorm.
 * User: mainUser
 * Date: 12/01/25
 * Time: 23:22
 * To change this template use File | Settings | File Templates.
 */
;
var jp_utweb_jQueryPlugins = jp_utweb_jQueryPlugins || {};
(function($, namespace){
    //内部で子スレッドを作成するのでメインスレッドは一本に絞る。
    if(!!namespace.copperDemoButtons){
        return;
    }
    namespace.copperDemoButtons = new Function();

    var FILE_NAME = "copper-demo-button.js";
    //メインクラス
    function CopperDemoButton(){
        this.thread = [];
        this.init_ = function(){
            this.thread = [];
            this._addThread();
        };
        this.init_();
    }
    CopperDemoButton.prototype = {
        //スクリプトの呼び出しを探してスレッドとして登録。
        _addThread:function(){
            var thread = this.thread;
            var allReplace = true;
            $(document).find('script').each(function(){
                if($(this).attr('src') === undefined){
                    return;
                }
                if($(this).attr('src').indexOf(FILE_NAME) < 0){
                    return;
                }
                thread.push(this);
                var targetId = $(this).attr('targetId');
                if(targetId === undefined){
                    return;
                }
                if(targetId !== "" && targetId !== "0" && targetId !== 0 && targetId.length > 0){
                    allReplace = false;
                }
            });
            console.log(thread)
        }
    };
    //リプレーサーの抽象クラス
    function AbstractReplacerState(){}
    AbstractReplacerState.prototype = {
        replace:function(){
            //あとで実装
        },
        getTarget:function(){
            throw new Error("AbstractReplacerState.getTarget() is an Abstract method and must be overridden.");
        }
    };
    //全て変換
    AllReplacerState = extend(AbstractReplacerState, function(){
//        this.__super__.constructor();
    });
    AllReplacerState.prototype = {
        getTarget:function(){
            //
        }
    };
    //ターゲットを指定して変換
    TargetReplacerState = extend(AbstractReplacerState, function(){
//        this.__super__.constructor();
    });
    TargetReplacerState.prototype = {
        getTarget:function(){
            //
        }
    };
    //ステートマシーン
    function ReplacerStateMachine(){
        this.state_;
    }
    ReplacerStateMachine.ALL_REPLACE_MODE = "all_replace_mode";
    ReplacerStateMachine.TARGET_REPLACE_MODE = "target_replace_mode";
    ReplacerStateMachine.prototype = {
        replace:function(){
            return this.state_.replace();
        },
        getTarget:function(){
            return this.state_.getTarget();
        },
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
        c.prototype.__super__ = s.prototype;    // __super__のところを superclass とかにしてもOK!!
        c.prototype.__super__.constructor = s;  // 上に同じく。但し、 super は予約語。
        c.prototype.constructor = c;
        return c;
    };
    //
    $(function(){
        namespace.copperDemoButtons = new CopperDemoButton();
    });
})(jQuery, jp_utweb_jQueryPlugins);