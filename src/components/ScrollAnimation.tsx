
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
          
          // Add staggered animation delays for child elements
          const children = entry.target.querySelectorAll('.stagger-child');
          children.forEach((child, index) => {
            setTimeout(() => {
              child.classList.add('animate-slide-up');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Enhanced parallax effect on scroll
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        const rotationX = scrolled * 0.02;
        const rotationY = Math.sin(scrolled * 0.005) * 5;
        (element as HTMLElement).style.transform = `translateY(${yPos}px) rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;
      });

      // Enhanced 3D tilt effect to cards based on scroll position
      const cards = document.querySelectorAll('.card-3d');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const centerX = rect.left + rect.width / 2;
        const distanceFromCenter = (window.innerHeight / 2 - centerY) / window.innerHeight;
        const horizontalDistance = (window.innerWidth / 2 - centerX) / window.innerWidth;
        
        const tiltX = distanceFromCenter * 8;
        const tiltY = horizontalDistance * 5;
        const scale = rect.top < window.innerHeight && rect.bottom > 0 ? 1 : 0.95;
        
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          (card as HTMLElement).style.transform = `
            perspective(1000px) 
            rotateX(${tiltX}deg) 
            rotateY(${tiltY}deg) 
            scale(${scale})
            translateZ(${Math.abs(tiltX) * 2}px)
          `;
          (card as HTMLElement).style.transformStyle = 'preserve-3d';
        }
      });

      // Floating elements animation
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yOffset = Math.sin((scrolled * 0.01) + (index * 2)) * 30;
        const xOffset = Math.cos((scrolled * 0.008) + (index * 1.5)) * 20;
        (element as HTMLElement).style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScrollHandler = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Mouse move parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      const parallaxElements = document.querySelectorAll('.mouse-parallax');
      parallaxElements.forEach((element, index) => {
        const intensity = 20 + (index * 10);
        const xMove = (mouseX - 0.5) * intensity;
        const yMove = (mouseY - 0.5) * intensity;
        (element as HTMLElement).style.transform = `translate(${xMove}px, ${yMove}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

export default ScrollAnimation;
