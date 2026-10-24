
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollAnimation: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    // One-shot reveals only: never read every card's layout on each scroll frame.
    const elements = document.querySelectorAll('.scroll-reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach(element => element.classList.add('revealed'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    elements.forEach(element => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

export default ScrollAnimation;
