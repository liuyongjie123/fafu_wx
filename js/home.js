
// 波浪动画
class WaveAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.points = [];
        this.resize();
        this.init();
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = 150;
        this.init();
    }

    init() {
        this.points = [];
        const segmentWidth = 20;
        const count = Math.ceil(this.width / segmentWidth) + 1;

        for (let i = 0; i < count; i++) {
            this.points.push({
                x: i * segmentWidth,
                y: this.height / 2,
                originY: this.height / 2,
                speed: 0.05, // 波浪速度
                time: Math.random() * 100
            });
        }
    }

    update() {
        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            point.time += point.speed;
            point.y = point.originY + Math.sin(point.time) * 30;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 创建渐变
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#E8F4E0');
        gradient.addColorStop(1, '#CCE6C6');

        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);

        for (let i = 0; i < this.points.length; i++) {
            const point = this.points[i];
            const nextPoint = this.points[i + 1];

            if (nextPoint) {
                const cpx = (point.x + nextPoint.x) / 2;
                const cpy = (point.y + nextPoint.y) / 2;
                this.ctx.quadraticCurveTo(point.x, point.y, cpx, cpy);
            } else {
                this.ctx.lineTo(point.x, point.y);
            }
        }

        this.ctx.lineTo(this.width, this.height);
        this.ctx.lineTo(0, this.height);
        this.ctx.fill();
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }
}

// 粒子动画
class ParticleAnimation {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 0;
        this.height = 0;
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 100 };
        this.resize();
        this.init();
        window.addEventListener('resize', this.resize.bind(this));
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    resize() {
        this.width = this.canvas.width = window.innerWidth;
        this.height = this.canvas.height = window.innerHeight;
        this.init();
    }

    init() {
        this.particles = [];
        const particleCount = Math.floor(this.width * this.height / 10000);

        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 2 + 1;
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: size,
                baseSize: size,
                speedX: (Math.random() * 2 - 1) * 0.5, // 减慢网格粒子水平速度
                speedY: (Math.random() * 2 - 1) * 0.5, // 减慢网格粒子垂直速度
                color: `rgba(58, 157, 35, ${Math.random() * 0.5 + 0.1})`
            });
        }
    }

    update() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];

            // 边界检查
            if (p.x < 0 || p.x > this.width) p.speedX = -p.speedX;
            if (p.y < 0 || p.y > this.height) p.speedY = -p.speedY;

            // 鼠标交互
            if (this.mouse.x && this.mouse.y) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (this.mouse.radius - distance) / this.mouse.radius;
                    const direction = 1;

                    p.x -= forceDirectionX * force * direction * 5;
                    p.y -= forceDirectionY * force * direction * 5;

                    p.size = p.baseSize + 2;
                } else {
                    p.size = Math.max(p.baseSize, p.size - 0.1);
                }
            }

            p.x += p.speedX;
            p.y += p.speedY;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // 绘制粒子
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
        }

        // 绘制连线
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const p1 = this.particles[i];
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(58, 157, 35, ${1 - distance / 100})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.update();
        this.draw();
        requestAnimationFrame(this.animate.bind(this));
    }
}



// 导航栏滚动效果
function setupNavScroll() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    function updateActiveNav() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            window.scrollTo({
                top: targetSection.offsetTop,
                behavior: 'smooth'
            });

            // 更新导航状态
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');

            // 关闭移动端菜单
            document.getElementById('mobile-menu').classList.remove('open');
        });
    });

    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
}

// 视差效果
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.parallax');

    window.addEventListener('scroll', function () {
        const scrollPosition = window.scrollY;

        parallaxElements.forEach(element => {
            const speed = parseFloat(element.getAttribute('data-speed')) || 0.3;
            const yPos = scrollPosition * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// 移动端菜单
function setupMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    menuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('open');
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', function () {
    const waveCanvas = document.getElementById('waveCanvas');
    const particlesCanvas = document.getElementById('particlesCanvas');

    const waveAnimation = new WaveAnimation(waveCanvas);
    const particleAnimation = new ParticleAnimation(particlesCanvas);

    waveAnimation.animate();
    particleAnimation.animate();

    setupNavScroll();
    setupParallax();
    setupMobileMenu();
});