const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const cycle = (index, length) => (index + length) % length;
const counter = (index, length) =>
  String(index + 1).padStart(2, '0') + ' / ' + String(length).padStart(2, '0');

function selectButton(buttons, index) {
  buttons.forEach((button, position) => {
    button.setAttribute('aria-pressed', String(position === index));
  });
}

function animateChange(element) {
  element.classList.remove('swap');
  void element.offsetWidth;
  element.classList.add('swap');
}

const libraryButton = $('.library-button');
const libraryNote = $('#library-note');
libraryButton.addEventListener('click', () => {
  const illuminated = $('.hero').classList.toggle('library-lit');
  libraryButton.setAttribute('aria-expanded', String(illuminated));
  $('#library-label').textContent = illuminated ? 'Bajar la luz' : 'Iluminar la biblioteca';
  libraryNote.hidden = !illuminated;
  if (illuminated) animateChange(libraryNote);
});

const starMessages = [
  {
    title: 'Gracias a Dios por tu vida',
    note: 'Que esta Navidad sea una oportunidad para agradecer los buenos momentos y disfrutar del tiempo con tu familia y tus amigos.'
  },
  {
    title: 'Ánimo para seguir aprendiendo',
    note: 'Que Dios te dé constancia en Derecho y que lo que aprendas te ayude a servir a otras personas.'
  },
  {
    title: 'Confianza en el Señor',
    note: 'Que encuentres paz al confiarle a Dios tus planes y alegría al ver cómo él va guiando tus pasos.'
  }
];
const stars = $$('[data-star]');
stars.forEach((button, index) => {
  button.addEventListener('click', () => {
    const message = starMessages[index];
    const panel = $('.star-message');
    $('#star-title').textContent = message.title;
    $('#star-note').textContent = message.note;
    $('.star-map').dataset.lit = String(index);
    selectButton(stars, index);
    button.classList.remove('star-burst');
    void button.offsetWidth;
    button.classList.add('star-burst');
    animateChange(panel);
    const bounds = panel.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
      panel.scrollIntoView({ block: 'nearest' });
    }
  });
});

const soundButton = $('.sound-button');
const christmasSong = $('#christmas-song');
christmasSong.volume = .55;

function updateMusicControl() {
  const playing = !christmasSong.paused;
  soundButton.setAttribute('aria-pressed', String(playing));
  soundButton.title = playing ? 'Pausar En Lo Alto Gloria' : 'Reproducir En Lo Alto Gloria';
}

function playChristmasSong() {
  christmasSong.play().catch((error) => {
    if (error.name === 'NotAllowedError' || error.name === 'AbortError') return;
    soundButton.title = 'No se pudo reproducir la canción. Inténtalo de nuevo.';
  });
}

function playOnFirstClick(event) {
  if (!event.isTrusted || soundButton.contains(event.target)) return;
  playChristmasSong();
}

document.addEventListener('click', playOnFirstClick, true);
christmasSong.addEventListener('play', () => {
  document.removeEventListener('click', playOnFirstClick, true);
  updateMusicControl();
});
christmasSong.addEventListener('pause', updateMusicControl);
soundButton.addEventListener('click', () => {
  document.removeEventListener('click', playOnFirstClick, true);
  if (christmasSong.paused) playChristmasSong();
  else christmasSong.pause();
});
playChristmasSong();

const photos = [
  { alt: 'Retrato al sol en un parque', note: 'Que nunca falten los días en los que puedas salir, respirar y disfrutar del sol.' },
  { alt: 'Selfie de grupo junto a unas escaleras con murales', note: 'Ojalá siempre tengas con quién compartir una salida y reírte hasta que salga la foto.' },
  { alt: 'Cuatro personas reunidas junto a una mesa', note: 'Que esta Navidad también haya tiempo para sentarse juntos y tomarse una foto más.' },
  { alt: 'Una mujer sostiene a una niña pequeña bajo los árboles', note: 'Hay algo muy tierno en volver a mirar las fotos de cuando eras pequeña.' },
  { alt: 'Cinco personas sobre el césped con globos de cumpleaños', note: 'Un cumpleaños al aire libre, globos azules y todos juntos en la misma foto.' },
  { alt: 'Una niña pequeña junto a un adulto frente a una torta', note: 'De esos recuerdos de infancia que da gusto volver a encontrar.' },
  { alt: 'Retrato al atardecer con la mejilla apoyada en la mano', note: 'Que entre tantas cosas por hacer siempre quede un rato tranquilo para ti.' }
];

