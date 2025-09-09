document.addEventListener('DOMContentLoaded', function() {
  // 获取团队容器
  const teamContainer = document.querySelector('#team .card');
  
  if (!teamContainer) {
    console.error('团队容器未找到');
    return;
  }

  // 创建加载状态
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.textContent = '加载中...';
  teamContainer.appendChild(loadingElement);

  // 从JSON文件加载数据
  fetch('src/jsons/team.json?t=' + new Date().getTime())
    .then(response => {
      if (!response.ok) {
        throw new Error('网络响应错误: ' + response.status);
      }
      return response.json();
    })
    .then(data => {
      // 移除加载状态
      loadingElement.remove();
      
      // 清空容器
      teamContainer.innerHTML = '';
      
      // 渲染团队内容
      renderTeamContent(teamContainer, data);
      
      // 初始化轮播功能
      initCarousel();
    })
    .catch(error => {
      console.error('加载团队数据失败:', error);
      loadingElement.textContent = '加载失败，请刷新页面重试';
    });
});

// 渲染团队内容
function renderTeamContent(container, data) {
  // 创建标题
  const titleElement = document.createElement('h1');
  titleElement.className = 'text-4xl font-bold mb-6 gradient-text';
  titleElement.textContent = data.title;
  container.appendChild(titleElement);
  
  // 创建内容区域
  const contentDiv = document.createElement('div');
  contentDiv.className = 'mb-10';
  container.appendChild(contentDiv);
  
  // 创建团队介绍
  const introHeader = document.createElement('h2');
  introHeader.className = 'text-2xl font-bold mb-6';
  introHeader.textContent = data.introduction.subtitle;
  contentDiv.appendChild(introHeader);
  
  const introParagraph = document.createElement('p');
  introParagraph.className = 'mb-8';
  introParagraph.textContent = data.introduction.content;
  contentDiv.appendChild(introParagraph);
  
  // 创建轮播图
  createCarousel(contentDiv, data.carousel.photos);
  
  // 创建成员网格
  createMembersGrid(contentDiv, data.members);
}

// 创建轮播图
function createCarousel(container, photos) {
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'team-carousel relative mb-8';
  container.appendChild(carouselWrapper);
  
  const overflowWrapper = document.createElement('div');
  overflowWrapper.className = 'relative overflow-hidden rounded-lg';
  carouselWrapper.appendChild(overflowWrapper);
  
  const slidesContainer = document.createElement('div');
  slidesContainer.className = 'flex transition-transform duration-300 ease-in-out';
  slidesContainer.id = 'team-carousel-slides';
  overflowWrapper.appendChild(slidesContainer);
  
  // 添加轮播图片
  photos.forEach((photo, index) => {
    const slide = document.createElement('div');
    slide.className = 'w-full flex-shrink-0';
    
    const img = document.createElement('img');
    img.src = photo.src;
    img.alt = photo.alt;
    img.className = 'team-photo';
    
    slide.appendChild(img);
    slidesContainer.appendChild(slide);
  });
  
  // 添加控制按钮
  const prevBtn = document.createElement('button');
  prevBtn.className = 'carousel-control absolute left-4 top-1/2 -translate-y-1/2';
  prevBtn.id = 'prev-btn';
  prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
  carouselWrapper.appendChild(prevBtn);
  
  const nextBtn = document.createElement('button');
  nextBtn.className = 'carousel-control absolute right-4 top-1/2 -translate-y-1/2';
  nextBtn.id = 'next-btn';
  nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
  carouselWrapper.appendChild(nextBtn);
  
  // 添加指示器
  const indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'flex justify-center mt-4';
  indicatorsContainer.id = 'carousel-indicators';
  carouselWrapper.appendChild(indicatorsContainer);
  
  photos.forEach((_, index) => {
    const indicator = document.createElement('div');
    indicator.className = `carousel-indicator ${index === 0 ? 'active' : ''}`;
    indicator.dataset.index = index;
    indicatorsContainer.appendChild(indicator);
  });
}

