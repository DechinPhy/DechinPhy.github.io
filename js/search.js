var searchFunc = function(path, search_id, content_id) {
    'use strict';
    $.ajax({
        url: path,
        dataType: "xml",
        success: function(xmlResponse) {
            var datas = $("entry", xmlResponse).map(function() {
                var categories = [];
                $("category", this).each(function() {
                    categories.push($(this).text().trim());
                });
                return {
                    title: $("title", this).text(),
                    content: $("content", this).text(),
                    url: $("url", this).text(),
                    categories: categories
                };
            }).get();

            var $input = document.getElementById(search_id);
            if (!$input) return;
            var $resultContent = document.getElementById(content_id);
            
            if ($("#local-search-input").length > 0) {
                $input.addEventListener('input', function() {
                    var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
                    
                    if (this.value.trim().length <= 0) {
                        $resultContent.style.display = "none";
                        $resultContent.innerHTML = "";
                        return;
                    }

                    $resultContent.style.display = "block";

                    var matchedResults = [];
                    
                    datas.forEach(function(data) {
                        var isMatch = true;
                        if (!data.title || data.title.trim() === '') {
                            data.title = "Untitled";
                        }
                        
                        var data_title = data.title.trim().toLowerCase();
                        var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();

                        if (data_content !== '') {
                            keywords.forEach(function(keyword) {
                                var index_title = data_title.indexOf(keyword);
                                var index_content = data_content.indexOf(keyword);

                                if (index_title < 0 && index_content < 0) {
                                    isMatch = false;
                                }
                            });
                        } else {
                            isMatch = false;
                        }

                        if (isMatch) {
                            matchedResults.push({
                                title: data.title,
                                url: data.url,
                                categories: data.categories
                            });
                        }
                    });

                    if (matchedResults.length === 0) {
                        $resultContent.innerHTML = '<div class="search-no-result"><i class="fa fa-search"></i><p>未找到相关内容</p></div>';
                        return;
                    }

                    var str = '<div class="search-results-wrapper">';
                    matchedResults.forEach(function(result) {
                        str += '<div class="search-result-card">';
                        str += '<a href="' + result.url + '" class="search-result-link">';
                        str += '<div class="search-result-header">';
                        
                        var titleWithHighlight = result.title;
                        keywords.forEach(function(keyword) {
                            var regS = new RegExp(keyword, "gi");
                            titleWithHighlight = titleWithHighlight.replace(regS, "<mark class=\"search-keyword\">" + keyword + "</mark>");
                        });
                        str += '<h3 class="search-result-title">' + titleWithHighlight + '</h3>';
                        
                        str += '</div>';
                        str += '<div class="search-result-footer">';
                        if (result.categories && result.categories.length > 0) {
                            str += '<span class="search-result-categories">';
                            result.categories.forEach(function(cat, idx) {
                                str += '<span class="search-category-tag">' + cat + '</span>';
                                if (idx < result.categories.length - 1) {
                                    str += ' ';
                                }
                            });
                            str += '</span>';
                        }
                        str += '</div>';
                        str += '</a>';
                        str += '</div>';
                    });
                    str += '</div>';
                    $resultContent.innerHTML = str;
                });
            }
        }
    });
};