// @ts-nocheck
import sql from "@/app/api/utils/sql";

/**
 * Helper functions for creating notifications
 */

/**
 * Create a notification for a like
 */
export async function createLikeNotification(postOwnerId, likerId, postId) {
  try {
    // Don't notify if user liked their own post
    if (postOwnerId === likerId) return;

    // Get the liker's username
    const [liker] = await sql`
      SELECT username FROM users WHERE id = ${likerId}
    `;

    if (!liker) return;

    await sql`
      INSERT INTO notifications (user_id, type, title, related_user_id, related_post_id)
      VALUES (
        ${postOwnerId}, 
        'like', 
        ${`❤️ ${liker.username} liked your post`},
        ${likerId},
        ${postId}
      )
    `;
  } catch (error) {
    console.error("Error creating like notification:", error);
  }
}

/**
 * Create a notification for a comment
 */
export async function createCommentNotification(
  postOwnerId,
  commenterId,
  postId,
  commentText,
) {
  try {
    // Don't notify if user commented on their own post
    if (postOwnerId === commenterId) return;

    // Get the commenter's username
    const [commenter] = await sql`
      SELECT username FROM users WHERE id = ${commenterId}
    `;

    if (!commenter) return;

    // Truncate comment if too long
    const truncatedComment =
      commentText.length > 100
        ? commentText.substring(0, 100) + "..."
        : commentText;

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_user_id, related_post_id)
      VALUES (
        ${postOwnerId}, 
        'comment', 
        ${`💬 ${commenter.username} commented`},
        ${truncatedComment},
        ${commenterId},
        ${postId}
      )
    `;
  } catch (error) {
    console.error("Error creating comment notification:", error);
  }
}

/**
 * Create a notification for a new medal
 */
export async function createMedalNotification(userId, medalId) {
  try {
    const [medal] = await sql`
      SELECT category, period, rank_achieved, tier, location
      FROM medals
      WHERE id = ${medalId}
    `;

    if (!medal) return;

    const categoryDisplay =
      medal.category.charAt(0).toUpperCase() + medal.category.slice(1);
    const periodDisplay =
      medal.period.charAt(0).toUpperCase() + medal.period.slice(1);

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_medal_id)
      VALUES (
        ${userId}, 
        'medal', 
        '🏅 Medal Awarded!',
        ${`${categoryDisplay} - ${periodDisplay} - Rank #${medal.rank_achieved}`},
        ${medalId}
      )
    `;
  } catch (error) {
    console.error("Error creating medal notification:", error);
  }
}

/**
 * Create a notification for a tier promotion
 */
export async function createTierPromotionNotification(userId, tierPromotionId) {
  try {
    const [promotion] = await sql`
      SELECT category, from_tier, to_tier, from_location, to_location, promotion_type
      FROM tier_promotions
      WHERE id = ${tierPromotionId}
    `;

    if (!promotion) return;

    const categoryDisplay =
      promotion.category.charAt(0).toUpperCase() + promotion.category.slice(1);

    const tierNames = {
      scout: "Scout",
      ranger: "Ranger",
      apex: "Apex",
      legend: "Legend",
    };

    const fromTierName = tierNames[promotion.from_tier] || promotion.from_tier;
    const toTierName = tierNames[promotion.to_tier] || promotion.to_tier;

    const isPromotion = promotion.promotion_type.includes("promotion");
    const title = isPromotion ? "🎉 Tier Promotion!" : "📉 Tier Update";
    const message = `${categoryDisplay}: ${fromTierName} → ${toTierName}`;

    const notificationType = isPromotion ? "tier_promotion" : "tier_demotion";

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_tier_promotion_id)
      VALUES (
        ${userId}, 
        ${notificationType}, 
        ${title},
        ${message},
        ${tierPromotionId}
      )
    `;
  } catch (error) {
    console.error("Error creating tier promotion notification:", error);
  }
}

/**
 * Create a notification for a follow
 */
