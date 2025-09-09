// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM已加载，开始加载论文数据');
    
    // 获取论文容器元素
    const papersContainer = document.querySelector('#research .space-y-6');
    if (!papersContainer) {
        console.error('未找到论文容器元素');
        return;
    }
    
    console.log('已找到论文容器元素');
    
    // 清空现有内容（保留加载提示）
    papersContainer.innerHTML = '<p class="text-gray-500">加载论文数据中...</p>';
    
        // 使用fetch API从本地papers.json文件加载数据，避免CORS问题
    // 添加时间戳以避免缓存问题
    fetch('src/jsons/papers.json?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应错误: ' + response.status);
            }
            return response.json();
        })
        .then(papers => {
            console.log('成功获取论文数据，共', papers.length, '篇论文');
            
            // 清空容器
            papersContainer.innerHTML = '';
        
        // 遍历论文数据，创建论文卡片
        papers.forEach(paper => {
            // 创建论文卡片元素
            const card = document.createElement('div');
            card.className = 'research-card card p-6';
            
            // 构建卡片内容，保持与原始HTML一致的结构
            let cardContent = `
                <a href="${paper.link}" target="_blank" rel="noopener noreferrer" class="block w-full h-full">
                    <div class="paper-container">
                        <img src="${paper.image}" alt="${paper.title}" class="paper-image">
                        <div>
                            <h3 class="font-bold text-xl mb-2">${paper.title}</h3>
                            <p class="author-info text-sm text-gray-700 mb-2">${paper.authors}</p>
                            <p class="text-sm text-gray-600 mb-3"><i class="fas fa-book mr-2"></i>${paper.journal}</p>
                            <div class="paper-content">
                                ${paper.abstract}
                            </div>
                        </div>
                    </div>
                    <div class="flex flex-wrap mt-4">`;
            
            // 添加标签，使用原始的标签样式类名
            if (paper.tags && paper.tags.length > 0) {
                paper.tags.forEach(tag => {
                    // 将颜色映射到原始的标签类名
                    const tagClass = tag.color;
                    
                    cardContent += `<span class="skill-tag ${tagClass}">${tag.text}</span>`;
                });
            }
            
            // 完成卡片内容
            cardContent += `
                    </div>
                </a>`;
            
            // 设置卡片内容
            card.innerHTML = cardContent;
            
            // 添加到容器
            papersContainer.appendChild(card);
        });
        
        console.log('所有论文卡片已创建完成');
    })
    .catch(error => {
        console.error('加载论文数据失败:', error);
        console.error('错误详情:', error.message);
        console.error('错误堆栈:', error.stack);
        papersContainer.innerHTML = '<p class="text-red-500">加载论文数据失败</p>';
    });
});