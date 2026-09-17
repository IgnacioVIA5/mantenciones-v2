import sys
from pathlib import Path

import fitz  # pymupdf

path = Path(sys.argv[1])
data = path.read_bytes()

# Quita el comentario que pymupdf deja en el header (reemplazo de igual longitud
# en bytes para no correr los offsets del xref).
old = b"% Written by MuPDF"
start = data.find(old)
if start != -1:
    end = data.find(b"\n", start)
    comment = data[start:end]
    data = data[:start] + b"%" + b" " * (len(comment) - 1) + data[end:]
    path.write_bytes(data)

doc = fitz.open(path)
doc.set_metadata({
    "title": "Informe Semanal de Mantenciones",
    "author": "Ignacio Echeverria Sandoval",
    "subject": "Gestion de Flota - Aridos VIA 5",
    "keywords": "",
    "creator": "",
    "producer": "",
})
tmp = path.with_suffix(".tmp.pdf")
doc.save(tmp)
doc.close()
tmp.replace(path)

# El save de pymupdf vuelve a dejar su propio comentario de "Written by" -> limpiar de nuevo.
data = path.read_bytes()
start = data.find(old)
if start != -1:
    end = data.find(b"\n", start)
    comment = data[start:end]
    data = data[:start] + b"%" + b" " * (len(comment) - 1) + data[end:]
    path.write_bytes(data)

print("Metadatos limpios:", path)
