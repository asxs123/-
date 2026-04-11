// 本资源来源于互联网公开渠道，仅可用于个人学习爬虫技术。
// 严禁将其用于任何商业用途，下载后请于 24 小时内删除，搜索结果均来自源站，本人不承担任何责任。

// 导入加密库和工具库（cat.js是特定环境下的工具库）
import { Crypto, _ } from 'assets://js/lib/cat.js';

// 定义API基础域名，作为爬虫请求的主地址
let host = 'http://su.haotv.site';

// 定义基础请求头，模拟移动端设备的请求特征
const headers = {
    'User-Agent': 'okhttp/3.12.11',  // 模拟Android设备的okhttp客户端
    'Connection': 'Keep-Alive'       // 保持连接，提升请求效率
};

/**
 * 初始化函数 - 配置自定义的API地址
 * @param {Object} cfg - 配置对象
 * @returns {Promise<void>}
 */
async function init(cfg) {
    // 如果配置中存在ext字段且是以http开头的URL，则替换默认的host
    if (cfg.ext && cfg.ext.startsWith('http')) {
        // 去除URL末尾的斜杠，确保地址格式统一
        host = cfg.ext.trim().replace(/\/$/, '');
    }
}

/**
 * 首页分类和筛选条件获取函数
 * @param {Object} filter - 筛选条件（此处未使用，保留参数兼容）
 * @returns {Promise<string>} - 返回包含分类和筛选条件的JSON字符串
 */
async function home(filter) {
    // 请求分类数据接口
    const resp = await req(`${host}/api.php/v2.vod/androidtypes`, { headers });
    // 解析接口返回的JSON数据
    const json = JSON.parse(resp.content);

    // 初始化筛选条件对象和分类列表
    const filters = {};
    const class_list = [];

    // ========== 新增：定义需要排除的type_name列表 ==========
    // 可根据需要添加更多要排除的分类名称
    const excludeTypeNames = ['直播', '短剧'];

    // 遍历分类数据
    for (const item of json.data) {
        // 获取分类ID，为空则跳过
        const type_id = item.type_id || '';
        // 获取分类名称，为空则设为空字符串
        const type_name = item.type_name || '';
        //if (type_id !== '') {
            // 将分类信息添加到分类列表（转换为字符串确保类型统一）
            //class_list.push({ 'type_id': type_id.toString(), 'type_name': item.type_name });
            
        // ========== 新增：过滤排除指定的type_name ==========
        // 如果分类名称在排除列表中，直接跳过当前循环，不处理该分类
        if (type_id !== '' && !excludeTypeNames.includes(type_name)) {
            // 将分类信息添加到分类列表（转换为字符串确保类型统一）
            class_list.push({ 'type_id': type_id.toString(), 'type_name': type_name });

            /**
             * 构建筛选条件的辅助函数
             * @param {string} name - 筛选条件名称（如类型、地区）
             * @param {string} key - 筛选条件参数名（如class、area）
             * @param {Array} list - 筛选条件选项列表
             * @returns {Object} - 格式化后的筛选条件对象
             */
            const createFilter = (name, key, list) => {
                // 初始化筛选值，默认包含"全部"选项
                const values = [{ 'n': '全部', 'v': '' }];
                // 遍历选项列表，过滤空值并添加到筛选值数组
                for (const v of (list || [])) if (v !== '') values.push({ 'n': v, 'v': v });
                // 返回标准化的筛选条件结构
                return { 'key': key, 'name': name, 'init': '', 'value': values };
            };

            // 为每个分类构建筛选条件（类型、地区、年份、排序）
            filters[type_id] = [
                createFilter('类型', 'class', item.classes),   // 类型筛选
                createFilter('地区', 'area', item.areas),     // 地区筛选
                createFilter('年份', 'year', item.years),     // 年份筛选
                {
                    'key': 'sortby',                         // 排序参数名
                    'name': '排序',                          // 排序显示名称
                    'init': 'updatetime',                    // 默认排序方式
                    'value': [                                // 排序选项
                        { 'n': '时间', 'v': 'updatetime' },   // 按更新时间排序
                        { 'n': '人气', 'v': 'hits' },         // 按人气排序
                        { 'n': '评分', 'v': 'score' }         // 按评分排序
                    ]
                }
            ];
        }
    }

    // 返回分类列表和筛选条件的JSON字符串
    return JSON.stringify({ class: class_list, filters: filters });
}

/**
 * 首页视频数据获取函数
 * @returns {Promise<string>} - 返回包含首页视频列表的JSON字符串
 */
