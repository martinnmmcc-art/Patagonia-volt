// ══════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════
let tasks     = [];
let budget    = [];
let materials = [];
const DEFAULT_SETTINGS = { hideUnit: false, showMats: true, includeDesc: true };
let settings  = { ...DEFAULT_SETTINGS };
const DEFAULT_TASK_DESC = {
  // Redacción propia, basada en la Reglamentación AEA 90364 (Asociación Electrotécnica Argentina)
  // y sus secciones/cláusulas específicas — no copiado de ningún sitio comercial. Editalas en Config.
  'Acometidas': 'Conexión desde la red pública hasta el medidor. La AEA exige que el conductor de bajada quede inaccesible sin uso de herramientas (protegido en caño embutido) y prohíbe interconectar la masa del circuito con las cañerías de agua o gas (AEA 90364, Anexo 771-C.3.2.2). El calibre del conductor y el diámetro del caño se dimensionan según la potencia contratada (kW). No incluye materiales ni la jabalina de puesta a tierra.',
  'Cableado': 'Tendido de conductores por cañería (nueva o existente) hasta cada boca. La AEA 90364-7-771 exige separar los circuitos de Iluminación de Uso General (IUG) de los de Tomas de Uso General (TUG): IUG con sección mínima 1,5mm² y protección de 10A (hasta 15 bocas por circuito), TUG con sección mínima 2,5mm² y protección de 16A (hasta 8 bocas), cada uno con su propia térmica. Colores obligatorios (AEA 90364-5-514): fase marrón/negro/rojo, neutro celeste, protección (tierra) verde-amarillo exclusivo. El precio se calcula por cantidad de bocas. No incluye materiales.',
  'Canalización': 'Colocación de caños y cajas, embutidos o a la vista. La AEA 90364-7-771 (cláusula 771.12.3) exige un máximo de 3 curvas entre cajas o gabinetes, y que todo cambio de sistema de canalización se resuelva dentro de una caja; también prohíbe interconectar las cañerías eléctricas con las de gas o agua (Anexo 771-C.3.2.2). La fijación a la pared depende de la longitud del tramo (mínimo 2 puntos si mide menos de 2m, 3 puntos o más si es mayor). El costo cambia según el material (metálico o PVC) y si va embutido o a la vista. No incluye materiales.',
  'CCTV': 'Cableado de cada cámara de seguridad hasta el grabador (BCR), con o sin canalización según se elija. La AEA 90364 no regula específicamente los sistemas de CCTV por ser de baja tensión y datos (quedan fuera del alcance de la Sección 771 de viviendas), pero si comparten cañería con la instalación de fuerza deben mantenerse separados de los circuitos de energía. No incluye las cámaras, el grabador ni la configuración del sistema.',
  'Tablero': 'Fijación (a la vista) o empotrado del gabinete y conexión de las protecciones. La AEA exige una separación mínima de 8cm entre los elementos y los laterales del tablero, y 8cm entre filas de térmicas (Anexo AEA 90364), además de un grado de protección IP acorde al ambiente (cláusula 770.16.2.1): IP44 en exteriores, lavaderos y cocinas; IP55 en tableros de uso industrial. Cada circuito debe tener su propia protección termomagnética, y los circuitos de tomas deben estar protegidos por un diferencial de 30mA (AEA 90364-7-770). El precio varía según si va empotrado o a la vista, y la cantidad de bocas. No incluye materiales.',
  'Puesta a Tierra': 'Hincado de la jabalina y colocación de la caja de inspección. La AEA 90364 (subcláusula 771.3.3.1) fija un valor máximo reglamentario de resistencia de puesta a tierra de 40Ω, aunque el objetivo de ingeniería recomendado —combinado con un diferencial de 30mA— es de 10Ω o menos, para que el diferencial actúe rápido ante una falla (regla Ra×Ia≤50V, AEA 90364-4-41). El conductor de protección (PE) se identifica siempre en verde-amarillo (AEA 90364-5-514) y ese color no puede usarse para ninguna otra función. No incluye materiales.',
  'Artefactos': 'Fijación mecánica y conexión eléctrica del artefacto (extractor, campana, ventilador de techo, etc.) a una salida ya cableada, correspondiente al circuito de Toma de Uso Especial (TUE) cuando alimenta un solo equipo de potencia, con sección dimensionada según el consumo del artefacto (AEA 90364-7-771). No incluye el artefacto ni materiales de fijación.',
  'Bandeja': 'Tendido y fijación de la bandeja portacables a la altura indicada. La AEA exige la puesta a tierra de las bandejas metálicas (por ser masa accesible) y una fijación firme que evite deformación o pandeo del tramo. El precio depende del ancho de la bandeja y la altura de trabajo. No incluye materiales.',
  'Boca Completa': 'Paquete completo: canalización, cableado y caja, dejando la boca lista para conectar. Aplican las mismas exigencias de sección y protección de los circuitos IUG (iluminación) o TUG (tomas) según el uso de la boca, establecidas en la AEA 90364-7-771. El precio baja según la cantidad de bocas del trabajo, y cambia según el material de la cañería (metálica o PVC) y si va embutida o a la vista. No incluye materiales.',
  'Cablecanal': 'Colocación de una canaleta plástica con tapa, a la vista, para el tendido de cables sin romper la pared. El material debe cumplir la normativa IRAM correspondiente al tipo de canalización (Tabla 770.10 de la AEA) y respetar la misma separación entre circuitos que exige cualquier otra canalización. El precio es por boca, más un adicional por cada metro extra de recorrido. No incluye materiales.',
  'Corrección Potencia': 'Armado y conexión de un tablero con capacitores para corregir el factor de potencia y evitar el recargo que aplican las distribuidoras por bajo factor en instalaciones de mayor consumo (comercios, industrias). No es un requisito de la AEA 90364 —que regula instalaciones domiciliarias e inmuebles— sino una exigencia habitual de las empresas distribuidoras a partir de cierto nivel de consumo. El precio varía según la capacidad en kvar y si el sistema es automático. No incluye materiales.',
  'Luminarias': 'Fijación mecánica y conexión eléctrica de la luminaria a una salida ya cableada, correspondiente al circuito de Iluminación de Uso General (IUG: sección mínima 1,5mm², protección 10A, AEA 90364-7-771). El tiempo y el precio varían según el tipo de artefacto y la cantidad de luces. No incluye el artefacto ni materiales de fijación.',
  'Mantenimiento': 'Visita de urgencia ante una falla eléctrica, con un tiempo máximo de trabajo (TM) incluido en el precio; superado ese tiempo se cobra por hora adicional. Ante cualquier intervención, la AEA 90364-6 exige verificar la continuidad de las masas y el correcto funcionamiento del diferencial antes de restablecer el suministro. El costo varía según la distancia al domicilio y el horario (día hábil u horario especial). No incluye materiales.',
  'Pisoducto': 'Instalación de los ductos dentro del contrapiso (cajas de piso, curvas, derivaciones) y/o su cableado de energía o datos. Debe respetar la misma separación entre circuitos de energía y de datos que exige la AEA para cualquier canalización. No incluye materiales.',
  'Proyecto Eléctrico': 'Relevamiento, cálculo de cargas y documentación técnica según el grado de electrificación que define la AEA 90364-7-771: Mínimo (3,3kW, hasta 60m²), Medio (6,6kW, hasta 120m²), Elevado (9,9kW, con calefacción o cocina eléctrica) y Superior (13,2kW). Ese grado determina la cantidad mínima de circuitos y el calibre de la acometida. El precio depende de la cantidad de bocas del proyecto. No incluye trámites ante la empresa distribuidora.',
};

// Reglas técnicas por tarea (más específicas que la categoría). Redacción propia, criterio de
// ingeniero senior + AEA 90364 donde aplica. Se evalúan en orden; la primera que matchea el
// nombre de la tarea gana. Si ninguna matchea, se usa DEFAULT_TASK_DESC[categoría] como respaldo.
const TASK_DESC_RULES = [
  [/acometida monof/i, 'Acometida domiciliaria monofásica (fase + neutro). La AEA exige que el conductor de bajada quede inaccesible sin herramientas (embutido en caño de doble aislación) y prohíbe unir la masa del circuito a las cañerías de agua o gas (Anexo 771-C.3.2.2). El calibre se dimensiona según la potencia contratada. No incluye materiales ni jabalina de puesta a tierra.'],
  [/acometida trif/i, 'Acometida domiciliaria trifásica (tres fases + neutro), para cargas mayores o cuando la distribuidora exige suministro trifásico. Mismas exigencias que la acometida monofásica en protección mecánica del conductor y separación de cañerías de gas/agua. El calibre se dimensiona según el tramo de potencia. No incluye materiales ni jabalina de puesta a tierra.'],
  [/subterráneo/i, 'Cableado subterráneo, directamente enterrado o entubado. Si no se alcanza la profundidad mínima de 0,70m, el conductor debe protegerse con caño recubierto por una capa de hormigón de al menos 8cm, y colocar una cámara de inspección cada 40m en tramos rectos (Anexo de la Reglamentación AEA 90364). La sección se dimensiona según la sección total del cable. No incluye materiales.'],
  [/re-?cableado/i, 'Retiro del cableado existente y tendido de conductores nuevos por la misma cañería, típico en reformas. Aplican las mismas exigencias de sección y separación de circuitos IUG/TUG que un cableado nuevo (AEA 90364-7-771). El precio baja según la cantidad de bocas. No incluye materiales.'],
  [/^cableado/i, 'Tendido de conductores por cañería ya canalizada, hasta cada boca. Circuitos IUG (iluminación: 1,5mm², protección 10A, hasta 15 bocas) y TUG (tomas: 2,5mm², protección 16A, hasta 8 bocas) separados según AEA 90364-7-771, con colores normalizados: fase marrón/negro/rojo, neutro celeste, tierra verde-amarillo exclusivo (AEA 90364-5-514). El precio baja según la cantidad de bocas. No incluye materiales.'],
  [/canalización embutida metálica/i, 'Colocación de cañería metálica embutida en la pared, con sus cajas. La AEA exige un máximo de 3 curvas entre cajas o gabinetes (cláusula 771.12.3) y prohíbe la unión con cañerías de gas o agua (Anexo 771-C.3.2.2). El precio se cobra por boca. No incluye materiales.'],
  [/canalización embutida pvc/i, 'Colocación de cañería de PVC embutida en la pared, con sus cajas. Mismas exigencias de recorrido y separación que la canalización metálica (AEA 90364-7-771, cláusula 771.12.3). El precio se cobra por boca. No incluye materiales.'],
  [/canalización a la vista/i, 'Colocación de cañería (metálica o PVC) a la vista, sujeta con grampas o abrazaderas. La fijación depende de la longitud del tramo: mínimo 2 puntos si mide menos de 2m, 3 puntos o más si es mayor. El precio se cobra por boca. No incluye materiales.'],
  [/durlock/i, 'Colocación de cañería (metálica o PVC rígido) embutida dentro de un tabique de Durlock, con sus cajas para ese tipo de tabique. Mismas exigencias de recorrido y curvas que cualquier canalización embutida (AEA 90364-7-771). El precio se cobra por boca. No incluye materiales.'],
  [/pisoducto (por metro|cajas|derivación|curvas|periscopio)/i, 'Instalación física del pisoducto dentro del contrapiso: tramo recto, caja de piso, derivación, curva o periscopio, según corresponda. Debe respetar la misma separación entre circuitos de energía y de datos que exige la AEA para cualquier canalización. No incluye materiales.'],
  [/cableado pisoducto|pisoducto instalación de tomas/i, 'Tendido de cables de energía o de comunicación/datos, o instalación de la toma, dentro del pisoducto ya instalado. Los conductores de energía y de datos deben mantenerse separados dentro del ducto. No incluye materiales.'],
  [/cctv.*superficie/i, 'Cableado de la(s) cámara(s) hasta el grabador (BCR) en canalización a la vista o cablecanal existente. La AEA no regula específicamente los sistemas de CCTV (son de baja tensión/datos), pero si comparten cañería con la instalación de fuerza deben mantenerse separados de los circuitos de energía. No incluye cámaras, grabador ni configuración del sistema.'],
  [/cctv.*canalización/i, 'Incluye una canalización corta (aprox. 5m por cámara) además del cableado hasta el grabador (BCR) y su conexión. No incluye cámaras, grabador, materiales de canalización ni configuración del sistema.'],
  [/aplique/i, 'Fijación mecánica del aplique de pared y conexión eléctrica a la salida ya cableada del circuito de iluminación (IUG). No incluye el artefacto ni materiales de fijación.'],
  [/colgante/i, 'Fijación del artefacto colgante (a techo, con cadena, cable o varilla) y conexión eléctrica a la salida ya cableada del circuito de iluminación (IUG). No incluye el artefacto ni materiales de fijación.'],
  [/farola/i, 'Fijación de la farola de pared y conexión eléctrica a la salida ya cableada, verificando el grado de protección IP adecuado para uso exterior (mínimo IP65 en zonas de intemperie). No incluye el artefacto ni materiales de fijación.'],
  [/tubo led/i, 'Fijación del artefacto para tubo LED (tipo bandeja o regleta) y conexión eléctrica a la salida ya cableada del circuito de iluminación. No incluye el artefacto ni materiales de fijación.'],
  [/luz de emergencia/i, 'Fijación y conexión del equipo autónomo de luz de emergencia, alimentado antes de la llave general para que funcione ante un corte de suministro. La AEA 90364 no regula específicamente los equipos de emergencia (dependen de la normativa de seguridad contra incendios/IRAM del tipo de local), pero sí la alimentación eléctrica del circuito. No incluye el equipo ni materiales de fijación.'],
  [/alumbrado público/i, 'Fijación del brazo/luminaria en el poste y conexión eléctrica. Por ser instalación de intemperie, la AEA exige un grado de protección mínimo IP65 en el artefacto. No incluye el artefacto ni materiales de fijación.'],
  [/extractor|campana/i, 'Fijación mecánica y conexión eléctrica del extractor de aire o campana a una salida ya cableada, correspondiente a un circuito de Toma de Uso Especial (TUE) si alimenta un solo equipo de potencia, con sección dimensionada según su consumo. No incluye el artefacto, la conexión al conducto de extracción ni materiales de fijación.'],
  [/ventilador de techo/i, 'Fijación mecánica del ventilador de techo (incluye reforzar el punto de anclaje si es necesario) y conexión eléctrica a la salida ya cableada del circuito de iluminación. No incluye el artefacto ni materiales de fijación.'],
  [/c\/contactor/i, 'Corrección de factor de potencia con contactor para conectar/desconectar los capacitores según la demanda, reduciendo el riesgo de sobrecompensación en horarios de bajo consumo. No es un requisito de la AEA 90364 sino una exigencia habitual de la distribuidora a partir de cierto nivel de consumo. No incluye materiales.'],
  [/automático.*kvar|kvar.*automático/i, 'Tablero automático de corrección de potencia con regulador que conecta/desconecta escalones (pasos) de capacitores según el factor de potencia medido en tiempo real. Requiere más pasos cuanto más variable sea la carga de la instalación. No incluye materiales.'],
  [/tablero (monofásico|trifásico) hasta.*kvar/i, 'Armado y conexión de un tablero de corrección de factor de potencia con capacitores fijos, dimensionado en kVAr según el consumo reactivo de la instalación. No es un requisito de la AEA 90364 sino una exigencia habitual de la distribuidora a partir de cierto nivel de consumo. No incluye materiales.'],
  [/emergencia l-v/i, 'Visita de urgencia en horario hábil (lunes a viernes), con un tiempo máximo de trabajo (TM) incluido en el precio; superado ese tiempo se cobra por hora adicional. Ante cualquier intervención, la AEA 90364-6 exige verificar la continuidad de las masas y el funcionamiento del diferencial antes de restablecer el suministro. No incluye materiales.'],
  [/emergencia s\/d\/f/i, 'Visita de urgencia en sábado, domingo o feriado, con un tiempo máximo de trabajo (TM) incluido en el precio; superado ese tiempo se cobra por hora adicional a la tarifa de fin de semana. No incluye materiales.'],
  [/fijación gabinete superficie/i, 'Fijación del gabinete de protecciones a la pared mediante tarugos u otro anclaje mecánico, sin obra de albañilería. La AEA exige una separación mínima de 8cm entre los elementos y los laterales del tablero, y 8cm entre filas de térmicas (Anexo AEA 90364). No incluye materiales.'],
  [/empotrado gabinete/i, 'Apertura del nicho en la mampostería (perforado de pared) y fijación del gabinete mediante mezcla de cal y cemento. Mismas exigencias de separación interna que el tablero de superficie (Anexo AEA 90364). No incluye materiales.'],
  [/termomagnética\/diferencial monofásico/i, 'Conexión mecánica de la protección termomagnética y el disyuntor diferencial en un circuito monofásico. La AEA exige que cada circuito tenga su propia térmica y que los circuitos de tomas estén protegidos por un diferencial de 30mA (AEA 90364-7-770). No incluye la térmica ni el diferencial (materiales).'],
  [/termomagnética\/diferencial trifásico/i, 'Igual que en monofásico, pero para un circuito trifásico (protecciones tripolares o tetrapolares según el esquema). No incluye la térmica ni el diferencial (materiales).'],
  [/cañería metálica embutida/i, 'Boca completa con cañería metálica embutida: canalización, cableado y caja, lista para conectar. Aplican las exigencias de sección de los circuitos IUG/TUG según el uso de la boca (AEA 90364-7-771). No incluye materiales.'],
  [/cañería metálica a la vista/i, 'Boca completa con cañería metálica a la vista: canalización, cableado y caja, lista para conectar. Mismas exigencias de sección que la boca embutida. No incluye materiales.'],
  [/cañería plástica embutida/i, 'Boca completa con cañería de PVC embutida: canalización, cableado y caja, lista para conectar. Mismas exigencias de sección que cualquier boca completa (AEA 90364-7-771). No incluye materiales.'],
  [/cañería plástica a la vista/i, 'Boca completa con cañería de PVC a la vista: canalización, cableado y caja, lista para conectar. Mismas exigencias de sección que cualquier boca completa. No incluye materiales.'],
  [/bandeja porta cables/i, 'Boca completa cableada sobre bandeja portacables, sin cañería individual: tendido del conductor sobre la bandeja y conexión en la boca. No incluye materiales.'],
];

