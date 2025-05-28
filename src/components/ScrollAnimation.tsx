
import React, { useEffect } from 'react';

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Add parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        (element as HTMLElement).style.transform = `translateY(${yPos}px) rotateX(${scrolled * 0.01}deg)`;
      });

      // Add 3D tilt effect to cards based on scroll position
      const cards = document.querySelectorAll('.card-3d');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const distanceFromCenter = (window.innerHeight / 2 - centerY) / window.innerHeight;
        const tiltX = distanceFromCenter * 5;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          (card as HTMLElement).style.transform = `rotateX(${tiltX}deg) rotateY(${Math.sin(scrolled * 0.01 + index) * 2}deg)`;
        }
      });
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null;
};

export default ScrollAnimation;
