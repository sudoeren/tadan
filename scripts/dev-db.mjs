import { execSync } from "node:child_process"
import { existsSync, readdirSync } from "node:fs"
import net from "node:net"
import os from "node:os"

const COMPOSE = ["docker", "compose"]
const SERVICE = "db"
const CONTAINER_NAME = "tadan-db"
const DB_PORT = 5432
const READY_TIMEOUT_MS = 60_000

const isTTY = process.stdout.isTTY && !process.env.NO_COLOR
const c = {
  reset: isTTY ? "\x1b[0m" : "",
  bold: isTTY ? "\x1b[1m" : "",
  dim: isTTY ? "\x1b[2m" : "",
  cyan: isTTY ? "\x1b[36m" : "",
  green: isTTY ? "\x1b[32m" : "",
  yellow: isTTY ? "\x1b[33m" : "",
  red: isTTY ? "\x1b[31m" : "",
  gray: isTTY ? "\x1b[90m" : "",
  blue: isTTY ? "\x1b[34m" : "",
}

function run(cmd, opts = {}) {
  try {
    return execSync(cmd, { stdio: "pipe", encoding: "utf-8", ...opts })
  } catch {
    return null
  }
}

function getDockerVersion() {
  return run("docker --version")?.trim() || null
}

function getDockerInfo() {
  return run("docker info --format '{{.ServerVersion}}|{{.OS}}'")?.trim() || null
}

function isContainerRunning() {
  const out = run(
    `docker ps --filter name=${CONTAINER_NAME} --format "{{.Names}}"`
  )
  return out?.trim() === CONTAINER_NAME
}

function getContainerStatus() {
  const out = run(
    `docker ps -a --filter name=${CONTAINER_NAME} --format "{{.Names}}|{{.Status}}|{{.State}}"`
  )
  if (!out) return null
  const [name, status, state] = out.trim().split("|")
  return { name, status, state }
}

function isPortOpen(host, port, timeoutMs = 1500) {
  return new Promise((resolve) => {
    const socket = new net.Socket()
    const done = () => {
      socket.destroy()
      resolve(true)
    }
    socket.setTimeout(timeoutMs)
    socket.once("connect", done)
    socket.once("error", () => resolve(false))
    socket.once("timeout", () => resolve(false))
    socket.connect(port, host)
  })
}

function getMigrationFiles() {
  if (!existsSync("drizzle")) return []
  return readdirSync("drizzle")
    .filter((f) => f.endsWith(".sql"))
    .sort()
}

function getDrizzleVersion() {
  try {
    return execSync("bunx drizzle-kit --version", { stdio: "pipe" })
      .toString()
      .trim()
      .split("\n")[0]
  } catch {
    return null
  }
}

