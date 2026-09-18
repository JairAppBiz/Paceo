// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { initializeUserTiers, CATEGORIES } from "@/app/api/utils/tierHelpers";

/**
 * One-time migration endpoint to initialize tier system for existing users
 * Protected by secret key
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Protect with secret key
    if (secret !== process.env.MIGRATION_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const migrationResults = {
      usersInitialized: 0,
      tiersCreated: 0,
      errors: [],
    };

    // Get all existing users
    const users = await sql`
      SELECT id, username, city, state, country 
      FROM users
    `;

    console.log(`Found ${users.length} users to migrate`);

    for (const user of users) {
      try {
        // Check if user already has tiers
        const existingTiers = await sql`
          SELECT COUNT(*) as count
          FROM user_tiers
          WHERE user_id = ${user.id}
        `;

        if (existingTiers[0].count > 0) {
          console.log(`User ${user.id} already has tiers, skipping...`);
          continue;
        }

        // Initialize tiers for user (all categories start at City Scout)
        const tiersCreated = await initializeUserTiers(user.id);

        migrationResults.usersInitialized++;
        migrationResults.tiersCreated += tiersCreated.length;

        console.log(
          `Initialized ${tiersCreated.length} tiers for user ${user.id} (${user.username})`,
        );

        // Note users without location data
        if (!user.city || !user.state || !user.country) {
          migrationResults.errors.push({
            userId: user.id,
            username: user.username,
            issue: "Missing location data",
            hasCity: !!user.city,
            hasState: !!user.state,
            hasCountry: !!user.country,
          });
        }
      } catch (error) {
        console.error(`Error migrating user ${user.id}:`, error);
        migrationResults.errors.push({
          userId: user.id,
          username: user.username,
          error: error.message,
        });
      }
    }

    return Response.json({
      success: true,
      message: "Migration completed",
      results: migrationResults,
    });
  } catch (error) {
    console.error("Migration error:", error);
    return Response.json(
      { error: "Migration failed", details: error.message },
      { status: 500 },
    );
  }
}
