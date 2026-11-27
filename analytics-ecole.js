(() => {
  'use strict';
  if (window.__ecoleAnalyticsLoaded) return;
  window.__ecoleAnalyticsLoaded = true;
  const ID = 'G-DP3TNQYD2R';
  const KEY = 'ecole-statistiques-v1';
  const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  // Liste fermée : aucune collecte sur le Cabinet, les articles de santé et les autres pages.
  const allowed = new Map([
    ['/', 'Accueil – École'],
    ['/shiatsu-pro.html', 'Formation professionnelle'],
    ['/leadership/', 'Formation leadership'],
    ['/stage-intuition/', 'Stage intuition'],
    ['/stage-ressenti-avant-le-geste/', 'Stage ressenti avant le geste'],
  ]);
  const path = location.pathname.replace(/\/index\.html$/i, '/');
  const eligible = allowed.has(path) && location.hostname === 'ecole-shiatsu-guylaine-juan.com';
  const disableKey = 'ga-disable-' + ID;
  window[disableKey] = true;
  let started = false;
  let choice = null;
  let banner, settings;
  function readChoice() {
    try {
      const x = JSON.parse(localStorage.getItem(KEY));
      if (x && ['yes','no'].includes(x.value) && Number.isFinite(x.time) && Date.now() >= x.time && Date.now() - x.time < MAX_AGE) return x.value;
    } catch (_) {}
    return null;
  }
  function remember(value) {
    try { localStorage.setItem(KEY, JSON.stringify({value, time: Date.now()})); } catch (_) {}
  }
  function safeReferrer() {
    try {
      const r = new URL(document.referrer);
      if (r.origin === location.origin) {
        const p = r.pathname.replace(/\/index\.html$/i, '/');
        return allowed.has(p) ? r.origin + p : '';
      }
      if (r.protocol === 'https:' || r.protocol === 'http:') {
        const h = r.hostname.toLowerCase();
        if (/^(?:[a-z0-9-]+\.)*(?:google\.(?:com|fr|be|ch)|facebook\.com|instagram\.com|youtube\.com|youtu\.be|bing\.com|duckduckgo\.com)$/.test(h)) return r.origin + '/';
      }
    } catch (_) {}
    return '';
  }
  function start() {
    if (!eligible || choice !== 'yes' || started) return;
    // Ne jamais démarrer sur une URL contenant des paramètres non prévus ou un fragment.
    // Les paramètres publicitaires et UTM ne sont pas transmis dans l'URL de page.
    const permitted = new Set(['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','fbclid','gclid','gbraid','wbraid','msclkid']);
    if ([...new URLSearchParams(location.search).keys()].some(k => !permitted.has(k))) return;
    started = true;
    window[disableKey] = false;
    window.dataLayer = window.dataLayer || [];
    function gtag(){ window.dataLayer.push(arguments); }
    gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('consent','update',{analytics_storage:'granted',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});
    gtag('js',new Date());
    const page = {page_location:location.origin + path,page_title:allowed.get(path),page_referrer:safeReferrer()};
    gtag('config',ID,{...page,send_page_view:false,allow_google_signals:false,allow_ad_personalization_signals:false,cookie_expires:15552000,cookie_update:false});
    gtag('event','page_view',{...page,send_to:ID});
    const s = document.createElement('script');
    s.async = true;
    s.referrerPolicy = 'no-referrer';
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
    document.head.appendChild(s);
  }
  function clearCookies() {
    const names = document.cookie.split(';').map(x => x.trim().split('=')[0]).filter(n => n === '_ga' || n.startsWith('_ga_'));
    for (const n of names) {
      for (const d of ['', '; Domain=' + location.hostname, '; Domain=.' + location.hostname]) {
        document.cookie = n + '=; Max-Age=0; Path=/; SameSite=Lax; Secure' + d;
      }
    }
  }
  function choose(value) {
    choice = value;
    remember(value);
    if (value === 'no') {
      window[disableKey] = true;
      clearCookies();
      // Rechargement uniquement si la balise avait été chargée, pour arrêter sa session.
      if (started) { location.reload(); return; }
    } else start();
    if (banner) banner.hidden = true;
    if (settings) settings.focus();
  }
  function element(tag,text) { const e=document.createElement(tag); if (text) e.textContent=text; return e; }
  function mount() {
    choice = readChoice();
    const css=element('style');
    css.textContent = `
      #ecole-stats-panel[hidden]{display:none!important}
      #ecole-stats-panel{position:fixed;z-index:2147483000;left:16px;bottom:16px;max-width:440px;width:calc(100% - 32px);max-height:70vh;overflow:auto;box-sizing:border-box;background:#fdfbf8;color:#2c1810;border:1px solid #d4a373;border-radius:12px;padding:18px;box-shadow:0 6px 24px #3a1f1633;text-align:left;font:15px/1.5 system-ui,sans-serif}
      #ecole-stats-panel p{margin:8px 0;color:#2c1810;font:inherit}
      #ecole-stats-panel strong{font-size:17px}
      #ecole-stats-panel a{color:#4e2a1f;text-decoration:underline}
      #ecole-stats-panel .ecole-stats-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
      #ecole-stats-panel button{flex:1 1 145px;border:1px solid #4e2a1f;background:#4e2a1f;color:#fff;border-radius:7px;padding:11px 12px;font:600 14px/1.3 system-ui,sans-serif;cursor:pointer}
      #ecole-stats-panel button:focus-visible,#ecole-stats-settings:focus-visible{outline:3px solid #a15f35;outline-offset:3px}
      #ecole-stats-settings{display:block;margin:10px auto;padding:8px 12px;border:1px solid #d4a373;border-radius:6px;background:#fdfbf8;color:#4e2a1f;cursor:pointer;font:14px/1.4 system-ui,sans-serif;text-decoration:underline}
    `;
    document.head.appendChild(css);
    settings=element('button','Gérer mes cookies');
    settings.id='ecole-stats-settings'; settings.type='button'; settings.setAttribute('aria-controls','ecole-stats-panel');
    const foot=document.querySelector('footer'); (foot || document.body).appendChild(settings);
    banner=element('section'); banner.id='ecole-stats-panel'; banner.hidden=true; banner.setAttribute('aria-label','Préférences de mesure d’audience');
    banner.appendChild(element('strong','Vos préférences de cookies'));
    banner.appendChild(element('p','Avec votre accord, Google Analytics mesure les visites de certaines pages de formation de notre site. Vous pouvez refuser sans conséquence sur votre navigation. Votre choix est mémorisé pendant 180 jours et peut être modifié à tout moment. Aucune mesure publicitaire n’est activée par ce dispositif.'));
    if (!eligible) banner.appendChild(element('p','La mesure Google Analytics est désactivée sur cette page.'));
    const p=element('p'); const policy=element('a','Politique de confidentialité'); policy.href='/politique-confidentialite/'; p.appendChild(policy); p.appendChild(document.createTextNode(' · ')); const link=element('a','Traitement par Google'); link.href='https://policies.google.com/technologies/partner-sites?hl=fr'; link.target='_blank';link.rel='noopener noreferrer';p.appendChild(link);banner.appendChild(p);
    const actions=element('div');actions.className='ecole-stats-actions';
    for (const [label,value] of [['Tout refuser','no'],['Tout accepter','yes']]) {
      const b=element('button',label);b.type='button';b.addEventListener('click',()=>choose(value));actions.appendChild(b);
    }
    banner.appendChild(actions);document.body.appendChild(banner);
    settings.addEventListener('click',()=>{banner.hidden=!banner.hidden;if(!banner.hidden) actions.firstElementChild.focus();});
    if (eligible && choice === null) banner.hidden=false;
    if (choice === 'yes') start();
    window.addEventListener('storage',e=>{
      if(e.key!==KEY && e.key!==null) return;
      const next=readChoice(); if(next===choice) return;
      choice=next;
      if(choice!=='yes'){window[disableKey]=true;clearCookies();if(started){location.reload();return;}}
      else start();
      if(eligible) banner.hidden=choice!==null;
    });
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',mount,{once:true}); else mount();
})();
