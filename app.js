// Semua isi (skill, kategori, profil footer) ada di skills.json. File ini cuma nampilin dan nyari.
(async () => {
  const $ = (id) => document.getElementById(id);
  const catalog = $('catalog');
  const input = $('q');
  const clear = $('clear');
  const count = $('count');
  const tabs = $('tabs');

  let data;
  try {
    data = await (await fetch('skills.json')).json();
  } catch (e) {
    catalog.innerHTML = '<p class="empty">Skill gagal dimuat. Coba refresh halaman.</p>';
    return;
  }
  const { categories, skills, profile } = data;
  let category = 'Semua';

  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  // Jarak edit: bikin pencarian tetap ketemu walau salah ketik satu dua huruf.
  function distance(a, b) {
    let row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      const next = [i];
      for (let j = 1; j <= b.length; j++) {
        next[j] = Math.min(next[j - 1] + 1, row[j] + 1, row[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      row = next;
    }
    return row[b.length];
  }

  function score(skill, query) {
    const tokens = norm(query).trim().split(/\s+/).filter(Boolean);
    if (!tokens.length) return 1;
    const words = norm([skill.name, skill.desc, skill.category, skill.tag].join(' ')).split(/[^a-z0-9]+/).filter(Boolean);
    let total = 0;
    for (const token of tokens) {
      let best = 0;
      for (const word of words) {
        if (word.includes(token)) best = Math.max(best, 10);
        else if (token.length >= 3) {
          const d = distance(token, word);
          if (d <= (token.length >= 6 ? 2 : 1)) best = Math.max(best, 6 - d);
        }
      }
      if (!best) return 0;
      total += best;
    }
    return total + (norm(skill.name).includes(norm(query).trim()) ? 15 : 0);
  }

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  const initials = (name) =>
    name.split('/').pop().replace(/[^A-Za-z0-9]/g, ' ').trim().split(/\s+/).slice(0, 2)
      .map((w) => w[0].toUpperCase()).join('');

  function card(s) {
    const c = el(s.url ? 'a' : 'div', 'card');
    if (s.url) {
      c.href = s.url; c.target = '_blank'; c.rel = 'noopener noreferrer';
      c.setAttribute('aria-label', s.name + ', buka di GitHub (tab baru)');
    }
    const thumb = el('div', 'thumb');
    thumb.append(el('span', 'initials', initials(s.name)), el('span', 'tag' + (s.tag === 'Skill gw' ? ' own' : ''), s.tag));
    const info = el('div', 'info');
    info.append(
      el('div', 'name', s.name),
      el('div', 'desc', s.desc),
      el('div', 'go' + (s.url ? '' : ' own'), s.url ? 'Buka di GitHub ↗' : 'Skill pribadi')
    );
    c.append(thumb, info);
    return c;
  }

  function renderTabs() {
    tabs.replaceChildren();
    for (const name of ['Semua', ...categories]) {
      const n = name === 'Semua' ? skills.length : skills.filter((s) => s.category === name).length;
      const b = el('button', 'tab', name);
      b.type = 'button';
      b.setAttribute('aria-pressed', String(name === category));
      b.append(el('small', null, String(n)));
      b.addEventListener('click', () => { category = name; render(); });
      tabs.append(b);
    }
  }

  function render() {
    const query = input.value.trim();
    const ranked = skills
      .map((skill) => ({ skill, score: score(skill, query) }))
      .filter((r) => r.score > 0 && (category === 'Semua' || r.skill.category === category))
      .sort((a, b) => b.score - a.score);

    catalog.replaceChildren();
    for (const name of categories) {
      const items = ranked.filter((r) => r.skill.category === name);
      if (!items.length) continue;
      const group = el('section', 'group');
      group.setAttribute('aria-label', name);
      const head = el('div', 'group-head');
      head.append(el('h2', null, name), el('span', 'rule'), el('small', null, items.length + ' skill'));
      const grid = el('div', 'grid');
      items.forEach((r) => grid.append(card(r.skill)));
      group.append(head, grid);
      catalog.append(group);
    }
    if (!ranked.length) catalog.append(el('p', 'empty', 'Belum ada yang cocok. Coba kata lain atau kategori Semua.'));

    count.textContent = ranked.length + ' skill' + (query ? ' ditemukan' : '');
    clear.hidden = !input.value;
    renderTabs();
  }

  function renderFooter() {
    const f = $('footer');
    const who = el('div', 'who');
    who.append(el('strong', null, profile.name), el('span', 'role', profile.role), el('p', null, profile.blurb));
    const links = el('div', 'links');
    for (const l of profile.links) {
      const a = el('a', 'btn' + (l.primary ? ' primary' : ''), l.label);
      a.href = l.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      links.append(a);
    }
    f.append(who, links);
  }

  input.addEventListener('input', render);
  clear.addEventListener('click', () => { input.value = ''; render(); input.focus(); });
  render();
  renderFooter();
})();
