# Deploying to Northflank (free plan) with Turso

The Northflank free plan gives one container with **no persistent disk**: anything written to
the container filesystem is lost on every redeploy or restart. So in production the forum
stores its data in **Turso** (hosted libSQL / SQLite), and the container only runs the Go binary.

How the app picks its database:

| `TURSO_DATABASE_URL` | Database used |
| --- | --- |
| set | Turso, through the `libsql` driver (`TURSO_DATABASE_URL?authToken=TURSO_AUTH_TOKEN`) |
| not set | local SQLite file `app.db` in the project root (local dev, unchanged) |

On every startup the app runs `backend/internal/database/database.sql`. It only uses
`CREATE TABLE IF NOT EXISTS` and inserts the categories only when the `category` table is
empty, so it creates the schema in an empty Turso database and does nothing on later starts.

---

## 1. Create the Turso database

1. Sign in at <https://app.turso.tech> (GitHub login works).
2. **Databases → Create Database**.
   - Name: e.g. `real-time-forum`
   - Group / location: pick the region closest to your Northflank region
     (e.g. Europe for `europe-west`).
3. Open the new database. Copy the **URL**. It looks like:
   ```
   libsql://real-time-forum-<your-org>.turso.io
   ```
   This is `TURSO_DATABASE_URL`.
4. On the same page, click **Create Token** (or **Generate Token**):
   - Expiration: **Never** (or a long expiry you will remember to rotate)
   - Access: **Read & Write**
   
   Copy the token. Turso shows it only once. This is `TURSO_AUTH_TOKEN`.

You don't need to create any tables. The app does it on first start.

> CLI alternative: `turso db create real-time-forum`, `turso db show real-time-forum --url`,
> `turso db tokens create real-time-forum`.

---

## 2. Create the Northflank service

1. Push the repository to GitHub/GitLab/Bitbucket and connect that account in Northflank
   (**Account settings → Git**).
2. In your project: **Create new → Service → Combined service** (build + deploy in one).
3. **Repository**: select this repo and the branch to deploy (e.g. `main`).
4. **Build options**: choose **Dockerfile**
   - Build context: `/`
   - Dockerfile location: `/Dockerfile`
5. **Networking → Ports**:
   - Port `3333`, protocol **HTTP**, **Publicly expose** ✔

   Northflank terminates HTTPS and proxies WebSockets, so the site is served at
   `https://<service>--<project>-<id>.code.run` and the chat connects with `wss://…/ws`
   automatically.
6. **Resources**: plan **nf-compute-10** (the free tier). Keep **1 instance**: the chat hub
   lives in memory, so all users must hit the same container.
7. **Environment variables** (mark the token as secret, or put both in a Secret group):

   | Key | Value |
   | --- | --- |
   | `TURSO_DATABASE_URL` | `libsql://real-time-forum-<your-org>.turso.io` |
   | `TURSO_AUTH_TOKEN` | the token from step 1 |

   You don't need `PORT` or `APP_ROOT`. The Dockerfile sets `PORT=3333` and `APP_ROOT=/app`.
8. **Create service**. Northflank builds the image and deploys it. Later pushes to the branch
   rebuild and redeploy automatically (CI is on by default).

Open the public URL. `/` redirects to `/space`.

---

## 3. Checking logs

- **Build logs**: service → **Builds** → click a build. Use these when the Docker build fails
  (for example, a cgo / `go-sqlite3` compile error).
- **Runtime logs**: service → **Logs** (or **Observe → Logs**). A healthy start shows:
  ```
  Using Turso (libSQL) database
  Server running at http://localhost:3333/space
  ```
  If you see `Using local SQLite database /app/app.db` instead, `TURSO_DATABASE_URL` is not
  set and the data **will be lost on the next deploy**.
- **Metrics**: service → **Metrics** shows memory/CPU. Stay under the plan's RAM limit.
- Common startup errors:
  - `failed to connect to database` means a wrong URL or an expired or invalid token.
  - `failed to read SQL file` means the image is missing
    `backend/internal/database/database.sql`. Check the Dockerfile / `.dockerignore`.

---

## Local development (unchanged)

```sh
cd backend/cmd
go run .
# http://localhost:3333/space   (uses ./app.db in the project root)
```

Optional env vars: `PORT` (default `3333`), `APP_ROOT` (default `../..`, relative to `backend/cmd`),
and `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN` if you want to test against Turso locally.

Test the production image locally:

```sh
docker build -t forum .
docker run --rm -p 3333:3333 \
  -e TURSO_DATABASE_URL=libsql://... -e TURSO_AUTH_TOKEN=... forum
```
