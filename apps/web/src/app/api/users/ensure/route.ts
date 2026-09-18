// @ts-nocheck
import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';
import { initializeUserTiers } from '@/app/api/utils/tierHelpers';

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authUserId = session.user.id;
    const email = session.user.email;
    const name = session.user.name;

    if (!authUserId) {
      return Response.json({ error: 'No user ID found' }, { status: 400 });
    }

    const userName = name || email?.split('@')[0] || 'Runner';

    // Check if user already exists in users table by auth_user_id
    const existingUser = await sql`
      SELECT id, username, email, profile_image, dark_mode, is_premium, include_in_leaderboard, notifications_enabled, auth_user_id
      FROM users
      WHERE auth_user_id = ${authUserId}
    `;

    if (existingUser.length > 0) {
      return Response.json({
        user: existingUser[0],
      });
    }

    // Check if a user exists with this email but no auth_user_id (old user record)
    if (email) {
      const userByEmail = await sql`
        SELECT id, username, email, profile_image, dark_mode, is_premium, include_in_leaderboard, notifications_enabled, auth_user_id
        FROM users
        WHERE email = ${email} AND auth_user_id IS NULL
      `;

      if (userByEmail.length > 0) {
        // Update existing user with the auth_user_id
        const updatedUser = await sql`
          UPDATE users
          SET auth_user_id = ${authUserId}
          WHERE id = ${userByEmail[0].id}
          RETURNING id, username, email, profile_image, dark_mode, is_premium, include_in_leaderboard, notifications_enabled, auth_user_id
        `;

        return Response.json({
          user: updatedUser[0],
        });
      }
    }

    // Create new user profile in users table
    const newUser = await sql`
      INSERT INTO users (auth_user_id, username, email, dark_mode, is_premium, include_in_leaderboard, notifications_enabled)
      VALUES (${authUserId}, ${userName}, ${email}, true, false, true, true)
      RETURNING id, username, email, profile_image, dark_mode, is_premium, include_in_leaderboard, notifications_enabled, auth_user_id
    `;

    // Initialize tiers for the new user (all categories start at City Scout)
    await initializeUserTiers(newUser[0].id);

    return Response.json({
      user: newUser[0],
    });
  } catch (error) {
    console.error('Error ensuring user:', error);
    return Response.json(
      { error: 'Failed to create user profile', details: error.message },
      { status: 500 }
    );
  }
}
