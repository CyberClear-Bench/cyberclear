from pathlib import Path
import base64, json

root = Path(__file__).resolve().parents[1]
files = sorted((root / 'static/pdfs/figures').glob('*.pdf'))
data = {str(file.relative_to(root)).replace('\\', '/'): base64.b64encode(file.read_bytes()).decode('ascii') for file in files}
(root / 'static/js/pdf-figure-data.js').write_text('window.CYBERCLEAR_PDF_DATA = ' + json.dumps(data, separators=(',', ':')) + ';\n')
print(f'Embedded {len(files)} original PDF files.')
