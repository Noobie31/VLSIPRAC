// expects: topics.json at root, and images in /topics/1.png ... /topics/15.png

async function loadTopics() {
  try {
    const res = await fetch('topics.json', { cache: 'no-store' });
    const data = await res.json(); // { topics: [{title, body}, ...] }

    const root = document.getElementById('topics-list');
    root.innerHTML = '';

    data.topics.slice(0, 15).forEach((t, idx) => {
      const row = document.createElement('div');
      row.className = 'topic-row';

      const title = document.createElement('div');
      title.className = 'topic-title';
      title.textContent = t.title;

      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(t.body);
          const old = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = old), 900);
        } catch {
          alert('Copy failed');
        }
      });

      const dlBtn = document.createElement('button');
      dlBtn.className = 'btn btn-icon';
      dlBtn.title = 'Download image';
      dlBtn.textContent = '⬇️';
      dlBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = `topics/${idx + 1}.png`;
        a.download = `${t.title || 'topic'}-${idx + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      row.appendChild(title);
      row.appendChild(copyBtn);
      row.appendChild(dlBtn);
      root.appendChild(row);
    });
  } catch (e) {
    console.error('Failed to load topics.json', e);
  }
}

loadTopics();
