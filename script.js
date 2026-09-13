const models = {
  pro: {
    type: 'FLAGSHIP MODEL', name: 'Soul-G Pro',
    description: '복잡한 문제를 깊이 있게 분석하고, 긴 문맥에서도 정확한 답을 찾아냅니다. 전략 수립, 데이터 해석, 전문 문서 작성에 최적화된 플래그십 모델입니다.',
    features: ['고난도 논리 추론', '180K 장문 컨텍스트', '도구 연동 및 에이전트'],
    reasoning: '98.4', context: '180K', speed: '65'
  },
  lite: {
    type: 'FAST & EFFICIENT', name: 'Soul-G Lite',
    description: '빠른 응답과 합리적인 비용을 모두 갖춘 경량 모델입니다. 고객 상담, 콘텐츠 분류, 실시간 서비스처럼 대규모 요청을 안정적으로 처리합니다.',
    features: ['초저지연 실시간 응답', '비용 효율적 운영', '대규모 동시 요청'],
    reasoning: '91.2', context: '64K', speed: '140'
  },
  vision: {
    type: 'MULTIMODAL MODEL', name: 'Soul-G Vision',
    description: '텍스트와 이미지를 함께 이해하는 멀티모달 모델입니다. 문서, 차트, 제품 이미지와 화면을 분석해 새로운 인사이트를 대화로 전달합니다.',
    features: ['이미지·문서 분석', '차트 및 화면 이해', '시각 기반 질의응답'],
    reasoning: '95.7', context: '128K', speed: '82'
  }
};

const tabs = document.querySelectorAll('.model-tab');
const panel = document.querySelector('#modelPanel');

tabs.forEach((tab) => tab.addEventListener('click', () => {
  const data = models[tab.dataset.model];
  tabs.forEach((item) => { item.classList.remove('active'); item.setAttribute('aria-selected', 'false'); });
  tab.classList.add('active');
  tab.setAttribute('aria-selected', 'true');
  panel.animate([{ opacity: .35, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 330, easing: 'ease-out' });
  document.querySelector('#modelType').textContent = data.type;
  document.querySelector('#modelName').textContent = data.name;
  document.querySelector('#modelDescription').textContent = data.description;
  document.querySelector('#modelFeatures').innerHTML = data.features.map((feature) => `<li><span>✓</span>${feature}</li>`).join('');
  document.querySelector('#reasoningValue').textContent = data.reasoning;
  document.querySelector('#reasoningMeter').style.width = `${data.reasoning}%`;
  document.querySelector('#contextValue').textContent = data.context;
  document.querySelector('#speedValue').innerHTML = `${data.speed} <small>tokens/sec</small>`;
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 2) * 70}ms`;
  observer.observe(element);
});

const message = '네. 만족도 상승 요인 3가지와 개선이 필요한 접점을 찾았어요.';
const typingTarget = document.querySelector('#typingText');
let typeIndex = 0;
function typeMessage() {
  if (typeIndex <= message.length) {
    typingTarget.textContent = message.slice(0, typeIndex++);
    setTimeout(typeMessage, typeIndex < 8 ? 85 : 42);
  }
}
setTimeout(typeMessage, 700);

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
menuButton.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false');
}));

const modal = document.querySelector('#demoModal');
const demoButton = document.querySelector('#demoButton');
const progress = document.querySelector('#demoProgress');
const caption = document.querySelector('#demoCaption');
let demoTimer;
demoButton.addEventListener('click', () => {
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  progress.style.transition = 'none'; progress.style.width = '0';
  requestAnimationFrame(() => { progress.style.transition = 'width 7s linear'; progress.style.width = '100%'; });
  const captions = ['질문의 맥락을 읽고 있습니다…', '필요한 정보를 연결하고 있습니다…', '가장 명확한 답변을 만들었습니다.'];
  let index = 0; caption.textContent = captions[0];
  demoTimer = setInterval(() => { index += 1; caption.textContent = captions[Math.min(index, 2)]; if (index >= 2) clearInterval(demoTimer); }, 2300);
});
document.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', () => {
  modal.hidden = true; document.body.style.overflow = ''; clearInterval(demoTimer);
}));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !modal.hidden) { modal.hidden = true; document.body.style.overflow = ''; clearInterval(demoTimer); } });

document.querySelectorAll('.accordion details').forEach((detail) => detail.addEventListener('toggle', () => {
  if (detail.open) document.querySelectorAll('.accordion details').forEach((item) => { if (item !== detail) item.open = false; });
}));