let taskDescOverride = {}; // { 'nombre de tarea': 'texto editado a mano por el usuario' }

function getTaskDesc(task) {
  if (!task) return '';
  if (taskDescOverride[task.name]) return taskDescOverride[task.name];
  for (const [re, text] of TASK_DESC_RULES) { if (re.test(task.name)) return text; }
  return DEFAULT_TASK_DESC[task.cat] || '';
}

let userCfg   = { nombre: '', tel: '', email: '' };
let history_  = [];      // array of saved budgets
let visits    = [];      // array of client visits (visita al cliente)
let clients   = [];      // array of clients { id, nombre, direccion, telefono }
let activeCat = 'Todos';
let activeMatCat = 'Todos';
let activeHistIdx = null;

// ══════════════════════════════════════════════════════════
//  BUILT-IN DATA  (Electro Instalador Mar-Abr 2026)
// ══════════════════════════════════════════════════════════
const BUILTIN = [
  {cat:'Acometidas',name:'Acometida monofásica hasta 10 kW',price:201700},
  {cat:'Acometidas',name:'Acometida trifásica hasta 10 kW',price:283800},
  {cat:'Acometidas',name:'Acometida trifásica 11 a 35 kW',price:373500},
  {cat:'Acometidas',name:'Acometida trifásica 36 a 50 kW',price:545300},
  {cat:'Cableado',name:'Cableado metálica embutida 1-50 bocas',price:32000},
  {cat:'Cableado',name:'Cableado metálica embutida 51-100 bocas',price:30800},
  {cat:'Cableado',name:'Cableado metálica embutida 101-500 bocas',price:30700},
  {cat:'Cableado',name:'Subterráneo 1x4 a 4x16 mm²',price:20400},
  {cat:'Cableado',name:'Subterráneo 1x25 a 4x35 mm²',price:40900},
  {cat:'Cableado',name:'Subterráneo 1x35 a 4x70 mm²',price:73300},
  {cat:'Cableado',name:'Subterráneo mayores 1x95 mm²',price:97600},
  {cat:'Cableado',name:'Re-cableado 1-50 bocas',price:39500},
  {cat:'Cableado',name:'Re-cableado 51-100 bocas',price:37600},
  {cat:'Cableado',name:'Re-cableado 101-500 bocas',price:33100},
  {cat:'Canalización',name:'Canalización embutida metálica 1-50 bocas',price:49700},
  {cat:'Canalización',name:'Canalización embutida metálica 51-100 bocas',price:48700},
  {cat:'Canalización',name:'Canalización embutida PVC 1-50 bocas',price:48700},
  {cat:'Canalización',name:'Canalización embutida PVC 51-100 bocas',price:47400},
  {cat:'Canalización',name:'Canalización a la vista metálica 1-50 bocas',price:47400},
  {cat:'Canalización',name:'Canalización a la vista metálica 51-100 bocas',price:46400},
  {cat:'Canalización',name:'Canalización a la vista PVC 1-50 bocas',price:46400},
  {cat:'Canalización',name:'Canalización a la vista PVC 51-100 bocas',price:45500},
  {cat:'Canalización',name:'Metálica 3/4 en Durlock 1-50 bocas',price:41400},
  {cat:'Canalización',name:'Metálica 3/4 en Durlock 51-100 bocas',price:37000},
  {cat:'Canalización',name:'PVC rígido 3/4 en Durlock 1-50 bocas',price:37700},
  {cat:'Canalización',name:'PVC rígido 3/4 en Durlock 51-100 bocas',price:35100},
  {cat:'Bandeja',name:'Bandeja metálica 300mm hasta 2m',price:47000},
  {cat:'Bandeja',name:'Bandeja metálica 300mm 3-5m',price:51100},
  {cat:'Bandeja',name:'Bandeja metálica 300mm 6-10m',price:56200},
  {cat:'Bandeja',name:'Bandeja metálica 450mm hasta 2m',price:51100},
  {cat:'Bandeja',name:'Bandeja metálica 450mm 3-5m',price:56200},
  {cat:'Bandeja',name:'Bandeja metálica 450mm 6-10m',price:61800},
  {cat:'Bandeja',name:'Bandeja metálica 600mm hasta 2m',price:56800},
  {cat:'Bandeja',name:'Bandeja metálica 600mm 3-5m',price:61800},
  {cat:'Bandeja',name:'Bandeja metálica 600mm 6-10m',price:67700},
  {cat:'Cablecanal',name:'Cablecanal 1-50 bocas',price:44200},
  {cat:'Cablecanal',name:'Cablecanal 51-100 bocas',price:43500},
  {cat:'Cablecanal',name:'Cablecanal 101-500 bocas',price:42500},
  {cat:'Cablecanal',name:'Cablecanal metro adicional',price:15200},
  {cat:'Pisoducto',name:'Pisoducto por metro',price:36600},
  {cat:'Pisoducto',name:'Pisoducto cajas de piso',price:54300},
  {cat:'Pisoducto',name:'Pisoducto derivación',price:54300},
  {cat:'Pisoducto',name:'Pisoducto curvas vertical',price:43100},
  {cat:'Pisoducto',name:'Pisoducto curvas horizontal',price:43100},
  {cat:'Pisoducto',name:'Pisoducto periscopios',price:51200},
  {cat:'Pisoducto',name:'Cableado pisoducto energía',price:48500},
  {cat:'Pisoducto',name:'Cableado pisoducto comunicación',price:45700},
  {cat:'Pisoducto',name:'Pisoducto instalación de tomas',price:35800},
  {cat:'CCTV',name:'CCTV 1 cámara en superficie',price:80200},
  {cat:'CCTV',name:'CCTV BCR 3 cámaras en superficie',price:279900},
  {cat:'CCTV',name:'CCTV BCR 6 cámaras en superficie',price:376700},
  {cat:'CCTV',name:'CCTV BCR 12 cámaras en superficie',price:452000},
  {cat:'CCTV',name:'CCTV BCR 18 cámaras en superficie',price:558500},
  {cat:'CCTV',name:'CCTV 1 cámara con canalización',price:115100},
  {cat:'CCTV',name:'CCTV BCR 3 cámaras con canalización',price:334700},
  {cat:'CCTV',name:'CCTV BCR 6 cámaras con canalización',price:414500},
  {cat:'CCTV',name:'CCTV BCR 12 cámaras con canalización',price:539100},
  {cat:'CCTV',name:'CCTV BCR 18 cámaras con canalización',price:608700},
  {cat:'Luminarias',name:'Aplique 1-2 luces',price:27200},
  {cat:'Luminarias',name:'Aplique 3-5 luces',price:30500},
  {cat:'Luminarias',name:'Colgante 1 luz',price:44500},
  {cat:'Luminarias',name:'Colgante 2 luces',price:47800},
  {cat:'Luminarias',name:'Farola de pared 1 luz',price:48900},
  {cat:'Luminarias',name:'Farola de pared 2 luces',price:52200},
  {cat:'Luminarias',name:'Artefacto tubo LED simple',price:51100},
  {cat:'Luminarias',name:'Artefacto tubo LED 2 tubos',price:62000},
  {cat:'Luminarias',name:'Luz de emergencia',price:40200},
  {cat:'Luminarias',name:'Brazo alumbrado público',price:172200},
  {cat:'Artefactos',name:'Extractor de aire baño',price:148000},
  {cat:'Artefactos',name:'Extractor de aire cocina',price:209800},
  {cat:'Artefactos',name:'Extractor de aire cocina 240mm',price:296800},
  {cat:'Artefactos',name:'Campana tipo spar',price:137000},
  {cat:'Artefactos',name:'Ventilador de techo sin luces',price:90200},
  {cat:'Artefactos',name:'Ventilador de techo con luces',price:115800},
  {cat:'Corrección Potencia',name:'Tablero monofásico hasta 2 kVAr',price:266400},
  {cat:'Corrección Potencia',name:'Tablero trifásico hasta 10 kVAr',price:300600},
  {cat:'Corrección Potencia',name:'Tablero trifásico hasta 20 kVAr',price:346700},
  {cat:'Corrección Potencia',name:'Tablero trifásico c/contactor hasta 10 kVAr',price:424900},
  {cat:'Corrección Potencia',name:'Tablero trifásico c/contactor hasta 20 kVAr',price:512600},
  {cat:'Corrección Potencia',name:'Tablero trifásico automático 50 kVAr 6 pasos',price:512600},
  {cat:'Corrección Potencia',name:'Tablero trifásico automático 100 kVAr 6 pasos',price:590600},
  {cat:'Corrección Potencia',name:'Tablero trifásico automático 150 kVAr 6 pasos',price:1133900},
  {cat:'Mantenimiento',name:'Emergencia L-V hasta 5 km (TM 4h)',price:250800},
  {cat:'Mantenimiento',name:'Emergencia L-V hasta 10 km (TM 4:30h)',price:332100},
  {cat:'Mantenimiento',name:'Emergencia L-V hasta 20 km (TM 5h)',price:445500},
  {cat:'Mantenimiento',name:'Emergencia S/D/F hasta 5 km (TM 4h)',price:350000},
  {cat:'Mantenimiento',name:'Emergencia S/D/F hasta 10 km (TM 4:30h)',price:496800},
  {cat:'Mantenimiento',name:'Emergencia S/D/F hasta 20 km (TM 5h)',price:686500},
  {cat:'Proyecto Eléctrico',name:'Proyecto hasta 25 bocas',price:388000},
  {cat:'Proyecto Eléctrico',name:'Proyecto 26-50 bocas',price:535400},
  {cat:'Proyecto Eléctrico',name:'Proyecto 51-100 bocas',price:632700},
  {cat:'Proyecto Eléctrico',name:'Proyecto 101-500 bocas',price:979400},
  {cat:'Puesta a Tierra',name:'Jabalina 1.5m + caja de inspección',price:94600},
  {cat:'Tablero',name:'Fijación gabinete superficie 1-54 bocas',price:44000},
  {cat:'Tablero',name:'Empotrado gabinete mampostería 1-24 bocas',price:185300},
  {cat:'Tablero',name:'Empotrado gabinete mampostería 25-54 bocas',price:211100},
  {cat:'Tablero',name:'Termomagnética/diferencial monofásico',price:81900},
  {cat:'Tablero',name:'Termomagnética/diferencial trifásico',price:107900},
  {cat:'Boca Completa',name:'Cañería metálica embutida 1-50',price:77200},
  {cat:'Boca Completa',name:'Cañería metálica embutida 51-100',price:75300},
  {cat:'Boca Completa',name:'Cañería metálica embutida 101-500',price:73900},
  {cat:'Boca Completa',name:'Cañería metálica a la vista 1-50',price:75100},
  {cat:'Boca Completa',name:'Cañería metálica a la vista 51-100',price:73100},
  {cat:'Boca Completa',name:'Cañería metálica a la vista 101-500',price:72000},
  {cat:'Boca Completa',name:'Cañería plástica embutida 1-50',price:76300},
  {cat:'Boca Completa',name:'Cañería plástica embutida 51-100',price:74100},
  {cat:'Boca Completa',name:'Cañería plástica embutida 101-500',price:73100},
  {cat:'Boca Completa',name:'Cañería plástica a la vista 1-50',price:74100},
  {cat:'Boca Completa',name:'Cañería plástica a la vista 51-100',price:72200},
  {cat:'Boca Completa',name:'Cañería plástica a la vista 101-500',price:70800},
  {cat:'Boca Completa',name:'Bandeja porta cables p/metro 1-50',price:61100},
  {cat:'Boca Completa',name:'Bandeja porta cables p/metro 51-100',price:57000},
  {cat:'Boca Completa',name:'Bandeja porta cables p/metro 101-500',price:54300},
];

