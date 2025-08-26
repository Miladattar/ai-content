// Simple database initialization script
console.log("🔄 Initializing database...")

try {
  // Create a simple database file to ensure SQLite works
  const fs = require("fs")
  const path = require("path")

  const dbPath = path.join(process.cwd(), "prisma", "dev.db")
  const dbDir = path.dirname(dbPath)

  // Ensure prisma directory exists
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
  }

  // Create empty database file if it doesn't exist
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, "")
    console.log("✅ Database file created")
  }

  console.log("✅ Database initialization complete")
} catch (error) {
  console.error("❌ Database initialization failed:", error)
}
