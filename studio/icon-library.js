/* ============================================================================
   FrontDoor Studio, icon library.

   Grouped so the picker can offer a set that fits what the icon is FOR: click
   the mark on a "Nutrition" card and you get ten food icons, click one on a
   "Book a call" card and you get ten contact icons.

   Each icon is the inner markup of a 24x24 viewBox, monoline, no fills. The
   picker and the templates both stroke them with currentColor, so nothing here
   sets a colour. `kw` is what the auto-match reads: the words that would
   plausibly appear in the heading or label sitting next to such an icon.

   Adding more is a data edit: drop another {k,d} into a group's `i`, or add a
   whole group. Nothing else needs to change.
   ========================================================================== */
window.D7_ICONLIB = [
{ c:'Care & therapy',
  kw:'therapy therapist care counseling counselling support treatment clinical clinician healing wellbeing mental health session heal recovery compassion',
  i:[
  {k:'Heart', d:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/>'},
  {k:'Heartbeat', d:'<path d="M3 12h3.5l2-5.5 3.5 11 2.5-6.5 1.5 3H21"/>'},
  {k:'Hand and heart', d:'<path d="M2.5 14.5H6l2.8 2.3h4.9a1.8 1.8 0 0 1 0 3.6H7.2l-4.7-2.1z"/><path d="M15.2 9.8l3.1-3a2.1 2.1 0 1 0-3-3l-.3.3-.3-.3a2.1 2.1 0 1 0-3 3z"/>'},
  {k:'Stethoscope', d:'<path d="M5.5 3v4.8a4 4 0 0 0 8 0V3"/><path d="M5.5 3H4M13.5 3H15"/><path d="M9.5 11.8v2.4a4.8 4.8 0 0 0 9.6 0v-1.3"/><circle cx="19.1" cy="10.4" r="2.1"/>'},
  {k:'Medical cross', d:'<path d="M9.5 3.5h5v6h6v5h-6v6h-5v-6h-6v-5h6z"/>'},
  {k:'Plaster', d:'<rect x="2.6" y="8.4" width="18.8" height="7.2" rx="3.6" transform="rotate(-32 12 12)"/><path d="M9.3 9.3l5.4 5.4"/>'},
  {k:'Lotus', d:'<path d="M12 20.2c-2.7-2.1-4.1-4.6-4.1-7.2 0-2.5 1.4-4.8 4.1-6.7 2.7 1.9 4.1 4.2 4.1 6.7 0 2.6-1.4 5.1-4.1 7.2z"/><path d="M12 20.2c-4.2 0-7.2-2.7-7.2-6.2 2.1 0 3.8.7 4.9 1.8"/><path d="M12 20.2c4.2 0 7.2-2.7 7.2-6.2-2.1 0-3.8.7-4.9 1.8"/>'},
  {k:'First aid kit', d:'<rect x="3" y="7.2" width="18" height="12.8" rx="2.4"/><path d="M9 7.2V5.4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1.8"/><path d="M12 11v5.2M9.4 13.6h5.2"/>'},
  {k:'Pill', d:'<rect x="2.6" y="8.6" width="18.8" height="6.8" rx="3.4" transform="rotate(-45 12 12)"/><path d="M8.6 8.6l6.8 6.8"/>'},
  {k:'Shield and heart', d:'<path d="M12 3.2l7.6 2.8v5.6c0 4.3-3.1 7.9-7.6 9.2-4.5-1.3-7.6-4.9-7.6-9.2V6z"/><path d="M12 15.2l-2.4-2.3a1.7 1.7 0 0 1 2.4-2.4 1.7 1.7 0 0 1 2.4 2.4z"/>'}
]},

{ c:'People & family',
  kw:'people family parent child children teen couples group team community member client staff everyone together peer youth adult kids partner',
  i:[
  {k:'Person', d:'<path d="M19 20.5v-2a4.5 4.5 0 0 0-4.5-4.5h-5A4.5 4.5 0 0 0 5 18.5v2"/><circle cx="12" cy="7.5" r="4"/>'},
  {k:'Two people', d:'<path d="M15.5 20.5v-1.8a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v1.8"/><circle cx="9.5" cy="7.5" r="3.6"/><path d="M21 20.5v-1.8a4 4 0 0 0-3-3.8"/><path d="M15.5 4.1a4 4 0 0 1 0 7.6"/>'},
  {k:'Group of three', d:'<circle cx="12" cy="6.4" r="3"/><circle cx="5" cy="10.4" r="2.5"/><circle cx="19" cy="10.4" r="2.5"/><path d="M6.8 20.4v-1.6a5.2 5.2 0 0 1 10.4 0v1.6"/><path d="M2 19.2v-1a3.6 3.6 0 0 1 3.4-3.6"/><path d="M22 19.2v-1a3.6 3.6 0 0 0-3.4-3.6"/>'},
  {k:'Family', d:'<circle cx="7" cy="6.6" r="2.8"/><circle cx="17" cy="6.6" r="2.8"/><circle cx="12" cy="13.6" r="2.2"/><path d="M2.6 19.6v-1.4A3.9 3.9 0 0 1 6.5 14"/><path d="M21.4 19.6v-1.4a3.9 3.9 0 0 0-3.9-4.2"/><path d="M8.6 20.8v-.9a3.4 3.4 0 0 1 6.8 0v.9"/>'},
  {k:'Parent and child', d:'<circle cx="8.5" cy="6.2" r="3.1"/><path d="M3.4 20.6v-2.2A5.1 5.1 0 0 1 8.5 13a5.1 5.1 0 0 1 5.1 5.4v2.2"/><circle cx="18" cy="11.4" r="2.1"/><path d="M15.2 20.6v-2.1a2.8 2.8 0 0 1 5.6 0v2.1"/>'},
  {k:'Connected', d:'<circle cx="12" cy="4.8" r="2.4"/><circle cx="5" cy="18.2" r="2.4"/><circle cx="19" cy="18.2" r="2.4"/><path d="M10.9 6.9l-4.8 9.2M13.1 6.9l4.8 9.2M7.4 18.2h9.2"/>'},
  {k:'Person in a circle', d:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="10" r="3.1"/><path d="M6.4 19.1a6.2 6.2 0 0 1 11.2 0"/>'},
  {k:'Couple', d:'<circle cx="8" cy="6.8" r="3"/><circle cx="16" cy="6.8" r="3"/><path d="M2.8 20.4v-1.9A4.6 4.6 0 0 1 7.4 14h1.2"/><path d="M21.2 20.4v-1.9a4.6 4.6 0 0 0-4.6-4.5h-1.2"/><path d="M12 13.6v6.8"/>'},
  {k:'Child', d:'<circle cx="12" cy="7" r="3.4"/><path d="M12 10.4v5.4"/><path d="M8 13.2h8"/><path d="M9.4 20.6l2.6-4.8 2.6 4.8"/>'},
  {k:'Speech between two', d:'<circle cx="6.5" cy="8" r="2.8"/><circle cx="17.5" cy="8" r="2.8"/><path d="M2 19.4v-1.6a4.5 4.5 0 0 1 9 0v1.6"/><path d="M13 19.4v-1.6a4.5 4.5 0 0 1 9 0v1.6"/>'}
]},

{ c:'Mind & wellbeing',
  kw:'mind mental anxiety stress calm mindfulness wellbeing emotion feeling thought brain depression trauma resilience balance sleep mood focus meditation breathe grief',
  i:[
  {k:'Brain', d:'<path d="M12 5.2a3 3 0 0 0-5.6-1.4A2.9 2.9 0 0 0 3.6 8a3 3 0 0 0-.2 4.6A3 3 0 0 0 5 18a3 3 0 0 0 4.6 2.2A2.6 2.6 0 0 0 12 21z"/><path d="M12 5.2a3 3 0 0 1 5.6-1.4A2.9 2.9 0 0 1 20.4 8a3 3 0 0 1 .2 4.6A3 3 0 0 1 19 18a3 3 0 0 1-4.6 2.2A2.6 2.6 0 0 1 12 21z"/><path d="M12 5.2V21"/>'},
  {k:'Head and heart', d:'<path d="M20 12.8A8 8 0 1 0 12 20.8h6.4a1.6 1.6 0 0 0 1.6-1.6z"/><path d="M12.2 14.4l-1.8-1.7a1.3 1.3 0 0 1 1.8-1.8 1.3 1.3 0 0 1 1.8 1.8z"/>'},
  {k:'Calm waves', d:'<path d="M2.6 8.4c2.4-2.2 4.8-2.2 7.2 0s4.8 2.2 7.2 0 3.2-1.6 4.4-.6"/><path d="M2.6 14c2.4-2.2 4.8-2.2 7.2 0s4.8 2.2 7.2 0 3.2-1.6 4.4-.6"/><path d="M2.6 19.2c2.4-2.2 4.8-2.2 7.2 0"/>'},
  {k:'Sparkle', d:'<path d="M12 2.8l1.9 5.6 5.6 1.9-5.6 1.9L12 17.8l-1.9-5.6L4.5 10.3l5.6-1.9z"/><path d="M18.6 16.6l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z"/>'},
  {k:'Moon', d:'<path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11z"/>'},
  {k:'Sun', d:'<circle cx="12" cy="12" r="4.2"/><path d="M12 2.4v2.2M12 19.4v2.2M4.2 12H2M22 12h-2.2M6.1 6.1L4.6 4.6M19.4 19.4l-1.5-1.5M17.9 6.1l1.5-1.5M4.6 19.4l1.5-1.5"/>'},
  {k:'Balance', d:'<path d="M12 3.6v16.8"/><path d="M6.4 20.4h11.2"/><path d="M4 7.6h16"/><path d="M4 7.6L1.8 13a3.2 3.2 0 0 0 4.4 0z"/><path d="M20 7.6L17.8 13a3.2 3.2 0 0 0 4.4 0z"/>'},
  {k:'Breathing circle', d:'<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.4"/>'},
  {k:'Seedling', d:'<path d="M12 20.6v-7.2"/><path d="M12 13.4C12 9.7 9 6.8 5.3 6.8c0 3.7 3 6.6 6.7 6.6z"/><path d="M12 13.4c0-3.7 3-6.6 6.7-6.6 0 3.7-3 6.6-6.7 6.6z"/>'},
  {k:'Cloud lifting', d:'<path d="M17.2 18.4H7a4.4 4.4 0 0 1-.6-8.8 5.6 5.6 0 0 1 10.7 1.3 3.8 3.8 0 0 1 .1 7.5z"/><path d="M12 8.4V3.6M9.8 5.6L12 3.4l2.2 2.2"/>'}
]},

{ c:'Talk & contact',
  kw:'contact call message chat talk email phone video telehealth online enquiry question reach ask speak consultation intake hello get in touch',
  i:[
  {k:'Chat bubble', d:'<path d="M20.6 11.8a8.2 8.2 0 0 1-8.8 8.2 9 9 0 0 1-3.9-.9L3.4 20.6l1.4-4.5a8.2 8.2 0 0 1-1.4-4.6 8.2 8.2 0 0 1 8.2-8.2h.6a8.2 8.2 0 0 1 8.4 8.1z"/>'},
  {k:'Two bubbles', d:'<path d="M17.4 13.8H9.6l-3.4 2.8v-2.8H4.4A2.4 2.4 0 0 1 2 11.4V5.8a2.4 2.4 0 0 1 2.4-2.4h13a2.4 2.4 0 0 1 2.4 2.4v5.6a2.4 2.4 0 0 1-2.4 2.4z"/><path d="M8 17.4v.8a2 2 0 0 0 2 2h6.6l3 2.2v-2.2h.4a2 2 0 0 0 2-2v-4"/>'},
  {k:'Phone', d:'<path d="M21 16.9v2.6a1.8 1.8 0 0 1-2 1.8 17.8 17.8 0 0 1-7.8-2.8 17.5 17.5 0 0 1-5.4-5.4A17.8 17.8 0 0 1 3 5.2 1.8 1.8 0 0 1 4.8 3.2h2.6a1.8 1.8 0 0 1 1.8 1.6 11.6 11.6 0 0 0 .6 2.6 1.8 1.8 0 0 1-.4 1.9L8.3 10.5a14.4 14.4 0 0 0 5.4 5.4l1.2-1.1a1.8 1.8 0 0 1 1.9-.4 11.6 11.6 0 0 0 2.6.6 1.8 1.8 0 0 1 1.6 1.9z"/>'},
  {k:'Mobile', d:'<rect x="6.6" y="2.6" width="10.8" height="18.8" rx="2.4"/><path d="M10.6 18.4h2.8"/>'},
  {k:'Video call', d:'<rect x="2.6" y="6.4" width="13" height="11.2" rx="2.4"/><path d="M15.6 10.8l5.8-3.2v8.8l-5.8-3.2z"/>'},
  {k:'Envelope', d:'<rect x="2.6" y="5" width="18.8" height="14" rx="2.4"/><path d="M3.4 6.8L12 13l8.6-6.2"/>'},
  {k:'Headset', d:'<path d="M4 13.4v-1.6a8 8 0 0 1 16 0v1.6"/><path d="M4 13.4h2.4a1.6 1.6 0 0 1 1.6 1.6v2.6A1.6 1.6 0 0 1 6.4 19.2H5.6A1.6 1.6 0 0 1 4 17.6z"/><path d="M20 13.4h-2.4a1.6 1.6 0 0 0-1.6 1.6v2.6a1.6 1.6 0 0 0 1.6 1.6h.4a1.6 1.6 0 0 0 1.6-1.6z"/>'},
  {k:'Send', d:'<path d="M21.4 2.6L10.8 13.2"/><path d="M21.4 2.6l-6.8 18.8-3.8-8.2-8.2-3.8z"/>'},
  {k:'At sign', d:'<circle cx="12" cy="12" r="3.8"/><path d="M15.8 8.2v4.8a2.8 2.8 0 0 0 5.6 0V12a9.4 9.4 0 1 0-3.7 7.5"/>'},
  {k:'Bell', d:'<path d="M18.4 15.6V10.4a6.4 6.4 0 1 0-12.8 0v5.2L3.8 18.4h16.4z"/><path d="M10 21.2a2.2 2.2 0 0 0 4 0"/>'}
]},

{ c:'Time & booking',
  kw:'time book booking appointment schedule availability hours when slot calendar wait same-week weekly reminder duration minutes session length',
  i:[
  {k:'Clock', d:'<circle cx="12" cy="12" r="9"/><path d="M12 6.6V12l3.6 2.2"/>'},
  {k:'Calendar', d:'<rect x="3.2" y="5" width="17.6" height="16" rx="2.4"/><path d="M3.2 10h17.6M8.4 2.8v4.4M15.6 2.8v4.4"/>'},
  {k:'Calendar tick', d:'<rect x="3.2" y="5" width="17.6" height="16" rx="2.4"/><path d="M3.2 10h17.6M8.4 2.8v4.4M15.6 2.8v4.4"/><path d="M8.8 15l2.3 2.3 4.1-4.4"/>'},
  {k:'Hourglass', d:'<path d="M6.4 2.8h11.2M6.4 21.2h11.2"/><path d="M7.4 2.8v3.4c0 2 1.6 3.6 4.6 5.8 3-2.2 4.6-3.8 4.6-5.8V2.8"/><path d="M7.4 21.2v-3.4c0-2 1.6-3.6 4.6-5.8 3 2.2 4.6 3.8 4.6 5.8v3.4"/>'},
  {k:'Alarm', d:'<circle cx="12" cy="13.2" r="7.6"/><path d="M12 9.4v3.8l2.4 1.6"/><path d="M3.4 5.2l3-2.4M20.6 5.2l-3-2.4"/>'},
  {k:'Stopwatch', d:'<circle cx="12" cy="13.6" r="7.4"/><path d="M12 10v3.6l2.4 1.4"/><path d="M9.6 2.6h4.8"/><path d="M12 2.6v3.6"/>'},
  {k:'Repeat', d:'<path d="M3.4 11.2A8.6 8.6 0 0 1 17.6 6l3 2.6"/><path d="M20.6 3.4v5.2h-5.2"/><path d="M20.6 12.8A8.6 8.6 0 0 1 6.4 18l-3-2.6"/><path d="M3.4 20.6v-5.2h5.2"/>'},
  {k:'History', d:'<path d="M3.4 12a8.6 8.6 0 1 0 2.6-6.1L3.2 8.6"/><path d="M3.2 3.6v5h5"/><path d="M12 7.6V12l3.2 2"/>'},
  {k:'Day plan', d:'<rect x="3.2" y="4.4" width="17.6" height="16.4" rx="2.4"/><path d="M7.4 9.4h9.2M7.4 13h9.2M7.4 16.6h5.6"/>'},
  {k:'Calendar dates', d:'<rect x="3.2" y="5" width="17.6" height="16" rx="2.4"/><path d="M3.2 10h17.6M8.4 2.8v4.4M15.6 2.8v4.4"/><circle cx="8.4" cy="14.4" r="1.1"/><circle cx="12" cy="14.4" r="1.1"/><circle cx="15.6" cy="14.4" r="1.1"/>'}
]},

{ c:'Notes & assessment',
  kw:'assessment evaluation testing report results notes record paperwork form intake documentation progress measure outcome chart review plan summary referral',
  i:[
  {k:'Document', d:'<path d="M14 2.8H7.4A2.4 2.4 0 0 0 5 5.2v13.6a2.4 2.4 0 0 0 2.4 2.4h9.2a2.4 2.4 0 0 0 2.4-2.4V7.8z"/><path d="M14 2.8v5h5"/>'},
  {k:'Document tick', d:'<path d="M14 2.8H7.4A2.4 2.4 0 0 0 5 5.2v13.6a2.4 2.4 0 0 0 2.4 2.4h9.2a2.4 2.4 0 0 0 2.4-2.4V7.8z"/><path d="M14 2.8v5h5"/><path d="M8.8 14.6l2 2 3.6-3.8"/>'},
  {k:'Clipboard', d:'<path d="M15.6 4.4h1.8a2 2 0 0 1 2 2v12.8a2 2 0 0 1-2 2H6.6a2 2 0 0 1-2-2V6.4a2 2 0 0 1 2-2h1.8"/><rect x="8.4" y="2.4" width="7.2" height="4" rx="1.4"/>'},
  {k:'Checklist', d:'<path d="M9.4 6.4h11M9.4 12h11M9.4 17.6h11"/><path d="M3.6 6.2l1.4 1.4 2.2-2.4"/><path d="M3.6 11.8l1.4 1.4 2.2-2.4"/><path d="M3.6 17.4l1.4 1.4 2.2-2.4"/>'},
  {k:'Bar chart', d:'<path d="M4 20.4V13M9.4 20.4V7.6M14.8 20.4v-9M20.2 20.4V4.6"/>'},
  {k:'Line chart', d:'<path d="M3.6 3.6v16.8h16.8"/><path d="M7 15.6l3.6-4 3 2.6 4.6-5.6"/>'},
  {k:'Book', d:'<path d="M4 4.4A2 2 0 0 1 6 2.4h13.2v15.2H6a2 2 0 0 0-2 2z"/><path d="M4 19.6a2 2 0 0 1 2-2h13.2v4H6a2 2 0 0 1-2-2z"/>'},
  {k:'Pen', d:'<path d="M4 20h4.2L19.2 9a2.2 2.2 0 0 0 0-3.1l-1.1-1.1a2.2 2.2 0 0 0-3.1 0L4 15.8z"/><path d="M14.4 5.6l4 4"/>'},
  {k:'Folder', d:'<path d="M3.2 7.2a2 2 0 0 1 2-2h4l2.2 2.6h7.4a2 2 0 0 1 2 2v8.8a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2z"/>'},
  {k:'Magnifier', d:'<circle cx="10.8" cy="10.8" r="7"/><path d="M15.8 15.8l5 5"/>'}
]},

{ c:'Safety & privacy',
  kw:'safe safety private privacy confidential secure security hipaa protected trust encrypted data consent licensed verified insurance accredited crisis 988',
  i:[
  {k:'Shield', d:'<path d="M12 3.2l7.8 2.9v5.7c0 4.4-3.2 8-7.8 9.4-4.6-1.4-7.8-5-7.8-9.4V6.1z"/>'},
  {k:'Shield tick', d:'<path d="M12 3.2l7.8 2.9v5.7c0 4.4-3.2 8-7.8 9.4-4.6-1.4-7.8-5-7.8-9.4V6.1z"/><path d="M9 12.2l2.2 2.2 4-4.3"/>'},
  {k:'Lock', d:'<rect x="4.4" y="10.4" width="15.2" height="10.6" rx="2.2"/><path d="M8 10.4V7.6a4 4 0 0 1 8 0v2.8"/>'},
  {k:'Key', d:'<circle cx="7.6" cy="15.6" r="4.2"/><path d="M10.6 12.6l9-9"/><path d="M16.8 6.4l2.2 2.2M14.4 8.8l2.2 2.2"/>'},
  {k:'Hidden eye', d:'<path d="M9.6 5.2A9.6 9.6 0 0 1 12 5c6 0 9.6 7 9.6 7a16.4 16.4 0 0 1-3 3.9"/><path d="M14.4 14.3a3 3 0 1 1-4.2-4.2"/><path d="M5.4 7.7A16.6 16.6 0 0 0 2.4 12s3.6 7 9.6 7a9.4 9.4 0 0 0 3.6-.7"/><path d="M2.8 2.8l18.4 18.4"/>'},
  {k:'Verified badge', d:'<path d="M12 2.6l2.3 2.1 3.1-.4.9 3 2.8 1.4-1.3 2.9 1.3 2.9-2.8 1.4-.9 3-3.1-.4L12 21.4l-2.3-2.1-3.1.4-.9-3-2.8-1.4 1.3-2.9-1.3-2.9 2.8-1.4.9-3 3.1.4z"/><path d="M9.2 12.2l2 2 3.8-4.2"/>'},
  {k:'Fingerprint', d:'<path d="M12 11.4v2.4a8.6 8.6 0 0 1-1 4"/><path d="M8.6 9.6a3.6 3.6 0 0 1 6.8 1.8 14 14 0 0 1-.6 4.2"/><path d="M5.6 12a6.6 6.6 0 0 1 11.6-4.3"/><path d="M18.4 11.4a21 21 0 0 1-.8 6"/><path d="M3.2 15.6A10.2 10.2 0 0 1 2.8 12 9.2 9.2 0 0 1 12 2.8a9.4 9.4 0 0 1 4.6 1.2"/><path d="M7 19.6a11 11 0 0 0 1.8-4.2"/>'},
  {k:'Umbrella', d:'<path d="M12 3.2a9.4 9.4 0 0 1 9.4 8.6H2.6A9.4 9.4 0 0 1 12 3.2z"/><path d="M12 11.8v6.6a2.4 2.4 0 0 0 4.8 0"/>'},
  {k:'Open hand', d:'<path d="M9 11V5.4a1.6 1.6 0 0 1 3.2 0V11"/><path d="M12.2 10.6V4.6a1.6 1.6 0 0 1 3.2 0V11"/><path d="M15.4 11.2V7a1.6 1.6 0 0 1 3.2 0v8.2a6 6 0 0 1-6 6h-1.4a5 5 0 0 1-3.8-1.8L4 15a1.7 1.7 0 0 1 2.6-2.2L9 15.2V11"/>'},
  {k:'Lifebuoy', d:'<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="3.6"/><path d="M5.8 5.8l3.6 3.6M14.6 14.6l3.6 3.6M18.2 5.8l-3.6 3.6M9.4 14.6l-3.6 3.6"/>'}
]},

{ c:'Place & home',
  kw:'location place home house office clinic address visit directions map where in person building room space site parking nearby area neighborhood',
  i:[
  {k:'House', d:'<path d="M3.4 10.4L12 3.2l8.6 7.2v9.2a1.8 1.8 0 0 1-1.8 1.8H5.2a1.8 1.8 0 0 1-1.8-1.8z"/><path d="M9.4 21.4v-7.6h5.2v7.6"/>'},
  {k:'Building', d:'<rect x="4.4" y="2.8" width="15.2" height="18.4" rx="2"/><path d="M8.4 7h2.4M13.2 7h2.4M8.4 11.2h2.4M13.2 11.2h2.4M8.4 15.4h2.4M13.2 15.4h2.4"/><path d="M10 21.2v-2.6h4v2.6"/>'},
  {k:'Map pin', d:'<path d="M19.6 10.4c0 5.8-7.6 11-7.6 11s-7.6-5.2-7.6-11a7.6 7.6 0 0 1 15.2 0z"/><circle cx="12" cy="10.2" r="2.8"/>'},
  {k:'Map', d:'<path d="M2.8 6.4l6.2-2.6v13.8l-6.2 2.6z"/><path d="M9 3.8l6 2.6v13.8l-6-2.6z"/><path d="M15 6.4l6.2-2.6v13.8L15 20.2z"/>'},
  {k:'Door', d:'<path d="M5.6 21.2V4.4a1.6 1.6 0 0 1 1.6-1.6h9.6a1.6 1.6 0 0 1 1.6 1.6v16.8"/><path d="M3.6 21.2h16.8"/><circle cx="15" cy="12.4" r="1.1"/>'},
  {k:'Globe', d:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a13.6 13.6 0 0 1 3.4 9A13.6 13.6 0 0 1 12 21a13.6 13.6 0 0 1-3.4-9A13.6 13.6 0 0 1 12 3z"/>'},
  {k:'Car', d:'<path d="M3.4 14.6l1.8-5.2a2.4 2.4 0 0 1 2.3-1.6h9a2.4 2.4 0 0 1 2.3 1.6l1.8 5.2"/><path d="M3.4 14.6h17.2v3.6a1 1 0 0 1-1 1h-1.4a1 1 0 0 1-1-1v-1H6.8v1a1 1 0 0 1-1 1H4.4a1 1 0 0 1-1-1z"/><path d="M6.6 16.8h.01M17.4 16.8h.01"/>'},
  {k:'Bed', d:'<path d="M2.8 19.4V8.6"/><path d="M2.8 13.6h18.4v5.8"/><path d="M21.2 13.6v-2a2.4 2.4 0 0 0-2.4-2.4h-6.4v4.4"/><circle cx="7" cy="11.2" r="2.1"/>'},
  {k:'Armchair', d:'<path d="M5.8 11.4V7.6a2.6 2.6 0 0 1 2.6-2.6h7.2a2.6 2.6 0 0 1 2.6 2.6v3.8"/><path d="M4 12.8a2 2 0 0 1 4 0v3h8v-3a2 2 0 0 1 4 0v4.6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M6.4 19.4v1.8M17.6 19.4v1.8"/>'},
  {k:'Signpost', d:'<path d="M12 2.8v18.4"/><path d="M4.6 6.2h11.6l2.6 2.6-2.6 2.6H4.6z"/><path d="M19.4 13.4H7.8l-2.6 2.6 2.6 2.6h11.6z"/>'}
]},

{ c:'Money & billing',
  kw:'price pricing cost fee payment pay billing insurance invoice sliding scale afford copay rate budget plan deposit refund claim coverage superbill',
  i:[
  {k:'Card', d:'<rect x="2.6" y="5.4" width="18.8" height="13.2" rx="2.4"/><path d="M2.6 10h18.8"/><path d="M6.4 14.6h3.2"/>'},
  {k:'Wallet', d:'<path d="M3.2 7.4a2.2 2.2 0 0 1 2.2-2.2h11.4a2 2 0 0 1 2 2v1.6"/><rect x="3.2" y="7.4" width="17.6" height="12.4" rx="2.2"/><path d="M20.8 12.2h-4a2 2 0 0 0 0 4h4"/>'},
  {k:'Receipt', d:'<path d="M5.4 2.8h13.2v18.4l-2.2-1.6-2.2 1.6-2.2-1.6-2.2 1.6-2.2-1.6-2.2 1.6z"/><path d="M9 8.2h6M9 12.4h6"/>'},
  {k:'Coins', d:'<ellipse cx="9" cy="6.6" rx="6.2" ry="2.8"/><path d="M2.8 6.6v4c0 1.5 2.8 2.8 6.2 2.8s6.2-1.3 6.2-2.8v-4"/><path d="M15.2 11.6c3.1.2 6 1.4 6 2.8v3.8c0 1.5-2.8 2.8-6.2 2.8s-6.2-1.3-6.2-2.8v-1.8"/>'},
  {k:'Price tag', d:'<path d="M20.6 12.6l-8 8a2 2 0 0 1-2.8 0l-6.4-6.4a2 2 0 0 1-.6-1.4V4.4a1 1 0 0 1 1-1h8.4a2 2 0 0 1 1.4.6l7 7a2 2 0 0 1 0 2.8z" transform="translate(-0.6 -0.6)"/><circle cx="7.8" cy="7.8" r="1.4"/>'},
  {k:'Piggy bank', d:'<path d="M19.4 11.4a7 7 0 0 0-4.6-3.2h-4a6.6 6.6 0 0 0-6.6 6.6c0 2 .9 3.5 2.2 4.6v2h3v-1.4h4.4V21h3v-2a6.6 6.6 0 0 0 1.8-2.4h1.6v-5z"/><path d="M10.8 8.2a3 3 0 0 1 4.4-3.4"/><circle cx="16.4" cy="13.6" r="1"/>'},
  {k:'Percent', d:'<path d="M19.4 4.6L4.6 19.4"/><circle cx="7.4" cy="7.4" r="2.8"/><circle cx="16.6" cy="16.6" r="2.8"/>'},
  {k:'Calculator', d:'<rect x="4.4" y="2.6" width="15.2" height="18.8" rx="2.2"/><path d="M8 6.6h8v3.2H8z"/><path d="M8.4 13.6h.01M12 13.6h.01M15.6 13.6h.01M8.4 17.4h.01M12 17.4h.01M15.6 17.4h.01"/>'},
  {k:'Bank', d:'<path d="M2.8 9.4L12 3.6l9.2 5.8"/><path d="M4.8 9.4v9.2M9.6 9.4v9.2M14.4 9.4v9.2M19.2 9.4v9.2"/><path d="M2.8 20.4h18.4"/>'},
  {k:'Shield and coin', d:'<path d="M12 3.2l7.6 2.8v5.6c0 4.3-3.1 7.9-7.6 9.2-4.5-1.3-7.6-4.9-7.6-9.2V6z"/><circle cx="12" cy="11.4" r="3"/><path d="M12 9.6v3.6"/>'}
]},

{ c:'Food & nutrition',
  kw:'food nutrition meal eat diet kitchen menu dish cook chef recipe lunch dinner breakfast restaurant catering organic healthy eating snack',
  i:[
  {k:'Bowl', d:'<path d="M2.8 11.4h18.4a9.2 9.2 0 0 1-9.2 8.4 9.2 9.2 0 0 1-9.2-8.4z"/><path d="M8.6 8.2c0-1.6 1.6-1.6 1.6-3.2M12.4 8.2c0-1.6 1.6-1.6 1.6-3.2"/>'},
  {k:'Plate and cutlery', d:'<circle cx="12" cy="12" r="7.6"/><circle cx="12" cy="12" r="3.8"/><path d="M3.2 2.8v6.4M21 2.8v6.4"/>'},
  {k:'Apple', d:'<path d="M12 7.6c-1.2-1-2.6-1.4-4-1.1C5.6 7 4 9.4 4 12.6c0 4 2.8 8.2 5.2 8.2 1 0 1.8-.5 2.8-.5s1.8.5 2.8.5c2.4 0 5.2-4.2 5.2-8.2 0-3.2-1.6-5.6-4-6.1-1.4-.3-2.8.1-4 1.1z"/><path d="M12 7.6V4.4a2.6 2.6 0 0 1 2.6-2.6"/>'},
  {k:'Bread', d:'<path d="M4 10.6a3.4 3.4 0 0 1 2.4-5.8h11.2A3.4 3.4 0 0 1 20 10.6v8a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.6z"/><path d="M8.4 10.2v9.6"/>'},
  {k:'Chef hat', d:'<path d="M6.4 20.4v-6.2a4.8 4.8 0 0 1-1.6-8.6 4.4 4.4 0 0 1 8.2-1.4 4.4 4.4 0 0 1 6.6 3.6 4.8 4.8 0 0 1-2 3.8v8.8z"/><path d="M6.4 17.2h11.2"/>'},
  {k:'Cooking pot', d:'<path d="M3.6 9.6h16.8v6.2a4.4 4.4 0 0 1-4.4 4.4H8a4.4 4.4 0 0 1-4.4-4.4z"/><path d="M2 12.2h1.6M20.4 12.2H22"/><path d="M9.2 6.4c0-1.4 1.4-1.4 1.4-2.8M13.2 6.4c0-1.4 1.4-1.4 1.4-2.8"/>'},
  {k:'Pizza slice', d:'<path d="M12 2.8l9 17.4a1 1 0 0 1-1.3 1.3L2.4 12.6z"/><path d="M8.6 10.6h.01M12.4 14.4h.01M9.8 15.8h.01"/>'},
  {k:'Knife and fork', d:'<path d="M7 2.8v7.4a2.6 2.6 0 0 0 2.6 2.6v8.4"/><path d="M7 2.8v5.4M9.6 2.8v5.4"/><path d="M16.8 2.8c-1.7 1.5-2.6 3.6-2.6 5.9 0 1.9 1.1 3.2 2.6 3.4v9.1"/>'},
  {k:'Egg', d:'<path d="M12 2.8c3.8 0 6.8 6.2 6.8 10.6A6.8 6.8 0 0 1 12 21.2a6.8 6.8 0 0 1-6.8-7.8C5.2 9 8.2 2.8 12 2.8z"/>'},
  {k:'Fish', d:'<path d="M2.8 12c2.8-3.8 6.4-5.8 9.6-5.8 4 0 7.2 2.4 8.8 5.8-1.6 3.4-4.8 5.8-8.8 5.8-3.2 0-6.8-2-9.6-5.8z"/><path d="M15.6 10.6h.01"/><path d="M2.8 12l-.8-3.4M2.8 12l-.8 3.4"/>'}
]},

{ c:'Drink & glass',
  kw:'drink glass water cup coffee tea juice bar cafe hydration beverage wine cocktail bottle mug brew refreshment',
  i:[
  {k:'Water glass', d:'<path d="M6.6 3.2h10.8l-1.4 17a1.2 1.2 0 0 1-1.2 1.1H9.2a1.2 1.2 0 0 1-1.2-1.1z"/><path d="M7.4 11.4h9.2"/>'},
  {k:'Wine glass', d:'<path d="M6.8 3.2h10.4l-.6 5.4a4.8 4.8 0 0 1-9.2 0z"/><path d="M12 13.6v7.2M8.4 20.8h7.2"/>'},
  {k:'Cocktail', d:'<path d="M3.2 4.4h17.6L12 13.2z"/><path d="M12 13.2v7.4M8.2 20.6h7.6"/><path d="M15.6 7.6l4.4-4"/>'},
  {k:'Coffee cup', d:'<path d="M3.6 8.2h13.2v6.4a5.2 5.2 0 0 1-5.2 5.2H8.8a5.2 5.2 0 0 1-5.2-5.2z"/><path d="M16.8 9.6h1.8a2.8 2.8 0 0 1 0 5.6h-1.8"/><path d="M7 4.8c0-1.2 1.2-1.2 1.2-2.4M11.2 4.8c0-1.2 1.2-1.2 1.2-2.4"/>'},
  {k:'Takeaway cup', d:'<path d="M5.4 7.6h13.2l-1.4 12.2a1.6 1.6 0 0 1-1.6 1.4H8.4a1.6 1.6 0 0 1-1.6-1.4z"/><path d="M4.2 4.4h15.6v3.2H4.2z"/><path d="M6.4 13.2h11.2"/>'},
  {k:'Bottle', d:'<path d="M9.6 2.8h4.8v3.4l1.6 2.6a4 4 0 0 1 .6 2.1v8.5a1.8 1.8 0 0 1-1.8 1.8H9.2a1.8 1.8 0 0 1-1.8-1.8v-8.5a4 4 0 0 1 .6-2.1l1.6-2.6z"/><path d="M7.4 13.6h9.2"/>'},
  {k:'Mug', d:'<rect x="3.4" y="5.6" width="13" height="13.6" rx="2.4"/><path d="M16.4 8.6h2.2a3 3 0 0 1 0 6h-2.2"/>'},
  {k:'Water drop', d:'<path d="M12 3.2c0 0 6.6 6.8 6.6 11a6.6 6.6 0 0 1-13.2 0c0-4.2 6.6-11 6.6-11z"/>'},
  {k:'Can', d:'<rect x="7" y="3.4" width="10" height="17.2" rx="2.6"/><path d="M7 8h10M7 16h10"/>'},
  {k:'Juice carton', d:'<path d="M6.4 8.6l2.2-4.8h6.8l2.2 4.8v11a1.6 1.6 0 0 1-1.6 1.6H8a1.6 1.6 0 0 1-1.6-1.6z"/><path d="M6.4 8.6h11.2"/><path d="M13.4 3.8v4.8"/>'}
]},

{ c:'Movement & fitness',
  kw:'fitness gym exercise movement training workout strength activity sport physical mobility rehab stretch class coach run cycle walk yoga',
  i:[
  {k:'Dumbbell', d:'<path d="M2.4 9.6v4.8M5.4 7.4v9.2M18.6 7.4v9.2M21.6 9.6v4.8"/><path d="M5.4 12h13.2"/>'},
  {k:'Runner', d:'<circle cx="15.4" cy="4.6" r="2"/><path d="M13.6 21l1.6-5.2-3-2.6-1.2 4"/><path d="M12.2 13.2l1.4-4.6 3.4 2 3 .8"/><path d="M13.6 8.6L9.8 10l-1.6 3"/><path d="M15.2 15.8l2.4 3.2"/>'},
  {k:'Bicycle', d:'<circle cx="5.6" cy="16.8" r="4"/><circle cx="18.4" cy="16.8" r="4"/><path d="M5.6 16.8l4.2-7.6 4.6 7.6"/><path d="M9.8 9.2h4.4"/><path d="M14.4 16.8l2.4-7.6h2.1"/>'},
  {k:'Yoga pose', d:'<circle cx="12" cy="4.4" r="2"/><path d="M12 6.6v6"/><path d="M4.4 9.4l7.6 3.2 7.6-3.2"/><path d="M12 12.6l-4.6 7.4M12 12.6l4.6 7.4"/>'},
  {k:'Medal', d:'<circle cx="12" cy="15" r="5.6"/><path d="M8.6 10.2L6 3.2h4l2.4 5"/><path d="M15.4 10.2L18 3.2h-4l-1.4 3"/><path d="M12 13.2l.8 1.6 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.2z"/>'},
  {k:'Kettlebell', d:'<path d="M9 7.8a3 3 0 0 1 6 0"/><path d="M9.5 7.6C6.5 9 4.7 11.9 4.7 15.3a5.3 5.3 0 0 0 5.3 5.3h4a5.3 5.3 0 0 0 5.3-5.3c0-3.4-1.8-6.3-4.8-7.7z"/>'},
  {k:'Weight plate', d:'<circle cx="12" cy="12" r="8.8"/><circle cx="12" cy="12" r="3"/><path d="M12 3.2v3.4M12 17.4v3.4M3.2 12h3.4M17.4 12h3.4"/>'},
  {k:'Trophy', d:'<path d="M8 4.4h8v5.2a4 4 0 0 1-8 0z"/><path d="M8 5.8H5.4a2.6 2.6 0 0 0 2.8 4.6"/><path d="M16 5.8h2.6a2.6 2.6 0 0 1-2.8 4.6"/><path d="M12 13.6v3.2"/><path d="M9.4 16.8h5.2l.8 3.8H8.6z"/>'},
  {k:'Steps', d:'<path d="M2.8 20.4h4.4v-4.4h4.4v-4.4h4.4V7.2h4.6"/><path d="M20.6 7.2v13.2"/>'},
  {k:'Pulse heart', d:'<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1L12 21l7.7-7.6 1.1-1a5.5 5.5 0 0 0 0-7.8z"/><path d="M4.6 12h3.2l1.6-2.8 2.4 5.6 1.8-3.4 1.2 2h4.6"/>'}
]},

{ c:'Tools & building',
  kw:'build building construction trade contractor renovation repair project install fit tools carpentry roofing plumbing electrical extension site craftsmanship',
  i:[
  {k:'Hammer', d:'<path d="M14.4 7.6l-9.6 9.6a2.2 2.2 0 0 0 3.2 3.2l9.6-9.6"/><path d="M12.8 6l5.2 5.2 3.4-3.4-2-2 1-1-3.2-3.2-1 1-2-2z"/>'},
  {k:'Wrench', d:'<path d="M20 5.2a5.6 5.6 0 0 1-7.4 7.4L5.4 19.8a2.2 2.2 0 0 1-3.2-3.2l7.2-7.2A5.6 5.6 0 0 1 16.8 2z"/>'},
  {k:'Screwdriver', d:'<path d="M15.6 2.8l5.6 5.6-3 3-5.6-5.6z"/><path d="M12.6 5.8l-9 9v5.4H9l9-9"/>'},
  {k:'Hard hat', d:'<path d="M2.8 17.4h18.4v2.4H2.8z"/><path d="M4.8 17.4v-3.6a7.2 7.2 0 0 1 14.4 0v3.6"/><path d="M9.6 6.8V4.4h4.8v2.4"/>'},
  {k:'Ruler', d:'<rect x="1.6" y="8.4" width="20.8" height="7.2" rx="1.6" transform="rotate(-45 12 12)"/><path d="M8.4 8.4l1.6 1.6M11.2 11.2l1.6 1.6M14 14l1.6 1.6"/>'},
  {k:'Paint roller', d:'<rect x="3.2" y="3.6" width="12.4" height="5.2" rx="1.4"/><path d="M15.6 6.2h3.4a1.8 1.8 0 0 1 1.8 1.8v2.6a1.8 1.8 0 0 1-1.8 1.8H11a1.8 1.8 0 0 0-1.8 1.8v1.4"/><rect x="7.4" y="16.2" width="3.6" height="5.2" rx="1.2"/>'},
  {k:'Toolbox', d:'<rect x="2.8" y="8.8" width="18.4" height="10.8" rx="2"/><path d="M8.6 8.8V6.6a1.8 1.8 0 0 1 1.8-1.8h3.2a1.8 1.8 0 0 1 1.8 1.8v2.2"/><path d="M2.8 13.4h18.4"/><path d="M10 13.4v2.4h4v-2.4"/>'},
  {k:'Trowel', d:'<path d="M9.6 12.8L3.2 6.4a1.4 1.4 0 0 1 0-2l1.2-1.2a1.4 1.4 0 0 1 2 0l6.4 6.4z"/><path d="M12.4 10.4l8 8a1.8 1.8 0 0 1-2.6 2.6l-8-8z"/>'},
  {k:'Level', d:'<rect x="1.8" y="8.6" width="20.4" height="6.8" rx="1.6"/><circle cx="12" cy="12" r="1.8"/><path d="M6.4 10.2v3.6M17.6 10.2v3.6"/>'},
  {k:'Brick wall', d:'<rect x="2.8" y="5.2" width="18.4" height="13.6" rx="1.4"/><path d="M2.8 9.8h18.4M2.8 14.2h18.4"/><path d="M9.2 5.2v4.6M15.6 5.2v4.6M6 9.8v4.4M12.4 9.8v4.4M18.8 9.8v4.4M9.2 14.2v4.6M15.6 14.2v4.6"/>'}
]}
];
