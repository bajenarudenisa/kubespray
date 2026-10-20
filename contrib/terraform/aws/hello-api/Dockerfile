FROM node:22-alpine

ENV NODE_ENV=production
ENV PORT=8989
WORKDIR /app

COPY --chown=node:node package.json server.js ./
USER node

EXPOSE 8989
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD ["node", "-e", "fetch('http://127.0.0.1:8989/health').then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
