// @ts-nocheck
import sql from "@/app/api/utils/sql";

export async function POST(request) {
  try {
    console.log("Clearing test data...");

    // Delete all users with @test.com email
    const deletedUsers = await sql`
      DELETE FROM users 
      WHERE email LIKE '%@test.com'
      RETURNING id
    `;

    console.log(
      `✅ Deleted ${deletedUsers.length} test users and their associated data`,
    );

    return Response.json({
      success: true,
      message: `Deleted ${deletedUsers.length} test users and their runs`,
      deletedUsers: deletedUsers.length,
    });
  } catch (error) {
    console.error("Error clearing test data:", error);
    return Response.json(
      { error: "Failed to clear test data", details: error.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  return POST(
    new Request("http://localhost", {
      method: "POST",
    }),
  );
}