// 创建成员网格
function createMembersGrid(container, members) {
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
  container.appendChild(gridContainer);
  
  members.forEach((member, index) => {
    // 创建成员卡片
    const memberCard = document.createElement('div');
    memberCard.className = 'card p-6 text-center fadeInUp';
    memberCard.style.animationDelay = `${index * 100}ms`;
    
    // 先检查是否有头像URL，如果有就尝试显示图片，图片加载失败时回退到显示首字母
    if (member.avatar) {
      // 创建图片元素
      const avatarImg = document.createElement('img');
      avatarImg.src = member.avatar;
      avatarImg.alt = member.name;
      avatarImg.className = 'w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-green-500';
      
      // 添加图片加载失败事件处理
      avatarImg.onerror = function() {
        // 移除失败的图片元素
        this.remove();
        
        // 创建首字母头像
        const avatarContainer = document.createElement('div');
        avatarContainer.className = 'w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-4xl mx-auto mb-4 font-bold';
        
        // 获取姓名首字母
        const firstNameChar = member.name.charAt(0).toUpperCase();
        avatarContainer.textContent = firstNameChar;
        
        memberCard.prepend(avatarContainer);
      };
      
      memberCard.appendChild(avatarImg);
    } else {
      // 使用成员姓名首字母作为头像
      const avatarContainer = document.createElement('div');
      avatarContainer.className = 'w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white text-4xl mx-auto mb-4 font-bold';
      
      // 获取姓名首字母
      const firstNameChar = member.name.charAt(0).toUpperCase();
      avatarContainer.textContent = firstNameChar;
      
      memberCard.appendChild(avatarContainer);
    }
    
    // 添加成员姓名
    const nameElement = document.createElement('h3');
    nameElement.className = 'text-xl font-semibold';
    nameElement.textContent = member.name;
    memberCard.appendChild(nameElement);
    
    // 添加职位
    const positionElement = document.createElement('p');
    positionElement.className = 'text-green-600 mb-3';
    positionElement.textContent = member.position;
    memberCard.appendChild(positionElement);
    
    // 添加描述
    const descElement = document.createElement('p');
    descElement.className = 'text-sm mb-4';
    descElement.textContent = member.description;
    memberCard.appendChild(descElement);
    
    // 添加社交链接
    const socialContainer = document.createElement('div');
    socialContainer.className = 'flex justify-center space-x-3';
    
    const linkedinLink = document.createElement('a');
    linkedinLink.href = member.social.linkedin;
    linkedinLink.className = 'text-green-600 hover:text-green-800';
    linkedinLink.innerHTML = '<i class="fab fa-linkedin"></i>';
    
    const emailLink = document.createElement('a');
    emailLink.href = member.social.email;
    emailLink.className = 'text-green-600 hover:text-green-800';
    emailLink.innerHTML = '<i class="fas fa-envelope"></i>';
    
    socialContainer.appendChild(linkedinLink);
    socialContainer.appendChild(emailLink);
    memberCard.appendChild(socialContainer);
    
    // 添加到网格
    gridContainer.appendChild(memberCard);
    
    // 添加hover效果
    memberCard.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
      this.style.transition = 'all 0.3s ease';
    });
    
    memberCard.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = 'none';
    });
  });
}

// 初始化轮播功能
function initCarousel() {
  const slidesContainer = document.getElementById('team-carousel-slides');
  const slides = slidesContainer.querySelectorAll('.w-full');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const indicators = document.querySelectorAll('.carousel-indicator');
  
  let currentIndex = 0;
  const totalSlides = slides.length;
  
  // 克隆第一张和最后一张幻灯片用于无限制轮播
  const firstSlideClone = slides[0].cloneNode(true);
  const lastSlideClone = slides[totalSlides - 1].cloneNode(true);
  
  // 添加克隆的幻灯片
  slidesContainer.appendChild(firstSlideClone);
  slidesContainer.insertBefore(lastSlideClone, slides[0]);
  
  // 更新总幻灯片数量（包括克隆的）
  const slidesWithClones = slidesContainer.querySelectorAll('.w-full');
  const totalSlidesWithClones = slidesWithClones.length;
  
  // 初始位置（从克隆的最后一张开始）
  slidesContainer.style.transform = `translateX(-100%)`;
  
  // 更新指示器状态
  function updateIndicators() {
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }
  
  // 移动到指定幻灯片
  function moveToSlide(index) {
    currentIndex = index;
    slidesContainer.style.transform = `translateX(-${(currentIndex + 1) * 100}%)`;
    updateIndicators();
  }
  
  // 上一张幻灯片
  prevBtn.addEventListener('click', function() {
    slidesContainer.style.transition = 'transform 0.3s ease-in-out';
    
    if (currentIndex === 0) {
      // 如果是第一张，先移动到克隆的第一张
      moveToSlide(totalSlides - 1);
      
      // 然后无缝切换到实际的最后一张
      setTimeout(() => {
        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(-${totalSlides * 100}%)`;
      }, 300);
    } else {
      moveToSlide(currentIndex - 1);
    }
  });
  
  // 下一张幻灯片
  nextBtn.addEventListener('click', function() {
    slidesContainer.style.transition = 'transform 0.3s ease-in-out';
    
    if (currentIndex === totalSlides - 1) {
      // 如果是最后一张，先移动到克隆的最后一张
      moveToSlide(0);
      
      // 然后无缝切换到实际的第一张
      setTimeout(() => {
        slidesContainer.style.transition = 'none';
        slidesContainer.style.transform = `translateX(-100%)`;
      }, 300);
    } else {
      moveToSlide(currentIndex + 1);
    }
  });
  
  // 点击指示器切换幻灯片
  indicators.forEach(indicator => {
    indicator.addEventListener('click', function() {
      const index = parseInt(this.dataset.index);
      slidesContainer.style.transition = 'transform 0.3s ease-in-out';
      moveToSlide(index);
    });
  });
  
  // 自动轮播
  let autoplayInterval = setInterval(() => {
    nextBtn.click();
  }, 5000);
  
  // 鼠标悬停时暂停自动轮播
  const carousel = document.querySelector('.team-carousel');
  carousel.addEventListener('mouseenter', function() {
    clearInterval(autoplayInterval);
  });
  
  // 鼠标离开时恢复自动轮播
  carousel.addEventListener('mouseleave', function() {
    autoplayInterval = setInterval(() => {
      nextBtn.click();
    }, 5000);
  });
}