// ══════════════════════════════════════════════════════════
//  CATÁLOGO DE MATERIALES (sin precio, solo descripción — uso residencial AR)
// ══════════════════════════════════════════════════════════
const MATERIAL_CATALOG = [
  // ═══ CAÑOS PVC (rígido, solo mm) ═══
  {cat:'Caños PVC', name:'Caño PVC rígido 16mm x 3m'},
  {cat:'Caños PVC', name:'Caño PVC rígido 20mm x 3m'},
  {cat:'Caños PVC', name:'Caño PVC rígido 25mm x 3m'},
  {cat:'Caños PVC', name:'Caño PVC rígido 32mm x 3m'},
  {cat:'Caños PVC', name:'Caño PVC rígido 38mm x 3m'},
  {cat:'Caños PVC', name:'Caño PVC rígido 50mm x 3m'},

  // ═══ ACCESORIOS PVC (curvas, uniones, conectores) ═══
  {cat:'Accesorios PVC', name:'Curva PVC 90° 16mm'},
  {cat:'Accesorios PVC', name:'Curva PVC 90° 20mm'},
  {cat:'Accesorios PVC', name:'Curva PVC 90° 25mm'},
  {cat:'Accesorios PVC', name:'Curva PVC 90° 32mm'},
  {cat:'Accesorios PVC', name:'Curva PVC 90° 38mm'},
  {cat:'Accesorios PVC', name:'Codo PVC 16mm'},
  {cat:'Accesorios PVC', name:'Codo PVC 20mm'},
  {cat:'Accesorios PVC', name:'Codo PVC 25mm'},
  {cat:'Accesorios PVC', name:'Unión (cupla) PVC 16mm'},
  {cat:'Accesorios PVC', name:'Unión (cupla) PVC 20mm'},
  {cat:'Accesorios PVC', name:'Unión (cupla) PVC 25mm'},
  {cat:'Accesorios PVC', name:'Unión (cupla) PVC 32mm'},
  {cat:'Accesorios PVC', name:'Unión (cupla) PVC 38mm'},
  {cat:'Accesorios PVC', name:'Conector caño-caja PVC 16mm'},
  {cat:'Accesorios PVC', name:'Conector caño-caja PVC 20mm'},
  {cat:'Accesorios PVC', name:'Conector caño-caja PVC 25mm'},
  {cat:'Accesorios PVC', name:'Conector caño-caja PVC 32mm'},
  {cat:'Accesorios PVC', name:'Pegamento para PVC (pomo)'},

  // ═══ GRAMPAS PVC (con traba, no de tornillo/tarugo) ═══
  {cat:'Grampas PVC', name:'Grampa PVC con traba 16mm'},
  {cat:'Grampas PVC', name:'Grampa PVC con traba 20mm'},
  {cat:'Grampas PVC', name:'Grampa PVC con traba 25mm'},
  {cat:'Grampas PVC', name:'Grampa PVC con traba 32mm'},
  {cat:'Grampas PVC', name:'Grampa PVC con traba 38mm'},

  // ═══ CAÑOS CORRUGADOS (en pulgadas) ═══
  {cat:'Caños corrugados', name:'Corrugado liviano 3/8" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado liviano 1/2" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado liviano 3/4" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado liviano 1" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 1/2" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 3/4" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 1" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 1 1/4" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 1 1/2" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 2" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 3/4" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 1" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 1 1/4" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 1 1/2" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 2" (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 3" (rollo)'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 3/8"'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 1/2"'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 3/4"'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 1"'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 1 1/4"'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 1 1/2"'},
  {cat:'Caños corrugados', name:'Conector recto para corrugado 2"'},
  {cat:'Caños corrugados', name:'Sonda pasacables (fiscal) 3/4"'},

  // ═══ CAJAS RECTANGULARES ═══
  {cat:'Cajas rectangulares', name:'Caja rectangular de aplicar PVC 5x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular de aplicar PVC doble 10x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular de embutir PVC 5x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular de embutir PVC doble 10x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular de cablecanal PVC 5x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular metálica 5x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular metálica doble 10x10cm'},
  {cat:'Cajas rectangulares', name:'Tapa ciega para caja rectangular'},

  // ═══ CAJAS OCTOGONALES ═══
  {cat:'Cajas octogonales', name:'Caja octogonal PVC chica (55mm)'},
  {cat:'Cajas octogonales', name:'Caja octogonal PVC grande (100mm)'},
  {cat:'Cajas octogonales', name:'Caja octogonal metálica chica'},
  {cat:'Cajas octogonales', name:'Caja octogonal metálica grande'},
  {cat:'Cajas octogonales', name:'Tapa ciega para caja octogonal'},

  // ═══ CAJAS REDONDAS ═══
  {cat:'Cajas redondas', name:'Caja redonda de aplicar PVC chica'},
  {cat:'Cajas redondas', name:'Caja redonda de aplicar PVC grande'},
  {cat:'Cajas redondas', name:'Caja redonda estanco PVC (IP65)'},

  // ═══ CAJAS ESTANCO (IP65) ═══
  {cat:'Cajas estanco', name:'Caja estanco 80x80x55mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 100x100x50mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 120x80x55mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 150x110x70mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 150x150x70mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 190x140x70mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 200x120x75mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 200x200x90mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 250x200x100mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 300x200x120mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 300x300x120mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 400x300x150mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 400x400x160mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 500x400x200mm (IP65)'},

  // ═══ PUESTA A TIERRA ═══
  {cat:'Puesta a tierra', name:'Jabalina 16mm x 1m (según AEA 90364)'},
  {cat:'Puesta a tierra', name:'Jabalina 16mm x 1,5m (según AEA 90364)'},
  {cat:'Puesta a tierra', name:'Jabalina 16mm x 2m (según AEA 90364)'},
  {cat:'Puesta a tierra', name:'Jabalina 16mm x 2,4m (según AEA 90364)'},
  {cat:'Puesta a tierra', name:'Grampa bimetálica para jabalina'},
  {cat:'Puesta a tierra', name:'Caja de inspección PVC para jabalina'},
  {cat:'Puesta a tierra', name:'Cable unipolar verde-amarillo (PAT) 4mm²'},
  {cat:'Puesta a tierra', name:'Cable unipolar verde-amarillo (PAT) 6mm²'},
  {cat:'Puesta a tierra', name:'Cable unipolar verde-amarillo (PAT) 10mm²'},
  {cat:'Puesta a tierra', name:'Cable unipolar verde-amarillo (PAT) 16mm²'},
  {cat:'Puesta a tierra', name:'Cable unipolar verde-amarillo (PAT) 25mm²'},
  {cat:'Puesta a tierra', name:'Bornera PAT 7 contactos (riel DIN)'},
  {cat:'Puesta a tierra', name:'Bornera PAT 12 contactos (riel DIN)'},

  // ═══ TABLEROS ═══
  {cat:'Tableros', name:'Tablero de embutir 1x4 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x8 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x12 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x16 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x18 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x24 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x32 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x36 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x48 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x4 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x8 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x12 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x16 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x18 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x24 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x32 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x36 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x48 módulos'},
  {cat:'Tableros', name:'Riel DIN 35mm'},
  {cat:'Tableros', name:'Peine de distribución monofásico (bipolar)'},
  {cat:'Tableros', name:'Peine de distribución trifásico (tetrapolar)'},

  // ═══ GABINETES ═══
  {cat:'Gabinetes', name:'Gabinete metálico IP54 20x20x15cm con calado'},
  {cat:'Gabinetes', name:'Gabinete metálico IP54 30x20x15cm con calado'},
  {cat:'Gabinetes', name:'Gabinete metálico IP54 40x30x20cm con calado'},
  {cat:'Gabinetes', name:'Gabinete metálico IP54 50x40x20cm con calado'},
  {cat:'Gabinetes', name:'Gabinete metálico IP66 30x30x20cm con calado'},
  {cat:'Gabinetes', name:'Gabinete metálico IP66 40x40x20cm con calado'},
  {cat:'Gabinetes', name:'Gabinete de PVC IP65 20x20x14cm'},
  {cat:'Gabinetes', name:'Gabinete de PVC IP66 30x25x15cm'},
  {cat:'Gabinetes', name:'Gabinete para medidor (caja de toma) con calado'},
  {cat:'Gabinetes', name:'Placa de montaje interior para gabinete'},

  // ═══ CONTACTORES Y RELÉS ═══
  {cat:'Contactores y relés', name:'Contactor 9A bobina 220V'},
  {cat:'Contactores y relés', name:'Contactor 9A bobina 24V'},
  {cat:'Contactores y relés', name:'Contactor 18A bobina 220V'},
  {cat:'Contactores y relés', name:'Contactor 18A bobina 24V'},
  {cat:'Contactores y relés', name:'Contactor 25A bobina 220V'},
  {cat:'Contactores y relés', name:'Contactor 25A bobina 24V'},
  {cat:'Contactores y relés', name:'Contactor 32A bobina 220V'},
  {cat:'Contactores y relés', name:'Contactor 32A bobina 24V'},
  {cat:'Contactores y relés', name:'Contactor 40A bobina 220V'},
  {cat:'Contactores y relés', name:'Contactor 40A bobina 24V'},
  {cat:'Contactores y relés', name:'Relé térmico (protección motor)'},
  {cat:'Contactores y relés', name:'Guardamotor'},
  {cat:'Contactores y relés', name:'Relé de estado sólido (SSR)'},
  {cat:'Contactores y relés', name:'Relé temporizador (timer)'},
  {cat:'Contactores y relés', name:'Base/zócalo para relé'},
  {cat:'Contactores y relés', name:'Relé auxiliar/interfase 24V'},

  // ═══ TRANSFORMADORES ═══
  {cat:'Transformadores', name:'Transformador de comando 220V/24V'},
  {cat:'Transformadores', name:'Transformador de comando 220V/12V'},
  {cat:'Transformadores', name:'Fuente conmutada (switching) 220V/24V'},
  {cat:'Transformadores', name:'Fuente conmutada (switching) 220V/12V'},

  // ═══ PILOTOS (señalización luminosa) ═══
  {cat:'Pilotos', name:'Piloto verde 22mm'},
  {cat:'Pilotos', name:'Piloto rojo 22mm'},
  {cat:'Pilotos', name:'Piloto amarillo 22mm'},
  {cat:'Pilotos', name:'Piloto azul 22mm'},
  {cat:'Pilotos', name:'Piloto blanco 22mm'},
  {cat:'Pilotos', name:'Piloto verde 16mm'},
  {cat:'Pilotos', name:'Piloto rojo 16mm'},
  {cat:'Pilotos', name:'Piloto amarillo 16mm'},

  // ═══ PULSADORES Y COMANDO ═══
  {cat:'Pulsadores y comando', name:'Pulsador de marcha (verde)'},
  {cat:'Pulsadores y comando', name:'Pulsador de parada (rojo)'},
  {cat:'Pulsadores y comando', name:'Pulsador marcha/parada (doble, verde y rojo)'},
  {cat:'Pulsadores y comando', name:'Seta de emergencia'},
  {cat:'Pulsadores y comando', name:'Selector de comando 2 posiciones'},
  {cat:'Pulsadores y comando', name:'Selector de comando 3 posiciones'},
  {cat:'Pulsadores y comando', name:'Buzzer/sirena de señalización'},

  // ═══ PROTECCIONES: TÉRMICAS ═══
  {cat:'Térmicas', name:'Térmica unipolar 10A curva B'},
  {cat:'Térmicas', name:'Térmica unipolar 16A curva B'},
  {cat:'Térmicas', name:'Térmica unipolar 20A curva B'},
  {cat:'Térmicas', name:'Térmica unipolar 25A curva B'},
  {cat:'Térmicas', name:'Térmica unipolar 32A curva B'},
  {cat:'Térmicas', name:'Térmica unipolar 10A curva C'},
  {cat:'Térmicas', name:'Térmica unipolar 16A curva C'},
  {cat:'Térmicas', name:'Térmica unipolar 20A curva C'},
  {cat:'Térmicas', name:'Térmica unipolar 25A curva C'},
  {cat:'Térmicas', name:'Térmica unipolar 32A curva C'},
  {cat:'Térmicas', name:'Térmica unipolar 40A curva C'},
  {cat:'Térmicas', name:'Térmica unipolar 10A curva D'},
  {cat:'Térmicas', name:'Térmica unipolar 16A curva D'},
  {cat:'Térmicas', name:'Térmica unipolar 20A curva D'},
  {cat:'Térmicas', name:'Térmica bipolar 10A curva B'},
  {cat:'Térmicas', name:'Térmica bipolar 16A curva B'},
  {cat:'Térmicas', name:'Térmica bipolar 20A curva B'},
  {cat:'Térmicas', name:'Térmica bipolar 25A curva B'},
  {cat:'Térmicas', name:'Térmica bipolar 32A curva B'},
  {cat:'Térmicas', name:'Térmica bipolar 10A curva C'},
  {cat:'Térmicas', name:'Térmica bipolar 16A curva C'},
  {cat:'Térmicas', name:'Térmica bipolar 20A curva C'},
  {cat:'Térmicas', name:'Térmica bipolar 25A curva C'},
  {cat:'Térmicas', name:'Térmica bipolar 32A curva C'},
  {cat:'Térmicas', name:'Térmica bipolar 40A curva C'},
  {cat:'Térmicas', name:'Térmica bipolar 16A curva D'},
  {cat:'Térmicas', name:'Térmica bipolar 20A curva D'},
  {cat:'Térmicas', name:'Térmica bipolar 25A curva D'},
  {cat:'Térmicas', name:'Térmica tripolar 16A curva C'},
  {cat:'Térmicas', name:'Térmica tripolar 20A curva C'},
  {cat:'Térmicas', name:'Térmica tripolar 25A curva C'},
  {cat:'Térmicas', name:'Térmica tripolar 32A curva C'},
  {cat:'Térmicas', name:'Térmica tripolar 40A curva C'},
  {cat:'Térmicas', name:'Térmica tripolar 20A curva D'},
  {cat:'Térmicas', name:'Térmica tripolar 25A curva D'},
  {cat:'Térmicas', name:'Térmica tripolar 32A curva D'},
  {cat:'Térmicas', name:'Térmica tetrapolar 16A curva C'},
  {cat:'Térmicas', name:'Térmica tetrapolar 20A curva C'},
  {cat:'Térmicas', name:'Térmica tetrapolar 25A curva C'},
  {cat:'Térmicas', name:'Térmica tetrapolar 32A curva C'},
  {cat:'Térmicas', name:'Térmica tetrapolar 40A curva C'},
  {cat:'Térmicas', name:'Térmica tetrapolar 63A curva C'},
  {cat:'Térmicas', name:'Térmica tetrapolar 20A curva D'},
  {cat:'Térmicas', name:'Térmica tetrapolar 25A curva D'},
  {cat:'Térmicas', name:'Térmica tetrapolar 32A curva D'},

  // ═══ PROTECCIONES: DIFERENCIALES ═══
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 25A 10mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 40A 10mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 25A 30mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 40A 30mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 63A 30mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 25A 100mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 40A 100mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial bipolar 63A 100mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial tetrapolar 25A 30mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial tetrapolar 40A 30mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial tetrapolar 63A 30mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial tetrapolar 25A 100mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial tetrapolar 40A 100mA'},
  {cat:'Diferenciales', name:'Disyuntor diferencial tetrapolar 63A 100mA'},

  // ═══ PROTECCIONES: OTRAS ═══
  {cat:'Otras protecciones', name:'Protector de tensión común bipolar 20A'},
  {cat:'Otras protecciones', name:'Protector de tensión común tetrapolar 20A'},
  {cat:'Otras protecciones', name:'Protector de tensión digital (con display) bipolar 20A'},
  {cat:'Otras protecciones', name:'Protector de tensión digital (con display) bipolar 32A'},
  {cat:'Otras protecciones', name:'Protector de tensión digital (con display) tetrapolar 20A'},
  {cat:'Otras protecciones', name:'Protector de tensión digital (con display) tetrapolar 32A'},
  {cat:'Otras protecciones', name:'Protector contra sobretensión DPS clase II'},
  {cat:'Otras protecciones', name:'Fusible tipo NH / cuchilla'},
  {cat:'Otras protecciones', name:'Base portafusible'},

  // ═══ CONDUCTORES UNIPOLARES: FASE MARRÓN (IRAM 2183) ═══
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 1,5mm² marrón (por metro)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 1,5mm² marrón (por 100mts)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 2,5mm² marrón (por metro)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 2,5mm² marrón (por 100mts)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 4mm² marrón (por metro)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 4mm² marrón (por 100mts)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 6mm² marrón (por metro)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 6mm² marrón (por 100mts)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 10mm² marrón (por metro)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 10mm² marrón (por 100mts)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 16mm² marrón (por metro)'},
  {cat:'Unipolar - Fase marrón', name:'Cable unipolar IRAM 2183 25mm² marrón (por metro)'},

  // ═══ CONDUCTORES UNIPOLARES: FASE NEGRO (IRAM 2183) ═══
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 1,5mm² negro (por metro)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 1,5mm² negro (por 100mts)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 2,5mm² negro (por metro)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 2,5mm² negro (por 100mts)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 4mm² negro (por metro)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 4mm² negro (por 100mts)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 6mm² negro (por metro)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 6mm² negro (por 100mts)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 10mm² negro (por metro)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 10mm² negro (por 100mts)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 16mm² negro (por metro)'},
  {cat:'Unipolar - Fase negro', name:'Cable unipolar IRAM 2183 25mm² negro (por metro)'},

  // ═══ CONDUCTORES UNIPOLARES: FASE ROJO (IRAM 2183) ═══
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 1,5mm² rojo (por metro)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 1,5mm² rojo (por 100mts)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 2,5mm² rojo (por metro)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 2,5mm² rojo (por 100mts)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 4mm² rojo (por metro)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 4mm² rojo (por 100mts)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 6mm² rojo (por metro)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 6mm² rojo (por 100mts)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 10mm² rojo (por metro)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 10mm² rojo (por 100mts)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 16mm² rojo (por metro)'},
  {cat:'Unipolar - Fase rojo', name:'Cable unipolar IRAM 2183 25mm² rojo (por metro)'},

  // ═══ CONDUCTORES UNIPOLARES: NEUTRO CELESTE (IRAM 2183) ═══
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 1,5mm² celeste (por metro)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 1,5mm² celeste (por 100mts)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 2,5mm² celeste (por metro)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 2,5mm² celeste (por 100mts)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 4mm² celeste (por metro)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 4mm² celeste (por 100mts)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 6mm² celeste (por metro)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 6mm² celeste (por 100mts)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 10mm² celeste (por metro)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 10mm² celeste (por 100mts)'},
  {cat:'Unipolar - Neutro celeste', name:'Cable unipolar IRAM 2183 16mm² celeste (por metro)'},

  // ═══ CONDUCTORES UNIPOLARES: TIERRA VERDE-AMARILLO (IRAM 2183) ═══
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 1,5mm² verde-amarillo (por metro)'},
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 2,5mm² verde-amarillo (por metro)'},
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 4mm² verde-amarillo (por metro)'},
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 6mm² verde-amarillo (por metro)'},
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 10mm² verde-amarillo (por metro)'},
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 16mm² verde-amarillo (por metro)'},
  {cat:'Unipolar - Tierra verde-amarillo', name:'Cable unipolar IRAM 2183 25mm² verde-amarillo (por metro)'},

  // ═══ CONDUCTORES: CABLE SUBTERRÁNEO ═══
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 4mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 6mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 10mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 16mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 25mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 35mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo unipolar 50mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo bipolar 2x2,5mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo bipolar 2x4mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo bipolar 2x6mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tripolar 3x2,5mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tripolar 3x4mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tripolar 3x6mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tetrapolar 4x2,5mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tetrapolar 4x4mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tetrapolar 4x6mm²'},
  {cat:'Cable subterráneo', name:'Cable subterráneo tetrapolar 4x10mm²'},

  // ═══ CONDUCTORES: CABLE TIPO TALLER - BIPOLAR (2x) ═══
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x1mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x1,5mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x2,5mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x6mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x10mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x16mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller bipolar 2x25mm²'},

  // ═══ CONDUCTORES: CABLE TIPO TALLER - TRIPOLAR (3x) ═══
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x1,5mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x2,5mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x4mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x6mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x10mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x16mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x25mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x35mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tripolar 3x50mm²'},

  // ═══ CONDUCTORES: CABLE TIPO TALLER - TETRAPOLAR (4x) ═══
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x1,5mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x2,5mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x6mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x10mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x16mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x25mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x35mm²'},
  {cat:'Cable tipo taller', name:'Cable tipo taller tetrapolar 4x50mm²'},

  // ═══ TERMINALES Y PUNTERAS ═══
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 0,5mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 1mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 1,5mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 2,5mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 4mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 6mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 10mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 16mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 25mm²'},
  {cat:'Terminales y punteras', name:'Terminal tipo puntera (tubular) 35mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 1,5mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 2,5mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 4mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 6mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 10mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 16mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 25mm²'},
  {cat:'Terminales y punteras', name:'Terminal ojal 35mm²'},
  {cat:'Terminales y punteras', name:'Terminal a compresión'},

  // ═══ MÓDULOS SUELTOS ═══
  {cat:'Módulos sueltos', name:'Módulo punto'},
  {cat:'Módulos sueltos', name:'Módulo toma 10A'},
  {cat:'Módulos sueltos', name:'Módulo toma 10A bipolar a tierra (binorma)'},
  {cat:'Módulos sueltos', name:'Módulo toma 20A'},
  {cat:'Módulos sueltos', name:'Módulo ciego'},
  {cat:'Módulos sueltos', name:'Módulo combinada'},
  {cat:'Módulos sueltos', name:'Bastidor 2 módulos'},
  {cat:'Módulos sueltos', name:'Tapa bastidor 2 módulos'},
  {cat:'Módulos sueltos', name:'Bastidor 3 módulos'},
  {cat:'Módulos sueltos', name:'Tapa bastidor 3 módulos'},
  {cat:'Módulos sueltos', name:'Bastidor y tapa exterior estanco 2 módulos'},
  {cat:'Módulos sueltos', name:'Bastidor y tapa exterior estanco 3 módulos'},

  // ═══ CONJUNTOS ═══
  {cat:'Conjuntos', name:'Conjunto 1 punto'},
  {cat:'Conjuntos', name:'Conjunto 2 puntos (doble)'},
  {cat:'Conjuntos', name:'Conjunto 3 puntos (triple)'},
  {cat:'Conjuntos', name:'Conjunto 1 toma'},
  {cat:'Conjuntos', name:'Conjunto 2 tomas (doble)'},
  {cat:'Conjuntos', name:'Conjunto 3 tomas (triple)'},
  {cat:'Conjuntos', name:'Conjunto combinación (simple)'},
  {cat:'Conjuntos', name:'Conjunto combinación doble'},
  {cat:'Conjuntos', name:'Conjunto combinación triple'},
  {cat:'Conjuntos', name:'Conjunto combinación + 1 módulo punto'},
  {cat:'Conjuntos', name:'Conjunto combinación + 2 módulos punto'},
  {cat:'Conjuntos', name:'Conjunto combinación + 1 módulo toma'},
  {cat:'Conjuntos', name:'Conjunto combinación + 2 módulos toma'},
  {cat:'Conjuntos', name:'Conjunto 1 punto + 1 toma'},
  {cat:'Conjuntos', name:'Conjunto 1 punto + 2 tomas'},
  {cat:'Conjuntos', name:'Conjunto 2 puntos + 1 toma'},
  {cat:'Conjuntos', name:'Conjunto punto + toma + tecla (combinación)'},

  // ═══ TARUGOS Y TORNILLOS ═══
  {cat:'Tarugos y tornillos', name:'Tarugo 6mm sin tope'},
  {cat:'Tarugos y tornillos', name:'Tarugo 6mm con tope'},
  {cat:'Tarugos y tornillos', name:'Tarugo 8mm sin tope'},
  {cat:'Tarugos y tornillos', name:'Tarugo 8mm con tope'},
  {cat:'Tarugos y tornillos', name:'Tarugo 10mm sin tope'},
  {cat:'Tarugos y tornillos', name:'Tarugo 10mm con tope'},
  {cat:'Tarugos y tornillos', name:'Tornillo tipo aguja 6x1"'},
  {cat:'Tarugos y tornillos', name:'Tornillo tipo aguja 8x1"'},
  {cat:'Tarugos y tornillos', name:'Tornillo común 6x1"'},
  {cat:'Tarugos y tornillos', name:'Tornillo común 8x1"'},
  {cat:'Tarugos y tornillos', name:'Tornillo común 8x1 1/2"'},

  // ═══ PRENSACABLES ═══
  {cat:'Prensacables', name:'Prensacable PG7 (3-6,5mm)'},
  {cat:'Prensacables', name:'Prensacable PG9 (4-8mm)'},
  {cat:'Prensacables', name:'Prensacable PG11 (5-10mm)'},
  {cat:'Prensacables', name:'Prensacable PG13,5 (6-12mm)'},
  {cat:'Prensacables', name:'Prensacable PG16 (10-14mm)'},
  {cat:'Prensacables', name:'Prensacable PG21 (13-18mm)'},
  {cat:'Prensacables', name:'Prensacable PG29 (18-25mm)'},

  // ═══ ACCESORIOS Y TERMINACIÓN ═══
  {cat:'Accesorios y terminación', name:'Tomacorriente simple con tapa'},
  {cat:'Accesorios y terminación', name:'Tomacorriente doble con tapa'},
  {cat:'Accesorios y terminación', name:'Interruptor de luz simple'},
  {cat:'Accesorios y terminación', name:'Interruptor combinación (9 puntos)'},
  {cat:'Accesorios y terminación', name:'Ficha/enchufe macho'},
  {cat:'Accesorios y terminación', name:'Ficha/enchufe hembra'},
  {cat:'Accesorios y terminación', name:'Portalámparas'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora negra x 5m'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora negra x 10m'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora negra x 20m'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora de colores x 5m'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora de colores x 10m'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora de colores x 20m'},
  {cat:'Accesorios y terminación', name:'Precinto plástico 100mm'},
  {cat:'Accesorios y terminación', name:'Precinto plástico 150mm'},
  {cat:'Accesorios y terminación', name:'Precinto plástico 200mm'},
  {cat:'Accesorios y terminación', name:'Precinto plástico 300mm'},
  {cat:'Accesorios y terminación', name:'Bandeja portacable metálica (tramo)'},
];

