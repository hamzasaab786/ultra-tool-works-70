
import React, { useEffect } from 'react';

const ScrollAnimation: React.FC = () => {
  useEffect(() => {
    // Observer for revealing elements on scroll
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
              child.classList.add('animate-fade-in');
            }, index * 100);
          });
        }
      });
    }, observerOptions);

    // Observe all elements with scroll-reveal class
    const revealElements = document.querySelectorAll('.scroll-reveal');
    revealElements.forEach(el => observer.observe(el));

    // Enhanced parallax effect on scroll with 3D transforms
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      // Parallax background elements
      const parallaxElements = document.querySelectorAll('.parallax-bg');
      parallaxElements.forEach((element, index) => {
        const speed = 0.6 + (index * 0.1);
        const yPos = -(scrolled * speed);
        const rotationX = scrolled * 0.01;
        const rotationY = Math.sin(scrolled * 0.005) * 5;
        const scale = 1 + (scrolled * 0.0003);
        
        (element as HTMLElement).style.transform = `
          translateY(${yPos}px) 
          rotateX(${rotationX}deg) 
          rotateY(${rotationY}deg)
          scale(${scale})
        `;
      });

      // Advanced 3D card effect based on scroll position
      const cards = document.querySelectorAll('.card-3d');
      cards.forEach((card, index) => {
        const rect = card.getBoundingClientRect();
        const centerY = rect.top + rect.height / 2;
        const centerX = rect.left + rect.width / 2;
        const distanceFromCenter = (window.innerHeight / 2 - centerY) / window.innerHeight;
        const horizontalDistance = (window.innerWidth / 2 - centerX) / window.innerWidth;
        
        const tiltX = distanceFromCenter * 10;
        const tiltY = horizontalDistance * 6;
        const scale = rect.top < window.innerHeight && rect.bottom > 0 ? 1 : 0.95;
        const translateZ = Math.abs(distanceFromCenter) * 50;
        
        if (rect.top < window.innerHeight * 1.2 && rect.bottom > -window.innerHeight * 0.2) {
          (card as HTMLElement).style.transform = `
            perspective(1000px) 
            rotateX(${tiltX}deg) 
            rotateY(${tiltY}deg) 
            scale(${scale})
            translateZ(${translateZ}px)
          `;
          (card as HTMLElement).style.transformStyle = 'preserve-3d';
        }
      });

      // Floating elements with enhanced animation
      const floatingElements = document.querySelectorAll('.floating-element');
      floatingElements.forEach((element, index) => {
        const speed = 0.3 + (index * 0.1);
        const yOffset = Math.sin((scrolled * 0.01) + (index * 2)) * 30;
        const xOffset = Math.cos((scrolled * 0.008) + (index * 1.5)) * 20;
        const rotation = Math.sin((scrolled * 0.005) + (index)) * 5;
        
        (element as HTMLElement).style.transform = `
          translate(${xOffset}px, ${yOffset}px)
          rotate(${rotation}deg)
        `;
      });
      
      // Advanced gradient shift based on scroll
      const gradientElements = document.querySelectorAll('[class*="from-"]');
      gradientElements.forEach((element) => {
        const hueRotate = (scrolled * 0.02) % 360;
        (element as HTMLElement).style.filter = `hue-rotate(${hueRotate}deg)`;
      });
    };

    // Throttle scroll events for performance
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

    // Enhanced mouse move parallax effect with 3D
    const handleMouseMove = (e: MouseEvent) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      // Parallax for background elements
      const parallaxLayers = document.querySelectorAll('.mouse-parallax');
      parallaxLayers.forEach((element, index) => {
        const intensity = 30 + (index * 15);
        const xMove = (mouseX - 0.5) * intensity;
        const yMove = (mouseY - 0.5) * intensity;
        const rotation = ((mouseX - 0.5) * 5) + ((mouseY - 0.5) * 5);
        
        (element as HTMLElement).style.transform = `
          translate(${xMove}px, ${yMove}px)
          rotate(${rotation}deg)
        `;
      });
      
      // 3D tilt effect for cards on mouse move
      const tiltCards = document.querySelectorAll('.tilt-on-mouse');
      tiltCards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardX = rect.left + rect.width / 2;
        const cardY = rect.top + rect.height / 2;
        
        const mouseXRelativeToCard = e.clientX - cardX;
        const mouseYRelativeToCard = e.clientY - cardY;
        
        // Only apply effect if mouse is near the card
        const distance = Math.sqrt(
          Math.pow(mouseXRelativeToCard, 2) + 
          Math.pow(mouseYRelativeToCard, 2)
        );
        
        const maxDistance = Math.max(window.innerWidth, window.innerHeight) * 0.3;
        
        if (distance < maxDistance) {
          // Calculate tilt amount (more tilt when closer)
          const tiltFactor = 1 - (distance / maxDistance);
          const maxTilt = 15; // max degrees of tilt
          
          const tiltX = (mouseYRelativeToCard / maxDistance) * maxTilt * tiltFactor;
          const tiltY = -(mouseXRelativeToCard / maxDistance) * maxTilt * tiltFactor;
          
          (card as HTMLElement).style.transform = `
            perspective(1000px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale(${1 + (tiltFactor * 0.05)})
          `;
          
          // Add highlight effect
          const shine = card.querySelector('.card-shine');
          if (shine) {
            const shineX = (mouseXRelativeToCard / rect.width) * 100;
            const shineY = (mouseYRelativeToCard / rect.height) * 100;
            (shine as HTMLElement).style.background = `
              radial-gradient(
                circle at ${shineX}% ${shineY}%, 
                rgba(255, 255, 255, 0.2) 0%,
                rgba(255, 255, 255, 0) 60%
              )
            `;
          }
        } else {
          // Reset transform when mouse is far away
          (card as HTMLElement).style.transform = '';
          
          const shine = card.querySelector('.card-shine');
          if (shine) {
            (shine as HTMLElement).style.background = 'none';
          }
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    // Initial call to position elements
    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', throttledScrollHandler);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return null;
};

export default ScrollAnimation;
