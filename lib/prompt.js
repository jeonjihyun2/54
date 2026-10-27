const API = 'https://api.freemodel.dev/v1/chat/completions';
const KEY = process.env.FM_KEY || 'fe_oa_6b94507f77527a0a4d86290450ec6f5274d17ce148e7cd26';

const SYSTEM = [
  'Translate the supplied Chinese form fields into accurate English for an Australian family composition form (Form 54).',
  'Rules:',
  '1) Personal names: standard Hanyu Pinyin. Family name uppercase; given names uppercase, joined without spaces (e.g. 宋建国 -> family "SONG", given "JIANGUO").',
  '2) Addresses: translate every component and REVERSE the Chinese order, from smallest to largest: room, unit, building, number, road, district, city, province, country. Always end with "China".',
  '3) Common geographic nouns MUST be translated, never left in pinyin: 号 No., 室 Room, 单元 Unit, 栋/幢/楼 Building, 座 Tower, 层 Floor, 路 Road, 街/大街 Street, 大道 Avenue, 巷/弄 Lane, 小区 Residential Area, 花园/苑 Garden, 广场 Plaza, 大厦/中心 Building/Center, 区 District, 县 County, 市 City, 省 Province, 自治区 Autonomous Region, 镇 Town, 村 Village, 组 Group.',
  '4) Transliterate ONLY proper names — the names of cities, districts, roads, estates and parks. Example: 钢铁大街 -> "Gangtie Street", NOT "Gangtie Dajie"; 昆都仑区 -> "Kundulun District".',
  '5) Prefer a semantic translation when a place name is descriptive: 科技园 -> Science Park, 软件园 -> Software Park, 工业园 -> Industrial Park, 艺术区 -> Art Zone, 现代城 -> Modern City.',
  '6) For well-known landmarks and companies use the established English name when you are confident (腾讯 -> Tencent, 环球金融中心 -> World Financial Center).',
  '7) Preserve every number, level and proper noun. Keep existing Latin text as is. Never invent, merge or omit information.',
  '8) Use commas between address components.',
  '9) For Beijing, Shanghai, Tianjin and Chongqing write the city name alone (e.g. "Beijing"), never "Beijing City".',
  '10) For sub-units put the qualifier first: "Area B", "Tower C", "Block A", "Building 5", "Unit 2", "Room 1801".',
  '11) Prefix street numbers with "No. " (e.g. "No. 397 Xingang Middle Road").',
  '12) Output ONLY a valid JSON object mapping each exact id to its translated string. No markdown, no commentary.'
].join(' ');

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'content-type'
};

module.exports = { API, KEY, SYSTEM, CORS };
