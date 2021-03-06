define(['command', 'utils'], function(command, utils) {
    /**
     * 指令编辑器
     * @constructor
     */
    function Editor() {
        this.taskQueue = []
        this.$editor = utils.$('.commander-editor')
        this.$lineArea = utils.$('.commander-lines')
        this.init()
    }

    /**
     * 初始化事件
     */
    Editor.prototype.init = function() {
        this.update()
        utils.addEvent(this.$editor, 'keydown', this.hotKey.bind(this))
        utils.addEvent(this.$editor, 'input', this.update.bind(this))
        utils.addEvent(this.$editor, 'scroll', this.scroll.bind(this))
    }

    /**
     * 防止编辑区键盘操作控制小方块
     */
    Editor.prototype.hotKey = function(e) {
        if (e.keyCode === 13 ||
          e.keyCode === 37 || e.keyCode === 38 || e.keyCode === 39 || e.keyCode === 40) {
            e.stopPropagation()
        }
    }

    /**
     * 实现指令区和行号区的同步滚动
     * @param event
     */
    Editor.prototype.scroll = function(event) {
        this.$lineArea.style.top = -this.$editor.scrollTop + 'px'
    }

    /**
     * 输入指令，实现行号的更新
     */
    Editor.prototype.update = function() {
        var text = ''
        var enter = this.$editor.value.match(/\n/g)
        var lineNum = enter ? enter.length + 1 : 1

        for (var i = 1; i <= lineNum; i++) {
            text += "<div class='commander-lines-item'>" + i + '</div>'
        }

        this.$lineArea.innerHTML = text
    }

    /**
     * 检查当前行代码的指令是否合法
     * @param {string} command - 目标指令
     * @param {function} callback - 如果存在，执行回调函数
     * @return {boolean} - 正确返回true
     */
    Editor.prototype.getTask = function(target, callback) {
        for (var key in command.commands) {
            if (command.commands[key].pattern.test(target)) {
                var func = command.commands[key].run
                var params = target.match(command.commands[key].pattern).slice(1)
                return {
                    run: func,
                    params: params,
                }
            }
        }
    }

    /**
     * 给行号添加标记
     * @param {number} index - 行号索引
     * @param {string} index - 设置类名(success||error)
     */
    Editor.prototype.setMark = function(index, className) {
        if (index < 0) {
            return
        }

        this.$lineArea.children[index].className = className
    }

    return {
        Editor: Editor,
    }
})
