export default function validarEntrada(texto: string): boolean {
            if (!texto || texto.trim().length === 0) {
                return false;
            }

            // Caracteres peligrosos
            const caracteresProhibidos = /['"`;\\]/;

            // Palabras comunes en ataques SQL
            const patronesSQL = /\b(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE|UNION|OR|AND)\b/i;

            // Comentarios SQL
            const comentarios = /(--|\/\*|\*\/)/;

            return !(
                caracteresProhibidos.test(texto) ||
                patronesSQL.test(texto) ||
                comentarios.test(texto)
            );
        }