// ══════════════════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════════════════
function init() {
  // Tasks
  const st = ls('pv_tasks');
  tasks = st ? JSON.parse(st) : BUILTIN.map((t,i)=>({...t,id:i}));
  if (!st) lsSet('pv_tasks', JSON.stringify(tasks));

  // Current session
  const cs = ls('pv_current');
  if (cs) {
    const c = JSON.parse(cs);
    budget    = c.budget    || [];
    materials = c.materials || [];
    document.getElementById('client-name').value    = c.client   || '';
    document.getElementById('discount-input').value = c.discount || '';
  }

  // Settings
  const ss = ls('pv_settings');
  if (ss) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(ss) };

  // User config
  const sc = ls('pv_config');
  if (sc) userCfg = JSON.parse(sc);

  // History
  const sh = ls('pv_history');
  history_ = sh ? JSON.parse(sh) : [];

  const svs = ls('pv_visits');
  visits = svs ? JSON.parse(svs) : [];

  const scl = ls('pv_clients');
  clients = scl ? JSON.parse(scl) : [];
  migrateVisitsToClients();

  const std = ls('pv_taskdesc_override');
  taskDescOverride = std ? JSON.parse(std) : {};

  applySettings();
  renderCats();
  renderTasks();
  renderBudget();
  renderMats();
  renderMatCatFilters();
  renderMatCatalog();
  renderHistory();
  updateTotal();
  loadCfgUI();
  updateDBStats();
  renderMedicionFields();
  renderCircuitRows();
  renderClientPicker();

  // Traer la versión más reciente desde Supabase (si hay conexión).
  // La app sigue funcionando 100% offline con lo que ya cargó de localStorage;
  // esto solo actualiza si encuentra datos guardados desde otro dispositivo.
  syncPullFromSupabase();
}

// ══════════════════════════════════════════════════════════
//  SINCRONIZACIÓN CON SUPABASE (multi-dispositivo)
// ══════════════════════════════════════════════════════════
const SUPABASE_URL = 'https://kmkprbnwcbavonfnyput.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtta3ByYm53Y2Jhdm9uZm55cHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzODUyMjgsImV4cCI6MjEwMDk2MTIyOH0.A-d1FquQftEcXheF7uTnEHJ-Z1UULb5VSIqq9e1cR8c';

