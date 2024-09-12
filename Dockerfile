FROM denoland/deno:distroless

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

EXPOSE 8000

WORKDIR /app

# USER deno

COPY . .

RUN deno install --entrypoint pkg/main/main.ts

ENTRYPOINT []
CMD ["deno", "task", "start"]
