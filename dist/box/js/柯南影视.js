var rule = {
  author: '源动力&平凡&优雅',
  title: '柯南影视',
  类型: '影视',
  host: 'https://www.knvod.com/',
  headers: {
    "User-Agent": "MOBILE_UA",
    Cookie: "X-Robots-Tag=CDN-VERIFY",
  },
  编码: 'utf-8',
  timeout: 10000,
  url: '/show/fyclassfyfilter/',
  filter_url: '-{{fl.area}}-{{fl.by or "time"}}-{{fl.class}}-{{fl.lang}}-{{fl.letter}}---fypage---{{fl.year}}',
  searchUrl: '/daxiaoren/**----------fypage---/',
  searchable: 1,
  searchCookie: '',
  quickSearch: 1,
  filterable: 1,
  limit: 9,
  double: false,
  play_parse: true,
  class_name: '电影&电视剧&综艺&动漫',
  class_url: '1&2&4&3',
  filter: 'H4sIAAAAAAAAA+2aW08bRxTHv8s+87AL5MZb7vf7PVUe3MhqoxIqAa2EIiTAmNoOsQ0igLHB0NiYIIzNRdSYYr6MZ3b9LSJ7zmVQ29U+QILovuX/O5zZOTPDnD+7eW9YRtcP741fggNGl/GmO9DXZ7QZPYF3QaPLENGCDIWNNuP3QPdvwdbP9TRxeKURWmlio8swBtuATmdEtAAUBMbsyAYMxAJjcjgph6YhBoLGjK3U9zM4phI0ZmFC7O7hmEpQbLjWmKthTAkak4piQXOJzNarUZyLEhhzistifBViIOh5sZK9jzEQWg321B7X0BQUy//BNYCguRSX67VFnIsSlDc22Uh9wTwlKG9hVUZmMU8JL2stR9bs6QmMKUGxUEyOzGFMicHXzag6N4HeYEA7NpmyGK96PTa5QiM1hqUogbHGckpWShADQUtei4v0Pi65EjTdrU8cA0Hb+GGDYyAobyYvM2uYpwTNJfuF80BQDbW/OAaC51LW51I+lPexLKrLmKcE5Y0mRK4gIrjLrKmS/IGdKNrRFBZDmo/eovxwIHL0W0mafiK8U9/DAwFC39juQM9PvLFOqeisDHncWJlabwzNOaV5LIC0thVOqchb0RS0vZs5joHQtoJjILQt5BgI7VhoMSW0LeQYCG2RxHqIF6kp9EUaCAZ6eZHkzE5jZtvjIrWb7WeAtf6p8U7mnTrvYN6h83bm7Tq3mFs6N5mbGrcuELcu6Pw88/M6P8f8nM7PMj+rc67X0uu1uF5Lr9fiei29XovrtfR6La7X0uu1uF7LPHzGg/39QW0DRXFGlj563MCLAC4SuQTkEpHLQC4TuQLkCpGrQK4SuQbkGpHrQK4TuQHkBpGbQG4SuQXkFpHbQG4TuQPkDpG7QO4SuQfkHpH7QO4TeQDkAZGHQB4SeQTkEZHHQB4TeQLkCZGnQJ4SeQbkGZHnQJ4TeQHkBZGXQF4SeQXk1aFD8eOA9hsdnxTVxD8OBP+iG11G/9t3QRqyXq3K8hREfn7b38dXXmlURLDb9b35tTfYfOrrNqP9qFxYIud8JnejhBd305iflLN5MbwjQgm8WXXkxeWJ9R1RpTtUCY8O6T9dnptDcnNyIj4mEpsYU4LmspcQ4QrORQnaut0lOY8uCAS7oLBMoR0BQc/7NMauCwQ9b3+C1wyE1wZ8TM7KzT25OR03RyYSZblbo6PXEl6clZtDcnVr02URWxTzS5hK+hu4G5He1/yCEt/L1/j+5PT5E+Im12vq9Zpcr6nXa3Jdpl6XyXWZel0m12V2+r7I90Unyxd1HJEvagxF7cIQ3q1K6H19NKv19dEsT2z9wClH8C5XgvImizKWxzwl+L4Oywp6DBB8z2/Vd5N0z7eE1pgbn3EuIChWXRXrCxhTgp6X3nSiVXyeEpQ3lZXb9KZMCcqrVGQkUa9Oihiu2SFE67D9p72HzhAEjbEx4gyPY7YS38DDyEpJJMo06ZbQ2mUjS69OlKDYWsGuxTGmxKl95+F7g9PnDfwe7ffok9SjO4+oR7v1YdevPaGis4S9HQSNGV+xkzhpEBRLLthr9MVDCbo3Xb6wOMl5J47vUUDQmItLIk13sRI0pst7Dpmpal9tlKDnHSS5O4OgPJd3OqI8IXZxk0HosfyWFstv8XrmavW/8WsPCMqLZ0UkjXlK8NHZFEX0NSBozHRMptCfgOB12RAHM7QuLaH1r+/xfsT1fcW/+QeP0/W9he8tfG/hewvfW3j0Fmc0b3FMd70YC4sM/h0Jgq7NY/hfBv+rHuF/c/d7i99b/N5y8nrL4FdzwZ3U+ygAAA==',
  推荐: '*',
  一级: 'body&&.public-list-box;a&&title;img&&data-src;.sBottom&&Text;a&&href',
  搜索: $js.toString(() => {
    function fetchCk() {
      for (var i = 0; i < 2; i++) {
        const yzm = HOST + "/index.php/verify/index.html";
        const yzmHtml = request(yzm, {
          withHeaders: true,
          toBase64: true,
          headers: rule.headers
        }, true);
        const yzmJson = JSON.parse(yzmHtml);

        const setCk = Object.keys(yzmJson).find(it => it.toLowerCase() === "set-cookie");
        const cookie = setCk ? yzmJson[setCk].split(";")[0] : "";
        if (!cookie) continue;
        console.log("cookie:" + cookie);

        const ocrHtml = post('https://api.nn.ci/ocr/b64/text', { body: yzmJson.body });
        if (!ocrHtml) continue;

        const submit_url = `${HOST}/index.php/ajax/verify_check?type=search&verify=${ocrHtml}`;
        const submitHtml = post(submit_url, {
          body: undefined,
          headers: {
            ...rule.headers,
            Cookie: `${rule.headers.Cookie}; ${cookie}`,
          },
        });
        const submitJson = JSON.parse(submitHtml)
        if (submitJson?.code !== 1) continue;

        rule.searchCookie = cookie;
      }
    }

    // 尝试获取
    if (!rule.searchCookie) {
      fetchCk();
      // 判断获取是否成功
      if (!rule.searchCookie) setResult([]);
    }

    // 之前获取的是否过期
    let contentHtml = request(input, {
      headers: {
        ...rule.headers,
        Cookie: `${rule.headers.Cookie}; ${rule.searchCookie}`
      },
    });
    if (contentHtml.includes('请输入验证码')) {
      // 过期数据置空
      rule.searchCookie = '';
      // 尝试获取
      fetchCk();
      // 判断获取是否成功
      if (!rule.searchCookie) setResult([]);

      contentHtml = request(input, {
        headers: {
          ...rule.headers,
          Cookie: `${rule.headers.Cookie}; ${rule.searchCookie}`
        },
      });
    }

    const list = pdfa(contentHtml, ".public-list-box");
    list.forEach(it => {
      d.push({
        title: pdfh(it, ".thumb-txt&&Text"),
        desc: pdfh(it, ".thumb-blurb&&Text"),
        pic_url: pdfh(it, "img&&data-src"),
        url: HOST + pdfh(it, "a&&href")
      })
    });
    setResult(d);
  }),
  二级: $js.toString(() => {
    let html = request(input);
    VOD = {};
    VOD.vod_id = input;
    VOD.vod_name = pdfh(html, '.slide-info-title.hide&&Text');
    VOD.type_name = pdfh(html, 'li:contains(备注)&&Text').replace('备注：', ' ');
    VOD.vod_pic = pd(html, '', input);
    VOD.vod_remarks = pdfh(html, 'li:contains(更新)&&Text').replace('更新：', ' ');
    VOD.vod_year = pdfh(html, 'li:contains(年份)&&Text').replace('年份：', ' ');
    VOD.vod_area = pdfh(html, 'li:contains(地区)&&Text').replace('地区：', ' ');
    VOD.vod_director = pdfh(html, 'li:contains(导演)&&Text').replace('导演：', ' ');
    VOD.vod_actor = pdfh(html, 'li:contains(演员)&&Text').replace('演员：', ' ');
    VOD.vod_content = '祝您观影愉快！现为您介绍剧情:' + pdfh(html, 'li:contains(简介)&&Text').replace('简介：', ' ');
    let r_ktabs = pdfa(html, '.nav-swiper&&a');
    let ktabs = r_ktabs.map(it => '专线-' + pdfh(it, 'Text').replace("播放源", " 极速云播").replace("电影", " 高清一线"));
    VOD.vod_play_from = ktabs.join('$$$');
    let klists = [];
    let r_plists = pdfa(html, 'body&&.anthology-list-box');
    r_plists.forEach((rp) => {
      let klist = pdfa(rp, 'body&&a').reverse().map((it) => {
        return pdfh(it, 'a&&Text').replace("展开全部", "👉 ") + '$' + pd(it, 'a&&href', input);
      });
      klist = klist.join('#');
      klists.push(klist);
    });
    VOD.vod_play_url = klists.join('$$$');
  }),
  lazy: $js.toString(() => {
    try {
      const html = request(input);
      const removeSuffix = '-柯南影视-追热播电视剧-看最新电影';
      const title = pdfh(html, 'title&&Text').replace(removeSuffix, '');
      const player_aaaa = JSON.parse(/var player_aaaa=({[^;]+})/.exec(html)[1]);
      const parseUrl = `https://vip.cdnjson.xyz/ppy.php?url=${player_aaaa.url}&next=//&title=${title}`;
      const parseHtml = request(parseUrl);
      const newUrl = /"url":"([^"]*)",/i.exec(parseHtml)[1];
      const pbgjz = /"pbgjz":"([^"]*)",/i.exec(parseHtml)[1];
      const dmkey = /"dmkey":"([^"]*)",/i.exec(parseHtml)[1];
      const key = CryptoJS.SHA256(`${Math.floor(Date.now() / 3600000) * 3600}knvod`).toString(CryptoJS.enc.Hex);
      const res = JSON.parse(post('https://vip.cdnjson.xyz/kk.php', {
        data: {
          url: newUrl,
          pbgjz,
          dmkey,
          key
        }
      }));
      if (res.knvod) {
        input = { parse: 0, url: res.vip, type: res.type }
      } else {
        input = {
          parse: 1,
          url: parseUrl,
          parse_extra: `&init_script=${encodeURIComponent(base64Encode('document.querySelector(".art-state").click()'))}&custom_regex=tos&sniffer_exclude=20250102102756054`
        };
      }
    } catch {
      input = {
        parse: 1,
        url: input,
        parse_extra: `&init_script=${encodeURIComponent(base64Encode('document.querySelector(".art-state").click()'))}&custom_regex=tos&sniffer_exclude=20250102102756054`
      };
    }
  }),
}
