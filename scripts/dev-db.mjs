import { execSync, spawn } from "node:child_process"
import { existsSync } from "node:fs"
import net from "node:net"

const COMPOSE = ["docker", "compose"]
const SERVICE = "db"
const DB_PORT = 5432
const READY_TIMEOUT_MS = 60_000

function run(cmd, opts = {}) {
	try {
		return execSync(cmd, { stdio: "pipe", encoding: "utf-8", ...opts })
	} catch (err) {
		return null
	}
}

function isContainerRunning() {
	const out = run(`docker ps --filter name=tadan-db --format "{{.Names}}"`)
	return out?.trim() === "tadan-db"
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

function hasMigrations() {
	if (!existsSync("drizzle")) return false
	return run("dir /b drizzle\\*.sql 2>nul || ls drizzle/*.sql 2>/dev/null")
}

async function waitForDb() {
	const start = Date.now()
	while (Date.now() - start < READY_TIMEOUT_MS) {
		if (await isPortOpen("127.0.0.1", DB_PORT)) return true
		await new Promise((r) => setTimeout(r, 500))
	}
	return false
}

async function main() {
	if (!isContainerRunning()) {
		console.log("[db] starting postgres container...")
		try {
			execSync(`${COMPOSE.join(" ")} up -d ${SERVICE}`, { stdio: "inherit" })
		} catch (err) {
			console.error("[db] failed to start container. is docker running?")
			process.exit(1)
		}
	}

	if (!(await waitForDb())) {
		console.error("[db] postgres did not become ready in time")
		process.exit(1)
	}

	if (!hasMigrations()) {
		console.log("[db] no migrations found, generating...")
		execSync("bunx drizzle-kit generate", { stdio: "inherit" })
	}

	console.log("[db] ready.")
}

main().catch((err) => {
	console.error(err)
	process.exit(1)
})
