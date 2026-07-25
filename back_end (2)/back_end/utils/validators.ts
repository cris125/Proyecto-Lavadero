export function validarEntrada(texto: string): boolean {
  if (!texto || texto.trim().length === 0) {
    return false;
  }

  const caracteresProhibidos = /['"`;\\]/;
  const patronesSQL = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|UNION|OR|AND)\b/i;
  const comentarios = /(--|\/\*|\*\/)/;

  return !(
    caracteresProhibidos.test(texto) ||
    patronesSQL.test(texto) ||
    comentarios.test(texto)
  );
}

export function validarContrasena(contrasena: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-+=])[A-Za-z\d@$!%*?&.#_\-+=]{8,}$/;
  return regex.test(contrasena);
}

export function validarTelefono(telefono: string): boolean {
  return /^\d{10}$/.test(telefono);
}

export function validarEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
