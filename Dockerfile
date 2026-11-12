# ==========================================
# Etapa 1: Dependencias
# ==========================================
FROM oven/bun:1-alpine AS dependencies

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install --frozen-lockfile

# ==========================================
# Etapa 2: Construcción (Build)
# ==========================================
FROM oven/bun:1-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

# Argumento para la URL de la API en tiempo de compilación (Next.js inyecta NEXT_PUBLIC_* en el cliente)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN bun run build

# ==========================================
# Etapa 3: Imagen de Producción (Runner)
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

# Crear usuario sin privilegios por seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copiar archivos generados por standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3001

CMD ["node", "server.js"]

