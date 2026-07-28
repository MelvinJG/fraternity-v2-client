import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() {}

  private async getExcelJS() {
    const ExcelJS = await import('exceljs');
    return ExcelJS.default || ExcelJS;
  }

  async generateExcel(data: any[], fileName: string): Promise<void> {
    const ExcelJS = await this.getExcelJS();
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // Add headers
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    // Add data
    data.forEach((item) => {
      const row: any[] = [];
      headers.forEach((header) => {
        row.push(item[header]);
      });
      worksheet.addRow(row);
    });
    worksheet.getCell('A1').font = { bold: true, size: 14 };
    worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFF00' } };
    worksheet.getCell('A1').alignment = { vertical: 'middle', horizontal: 'center' };


    
    // Save the workbook to a blob
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    });
  }

  async ExcelOfficial(data: any[], fileName: string): Promise<void> {
    const ExcelJS = await this.getExcelJS();
    const workbook = new ExcelJS.Workbook();
    data.forEach((turnData, index) => {
        const nameSheet = `${turnData[0].idTurno}-${turnData[0].descripcion}`;
        const worksheet = workbook.addWorksheet(`${nameSheet.substring(0,31)}` || `Turno ${index + 1}`);
        
        // Definir columnas con anchos específicos
        worksheet.columns = [
          { header: 'Recibo', key: 'recibo', width: 12 },
          { header: 'Nombre Completo', key: 'nombre', width: 35 },
          { header: 'Mesa', key: 'mesa', width: 8 },
          { header: 'Altura', key: 'altura', width: 10 },
          { header: 'Dirección', key: 'direccion', width: 40 },
          { header: 'Turno Descripción', key: 'turno', width: 50 },
          { header: 'Monto', key: 'monto', width: 12 },
          { header: 'No. Turno', key: 'noTurno', width: 12 },
          { header: 'Brazo Asignado', key: 'brazo', width: 15 }
        ];
        
        // Estilo del encabezado (primera fila)
        const headerRow = worksheet.getRow(1);
        headerRow.font = { 
          bold: true, 
          size: 12, 
          color: { argb: 'FFFFFFFF' },
          name: 'Calibri'
        };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF2C3E50' } // Azul oscuro ejecutivo
        };
        headerRow.alignment = { 
          vertical: 'middle', 
          horizontal: 'center' 
        };
        headerRow.height = 25;
        
        // Aplicar bordes al encabezado
        headerRow.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin', color: { argb: 'FF34495E' } },
            left: { style: 'thin', color: { argb: 'FF34495E' } },
            bottom: { style: 'medium', color: { argb: 'FF34495E' } },
            right: { style: 'thin', color: { argb: 'FF34495E' } }
          };
        });
        
        // Agregar datos
        turnData.shift(); // Remove first item (descripción)
        turnData.forEach((item: any, idx: number) => {
          const values = Object.values(item);
          // Convertir mesa (índice 2) de string a número
          if (values[2] && typeof values[2] === 'string') {
            values[2] = parseInt(values[2], 10);
          }

          // Convertir altura (índice 3) de string a número
          if (values[3] && typeof values[3] === 'string') {
            values[3] = parseFloat(values[3]);
          }

          // Convertir monto (índice 6) de string a número
          if (values[6] && typeof values[6] === 'string') {
            values[6] = parseFloat(values[6]);
          }
          
          const row = worksheet.addRow(values);
          
          // Estilo de fuente para datos
          row.font = { 
            size: 11,
            name: 'Calibri'
          };
          
          // Aplicar estilos solo a las celdas con datos (primeras 9 columnas)
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            // Solo aplicar a las primeras 9 columnas (A-I)
            if (colNumber <= 9) {
              // Alternar colores de filas (efecto zebra)
              if (idx % 2 === 0) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFE8EBED' } //FFECEFF1
                  //--'FFD5DBDB' // Gris medio claro 👍 Muy bueno
                };
              } else {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'FFFFFFFF' } // Blanco
                };
              }
              
              // Bordes para celdas con datos
              cell.border = {
                top: { style: 'thin', color: { argb: 'FFD5D8DC' } },
                left: { style: 'thin', color: { argb: 'FFD5D8DC' } },
                bottom: { style: 'thin', color: { argb: 'FFD5D8DC' } },
                right: { style: 'thin', color: { argb: 'FFD5D8DC' } }
              };
              
              // Alineación por columna
              switch(colNumber) {
                case 1: // Recibo
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  cell.font = { size: 11, name: 'Calibri', bold: true, color: { argb: 'FF2C3E50' } };
                  break;
                case 3: // Mesa
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  cell.numFmt = '000';
                  break;
                case 4: // Altura
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  cell.numFmt = '0.00'; // Forzar 2 decimales
                  break;
                case 8: // Brazo Asignado
                case 9: // No. Turno
                  cell.alignment = { vertical: 'middle', horizontal: 'center' };
                  break;
                case 7: // Monto
                  cell.alignment = { vertical: 'middle', horizontal: 'right' };
                  cell.numFmt = '"Q. "#,##0.00'; // Formato de moneda
                  cell.font = { size: 11, name: 'Calibri', bold: true, color: { argb: 'FF27AE60' } };
                  break;
                default:
                  cell.alignment = { vertical: 'middle', horizontal: 'left' };
              }
            }
          });
          
          row.height = 20;
        });
        
        // Agregar autofiltro
        // worksheet.autoFilter = {
        //   from: 'A1',
        //   to: `I1`
        // };
        
        // Congelar primera fila
        worksheet.views = [
          { state: 'frozen', ySplit: 1 }
        ];
    });
    
    workbook.xlsx.writeBuffer()
    .then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${fileName}.xlsx`);
    })
    .catch((error) => {
      console.error('Error al generar el archivo:', error);
    });
  }
}
