// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    const body = await request.json();
    const { usersCount = 20, city = "San Francisco" } = body;

    // First, check current user to get their location
    const currentUserResult = await sql`
      SELECT id, city, state, country FROM users ORDER BY id DESC LIMIT 1
    `;

    const currentUser = currentUserResult[0];
    const testCity = currentUser?.city || city;
    const testState = currentUser?.state || "California";
    const testCountry = currentUser?.country || "USA";

    console.log(
      `Generating ${usersCount} test users in ${testCity}, ${testState}, ${testCountry}...`,
    );

    const firstNames = [
      "Alex",
      "Jordan",
      "Taylor",
      "Morgan",
      "Casey",
      "Riley",
      "Avery",
      "Quinn",
      "Peyton",
      "Dakota",
      "Skyler",
      "Rowan",
      "Sage",
      "River",
      "Phoenix",
      "Marley",
      "Kai",
      "Reese",
      "Emerson",
      "Finley",
      "Hayden",
      "Logan",
      "Parker",
      "Cameron",
      "Jamie",
      "Jesse",
      "Blake",
      "Drew",
      "Charlie",
      "Sam",
    ];

    const lastNames = [
      "Runner",
      "Swift",
      "Dash",
      "Storm",
      "Bolt",
      "Flash",
      "Pace",
      "Miles",
      "Track",
      "Sprint",
      "Stride",
      "Chase",
      "Racer",
      "Wind",
      "Speed",
      "Zoom",
      "Rush",
      "Fly",
      "Jet",
      "Blaze",
      "Thunder",
      "Lightning",
      "Fast",
      "Quick",
      "Turbo",
      "Nitro",
      "Rocket",
      "Sonic",
      "Vibe",
      "Energy",
    ];

    const moods = [
      "unstoppable",
      "relaxed",
      "grinding",
      "focused",
      "happy",
      "meh",
      "clearing",
      "race",
    ];

    const testUsers = [];

    // Generate test users
    for (let i = 0; i < usersCount; i++) {
      const firstName =
        firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const username = `${firstName.toLowerCase()}_${lastName.toLowerCase()}${Math.floor(Math.random() * 999)}`;

      try {
        const result = await sql`
          INSERT INTO users (
            username, 
            email, 
            city, 
            state, 
            country, 
            include_in_leaderboard, 
            profile_private,
            dark_mode
          )
          VALUES (
            ${username},
            ${username}@test.com,
            ${testCity},
            ${testState},
            ${testCountry},
            true,
            false,
            true
          )
          RETURNING id
        `;

        testUsers.push({
          id: result[0].id,
          username,
        });
      } catch (error) {
        console.error(`Error creating user ${username}:`, error);
      }
    }

    console.log(`Created ${testUsers.length} test users. Generating runs...`);

    // Generate runs for each test user - targeting different categories
    let totalRuns = 0;

    for (const user of testUsers) {
      // Each user gets 10-25 runs spread over the last month
      const runsCount = Math.floor(Math.random() * 16) + 10;

      for (let i = 0; i < runsCount; i++) {
        // Random date within last 30 days
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);

        // Some users are early birds, some are night owls, most are normal
        let hour;
        const userType = Math.random();
        if (userType < 0.15) {
          // Early bird - before 6am
          hour = Math.floor(Math.random() * 6);
        } else if (userType < 0.3) {
          // Night owl - after 8pm
          hour = 20 + Math.floor(Math.random() * 4);
        } else {
          // Normal hours
          hour = 6 + Math.floor(Math.random() * 14);
        }

        const runDate = new Date();
        runDate.setDate(runDate.getDate() - daysAgo);
        runDate.setHours(hour, Math.floor(Math.random() * 60), 0, 0);

        // Varied distances (1-15 miles)
        const distance = (Math.random() * 14 + 1).toFixed(2);

        // Pace varies by runner skill (5-12 min/mi)
        const basePace = 6 + Math.random() * 6;
        const pace = (basePace + (Math.random() - 0.5) * 2).toFixed(2);

        // Duration based on distance and pace (in seconds)
        const duration = Math.floor(
          parseFloat(distance) * parseFloat(pace) * 60,
        );

        // Steps roughly 2000 per mile
        const steps = Math.floor(
          parseFloat(distance) * (1800 + Math.random() * 400),
        );

        // Calories roughly 100 per mile
        const calories = Math.floor(
          parseFloat(distance) * (90 + Math.random() * 20),
        );

        // Elevation - some routes are flat, some hilly
        const elevationType = Math.random();
        let elevation = 0;
        if (elevationType > 0.6) {
          // Hilly route
          elevation = Math.floor(
            parseFloat(distance) * (50 + Math.random() * 150),
          );
        } else if (elevationType > 0.3) {
          // Moderate hills
          elevation = Math.floor(
            parseFloat(distance) * (20 + Math.random() * 50),
          );
        }
        // else flat (0)

        // Temperature varies (32-95°F)
        const temperature = Math.floor(Math.random() * 63 + 32);

        // Random mood
        const mood = moods[Math.floor(Math.random() * moods.length)];

        // Some runs with pets (20% chance)
        const withPet = Math.random() < 0.2;

        try {
          await sql`
            INSERT INTO runs (
              user_id,
              distance,
              pace,
              duration,
              date,
              start_time,
              location,
              steps,
              calories,
              elevation_gain,
              temperature,
              mood,
              with_pet
            )
            VALUES (
              ${user.id},
              ${distance},
              ${pace},
              ${duration},
              ${runDate.toISOString()},
              ${runDate.toISOString()},
              ${testCity},
              ${steps},
              ${calories},
              ${elevation},
              ${temperature},
              ${mood},
              ${withPet}
            )
          `;
          totalRuns++;
        } catch (error) {
          console.error(`Error creating run for user ${user.username}:`, error);
        }
      }
    }

    console.log(`✅ Test data generated successfully!`);
    console.log(
      `Created ${testUsers.length} users with ${totalRuns} total runs`,
    );

    return Response.json({
      success: true,
      message: `Generated ${testUsers.length} test users with ${totalRuns} runs`,
      users: testUsers.length,
      runs: totalRuns,
      location: `${testCity}, ${testState}, ${testCountry}`,
    });
  } catch (error) {
    console.error("Error generating test data:", error);
    return Response.json(
      { error: "Failed to generate test data", details: error.message },
      { status: 500 },
    );
  }
}

// Allow GET requests to generate with default values
export async function GET() {
  return POST(
    new Request("http://localhost", {
      method: "POST",
      body: JSON.stringify({ usersCount: 20 }),
    }),
  );
}
