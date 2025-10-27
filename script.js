const topics = Array.from({ length: 15 }, (_, i) => ({
  name: `Topic ${i + 1}`,
  code: `console.log("Code snippet for topic ${i + 1}");`,
  image: `images/topic${i + 1}.png`
}));

const list = document.getElementById("topics");

topics.forEach(t => {
  const div = document.createElement("div");
  div.className = "topic-item";
  div.innerHTML = `
    <span>${t.name}</span>
    <button class="copy-btn">Copy</button>
    <span class="download-icon">⬇️</span>
  `;

  // Copy functionality
  div.querySelector(".copy-btn").addEventListener("click", () => {
    navigator.clipboard.writeText(t.code);
    alert(`${t.name} code copied!`);
  });

  // Download functionality
  div.querySelector(".download-icon").addEventListener("click", () => {
    const a = document.createElement("a");
    a.href = t.image;
    a.download = `${t.name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  list.appendChild(div);
});