async function syncPullFromSupabase() {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/pv_data?id=eq.workspace&select=payload`,
      { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } }
    );
    if (!res.ok) return;
    const rows = await res.json();
    const remote = rows && rows[0] && rows[0].payload;
    if (!remote || typeof remote !== 'object' || !Object.keys(remote).length) return;

    if (Array.isArray(remote.tasks) && remote.tasks.length) {
      tasks = remote.tasks; lsSetSilent('pv_tasks', JSON.stringify(tasks));
    }
    if (remote.current) {
      budget    = remote.current.budget    || [];
      materials = remote.current.materials || [];
      document.getElementById('client-name').value    = remote.current.client   || '';
      document.getElementById('discount-input').value = remote.current.discount || '';
      lsSetSilent('pv_current', JSON.stringify(remote.current));
    }
    if (remote.settings) { settings = { ...DEFAULT_SETTINGS, ...remote.settings }; lsSetSilent('pv_settings', JSON.stringify(settings)); }
    if (remote.userCfg)  { userCfg  = remote.userCfg;  lsSetSilent('pv_config', JSON.stringify(userCfg)); }
    if (Array.isArray(remote.history_)) { history_ = remote.history_; lsSetSilent('pv_history', JSON.stringify(history_)); }
    if (Array.isArray(remote.visits)) { visits = remote.visits; lsSetSilent('pv_visits', JSON.stringify(visits)); }
    if (Array.isArray(remote.clients)) { clients = remote.clients; lsSetSilent('pv_clients', JSON.stringify(clients)); }
    if (remote.prices_updated_at) lsSetSilent('pv_prices_updated_at', remote.prices_updated_at);
    if (remote.taskDescOverride) { taskDescOverride = remote.taskDescOverride; lsSetSilent('pv_taskdesc_override', JSON.stringify(taskDescOverride)); }

    applySettings(); renderCats(); renderTasks(); renderBudget();
    renderMats(); renderHistory(); renderClientPicker(); if (activeClientId) renderClientVisitList(); updateTotal(); loadCfgUI(); updateDBStats();
    toast('☁️ Sincronizado con la nube');
  } catch (e) {
    // Sin conexión o error de red: seguimos con lo que ya hay en el celular.
  }
}

let _pushTimer;
function schedulePush() {
  clearTimeout(_pushTimer);
  _pushTimer = setTimeout(pushStateToSupabase, 900);
}

async function pushStateToSupabase() {
  try {
    const payload = {
      tasks,
      current: JSON.parse(ls('pv_current') || '{}'),
      settings,
      userCfg,
      history_,
      visits,
      clients,
      prices_updated_at: ls('pv_prices_updated_at') || null,
      taskDescOverride
    };
    await fetch(`${SUPABASE_URL}/rest/v1/pv_data?id=eq.workspace`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify({ payload, updated_at: new Date().toISOString() })
    });
  } catch (e) {
    // Sin conexión: el cambio queda guardado local y se sincroniza en el próximo intento.
  }
}

// localStorage helpers
function ls(k)      { try { return localStorage.getItem(k); } catch(e){ return null; } }
function lsSet(k,v) { try { localStorage.setItem(k, v); } catch(e){} schedulePush(); }
function lsSetSilent(k,v) { try { localStorage.setItem(k, v); } catch(e){} } // usado al recibir datos de Supabase, no vuelve a empujar

// Save current working state (budget + materials + client name + discount)
function saveCurrentState() {
  const state = {
    client:   document.getElementById('client-name').value,
    discount: document.getElementById('discount-input').value,
    budget,
    materials
  };
  lsSet('pv_current', JSON.stringify(state));
}

function saveCfg() {
  userCfg.nombre = document.getElementById('cfg-nombre').value;
  userCfg.tel    = document.getElementById('cfg-tel').value;
  userCfg.email  = document.getElementById('cfg-email').value;
  lsSet('pv_config', JSON.stringify(userCfg));
}
function loadCfgUI() {
  document.getElementById('cfg-nombre').value = userCfg.nombre || '';
  document.getElementById('cfg-tel').value    = userCfg.tel    || '';
  document.getElementById('cfg-email').value  = userCfg.email  || '';
}

// ══════════════════════════════════════════════════════════
//  TABS
// ══════════════════════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + tab).classList.add('active');
  const idx = ['tareas','presupuesto','materiales','visita','historial','config'].indexOf(tab);
  document.querySelectorAll('.tab')[idx].classList.add('active');
}

// ══════════════════════════════════════════════════════════
//  TOAST
// ══════════════════════════════════════════════════════════
let _tt;
function toast(msg, err) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.style.background = err ? '#e05555' : '#4caf7d';
  el.classList.add('show');
  clearTimeout(_tt);
  _tt = setTimeout(() => el.classList.remove('show'), 2400);
}

// ══════════════════════════════════════════════════════════
//  CATEGORIES
// ══════════════════════════════════════════════════════════
function renderCats() {
  const cats = ['Todos', ...[...new Set(tasks.map(t=>t.cat))].filter(Boolean).sort()];
  const wrap = document.getElementById('cat-filters');
  wrap.innerHTML = cats.map(c => {
    const safeCat = c.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    const active  = c === activeCat ? ' active' : '';
    return `<span class="cat-badge${active}" data-cat="${safeCat}">${c}</span>`;
  }).join('');
}
function selCat(c) { activeCat = c; renderCats(); renderTasks(); }

// Delegated click handler — avoids inline onclick breakage with accented chars
document.addEventListener('click', function(e) {
  const badge = e.target.closest('.cat-badge');
  if (badge) {
    const cat = badge.getAttribute('data-cat');
    if (cat !== null) selCat(cat);
  }
});

// ══════════════════════════════════════════════════════════
//  TASK LIST
// ══════════════════════════════════════════════════════════
function filterTasks() { renderTasks(); }
function renderTasks() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const f = tasks.filter(t => {
    const mc = activeCat==='Todos' || t.cat===activeCat;
    const ms = !q || t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
    return mc && ms;
  });
  const el = document.getElementById('task-list');
  if (!f.length) { el.innerHTML='<div class="empty">Sin resultados</div>'; return; }
  el.innerHTML = f.map(t => `
    <div class="task-item" onclick="addToBudget(${t.id})">
      <div style="flex:1;min-width:0">
        <div class="task-name">${t.name}</div>
        <div class="task-cat">${t.cat}</div>
      </div>
      <div class="task-price">${fmt(t.price)}</div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  BUDGET
// ══════════════════════════════════════════════════════════
function addToBudget(id) {
  const task = tasks.find(t=>t.id===id); if(!task) return;
  const ex = budget.find(b=>b.taskId===id);
  if (ex) ex.qty++; else budget.push({taskId:id, qty:1});
  saveCurrentState(); renderBudget(); updateTotal();
  toast('➕ ' + task.name.substring(0,38));
}
function changeQty(i, d) {
  budget[i].qty += d;
  if (budget[i].qty <= 0) budget.splice(i,1);
  saveCurrentState(); renderBudget(); updateTotal();
}
function setQty(i, val) {
  const n = Math.max(1, parseInt(val, 10) || 1);
  if (!budget[i]) return;
  budget[i].qty = n;
  saveCurrentState(); renderBudget(); updateTotal();
}
function removeItem(i) {
  budget.splice(i,1);
  saveCurrentState(); renderBudget(); updateTotal();
}

function renderBudget() {
  const el = document.getElementById('budget-list');
  if (!budget.length) { el.innerHTML='<div class="empty">Agregá tareas desde ⚡ Tareas</div>'; return; }
  const grp = {};
  budget.forEach((b,i) => {
    const t = tasks.find(x=>x.id===b.taskId); if(!t) return;
    if (!grp[t.cat]) grp[t.cat]=[];
    grp[t.cat].push({b,i,t});
  });
  let html='';
  for (const [cat, items] of Object.entries(grp)) {
    html += `<div class="sh">${cat}</div>`;
    items.forEach(({b,i,t}) => {
      const sub = t.price*b.qty;
      const desc = settings.includeDesc ? getTaskDesc(t) : '';
      html += `<div class="budget-item">
        <div class="bi-info">
          <div class="bi-name">${t.name}</div>
          <div class="bi-price">${settings.hideUnit ? `× ${b.qty}` : `${fmt(t.price)} c/u · ${fmt(sub)}`}</div>
          ${desc ? `<div style="font-size:11.5px;color:var(--muted);line-height:1.4;margin-top:4px;">📝 ${desc.replace(/</g,'&lt;')}</div>` : ''}
        </div>
        <div class="qty-wrap">
          <div class="qbtn" onclick="changeQty(${i},-1)">−</div>
          <input type="number" class="qval-input" value="${b.qty}" min="1" onchange="setQty(${i}, this.value)" onclick="this.select()"/>
          <div class="qbtn" onclick="changeQty(${i},1)">+</div>
        </div>
        <div class="rmbtn" onclick="removeItem(${i})">✕</div>
      </div>`;
    });
  }
  if (settings.showMats && materials.length) {
    html += `<div class="sh">Materiales</div>`;
    materials.forEach(m => {
      html += `<div class="mat-item${m.checked?' ck':''}">
        <input type="checkbox" disabled ${m.checked?'checked':''}/>
        <span class="mat-nm">${m.name}${(m.qty||1)>1 ? ' × ' + (m.qty||1) : ''}</span>
      </div>`;
    });
  }
  el.innerHTML = html;
}

function clearBudget() {
  if (!budget.length) return;
  if (!confirm('¿Limpiar el presupuesto actual?')) return;
  budget=[]; saveCurrentState(); renderBudget(); updateTotal();
  toast('Presupuesto limpiado');
}

// ══════════════════════════════════════════════════════════
//  MATERIALS
// ══════════════════════════════════════════════════════════
function addMat() {
  const inp = document.getElementById('mat-input');
  const v = inp.value.trim(); if(!v) return;
  const existing = materials.find(m => m.name.toLowerCase() === v.toLowerCase());
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { materials.push({name:v, qty:1, checked:false}); }
  saveCurrentState(); inp.value=''; renderMats(); renderBudget();
  toast('Material agregado');
}
function toggleMat(i) { materials[i].checked=!materials[i].checked; saveCurrentState(); renderMats(); renderBudget(); }
function deleteMat(i) { materials.splice(i,1); saveCurrentState(); renderMats(); renderBudget(); }
function changeMatQty(i, delta) {
  const m = materials[i]; if (!m) return;
  m.qty = Math.max(1, (m.qty || 1) + delta);
  saveCurrentState(); renderMats(); renderBudget();
}
function setMatQty(i, val) {
  const m = materials[i]; if (!m) return;
  m.qty = Math.max(1, parseInt(val, 10) || 1);
  saveCurrentState(); renderMats(); renderBudget();
}
function renderMats() {
  const el = document.getElementById('mat-list');
  if (!materials.length) { el.innerHTML='<div class="empty">Sin materiales todavía.</div>'; return; }
  el.innerHTML = materials.map((m,i)=>`
    <div class="mat-item${m.checked?' ck':''}">
      <input type="checkbox" onchange="toggleMat(${i})" ${m.checked?'checked':''}/>
      <span class="mat-nm">${m.name}</span>
      <div class="qty-wrap">
        <div class="qbtn" onclick="changeMatQty(${i},-1)">−</div>
        <input type="number" class="qval-input" value="${m.qty || 1}" min="1" onchange="setMatQty(${i}, this.value)" onclick="this.select()"/>
        <div class="qbtn" onclick="changeMatQty(${i},1)">+</div>
      </div>
      <span class="mat-del" onclick="deleteMat(${i})">✕</span>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  CATÁLOGO DE MATERIALES (selección rápida, sin precio)
// ══════════════════════════════════════════════════════════
function renderMatCatFilters() {
  const cats = ['Todos', ...[...new Set(MATERIAL_CATALOG.map(m=>m.cat))].sort()];
  const wrap = document.getElementById('mat-cat-filters');
  wrap.innerHTML = cats.map(c => {
    const safe = c.replace(/&/g,'&amp;').replace(/"/g,'&quot;');
    const active = c === activeMatCat ? ' active' : '';
    return `<span class="cat-badge${active}" data-mcat="${safe}">${c}</span>`;
  }).join('');
}
function selMatCat(c) { activeMatCat = c; renderMatCatFilters(); renderMatCatalog(); }

document.addEventListener('click', function(e) {
  const mbadge = e.target.closest('[data-mcat]');
  if (mbadge) selMatCat(mbadge.getAttribute('data-mcat'));
});

function renderMatCatalog() {
  const qEl = document.getElementById('mat-cat-search');
  const q = qEl ? qEl.value.toLowerCase() : '';
  const f = MATERIAL_CATALOG.filter(m => {
    const mc = activeMatCat==='Todos' || m.cat===activeMatCat;
    const ms = !q || m.name.toLowerCase().includes(q) || m.cat.toLowerCase().includes(q);
    return mc && ms;
  });
  const el = document.getElementById('mat-catalog-list');
  if (!el) return;
  if (!f.length) { el.innerHTML = '<div class="empty">Sin resultados</div>'; return; }
  el.innerHTML = f.map(m => `
    <div class="task-item" onclick='addMatFromCatalog(${JSON.stringify(m.name)})'>
      <div style="flex:1;min-width:0">
        <div class="task-name">${m.name}</div>
        <div class="task-cat">${m.cat}</div>
      </div>
      <div class="task-price" style="color:var(--muted);font-size:16px;">+</div>
    </div>`).join('');
}

function addMatFromCatalog(name) {
  const existing = materials.find(m => m.name === name);
  if (existing) { existing.qty = (existing.qty || 1) + 1; }
  else { materials.push({name, qty:1, checked:false}); }
  saveCurrentState(); renderMats(); renderBudget();
  toast('➕ ' + name.substring(0,38));
}

// ══════════════════════════════════════════════════════════
//  HISTORIAL
// ══════════════════════════════════════════════════════════
function saveBudgetToHistory() {
  if (!budget.length) { toast('Agregá tareas antes de guardar','error'); return; }
  const client = document.getElementById('client-name').value.trim() || 'Sin nombre';
  const entry = {
    id:       Date.now(),
    client,
    date:     new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'}),
    total:    getTotal(),
    subtotal: getSubtotal(),
    discount: getDiscountPct(),
    budget:   JSON.parse(JSON.stringify(budget)),
    materials:JSON.parse(JSON.stringify(materials)),
    status:   'pendiente'
  };
  history_.unshift(entry);
  lsSet('pv_history', JSON.stringify(history_));
  renderHistory();
  toast(`✅ Guardado: ${client}`);
}

function setStatus(id, status) {
  const entry = history_.find(h=>h.id===id);
  if (!entry) return;
  entry.status = status;
  lsSet('pv_history', JSON.stringify(history_));
  renderHistory();
  toast(status==='aceptado' ? '🎉 ¡Presupuesto aceptado!' : status==='rechazado' ? '❌ Marcado como rechazado' : 'Estado actualizado');
}

function deleteHistEntry(id) {
  if (!confirm('¿Eliminar este presupuesto del historial?')) return;
  history_ = history_.filter(h=>h.id!==id);
  lsSet('pv_history', JSON.stringify(history_));
  renderHistory();
}

function clearHistory() {
  if (!history_.length) return;
  if (!confirm('¿Borrar todo el historial? Esta acción no se puede deshacer.')) return;
  history_=[];
  lsSet('pv_history', JSON.stringify(history_));
  renderHistory();
  toast('Historial borrado');
}

function viewHistEntry(id) {
  const entry = history_.find(h=>h.id===id);
  if (!entry) return;
  activeHistIdx = id;
  document.getElementById('hm-title').textContent = entry.client;
  let html = `<div style="font-size:13px;color:var(--muted);margin-bottom:12px;">${entry.date} · ${fmt(entry.total)}</div>`;
  const grp = {};
  entry.budget.forEach(b => {
    const t = tasks.find(x=>x.id===b.taskId); if(!t) return;
    if (!grp[t.cat]) grp[t.cat]=[];
    grp[t.cat].push({b,t});
  });
  for (const [cat, items] of Object.entries(grp)) {
    html += `<div class="sh">${cat}</div>`;
    items.forEach(({b,t}) => {
      html += `<div style="padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;display:flex;justify-content:space-between;gap:8px;">
        <span>${t.name} <span style="color:var(--muted);">×${b.qty}</span></span>
        <span style="color:var(--accent);font-family:'Barlow Condensed',sans-serif;font-weight:700;">${fmt(t.price*b.qty)}</span>
      </div>`;
    });
  }
  if (entry.materials && entry.materials.length) {
    html += `<div class="sh">Materiales</div>`;
    entry.materials.forEach(m => {
      html += `<div style="font-size:13px;padding:4px 0;color:var(--muted);">${m.checked?'☑':'☐'} ${m.name}${(m.qty||1)>1 ? ' × ' + (m.qty||1) : ''}</div>`;
    });
  }
  document.getElementById('hm-body').innerHTML = html;
  document.getElementById('hist-modal').classList.remove('hidden');
}

function restoreFromHistory() {
  const entry = history_.find(h=>h.id===activeHistIdx);
  if (!entry) return;
  if (!confirm('¿Restaurar este presupuesto en el área de trabajo actual? Se perderá el presupuesto actual.')) return;
  budget    = JSON.parse(JSON.stringify(entry.budget));
  materials = JSON.parse(JSON.stringify(entry.materials));
  document.getElementById('client-name').value = entry.client;
  saveCurrentState(); renderBudget(); renderMats(); updateTotal();
  closeModal('hist-modal');
  switchTab('presupuesto');
  toast('Presupuesto restaurado');
}

// ══════════════════════════════════════════════════════════
//  VISITA AL CLIENTE (clientes + historial + mediciones)
// ══════════════════════════════════════════════════════════
const MEDICION_FIELDS = [
  // ── Tensiones por fase ──
  { key:'tensionF1N',  section:'Tensiones', label:'Tensión F1-Neutro',                 unit:'V' },
  { key:'tensionF2N',  section:'Tensiones', label:'Tensión F2-Neutro (trifásico)',     unit:'V' },
  { key:'tensionF3N',  section:'Tensiones', label:'Tensión F3-Neutro (trifásico)',     unit:'V' },
  { key:'tensionF1F2', section:'Tensiones', label:'Tensión F1-F2 (trifásico)',         unit:'V' },
  { key:'tensionF2F3', section:'Tensiones', label:'Tensión F2-F3 (trifásico)',         unit:'V' },
  { key:'tensionF1F3', section:'Tensiones', label:'Tensión F1-F3 (trifásico)',         unit:'V' },
  { key:'tensionNPAT', section:'Tensiones', label:'Tensión Neutro-Tierra (N-PAT)',     unit:'V' },

  // ── Puesta a tierra ──
  { key:'tienePAT', section:'Puesta a tierra', label:'¿Tiene puesta a tierra (PAT)?', select:['Sí','No','A verificar'] },

  // ── Aislación (megóhmetro) ──
  { key:'megado',          section:'Aislación (megado)', label:'Resistencia de aislación', unit:'MΩ' },
  { key:'tipoCableMegado', section:'Aislación (megado)', label:'Tipo de cable medido', select:['Unipolar','Subterráneo','Tipo taller'] },

  // ── Probador de disyuntor diferencial (tipo Unit) ──
  { key:'difSensibilidad', section:'Disyuntor diferencial', label:'Sensibilidad nominal (IΔn)', select:['10mA','30mA','100mA','300mA'] },
  { key:'difCurva',        section:'Disyuntor diferencial', label:'Corriente de prueba', select:['½ IΔn (no debe disparar)','1 IΔn','5 IΔn'] },
  { key:'difTiempo',       section:'Disyuntor diferencial', label:'Tiempo de disparo medido', unit:'ms' },
  { key:'difResultado',    section:'Disyuntor diferencial', label:'Resultado', select:['OK (dentro de norma)','Fuera de norma','No dispara','No tiene diferencial'] },

  // ── Corriente de consumo general ──
  { key:'corrienteTotal', section:'Corriente de consumo', label:'Corriente total de la casa/local', unit:'A' },

  // ── Motores ──
  { key:'motorTipo',      section:'Motores', label:'Tipo de motor', select:['—','Monofásico','Trifásico'] },
  { key:'motorArranque',  section:'Motores', label:'Corriente de arranque', unit:'A' },
  { key:'motorNominal',   section:'Motores', label:'Corriente nominal (marcha)', unit:'A' },

  // ── Tipo de instalación ──
  { key:'usoInstalacion', section:'Tipo de instalación', label:'Uso del inmueble', select:['Vivienda','Local comercial','Industria'] },
  { key:'canalizacion',   section:'Tipo de instalación', label:'Canalización', select:['Embutida - corrugado','Embutida - caño PVC','Embutida - caño metálico','A la vista - caño PVC','A la vista - caño metálico','Bandeja portacables'] },
];

let activeClientId = null;
let editingClient = false;
let editingVisitId = null;

function renderMedicionFields() {
  const el = document.getElementById('visit-mediciones-fields');
  if (!el) return;
  let lastSection = null;
  el.innerHTML = MEDICION_FIELDS.map(f => {
    const sectionHTML = f.section !== lastSection
      ? (lastSection === null
          ? `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--accent);margin-top:4px;">${f.section}</div>`
          : `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--accent);margin-top:14px;">${f.section}</div>`)
      : '';
    lastSection = f.section;
    return `${sectionHTML}
    <div class="cfg-lbl">${f.label}${f.unit ? ' (' + f.unit + ')' : ''}</div>
    ${f.select
      ? `<select class="cfg" id="med-${f.key}"><option value="">—</option>${f.select.map(o=>`<option value="${o}">${o}</option>`).join('')}</select>`
      : `<input class="cfg" type="text" inputmode="decimal" id="med-${f.key}" placeholder="Valor medido"/>`
    }`;
  }).join('');
}
function getMedicionValues() {
  const v = {};
  MEDICION_FIELDS.forEach(f => {
    const el = document.getElementById('med-' + f.key);
    if (el && el.value.trim()) v[f.key] = el.value.trim();
  });
  return v;
}
function clearMedicionFields() {
  MEDICION_FIELDS.forEach(f => { const el = document.getElementById('med-' + f.key); if (el) el.value = ''; });
}