export async function createFollowNotification(followedUserId, followerId) {
  try {
    const [follower] = await sql`
      SELECT username FROM users WHERE id = ${followerId}
    `;

    if (!follower) return;

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_user_id)
      VALUES (
        ${followedUserId}, 
        'follow', 
        '👤 New Follower',
        ${`${follower.username} started following you`},
        ${followerId}
      )
    `;
  } catch (error) {
    console.error("Error creating follow notification:", error);
  }
}

/**
 * Create a notification for a follow request (private profile)
 */
export async function createFollowRequestNotification(
  targetUserId,
  requesterId,
) {
  try {
    const [requester] = await sql`
      SELECT username FROM users WHERE id = ${requesterId}
    `;

    if (!requester) return;

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_user_id)
      VALUES (
        ${targetUserId}, 
        'follow_request', 
        '👤 Follow Request',
        ${`${requester.username} wants to follow you`},
        ${requesterId}
      )
    `;
  } catch (error) {
    console.error("Error creating follow request notification:", error);
  }
}

/**
 * Create a notification for an accepted follow request
 */
export async function createFollowAcceptedNotification(
  requesterId,
  accepterId,
) {
  try {
    const [accepter] = await sql`
      SELECT username FROM users WHERE id = ${accepterId}
    `;

    if (!accepter) return;

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_user_id)
      VALUES (
        ${requesterId}, 
        'follow_accepted', 
        '✅ Follow Request Accepted',
        ${`${accepter.username} accepted your follow request`},
        ${accepterId}
      )
    `;
  } catch (error) {
    console.error("Error creating follow accepted notification:", error);
  }
}

/**
 * Create a notification for a personal best
 */
export async function createPersonalBestNotification(userId, runId, category) {
  try {
    const categoryDisplay =
      category.charAt(0).toUpperCase() + category.slice(1);

    await sql`
      INSERT INTO notifications (user_id, type, title, message, related_run_id)
      VALUES (
        ${userId}, 
        'personal_best', 
        '🎯 New Personal Best!',
        ${`You set a new PR for ${categoryDisplay}!`},
        ${runId}
      )
    `;
  } catch (error) {
    console.error("Error creating personal best notification:", error);
  }
}

/**
 * Create a notification for a streak milestone
 */
export async function createStreakNotification(userId, days) {
  try {
    await sql`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (
        ${userId}, 
        'streak', 
        ${`🔥 ${days}-Day Streak!`},
        'Keep it up!'
      )
    `;
  } catch (error) {
    console.error("Error creating streak notification:", error);
  }
}

/**
 * Create a notification for a milestone (e.g., total distance)
 */
export async function createMilestoneNotification(
  userId,
  milestoneType,
  value,
) {
  try {
    let message = "";

    switch (milestoneType) {
      case "total_miles":
        message = `You've run ${value} miles total!`;
        break;
      case "total_runs":
        message = `You've completed ${value} runs!`;
        break;
      case "total_time":
        message = `You've run for ${value} hours total!`;
        break;
      default:
        message = `You reached ${value}!`;
    }

    await sql`
      INSERT INTO notifications (user_id, type, title, message)
      VALUES (
        ${userId}, 
        'milestone', 
        '🎊 Milestone Reached!',
        ${message}
      )
    `;
  } catch (error) {
    console.error("Error creating milestone notification:", error);
  }
}

/**
 * Detect @username mentions in text and create notifications
 * Returns array of mentioned usernames
 */
export async function detectAndNotifyMentions(text, postId, mentioningUserId) {
  try {
    if (!text) return [];

    // Find all @username mentions (alphanumeric + underscore)
    const mentionPattern = /@(\w+)/g;
    const matches = text.matchAll(mentionPattern);
    const mentionedUsernames = new Set();

    for (const match of matches) {
      mentionedUsernames.add(match[1]);
    }

    // Look up each username and create notifications
    const notifiedUsers = [];
    for (const username of mentionedUsernames) {
      const [user] = await sql`
        SELECT id, username FROM users WHERE LOWER(username) = LOWER(${username})
      `;

      if (user && user.id !== mentioningUserId) {
        // Don't notify if user mentioned themselves
        const [mentioningUser] = await sql`
          SELECT username FROM users WHERE id = ${mentioningUserId}
        `;

        if (mentioningUser) {
          await sql`
            INSERT INTO notifications (user_id, type, title, message, related_user_id, related_post_id)
            VALUES (
              ${user.id},
              'mention',
              '🏷️ You were mentioned',
              ${`${mentioningUser.username} mentioned you in a post`},
              ${mentioningUserId},
              ${postId}
            )
          `;
          notifiedUsers.push(user.username);
        }
      }
    }

    return notifiedUsers;
  } catch (error) {
    console.error("Error detecting and notifying mentions:", error);
    return [];
  }
}
