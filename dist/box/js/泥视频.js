var rule = {
  title: '泥视频',
  host: 'https://www.nivod.vip/',
  url: 'https://www.nivod.vip/k/fyfilter/',
  filter_url: '{{fl.cateId}}-{{fl.area}}-------fypage---{{fl.year}}',
  searchUrl: '/index.php/ajax/suggest?mid=1&wd=**&page=fypage&limit=30',
  headers: {
    'User-Agent': 'Mozilla/5.0',
  },
  searchable: 1,
  quickSearch: 1,
  filterable: 1,
  play_parse: true,
  double: false,
  timeout: 5000,
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&3&4',
  filter_def: {
    1: { cateId: '1' },
    2: { cateId: '2' },
    3: { cateId: '3' },
    4: { cateId: '4' }
  },
  filter: 'H4sIAAAAAAAAE+2W324SQRTG32WvuWBml399A5/BcLHRvVJ70ahJ0zSxJVCgjYpRlBarJrYLFVOIxgjb5WmYXfYtHLqzc85MzIYIFzbh8ny/nZ05w/edZc8gxtb9PeORs2tsGQ/sp869h0bG2LafOLwORx47P+b1c/vxM+f2wW0us2ovqvQWMi+IsZ8RcrM387th40iQPJB2lzVcIAVJwvooqFSBFIG4LTb2gJTgbRdHCiFZiYKD18GLNkLodA1X2YlQWFX/MJs0AFF4YTi5Yv47hJR2w7foGBT6DQ4HYbuFEOzFam+iTh8hE/ZqXof+FUIWvLDSDA5PAVk5QN9P5vVzhOAY4cE0Op0ihO7db4Ue+q0sfvHlBYyNYO84NtiAdYfsZJJuA2jwqxt1akIVRcKiy07w+1owUch1r4bBeJqsiwt52ulLduYLJgrZ/8DlimCikOz9RdAdJCwu5Fk+9eGdopDrfgyBiUKes/pr5rWTc8YFvrpdx95BVzf+OfP8Ja+OZmlOWpDmsG6BbmHdBN3EOgWdYp2ATrCeBT2LdFKSOilhvQh6EesF0AtYz4Oexzr0S3C/BPoluF8C/RLcL4F+F7ku75czBl1xsKHMnvmzicsHSDI6YGvuYO5VhCxsPqTnFONJ3TQ1I6MlecWPsARt0R5G/QFCOc2mgBZ2WlPAa1X+fBKAuFgmVP8a/rQQpw6GlBDPj0fARIEulTU/s49fkqWy3oyAOzYCzBVHgKmZPvRu5o1Jsk9BmwIqLWoGVmlJi4xCzbw2FFSa1fLPva0+UNCcqtL1felTBkF8I0mC4gLdB28aAr0oUr/mm2j9f9GyVowW7Cu+rs1ecPMt8SjRwqNSqoVHpSXNhAq1/hIe9QGieVGlVIuWSs21Rev2TpJoxcUy38O0P8Obr9adiNb+H+y4L6eTDwAA',
  lazy: "js:\n  input = { parse: 1, url: input, js: '' };",
  推荐: 'a:has(.lazyload);a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
  一级: 'a:has(.lazyload);a&&title;.lazyload&&data-original;.module-item-note&&Text;a&&href',
  二级: {
    title: 'h1&&Text;.module-info-tag-link:eq(2)&&Text',
    img: '.lazyload&&data-original',
    desc: '.module-info-item:contains(集数)&&Text;.module-info-tag-link:eq(0)&&Text;.module-info-tag-link:eq(1)&&Text;.module-info-item:contains(主演)&&Text;.module-info-item:contains(导演)&&Text',
    content: '.module-info-introduction-content&&Text',
    tabs: '#y-playList&&span',
    lists: '.module-play-list',
    tab_text: 'Text',
    list_text: 'a&&Text',
    list_url: 'a&&href',
  },
  搜索: $js.toString(() => {
        let data = JSON.parse(request(input)).list;
        let d = [];
        data.forEach(it => {
            d.push({
                title: it.name,
                desc: it.en,
                img: rule.host + it.pic,
                url: rule.host + '/nivod/' + it.id
            });
        });
        setResult(d);
    }),
}