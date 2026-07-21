export interface IFirstAidGuide {
  id: string;
  titleEn: string;
  titleEs: string;
  stepsEn: string[];
  stepsEs: string[];
}

export const FIRST_AID_GUIDES: IFirstAidGuide[] = [
  {
    id: 'choking',
    titleEn: 'Choking',
    titleEs: 'Atragantamiento',
    stepsEn: [
      'Ask the person if they are choking.',
      'Stand behind the person and wrap your arms around their waist.',
      'Make a fist with one hand and place it above the navel.',
      'Grasp the fist with your other hand.',
      'Perform quick upward thrusts.',
      'Repeat until the object is expelled.',
      'Call emergency services if the person becomes unconscious.',
    ],
    stepsEs: [
      'Pregunte a la persona si se está ahogando.',
      'Colóquese detrás de la persona y rodee su cintura con los brazos.',
      'Haga un puño con una mano y colóquelo sobre el ombligo.',
      'Agarre el puño con la otra mano.',
      'Realice compresiones rápidas hacia arriba.',
      'Repita hasta que el objeto sea expulsado.',
      'Llame a servicios de emergencia si la persona pierde el conocimiento.',
    ],
  },
  {
    id: 'bleeding',
    titleEn: 'Severe Bleeding',
    titleEs: 'Sangrado Severo',
    stepsEn: [
      'Apply direct pressure with a clean cloth.',
      'Do not remove the cloth if it soaks through — add more layers.',
      'Keep the injured area elevated above the heart if possible.',
      'Apply a tourniquet above the wound only as a last resort.',
      'Call emergency services immediately.',
      'Keep the person calm and still.',
    ],
    stepsEs: [
      'Aplique presión directa con un paño limpio.',
      'No retire el paño si se empapa — agregue más capas.',
      'Mantenga el área lesionada elevada por encima del corazón si es posible.',
      'Aplique un torniquete por encima de la herida solo como último recurso.',
      'Llame a servicios de emergencia inmediatamente.',
      'Mantenga a la persona calmada e inmóvil.',
    ],
  },
  {
    id: 'burns',
    titleEn: 'Burns',
    titleEs: 'Quemaduras',
    stepsEn: [
      'Cool the burn under cool running water for at least 10 minutes.',
      'Do NOT use ice, butter, or ointments.',
      'Remove clothing and jewelry near the burn unless stuck to skin.',
      'Cover with a sterile non-stick dressing.',
      'Do not pop blisters.',
      'Seek medical attention for severe burns.',
    ],
    stepsEs: [
      'Enfríe la quemadura bajo agua corriente fresca durante al menos 10 minutos.',
      'NO use hielo, mantequilla ni ungüentos.',
      'Retire ropa y joyas cerca de la quemadura a menos que estén pegadas.',
      'Cubra con un vendaje estéril antiadherente.',
      'No reviente las ampollas.',
      'Busque atención médica para quemaduras graves.',
    ],
  },
  {
    id: 'cpr',
    titleEn: 'CPR (Adult)',
    titleEs: 'RCP (Adulto)',
    stepsEn: [
      'Check for responsiveness — tap and shout.',
      'Call emergency services.',
      'Place the person on a firm flat surface.',
      'Place the heel of one hand on the center of the chest.',
      'Place your other hand on top and interlock fingers.',
      'Push hard and fast — at least 2 inches deep, 100-120 compressions per minute.',
      'Give 2 rescue breaths after every 30 compressions (if trained).',
      'Continue until help arrives or the person recovers.',
    ],
    stepsEs: [
      'Verifique si responde — toque y grite.',
      'Llame a servicios de emergencia.',
      'Coloque a la persona en una superficie firme y plana.',
      'Coloque la base de una mano en el centro del pecho.',
      'Coloque la otra mano encima y entrelace los dedos.',
      'Presione fuerte y rápido — al menos 5 cm de profundidad, 100-120 compresiones por minuto.',
      'Dé 2 respiraciones de rescate después de cada 30 compresiones (si está entrenado).',
      'Continúe hasta que llegue la ayuda o la persona se recupere.',
    ],
  },
  {
    id: 'fracture',
    titleEn: 'Fractures',
    titleEs: 'Fracturas',
    stepsEn: [
      'Do not move the injured limb.',
      'Immobilize the area above and below the fracture.',
      'Apply ice wrapped in cloth to reduce swelling.',
      'Do not try to straighten the bone.',
      'Call emergency services for severe fractures.',
      'Monitor for signs of shock.',
    ],
    stepsEs: [
      'No mueva la extremidad lesionada.',
      'Inmovilice el área por encima y por debajo de la fractura.',
      'Aplique hielo envuelto en tela para reducir la hinchazón.',
      'No intente enderezar el hueso.',
      'Llame a servicios de emergencia para fracturas graves.',
      'Monitoree signos de shock.',
    ],
  },
];
