export const smoothScrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    const headerOffset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

export const handleSmoothNavigation = (href: string) => {
  if (href.includes('#')) {
    const [path, hash] = href.split('#');
    const sectionId = hash;
    
    if (window.location.pathname === path || path === '') {
      setTimeout(() => {
        smoothScrollToSection(sectionId);
      }, 100);
    } else {
      window.location.href = href;
    }
  }
};
