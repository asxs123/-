// 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
// 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

import { Crypto, _ } from 'assets://js/lib/cat.js';
const host = 'http://122.114.11.127:8808';
const versionCode = '1030';
const headers = {
    'User-Agent': "okhttp/3.14.9",
    'Connection': "Keep-Alive"
};

async function init(cfg) {}

async function home(filter) {
    const payload = getPayload('App.Vod.Main_type');
    const res = await req(host, {
        method: 'POST',
        headers: headers,
        data: payload,
        postType: 'form',
    });
    const json = JSON.parse(res.content);
    let classes = [];
    if (json.data && _.isArray(json.data)) {
        json.data.forEach(i => {
            if (_.isPlainObject(i)) {
                classes.push({
                    'type_id': i.list_id,
                    'type_name': i.list_name
                });
            }
        });
    }
    const excludeTypes = filter?.exclude || ['短剧', '体育', '斯诺克', '足球', '篮球', '网球'];
    classes = classes.filter(cls => !excludeTypes.includes(cls.type_name));
    const filters = {};
    const tasks = classes.map(async (cls) => {
        const tid = cls.type_id;
        const filterPayload = getPayload({
            'service': 'App.Vod.Videos',
            'list_id': tid,
            'type': '全部',
            'year': '全部',
            'area': '全部',
            'language': '全部',
            'order': 'time',
            'page': '1',
            'perpage': '24'
        });
        try {
            const r = await req(host, {
                method: 'POST',
                headers: headers,
                data: filterPayload,
                postType: 'form'
            });
            const rJson = JSON.parse(r.content);
            const decrypted = decrypt(rJson.data);
            const dataItems = JSON.parse(decrypted);
            const typeFilters = [];
            if (_.isArray(dataItems)) {
                dataItems.forEach(item => {
                    if (item.type === 'filter') {
                        let key = '';
                        let name = '';
                        switch (item.type_filter) {
                            case 'type_expansion':
                                key = 'type';
                                name = '类型';
                                break;
                            case 'class':
                                key = 'type';
                                name = '类型';
                                break;
                            case 'area':
                                key = 'area';
                                name = '地区';
                                break;
                            case 'year':
                                key = 'year';
                                name = '年份';
                                break;
                            case 'language':
                                key = 'language';
                                name = '语言';
                                break;
                            case 'letter':
                                key = 'letter';
                                name = '字母';
                                break;
                            case 'order':
                                key = 'order';
                                name = '排序';
                                break;
                            case 'type':
                                key = '';
                                break;
                            default:
                                key = item.type_filter;
                                name = item.type_filter;
                                break;
                        }
                        if (key && item.filters && item.filters.length > 0) {
                            const values = [];
                            item.filters.forEach(opt => {
                                const v = (key === 'order' && opt.order) ? opt.order : opt.title;
                                const n = opt.title;
                                values.push({ n: n, v: v });
                            });
                            const initValue = values.length > 0 ? values[0].v : '';
                            typeFilters.push({key: key, name: name, value: values, init: initValue});
                        }
                    }
                });
            }
            if (typeFilters.length > 0) {
                filters[tid] = typeFilters;
            }
        } catch (e) {}
    });
    await Promise.all(tasks);
    return JSON.stringify({ 'class': classes, 'filters': filters });
}

async function homeVod() {
    const payload = getPayload('App.Vod.HomeVideos');
    const res = await req(host, {
        method: 'POST',
        headers: headers,
        data: payload,
        postType: 'form'
    });
    const json = JSON.parse(res.content);
    const decryptedData = decrypt(json.data);
    const videos = parseVideos(decryptedData);
    return JSON.stringify({ 'list': videos });
}

async function category(tid, pg, filter, extend) {
    const payload = getPayload({
        'service': "App.Vod.Videos",
        'list_id': tid,
        'type': extend.type || "全部",
        'year': extend.year || "全部",
        'area': extend.area || "全部",
        'language': extend.language || "全部",
        'order': extend.order || "time",
        'page': pg.toString(),
        'perpage': "24",
    });
    const res = await req(host, {
        method: 'POST',
        headers: headers,
        data: payload,
        postType: 'form'
    });
    const json = JSON.parse(res.content);
    const decryptedData = decrypt(json.data);
    const videos = parseVideos(decryptedData);
    return JSON.stringify({'list': videos, 'page': parseInt(pg)});
}

async function search(wd, quick, pg=1) {
    const payload = getPayload({
        'service': "App.Vod.Search",
        'search': wd,
        'page': pg.toString(),
        'perpage': "24"
    });
    const res = await req(host, {
        method: 'POST',
        headers: headers,
        data: payload,
        postType: 'form'
    });
    const json = JSON.parse(res.content);
    const decryptedData = decrypt(json.data);
    const videos = parseVideos(decryptedData);
    return JSON.stringify({
        'list': videos,
        'page': parseInt(pg)
    });
}

