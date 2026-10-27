========================================
Form 54 · 翻译代理 · Vercel 版
========================================

部署完你会得到一个网址，像：
    https://form54-translate.vercel.app

这个网址只做一件事：替客户浏览器去调 FreeModel，
再把结果带 CORS 头返回。它不存任何东西。

最终客户拿到的还是那条：
    https://form54-translate.vercel.app/api/translate

⚠️ 先说风险
----------------------------------------
vercel.app 在中国大陆**时通时不通**。
你的客户在国内，如果打不开，AI 会自动退回本地词典，
表格照样能用、照样出 PDF，只是地址翻得没那么好。

**先测再决定**：部署完，用手机 4G（不要连 WiFi）
打开 https://你的域名/api/health
能看到 {"ready":true,...} 才说明国内能访问。
打不开就换阿里云，代码我已经写好了（见 Form54_Proxy）。


========================================
怎么部署
========================================

【方式一：命令行，最快】

如果你电脑装过 Node.js，打开「终端」，cd 到这个文件夹，执行：

    npx vercel

第一次会问几个问题：
  Set up and deploy?          → 回车（Yes）
  Which scope?                → 回车
  Link to existing project?   → 回车（No）
  What's your project's name? → 回车（默认）
  In which directory?         → 回车（默认 ./）
  Want to modify settings?    → 回车（No）

等十几秒，出来一个 https://xxx.vercel.app。

正式上线再执行一次：

    npx vercel --prod

【方式二：GitHub 导入】

1. 把本文件夹传到一个 GitHub 仓库
2. vercel.com 登录 → Add New → Project → 选那个仓库
3. Framework Preset 选 Other，其他不动，点 Deploy

【方式三：网页拖拽】
Vercel 新版后台已不保证支持拖拽上传，如果找不到入口就用方式一。


========================================
部署完怎么测
========================================

打开：

    https://你的域名/api/health

看到：

    {"ready":true,"ai":true,"service":"form54-translate"}

就成功了。


========================================
然后
========================================

把 https://你的域名/api/translate 这条发给我，
我把 AI 地址写进 ABC.html，测通后给你。

客户那边流程完全不变：下载 → 双击 → 填 → 生成。


========================================
文件说明
========================================

api/translate.js   翻译接口（POST）
api/health.js      健康检查（GET）
lib/prompt.js      翻译规则和 Key（第 2 行）
vercel.json        把函数超时放宽到 60 秒
package.json       声明

改 Key：lib/prompt.js 第 2 行，或者在 Vercel
后台 Settings → Environment Variables 加 FM_KEY，然后 Redeploy。


========================================
常见问题
========================================

Q: 为什么要把超时改成 60 秒？
A: Vercel 默认 10 秒，AI 翻译要 6~12 秒，不改会超时失败。
   vercel.json 里已经写好了，不用你动。

Q: 免费额度够吗？
A: Hobby 免费版每月 100GB 流量 + 100 万次调用，
   你几个人填表，用不到零头。

Q: 会暴露 Key 吗？
A: 不会。Key 只在服务端，浏览器拿不到。

Q: 客户信息会存吗？
A: 不存。函数只做转发，不写日志内容、不落库。
