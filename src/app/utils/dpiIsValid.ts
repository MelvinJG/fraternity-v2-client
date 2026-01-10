export function dpiIsValid(dpi: string | undefined) {
    const identification = Number(dpi);
    if (String(identification).length !== 13) {
        return false;
    }
    if (!Number.isInteger(identification)) {
        return false;
    }
    if (!Number(dpi) || dpi?.length !== 13) {
        return false;
    }
    if (identification <= 0) {
        return false;
    }
    var depto = parseInt(dpi.substring(9, 11), 10);
    var muni = parseInt(dpi.substring(11, 13));
    var numero: any = dpi.substring(0, 8);
    var verificador = parseInt(dpi.substring(8, 9));
    var munisPorDepto = [
            /* 01 - Guatemala tiene:      */ 17 /* municipios. */,
            /* 02 - El Progreso tiene:    */  8 /* municipios. */,
            /* 03 - Sacatepéquez tiene:   */ 16 /* municipios. */,
            /* 04 - Chimaltenango tiene:  */ 16 /* municipios. */,
            /* 05 - Escuintla tiene:      */ 13 /* municipios. */,
            /* 06 - Santa Rosa tiene:     */ 14 /* municipios. */,
            /* 07 - Sololá tiene:         */ 19 /* municipios. */,
            /* 08 - Totonicapán tiene:    */  8 /* municipios. */,
            /* 09 - Quetzaltenango tiene: */ 24 /* municipios. */,
            /* 10 - Suchitepéquez tiene:  */ 21 /* municipios. */,
            /* 11 - Retalhuleu tiene:     */  9 /* municipios. */,
            /* 12 - San Marcos tiene:     */ 30 /* municipios. */,
            /* 13 - Huehuetenango tiene:  */ 32 /* municipios. */,
            /* 14 - Quiché tiene:         */ 21 /* municipios. */,
            /* 15 - Baja Verapaz tiene:   */  8 /* municipios. */,
            /* 16 - Alta Verapaz tiene:   */ 17 /* municipios. */,
            /* 17 - Petén tiene:          */ 14 /* municipios. */,
            /* 18 - Izabal tiene:         */  5 /* municipios. */,
            /* 19 - Zacapa tiene:         */ 11 /* municipios. */,
            /* 20 - Chiquimula tiene:     */ 11 /* municipios. */,
            /* 21 - Jalapa tiene:         */  7 /* municipios. */,
            /* 22 - Jutiapa tiene:        */ 17 /* municipios. */];
    if (depto === 0 || muni === 0) {
        return false;
    }
    if (depto > munisPorDepto.length) {
        return false;
    }
    if (muni > munisPorDepto[depto - 1]) {
        return false;
    }
    var total = 0;
    for (var i = 0; i < numero.length; i++) {
        total += numero[i] * (i + 2);
    }
    var modulo = (total % 11);
    return modulo === verificador;
}