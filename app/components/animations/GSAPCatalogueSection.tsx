"use client";

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrer le plugin ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface GSAPCatalogueSectionProps {
  children?: React.ReactNode;
}

export default function GSAPCatalogueSection({ children }: GSAPCatalogueSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const wordpressLogoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const orbsRef = useRef<(HTMLDivElement | null)[]>([]);
  const geometricElementsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const section = sectionRef.current;
    const title = titleRef.current;
    const description = descriptionRef.current;

    if (!section || !title || !description) return;

    // ========================================
    // 1. ANIMATION D'ENTRÉE AU SCROLL
    // ========================================
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 20%",
        toggleActions: "play none none reverse"
      }
    });

    // Animation du titre avec effet de "typewriter"
    tl.from(title, {
      y: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out"
    })
    .from(description, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: "power2.out"
    }, "-=0.8");

    // ========================================
    // 2. LOGOS WORDPRESS FLOTTANTS ORGANIQUES
    // ========================================
    wordpressLogoRefs.current.forEach((logo, index) => {
      if (!logo) return;

      gsap.set(logo, {
        transformOrigin: "center center"
      });

      // Animation de flottement organique
      gsap.to(logo, {
        y: `random(-25, 25)`,
        x: `random(-20, 20)`,
        rotation: `random(-15, 15)`,
        duration: `random(3, 5)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.5
      });

      // Animation de respiration (scale)
      gsap.to(logo, {
        scale: `random(0.8, 1.2)`,
        duration: `random(2, 4)`,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
        delay: index * 0.3
      });
    });

    // ========================================
    // 3. ORBES AVEC PHYSIQUE RÉALISTE
    // ========================================
    orbsRef.current.forEach((orb, index) => {
      if (!orb) return;

      // Mouvement orbital complexe
      gsap.to(orb, {
        rotation: 360,
        duration: 15 + (index * 5),
        repeat: -1,
        ease: "none"
      });

      // Pulsation avec rebond élastique
      gsap.to(orb, {
        scale: 1.3,
        duration: 2.5 + (index * 0.5),
        repeat: -1,
        yoyo: true,
        ease: "elastic.inOut(1, 0.3)"
      });

      // Déplacement en "8" (lemniscate)
      gsap.to(orb, {
        motionPath: {
          path: `M0,0 Q${30 + index * 10},${-20 - index * 5} ${60 + index * 15},0 T${120 + index * 20},0`,
          autoRotate: false
        },
        duration: 8 + index * 2,
        repeat: -1,
        ease: "power1.inOut"
      });
    });

    // ========================================
    // 4. ÉLÉMENTS GÉOMÉTRIQUES INTERACTIFS
    // ========================================
    geometricElementsRef.current.forEach((element, index) => {
      if (!element) return;

      // Animation de base
      const baseAnimation = gsap.timeline({ repeat: -1 });

      if (index === 0) {
        // Carré qui fait des flips 3D
        baseAnimation.to(element, {
          rotationX: 360,
          rotationY: 180,
          duration: 4,
          ease: "power2.inOut"
        });
      } else if (index === 1) {
        // Cercle avec effet "ping" avancé
        baseAnimation
          .to(element, {
            scale: 2,
            opacity: 0.3,
            duration: 1.5,
            ease: "power2.out"
          })
          .to(element, {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "power2.in"
          });
      } else if (index === 2) {
        // Anneau avec rotation morphée
        baseAnimation.to(element, {
          rotation: 360,
          scale: 1.5,
          duration: 6,
          ease: "sine.inOut",
          yoyo: true
        });
      }
    });

    // ========================================
    // 5. EFFET PARALLAX SUR LE PATTERN DE FOND
    // ========================================
    const backgroundPattern = section.querySelector('.background-pattern');
    if (backgroundPattern) {
      gsap.to(backgroundPattern, {
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        },
        y: -50,
        ease: "none"
      });
    }

    // ========================================
    // 6. ANIMATION HOVER INTERACTIVE
    // ========================================
    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      // Les éléments suivent subtilement la souris
      wordpressLogoRefs.current.forEach((logo) => {
        if (logo) {
          gsap.to(logo, {
            x: x * 20,
            y: y * 15,
            duration: 1.5,
            ease: "power2.out"
          });
        }
      });
    };

    section.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      ScrollTrigger.getAll().forEach(st => st.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="catalogue"
      className="relative bg-gradient-to-br from-slate-200 via-purple-100/40 to-cyan-100/50 shadow-sm overflow-hidden"
    >
      {/* Pattern géométrique moderne - hexagones */}
      <div className="background-pattern absolute inset-0 opacity-[0.08]" style={{
        backgroundImage: `
          conic-gradient(from 30deg at 50% 50%, transparent 60deg, #2563eb 60deg, #2563eb 120deg, transparent 120deg),
          conic-gradient(from 210deg at 50% 50%, transparent 60deg, #7c3aed 60deg, #7c3aed 120deg, transparent 120deg)
        `,
        backgroundSize: '80px 80px',
        backgroundPosition: '0 0, 40px 40px'
      }}></div>

      {/* Pattern de lignes diagonales innovant */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `
          linear-gradient(45deg, #0891b2 1px, transparent 1px),
          linear-gradient(-45deg, #7c3aed 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }}></div>

      {/* Orbes flottants animés */}
      <div
        ref={el => { orbsRef.current[0] = el; }}
        className="absolute top-10 right-20 w-32 h-32 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-2xl"
      ></div>
      <div
        ref={el => { orbsRef.current[1] = el; }}
        className="absolute top-32 right-64 w-20 h-20 bg-gradient-to-r from-purple-500/25 to-pink-500/25 rounded-full blur-xl"
      ></div>
      <div
        ref={el => { orbsRef.current[2] = el; }}
        className="absolute bottom-20 left-32 w-40 h-40 bg-gradient-to-r from-cyan-400/15 to-blue-500/15 rounded-full blur-3xl"
      ></div>

      {/* Éléments géométriques flottants */}
      <div
        ref={el => { geometricElementsRef.current[0] = el; }}
        className="absolute top-16 left-20 w-6 h-6 border-2 border-blue-400/50"
      ></div>
      <div
        ref={el => { geometricElementsRef.current[1] = el; }}
        className="absolute bottom-24 right-32 w-4 h-4 bg-purple-500/30 rounded-full"
      ></div>
      <div
        ref={el => { geometricElementsRef.current[2] = el; }}
        className="absolute top-1/2 right-16 w-8 h-8 border border-cyan-500/40 rounded-full"
      ></div>

      {/* Logos WordPress flottants */}
      <div
        ref={el => { wordpressLogoRefs.current[0] = el; }}
        className="absolute top-20 right-40 w-8 h-8 opacity-10"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-blue-600">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.031-.661.854-.077.899 0 0 .584.075 1.195.105l1.777 4.863-2.5 7.5-4.156-12.363c.649-.03 1.234-.105 1.234-.105.582-.075.516-.93-.065-.899 0 0-1.756.135-2.88.135-.202 0-.438-.008-.69-.015C4.093 2.38 7.269.825 10.97.825c2.8 0 5.365 1.07 7.286 2.84-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.403-2.325.607-3.582.607zM1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.211 16.271 1.211 12zM12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0z"/>
        </svg>
      </div>
      <div
        ref={el => { wordpressLogoRefs.current[1] = el; }}
        className="absolute bottom-32 left-16 w-6 h-6 opacity-8"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-purple-600">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.031-.661.854-.077.899 0 0 .584.075 1.195.105l1.777 4.863-2.5 7.5-4.156-12.363c.649-.03 1.234-.105 1.234-.105.582-.075.516-.93-.065-.899 0 0-1.756.135-2.88.135-.202 0-.438-.008-.69-.015C4.093 2.38 7.269.825 10.97.825c2.8 0 5.365 1.07 7.286 2.84-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.403-2.325.607-3.582.607zM1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.211 16.271 1.211 12zM12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0z"/>
        </svg>
      </div>
      <div
        ref={el => { wordpressLogoRefs.current[2] = el; }}
        className="absolute top-1/3 left-1/4 w-5 h-5 opacity-6"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-cyan-600">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.031-.661.854-.077.899 0 0 .584.075 1.195.105l1.777 4.863-2.5 7.5-4.156-12.363c.649-.03 1.234-.105 1.234-.105.582-.075.516-.93-.065-.899 0 0-1.756.135-2.88.135-.202 0-.438-.008-.69-.015C4.093 2.38 7.269.825 10.97.825c2.8 0 5.365 1.07 7.286 2.84-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.403-2.325.607-3.582.607zM1.211 12c0-1.564.336-3.50.935-4.39L7.29 21.709C3.694 19.96 1.211 16.271 1.211 12zM12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0z"/>
        </svg>
      </div>
      <div
        ref={el => { wordpressLogoRefs.current[3] = el; }}
        className="absolute top-3/4 right-1/4 w-7 h-7 opacity-7"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="text-indigo-600">
          <path d="M21.469 6.825c.84 1.537 1.318 3.3 1.318 5.175 0 3.979-2.156 7.456-5.363 9.325l3.295-9.527c.615-1.54.82-2.771.82-3.864 0-.405-.026-.78-.07-1.109m-7.981.105c.647-.03 1.232-.105 1.232-.105.582-.075.514-.93-.067-.899 0 0-1.755.135-2.88.135-1.064 0-2.85-.135-2.85-.135-.584-.031-.661.854-.077.899 0 0 .584.075 1.195.105l1.777 4.863-2.5 7.5-4.156-12.363c.649-.03 1.234-.105 1.234-.105.582-.075.516-.93-.065-.899 0 0-1.756.135-2.88.135-.202 0-.438-.008-.69-.015C4.093 2.38 7.269.825 10.97.825c2.8 0 5.365 1.07 7.286 2.84-.046-.003-.091-.009-.141-.009-1.06 0-1.812.923-1.812 1.914 0 .89.513 1.643 1.06 2.531.411.72.89 1.643.89 2.977 0 .915-.354 1.994-.821 3.479l-1.075 3.585-3.9-11.61.001.014zM12 22.784c-1.059 0-2.081-.153-3.048-.437l3.237-9.406 3.315 9.087c.024.053.05.101.078.149-1.12.403-2.325.607-3.582.607zM1.211 12c0-1.564.336-3.05.935-4.39L7.29 21.709C3.694 19.96 1.211 16.271 1.211 12zM12 0C5.385 0 0 5.385 0 12s5.385 12 12 12 12-5.385 12-12S18.615 0 12 0z"/>
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 ref={titleRef} className="text-3xl font-bold text-gray-900">
            Notre Catalogue de Formations
          </h2>
          <p ref={descriptionRef} className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Découvrez notre catalogue complet de formations professionnelles certifiées Qualiopi.
            Formations éligibles CPF, adaptées aux entreprises et particuliers.
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}