const photoButtons = $$('[data-photo]');
const photo = $('#photo');
const viewer = $('.viewer');
const viewerImage = $('#viewer-image');
let photoIndex = 0;

function updateViewer() {
  viewerImage.src = photo.src;
  viewerImage.alt = photo.alt;
  $('#viewer-caption').textContent = $('#photo-title').textContent;
}

function showPhoto(index) {
  photoIndex = cycle(index, photos.length);
  const memory = photos[photoIndex];
  const button = photoButtons[photoIndex];
  photo.src = button.querySelector('img').src;
  photo.alt = memory.alt;
  $('#photo-title').textContent = button.getAttribute('aria-label');
  $('#photo-note').textContent = memory.note;
  $('#photo-count').textContent = counter(photoIndex, photos.length);
  selectButton(photoButtons, photoIndex);
  animateChange(photo);
  animateChange($('#photo-title'));
  if (viewer.open) updateViewer();
}

const albumPlayer = $('.play-album');
const albumTimer = $('.album-timer');
const photoDuration = 5500;
let albumInterval;

function stopAlbum() {
  clearInterval(albumInterval);
  albumInterval = undefined;
  albumTimer.classList.remove('counting');
  $('.play-label').textContent = 'Reproducir recuerdos';
  $('.play-icon').textContent = '▶';
  $('.album-card').setAttribute('aria-live', 'polite');
}

function restartAlbumTimer() {
  albumTimer.classList.remove('counting');
  void albumTimer.offsetWidth;
  albumTimer.classList.add('counting');
}

albumTimer.style.setProperty('--photo-duration', photoDuration + 'ms');
albumPlayer.addEventListener('click', () => {
  if (albumInterval !== undefined) {
    stopAlbum();
    return;
  }
  $('.album-card').setAttribute('aria-live', 'off');
  if (photoIndex === photos.length - 1) showPhoto(0);
  $('.play-label').textContent = 'Pausar recuerdos';
  $('.play-icon').textContent = 'Ⅱ';
  restartAlbumTimer();
  albumInterval = setInterval(() => {
    if (photoIndex === photos.length - 1) {
      stopAlbum();
      return;
    }
    showPhoto(photoIndex + 1);
    restartAlbumTimer();
  }, photoDuration);
});

const albumVisibility = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting && albumInterval !== undefined) stopAlbum();
});
albumVisibility.observe($('#recuerdos'));
document.addEventListener('visibilitychange', () => {
  if (document.hidden && albumInterval !== undefined) stopAlbum();
});

function choosePhoto(index) {
  if (albumInterval !== undefined) stopAlbum();
  showPhoto(index);
}

photoButtons.forEach((button, index) => {
  button.addEventListener('click', () => choosePhoto(index));
});
for (const scope of ['photo', 'viewer']) {
  $('#' + scope + '-prev').addEventListener('click', () => choosePhoto(photoIndex - 1));
  $('#' + scope + '-next').addEventListener('click', () => choosePhoto(photoIndex + 1));
}
const photoStage = $('.stage');
let touchStart;
let didSwipe = false;
photoStage.addEventListener('pointerdown', (event) => {
  didSwipe = false;
  if (event.pointerType !== 'touch' || !event.isPrimary) return;
  touchStart = { x: event.clientX, y: event.clientY };
});
photoStage.addEventListener('pointercancel', () => { touchStart = undefined; });
photoStage.addEventListener('pointerup', (event) => {
  if (event.pointerType !== 'touch' || !event.isPrimary || !touchStart) return;
  const horizontal = event.clientX - touchStart.x;
  const vertical = event.clientY - touchStart.y;
  touchStart = undefined;
  if (Math.abs(horizontal) < 48 || Math.abs(horizontal) < Math.abs(vertical) * 1.4) return;
  didSwipe = true;
  choosePhoto(photoIndex + (horizontal < 0 ? 1 : -1));
});
photoStage.addEventListener('click', (event) => {
  if (didSwipe && event.detail > 0) {
    didSwipe = false;
    return;
  }
  if (albumInterval !== undefined) stopAlbum();
  updateViewer();
  viewer.showModal();
});
viewer.addEventListener('click', (event) => {
  if (event.target !== viewer) return;
  const box = viewer.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right ||
      event.clientY < box.top || event.clientY > box.bottom) viewer.close();
});
viewer.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  showPhoto(photoIndex + (event.key === 'ArrowLeft' ? -1 : 1));
});

