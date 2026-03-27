const CACHE_NAME = 'stardew-v2';

// 监听安装，只缓存基础文件
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(['./', './index.html', './manifest.json']);
        })
    );
});

// 核心逻辑：拦截请求，如果有缓存就用缓存，没有就联网下载并存入缓存
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    // 如果请求的是图片，就把图片存进缓存，下次刷新就有图了
                    if (e.request.url.includes('.png')) {
                        cache.put(e.request, fetchResponse.clone());
                    }
                    return fetchResponse;
                });
            });
        })
    );
});