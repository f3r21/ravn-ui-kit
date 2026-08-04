# @ravn/ui-kit

UI Kit independiente, accesible y reutilizable creado con **React 19, TypeScript, Tailwind CSS v4, React Aria Hooks y Storybook**.

---

## 🚀 Instalación y Uso en tus Proyectos

### 1. Instalación de la librería
```bash
npm install @ravn/ui-kit
```

### 2. Importar los Tokens de Diseño y Estilos
En el punto de entrada de tu aplicación frontend (ej. `src/main.tsx` o `src/index.css`), importa el archivo de tema:

```tsx
import '@ravn/ui-kit/theme.css';
```

### 3. Usar los Componentes en tu Código

```tsx
import { Button, Input, Card, Badge } from '@ravn/ui-kit';

export function UserForm() {
  return (
    <Card className="max-w-md mx-auto flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-text-main">Registro de Usuario</h2>
        <Badge variant="success">Activo</Badge>
      </div>

      <Input label="Correo Electrónico" placeholder="usuario@ravn.co" />

      <Button variant="primary" size="md" onPress={() => alert('Guardado')}>
        Guardar Usuario
      </Button>
    </Card>
  );
}
```

---

## 🛠️ Comandos de Desarrollo

```bash
npm run dev           # Iniciar entorno interactivo de Storybook (http://localhost:6006)
npm run build         # Compilar bundle de librería (ESM + d.ts) en dist/
npm run typecheck     # Verificación de tipos TypeScript
npm run test          # Ejecutar pruebas unitarias con Vitest
```

---

## 🎨 Arquitectura de Design Tokens (Tailwind v4)

Los tokens de diseño están centralizados en `src/styles/theme.css` utilizando la directiva `@theme` de Tailwind v4:

- `--color-primary`: Color de marca principal.
- `--color-surface-neutral`: Fondo secundario/superficies.
- `--color-text-main` / `--color-text-muted`: Jerarquía de color de texto.
- `--radius-button` / `--radius-card`: Radios de borde estandarizados.
