export const orderReportInscription = (data: any) => {
    let onlyTurn: any = [];
    let allDataTurns: any = [];
    Object.keys(data).forEach(turnoKey => {
        let turnInfo: any = {};
        const TURNO = data[turnoKey];
        const NO_BRAZOS = TURNO.info_turno.numero_brazos_anda;
        let count: number = 0;
        let noTurn: number = 1;
        const SIN_INFORMACION = 'Sin información';
        turnInfo.idTurno = TURNO.info_turno.id;
        turnInfo.descripcion = TURNO.info_turno.descripcion;
        turnInfo.precio = TURNO.info_turno.precio || SIN_INFORMACION;
        turnInfo.numeroBrazosAnda = NO_BRAZOS || SIN_INFORMACION;
        onlyTurn.push(turnInfo);

        TURNO.inscripciones.forEach((inscripcion: any) => {
            let inscriptionInfo: any = {};
            inscriptionInfo.noRecibo = `M-${String(inscripcion.inscripcion_id).padStart(4, '0')}`;
            inscriptionInfo.nombre = inscripcion.nombre_recibo;
            inscriptionInfo.mesa = String(inscripcion.mesa).padStart(3, '0');
            inscriptionInfo.altura = inscripcion.altura_referencia;
            inscriptionInfo.direccion = inscripcion.padre_direccion || SIN_INFORMACION;
            inscriptionInfo.turno = inscripcion.turno_descripcion;
            inscriptionInfo.monto = inscripcion.monto;
            if (NO_BRAZOS) {
                if (count < NO_BRAZOS) {
                    count++;
                } 
                else {
                    count = 1;
                    noTurn++;
                }
                inscriptionInfo.noTurno = noTurn;
                inscriptionInfo.brazoAsignado = count;
                
            }
            else {
                inscriptionInfo.noTurno = "NO APLICA";
                inscriptionInfo.brazoAsignado = "NO APLICA";
            }
            onlyTurn.push(inscriptionInfo);
        });
        allDataTurns.push(onlyTurn);
        onlyTurn = [];
    });

    return allDataTurns;
}