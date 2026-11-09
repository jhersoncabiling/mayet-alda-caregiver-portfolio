import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {Accessibility, Activity, ArrowUpRight, Baby, Brain, CheckCircle2, HandHeart, HeartHandshake, HeartPulse, Smile, Utensils, Wind, X} from 'lucide-react';
import './CareGallery.css';

// Descriptions stay within the existing profile's daily assistance, mobility,
// reminders, comfort and family communication; no clinical procedures are claimed.
const careDetails = [
  {Icon: Brain, tone: 'mint', description: 'Patient, familiar support for people living with Alzheimer’s disease or memory difficulties, with dignity at the heart of each day.', points: ['Assist with personal care and daily living activities.', 'Offer companionship and emotional reassurance.', 'Support familiar routines and a safe home environment.']},
  {Icon: HandHeart, tone: 'cream', description: 'Compassionate daily support for people with cancer, including lung cancer, focused on comfort and individual care needs.', points: ['Provide daily personal care and comfort-focused assistance.', 'Offer companionship and emotional support.', 'Communicate patient needs when appropriate.']},
  {Icon: Accessibility, tone: 'sage', description: 'Respectful assistance with everyday needs for people affected by stroke, restricted mobility or being bedridden.', points: ['Assist with mobility and positioning support.', 'Help with personal care and daily living activities.', 'Follow established routines for comfort and safety.']},
  {Icon: Activity, tone: 'ivory', description: 'Dependable help with everyday care for people living with diabetes or hypertension, following established care instructions.', points: ['Assist with personal care and daily routines.', 'Provide medication reminders according to care instructions.', 'Communicate care needs with patients and families.']},
  {Icon: Wind, tone: 'mint', description: 'Calm, attentive daily assistance for people with respiratory conditions, including asthma and pneumonia.', points: ['Help with personal care and everyday comfort.', 'Follow established care instructions.', 'Offer reassurance and supportive family communication.']},
  {Icon: HeartPulse, tone: 'cream', description: 'Considerate day-to-day support for people with heart attack or thyroid-related care needs, respecting individual comfort and dignity.', points: ['Assist with daily living activities and personal care.', 'Follow established caregiving instructions.', 'Provide companionship and communicate care needs.']},
  {Icon: Utensils, tone: 'sage', description: 'Personal care and comfort assistance for patients with a nasogastric tube, within caregiver scope and established care instructions.', points: ['Assist with personal hygiene and everyday comfort.', 'Follow the patient’s established care instructions.', 'Communicate patient needs to the family or care team.']},
  {Icon: HeartHandshake, tone: 'ivory', description: 'Practical support that respects the independence, choices and dignity of people with physical disabilities.', points: ['Assist with mobility, positioning and hygiene.', 'Adapt daily assistance to individual mobility needs.', 'Promote comfort, dignity and independence.']},
  {Icon: Baby, tone: 'mint', description: 'Gentle, attentive support for newborns, infants and their families, with patience and respect for family routines.', points: ['Help with everyday care and hygiene.', 'Support feeding routines according to family instructions.', 'Contribute to a calm, safe and comfortable environment.']},
  {Icon: Smile, tone: 'cream', description: 'Dependable day-to-day childcare support with a caring presence and clear communication with family members.', points: ['Help maintain familiar daily routines.', 'Offer patient companionship and reassurance.', 'Communicate daily care needs with the family.']},
];

function CareIllustration({Icon, tone}) {
  return <span className={`care-art care-art-${tone}`} aria-hidden="true">
    <span className="care-art-arch"/>
    <span className="care-art-orbit"/>
    <span className="care-art-symbol"><Icon strokeWidth={1.4}/></span>
    <span className="care-art-heart"><HandHeart size={23} strokeWidth={1.5}/></span>
    <span className="care-art-spark">+</span>
  </span>;
}