async function waitForDb() {
  const start = Date.now()
  let attempts = 0
  while (Date.now() - start < READY_TIMEOUT_MS) {
    attempts++
    if (await isPortOpen("127.0.0.1", DB_PORT)) {
      return { ok: true, ms: Date.now() - start, attempts }
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  return { ok: false, ms: Date.now() - start, attempts }
}

function fmtMs(ms) {
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

function header(title) {
  const line = "─".repeat(50)
  console.log(`${c.cyan}${line}`)
  console.log(`${c.bold} ${title}${c.reset}`)
  console.log(`${c.cyan}${line}${c.reset}`)
}

function step(icon, label, detail = "") {
  const time = new Date().toLocaleTimeString("en-US", { hour12: false })
  const detailPart = detail ? ` ${c.dim}${detail}${c.reset}` : ""
  console.log(`${c.cyan}[${time}]${c.reset} ${icon} ${label}${detailPart}`)
}

function ok(label, ms) {
  const msPart = ms != null ? ` ${c.dim}(${fmtMs(ms)})${c.reset}` : ""
  console.log(`${c.green}  ✓${c.reset} ${label}${msPart}`)
}

function fail(label, hint) {
  console.log(`${c.red}  ✗${c.reset} ${label}`)
  if (hint) console.log(`${c.dim}    ${hint}${c.reset}`)
}

async function main() {
  const t0 = Date.now()
  console.log("")
  header("tadan dev-db")
  console.log(`${c.dim}  ${os.platform()} ${os.arch()} · node ${process.version}${c.reset}`)
  const dockerVer = getDockerVersion()
  if (dockerVer) {
    console.log(`${c.dim}  ${dockerVer}${c.reset}`)
  } else {
    fail("docker not found", "install Docker Desktop or docker engine")
    process.exit(1)
  }
  const dockerInfo = getDockerInfo()
  if (dockerInfo) {
    const [ver, os] = dockerInfo.split("|")
    console.log(`${c.dim}  daemon ${ver} on ${os}${c.reset}`)
  }
  console.log("")

  // Step 1: container
  step("●", "checking container", `${CONTAINER_NAME}`)
  const status = getContainerStatus()

  if (isContainerRunning()) {
    ok(`container already running`)
  } else if (status?.state === "exited" || status?.state === "stopped") {
    step("●", "starting stopped container", status.status)
    const t = Date.now()
    try {
      execSync(`${COMPOSE.join(" ")} start ${SERVICE}`, { stdio: "inherit" })
      ok(`container started`, Date.now() - t)
    } catch {
      fail("failed to start container", "is docker daemon running?")
      process.exit(1)
    }
  } else {
    step("●", "creating + starting container", `service: ${SERVICE}`)
    const t = Date.now()
    try {
      execSync(`${COMPOSE.join(" ")} up -d ${SERVICE}`, { stdio: "inherit" })
      ok(`container up`, Date.now() - t)
    } catch {
      fail("failed to start container", "is docker daemon running?")
      process.exit(1)
    }
  }

  // Step 2: port wait
  step("●", "waiting for postgres", `127.0.0.1:${DB_PORT}`)
  const port = await waitForDb()
  if (!port.ok) {
    fail(
      `postgres not ready in ${fmtMs(READY_TIMEOUT_MS)}`,
      `${port.attempts} attempts — check docker logs: docker logs ${CONTAINER_NAME}`
    )
    process.exit(1)
  }
  ok(`postgres accepting connections`, port.ms)

  // Step 3: migrations
  console.log("")
  step("●", "checking migrations", "drizzle/")

  const migrations = getMigrationFiles()
  const drizzleVer = getDrizzleVersion()

  if (migrations.length === 0) {
    step("○", "no migrations found", "generating from schema")
    const t = Date.now()
    try {
      execSync("bunx drizzle-kit generate", { stdio: "inherit" })
      const after = getMigrationFiles()
      ok(`generated ${after.length} migration${after.length === 1 ? "" : "s"}`, Date.now() - t)
    } catch {
      fail("failed to generate migrations", "check schema.ts for errors")
      process.exit(1)
    }
  } else {
    ok(`${migrations.length} migration${migrations.length === 1 ? "" : "s"} on disk`)
    migrations.forEach((m) => {
      console.log(`${c.dim}      · ${m}${c.reset}`)
    })
    if (drizzleVer) {
      console.log(`${c.dim}      ${drizzleVer}${c.reset}`)
    }
  }

  // Step 4: hints
  console.log("")
  header("ready")
  console.log(`${c.green}  ✓${c.reset} database ready in ${c.bold}${fmtMs(Date.now() - t0)}${c.reset}`)
  console.log("")
  console.log(`${c.dim}  next:${c.reset}`)
  console.log(`${c.dim}    · on first volume boot, init script applies migrations via docker/initdb/00-setup.sh${c.reset}`)
  console.log(`${c.dim}    · if column is missing on an existing volume, run: bun run db:reset${c.reset}`)
  console.log(`${c.dim}    · to inspect data: bun run db:studio${c.reset}`)
  console.log(`${c.dim}    · to rebuild: docker compose down -v && bun run db:up${c.reset}`)
  console.log("")
}

main().catch((err) => {
  console.error(`${c.red}[tadan-dev-db] ${err.message || err}${c.reset}`)
  process.exit(1)
})