const wishes = [
  'Que tengas el valor de defender lo justo, incluso cuando sea difícil.',
  'Que Dios te dé criterio para distinguir lo importante y calma para decidir.',
  'Que conserves la sensibilidad para escuchar la historia que hay detrás de cada caso.'
];
const valueButtons = $$('[data-value]');
valueButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    const note = $('#value-note');
    note.textContent = wishes[index];
    selectButton(valueButtons, index);
    animateChange(note);
  });
});

const verses = [
  {
    reference: 'Lucas 2:11', passage: 'Lucas 2',
    quote: 'Que os ha nacido hoy, en la ciudad de David, un Salvador, que es CRISTO el Señor.',
    note: 'En Belén, Dios se acercó a nosotros en Jesús. Que esa alegría vuelva a llenar tu casa esta Navidad.'
  },
  {
    reference: 'Isaías 43:4', passage: 'Isaías 43',
    quote: 'Porque en mis ojos fuiste de grande estima, fuiste honorable, y yo te amé […]',
    note: 'Dios le recordó a Israel cuánto lo amaba. Que estas palabras también te recuerden que tu valor va mucho más allá de una nota o un logro.'
  },
  {
    reference: 'Salmo 139:14', passage: 'Salmos 139',
    quote: 'Te alabaré; porque formidables, maravillosas son tus obras […]',
    note: 'Que puedas mirar tu propia historia con gratitud. Dios conoce hasta esos detalles de ti que pasan desapercibidos para otros.'
  },
  {
    reference: 'Miqueas 6:8', passage: 'Miqueas 6',
    quote: '[…] hacer juicio, y amar misericordia, y humillarte para andar con tu Dios.',
    note: 'Me gusta que este pasaje ponga juntas la justicia y la misericordia. Deseo que ambas te acompañen en el Derecho.'
  },
  {
    reference: 'Santiago 1:5', passage: 'Santiago 1',
    quote: 'Y si alguno de vosotros tiene falta de sabiduría, demándela á Dios, el cual da á todos abundantemente […]',
    note: 'Cuando toque elegir y las respuestas no sean claras, puedes pedirle a Dios sabiduría y darte tiempo para decidir.'
  },
  {
    reference: 'Josué 1:6', passage: 'Josué 1',
    quote: 'Esfuérzate y sé valiente […]',
    note: 'Si un día se vuelve pesado, que estas palabras te animen a dar el siguiente paso. A veces basta con eso por hoy.'
  },
  {
    reference: 'Eclesiastés 3:11', passage: 'Eclesiastés 3',
    quote: 'Todo lo hizo hermoso en su tiempo […]',
    note: 'Me da paz pensar que podemos agradecer lo que vivimos hoy y confiarle a Dios lo que aún está por venir.'
  }
];
const verseButtons = $$('[data-verse]');
let verseIndex = 1;
function showVerse(index) {
  verseIndex = cycle(index, verses.length);
  const verse = verses[verseIndex];
  const reference = $('#verse-ref');
  $('#verse-text').textContent = '«' + verse.quote + '»';
  reference.textContent = verse.reference + ' ↗';
  reference.href = 'https://www.biblegateway.com/passage/?search=' +
    encodeURIComponent(verse.passage) + '&version=RVA';
  $('#verse-note').textContent = verse.note;
  $('#verse-count').textContent = counter(verseIndex, verses.length);
  selectButton(verseButtons, verseIndex);
  animateChange($('.verse-page'));
}
verseButtons.forEach((button, index) => {
  button.addEventListener('click', () => showVerse(index));
});
$('#verse-prev').addEventListener('click', () => showVerse(verseIndex - 1));
$('#verse-next').addEventListener('click', () => showVerse(verseIndex + 1));

