function generateTOC() {
const content = document.getElementById('content');
const toc = document.getElementById('toc');
const headings = content.querySelectorAll('h2, h3, h4, h5');
toc.innerHTML = '';
headings.forEach((heading, i) => {
if (!heading.id) heading.id = 'heading-' + i;
});
headings.forEach((heading) => {
const tag = heading.tagName.toLowerCase();
const li = document.createElement('li');
li.className = 'toc-' + tag;
const a = document.createElement('a');
a.href = '#' + heading.id;
a.textContent = heading.textContent;
a.addEventListener('click', function(e) {
e.preventDefault();
document.getElementById(heading.id).scrollIntoView({behavior: "smooth", block: "start"});
history.replaceState(null, null, '#' + heading.id);
if (window.innerWidth <= 768) closeTOC();
});
li.appendChild(a);
toc.appendChild(li);
});
}

function setupScrollSpy() {
const headings = Array.from(document.querySelectorAll('#content h2, #content h3, #content h4, #content h5'));
const tocLinks = Array.from(document.querySelectorAll('#toc a'));
function onScroll() {
let current = headings[0];
for (const heading of headings) {
if (heading.getBoundingClientRect().top <= 120) {
current = heading;
} else {
break;
}}
tocLinks.forEach(link => link.classList.remove('active'));
headings.forEach(h => h.classList.remove('heading-highlight'));
if (current) current.classList.add('heading-highlight');
const activeLink = tocLinks.find(link => link.getAttribute('href') === '#' + current.id);
if (activeLink) {
activeLink.classList.add('active');
const li = activeLink.parentElement;
const container = li.closest('.right');
if (container) {
const liTop = li.offsetTop;
const scrollTarget = liTop - (container.clientHeight / 2) + (li.clientHeight / 2);
container.scrollTo({top: scrollTarget, behavior: 'smooth'});
}}}
window.addEventListener('scroll', onScroll, {passive: true});
window.addEventListener('resize', onScroll);
onScroll();
}

function toggleTOC() {
tocPanel.classList.toggle('open');
tocToggleBtn.setAttribute('aria-expanded', tocPanel.classList.contains('open'));
if (tocPanel.classList.contains('open')) {
tocToggleBtn.classList.add('hidden');
console.log('TOC öppnad: knappen DOLD');
} else {
setTimeout(() => {
tocToggleBtn.classList.remove('hidden');
}, 500);
}}

function closeTOC() {
tocPanel.classList.remove('open');
tocToggleBtn.setAttribute('aria-expanded', 'false');
setTimeout(() => {
tocToggleBtn.classList.remove('hidden');
}, 500);
console.log('TOC stängd: knappen SYNLIG');
}

window.addEventListener('DOMContentLoaded', () => {
generateTOC();
setupScrollSpy();
});

const tocPanel = document.querySelector('.right');
const backdrop = document.querySelector('.toc-backdrop');
const tocToggleBtn = document.querySelector('.toc-toggle');

tocToggleBtn.addEventListener('click', toggleTOC);
backdrop.addEventListener('click', closeTOC);
document.addEventListener('keydown', (e) => {
if (e.key === 'Escape') closeTOC();
});

function estimateReadingTime(divId, outputId) {
const div = document.getElementById(divId);
if (!div) return;
const text = div.textContent || div.innerText;
const words = text.trim().split(/\s+/).filter(word => word.length > 0);
const wordCount = words.length;
const speeds = [500, 250, 200, 100];
const times = speeds.map(speed => Math.ceil(wordCount / speed));
const formatTime = (time) => time === 1 ? "minut" : "minuter";
const estimatedTime = `${times[0]} till ${times[3]} ${formatTime(times[3])} lästid`;
const outputSpan = document.getElementById(outputId);
if (outputSpan) outputSpan.textContent = estimatedTime;
}
estimateReadingTime('content', 'ult');

document.querySelectorAll('#content a').forEach(link => {
if (!link.classList.contains('mdlank') && !link.classList.contains('kopiera-dela')) {
link.classList.add('mdlank');
}});

function findNearestHeading(el) {
while (el && el !== document) {
el = el.previousElementSibling || el.parentElement;
if (!el) break;
if (/^H[1-6]$/i.test(el.tagName)) {
return el;
}}
return null;
}

function collectContentFromHeading(heading) {
const collected = [];
let current = heading;
let first = true;
while (current) {
if (!first && /^H[1-6]$/i.test(current.tagName)) {
break;
}
if (!current.classList?.contains('kopiera-dela')) {
collected.push(current);
}
current = current.nextElementSibling;
first = false;
}
return collected;
}

