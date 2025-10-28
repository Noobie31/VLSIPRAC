// expects: topics.json at root, and images in /topics/1.png ... /topics/15.png

async function loadTopics() {
  try {
    const res = await fetch('topics.json', { cache: 'no-store' });
    const data = await res.json();

    const leftCol = document.getElementById('topics-left');
    const rightCol = document.getElementById('topics-right');
    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    data.topics.slice(0, 15).forEach((t, i) => {
      const row = document.createElement('div');
      row.className = 'topic-row';

      // Topic title
      const title = document.createElement('div');
      title.className = 'topic-title';
      title.textContent = t.title;

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'btn';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(t.body);
          const oldText = copyBtn.textContent;
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = oldText), 900);
        } catch {
          alert('Copy failed');
        }
      });

      // Download button (plain text version)jkkkkkkkkkssss
      const dlBtn = document.createElement('button');
      dlBtn.className = 'btn btn-download';
      dlBtn.textContent = 'D';
      dlBtn.title = 'Download image';
      dlBtn.addEventListener('click', () => {
        const a = document.createElement('a');
        a.href = `topics/${i + 1}.png`;
        a.download = `${t.title || 'topic'}-${i + 1}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });

      // Assemble row
      row.appendChild(title);
      row.appendChild(copyBtn);
      row.appendChild(dlBtn);

      // Alternate left/right columns
      (i % 2 === 0 ? leftCol : rightCol).appendChild(row);
    });
  } catch (e) {
    console.error('Failed to load topics.json', e);
  }
}

loadTopics();