const treeScene = $('.wish-tree-scene');
const treeOrnaments = $$('.tree-ornament');
const treeWishes = [
  ['Paz para decidir', 'Que Dios te dé calma para escuchar, pensar y elegir con claridad cuando tengas una decisión difícil.'],
  ['Valentía para seguir', 'Que en los días exigentes de Derecho puedas reconocer cuánto has avanzado y tengas fuerzas para dar el siguiente paso.'],
  ['Alegría en lo cotidiano', 'Que encuentres tiempo para reír con los tuyos, descansar y disfrutar de las pequeñas cosas que Dios te regala.']
];
treeOrnaments.forEach((ornament) => {
  ornament.addEventListener('click', () => {
    const lit = ornament.getAttribute('aria-pressed') !== 'true';
    ornament.setAttribute('aria-pressed', String(lit));
    const illuminated = treeOrnaments.filter((item) => item.getAttribute('aria-pressed') === 'true');
    const current = lit ? ornament : illuminated.at(-1);
    const [title, wish] = current ? treeWishes[Number(current.dataset.wish)] : ['Para el año que viene', ''];
    $('.tree-count').textContent = illuminated.length + ' de 3 luces encendidas';
    $('.tree-wish-title').textContent = title;
    $('.tree-wish-text').textContent = wish;
    treeScene.classList.toggle('tree-lit', illuminated.length === treeOrnaments.length);
    $('.tree-finale').hidden = illuminated.length !== treeOrnaments.length;
    animateChange($('.wish-tree-note'));
  });
});

const lightButton = $('.light-button');
const candleSparks = $('.candle-sparks');
for (let index = 0; index < 16; index += 1) {
  const spark = document.createElement('i');
  const angle = index * Math.PI * 2 / 16;
  spark.style.setProperty('--dx', Math.round(Math.cos(angle) * (65 + index % 3 * 25)) + 'px');
  spark.style.setProperty('--dy', Math.round(Math.sin(angle) * 72 - 30) + 'px');
  spark.style.setProperty('--spark-delay', (index % 4) * 54 + 'ms');
  candleSparks.append(spark);
}
lightButton.addEventListener('click', () => {
  const lit = $('#bendicion').classList.toggle('lit');
  lightButton.setAttribute('aria-pressed', String(lit));
  $('#light-label').textContent = lit ? 'Apagar la vela' : 'Encender la vela';
  const message = $('.light-message');
  message.textContent = lit ? 'Que la luz de Jesús acompañe a tu familia y guíe tus pasos, Coraima.' : '';
  if (lit) animateChange(message);
});

const postcard = $('.postcard');
const flipPostcard = $('.flip-postcard');
flipPostcard.addEventListener('click', () => {
  const showBack = postcard.dataset.side !== 'back';
  postcard.dataset.side = showBack ? 'back' : 'front';
  $('.postcard-front').setAttribute('aria-hidden', String(showBack));
  $('.postcard-back').setAttribute('aria-hidden', String(!showBack));
  flipPostcard.setAttribute('aria-pressed', String(showBack));
  flipPostcard.textContent = showBack ? 'Ver la portada' : 'Ver el reverso';
});

