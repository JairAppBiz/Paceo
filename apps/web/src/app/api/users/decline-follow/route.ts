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
    const { followerId } = body;

    if (!followerId) {
      return Response.json({ error: 'Follower ID is required' }, { status: 400 });
    }

    // Check if there's a pending follow request
    const existingFollow = await sql`
      SELECT * FROM followers 
      WHERE follower_id = ${followerId} AND following_id = ${currentUserId} AND status = 'pending'
    `;

    if (existingFollow.length === 0) {
      return Response.json({ error: 'No pending follow request found' }, { status: 404 });
    }

    // Delete the follow request
    await sql`
      DELETE FROM followers 
      WHERE follower_id = ${followerId} AND following_id = ${currentUserId}
    `;

    return Response.json({
      success: true,
      message: 'Follow request declined',
    });
  } catch (error) {
    console.error('Error declining follow request:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
