document.addEventListener('DOMContentLoaded', function() {
  // 获取个人主页容器
  const homeContainer = document.querySelector('#home .card');
  
  if (!homeContainer) {
    console.error('个人主页容器未找到');
    return;
  }

  // 创建加载状态
  const loadingElement = document.createElement('div');
  loadingElement.className = 'loading';
  loadingElement.textContent = '加载中...';
  homeContainer.appendChild(loadingElement);

  // 从JSON文件加载数据
  fetch('src/jsons/profile.json?t=' + new Date().getTime())
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
      homeContainer.innerHTML = '';
      
      // 渲染个人主页内容
      renderProfileContent(homeContainer, data);
    })
    .catch(error => {
      console.error('加载个人数据失败:', error);
      loadingElement.textContent = '加载失败，请刷新页面重试';
    });
});

// 渲染个人主页内容
function renderProfileContent(container, data) {
  // 创建顶部部分
  const topSection = document.createElement('div');
  topSection.className = 'flex flex-col md:flex-row justify-between items-center mb-8 gap-4 opacity-0 transition-opacity duration-700';
  
  // 添加姓名标题
  const nameTitle = document.createElement('h1');
  nameTitle.className = 'text-4xl md:text-5xl font-bold gradient-text';
  nameTitle.textContent = data.name;
  topSection.appendChild(nameTitle);
  
  // 添加学校信息
  const universityInfo = document.createElement('div');
  universityInfo.className = 'flex items-center';
  
  const logoDiv = document.createElement('div');
  logoDiv.className = 'university-logo';
  
  const logoImg = document.createElement('img');
  logoImg.src = data.images.university_logo;
  logoImg.alt = '学校logo';
  logoImg.className = 'w-12 h-12 object-contain';
  logoDiv.appendChild(logoImg);
  
  const universityName = document.createElement('p');
  universityName.className = 'text-sm font-semibold text-gray-700';
  universityName.textContent = data.university;
  
  universityInfo.appendChild(logoDiv);
  universityInfo.appendChild(universityName);
  topSection.appendChild(universityInfo);
  
  container.appendChild(topSection);
  
  // 创建主要内容部分
  const mainContent = document.createElement('div');
  mainContent.className = 'flex flex-col md:flex-row gap-8 opacity-0 transition-opacity duration-700 delay-200';
  
  // 添加个人照片
  const photoSection = document.createElement('div');
  photoSection.className = 'w-full md:w-1/3 flex flex-col items-center';
  
  const profilePhoto = document.createElement('img');
  profilePhoto.src = data.images.profile_zjz;
  profilePhoto.alt = '个人证件照';
  profilePhoto.className = 'profile-photo w-full mx-auto rounded-xl shadow-lg border-4 border-white transform hover:scale-105 transition-all duration-300';
  
  photoSection.appendChild(profilePhoto);
  
  // 添加占位照片
  const placeholderPhoto = document.createElement('img');
  placeholderPhoto.src = data.images.profile;
  placeholderPhoto.alt = '个人照片';
  placeholderPhoto.className = 'profile-photo w-full max-w-[300px] rounded-xl shadow-lg border-4 border-white transform hover:scale-105 transition-all duration-300 mt-4';
  
  photoSection.appendChild(placeholderPhoto);
  mainContent.appendChild(photoSection);
  
  // 添加左侧列（个人简介和联系方式）
  const leftColumn = document.createElement('div');
  leftColumn.className = 'w-full md:w-1/3 flex flex-col gap-6';
  
  // 添加个人简介
  const bioSection = document.createElement('div');
  bioSection.className = 'w-full bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300';
  
  const bioTitle = document.createElement('h2');
  bioTitle.className = 'text-2xl font-bold mb-4 flex items-center gap-2';
  bioTitle.innerHTML = '<i class="fas fa-user-circle text-green-600"></i> 个人简介';
  
  const titlePara = document.createElement('p');
  titlePara.className = 'mb-2 text-lg text-gray-800 font-medium';
  titlePara.textContent = data.title;
  
  const birthdayPara = document.createElement('p');
  birthdayPara.className = 'mb-3 text-gray-700 bg-green-50 p-2 rounded-md';
  birthdayPara.innerHTML = '<i class="fas fa-calendar-alt mr-2 text-green-600"></i> ' + data.birthday;
  
  const introPara = document.createElement('p');
  introPara.className = 'mb-2 text-gray-700 leading-relaxed';
  introPara.textContent = data.introduction;
  
  bioSection.appendChild(bioTitle);
  bioSection.appendChild(titlePara);
  bioSection.appendChild(birthdayPara);
  bioSection.appendChild(introPara);
  
  // 联系方式
  const contactDiv = document.createElement('div');
  contactDiv.className = 'w-full bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300';
  
  const contactTitle = document.createElement('h3');
  contactTitle.className = 'font-bold text-xl mb-3 flex items-center gap-2';
  contactTitle.innerHTML = '<i class="fas fa-envelope-open-text text-green-600"></i> 联系方式';
  
  const emailPara = document.createElement('p');
  emailPara.className = 'mb-2 transition-all duration-200 hover:text-green-600';
  emailPara.innerHTML = '<i class="fas fa-envelope mr-2 text-green-600"></i> ' + data.contact.email;
  
  const phonePara = document.createElement('p');
  phonePara.className = 'transition-all duration-200 hover:text-green-600';
  phonePara.innerHTML = '<i class="fas fa-phone mr-2 text-green-600"></i> ' + data.contact.phone;
  
  contactDiv.appendChild(contactTitle);
  contactDiv.appendChild(emailPara);
  contactDiv.appendChild(phonePara);
  
  // 添加到左侧列
  leftColumn.appendChild(bioSection);
  leftColumn.appendChild(contactDiv);
  
  // 添加右侧列（教育背景和研究方向）
  const rightColumn = document.createElement('div');
  rightColumn.className = 'w-full md:w-1/3 flex flex-col gap-6';
  
  // 教育背景
  const educationDiv = document.createElement('div');
  educationDiv.className = 'w-full bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300';
  
  const educationTitle = document.createElement('h3');
  educationTitle.className = 'font-bold text-xl mb-3 flex items-center gap-2';
  educationTitle.innerHTML = '<i class="fas fa-graduation-cap text-green-600"></i> 教育背景';
  
  const degreePara = document.createElement('p');
  degreePara.className = 'mb-2 transition-all duration-200 hover:text-green-600';
  degreePara.innerHTML = '<i class="fas fa-graduation-cap mr-2 text-green-600"></i> ' + data.education.degree;
  
  const universityPara = document.createElement('p');
  universityPara.className = 'transition-all duration-200 hover:text-green-600';
  universityPara.innerHTML = '<i class="fas fa-university mr-2 text-green-600"></i> ' + data.education.university;
  
  educationDiv.appendChild(educationTitle);
  educationDiv.appendChild(degreePara);
  educationDiv.appendChild(universityPara);
  
  // 研究方向
  const researchDiv = document.createElement('div');
  researchDiv.className = 'w-full bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow duration-300';
  
  const researchTitle = document.createElement('h3');
  researchTitle.className = 'font-bold text-xl mb-4 flex items-center gap-2';
  researchTitle.innerHTML = '<i class="fas fa-flask text-green-600"></i> 研究方向';
  
  const researchTagsDiv = document.createElement('div');
  researchTagsDiv.style.display = 'flex';
  researchTagsDiv.style.flexDirection = 'column';
  
  data.research_areas.forEach(area => {
    const tagSpan = document.createElement('span');
    tagSpan.className = 'skill-tag ' + area.tag + ' mb-2 inline-block';
    // 每个标签占一行
    tagSpan.style.display = 'inline-block';
    tagSpan.style.width = '100%';
    tagSpan.style.textAlign = 'center';
    tagSpan.textContent = area.name;
    // 添加悬停动画
    tagSpan.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
    });
    tagSpan.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.boxShadow = 'none';
    });
    researchTagsDiv.appendChild(tagSpan);
  });
  
  researchDiv.appendChild(researchTitle);
  researchDiv.appendChild(researchTagsDiv);
  
  // 添加到右侧列
  rightColumn.appendChild(educationDiv);
  rightColumn.appendChild(researchDiv);
  
  // 将左右两列添加到主内容
  mainContent.appendChild(leftColumn);
  mainContent.appendChild(rightColumn);
  
  container.appendChild(mainContent);
  
  // 添加动画效果
  setTimeout(() => {
    topSection.style.opacity = '1';
  }, 100);
  
  setTimeout(() => {
    mainContent.style.opacity = '1';
  }, 300);
}