const savePostcard = $('.save-postcard');
savePostcard.addEventListener('click', async () => {
  const status = $('.postcard-status');
  savePostcard.disabled = true;
  status.textContent = 'Preparando la postal…';
  try {
    const artwork = $('.postcard-front img');
    await artwork.decode();
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1250;
    const ink = canvas.getContext('2d');
    const scale = Math.max(canvas.width / artwork.naturalWidth, canvas.height / artwork.naturalHeight);
    const width = artwork.naturalWidth * scale;
    const height = artwork.naturalHeight * scale;
    ink.drawImage(artwork, (canvas.width - width) / 2, (canvas.height - height) * .15, width, height);

    const shade = ink.createLinearGradient(0, canvas.height, 0, 0);
    shade.addColorStop(0, '#0d2228c9');
    shade.addColorStop(.54, '#0d222861');
    shade.addColorStop(.82, '#0d222800');
    ink.fillStyle = shade;
    ink.fillRect(0, 0, canvas.width, canvas.height);
    ink.strokeStyle = '#edc98ca8';
    ink.lineWidth = 2;
    ink.strokeRect(40, 50, 920, 1150);
    ink.strokeRect(46, 56, 908, 1138);

    ink.textBaseline = 'top';
    ink.textAlign = 'center';
    ink.fillStyle = '#f1ce98';
    ink.font = 'italic 72px "Instrument Serif", Georgia, serif';
    ink.fillText($('.postcard-greeting').textContent, 500, 438, 860);
    ink.fillStyle = '#fff0da';
    ink.font = '235px "Instrument Serif", Georgia, serif';
    ink.fillText($('.postcard-name').textContent, 500, 515, 860);
    ink.font = '51px Georgia, serif';
    $$('.postcard-wish span').forEach((line, index) => {
      ink.fillText(line.textContent, 500, 797 + index * 62, 860);
    });
    ink.fillStyle = '#f0ca92';
    ink.font = 'italic 42px Georgia, serif';
    ink.fillText($('.postcard-from').textContent, 500, 970, 860);
    ink.font = 'bold 26px system-ui, sans-serif';
    ink.fillText($('.postcard-date').textContent, 500, 1064, 860);

    const image = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (!image) throw new Error('No se pudo crear el PNG');
    const url = URL.createObjectURL(image);
    const download = document.createElement('a');
    download.href = url;
    download.download = 'Postal de Navidad para Coraima.png';
    document.body.append(download);
    download.click();
    download.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    status.textContent = 'Postal lista en formato PNG.';
  } catch {
    status.textContent = 'No se pudo guardar la postal. Vuelve a intentarlo.';
  } finally {
    savePostcard.disabled = false;
  }
});

const root = document.documentElement;
const hero = $('.hero');
const motionButton = $('.motion');
const motionPreference = matchMedia('(prefers-reduced-motion: reduce)');
const snow = $('.snow');
for (let index = 0; index < 48; index += 1) {
  const flake = document.createElement('i');
  flake.style.setProperty('--x', ((index * 37) % 100) + '%');
  flake.style.setProperty('--size', (1 + (index % 4)) + 'px');
  flake.style.setProperty('--delay', -(index * .64) + 's');
  flake.style.setProperty('--duration', (9 + index % 13) + 's');
  snow.append(flake);
}
function setMotion(enabled) {
  root.classList.toggle('motion-off', !enabled);
  motionButton.setAttribute('aria-pressed', String(enabled));
  $('.motion-text').textContent = enabled ? 'Pausar movimiento' : 'Activar movimiento';
}
root.classList.add('js-motion');
setMotion(!motionPreference.matches);
motionPreference.addEventListener('change', (event) => setMotion(!event.matches));
motionButton.addEventListener('click', () => setMotion(root.classList.contains('motion-off')));

hero.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || root.classList.contains('motion-off')) return;
  const box = hero.getBoundingClientRect();
  hero.style.setProperty('--scene-x', ((event.clientX - box.left) / box.width - .5) * 15 + 'px');
  hero.style.setProperty('--scene-y', ((event.clientY - box.top) / box.height - .5) * 12 + 'px');
});
hero.addEventListener('pointerleave', () => {
  hero.style.removeProperty('--scene-x');
  hero.style.removeProperty('--scene-y');
});

function prepareTitle(title, byLetter) {
  const original = title.textContent.trim();
  const isHeading = title.matches('h1,h2');
  const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);
  let index = 0;
  for (const node of textNodes) {
    const pieces = byLetter ? Array.from(node.data) : node.data.split(/(\s+)/);
    const fragment = document.createDocumentFragment();
    for (const piece of pieces) {
      if (!piece.trim()) {
        fragment.append(piece);
        continue;
      }
      const segment = document.createElement('span');
      segment.className = 'title-segment';
      segment.setAttribute('aria-hidden', 'true');
      segment.style.setProperty('--segment', String(index++));
      if (byLetter) {
        segment.classList.add('title-glyph');
        segment.textContent = piece;
      } else {
        for (const letter of Array.from(piece)) {
          const glyph = document.createElement('span');
          glyph.className = 'title-glyph';
          glyph.textContent = letter;
          segment.append(glyph);
        }
      }
      fragment.append(segment);
    }
    node.replaceWith(fragment);
  }
  if (isHeading) {
    title.setAttribute('aria-label', original);
  } else {
    const readable = document.createElement('span');
    readable.className = 'title-readable';
    readable.textContent = original;
    title.append(readable);
  }
  title.classList.add('animated-title');
}

