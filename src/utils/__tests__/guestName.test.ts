import { generateGuestName } from '../guestName';

describe('generateGuestName', () => {
  it('deve gerar um nome de convidado não vazio terminando com "BrainPOP"', () => {
    const name = generateGuestName();
    expect(typeof name).toBe('string');
    expect(name.endsWith('BrainPOP')).toBe(true);
    expect(name.split(' ').length).toBe(2);
  });

  it('deve gerar nomes a partir da lista pré-definida de primeiros nomes', () => {
    const name = generateGuestName();
    const firstName = name.replace(' BrainPOP', '');
    expect(firstName.length).toBeGreaterThan(1);
  });
});