function CareDialog({open, item, onDismiss}) {
  const dialog = useRef(null);
  const closeButton = useRef(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const previousPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    document.body.style.overflow = 'hidden';
    const element = dialog.current;
    element.showModal();
    closeButton.current.focus({preventScroll: true});
    return () => {
      element.close();
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, [open]);

  return createPortal(<dialog ref={dialog} id="care-gallery-dialog" className="care-dialog"
    aria-modal="true" aria-labelledby="care-dialog-title" aria-describedby="care-dialog-description"
    onKeyDown={event => {
      if (event.key !== 'Tab') return;
      const stops = Array.from(event.currentTarget.querySelectorAll('button, [href], [tabindex="0"]'));
      const first = stops[0];
      const last = stops[stops.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === event.currentTarget)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }}
    onCancel={event => {event.preventDefault(); onDismiss();}}
    onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onDismiss();
    }}>
    <button ref={closeButton} className="care-dialog-close" type="button" onClick={onDismiss} aria-label="Close care details"><X size={22} aria-hidden="true"/></button>
    <div className="care-dialog-layout" tabIndex={0} role="document" aria-label="Care category details">
      <div className="care-dialog-art"><CareIllustration Icon={item.Icon} tone={item.tone}/></div>
      <div className="care-dialog-copy">
        <span className="care-dialog-label">COMPASSIONATE DAILY SUPPORT</span>
        <h2 id="care-dialog-title">{item.title}</h2>
        <p id="care-dialog-description">{item.description}</p>
        <ul>{item.points.map(point => <li key={point}><CheckCircle2 size={18} aria-hidden="true"/><span>{point}</span></li>)}</ul>
      </div>
    </div>
  </dialog>, document.body);
}

export default function CareGallery({categories}) {
  const gallery = useRef(null);
  const trigger = useRef(null);
  const [selected, setSelected] = useState(null);
  const items = categories.map((title, index) => ({...careDetails[index], title}));
  const dismiss = () => {
    setSelected(null);
    requestAnimationFrame(() => trigger.current?.focus({preventScroll: true}));
  };

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        if (reducedMotion.matches || !entry.target.animate || entry.target.contains(document.activeElement)) continue;
        const animation = entry.target.animate([
          {opacity: 0, transform: 'translateY(20px)'},
          {opacity: 1, transform: 'translateY(0)'},
        ], {duration: 600, delay: Number(entry.target.dataset.order) % 5 * 60, easing: 'cubic-bezier(.22, 1, .36, 1)'});
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, {threshold: 0.12});
    gallery.current.querySelectorAll('.care-gallery-item').forEach(card => observer.observe(card));
    const stopMotion = () => {
      if (reducedMotion.matches) {
        animations.forEach(animation => animation.cancel());
        animations.clear();
      }
    };
    reducedMotion.addEventListener('change', stopMotion);
    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener('change', stopMotion);
      animations.forEach(animation => animation.cancel());
    };
  }, []);

  return <div className="care-gallery" ref={gallery}>
    <div className="care-gallery-heading">
      <h3>Additional Patient Care Experience</h3>
      <p>Mayet has directly supported individuals with a variety of care needs and health conditions:</p>
      <p className="care-gallery-hint">Select a care area to learn more.</p>
    </div>
    <ul className="care-gallery-grid">
      {items.map((item, index) => <li className="care-gallery-item" data-order={index} key={item.title}>
        <button type="button" className={`care-gallery-card care-gallery-card-${item.tone}`} aria-haspopup="dialog" aria-controls="care-gallery-dialog"
          onClick={event => {trigger.current = event.currentTarget; setSelected(index);}}>
          <CareIllustration Icon={item.Icon} tone={item.tone}/>
          <span className="care-gallery-card-copy">
            <span className="care-gallery-card-title">{item.title}</span>
            <span className="care-gallery-more">Learn more <ArrowUpRight size={17} aria-hidden="true"/></span>
          </span>
        </button>
      </li>)}
    </ul>
    <p className="care-gallery-note">These describe caregiving experience, not clinical specialties or authorization to perform regulated medical procedures.</p>
    <CareDialog open={selected !== null} item={items[selected ?? 0]} onDismiss={dismiss}/>
  </div>;
}
