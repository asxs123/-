var rule = {
            title: '雪糕TV',
            author:'不告诉你',
            //host: 'https://www.pgitv.com',
            host: 'https://tv.pgitv.com',
            //备用host: 'https://tv2.pgitv.com',
            url: '/vshow/fyclass--------fypage---.html',
            searchUrl: '/vsearch/**----------fypage---.html',
            // searchUrl: 'vodsearch/-------------.html?wd=**',
            headers: {'User-Agent': 'UC_UA'},
            searchable: 1,quickSearch: 1,play_parse: true,limit: 6,timeout: 10000,
class_name: '电影&电视剧&动漫&综艺',
class_url: 'dianying&dianshiju&dongman&zongyi',
 推荐:'*',
 tab_exclude:'热播榜|友情|猜你喜欢',
            //lazy: `js: 
//let pclick = 'document.querySelector("#playleft iframe").contentWindow.document.querySelector("#start").click()';
//input = { parse: 1, url: input, js: pclick, click: pclick}`,
            //一级: 'ul.new-up-list li;a&&title;.lazyload&&data-original;span.state&&Text;a&&href',
            一级: 'body&&ul.hl-vod-list li;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
            二级: {
                //title: 'h1&&Text',
                title: 'h2&&Text',
                //img: '.lazyload&&data-original',
                img: '.hl-dc-pic&&data-original',
                //desc: '主要信息;年代;地区;演员;导演',
                //desc: '.info-wrap&&p:eq(0)&&Text;.info-wrap&&p:eq(3)&&Text;.info-wrap&&p:eq(4)&&Text;.info-wrap&&p:eq(2)&&Text;.info-wrap&&p:eq(1)&&Text',
                desc: 'li.hl-col-xs-12:contains(更新)&&Text;li.hl-col-xs-12.hl-col-sm-4&&Text;li.hl-col-xs-12.hl-col-sm-4:eq(1)&&Text;li.hl-col-xs-12:contains(主演)&&Text;li.hl-col-xs-12:contains(导演)&&Text',
                //content: '.detail&&.box&&Text',
                content: 'li.hl-col-xs-12.blurb&&Text',
                //tabs: 'ul.nav-tabs&&li a',
                tabs: '.hl-plays-from.hl-tabs&&a',
                //lists: 'ul.episodes-list:eq(#id)&&li a'
                lists: 'ul.hl-plays-list:eq(#id)&&li a'
            },
            //搜索:'*',
            搜索:'body&&li.hl-list-item;a&&title;.hl-lazy&&data-original;.hl-pic-text&&Text;a&&href',
            lazy: `js:
		        pdfh = jsp.pdfh;
		        let html = request(input);
		        // log(html);
		        html = JSON.parse(html.match(/r player_.*?=(.*?)</)[1]);
		        let url = html.url;
		        if (html.encrypt == "1") {
		            //url = unescape(url)
		            //return {parse: 0, url: url}
		            input = {
			            jx: 0,
			            url: unescape(url),
			            parse: 0
			        };
		        } else if (html.encrypt == "2") {
		            //url = unescape(base64Decode(url))
		            //return {parse: 0, url: url}
		            input = {
			            jx: 0,
			            url: unescape(base64Decode(url)),
			            parse: 0
			        };
		        }
		        if (/m3u8|mp4|flv|avi|mkv/.test(url)){
		            //input = url
		            input;
		            //return {parse: 0, url: input}
		        } else {
		            //return {parse: 1, url: input}
		            input;
		        }
		    `,
        }