async function homeVod() {
    // 请求首页数据接口
    const resp = await req(`${host}/api.php/v2.main/androidhome`, { headers });
    // 解析接口返回的JSON数据
    const json = JSON.parse(resp.content);

    // 处理顶部推荐视频数据（转换为统一格式）
    let videos = arr2vods(json.data.top || []);

    // 遍历其他视频列表，合并到视频数组中
    for (const i of (json.data.list || [])) {
        // 确保是对象类型且包含list属性，避免数据格式错误
        if (_.isPlainObject(i)) videos.push(...arr2vods(i.list));
    }

    // 返回视频列表的JSON字符串
    return JSON.stringify({ list: videos });
}

/**
 * 分类视频列表获取函数
 * @param {string} tid - 分类ID
 * @param {number} pg - 页码
 * @param {Object} filter - 筛选条件（此处未使用）
 * @param {Object} extend - 扩展筛选参数（area/year/sortby/class）
 * @returns {Promise<string>} - 返回包含分类视频列表的JSON字符串
 */
async function category(tid, pg, filter, extend) {
    // 构建分类筛选的查询参数
    const query = {
        'page': pg,                          // 页码
        'type': tid,                         // 分类ID
        'area': extend.area || '',           // 地区筛选
        'year': extend.year || '',           // 年份筛选
        'sortby': extend.sortby || '',       // 排序方式
        'class': extend.class || ''          // 类型筛选
    };

    // 将查询参数转换为URL编码的查询字符串
    const queryString = Object.keys(query)
        .map(k => `${k}=${encodeURIComponent(query[k])}`)  // 对参数值进行URL编码
        .join('&');                                       // 用&连接所有参数

    // 构建完整的请求URL
    const url = `${host}/api.php/v2.vod/androidfilter10086?${queryString}`;
    // 请求分类视频数据
    const resp = await req(url, { headers });
    // 解析接口返回的JSON数据
    const json = JSON.parse(resp.content);

    // 返回视频列表和当前页码的JSON字符串
    return JSON.stringify({ list: arr2vods(json.data), page: pg });
}

/**
 * 搜索函数 - 根据关键词搜索视频
 * @param {string} wd - 搜索关键词
 * @param {boolean} quick - 快速搜索标识（此处未使用）
 * @param {number} pg - 页码（默认1）
 * @returns {Promise<string>} - 返回包含搜索结果的JSON字符串
 */
async function search(wd, quick, pg = 1) {
    // 构建搜索请求URL，对关键词进行URL编码
    const url = `${host}/api.php/v2.vod/androidsearch10086?page=1&wd=${encodeURIComponent(wd)}`;
    // 请求搜索结果数据
    const resp = await req(url, { headers });
    // 解析并返回搜索结果的JSON字符串
    return JSON.stringify({ list: arr2vods(JSON.parse(resp.content).data), page: pg });
}

/**
 * 视频详情获取函数
 * @param {string|number} id - 视频ID
 * @returns {Promise<string>} - 返回包含视频详情的JSON字符串
 */
async function detail(id) {
    // 获取加密的请求头
    const hd = await getXpgHeaders();
    // 请求视频详情接口
    const resp = await req(`${host}/api.php/v3.vod/androiddetail2?vod_id=${id}`, { headers: hd });
    // 解析接口返回的JSON数据
    const data = JSON.parse(resp.content).data;

    // 处理播放地址列表
    const play_urls = (data.urls || [])
        // 过滤掉指定的无效播放源和特定的base64编码地址
        .filter(i => !['及时雨', '及時雨'].includes(i.key) && i.url !== 'dlNQWVppbnZXVVZsZnRhMnRpTkVNT2JaTnpyS010VEs=')
        // 转换为"播放源名称$播放地址"的格式
        .map(i => `${i.key}$${i.url}`);

    // 返回视频详情的JSON字符串
    return JSON.stringify({
        list: [{
            'vod_id': data.id.toString(),     // 视频ID（转换为字符串）
            'vod_name': data.name,            // 视频名称
            'vod_pic': data.pic,              // 视频封面图
            'vod_year': data.year,            // 上映年份
            'vod_area': data.area,            // 出品地区
            'vod_actor': data.actor,          // 演员列表
            'vod_director': data.director,    // 导演
            'vod_content': data.content,      // 剧情简介
            'vod_play_from': 'LiteApple',     // 播放源标识
            'vod_play_url': play_urls.join('#'), // 播放地址列表（用#分隔）
            'type_name': data.className,      // 视频分类名称
        }]
    });
}

/**
 * 播放地址解析函数
 * @param {string} flag - 播放源标识（此处未使用）
 * @param {string} vid - 播放地址/标识
 * @param {Object} flags - 播放源配置（此处未使用）
 * @returns {Promise<string>} - 返回包含播放信息的JSON字符串
 */