async function detail(id) {
    const payload = getPayload({
        'service': "App.Vod.Video",
        'id': id
    });
    const res = await req(host, {
        method: 'POST',
        headers: headers,
        data: payload,
        postType: 'form'
    });
    const json = JSON.parse(res.content);
    let player_vod = null;
    if (json.data && _.isArray(json.data)) {
        for (const i of json.data) {
            if (_.isPlainObject(i) && i.type === 'player') {
                player_vod = i.player_vod;
                break;
            }
        }
    }
    if (!player_vod) return JSON.stringify({ list: [] });
    let play_from = [], play_urls = [];
    const vodPlay = player_vod.vod_play || [];
    vodPlay.forEach(j => {
        play_from.push(j.title);
        let playUrlList = [];
        const players = j.players || [];

        players.forEach(k => {
            playUrlList.push(`${k.title}$${k.url}`);
        });
        playUrlList.reverse();
        play_urls.push(playUrlList.join('#'));
    });
    const video = {
        'vod_id': player_vod.vod_id,
        'vod_name': player_vod.vod_name,
        'vod_pic': player_vod.vod_pic,
        'vod_remarks': player_vod.vod_title,
        'vod_actor': player_vod.vod_actor,
        'vod_content': player_vod.vod_content,
        'vod_play_from': play_from.join('$$$'),
        'vod_play_url': play_urls.join('$$$')
    };
    return JSON.stringify({ list: [video] });
}

async function play(flag, id, flags) {
    let jx = 0;
    let parse = 0;
    let noparse = 0;
    let ua = 'com.jubaotaige.jubaotaigeapp/2.3.2 (Linux;Android 12) ExoPlayerLib/2.14.2';
    let url = '';
    if (id.indexOf('nkvod.com') !== -1) {
        noparse = 1;
        url = id;
    } else if (id.indexOf('url=') !== -1) {
        try {
            const res = await req(id, { headers: headers });
            const json = JSON.parse(res.content);
            url = json.url || '';
            if (!url.startsWith('http')) {
                noparse = 1;
            }
        } catch (e) {
            noparse = 1;
        }
    } else {
        url = id;
    }
    if (noparse === 1) {
        ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Safari/537.36';
        if (id.indexOf('url=') !== -1) {
            const parts = id.split('url=');
            if (parts.length > 1) url = parts[1];
        } else {
            url = id;
        }
        if (/https?:\/\/.*\.(iqiyi|youku|v\.qq|mgtv)\.com/.test(url)) {
            jx = 1;
        } else if (url.indexOf('nkvod.com') !== -1) {
            parse = 1;
        }
    }
    return JSON.stringify({jx: jx, parse: parse, url: url, header: { 'User-Agent': ua }});
}

function decrypt(data, keyStr = '', ivStr = '') {
    try {
        if (!keyStr || !ivStr) {
            keyStr = '58ae78ab03bfeefb';
            ivStr = '68e3d872b480c14f';
        }
        const key = Crypto.enc.Utf8.parse(keyStr);
        const iv = Crypto.enc.Utf8.parse(ivStr);
        const encryptedHex = Crypto.enc.Hex.parse(data);
        const decrypted = Crypto.AES.decrypt(
            { ciphertext: encryptedHex }, key,
            {
                iv: iv,
                mode: Crypto.mode.CBC,
                padding: Crypto.pad.Pkcs7
            }
        );
        return decrypted.toString(Crypto.enc.Utf8);
    } catch (e) {
        return null;
    }
}

function getPayload(data) {
    const timestamp = Math.floor(Date.now());
    const md5Val = md5X(String(8 * timestamp - 12));
    let payload = {};
    let signStr = "";
    if (_.isPlainObject(data)) {
        signStr = `Api_FeiFeiCms${data.service}${versionCode}${timestamp}${md5Val}`;
        payload = {
            ...data,
            'versionCode': versionCode,
            'time': timestamp.toString(),
            'md5': md5Val,
            'sign': md5X(signStr)
        };
    } else {
        signStr = `Api_FeiFeiCms${data}${versionCode}${timestamp}${md5Val}`;
        payload = {
            'service': data,
            'versionCode': versionCode,
            'time': timestamp.toString(),
            'md5': md5Val,
            'sign': md5X(signStr)
        };
    }
    return payload;
}

function parseVideos(dataStr) {
    try {
        const data = JSON.parse(dataStr);
        let videos = [];
        if (_.isArray(data)) {
            data.forEach(i => {
                if (_.isPlainObject(i)) {
                    const subList = i.videos || [];
                    subList.forEach(j => {
                        videos.push({
                            'vod_id': j.vod_id,
                            'vod_name': j.vod_name,
                            'vod_pic': j.vod_pic,
                            'vod_remarks': j.vod_title
                        });
                    });
                }
            });
        }
        return videos;
    } catch (e) {
        return [];
    }
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        search: search
    };
}

