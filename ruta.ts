// Definición de sub-interfaces para una mejor estructura y reusabilidad
export type NivelDificultad = 'Fácil' | 'Moderado' | 'Difícil' | 'Experto';
export type ZonaAraucania = 'Araucanía Lacustre' | 'Araucanía Andina' | 'Nahuelbuta' | 'Temuco y Alrededores';

export interface Coordenadas {
    latitud: number;
    longitud: number;}

export interface ParadaTuristica {
    id: number;
    nombre: string;
    descripcion: string;
    coordenadas: Coordenadas;}

// Interfaz principal que modela toda la información de una ruta
export interface RutaEcoRuta {
    id: number | string;
    nombre: string;
    zona: ZonaAraucania;
    origen: string;
    destino: string;
    distanciaKm: number;
    tiempoEstimadoHoras: number;
    dificultad: NivelDificultad;
    estado: 'Disponible' | 'Clima Adverso' | 'Mantenimiento';
    coordenadasInicio: Coordenadas;
    paradas: ParadaTuristica[];
    imagenUrl: string;
    descripcionBreve: string;
    esSustentable: boolean;}
