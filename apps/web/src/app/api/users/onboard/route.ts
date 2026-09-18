// @ts-nocheck
import sql from "@/app/api/utils/sql";
import { SignJWT } from "jose";
import { initializeUserTiers } from "@/app/api/utils/tierHelpers";

export async function POST(request) {
  try {
    const { name, username } = await request.json();

    if (!name || !username) {
      return Response.json(
        { error: "Name and username are required" },
        { status: 400 },
      );
    }

    // Check if username is already taken
    const existingUsername = await sql`
      SELECT id FROM users WHERE username = ${username.toLowerCase()}
    `;

    if (existingUsername.length > 0) {
      return Response.json(
        { error: "Username already taken" },
        { status: 409 },
      );
    }

    // Create auth_user without password (anonymous onboarding)
    const authUser = await sql`
      INSERT INTO auth_users (name, email, "emailVerified")
      VALUES (${name}, NULL, NULL)
      RETURNING id, name, email
    `;

    const authUserId = authUser[0].id;

    // Create user profile
    const user = await sql`
      INSERT INTO users (
        auth_user_id,
        username,
        email,
        dark_mode,
        is_premium,
        include_in_leaderboard,
        notifications_enabled
      )
      VALUES (
        ${authUserId},
        ${username.toLowerCase()},
        NULL,
        true,
        false,
        true,
        true
      )
      RETURNING id, username, email, profile_image, dark_mode, is_premium, auth_user_id
    `;

    // Initialize tiers
    await initializeUserTiers(user[0].id);

    // Create JWT token
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
    const token = await new SignJWT({
      sub: authUserId.toString(),
      name: name,
      email: null,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("30d")
      .sign(secret);

    return Response.json({
      user: user[0],
      token,
    });
  } catch (error) {
    console.error("Error during onboarding:", error);
    return Response.json(
      { error: "Failed to create account", details: error.message },
      { status: 500 },
    );
  }
}
