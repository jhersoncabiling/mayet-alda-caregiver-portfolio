import React, {useEffect, useRef, useState} from 'react';
import {CheckCircle2, Minus, Plus} from 'lucide-react';

function CareerCard({entry}) {
  const [expanded, setExpanded] = useState(false);
  const titleId = `career-title-${entry.year}`;
  const detailsId = `career-details-${entry.year}`;
  const Indicator = expanded ? Minus : Plus;

  return (
    <li className="career-stop">
      <span className="career-marker" aria-hidden="true"/>
      <article className={`career-card career-card-${entry.year}`} aria-labelledby={titleId}>
        <time className="career-year" dateTime={entry.year}>{entry.year}</time>
        <h3 id={titleId}>{entry.role}</h3>
        <p className="career-context">{entry.context}</p>
        {!expanded && <p className="career-preview">{entry.details[0]}</p>}
        <ul className="career-responsibilities" id={detailsId} aria-labelledby={titleId} hidden={!expanded}>
          {entry.details.map(detail => (
            <li key={detail}><CheckCircle2 size={17} aria-hidden="true"/><span>{detail}</span></li>
          ))}
        </ul>
        <button className="career-toggle" type="button" aria-expanded={expanded}
          aria-controls={detailsId}
          aria-label={`${expanded ? 'Hide' : 'View'} responsibilities for ${entry.year}: ${entry.role}`}
          onClick={() => setExpanded(value => !value)}>
          <span>{expanded ? 'Hide responsibilities' : 'View responsibilities'}</span>
          <span className="career-toggle-icon"><Indicator size={19} aria-hidden="true"/></span>
        </button>
      </article>
    </li>
  );
}

export default function ExperienceTimeline({entries}) {
  const timeline = useRef(null);

  useEffect(() => {
    // Content is visible by default. Motion is a progressive enhancement only.
    if (!('IntersectionObserver' in window)) return;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const animations = new Set();
    const observer = new IntersectionObserver(items => {
      for (const item of items) {
        if (!item.isIntersecting) continue;
        observer.unobserve(item.target);
        if (reducedMotion.matches || !item.target.animate || item.target.contains(document.activeElement)) continue;
        const animation = item.target.animate([
          {opacity: 0, transform: 'translateY(20px)'},
          {opacity: 1, transform: 'translateY(0)'},
        ], {duration: 600, easing: 'cubic-bezier(.22, 1, .36, 1)'});
        animations.add(animation);
        animation.onfinish = () => animations.delete(animation);
      }
    }, {threshold: 0.12});
    timeline.current.querySelectorAll('.career-stop').forEach(card => observer.observe(card));
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

  return <ol className="career-timeline" ref={timeline} aria-label="Caregiving assignments by year">
    {entries.map(entry => <CareerCard key={entry.year} entry={entry}/>)}
  </ol>;
}
