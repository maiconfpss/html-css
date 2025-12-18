Gerando PNGs a partir do SVG e otimizando o SVG

Arquivos:
- `src/image/logo.svg`      (versão original que criamos)
- `src/image/logo.min.svg`  (versão minificada/otimizada manualmente)

Se você quer gerar PNGs (1x e 2x) a partir do SVG e otimizar o SVG automaticamente, use um destes fluxos conforme o que você tem instalado no Windows.

1) Usando Inkscape (Windows)
- Inkscape é ótimo para exportar SVG para PNG com controle de DPI/escala.
- Exemplo PowerShell (execute na pasta do projeto):

  # Exportar 1x (512px de largura)
  "C:\Program Files\Inkscape\bin\inkscape.exe" "src\image\logo.min.svg" --export-type=png --export-filename="src\image\logo@1x.png" --export-width=512

  # Exportar 2x (1024px de largura)
  "C:\Program Files\Inkscape\bin\inkscape.exe" "src\image\logo.min.svg" --export-type=png --export-filename="src\image\logo@2x.png" --export-width=1024

2) Usando ImageMagick (magick)
- ImageMagick é outra opção (instalador para Windows disponível).
- PowerShell:

  magick convert src\image\logo.min.svg -resize 512 src\image\logo@1x.png
  magick convert src\image\logo.min.svg -resize 1024 src\image\logo@2x.png

3) Otimizar SVG com SVGO (Node/npm)
- Se tiver Node.js/npm instalado, instale svgo globalmente ou como dependência:

  npm i -g svgo

- Rodar otimização (gera `logo.min.svg` otimizado):

  svgo src\image\logo.svg -o src\image\logo.min.svg

- Você pode ajustar plugins do svgo para preservar `title`/`aria` se quiser.

4) Fluxo rápido (recomendação)
- Rode `svgo` para minificar/limpar o SVG.
- Use Inkscape ou ImageMagick para exportar PNGs em 1x e 2x.

5) Observações importantes
- O SVG no projeto usa `fill="currentColor"`. Se você exportar PNGs, a cor do ícone será a cor atual da `currentColor` no momento da exportação (dependendo do renderizador). Para garantir a cor dourada no PNG, abra o SVG em um editor e substitua `currentColor` por `#DE9000` antes de exportar, ou exporte a partir do `logo.svg` original onde `fill` esteja com a cor desejada.

- Caso queira que eu gere os PNGs automaticamente aqui, preciso que você confirme que quer apenas arquivos (eu posso criar PNGs placeholders), mas para PNGs reais com qualidade é melhor que você mesmo execute um dos comandos acima no seu Windows (posso te guiar passo-a-passo).

Se quiser, eu:
- crio os comandos exatos prontos para colar no PowerShell (já incluí exemplos), ou
- gero PNGs placeholders aqui (arquivos simples) — diga se prefere placeholders ou as instruções para gerar PNGs reais localmente.
