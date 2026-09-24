/* Render the original PDF assets directly; no raster figure files are used.
   The byte-identical embedded PDF data also allows double-click / file:// use. */
document.addEventListener('DOMContentLoaded', async () => {
  class EmbeddedBinaryDataFactory {
    async fetch({ kind, filename }) {
      const data = kind === 'cMapUrl' && window.CYBERCLEAR_PDF_CMAPS[filename];
      if (!data) throw new Error('Missing PDF font mapping: ' + filename);
      return Uint8Array.from(atob(data), character => character.charCodeAt(0));
    }
  }
  const frames = document.querySelectorAll('[data-pdf]');
  for (const frame of frames) {
    try {
      const encoded = window.CYBERCLEAR_PDF_DATA[frame.dataset.pdf];
      const bytes = Uint8Array.from(atob(encoded), character => character.charCodeAt(0));
      const documentTask = pdfjsLib.getDocument({ data: bytes, useWasm: false, isEvalSupported: false, useSystemFonts: true, BinaryDataFactory: EmbeddedBinaryDataFactory, useWorkerFetch: false });
      const pdf = await documentTask.promise;
      const page = await pdf.getPage(1);
      const natural = page.getViewport({ scale: 1 });
      const viewport = page.getViewport({ scale: Math.min(6, 2400 / natural.width) });
      const canvas = document.createElement('canvas');
      canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      canvas.setAttribute('aria-hidden', 'true');
      await page.render({ canvasContext: canvas.getContext('2d'), viewport, background: '#ffffff' }).promise;
      frame.replaceChildren(canvas); frame.dataset.rendered = 'true';
      await pdf.destroy();
    } catch (error) {
      const message = document.createElement('p');
      message.className = 'pdf-error';
      message.textContent = 'Use the PDF link below to view this figure.';
      frame.replaceChildren(message); frame.dataset.rendered = 'error';
      console.error('Figure PDF could not be displayed:', frame.dataset.pdf, error);
    }
  }
});