// ── Consumo por circuito (tabla dinámica dentro de la visita) ──
let currentCircuitRows = [];
function addCircuitRow() {
  currentCircuitRows.push({ nombre:'', normal:'', maximo:'' });
  renderCircuitRows();
}
function removeCircuitRow(i) {
  currentCircuitRows.splice(i, 1);
  renderCircuitRows();
}
function updateCircuitRow(i, field, value) {
  if (currentCircuitRows[i]) currentCircuitRows[i][field] = value;
}
function renderCircuitRows() {
  const el = document.getElementById('circuit-rows');
  if (!el) return;
  if (!currentCircuitRows.length) { el.innerHTML = '<div class="empty" style="padding:10px;">Sin circuitos cargados.</div>'; return; }
  el.innerHTML = currentCircuitRows.map((r,i) => `
    <div style="display:flex;gap:6px;margin-bottom:6px;align-items:center;">
      <input class="cfg" style="flex:2;margin:0;" placeholder="Nombre" value="${(r.nombre||'').replace(/"/g,'&quot;')}" oninput="updateCircuitRow(${i},'nombre',this.value)"/>
      <input class="cfg" style="flex:1;margin:0;" placeholder="Normal A" value="${(r.normal||'').replace(/"/g,'&quot;')}" oninput="updateCircuitRow(${i},'normal',this.value)"/>
      <input class="cfg" style="flex:1;margin:0;" placeholder="Máx A" value="${(r.maximo||'').replace(/"/g,'&quot;')}" oninput="updateCircuitRow(${i},'maximo',this.value)"/>
      <div class="rmbtn" onclick="removeCircuitRow(${i})">✕</div>
    </div>`).join('');
}
function circuitsToText(rows) {
  if (!rows || !rows.length) return '';
  return rows.filter(r => r.nombre && r.nombre.trim())
    .map(r => `${r.nombre}: normal ${r.normal || '—'}A / máx ${r.maximo || '—'}A`)
    .join(' · ');
}

// Migra visitas del formato viejo (client/address/phone sueltos) a clientes reales, una sola vez.
function migrateVisitsToClients() {
  let changed = false;
  visits.forEach(v => {
    if (v.clientId) return;
    const nombre = (v.client || '').trim();
    if (!nombre) return;
    let c = clients.find(x => x.nombre.toLowerCase() === nombre.toLowerCase());
    if (!c) { c = { id: Date.now() + Math.random(), nombre, direccion: v.address || '', telefono: v.phone || '' }; clients.push(c); }
    v.clientId = c.id;
    if (!v.pendiente) v.pendiente = '';
    if (typeof v.mediciones === 'string') v.mediciones = v.mediciones ? { _libre: v.mediciones } : {};
    changed = true;
  });
  if (changed) { lsSet('pv_clients', JSON.stringify(clients)); lsSet('pv_visits', JSON.stringify(visits)); }
}

