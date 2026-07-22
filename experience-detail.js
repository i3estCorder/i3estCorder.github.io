(() => {
  const details = {
    '01': {
      index: '01 // ANDROID',
      title: 'Android Project Setup & Patch Integration',
      summary: 'A dummy case study about preparing a repeatable Android project workflow.',
      focus: 'Placeholder detail: organize project setup steps, apply patches consistently, and document a clear handoff path.',
      outcome: 'Placeholder outcome: a more predictable setup flow with easier maintenance checkpoints.'
    },
    '02': {
      index: '02 // ANDROID XR',
      title: 'Environment Setup & Patch Management for Android XR & Applied Tasks',
      summary: 'A dummy case study about coordinating an XR environment with applied engineering tasks.',
      focus: 'Placeholder detail: align environment preparation, patch tracking, and task-specific validation in one workflow.',
      outcome: 'Placeholder outcome: clearer environment status and a simpler path from setup to task execution.'
    },
    '03': {
      index: '03 // AUTOMATION',
      title: 'Script Automation for Setup & Patching, Infrastructure Maintenance & System Operations',
      summary: 'A dummy case study about reducing repetitive setup and maintenance work with scripts.',
      focus: 'Placeholder detail: turn repeated setup, patching, and maintenance actions into documented automation steps.',
      outcome: 'Placeholder outcome: fewer manual repetitions and more consistent operational checks.'
    },
    '04': {
      index: '04 // AI / AX',
      title: 'Active Participation in AI/AX Challenges and Task Force (TF) Initiatives',
      summary: 'A dummy case study about exploring AI/AX ideas through challenge and task-force activities.',
      focus: 'Placeholder detail: collaborate on experiments, frame practical questions, and share useful findings with a team.',
      outcome: 'Placeholder outcome: a stronger habit of connecting experimentation with actionable workflow improvements.'
    }
  };

  const item = details[new URLSearchParams(window.location.search).get('item')] || details['01'];
  document.querySelector('#detail-index').textContent = item.index;
  document.querySelector('#detail-title').textContent = item.title;
  document.querySelector('#detail-summary').textContent = item.summary;
  document.querySelector('#detail-focus').textContent = item.focus;
  document.querySelector('#detail-outcome').textContent = item.outcome;
  document.title = `${item.title} // Justin`;
})();
