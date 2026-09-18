// @ts-nocheck
import sql from '@/app/api/utils/sql';
import { auth } from '@/auth';

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const authUserId = session.user.id;

    if (!authUserId) {
      return Response.json({ error: 'No user ID found' }, { status: 400 });
    }

    // Look up the users table ID from auth_users ID
    const currentUserRows = await sql`
      SELECT id FROM users WHERE auth_user_id = ${authUserId}
    `;

    if (currentUserRows.length === 0) {
      return Response.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentUserId = currentUserRows[0].id;

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if this user is actually following you
    const existingFollow = await sql`
      SELECT status FROM followers 
      WHERE follower_id = ${userId} AND following_id = ${currentUserId}
    `;

    if (existingFollow.length === 0) {
      return Response.json({ error: 'This user is not following you' }, { status: 400 });
    }

    const wasAccepted = existingFollow[0].status === 'accepted';

    // Delete the follower record (remove them as a follower)
    await sql`
      DELETE FROM followers 
      WHERE follower_id = ${userId} AND following_id = ${currentUserId}
    `;

    // Only decrement counts if the follow was accepted
    if (wasAccepted) {
      await sql`
        UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = ${userId}
      `;
      await sql`
        UPDATE users SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = ${currentUserId}
      `;
    }

    return Response.json({
      success: true,
      message: 'Follower removed successfully',
    });
  } catch (error) {
    console.error('Error removing follower:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