function renderClientPicker() {
  const el = document.getElementById('client-picker-list');
  const qEl = document.getElementById('client-search');
  if (!el || !qEl) return;
  const q = qEl.value.toLowerCase().trim();
  const list = !q ? clients.slice(0, 15) : clients.filter(c => c.nombre.toLowerCase().includes(q));
  if (!list.length) { el.innerHTML = `<div class="empty">${q ? 'Sin resultados' : 'Todavía no cargaste clientes.'}</div>`; return; }
  el.innerHTML = list.map(c => `
    <div class="task-item" onclick="openClientDetail(${c.id})">
      <div style="flex:1;min-width:0">
        <div class="task-name">${c.nombre}</div>
        <div class="task-cat">${[c.direccion, c.telefono].filter(Boolean).join(' · ') || 'Sin datos adicionales'}</div>
      </div>
    </div>`).join('');
}
function createClient() {
  const nombre    = document.getElementById('new-client-nombre').value.trim();
  const direccion = document.getElementById('new-client-direccion').value.trim();
  const telefono  = document.getElementById('new-client-telefono').value.trim();
  if (!nombre) { toast('Cargá al menos el nombre del cliente', true); return; }
  const c = { id: Date.now(), nombre, direccion, telefono };
  clients.unshift(c);
  lsSet('pv_clients', JSON.stringify(clients));
  ['new-client-nombre','new-client-direccion','new-client-telefono'].forEach(id => document.getElementById(id).value = '');
  openClientDetail(c.id);
}
function openClientDetail(id) {
  const c = clients.find(x => x.id === id); if (!c) return;
  activeClientId = id;
  editingClient = false;
  editingVisitId = null;
  document.getElementById('visit-picker').style.display = 'none';
  document.getElementById('visit-detail').style.display = 'block';
  renderClientHeader();
  document.getElementById('visit-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('visit-motivo').value = '';
  document.getElementById('visit-pendiente').value = '';
  document.getElementById('visit-obs').value = '';
  clearMedicionFields();
  currentCircuitRows = [];
  renderCircuitRows();
  document.getElementById('visit-form-title').textContent = 'Nueva visita';
  document.getElementById('visit-save-btn').textContent = '💾 Guardar visita';
  document.getElementById('visit-cancel-edit').style.display = 'none';
  renderClientVisitList();
  renderClientBudgetList();
}
function closeClientDetail() {
  activeClientId = null;
  editingClient = false;
  editingVisitId = null;
  document.getElementById('visit-detail').style.display = 'none';
  document.getElementById('visit-picker').style.display = 'block';
  renderClientPicker();
}

// ── Editar / eliminar cliente ──
function renderClientHeader() {
  const c = clients.find(x => x.id === activeClientId); if (!c) return;
  const view = document.getElementById('client-header-view');
  const edit = document.getElementById('client-header-edit');
  if (editingClient) {
    view.style.display = 'none'; edit.style.display = 'block';
    document.getElementById('edit-client-nombre').value = c.nombre;
    document.getElementById('edit-client-direccion').value = c.direccion || '';
    document.getElementById('edit-client-telefono').value = c.telefono || '';
  } else {
    view.style.display = 'block'; edit.style.display = 'none';
    document.getElementById('client-detail-nombre').textContent = c.nombre;
    document.getElementById('client-detail-info').textContent = [c.direccion, c.telefono].filter(Boolean).join(' · ') || 'Sin datos adicionales';
  }
}
function toggleEditClient() {
  if (!activeClientId) return;
  editingClient = !editingClient;
  renderClientHeader();
}
function saveClientEdit() {
  const c = clients.find(x => x.id === activeClientId); if (!c) return;
  const nombre = document.getElementById('edit-client-nombre').value.trim();
  if (!nombre) { toast('El nombre no puede quedar vacío', true); return; }
  c.nombre = nombre;
  c.direccion = document.getElementById('edit-client-direccion').value.trim();
  c.telefono = document.getElementById('edit-client-telefono').value.trim();
  lsSet('pv_clients', JSON.stringify(clients));
  editingClient = false;
  renderClientHeader();
  renderClientPicker();
  toast('✅ Cliente actualizado');
}
function deleteClient() {
  if (!activeClientId) return;
  if (!confirm('¿Eliminar este cliente? Sus visitas y presupuestos vinculados no se borran, pero quedan sin cliente asignado.')) return;
  clients = clients.filter(x => x.id !== activeClientId);
  lsSet('pv_clients', JSON.stringify(clients));
  closeClientDetail();
  toast('Cliente eliminado');
}

// ── Guardar / editar visita ──
function saveVisit() {
  if (!activeClientId) return;
  const date      = document.getElementById('visit-date').value || new Date().toISOString().slice(0,10);
  const motivo    = document.getElementById('visit-motivo').value.trim();
  const pendiente = document.getElementById('visit-pendiente').value.trim();
  const obs       = document.getElementById('visit-obs').value.trim();
  const mediciones= getMedicionValues();
  const circuitos = currentCircuitRows.filter(r => r.nombre && r.nombre.trim());

  if (!motivo && !pendiente && !Object.keys(mediciones).length && !circuitos.length) {
    toast('Cargá al menos la tarea realizada, lo pendiente o una medición', true); return;
  }

  if (editingVisitId) {
    const v = visits.find(x => x.id === editingVisitId);
    if (v) { v.date = date; v.motivo = motivo; v.pendiente = pendiente; v.mediciones = mediciones; v.obs = obs; v.circuitos = circuitos; }
    editingVisitId = null;
    document.getElementById('visit-form-title').textContent = 'Nueva visita';
    document.getElementById('visit-save-btn').textContent = '💾 Guardar visita';
    document.getElementById('visit-cancel-edit').style.display = 'none';
    toast('✅ Visita actualizada');
  } else {
    visits.unshift({ id: Date.now(), clientId: activeClientId, date, motivo, pendiente, mediciones, obs, circuitos });
    toast('✅ Visita guardada en el historial del cliente');
  }
  lsSet('pv_visits', JSON.stringify(visits));

  document.getElementById('visit-motivo').value = '';
  document.getElementById('visit-pendiente').value = '';
  document.getElementById('visit-obs').value = '';
  clearMedicionFields();
  currentCircuitRows = [];
  renderCircuitRows();
  document.getElementById('visit-date').value = new Date().toISOString().slice(0,10);

  renderClientVisitList();
}
function editVisit(id) {
  const v = visits.find(x => x.id === id); if (!v) return;
  editingVisitId = id;
  document.getElementById('visit-date').value = v.date || new Date().toISOString().slice(0,10);
  document.getElementById('visit-motivo').value = v.motivo || '';
  document.getElementById('visit-pendiente').value = v.pendiente || '';
  document.getElementById('visit-obs').value = v.obs || '';
  MEDICION_FIELDS.forEach(f => { const el = document.getElementById('med-' + f.key); if (el) el.value = (v.mediciones && v.mediciones[f.key]) || ''; });
  currentCircuitRows = v.circuitos ? JSON.parse(JSON.stringify(v.circuitos)) : [];
  renderCircuitRows();
  document.getElementById('visit-form-title').textContent = 'Editar visita';
  document.getElementById('visit-save-btn').textContent = '💾 Guardar cambios';
  document.getElementById('visit-cancel-edit').style.display = 'inline-block';
}
function cancelEditVisit() {
  editingVisitId = null;
  document.getElementById('visit-motivo').value = '';
  document.getElementById('visit-pendiente').value = '';
  document.getElementById('visit-obs').value = '';
  clearMedicionFields();
  currentCircuitRows = [];
  renderCircuitRows();
  document.getElementById('visit-date').value = new Date().toISOString().slice(0,10);
  document.getElementById('visit-form-title').textContent = 'Nueva visita';
  document.getElementById('visit-save-btn').textContent = '💾 Guardar visita';
  document.getElementById('visit-cancel-edit').style.display = 'none';
}
function deleteVisit(id) {
  visits = visits.filter(v => v.id !== id);
  lsSet('pv_visits', JSON.stringify(visits));
  if (editingVisitId === id) cancelEditVisit();
  renderClientVisitList();
}

// ── Vincular presupuestos al cliente ──
function attachCurrentBudgetToClient() {
  if (!activeClientId) return;
  if (!budget.length) { toast('No hay tareas cargadas en el presupuesto actual (pestaña Presupuesto)', true); return; }
  const c = clients.find(x => x.id === activeClientId); if (!c) return;
  const entry = {
    id: Date.now(),
    client: c.nombre,
    clientId: activeClientId,
    date: new Date().toLocaleDateString('es-AR', {day:'2-digit',month:'2-digit',year:'numeric'}),
    total: getTotal(),
    subtotal: getSubtotal(),
    discount: getDiscountPct(),
    budget: JSON.parse(JSON.stringify(budget)),
    materials: JSON.parse(JSON.stringify(materials)),
    status: 'pendiente'
  };
  history_.unshift(entry);
  lsSet('pv_history', JSON.stringify(history_));
  renderHistory();
  renderClientBudgetList();
  toast('✅ Presupuesto vinculado a ' + c.nombre);
}
function renderClientBudgetList() {
  const el = document.getElementById('client-budget-list');
  if (!el || !activeClientId) return;
  const list = history_.filter(h => h.clientId === activeClientId);
  if (!list.length) { el.innerHTML = '<div class="empty">Sin presupuestos vinculados todavía.</div>'; return; }
  el.innerHTML = list.map(h => `
    <div class="card" style="margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;gap:8px;">
      <div style="min-width:0;">
        <div style="font-weight:700;">${h.date} · ${fmt(h.total)}</div>
        <div style="font-size:11px;color:var(--muted);text-transform:capitalize;">${h.status}</div>
      </div>
      <div style="display:flex;gap:6px;flex-shrink:0;">
        <div class="hbtn" onclick="viewHistEntry(${h.id})">Ver</div>
        <div class="rmbtn" onclick="unlinkClientBudget(${h.id})">✕</div>
      </div>
    </div>`).join('');
}
function unlinkClientBudget(id) {
  const h = history_.find(x => x.id === id); if (!h) return;
  delete h.clientId;
  lsSet('pv_history', JSON.stringify(history_));
  renderClientBudgetList();
}
function medicionesToText(m) {
  if (!m) return '';
  if (m._libre) return m._libre;
  return MEDICION_FIELDS
    .filter(f => m[f.key])
    .map(f => `${f.label}: ${m[f.key]}${f.unit ? f.unit : ''}`)
    .join(' · ');
}
function renderClientVisitList() {
  const el = document.getElementById('client-visit-list');
  if (!el || !activeClientId) return;
  const list = visits.filter(v => v.clientId === activeClientId);
  if (!list.length) { el.innerHTML = '<div class="empty">Sin visitas registradas todavía para este cliente.</div>'; return; }
  el.innerHTML = list.map(v => {
    const medTxt = medicionesToText(v.mediciones);
    const circTxt = circuitsToText(v.circuitos);
    return `
    <div class="card" style="margin-bottom:8px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div style="font-size:12px;color:var(--muted);font-weight:700;">${v.date || ''}</div>
        <div style="display:flex;gap:6px;flex-shrink:0;">
          <div class="hbtn" onclick="editVisit(${v.id})">✏️</div>
          <div class="rmbtn" onclick="deleteVisit(${v.id})">✕</div>
        </div>
      </div>
      ${v.motivo ? `<div style="margin-top:6px;font-size:13px;"><b>Hecho:</b> ${v.motivo}</div>` : ''}
      ${v.pendiente ? `<div style="margin-top:5px;font-size:13px;color:#f5c518;"><b>⏳ Pendiente:</b> ${v.pendiente}</div>` : ''}
      ${medTxt ? `<div style="margin-top:5px;font-size:12px;color:var(--muted);"><b>Mediciones:</b> ${medTxt}</div>` : ''}
      ${circTxt ? `<div style="margin-top:5px;font-size:12px;color:var(--muted);"><b>Circuitos:</b> ${circTxt}</div>` : ''}
      ${v.obs ? `<div style="margin-top:5px;font-size:12px;color:var(--muted);">${v.obs}</div>` : ''}
    </div>`;
  }).join('');
}

let _lastImageFilename = 'presupuesto-patagonia-volt.png';

function downloadClientHistory() {
  if (!activeClientId) return;
  const c = clients.find(x => x.id === activeClientId); if (!c) return;
  const list = visits.filter(v => v.clientId === activeClientId).sort((a,b) => (a.date||'').localeCompare(b.date||''));
  if (!list.length) { toast('Este cliente todavía no tiene visitas registradas', true); return; }

  const rowsHTML = list.map(v => {
    const medTxt = medicionesToText(v.mediciones);
    const circTxt = circuitsToText(v.circuitos);
    return `
    <div style="background:#1e2230;border:1px solid #2a2f3e;border-radius:7px;padding:10px 13px;margin-bottom:6px;">
      <div style="font-size:11px;color:#f5c518;font-weight:700;font-family:'Barlow Condensed',sans-serif;letter-spacing:1px;">${v.date || ''}</div>
      ${v.motivo ? `<div style="font-size:13px;color:#e8eaf0;margin-top:4px;font-family:'Barlow',sans-serif;"><b>Hecho:</b> ${v.motivo}</div>` : ''}
      ${v.pendiente ? `<div style="font-size:13px;color:#f5c518;margin-top:3px;font-family:'Barlow',sans-serif;"><b>Pendiente:</b> ${v.pendiente}</div>` : ''}
      ${medTxt ? `<div style="font-size:12px;color:#9aa0b5;margin-top:3px;font-family:'Barlow',sans-serif;"><b>Mediciones:</b> ${medTxt}</div>` : ''}
      ${circTxt ? `<div style="font-size:12px;color:#9aa0b5;margin-top:3px;font-family:'Barlow',sans-serif;"><b>Circuitos:</b> ${circTxt}</div>` : ''}
      ${v.obs ? `<div style="font-size:12px;color:#7a8099;margin-top:3px;font-family:'Barlow',sans-serif;">${v.obs}</div>` : ''}
    </div>`;
  }).join('');

  document.getElementById('visit-hist-src').innerHTML = `
    <div style="background:#0d0f14;padding:32px;width:700px;font-family:'Barlow Condensed',sans-serif;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #f5c518;">
        <div style="width:42px;height:42px;background:#f5c518;flex-shrink:0;clip-path:polygon(50% 0%,80% 40%,55% 40%,70% 100%,20% 55%,50% 55%);"></div>
        <div style="flex:1;">
          <div style="font-size:26px;font-weight:800;letter-spacing:1px;color:#f5c518;line-height:1;">PATAGONIA VOLT</div>
          <div style="font-size:10px;color:#7a8099;letter-spacing:3px;text-transform:uppercase;margin-top:1px;">Historial de Visitas</div>
        </div>
      </div>
      <div style="background:#14161f;border:1px solid #f5c518;border-radius:7px;padding:8px 13px;margin-bottom:14px;font-family:'Barlow',sans-serif;">
        <div style="font-size:10px;color:#7a8099;text-transform:uppercase;letter-spacing:1px;">Cliente</div>
        <div style="font-size:16px;font-weight:700;color:#e8eaf0;">${c.nombre}</div>
        <div style="font-size:11px;color:#7a8099;">${[c.direccion, c.telefono].filter(Boolean).join(' · ')}</div>
      </div>
      ${rowsHTML}
    </div>`;

  toast('Generando imagen…');
  setTimeout(() => {
    html2canvas(document.getElementById('visit-hist-src'), {
      scale:2, backgroundColor:'#0d0f14', logging:false, useCORS:true
    }).then(canvas => {
      _lastImageFilename = `historial-${c.nombre.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`;
      document.getElementById('wa-img').src = canvas.toDataURL('image/png');
      document.getElementById('wa-modal').classList.remove('hidden');
    }).catch(() => toast('Error al generar imagen', true));
  }, 160);
}

function renderHistory() {
  const el = document.getElementById('hist-list');
  const cnt = document.getElementById('hist-count');
  cnt.textContent = history_.length ? `${history_.length} presupuesto${history_.length>1?'s':''} guardado${history_.length>1?'s':''}` : '';
  if (!history_.length) { el.innerHTML='<div class="empty">No hay presupuestos guardados todavía.</div>'; return; }

  const statusLabel = { pendiente:'⏳ Pendiente', aceptado:'✅ Aceptado', rechazado:'❌ Rechazado' };
  const statusClass = { pendiente:'sb-pend', aceptado:'sb-ok', rechazado:'sb-no' };

  el.innerHTML = history_.map(h => `
    <div class="hist-item">
      <div class="hist-header">
        <span class="hist-client">${h.client}</span>
        <span class="hist-total">${fmt(h.total)}</span>
      </div>
      <div class="hist-date">${h.date}</div>
      <div class="hist-badges">
        <button class="status-badge ${statusClass[h.status]}">${statusLabel[h.status]}</button>
      </div>
      <div class="hist-actions">
        <button class="hist-mini-btn" onclick="viewHistEntry(${h.id})">👁 Ver</button>
        <button class="hist-mini-btn" style="color:var(--green)" onclick="setStatus(${h.id},'aceptado')">✅ Aceptado</button>
        <button class="hist-mini-btn" style="color:var(--danger)" onclick="setStatus(${h.id},'rechazado')">❌ Rechazado</button>
        <button class="hist-mini-btn" onclick="setStatus(${h.id},'pendiente')">⏳ Pendiente</button>
        <button class="hist-mini-btn" style="color:var(--danger)" onclick="deleteHistEntry(${h.id})">🗑</button>
      </div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  SWITCHES
// ══════════════════════════════════════════════════════════
function toggleSw(swId, key) {
  settings[key] = !settings[key];
  document.getElementById(swId).classList.toggle('on', settings[key]);
  lsSet('pv_settings', JSON.stringify(settings));
  renderBudget();
}
function applySettings() {
  document.getElementById('sw-hide').classList.toggle('on', settings.hideUnit);
  document.getElementById('sw-mats').classList.toggle('on', settings.showMats);
  document.getElementById('sw-desc').classList.toggle('on', settings.includeDesc);
}

// ══════════════════════════════════════════════════════════
//  DESCRIPCIONES TÉCNICAS POR TAREA (editables por el usuario)
// ══════════════════════════════════════════════════════════
let selectedDescTaskId = null;

function renderDescTaskList() {
  const el = document.getElementById('desc-task-list');
  const qEl = document.getElementById('desc-task-search');
  if (!el || !qEl) return;
  const q = qEl.value.toLowerCase().trim();
  if (!q) { el.innerHTML = '<div class="empty">Escribí para buscar una tarea…</div>'; return; }
  const list = tasks.filter(t => t.name.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q)).slice(0, 25);
  if (!list.length) { el.innerHTML = '<div class="empty">Sin resultados</div>'; return; }
  el.innerHTML = list.map(t => `
    <div class="task-item" onclick="openTaskDescEditor(${t.id})">
      <div style="flex:1;min-width:0">
        <div class="task-name">${t.name}</div>
        <div class="task-cat">${t.cat}${taskDescOverride[t.name] ? ' · ✏️ editada' : ''}</div>
      </div>
    </div>`).join('');
}
function openTaskDescEditor(id) {
  const t = tasks.find(x => x.id === id); if (!t) return;
  selectedDescTaskId = id;
  document.getElementById('desc-task-editor').style.display = 'block';
  document.getElementById('desc-task-editor-title').textContent = t.name;
  document.getElementById('desc-task-text').value = getTaskDesc(t);
}
function saveTaskDescOverride() {
  if (selectedDescTaskId == null) return;
  const t = tasks.find(x => x.id === selectedDescTaskId); if (!t) return;
  taskDescOverride[t.name] = document.getElementById('desc-task-text').value;
  lsSet('pv_taskdesc_override', JSON.stringify(taskDescOverride));
  renderBudget();
}
function resetTaskDescOverride() {
  if (selectedDescTaskId == null) return;
  const t = tasks.find(x => x.id === selectedDescTaskId); if (!t) return;
  delete taskDescOverride[t.name];
  lsSet('pv_taskdesc_override', JSON.stringify(taskDescOverride));
  document.getElementById('desc-task-text').value = getTaskDesc(t);
  renderDescTaskList();
  renderBudget();
  toast('Descripción restaurada a la técnica original');
}

// ══════════════════════════════════════════════════════════
//  TOTAL + DESCUENTO
// ══════════════════════════════════════════════════════════
function getSubtotal() {
  return budget.reduce((s,b) => {
    const t = tasks.find(x=>x.id===b.taskId);
    return s + (t ? t.price*b.qty : 0);
  }, 0);
}
function getDiscountPct() {
  const v = parseFloat(document.getElementById('discount-input').value);
  return (isNaN(v) || v < 0) ? 0 : Math.min(v, 100);
}
function getTotal() {
  const sub = getSubtotal();
  const pct = getDiscountPct();
  return sub * (1 - pct / 100);
}
function applyDiscount() {
  updateTotal();
  saveCurrentState();
}
function updateTotal() {
  const sub    = getSubtotal();
  const pct    = getDiscountPct();
  const saving = sub * pct / 100;
  document.getElementById('total-display').textContent = fmt(sub - saving);
  const savEl = document.getElementById('discount-saving');
  if (savEl) savEl.textContent = saving > 0 ? '− ' + Math.round(saving).toLocaleString('es-AR') : '$ 0';
}
function fmt(n) { return '$ ' + Math.round(n).toLocaleString('es-AR'); }

// ══════════════════════════════════════════════════════════
//  IMPORT
// ══════════════════════════════════════════════════════════
function importPrices() {
  const text = document.getElementById('import-text').value.trim();
  if (!text) { toast('Pegá el texto primero','error'); return; }
  const lines = text.split('\n');
  let cat = 'Importado';
  const imported = [];
  let idCtr = Date.now();
  const prRe = /\$\s*([\d.]+(?:,\d+)?)/;
  const skip  = ['publicidad','prohibida','contacto','newsletter','cms','troop','grupo electro'];
  lines.forEach(raw => {
    const line = raw.trim();
    if (!line || line.length < 3) return;
    if (skip.some(w => line.toLowerCase().includes(w))) return;
    if (!prRe.test(line)) {
      if (line.length < 70 && !line.startsWith('De ') && !line.startsWith('Hasta ') && !line.includes('...') && !line.match(/^\d/)) {
        const clean = line.replace(/[:\-–]/g,'').trim();
        if (clean.length > 2) cat = clean;
      }
      return;
    }
    const m = line.match(prRe);
    const price = parseFloat(m[1].replace(/\./g,'').replace(',','.'));
    if (isNaN(price) || price < 500) return;
    let name = line.split(/\.{2,}/)[0].replace(/:\s*$/,'').trim();
    if (!name || name.length < 3) name = line.split('$')[0].replace(/:/,'').trim();
    if (!name || name.length < 3) return;
    imported.push({id:idCtr++, cat, name, price});
  });
  if (!imported.length) { toast('No se detectaron precios válidos','error'); return; }
  const existing = new Set(tasks.map(t=>t.name.toLowerCase()));
  const newOnes = imported.filter(t=>!existing.has(t.name.toLowerCase()));
  tasks = [...tasks, ...newOnes];
  lsSet('pv_tasks', JSON.stringify(tasks));
  renderCats(); renderTasks(); updateDBStats();
  document.getElementById('import-text').value='';
  toast(`✅ ${newOnes.length} tareas importadas`);
}

function confirmReset() {
  if (!confirm('¿Restaurar la base de datos original? Se perderán las tareas importadas.')) return;
  tasks = BUILTIN.map((t,i)=>({...t,id:i}));
  lsSet('pv_tasks', JSON.stringify(tasks));
  activeCat='Todos'; renderCats(); renderTasks(); updateDBStats();
  toast('Base de datos restaurada');
}
function updateDBStats() {
  const cats = [...new Set(tasks.map(t=>t.cat))].length;
  document.getElementById('db-stats').textContent =
    `${tasks.length} tareas · ${cats} categorías`;
  updateLastPriceUpdateLabel();
}

// ══════════════════════════════════════════════════════════
//  ACTUALIZACIÓN AUTOMÁTICA DE PRECIOS (via Supabase Edge Function)
// ══════════════════════════════════════════════════════════
const PRICE_UPDATE_API = 'https://kmkprbnwcbavonfnyput.supabase.co/functions/v1/update-prices';

function updateLastPriceUpdateLabel() {
  const el = document.getElementById('last-price-update');
  if (!el) return;
  const iso = ls('pv_prices_updated_at');
  el.textContent = iso
    ? 'Última actualización: ' + new Date(iso).toLocaleString('es-AR', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})
    : 'Todavía no actualizaste los precios desde la web.';
}

async function updatePricesFromWeb() {
  const btns = document.querySelectorAll('.js-update-price-btn');
  const originals = [];
  btns.forEach((b,i) => { originals[i] = b.textContent; b.disabled = true; b.textContent = '⏳ Actualizando…'; });

  try {
    const res = await fetch(PRICE_UPDATE_API);
    let data;
    try { data = await res.json(); }
    catch (e) { throw new Error('Respuesta inválida del servidor (' + res.status + ')'); }
    if (!data.ok) throw new Error(data.error || ('Error del servidor (' + res.status + ')'));
    if (!Array.isArray(data.items) || !data.items.length) throw new Error('No se recibieron precios');

    const byName = new Map(tasks.map(t => [t.name.trim().toLowerCase(), t]));
    let updated = 0, added = 0, idCtr = Date.now();

    data.items.forEach(it => {
      if (!it || !it.name || typeof it.price !== 'number' || it.price <= 0) return;
      const key = it.name.trim().toLowerCase();
      const existing = byName.get(key);
      if (existing) {
        if (existing.price !== it.price) { existing.price = it.price; updated++; }
        if (it.cat) existing.cat = it.cat;
      } else {
        const t = { id: idCtr++, cat: it.cat || 'Importado', name: it.name.trim(), price: it.price };
        tasks.push(t);
        byName.set(key, t);
        added++;
      }
    });

    lsSet('pv_tasks', JSON.stringify(tasks));
    lsSet('pv_prices_updated_at', data.updated_at || new Date().toISOString());

    renderCats(); renderTasks(); renderBudget(); updateDBStats();
    toast(`✅ Precios actualizados: ${updated} cambiados, ${added} nuevos`);
  } catch (e) {
    toast('❌ No se pudo actualizar: ' + (e.message || e), true);
  } finally {
    btns.forEach((b,i) => { b.disabled = false; b.textContent = originals[i]; });
  }
}

// ══════════════════════════════════════════════════════════
//  MODAL
// ══════════════════════════════════════════════════════════
function closeModal(id) { document.getElementById(id).classList.add('hidden'); }

// ══════════════════════════════════════════════════════════
//  WHATSAPP IMAGE
// ══════════════════════════════════════════════════════════
function generateWA() {
  if (!budget.length) { toast('Agregá tareas primero','error'); return; }
  const client  = document.getElementById('client-name').value.trim();
  const today   = new Date().toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'});
  const expiry  = (() => {
    const d = new Date(); d.setDate(d.getDate()+7);
    return d.toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit',year:'numeric'});
  })();
  const sub     = getSubtotal();
  const pct     = getDiscountPct();
  const saving  = sub * pct / 100;
  const total   = sub - saving;

  const grp = {};
  budget.forEach(b => {
    const t = tasks.find(x=>x.id===b.taskId); if(!t) return;
    if (!grp[t.cat]) grp[t.cat]=[];
    grp[t.cat].push({b,t});
  });

  let itemsHTML = '';
  for (const [cat, items] of Object.entries(grp)) {
    itemsHTML += `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7a8099;margin:15px 0 5px;font-family:'Barlow Condensed',sans-serif;">${cat}</div>`;
    items.forEach(({b,t}) => {
      const sub = t.price*b.qty;
      const desc = settings.includeDesc ? getTaskDesc(t) : '';
      itemsHTML += `
        <div style="background:#1e2230;border:1px solid #2a2f3e;border-radius:7px;padding:9px 13px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;font-family:'Barlow',sans-serif;color:#e8eaf0;">${t.name}</div>
            <div style="font-size:11px;color:#7a8099;font-family:'Barlow',sans-serif;">${settings.hideUnit ? `Cant: ${b.qty}` : `${fmt(t.price)} × ${b.qty}`}</div>
            ${desc ? `<div style="font-size:10.5px;color:#9aa0b5;font-family:'Barlow',sans-serif;line-height:1.4;margin-top:4px;">📝 ${desc}</div>` : ''}
          </div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#f5c518;white-space:nowrap;margin-left:10px;">${fmt(sub)}</div>
        </div>`;
    });
  }

  let matsHTML = '';
  if (settings.showMats && materials.length) {
    matsHTML = `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7a8099;margin:15px 0 5px;font-family:'Barlow Condensed',sans-serif;">Materiales a comprar</div>`;
    materials.forEach(m => {
      matsHTML += `<div style="background:#1e2230;border:1px solid #2a2f3e;border-radius:7px;padding:7px 13px;margin-bottom:3px;font-size:12px;font-family:'Barlow',sans-serif;color:${m.checked?'#7a8099':'#e8eaf0'};${m.checked?'text-decoration:line-through;':''}">${m.checked?'☑':'☐'} ${m.name}${(m.qty||1)>1 ? ' × ' + (m.qty||1) : ''}</div>`;
    });
  }

  const contactHTML = (userCfg.nombre || userCfg.tel || userCfg.email) ? `
    <div style="background:#1e2230;border:1px solid #2a2f3e;border-radius:7px;padding:11px 14px;margin-top:15px;font-family:'Barlow',sans-serif;line-height:1.7;">
      ${userCfg.nombre ? `<div style="font-weight:700;color:#e8eaf0;font-size:14px;">${userCfg.nombre}</div>` : ''}
      ${userCfg.tel    ? `<div style="font-size:12px;color:#7a8099;">📞 ${userCfg.tel}</div>` : ''}
      ${userCfg.email  ? `<div style="font-size:12px;color:#7a8099;">✉ ${userCfg.email}</div>` : ''}
    </div>` : '';

  const clientHTML = client
    ? `<div style="background:#14161f;border:1px solid #f5c518;border-radius:7px;padding:8px 13px;margin-bottom:14px;font-family:'Barlow',sans-serif;">
         <div style="font-size:10px;color:#7a8099;text-transform:uppercase;letter-spacing:1px;">Cliente / Obra</div>
         <div style="font-size:16px;font-weight:700;color:#e8eaf0;">${client}</div>
       </div>`
    : '';

  document.getElementById('wa-src').innerHTML = `
    <div style="background:#0d0f14;padding:32px;width:700px;font-family:'Barlow Condensed',sans-serif;">
      <!-- Header -->
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;padding-bottom:14px;border-bottom:2px solid #f5c518;">
        <div style="width:42px;height:42px;background:#f5c518;flex-shrink:0;clip-path:polygon(50% 0%,80% 40%,55% 40%,70% 100%,20% 55%,50% 55%);"></div>
        <div style="flex:1;">
          <div style="font-size:26px;font-weight:800;letter-spacing:1px;color:#f5c518;line-height:1;">PATAGONIA VOLT</div>
          <div style="font-size:10px;color:#7a8099;letter-spacing:3px;text-transform:uppercase;margin-top:1px;">Instalaciones Eléctricas · Presupuesto</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#7a8099;">Fecha: ${today}</div>
          <div style="font-size:11px;color:#f5c518;font-weight:700;margin-top:3px;">✅ Válido por 7 días</div>
          <div style="font-size:10px;color:#7a8099;">Vence: ${expiry}</div>
        </div>
      </div>
      ${clientHTML}
      ${itemsHTML}
      ${matsHTML}
      <!-- Total -->
      <div style="background:#14161f;border:2px solid #f5c518;border-radius:9px;padding:14px 18px;margin-top:18px;">
        ${pct > 0 ? `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #2a2f3e;">
          <div style="font-size:11px;color:#7a8099;text-transform:uppercase;letter-spacing:2px;">Subtotal</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:18px;color:#7a8099;text-decoration:line-through;">${fmt(sub)}</div>
        </div>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #2a2f3e;">
          <div style="font-size:11px;color:#4caf7d;text-transform:uppercase;letter-spacing:2px;">Descuento ${pct}%</div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:700;color:#4caf7d;">− ${fmt(saving)}</div>
        </div>` : ''}
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <div style="font-size:11px;color:#7a8099;text-transform:uppercase;letter-spacing:2px;">Total Mano de Obra</div>
            <div style="font-size:10px;color:#3a3f50;margin-top:2px;">No incluye materiales</div>
          </div>
          <div style="font-size:34px;font-weight:800;color:#f5c518;">${fmt(total)}</div>
        </div>
      </div>
      ${contactHTML}
      <div style="margin-top:16px;text-align:center;font-size:10px;color:#3a3f50;letter-spacing:1px;font-family:'Barlow',sans-serif;">
        Valores de referencia · Electro Instalador Mar-Abr 2026 · No incluye materiales
      </div>
    </div>`;

  toast('Generando imagen…');
  setTimeout(() => {
    html2canvas(document.getElementById('wa-src'), {
      scale:2, backgroundColor:'#0d0f14', logging:false, useCORS:true
    }).then(canvas => {
      _lastImageFilename = 'presupuesto-patagonia-volt.png';
      document.getElementById('wa-img').src = canvas.toDataURL('image/png');
      document.getElementById('wa-modal').classList.remove('hidden');
    }).catch(() => toast('Error al generar imagen','error'));
  }, 160);
}

function downloadWA() {
  const img = document.getElementById('wa-img');
  if (!img.src || img.src===window.location.href) return;
  const a=document.createElement('a'); a.href=img.src;
  a.download = _lastImageFilename || 'presupuesto-patagonia-volt.png'; a.click();
  toast('✅ Imagen descargada');
}

// ══════════════════════════════════════════════════════════
//  SERVICE WORKER REGISTRATION (con auto-actualización)
// ══════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then(reg => {
      console.log('SW registrado');

      // Revisar si hay una versión nueva cada vez que:
      // 1) el celular recupera señal de internet
      window.addEventListener('online', () => reg.update().catch(()=>{}));
      // 2) la app vuelve a primer plano (la abrís de nuevo, cambiás de app y volvés)
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') reg.update().catch(()=>{});
      });
      // 3) igual, cada 10 minutos mientras está abierta (por si se queda con señal intermitente)
      setInterval(() => reg.update().catch(()=>{}), 10 * 60 * 1000);

    }).catch(e => console.log('SW error:', e));

    // Cuando el navegador termina de instalar una versión nueva y la activa,
    // recargar la página sola para mostrarla — sin que el usuario tenga que hacer nada.
    let pvReloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (pvReloading) return;
      pvReloading = true;
      toast('🔄 Actualizando a la última versión…');
      setTimeout(() => window.location.reload(), 600);
    });
  });
}

// ══════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════
init();
