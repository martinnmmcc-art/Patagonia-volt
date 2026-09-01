// ══════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════
let tasks     = [];
let budget    = [];
let materials = [];
const DEFAULT_SETTINGS = { hideUnit: false, showMats: true, includeDesc: true };
let settings  = { ...DEFAULT_SETTINGS };
const DEFAULT_TASK_DESC = {
  // Redacción propia: mezcla lo que exige la reglamentación AEA 90364 con explicación en criollo,
  // pensada para que el cliente entienda qué está pagando. Editalas en Config cuando quieras.
  'Acometidas': 'Es traer la conexión eléctrica desde la red pública hasta el medidor, protegida dentro de un caño embutido en la pared (así lo exige la norma AEA, para que el cable no quede expuesto a golpes ni humedad). El precio varía según la potencia contratada: a mayor kW, se necesita conductor más grueso y caño de mayor diámetro. No incluye materiales ni la jabalina de puesta a tierra.',
  'Cableado': 'Es pasar los cables por dentro de los caños (nuevos o ya instalados) hasta cada punto de luz o toma. La norma AEA exige respetar el color de cable según su función (por ejemplo, verde-amarillo para tierra) y un grosor mínimo según lo que va a alimentar cada circuito. El precio se calcula por cantidad de bocas: cuantas más bocas, menor el costo por unidad. No incluye materiales.',
  'Canalización': 'Es instalar los caños y las cajas por donde después van a pasar los cables, embutidos en la pared o a la vista. La norma AEA exige mantener una distancia mínima respecto a cañerías de gas o agua, y usar cajas con espacio suficiente para no apretar los cables al conectar. El costo cambia según el material (metálico o PVC) y si va embutido o a la vista. No incluye materiales.',
  'CCTV': 'Es instalar el cableado de cada cámara de seguridad hasta el grabador (BCR), con o sin canalización según lo que se elija. No incluye las cámaras, el grabador ni la configuración del sistema.',
  'Tablero': 'Es fijar el gabinete del tablero (a la vista o empotrado en la pared) y conectar las llaves térmicas y el disyuntor diferencial. La norma AEA exige que cada circuito tenga su propia protección térmica y que toda la instalación quede protegida por un diferencial, por seguridad de las personas. El precio varía según si va empotrado (más trabajo de albañilería) o a la vista, y según la cantidad de bocas. No incluye materiales.',
  'Puesta a Tierra': 'Es clavar la jabalina de tierra en el suelo y colocarle su caja de inspección, para poder medir y mantener el sistema de puesta a tierra. La norma AEA exige que la resistencia de tierra sea baja, así el disyuntor diferencial actúa rápido ante una falla, y que el conductor tenga la sección mínima correspondiente. No incluye materiales.',
  'Artefactos': 'Es fijar el artefacto (extractor de aire, campana, ventilador de techo, etc.) y conectarlo eléctricamente a una salida que ya está cableada. No incluye el artefacto ni materiales de fijación.',
  'Bandeja': 'Es colocar una bandeja portacables (canaleta metálica abierta) para llevar varios cables juntos por un mismo recorrido, típico en locales o galpones. La norma exige fijarla firme cada cierta distancia y, si es metálica, conectarla a tierra para que no quede con tensión ante una falla. El precio depende del ancho de la bandeja y de la altura de trabajo. No incluye materiales.',
  'Boca Completa': 'Es el paquete completo de una boca: caño, caja y cableado, dejándola lista para conectar el artefacto o el tomacorriente. El precio baja a medida que aumenta la cantidad de bocas del trabajo, y también cambia según si la cañería es metálica o de PVC, embutida o a la vista. No incluye materiales.',
  'Cablecanal': 'Es colocar una canaleta plástica con tapa, a la vista, para llevar los cables de forma prolija sin romper la pared (muy usado en reformas). El precio es por boca, más un adicional por cada metro extra de recorrido. No incluye materiales.',
  'Corrección Potencia': 'Es armar y conectar un tablero con capacitores para corregir el factor de potencia de una instalación, y así evitar que la distribuidora cobre un recargo por "baja potencia" en instalaciones grandes (comercios, industrias). El precio varía según la capacidad en kvar y si el sistema es automático o no. No incluye materiales.',
  'Luminarias': 'Es fijar la luminaria (aplique, colgante, farola, tubo LED, luz de emergencia, etc.) y conectarla eléctricamente a la salida ya cableada. El tiempo y el precio varían según el tipo de artefacto y la cantidad de luces. No incluye el artefacto ni materiales de fijación.',
  'Mantenimiento': 'Es la visita de urgencia ante una falla eléctrica, con un tiempo máximo de trabajo (TM) incluido en el precio; superado ese tiempo, se cobra por hora adicional. El costo varía según la distancia al domicilio y si es en horario normal o fin de semana/feriado. No incluye materiales.',
  'Pisoducto': 'Es instalar los ductos dentro del contrapiso para poder sacar tomas de corriente o de datos en el medio de un ambiente (típico en oficinas o islas de cocina), incluyendo cajas de piso, curvas y derivaciones. Puede incluir también el cableado de energía o de datos por dentro, según se indique. No incluye materiales.',
  'Proyecto Eléctrico': 'Es el trabajo de planificación previo a instalar: relevar el inmueble, calcular las cargas eléctricas necesarias y armar la documentación técnica según la norma AEA, para que la instalación se pueda ejecutar correctamente. El precio depende de la cantidad de bocas del proyecto. No incluye trámites ante la empresa distribuidora.',
};
let taskDescCat = { ...DEFAULT_TASK_DESC }; // copia editable; se fusiona con lo guardado en init()
let userCfg   = { nombre: '', tel: '', email: '' };
let history_  = [];      // array of saved budgets
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
  // Caños y accesorios PVC
  {cat:'Caños y accesorios PVC', name:'Caño PVC rígido 16mm (5/8") x 3m'},
  {cat:'Caños y accesorios PVC', name:'Caño PVC rígido 20mm (3/4") x 3m'},
  {cat:'Caños y accesorios PVC', name:'Caño PVC rígido 25mm (1") x 3m'},
  {cat:'Caños y accesorios PVC', name:'Caño PVC rígido 32mm (1 1/4") x 3m'},
  {cat:'Caños y accesorios PVC', name:'Caño PVC rígido 38mm (1 1/2") x 3m'},
  {cat:'Caños y accesorios PVC', name:'Curva PVC 90° 20mm'},
  {cat:'Caños y accesorios PVC', name:'Curva PVC 90° 25mm'},
  {cat:'Caños y accesorios PVC', name:'Codo PVC 20mm'},
  {cat:'Caños y accesorios PVC', name:'Unión PVC (cupla) 16mm'},
  {cat:'Caños y accesorios PVC', name:'Unión PVC (cupla) 20mm'},
  {cat:'Caños y accesorios PVC', name:'Unión PVC (cupla) 25mm'},
  {cat:'Caños y accesorios PVC', name:'Boquilla PVC 16mm'},
  {cat:'Caños y accesorios PVC', name:'Boquilla PVC 20mm'},
  {cat:'Caños y accesorios PVC', name:'Boquilla PVC 25mm'},
  {cat:'Caños y accesorios PVC', name:'Conector caño-caja PVC 20mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC simple 16mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC simple 20mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC simple 25mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC simple 32mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC simple 38mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC con fijación (tarugo/tornillo) 16mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC con fijación (tarugo/tornillo) 20mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC con fijación (tarugo/tornillo) 25mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC con fijación (tarugo/tornillo) 32mm'},
  {cat:'Caños y accesorios PVC', name:'Grampa PVC con fijación (tarugo/tornillo) 38mm'},
  {cat:'Caños y accesorios PVC', name:'Pegamento para PVC (pomo)'},
  {cat:'Caños y accesorios PVC', name:'Cinta de teflón'},

  // Caños corrugados
  {cat:'Caños corrugados', name:'Corrugado liviano 16mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado liviano 20mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado liviano 25mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado liviano 32mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 16mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 20mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 25mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado semipesado 32mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 20mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 25mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 32mm (rollo)'},
  {cat:'Caños corrugados', name:'Corrugado reforzado (pesado) 38mm (rollo)'},
  {cat:'Caños corrugados', name:'Boquilla para corrugado 20mm'},
  {cat:'Caños corrugados', name:'Boquilla para corrugado 25mm'},
  {cat:'Caños corrugados', name:'Conector corrugado-caja'},
  {cat:'Caños corrugados', name:'Sonda pasacables (fiscal) 20mm'},

  // Cajas rectangulares
  {cat:'Cajas rectangulares', name:'Caja rectangular PVC 5x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular PVC doble 10x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular metálica 5x10cm'},
  {cat:'Cajas rectangulares', name:'Caja rectangular metálica doble 10x10cm'},
  {cat:'Cajas rectangulares', name:'Tapa ciega para caja rectangular'},

  // Cajas octogonales
  {cat:'Cajas octogonales', name:'Caja octogonal PVC chica (55mm)'},
  {cat:'Cajas octogonales', name:'Caja octogonal PVC grande (100mm)'},
  {cat:'Cajas octogonales', name:'Caja octogonal metálica chica'},
  {cat:'Cajas octogonales', name:'Caja octogonal metálica grande'},
  {cat:'Cajas octogonales', name:'Tapa ciega para caja octogonal'},

  // Cajas estanco (IP65/IP55)
  {cat:'Cajas estanco', name:'Caja estanco 100x100x50mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 150x150x70mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 200x200x90mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 250x200x100mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 300x300x120mm (IP65)'},
  {cat:'Cajas estanco', name:'Caja estanco 400x300x150mm (IP65)'},

  // Prensacables
  {cat:'Prensacables', name:'Prensacable PG7 (3-6,5mm)'},
  {cat:'Prensacables', name:'Prensacable PG9 (4-8mm)'},
  {cat:'Prensacables', name:'Prensacable PG11 (5-10mm)'},
  {cat:'Prensacables', name:'Prensacable PG13,5 (6-12mm)'},
  {cat:'Prensacables', name:'Prensacable PG16 (10-14mm)'},
  {cat:'Prensacables', name:'Prensacable PG21 (13-18mm)'},
  {cat:'Prensacables', name:'Prensacable PG29 (18-25mm)'},

  // Puesta a tierra
  {cat:'Puesta a tierra', name:'Jabalina copperweld 1m'},
  {cat:'Puesta a tierra', name:'Jabalina copperweld 1,5m'},
  {cat:'Puesta a tierra', name:'Jabalina copperweld 2m'},
  {cat:'Puesta a tierra', name:'Jabalina copperweld 2,4m'},
  {cat:'Puesta a tierra', name:'Grampa bimetálica para jabalina'},
  {cat:'Puesta a tierra', name:'Caja de inspección PVC para jabalina'},
  {cat:'Puesta a tierra', name:'Cable desnudo p/PAT 16mm²'},
  {cat:'Puesta a tierra', name:'Cable desnudo p/PAT 25mm²'},
  {cat:'Puesta a tierra', name:'Soldadura exotérmica (cartucho)'},
  {cat:'Puesta a tierra', name:'Bornera PAT 7 contactos (riel DIN)'},
  {cat:'Puesta a tierra', name:'Bornera PAT 12 contactos (riel DIN)'},

  // Tableros
  {cat:'Tableros', name:'Tablero de embutir 1x8 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x12 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x18 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x24 módulos'},
  {cat:'Tableros', name:'Tablero de embutir 1x36 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x8 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x12 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x18 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x24 módulos'},
  {cat:'Tableros', name:'Tablero de aplicar 1x36 módulos'},
  {cat:'Tableros', name:'Riel DIN 35mm'},
  {cat:'Tableros', name:'Peine de distribución monofásico (bipolar)'},
  {cat:'Tableros', name:'Peine de distribución trifásico (tetrapolar)'},

  // Gabinetes
  {cat:'Gabinetes', name:'Gabinete metálico IP54 (chico)'},
  {cat:'Gabinetes', name:'Gabinete metálico IP54 (mediano)'},
  {cat:'Gabinetes', name:'Gabinete metálico IP54 (grande)'},
  {cat:'Gabinetes', name:'Gabinete de PVC IP65'},
  {cat:'Gabinetes', name:'Gabinete para medidor (caja de toma)'},
  {cat:'Gabinetes', name:'Placa de montaje para gabinete'},

  // Contactores y relés
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

  // Transformadores
  {cat:'Transformadores', name:'Transformador de comando 220V/24V'},
  {cat:'Transformadores', name:'Transformador de comando 220V/12V'},
  {cat:'Transformadores', name:'Fuente conmutada (switching) 220V/24V'},
  {cat:'Transformadores', name:'Fuente conmutada (switching) 220V/12V'},

  // Señalización y comando
  {cat:'Señalización y comando', name:'Baliza / señalizador luminoso'},
  {cat:'Señalización y comando', name:'Piloto/luz indicadora (verde/rojo)'},
  {cat:'Señalización y comando', name:'Pulsador de comando (marcha/paro)'},
  {cat:'Señalización y comando', name:'Selector de comando (2 o 3 posiciones)'},
  {cat:'Señalización y comando', name:'Seta de emergencia'},
  {cat:'Señalización y comando', name:'Buzzer/sirena de señalización'},

  // Protecciones
  {cat:'Protecciones', name:'Térmica unipolar 10A curva C'},
  {cat:'Protecciones', name:'Térmica unipolar 16A curva C'},
  {cat:'Protecciones', name:'Térmica unipolar 20A curva C'},
  {cat:'Protecciones', name:'Térmica unipolar 25A curva C'},
  {cat:'Protecciones', name:'Térmica unipolar 32A curva C'},
  {cat:'Protecciones', name:'Térmica unipolar 40A curva C'},
  {cat:'Protecciones', name:'Térmica bipolar 10A curva C'},
  {cat:'Protecciones', name:'Térmica bipolar 16A curva C'},
  {cat:'Protecciones', name:'Térmica bipolar 20A curva C'},
  {cat:'Protecciones', name:'Térmica bipolar 25A curva C'},
  {cat:'Protecciones', name:'Térmica bipolar 32A curva C'},
  {cat:'Protecciones', name:'Térmica bipolar 40A curva C'},
  {cat:'Protecciones', name:'Térmica tripolar 16A curva C'},
  {cat:'Protecciones', name:'Térmica tripolar 20A curva C'},
  {cat:'Protecciones', name:'Térmica tripolar 25A curva C'},
  {cat:'Protecciones', name:'Térmica tripolar 32A curva C'},
  {cat:'Protecciones', name:'Térmica tripolar 40A curva C'},
  {cat:'Protecciones', name:'Térmica tetrapolar 16A curva C'},
  {cat:'Protecciones', name:'Térmica tetrapolar 20A curva C'},
  {cat:'Protecciones', name:'Térmica tetrapolar 25A curva C'},
  {cat:'Protecciones', name:'Térmica tetrapolar 32A curva C'},
  {cat:'Protecciones', name:'Térmica tetrapolar 40A curva C'},
  {cat:'Protecciones', name:'Térmica tetrapolar 63A curva C'},
  {cat:'Protecciones', name:'Disyuntor diferencial bipolar 25A 30mA'},
  {cat:'Protecciones', name:'Disyuntor diferencial bipolar 40A 30mA'},
  {cat:'Protecciones', name:'Disyuntor diferencial bipolar 63A 30mA'},
  {cat:'Protecciones', name:'Disyuntor diferencial tetrapolar 25A 30mA'},
  {cat:'Protecciones', name:'Disyuntor diferencial tetrapolar 40A 30mA'},
  {cat:'Protecciones', name:'Disyuntor diferencial tetrapolar 63A 30mA'},
  {cat:'Protecciones', name:'Protector contra sobretensión (DPS)'},
  {cat:'Protecciones', name:'Fusible tipo NH / cuchilla'},
  {cat:'Protecciones', name:'Base portafusible'},

  // Conductores
  {cat:'Conductores', name:'Cable unipolar 1,5mm² (por metro)'},
  {cat:'Conductores', name:'Cable unipolar 1,5mm² (rollo x100m)'},
  {cat:'Conductores', name:'Cable unipolar 2,5mm² (por metro)'},
  {cat:'Conductores', name:'Cable unipolar 2,5mm² (rollo x100m)'},
  {cat:'Conductores', name:'Cable unipolar 4mm² (por metro)'},
  {cat:'Conductores', name:'Cable unipolar 4mm² (rollo x100m)'},
  {cat:'Conductores', name:'Cable unipolar 6mm² (por metro)'},
  {cat:'Conductores', name:'Cable unipolar 6mm² (rollo x100m)'},
  {cat:'Conductores', name:'Cable unipolar 10mm² (por metro)'},
  {cat:'Conductores', name:'Cable unipolar 10mm² (rollo x100m)'},
  {cat:'Conductores', name:'Cable subterráneo (tetrapolar)'},
  {cat:'Conductores', name:'Cable tipo taller (bipolar)'},

  // Terminales y punteras
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

  // Accesorios y terminación
  {cat:'Accesorios y terminación', name:'Tomacorriente simple con tapa'},
  {cat:'Accesorios y terminación', name:'Tomacorriente doble con tapa'},
  {cat:'Accesorios y terminación', name:'Interruptor de luz simple'},
  {cat:'Accesorios y terminación', name:'Interruptor combinación (9 puntos)'},
  {cat:'Accesorios y terminación', name:'Módulo/tecla ciega'},
  {cat:'Accesorios y terminación', name:'Ficha/enchufe macho'},
  {cat:'Accesorios y terminación', name:'Ficha/enchufe hembra'},
  {cat:'Accesorios y terminación', name:'Portalámparas'},
  {cat:'Accesorios y terminación', name:'Cinta aisladora'},
  {cat:'Accesorios y terminación', name:'Precinto plástico'},
  {cat:'Accesorios y terminación', name:'Terminal a compresión'},
  {cat:'Accesorios y terminación', name:'Bandeja portacable metálica (tramo)'},

  // Conjuntos (módulos combinados)
  {cat:'Conjuntos', name:'Conjunto 1 punto'},
  {cat:'Conjuntos', name:'Conjunto 1 toma'},
  {cat:'Conjuntos', name:'Conjunto 1 punto + 1 toma'},
  {cat:'Conjuntos', name:'Conjunto 2 puntos'},
  {cat:'Conjuntos', name:'Conjunto 2 tomas'},
  {cat:'Conjuntos', name:'Conjunto combinación (3 puntos)'},
  {cat:'Conjuntos', name:'Conjunto punto + toma + tecla'},
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

  const std = ls('pv_taskdesc');
  taskDescCat = std ? { ...DEFAULT_TASK_DESC, ...JSON.parse(std) } : { ...DEFAULT_TASK_DESC };

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
  renderDescCatSelect();

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
    if (remote.prices_updated_at) lsSetSilent('pv_prices_updated_at', remote.prices_updated_at);
    if (remote.taskDescCat) { taskDescCat = { ...DEFAULT_TASK_DESC, ...remote.taskDescCat }; lsSetSilent('pv_taskdesc', JSON.stringify(taskDescCat)); }

    applySettings(); renderCats(); renderTasks(); renderBudget();
    renderMats(); renderHistory(); updateTotal(); loadCfgUI(); updateDBStats(); renderDescCatSelect();
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
      prices_updated_at: ls('pv_prices_updated_at') || null,
      taskDescCat
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
  const idx = ['tareas','presupuesto','materiales','historial','config'].indexOf(tab);
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
    if (settings.includeDesc && taskDescCat[cat]) {
      html += `<div class="empty" style="padding:6px 10px;font-size:12px;text-align:left;">📝 ${taskDescCat[cat].replace(/</g,'&lt;')}</div>`;
    }
    items.forEach(({b,i,t}) => {
      const sub = t.price*b.qty;
      html += `<div class="budget-item">
        <div class="bi-info">
          <div class="bi-name">${t.name}</div>
          <div class="bi-price">${settings.hideUnit ? `× ${b.qty}` : `${fmt(t.price)} c/u · ${fmt(sub)}`}</div>
        </div>
        <div class="qty-wrap">
          <div class="qbtn" onclick="changeQty(${i},-1)">−</div>
          <div class="qval">${b.qty}</div>
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
        <span class="mat-nm">${m.name}</span>
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
  materials.push({name:v, checked:false});
  saveCurrentState(); inp.value=''; renderMats(); renderBudget();
  toast('Material agregado');
}
function toggleMat(i) { materials[i].checked=!materials[i].checked; saveCurrentState(); renderMats(); renderBudget(); }
function deleteMat(i) { materials.splice(i,1); saveCurrentState(); renderMats(); renderBudget(); }
function renderMats() {
  const el = document.getElementById('mat-list');
  if (!materials.length) { el.innerHTML='<div class="empty">Sin materiales todavía.</div>'; return; }
  el.innerHTML = materials.map((m,i)=>`
    <div class="mat-item${m.checked?' ck':''}">
      <input type="checkbox" onchange="toggleMat(${i})" ${m.checked?'checked':''}/>
      <span class="mat-nm">${m.name}</span>
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
  materials.push({name, checked:false});
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
      html += `<div style="font-size:13px;padding:4px 0;color:var(--muted);">${m.checked?'☑':'☐'} ${m.name}</div>`;
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
//  DESCRIPCIONES DE TAREA POR CATEGORÍA (editables por el usuario)
// ══════════════════════════════════════════════════════════
function renderDescCatSelect() {
  const sel = document.getElementById('desc-cat-select');
  if (!sel) return;
  const cats = [...new Set(tasks.map(t=>t.cat))].sort();
  sel.innerHTML = cats.map(c => `<option value="${c.replace(/"/g,'&quot;')}">${c}</option>`).join('');
  loadDescForCat();
}
function loadDescForCat() {
  const sel = document.getElementById('desc-cat-select');
  const txt = document.getElementById('desc-cat-text');
  if (!sel || !txt) return;
  txt.value = taskDescCat[sel.value] || '';
}
function saveDescForCat() {
  const sel = document.getElementById('desc-cat-select');
  const txt = document.getElementById('desc-cat-text');
  if (!sel || !txt) return;
  taskDescCat[sel.value] = txt.value;
  lsSet('pv_taskdesc', JSON.stringify(taskDescCat));
  renderBudget();
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
  renderCats(); renderTasks(); updateDBStats(); renderDescCatSelect();
  document.getElementById('import-text').value='';
  toast(`✅ ${newOnes.length} tareas importadas`);
}

function confirmReset() {
  if (!confirm('¿Restaurar la base de datos original? Se perderán las tareas importadas.')) return;
  tasks = BUILTIN.map((t,i)=>({...t,id:i}));
  lsSet('pv_tasks', JSON.stringify(tasks));
  activeCat='Todos'; renderCats(); renderTasks(); updateDBStats(); renderDescCatSelect();
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

    renderCats(); renderTasks(); renderBudget(); updateDBStats(); renderDescCatSelect();
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
    if (settings.includeDesc && taskDescCat[cat]) {
      itemsHTML += `<div style="font-size:11px;color:#9aa0b5;font-family:'Barlow',sans-serif;line-height:1.5;margin-bottom:7px;padding:7px 10px;background:#171a24;border-left:3px solid #f5c518;border-radius:4px;">📝 ${taskDescCat[cat]}</div>`;
    }
    items.forEach(({b,t}) => {
      const sub = t.price*b.qty;
      itemsHTML += `
        <div style="background:#1e2230;border:1px solid #2a2f3e;border-radius:7px;padding:9px 13px;margin-bottom:4px;display:flex;justify-content:space-between;align-items:center;">
          <div style="flex:1;min-width:0;">
            <div style="font-size:13px;font-weight:600;font-family:'Barlow',sans-serif;color:#e8eaf0;">${t.name}</div>
            <div style="font-size:11px;color:#7a8099;font-family:'Barlow',sans-serif;">${settings.hideUnit ? `Cant: ${b.qty}` : `${fmt(t.price)} × ${b.qty}`}</div>
          </div>
          <div style="font-family:'Barlow Condensed',sans-serif;font-size:15px;font-weight:700;color:#f5c518;white-space:nowrap;margin-left:10px;">${fmt(sub)}</div>
        </div>`;
    });
  }

  let matsHTML = '';
  if (settings.showMats && materials.length) {
    matsHTML = `<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:2px;color:#7a8099;margin:15px 0 5px;font-family:'Barlow Condensed',sans-serif;">Materiales a comprar</div>`;
    materials.forEach(m => {
      matsHTML += `<div style="background:#1e2230;border:1px solid #2a2f3e;border-radius:7px;padding:7px 13px;margin-bottom:3px;font-size:12px;font-family:'Barlow',sans-serif;color:${m.checked?'#7a8099':'#e8eaf0'};${m.checked?'text-decoration:line-through;':''}">${m.checked?'☑':'☐'} ${m.name}</div>`;
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
      document.getElementById('wa-img').src = canvas.toDataURL('image/png');
      document.getElementById('wa-modal').classList.remove('hidden');
    }).catch(() => toast('Error al generar imagen','error'));
  }, 160);
}

function downloadWA() {
  const img = document.getElementById('wa-img');
  if (!img.src || img.src===window.location.href) return;
  const a=document.createElement('a'); a.href=img.src;
  a.download='presupuesto-patagonia-volt.png'; a.click();
  toast('✅ Imagen descargada');
}

// ══════════════════════════════════════════════════════════
//  SERVICE WORKER REGISTRATION
// ══════════════════════════════════════════════════════════
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('SW registrado'))
      .catch(e => console.log('SW error:', e));
  });
}

// ══════════════════════════════════════════════════════════
//  BOOT
// ══════════════════════════════════════════════════════════
init();
