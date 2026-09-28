const FIRST_NAMES = [
  'Manu', 'Lucas', 'Bia', 'Leo', 'Theo', 'Maya', 'Enzo', 'Gabi',
  'Davi', 'Nina', 'Rafa', 'Noah', 'Lara', 'Alex', 'Luna', 'Sam',
  'Zack', 'Mia', 'Kaue', 'Yuri', 'Felipe', 'Sara', 'Caio', 'Livia',
  'Bruno', 'Mel', 'Tom', 'Sofia', 'Ian', 'Alice', 'Pedro', 'Clara',
  'Hugo', 'Elena', 'Max', 'Iris', 'Vitor', 'Bella', 'Otavio', 'Julia',
  'Arthur', 'Laura', 'Gabriel', 'Valentina', 'Heitor', 'Helena',
  'Bernardo', 'Luiza', 'Samuel', 'Lorena', 'Diego', 'Camila',
  'Mariana', 'Tiago', 'Bruna', 'Renan', 'Mari', 'Joao', 'Natalia'
];

/**
 * Gera um nome aleatório com primeiro nome variado e o sobrenome fixo "Caos".
 * Exemplo: "Manu Caos", "Lucas Caos", "Bia Caos"
 */
export function generateGuestName(): string {
  const randomIndex = Math.floor(Math.random() * FIRST_NAMES.length);
  const firstName = FIRST_NAMES[randomIndex];
  return `${firstName} BrainPOP`;
}