function processNode(node) {
if (node.nodeType === Node.TEXT_NODE) return node.textContent;
if (node.nodeType !== Node.ELEMENT_NODE) return '';
if (node.tagName === 'A') return `${node.textContent} (${node.href})`;
if (node.tagName === 'DETAILS') {
let detailsContent = '';
const summary = node.querySelector('SUMMARY');
if (summary) detailsContent += `${summary.textContent}\n`;
const content = node.querySelector('SUMMARY')?.nextElementSibling;
if (content) detailsContent += `\n${processNode(content)}\n`;
return detailsContent;
}
if (node.tagName === 'P' || node.tagName.match(/^H[1-6]$/i) || node.tagName === 'OL' || node.tagName === 'UL') {
const processedContent = Array.from(node.childNodes).map(child => processNode(child)).join('');
return processedContent + '\n\n';
}
if (node.tagName === 'LI') {
const processedContent = Array.from(node.childNodes).map(child => processNode(child)).join('');
return `• ${processedContent}\n`;
}
return Array.from(node.childNodes).map(child => processNode(child)).join('');
}

document.querySelectorAll('.kopiera-dela').forEach(copyLink => {
const heading = findNearestHeading(copyLink);
if (heading) {
copyLink.textContent = `Kopiera ${heading.textContent.trim()}`;
}
});

document.querySelectorAll('.kopiera-dela').forEach(copyLink => {
copyLink.addEventListener('click', (event) => {
event.preventDefault();
const heading = findNearestHeading(copyLink);
if (!heading) return;
const nodesToCopy = collectContentFromHeading(heading);
const sectionContent = nodesToCopy.map(node => processNode(node)).join('');
const originalText = copyLink.textContent;
navigator.clipboard.writeText(sectionContent)
.then(() => {
copyLink.textContent = 'Kopierat!';
copyLink.classList.add('copied');
setTimeout(() => {
copyLink.textContent = originalText;
copyLink.classList.remove('copied');
}, 2000);
})
.catch(() => {
console.log('Kopiering ej utförd.');
});
});
});

const btcAddress = "xxxx"; 
const amountSek = 100;
const label = "covid19vaccinen.se";
const message = "Tack för din donation på 100 SEK!";
const labelEncoded = encodeURIComponent(label);
const messageEncoded = encodeURIComponent(message);
fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=sek")
.then(res => res.json())
.then(data => {
const btcSek = data.bitcoin.sek; 
const btcAmount = (amountSek / btcSek).toFixed(8); 
const link = `bitcoin:${btcAddress}?amount=${btcAmount}&label=${labelEncoded}&message=${messageEncoded}`;
const linkEl = document.getElementById("btcLink");
linkEl.setAttribute("href", link);
linkEl.innerText = `Donera ${amountSek} kr i BTC till ${label}`;
})
.catch(err => console.error("BTC-kurs gick EJ att hämta:", err));

const kakorDiv = document.getElementById('kakor');
const kakorButton = document.getElementById('kakor-ok');
const pTag = kakorDiv.querySelector('p');
function updateText() {
const url = window.location.href;
const subject = encodeURIComponent(`Hittade fel på denna URL: ${url}`);
const body = encodeURIComponent(`Jag vill anmäla följande fel:\n\nURL: ${url}`);
const contactLink = `<a href="mailto:contact@example.com?subject=${subject}&body=${body}" target="_blank" rel="noopener noreferrer">Rapportera hit</a>`;
pTag.innerHTML += `<br><br><strong>Hittat ett fel?</strong> ${contactLink}.`;
}
function checkKakor() {
if (localStorage.getItem('kakorAccepted') === 'true') {
kakorDiv.style.display = 'none';
} else {
kakorDiv.style.display = 'flex';
updateText();
}}
kakorButton.addEventListener('click', () => {
localStorage.setItem('kakorAccepted', 'true');
kakorDiv.style.display = 'none';
});
checkKakor();

window.addEventListener('beforeprint', function() {
document.querySelectorAll('details').forEach(detail => {
detail.open = true;
});
document.querySelectorAll('summary').forEach(summary => {
summary.style.display = 'none';
});
});
window.addEventListener('afterprint', function() {
document.querySelectorAll('details').forEach(detail => {
detail.open = false;
});
document.querySelectorAll('summary').forEach(summary => {
summary.style.display = '';
});
});

const shareLink = document.getElementById('shareLink');
const xIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style="width:1.3rem;height:1.3rem;vertical-align:middle;margin-right:0.25rem;"><path d="M17.58,17.33l-5.863-8.548l0.01,0.008L17.013,2.667h-1.767l-4.307,4.987L7.52,2.667H2.887l5.474,7.981l-0.668,0.667L2.587,17.33 h1.767l4.788-5.548l3.825,5.548H17.58z M6.82,4l8.227,12h-1.4L5.413,4H6.82z"/></svg>`;
shareLink.innerHTML = `${xIcon} dela`;
shareLink.addEventListener('click', function(e) {
e.preventDefault();
let textToShare = typeof getCleanText === 'function' ? getCleanText(document.body) : document.title;
const pageUrl = encodeURIComponent(window.location.href);
const shareText = encodeURIComponent(textToShare);
const xUrl = `https://x.com/intent/tweet?url=${pageUrl}&text=${shareText}`;
window.open(xUrl, '_blank', 'noopener,noreferrer,nofollow');
});
