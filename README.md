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
        <h2 className="text-lg font-bold text-neutral-5">Registro de Usuario</h2>
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

## Design Tokens Architecture (Tailwind v4)

Design tokens are centralized in `src/styles/theme.css` via Tailwind v4's `@theme`
directive, as raw numbered ramps (no semantic aliases yet):

- `--color-neutral-1` … `--color-neutral-5`
- `--color-primary-1` … `--color-primary-4`
- `--color-secondary-1` … `--color-secondary-4`
- `--color-tertiary-1` … `--color-tertiary-4`
- `--color-success-1` … `--color-success-4`
- `--color-warning-1` … `--color-warning-6`
- `--color-danger-1` … `--color-danger-6`
- `--color-transparent-light-*` / `--color-transparent-dark-*` (overlay opacities)
- `--font-sans` (verified against real Figma component exports as `'SF Pro Display'`)
- `--radius-sm` / `--radius-md` / `--radius-lg` / `--radius-xl` / `--radius-full`

See **Design Tokens → Colors** and **Design Tokens → Typography** in Storybook
for a rendered reference. Semantic aliases (e.g. `text-main`, `surface-neutral`)
are planned once Figma confirms which ramp step each semantic role maps to —
see the "Figma-gated fidelity pass" tracked internally for this library.
