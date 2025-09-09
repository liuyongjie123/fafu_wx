// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，开始加载知识产权数据');
    
    // 获取知识产权容器元素
    const iprContainer = document.querySelector('#ipr .grid');
    if (!iprContainer) {
        console.error('未找到知识产权容器元素');
        return;
    }
    
    console.log('已找到知识产权容器元素');
    
    // 清空现有内容（保留加载提示）
    iprContainer.innerHTML = '<p class="text-gray-500 col-span-full">加载知识产权数据中...</p>';
    
        // 使用fetch API从本地ipr.json文件加载数据，避免CORS问题
    // 添加时间戳以避免缓存问题
    fetch('src/jsons/ipr.json?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应错误: ' + response.status);
            }
            return response.json();
        })
        .then(iprs => {
            console.log('成功获取知识产权数据，共', iprs.length, '项');
            
            // 清空容器
            iprContainer.innerHTML = '';
        
        // 遍历知识产权数据，创建卡片
        iprs.forEach(ipr => {
            // 创建知识产权卡片元素
            const card = document.createElement('div');
            card.className = 'research-card card p-6';
            
            // 构建卡片内容，保持与原始HTML一致的结构
            let cardContent = `
                <h3 class="font-bold text-xl mb-2">${ipr.title}</h3>
                <p class="text-sm text-gray-600 mb-2"><i class="fas fa-user mr-2"></i>${ipr.authors}</p>
                <p class="text-sm text-gray-600 mb-3"><i class="fas fa-calendar mr-2"></i>${ipr.date}</p>
                <p class="mb-4 line-clamp-3">${ipr.description}</p>
                <div class="flex flex-wrap">`;
            
            // 添加标签
            if (ipr.tags && ipr.tags.length > 0) {
                ipr.tags.forEach(tag => {
                    cardContent += `<span class="skill-tag ${tag.color}">${tag.text}</span>`;
                });
            }
            
            // 完成卡片内容
            cardContent += `
                </div>`;
            
            // 设置卡片内容
            card.innerHTML = cardContent;
            
            // 添加到容器
            iprContainer.appendChild(card);
        });
        
        console.log('所有知识产权卡片已创建完成');
    })
    .catch(error => {
        console.error('加载知识产权数据失败:', error);
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
        iprContainer.innerHTML = '<p class="text-red-500 col-span-full">加载知识产权数据失败</p>';
    });
});