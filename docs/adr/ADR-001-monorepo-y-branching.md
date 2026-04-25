# ADR-001: Monorepo y estrategia de branching

## Estado
Aceptado

## Contexto
El proyecto requiere trazabilidad completa desde cambios de código hasta despliegues, releases y rollback.

## Decisión
Se utilizará un monorepo llamado `scm-ops-blueprint` con la siguiente estructura:
- `api/`
- `web/`
- `db/`
- `ops/`
- `docs/`
- `evidence/`

La rama principal será `main` y estará protegida.
Todo cambio deberá entrar mediante Pull Request desde ramas cortas:
- `feature/...`
- `fix/...`
- `docs/...`
- `chore/...`

## Consecuencias
### Ventajas
- Trazabilidad unificada
- Menor complejidad para la materia
- Facilita releases y evidencias

### Desventajas
- Requiere disciplina en organización y CI