$('.welcome-link').addEventListener('click', () => {
  $('.letter-envelope').open = true;
});

prepareTitle($('h1'), true);
prepareTitle($('.holiday'), false);
for (const title of $$('main h2')) prepareTitle(title, false);

let glowingGlyph;
let glyphTimer;
function lightTouchedGlyph(event) {
  const touch = event.touches[0];
  const glyph = document.elementFromPoint(touch.clientX, touch.clientY)?.closest('.title-glyph');
  if (!glyph) return;
  if (glowingGlyph && glowingGlyph !== glyph) glowingGlyph.classList.remove('glyph-lit');
  glowingGlyph = glyph;
  glyph.classList.add('glyph-lit');
  clearTimeout(glyphTimer);
  glyphTimer = setTimeout(() => glyph.classList.remove('glyph-lit'), 650);
}
document.addEventListener('touchstart', lightTouchedGlyph, { passive: true });
document.addEventListener('touchmove', lightTouchedGlyph, { passive: true });

const reveal = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('arrived');
    observer.unobserve(entry.target);
  }
}, { threshold: .08 });
$$('.reveal, .signature').forEach((element) => reveal.observe(element));

const welcomePhoto = $('.welcome-photo');
const treeFrame = $('.wish-tree-frame');
const photoVisibility = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    entry.target.classList.toggle('photo-in-view', entry.isIntersecting);
  }
}, { threshold: .2 });
for (const frame of [photoStage, welcomePhoto, $('.star-portrait'), treeFrame]) {
  photoVisibility.observe(frame);
}

welcomePhoto.addEventListener('pointermove', (event) => {
  if (event.pointerType !== 'mouse' || root.classList.contains('motion-off')) return;
  const frame = welcomePhoto.getBoundingClientRect();
  const horizontal = (event.clientX - frame.left) / frame.width - .5;
  const vertical = (event.clientY - frame.top) / frame.height - .5;
  welcomePhoto.style.setProperty('--photo-rx', (-vertical * 12) + 'deg');
  welcomePhoto.style.setProperty('--photo-ry', (horizontal * 12) + 'deg');
});
welcomePhoto.addEventListener('pointerleave', () => {
  welcomePhoto.style.removeProperty('--photo-rx');
  welcomePhoto.style.removeProperty('--photo-ry');
});

function tiltTree(clientX, clientY) {
  if (root.classList.contains('motion-off')) return;
  const bounds = treeFrame.getBoundingClientRect();
  const horizontal = Math.max(-.5, Math.min(.5, (clientX - bounds.left) / bounds.width - .5));
  const vertical = Math.max(-.5, Math.min(.5, (clientY - bounds.top) / bounds.height - .5));
  treeScene.classList.add('tree-engaged');
  treeScene.style.setProperty('--tree-rx', (-vertical * 22) + 'deg');
  treeScene.style.setProperty('--tree-ry', (horizontal * 25) + 'deg');
}
function resetTreeTilt() {
  treeScene.style.removeProperty('--tree-rx');
  treeScene.style.removeProperty('--tree-ry');
  treeScene.classList.remove('tree-engaged');
}
treeFrame.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'mouse' || event.pointerType === 'pen') tiltTree(event.clientX, event.clientY);
});
treeFrame.addEventListener('pointerleave', resetTreeTilt);
for (const type of ['touchstart', 'touchmove']) {
  treeFrame.addEventListener(type, (event) => {
    const touch = event.touches[0];
    tiltTree(touch.clientX, touch.clientY);
  }, { passive: true });
}
treeFrame.addEventListener('touchend', resetTreeTilt);
treeFrame.addEventListener('touchcancel', resetTreeTilt);

const progress = $('.progress');
function updateProgress() {
  const distance = root.scrollHeight - root.clientHeight;
  progress.style.transform = 'scaleX(' + (distance > 0 ? root.scrollTop / distance : 0) + ')';
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();
