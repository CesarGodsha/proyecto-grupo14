const COLOR = { registrado: 'gris', confirmada: 'verde', atendido: 'verde', rechazado: 'rojo' };

export default function Estado({ valor }) {
  return <span className={`estado ${COLOR[valor] || 'azul'}`}>{valor}</span>;
}
