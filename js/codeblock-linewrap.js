+function($) {
    'use strict';

    var CodeBlockLineWrap = function() {};

    CodeBlockLineWrap.prototype = {
        run: function() {
            var self = this;
            self.processAllCodeBlocks();
            $(window).smartresize(function() {
                self.processAllCodeBlocks();
            });
        },

        processAllCodeBlocks: function() {
            var self = this;
            $('figure.highlight.wrap-enabled').each(function() {
                self.processCodeBlock($(this));
            });
        },

        processCodeBlock: function($block) {
            var $gutter = $block.find('.gutter');
            var $code = $block.find('.code pre');
            
            if ($gutter.length === 0 || $code.length === 0) {
                return;
            }

            var lineHeight = parseInt($code.css('line-height'));
            if (isNaN(lineHeight)) {
                lineHeight = 20;
            }

            var gutterHtml = $gutter.html();
            var codeHtml = $code.html();

            var gutterLines = gutterHtml.split(/<br\s*\/?>/i);
            var codeLines = codeHtml.split(/<br\s*\/?>/i);

            var newGutterLines = [];
            var newCodeLines = [];

            for (var i = 0; i < codeLines.length; i++) {
                var lineText = codeLines[i];
                if (!lineText || lineText.trim() === '') {
                    newGutterLines.push(gutterLines[i] || '&nbsp;');
                    newCodeLines.push(lineText || '&nbsp;');
                    continue;
                }

                var tempDiv = $('<div>').css({
                    position: 'absolute',
                    visibility: 'hidden',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    fontFamily: 'Menlo, Consolas, monospace',
                    fontSize: '13px',
                    lineHeight: lineHeight + 'px',
                    width: $code.width()
                }).html(lineText);

                $('body').append(tempDiv);
                var lineCount = Math.ceil(tempDiv.height() / lineHeight);
                tempDiv.remove();

                if (lineCount <= 1) {
                    newGutterLines.push(gutterLines[i] || '&nbsp;');
                    newCodeLines.push(lineText);
                } else {
                    for (var j = 0; j < lineCount; j++) {
                        if (j === 0) {
                            newGutterLines.push(gutterLines[i] || '&nbsp;');
                        } else {
                            newGutterLines.push('&nbsp;');
                        }
                        newCodeLines.push(lineText);
                    }
                }
            }

            $gutter.html(newGutterLines.join('<br>'));
            $code.html(newCodeLines.join('<br>'));
        }
    };

    $(document).ready(function() {
        var lineWrap = new CodeBlockLineWrap();
        lineWrap.run();
    });
}(jQuery);