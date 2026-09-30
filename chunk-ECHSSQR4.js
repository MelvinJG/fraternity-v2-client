import{d as M,e as $,g as L}from"./chunk-HOQL7V54.js";import{e as O}from"./chunk-ZLEJLMA7.js";import{a as D}from"./chunk-VBX5VT4C.js";import{Ab as N,Fb as T,Kb as y,Ma as m,Mb as w,Na as x,O as E,T as C,Y as _,Za as h,bb as S,fb as v,ga as g,gb as z,ha as u,hb as R,ib as r,jb as i,kb as l,nb as f,oc as I,pb as b,pc as k,qb as c,vc as A,xb as n,yb as d,zb as p}from"./chunk-UPN7EIIX.js";var P=t=>{let a=`${new Date().toLocaleDateString("es-GT",{day:"2-digit",month:"2-digit",year:"numeric"})} ${new Date().toLocaleTimeString("es-GT",{hour:"2-digit",minute:"2-digit",hour12:!1})}`,e=`
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
        .codigo-devoto .codigo-box { height: 17mm; margin-top: 2mm; padding: 1mm 2mm; border: 1.5px solid #333; border-radius: 4mm; background: white; display: flex; align-items: center; justify-content: center; color: #8b0000; font-family: 'Times New Roman', serif; font-size: 20pt; font-weight: bold; line-height: 1; text-align: center; }
        .marca-lateral { position: absolute; z-index: 0; top: 39mm; right: -3mm; width: 64mm; opacity: .2; z-index: 10; }
        .recomendacion { position: relative; z-index: 1; margin-top: 3mm; padding: 1.5mm 3mm 2mm; border: 1.2px solid #9f3d3d; border-radius: 3mm; background: #f8e1e5; color: #883737; text-align: center; }
        .recomendacion h2 { font-size: 11pt; margin-bottom: .5mm; }
        .recomendacion-subtitulo { font-size: 9pt; font-weight: bold; }
        .recomendacion-items { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; align-items: start; margin: 1mm 0 1.5mm; }
        .recomendacion-item { font-size: 8pt; font-weight: bold; line-height: 1.05; }
        .recomendacion-item img { display: block; width: 22mm; height: 24mm; object-fit: contain; margin: 0 auto .5mm; }
        .recomendacion-final { font-size: 8.5pt; font-weight: bold; line-height: 1.15; }
        @media print { @page { margin: 2mm; size: A4; } body { margin: 0; } .recibo-container { min-height: 0; height: auto; page-break-after: avoid; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .recomendacion { page-break-inside: avoid; } }
        @media screen and (max-width: 700px) { .recibo-container { width: 100%; min-height: 0; padding: 4vw; } .header { grid-template-columns: 20mm 1fr 25mm; gap: 2mm; } .logo { width: 18mm; height: 18mm; } .codigo-devoto { font-size: 7pt; } .codigo-devoto .codigo-box { height: 11mm; font-size: 16pt; } .fila-campos { gap: 2mm; } .campo-grupo label, .texto-variables { font-size: 8pt; } .recomendacion-items { gap: 1mm; } .recomendacion-item { font-size: 7pt; } .recomendacion-item img { width: 19mm; height: 21mm; } .recomendacion-final { font-size: 7.5pt; } }

        /* N\xFAmero de serie en la esquina */
    .numero-serie {
      position: absolute;
      top: 10mm;
      left: 15mm;
      color: #8b0000;
      font-size: 14pt;
      font-weight: bold;
    }

    .numero-serie-variables {
      color: #8b0000;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    /* N\xFAmero de mesa */
    .numero-mesa {
      position: absolute;
      top: 15mm;
      right: 20mm;
      display: flex;
      align-items: center;
      gap: 10px;
      color: black;
    }
    
    .numero-mesa label {
      font-size: 10pt;
    }
    
    .numero-mesa .campo {
      border: 1px solid #000;
      padding: 5px 30px;
      background-color: white;
      min-width: 80px;
      text-align: center;
      border-radius: 8px;
    }
    
    /* Campos principales */
    .campos-principales {
      margin-top: 1mm;
    }
    
    .fila-campos {
      display: flex;
      gap: 25px;
      margin-bottom: 1.8mm;
    }
    
    .campo-grupo {
      flex: 1;
    }
    
    .campo-grupo.pequeno {
      flex: 0.4;
    }
    
    .campo-grupo label {
      display: block;
      font-size: 11pt;
      margin-bottom: 3px;
      color: black;
    }
    
    .campo-grupo .input-box {
      border: 1px solid #000;
      padding: 6px 15px;
      background-color: white;
      min-height: 5px;
      position: relative;
      border-radius: 8px;
    }
    
    .campo-grupo .input-box .texto-tachado {
      text-decoration: line-through;
      color: #666;
      font-size: 15pt;
    }
    
    .texto-variables {
      color: #989494;
      font-size: 10pt;
      text-transform: uppercase;
    }
    
    .fecha-hora-generacion {
      font-size: 6.5pt;
      color: #666;
      float: right;
      font-style: italic;
      position: relative;
      top: 10px;
    }

    .campo-grupo .input-box .texto-valor {
      font-size: 11pt;
    }

    </style>
    </head>
    <body>
    <div class="recibo-container">
        <img class="marca-lateral" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+LATERAL+MEDIO-04.png" alt="">
        <div class="header">
        <img class="logo" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/LOGO-03.png" alt="Escudo de la Hermandad">
        <img class="membrete" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/MEMBRETE+TEXTO-04.png" alt="Hermandad">
        <div class="codigo-devoto">C\xF3digo Devoto<div class="codigo-box">${t.codDevoto}</div></div>
        </div>
        <div class="campos-principales">
          <div class="fila-campos">
              <div class="campo-grupo pequeno"><label>No. de Mesa</label><div class="input-box" style="text-align: center;"><span class="texto-variables">${t.numeroMesa}</span></div></div>
              <div class="campo-grupo pequeno"><label>Estatura</label><div class="input-box" style="text-align: center;"><span class="texto-variables">${t.estatura} M</span></div></div>
              <div class="campo-grupo pequeno"><label>No. de Recibo</label><div class="input-box" style="text-align: center;"><span class="numero-serie-variables">${t.numeroRecibo}</span></div></div>
          </div>
          <div class="fila-campos">
              <div class="campo-grupo"><label>Nombre</label><div class="input-box"><div class="texto-variables">${t.nombre}</div></div></div>
              <div class="campo-grupo"><label>Direcci\xF3n</label><div class="input-box"><div class="texto-variables">${t.direccion}</div></div></div>
          </div>
          <div class="fila-campos">
              <div class="campo-grupo"><label>Turno</label><div class="input-box"><div class="texto-variables">${t.turno} || Q. ${t.monto}<span class="fecha-hora-generacion">${a}</span></div></div></div>
          </div>
        </div>
        <section class="recomendacion">
        <h2>RECOMENDACI\xD3N GENERAL</h2>
        <div class="recomendacion-subtitulo">Para el cortejo procesional</div>
        <div class="recomendacion-items">
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+ZAPATO-03.png" alt=""><span>NO TENIS</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+CELULAR-03.png" alt=""><span>NO CELULARES</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+LENTES-03.png" alt=""><span>NO LENTES OSCUROS</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+PAREJAS-03.png" alt=""><span>NO ANDAR EN PAREJAS<br> DENTRO DE FILAS</span></div>
        </div>
        <p class="recomendacion-final">Demostremos nuestra Fe, Devoci\xF3n y Penitencia por lo que nuestro comportamiento y obediencia depender\xE1 en gran medida la suntuosidad y m\xEDstica de nuestros cortejos procesionales.</p>
        </section>
    </div>
    </body>
    </html>`,o=document.createElement("iframe");o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.border="none",document.body.appendChild(o);let s=o.contentWindow?.document;s&&(s.open(),s.write(e),s.close(),o.onload=()=>{o.contentWindow?.focus(),o.contentWindow?.print(),o.contentWindow.onafterprint=()=>{o.parentNode&&o.parentNode.removeChild(o)}})};var j=t=>{let a=`${new Date().toLocaleDateString("es-GT",{day:"2-digit",month:"2-digit",year:"numeric"})} ${new Date().toLocaleTimeString("es-GT",{hour:"2-digit",minute:"2-digit",hour12:!1})}`,e=`
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
        .codigo-devoto .codigo-box { height: 17mm; margin-top: 2mm; padding: 1mm 2mm; border: 1.5px solid #333; border-radius: 4mm; background: white; display: flex; align-items: center; justify-content: center; color: #4a0884; font-family: 'Times New Roman', serif; font-size: 20pt; font-weight: bold; line-height: 1; text-align: center; }
        .marca-lateral { position: absolute; z-index: 0; top: 39mm; left: -3mm; width: 64mm; opacity: .2; z-index: 10; }
        .recomendacion { position: relative; z-index: 1; margin-top: 3mm; padding: 1.5mm 3mm 2mm; border: 1.2px solid #9f3d3d; border-radius: 3mm; background: #f8e1e5; color: #883737; text-align: center; }
        .recomendacion h2 { font-size: 11pt; margin-bottom: .5mm; }
        .recomendacion-subtitulo { font-size: 9pt; font-weight: bold; }
        .recomendacion-items { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2mm; align-items: start; margin: 1mm 0 1.5mm; }
        .recomendacion-item { font-size: 8pt; font-weight: bold; line-height: 1.05; }
        .recomendacion-item img { display: block; width: 22mm; height: 24mm; object-fit: contain; margin: 0 auto .5mm; }
        .recomendacion-final { font-size: 8.5pt; font-weight: bold; line-height: 1.15; }
        @media print { @page { margin: 2mm; size: A4; } body { margin: 0; } .recibo-container { min-height: 0; height: auto; page-break-after: avoid; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } .recomendacion { page-break-inside: avoid; } }
        @media screen and (max-width: 700px) { .recibo-container { width: 100%; min-height: 0; padding: 4vw; } .header { grid-template-columns: 20mm 1fr 25mm; gap: 2mm; } .logo { width: 18mm; height: 18mm; } .codigo-devoto { font-size: 7pt; } .codigo-devoto .codigo-box { height: 11mm; font-size: 16pt; } .fila-campos { gap: 2mm; } .campo-grupo label, .texto-variables { font-size: 8pt; } .recomendacion-items { gap: 1mm; } .recomendacion-item { font-size: 7pt; } .recomendacion-item img { width: 19mm; height: 21mm; } .recomendacion-final { font-size: 7.5pt; } }

        /* N\xFAmero de serie en la esquina */
    .numero-serie {
      position: absolute;
      top: 10mm;
      left: 15mm;
      color: #4a0884;
      font-size: 14pt;
      font-weight: bold;
    }

    .numero-serie-variables {
      color: #4a0884;
      font-size: 10pt;
      font-weight: bold;
      text-transform: uppercase;
    }
    
    /* N\xFAmero de mesa */
    .numero-mesa {
      position: absolute;
      top: 15mm;
      right: 20mm;
      display: flex;
      align-items: center;
      gap: 10px;
      color: black;
    }
    
    .numero-mesa label {
      font-size: 10pt;
    }
    
    .numero-mesa .campo {
      border: 1px solid #000;
      padding: 5px 30px;
      background-color: white;
      min-width: 80px;
      text-align: center;
      border-radius: 8px;
    }
    
    /* Campos principales */
    .campos-principales {
      margin-top: 1mm;
    }
    
    .fila-campos {
      display: flex;
      gap: 25px;
      margin-bottom: 1.8mm;
    }
    
    .campo-grupo {
      flex: 1;
    }
    
    .campo-grupo.pequeno {
      flex: 0.4;
    }
    
    .campo-grupo label {
      display: block;
      font-size: 11pt;
      margin-bottom: 3px;
      color: black;
    }
    
    .campo-grupo .input-box {
      border: 1px solid #000;
      padding: 6px 15px;
      background-color: white;
      min-height: 5px;
      position: relative;
      border-radius: 8px;
    }
    
    .campo-grupo .input-box .texto-tachado {
      text-decoration: line-through;
      color: #666;
      font-size: 15pt;
    }
    
    .texto-variables {
      color: #989494;
      font-size: 10pt;
      text-transform: uppercase;
    }
    
    .fecha-hora-generacion {
      font-size: 6.5pt;
      color: #666;
      float: right;
      font-style: italic;
      position: relative;
      top: 10px;
    }

    .campo-grupo .input-box .texto-valor {
      font-size: 11pt;
    }

    </style>
    </head>
    <body>
    <div class="recibo-container">
        <img class="marca-lateral" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+LATERAL+IZQ-04.png" alt="">
        <div class="header">
        <img class="logo" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/LOGO-03.png" alt="Escudo de la Hermandad">
        <img class="membrete" src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/MEMBRETE+TEXTO-04.png" alt="Hermandad">
        <div class="codigo-devoto">C\xF3digo Devoto<div class="codigo-box">${t.codDevoto}</div></div>
        </div>
        <div class="campos-principales">
          <div class="fila-campos">
              <div class="campo-grupo pequeno"><label>No. de Mesa</label><div class="input-box" style="text-align: center;"><span class="texto-variables">${t.numeroMesa}</span></div></div>
              <div class="campo-grupo pequeno"><label>Estatura</label><div class="input-box" style="text-align: center;"><span class="texto-variables">${t.estatura} M</span></div></div>
              <div class="campo-grupo pequeno"><label>No. de Recibo</label><div class="input-box" style="text-align: center;"><span class="numero-serie-variables">${t.numeroRecibo}</span></div></div>
          </div>
          <div class="fila-campos">
              <div class="campo-grupo"><label>Nombre</label><div class="input-box"><div class="texto-variables">${t.nombre}</div></div></div>
              <div class="campo-grupo"><label>Direcci\xF3n</label><div class="input-box"><div class="texto-variables">${t.direccion}</div></div></div>
          </div>
          <div class="fila-campos">
              <div class="campo-grupo"><label>Turno</label><div class="input-box"><div class="texto-variables">${t.turno} || Q. ${t.monto}<span class="fecha-hora-generacion">${a}</span></div></div></div>
          </div>
        </div>
        <section class="recomendacion">
        <h2>RECOMENDACI\xD3N GENERAL</h2>
        <div class="recomendacion-subtitulo">Para el cortejo procesional</div>
        <div class="recomendacion-items">
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+ZAPATO-03.png" alt=""><span>NO TENIS</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+CELULAR-03.png" alt=""><span>NO CELULARES</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+LENTES-03.png" alt=""><span>NO LENTES OSCUROS</span></div>
            <div class="recomendacion-item"><img src="https://fraternity-images-birthday.s3.us-east-1.amazonaws.com/images-receipt/ICONO+PAREJAS-03.png" alt=""><span>NO ANDAR EN PAREJAS<br> DENTRO DE FILAS</span></div>
        </div>
        <p class="recomendacion-final">Demostremos nuestra Fe, Devoci\xF3n y Penitencia por lo que nuestro comportamiento y obediencia depender\xE1 en gran medida la suntuosidad y m\xEDstica de nuestros cortejos procesionales.</p>
        </section>
    </div>
    </body>
    </html>`,o=document.createElement("iframe");o.style.position="absolute",o.style.width="0",o.style.height="0",o.style.border="none",document.body.appendChild(o);let s=o.contentWindow?.document;s&&(s.open(),s.write(e),s.close(),o.onload=()=>{o.contentWindow?.focus(),o.contentWindow?.print(),o.contentWindow.onafterprint=()=>{o.parentNode&&o.parentNode.removeChild(o)}})};var V=(t,a)=>a.turno_id;function q(t,a){if(t&1){let e=f();r(0,"button",7),b("click",function(){g(e);let s=c();return u(s.modalRef.close())}),i()}}function G(t,a){if(t&1&&(r(0,"div",20)(1,"div",21)(2,"h6",22),n(3),i(),r(4,"div",4)(5,"div",23)(6,"small",24),n(7,"Inscripciones"),i(),r(8,"p",25),n(9),i()(),r(10,"div",26)(11,"small",24),n(12,"Recaudado"),i(),r(13,"p",27),n(14),y(15,"number"),i()()()()()),t&2){let e=a.$implicit;m(2),S("title",e.turno_descripcion),m(),p(" ",e.turno_descripcion," "),m(6),d(e.total_inscripciones),m(5),p("Q. ",w(15,4,e.monto_total,"1.2-2"),"")}}function H(t,a){if(t&1&&(r(0,"div",8)(1,"div",9)(2,"h6",10),n(3,"Resumen General"),i(),r(4,"div",11)(5,"p",12)(6,"strong"),n(7,"Total de Inscripciones"),i(),l(8,"br"),r(9,"span",13),n(10),i()(),r(11,"p",14)(12,"strong"),n(13,"Total de Turnos"),i(),l(14,"br"),r(15,"span",15),n(16),i()()(),r(17,"div",16)(18,"strong"),n(19,"Total Recaudado"),i(),l(20,"br"),r(21,"span",17),n(22),y(23,"number"),i()()()(),r(24,"div",18)(25,"h6",10),n(26,"Detalle por Turno"),i(),r(27,"div",19),z(28,G,16,7,"div",20,V),i()()),t&2){let e=c();m(10),d(e.summaryData.total_inscripciones),m(6),d(e.summaryData.total_turnos),m(6),p("Q. ",w(23,3,e.getTotalGeneral(),"1.2-2"),""),m(6),R(e.summaryData.turnos)}}function W(t,a){if(t&1&&(r(0,"div",28)(1,"p")(2,"strong"),n(3,"Fecha y hora"),i(),l(4,"br"),n(5),i(),r(6,"p")(7,"strong"),n(8,"Nombre Devoto"),i(),l(9,"br"),n(10),i(),r(11,"p")(12,"strong"),n(13,"Turno"),i(),l(14,"br"),n(15),i(),r(16,"p")(17,"strong"),n(18,"Altura"),i(),l(19,"br"),n(20),i()(),r(21,"div",28)(22,"p")(23,"strong"),n(24,"N\xFAmero de recibo"),i(),l(25,"br"),n(26),i(),r(27,"p")(28,"strong"),n(29,"Direcci\xF3n"),i(),l(30,"br"),n(31),i(),r(32,"p")(33,"strong"),n(34,"Monto pagado"),i(),l(35,"br"),n(36),i(),r(37,"p")(38,"strong"),n(39,"N\xFAmero de mesa"),i(),l(40,"br"),n(41),i()()),t&2){let e=c();m(5),N("",e.date," ",e.hour,""),m(5),d(e.name),m(5),d(e.turn),m(5),p("",e.height," m."),m(6),d(e.noReceipt),m(5),d(e.address),m(5),p("Q. ",e.amount,""),m(5),d(e.noTable)}}function Q(t,a){if(t&1){let e=f();r(0,"button",29),b("click",function(){g(e);let s=c();return u(s.modalRef.close())}),n(1," Cerrar "),i()}}function J(t,a){if(t&1){let e=f();r(0,"button",29),b("click",function(){g(e);let s=c();return u(s.reload())}),n(1," Cerrar "),i(),r(2,"button",30),b("click",function(){g(e);let s=c();return u(s.reload())}),n(3,"Nueva Solicitud"),i(),r(4,"button",31),b("click",function(){g(e);let s=c();return u(s.print())}),l(5,"i",32),i()}}var F=class t{constructor(a,e){this.modalRef=a;this.router=e}noTable="";height="";noReceipt="";name="";address="";turn="";amount="";date="";hour="";idFraternity=0;fullDate="";codDevotee="";isReport=!1;summaryData={};print(){let a={numeroMesa:this.noTable,estatura:this.height,numeroRecibo:this.noReceipt,nombre:this.name,direccion:this.address,turno:this.turn,monto:this.amount,fecha:this.date,hora:this.hour,codDevoto:`D${this.codDevotee}`};this.idFraternity===1?P(a):this.idFraternity===2&&j(a)}reload(){this.modalRef.close(),this.router.navigate(["/home"]).then(()=>{window.location.reload()})}getTotalGeneral(){return this.summaryData?.turnos?.reduce((a,e)=>a+e.monto_total,0)||0}static \u0275fac=function(e){return new(e||t)(x(L),x(O))};static \u0275cmp=_({type:t,selectors:[["app-modal-summary"]],standalone:!0,features:[T],decls:11,vars:4,consts:[[1,"modal-header"],["id","exampleModalLabel",1,"modal-title"],["type","button","aria-label","Close",1,"btn-close"],[1,"modal-body"],[1,"row"],[1,"modal-footer"],["type","button",1,"btn","btn-secondary"],["type","button","aria-label","Close",1,"btn-close",3,"click"],[1,"col-md-5"],[1,"border-end","pe-3"],[1,"text-uppercase","fw-bold","text-secondary","mb-3"],[1,"mb-4","p-3","bg-light","rounded"],[1,"mb-2"],[1,"fs-4","text-primary","fw-bold"],[1,"mb-0"],[1,"fs-4","text-success","fw-bold"],[1,"alert","alert-dark","mb-0","text-center"],[1,"fs-3","fw-bold"],[1,"col-md-7"],[1,"overflow-auto",2,"max-height","400px"],[1,"card","mb-2","border-start","border-primary","border-3"],[1,"card-body","p-3"],[1,"card-title","mb-2","text-truncate",3,"title"],[1,"col-6"],[1,"text-muted"],[1,"mb-0","fw-bold","text-primary"],[1,"col-6","text-end"],[1,"mb-0","fw-bold","text-success"],[1,"col"],["type","button",1,"btn","btn-secondary",3,"click"],["type","button",1,"btn","primary",3,"click"],["type","button","mdbRipple","",1,"btn","btn-dark","btn-floating",3,"click"],[1,"fas","fa-download"]],template:function(e,o){e&1&&(r(0,"div",0)(1,"h5",1),n(2),i(),h(3,q,1,0,"button",2),i(),r(4,"div",3)(5,"div",4),h(6,H,30,6)(7,W,42,9),i()(),r(8,"div",5),h(9,Q,2,0,"button",6)(10,J,6,0),i()),e&2&&(m(2),p(" ",o.isReport?"":"Comprobante de turno"," "),m(),v(o.isReport?3:-1),m(3),v(o.isReport?6:7),m(3),v(o.isReport?9:10))},dependencies:[k,I,$,M],styles:[".btn[_ngcontent-%COMP%]{border-radius:50px;border:none;cursor:pointer;font-size:15px;transition:.2s ease}.primary[_ngcontent-%COMP%]{background:#fbd234;font-weight:700}"]})};var U=class t{constructor(a){this.http=a}API_URL=`${D.HOST_URL}/api/inscriptions`;registration(a){return this.http.post(`${this.API_URL}`,a,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""}})}getInscriptions(a=1){return this.http.get(`${this.API_URL}?page=${a}&limit=30`,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""}})}getInscriptionsByDPI(a,e=1){return this.http.get(`${this.API_URL}/${a}?page=${e}&limit=30`,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""}})}getInscriptionsByName(a,e=1){return this.http.get(`${this.API_URL}/name/${a}?page=${e}&limit=30`,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""}})}getInscriptionsByCode(a,e=1){return this.http.get(`${this.API_URL}/code/${a}?page=${e}&limit=30`,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""}})}deleteInscription(a,e){return this.http.delete(`${this.API_URL}/${a}`,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""},body:e})}report(){return this.http.get(`${this.API_URL}/reports`,{headers:{Authorization:"Bearer "+localStorage.getItem("token")||""}})}static \u0275fac=function(e){return new(e||t)(C(A))};static \u0275prov=E({token:t,factory:t.\u0275fac,providedIn:"root"})};export{F as a,U as b};