async function play(flag, vid, flags) {
    let parse = 0;              // 是否需要解析（0=不需要，1=需要）
    let url = '';               // 最终播放地址
    let playHeader = {};        // 播放请求头

    // 处理央视频播放地址
    if (vid.startsWith('JBN_')) {
        // 转换为央视频的网页地址
        url = 'https://www.yangshipin.cn/tv/home?pid=' + vid.substring(4);
        parse = 1;              // 需要解析网页获取真实播放地址
        // 设置PC端浏览器的User-Agent
        playHeader = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36' };
    }
    // 处理直接的HTTP播放地址
    else if (vid.toUpperCase().includes('HTTP')) {
        url = vid;              // 直接使用原始地址
    }
    // 处理m3u8播放地址
    else {
        // 构建m3u8播放地址
        url = 'http://s.xpgtv.net/m3u8/' + vid + '.m3u8';
        // 获取加密的请求头
        const hd = await getXpgHeaders();
        // 合并请求头并设置特定的播放器User-Agent
        playHeader = { ...hd, 'User-Agent': 'com.stub.StubApp/1.6.0 (Linux;Android 12) ExoPlayerLib/2.14.2' };
    }

    // 返回播放信息的JSON字符串
    return JSON.stringify({ jx: 0, parse: parse, url: url, header: playHeader });
}

/**
 * XPG加密算法实现 - 自定义的RC4变种加密
 * @param {string} dataStr - 需要加密的字符串
 * @returns {Uint8Array} - 加密后的字节数组
 */
function xpgCipher(dataStr) {
    // 将字符串转换为UTF-8字节数组
    const data = stringToUint8Array(dataStr);
    // 加密密钥（固定字符串）
    const key = stringToUint8Array('XPINGGUO');
    // 初始化S盒（扩展到333位，标准RC4是256位）
    const box = new Uint8Array(333);
    for (let i = 0; i < 333; i++) box[i] = i % 256;

    // S盒初始化置换
    let j = 0;
    for (let i = 0; i < 333; i++) {
        const k = key[i % key.length] & 0xFF;          // 取密钥字节（确保8位）
        j = (k + (box[i] & 0xFF) + j) % 333;           // 更新j值
        // 交换S盒中的字节
        const tmp = box[i];
        box[i] = box[j];
        box[j] = tmp;
    }

    // 加密数据
    const res = new Uint8Array(data.length);
    let i6 = 0;
    let i7 = 0;
    for (let i = 0; i < data.length; i++) {
        i6 = (i6 + 1) % 333;                           // 更新i6
        const b2 = box[i6];                            // 取S盒字节
        i7 = (i7 + (b2 & 0xFF)) % 333;                 // 更新i7
        // 交换S盒中的字节
        const tmp = box[i6];
        box[i6] = box[i7];
        box[i7] = tmp;
        // 计算加密字节的索引
        const idx = ((box[i6] & 0xFF) + (box[i7] & 0xFF)) % 333;
        // 与原始数据进行异或操作得到加密结果
        res[i] = box[idx] ^ data[i];
    }

    // 返回加密后的字节数组
    return res;
}

/**
 * 获取XPG加密的请求头
 * @returns {Promise<Object>} - 返回包含加密头信息的对象
 */
async function getXpgHeaders() {
    // 定义缓存键名
    const tokenParamKey = 'com.phoenix.tv_token_param';
    const token2Key = 'com.phoenix.tv_token2';

    // 从缓存获取tokenParam，不存在则生成
    let tokenParam = await local.get('cache', tokenParamKey);
    if (!tokenParam) {
        // 生成32位随机字符串并转换为base64
        const r32 = uint8ToBase64(stringToUint8Array(generateRand(32)));
        // 生成11位16进制随机字符串
        const r11 = generateRand(11, true);
        // 构建tokenParam字符串
        tokenParam = `${r32}||||${r11}||||unknown||xiaomi/b0q/b0q:12/V417IR/913:user/release-keys`;
        // 存入缓存
        await local.set('cache', tokenParamKey, tokenParam);
    }

    // 从缓存获取token2，不存在则生成
    let token2 = await local.get('cache', token2Key);
    if (!token2) {
        // 生成32位随机字符串并转换为base64
        const r32 = uint8ToBase64(stringToUint8Array(generateRand(32)));
        // 使用XPG算法加密
        token2 = xpgEncrypt(r32);
        // 存入缓存
        await local.set('cache', token2Key, token2);
    }

    // 生成时间戳（秒级）
    const timestamp = Math.floor(Date.now() / 1000).toString();
    // 版本信息
    const version = 'XPGBOX com.phoenix.tv1.6.0';

    // 返回完整的加密请求头
    return {
        ...headers,                                  // 继承基础请求头
        'token': xpgEncrypt(tokenParam),             // 加密的tokenParam
        'token2': token2,                            // 加密的token2
        'user_id': 'XPGBOX',                         // 用户ID标识
        'version': version,                          // 版本信息
        'timestamp': timestamp,                      // 时间戳
        'hash': md5Short(`${tokenParam}${version}${timestamp}`), // 短MD5校验
        'screenx': '1600',                           // 屏幕宽度
        'screeny': '900'                             // 屏幕高度
    };
}

