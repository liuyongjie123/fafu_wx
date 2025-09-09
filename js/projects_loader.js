document.addEventListener('DOMContentLoaded', function() {
    // 获取科研项目容器
    const projectsContainer = document.getElementById('projects-container');
    
    if (!projectsContainer) {
        console.error('Projects container not found');
        return;
    }
    
    // 添加加载中状态
    projectsContainer.innerHTML = '<div class="text-center py-8"><i class="fas fa-spinner fa-spin text-3xl text-green-600"></i><p class="mt-2">加载中...</p></div>';
    
    // 请求科研项目数据，添加时间戳防止缓存
    const timestamp = new Date().getTime();
    fetch(`src/jsons/projects.json?t=${timestamp}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(projects => {
            // 清空容器
            projectsContainer.innerHTML = '';
            
            // 创建项目网格容器
            const projectsGrid = document.createElement('div');
            projectsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
            
            // 遍历项目数据创建卡片
            projects.forEach((project, index) => {
                // 创建项目卡片
                const projectCard = document.createElement('div');
                projectCard.className = 'research-card card p-6 opacity-0 transform translate-y-4 transition-all duration-500 ease-out';
                projectCard.setAttribute('data-aos', 'fade-up');
                
                // 设置延迟动画，使卡片逐个显示
                projectCard.style.transitionDelay = `${index * 100}ms`;
                
                // 卡片内容
                projectCard.innerHTML = `
                    <h3 class="font-bold text-xl mb-2">${project.title}</h3>
                    ${project.subtitle ? `<p class="text-sm text-gray-600 mb-2">${project.subtitle}</p>` : ''}
                    ${project.grantNumber ? `<p class="text-sm text-gray-600 mb-1"><i class="fas fa-hashtag mr-2"></i> 项目编号: ${project.grantNumber}</p>` : ''}
                    ${project.period ? `<p class="text-sm text-gray-600 mb-1"><i class="fas fa-calendar mr-2"></i> 执行期: ${project.period}</p>` : ''}
                    <p class="text-sm text-gray-600 mb-3"><i class="fas fa-money-bill-wave mr-2"></i> 资助金额: ${project.funding}</p>
                    <p class="text-sm font-medium text-green-700 mb-4"><i class="fas fa-user-tie mr-2"></i> 角色: ${project.role}</p>
                    <div class="flex flex-wrap">
                        ${project.tags.map(tag => `
                            <span class="skill-tag ${tag.color}">${tag.text}</span>
                        `).join('')}
                    </div>
                `;
                
                projectsGrid.appendChild(projectCard);
                
                // 添加悬停动画效果
                projectCard.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px)';
                    this.style.boxShadow = '0 14px 28px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.08)';
                });
                
                projectCard.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
                });
            });
            
            projectsContainer.appendChild(projectsGrid);
            
            // 触发动画显示
            setTimeout(() => {
                const cards = document.querySelectorAll('.research-card');
                cards.forEach(card => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                });
            }, 100);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            projectsContainer.innerHTML = '<div class="text-center py-8"><p class="text-red-600">加载项目数据失败，请稍后重试。</p></div>';
        });
});