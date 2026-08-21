export const NewTemplateReceipt = (info: any) => {
    const generatedAt = `${new Date().toLocaleDateString('es-GT', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${new Date().toLocaleTimeString('es-GT', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
    <head>
    <meta charset="UTF-8">
    <title>Recibo Hermandad</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Times New Roman', serif; background: white; color: #222; }
        .recibo-container { width: 210mm; min-height: 297mm; margin: 0 auto; padding: 8mm 8mm 10mm; position: relative; overflow: hidden; background: white; }
        .header { display: grid; grid-template-columns: 29mm 1fr 32mm; align-items: center; gap: 4mm; min-height: 29mm; position: relative; z-index: 1; }
        .logo { width: 25mm; height: 25mm; object-fit: contain; }
        .membrete { width: 100%; height: auto; display: block; }
        .codigo-devoto { align-self: start; text-align: center; font-size: 10pt; font-weight: bold;  margin-top: 6mm;}
        .codigo-devoto .codigo-box { height: 15mm; margin-top: 2mm; border: 1.2px solid #333; border-radius: 4mm; background: white; }
        .campos-principales { margin-top: 2mm; position: relative; z-index: 1; }
        .fila-campos { display: flex; gap: 6mm; margin-bottom: 1.7mm; }
        .campo-grupo { flex: 1; min-width: 0; }
        .campo-grupo.pequeno { flex: 1; }
        .campo-grupo label { display: block; margin-bottom: 1mm; font-size: 10pt; font-weight: bold; }
        .campo-grupo .input-box { min-height: 9mm; padding: 1.5mm 3mm; border: 1.2px solid #333; border-radius: 3mm; background: rgba(255, 255, 255, .95); position: relative; overflow: hidden; }
        .texto-variables { color: #989494; font-size: 10pt; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .numero-serie-variables { color: #8b0000; font-size: 10pt; font-weight: bold; }
        .fecha-hora-generacion { float: right; margin-top: 1mm; color: #666; font-size: 6.5pt; font-style: italic; }
        .marca-lateral { position: absolute; z-index: 0; top: 39mm; right: -3mm; width: 64mm; opacity: .2; z-index: 10; }
        .recomendacion { position: relative; z-index: 1; margin-top: 4mm; padding: 2.5mm 4mm 3mm; border: 1.2px solid #9f3d3d; border-radius: 3mm; background: #f8e1e5; color: #883737; text-align: center; }
        .recomendacion h2 { font-size: 13pt; margin-bottom: 1mm; }
        .recomendacion-subtitulo { font-size: 10pt; font-weight: bold; }
        .recomendacion-items { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; align-items: start; margin: 2mm 0 2.5mm; }
        .recomendacion-item { font-size: 9pt; font-weight: bold; line-height: 1.05; }
        .recomendacion-item img { display: block; width: 22mm; height: 24mm; object-fit: contain; margin: 0 auto 1mm; }
        .recomendacion-final { font-size: 10pt; font-weight: bold; line-height: 1.25; }
        @media print { @page { margin: 8mm; size: A4; } body { margin: 0; } .recibo-container { min-height: 0; height: auto; page-break-after: avoid; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .recomendacion { page-break-inside: avoid; } }
        @media screen and (max-width: 700px) { .recibo-container { width: 100%; min-height: 0; padding: 4vw; } .header { grid-template-columns: 20mm 1fr 25mm; gap: 2mm; } .logo { width: 18mm; height: 18mm; } .codigo-devoto { font-size: 7pt; } .codigo-devoto .codigo-box { height: 11mm; } .fila-campos { gap: 2mm; } .campo-grupo label, .texto-variables { font-size: 8pt; } .recomendacion-items { gap: 1mm; } .recomendacion-item { font-size: 7pt; } .recomendacion-item img { width: 17mm; height: 19mm; } .recomendacion-final { font-size: 8pt; } }
    </style>
    </head>
    <body>
    <div class="recibo-container">
        <img class="marca-lateral" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+LATERAL+MEDIO-04.png" alt="">
        <div class="header">
        <img class="logo" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/LOGO-03.png" alt="Escudo de la Hermandad">
        <img class="membrete" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/MEMBRETE+TEXTO-04.png" alt="Hermandad">
        <div class="codigo-devoto">Código Devoto<div class="codigo-box"></div></div>
        </div>
        <div class="campos-principales">
        <div class="fila-campos">
            <div class="campo-grupo pequeno"><label>No. de Mesa</label><div class="input-box" style="text-align: center;"><span class="texto-variables">${info.numeroMesa}</span></div></div>
            <div class="campo-grupo pequeno"><label>Estatura</label><div class="input-box" style="text-align: center;"><span class="texto-variables">${info.estatura} M</span></div></div>
            <div class="campo-grupo pequeno"><label>No. de Recibo</label><div class="input-box" style="text-align: center;"><span class="numero-serie-variables">${info.numeroRecibo}</span></div></div>
        </div>
        <div class="fila-campos">
            <div class="campo-grupo"><label>Nombre</label><div class="input-box"><div class="texto-variables">${info.nombre}</div></div></div>
            <div class="campo-grupo"><label>Dirección</label><div class="input-box"><div class="texto-variables">${info.direccion}</div></div></div>
        </div>
        <div class="fila-campos">
            <div class="campo-grupo"><label>Turno</label><div class="input-box"><div class="texto-variables">${info.turno} || Q. ${info.monto}<span class="fecha-hora-generacion">${generatedAt}</span></div></div></div>
        </div>
        </div>
        <section class="recomendacion">
        <h2>RECOMENDACIÓN GENERAL</h2>
        <div class="recomendacion-subtitulo">Para el cortejo procesional</div>
        <div class="recomendacion-items">
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+ZAPATO-03.png" alt=""><span>NO TENIS</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+CELULAR-03.png" alt=""><span>NO CELULARES</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+LENTES-03.png" alt=""><span>NO LENTES OSCUROS</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+PAREJAS-03.png" alt=""><span>NO ANDAR EN PAREJAS<br> DENTRO DE FILAS</span></div>
        </div>
        <p class="recomendacion-final">Demostremos nuestra Fe, Devoción y Penitencia por lo que nuestro comportamiento y obediencia dependerá en gran medida la suntuosidad y mística de nuestros cortejos procesionales.</p>
        </section>
    </div>
    </body>
    </html>`;

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'absolute';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = 'none';
    document.body.appendChild(printFrame);
    const frameDoc = printFrame.contentWindow?.document;
    if (frameDoc) {
        frameDoc.open();
        frameDoc.write(htmlContent);
        frameDoc.close();
        printFrame.onload = () => {
            printFrame.contentWindow?.focus();
            printFrame.contentWindow?.print();
            printFrame.contentWindow!.onafterprint = () => {
                if (printFrame.parentNode) printFrame.parentNode.removeChild(printFrame);
            };
        };
    }
};