/**
 * 数组转视频对象列表 - 统一视频数据格式
 * @param {Array} arr - 原始视频数据数组
 * @returns {Array} - 标准化的视频对象列表
 */
function arr2vods(arr) {
    const videos = [];
    // 确保输入是数组类型
    if (Array.isArray(arr)) {
        // 遍历原始数据
        for (const i of arr) {
            // 转换为统一格式的视频对象
            videos.push({
                'vod_id': i.id.toString(),    // 视频ID（转换为字符串）
                'vod_name': i.name,           // 视频名称
                'vod_pic': i.pic,             // 视频封面图
                'vod_remarks': i.updateInfo,  // 更新信息/备注
                'vod_year': i.year,           // 上映年份
                'vod_content': i.content      // 剧情简介
            });
        }
    }
    // 返回标准化的视频列表
    return videos;
}

/**
 * 字符串转Uint8Array - UTF-8编码
 * @param {string} str - 输入字符串
 * @returns {Uint8Array} - UTF-8编码的字节数组
 */
function stringToUint8Array(str) {
    const arr = [];
    // 遍历字符串的每个字符
    for (let i = 0; i < str.length; i++) {
        const code = str.charCodeAt(i);  // 获取字符的Unicode编码
        // ASCII字符（0-127）
        if (code < 0x80) arr.push(code);
        // 双字节UTF-8字符（128-2047）
        else if (code < 0x800) {
            arr.push(0xc0 | (code >> 6));
            arr.push(0x80 | (code & 0x3f));
        }
        // 三字节UTF-8字符（2048+）
        else {
            arr.push(0xe0 | (code >> 12));
            arr.push(0x80 | ((code >> 6) & 0x3f));
            arr.push(0x80 | (code & 0x3f));
        }
    }
    // 转换为Uint8Array类型
    return new Uint8Array(arr);
}

/**
 * Uint8Array转Base64字符串
 * @param {Uint8Array} uint8 - 字节数组
 * @returns {string} - Base64编码字符串
 */
function uint8ToBase64(uint8) {
    // 将Uint8Array转换为CryptoJS的WordArray
    const wordArray = Crypto.lib.WordArray.create(uint8);
    // 转换为Base64字符串
    return Crypto.enc.Base64.stringify(wordArray);
}

/**
 * 生成随机字符串
 * @param {number} len - 字符串长度
 * @param {boolean} isHex - 是否为16进制字符串（默认false）
 * @returns {string} - 随机字符串
 */
function generateRand(len, isHex = false) {
    // 定义字符集（16进制或字母数字）
    const chars = isHex ? '0123456789ABCDEF' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let res = '';
    // 生成指定长度的随机字符串
    for (let i = 0; i < len; i++) res += chars[_.random(0, chars.length - 1)];
    return res;
}

/**
 * XPG加密函数 - 字符串加密并转换为Base64
 * @param {string} s - 需要加密的字符串
 * @returns {string} - Base64编码的加密字符串
 */
function xpgEncrypt(s) {
    // 空值处理
    if (!s) return '';
    // 使用XPG算法加密
    const encrypted = xpgCipher(s);
    // 转换为Base64字符串
    return uint8ToBase64(encrypted);
}

/**
 * 短MD5生成函数 - 获取MD5的第8-11位字符
 * @param {string} s - 输入字符串
 * @returns {string} - 4位的短MD5字符串
 */
function md5Short(s) {
    // 获取完整的MD5值
    const full = md5X(s);
    // 返回第8到12位（共4位）
    return full.substring(8, 12);
}

/**
 * 导出函数 - 暴露脚本的核心功能接口
 * @returns {Object} - 包含所有核心函数的对象
 */
export function __jsEvalReturn() {
    return {
        init: init,         // 初始化
        home: home,         // 首页分类
        homeVod: homeVod,   // 首页视频
        category: category, // 分类视频
        search: search,     // 搜索
        detail: detail,     // 视频详情
        play: play          // 播放解析
    };
}