import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
});

const ALGORITHM = 'aes-256-gcm';
const ENCRYPTION_KEY = process.env.MESSAGE_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex');
const IV_LENGTH = 16;

export class MessageSecurityService {
  // Message encryption
  static async encryptMessage(text: string): Promise<{ encryptedText: string; iv: string }> {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag();
    
    return {
      encryptedText: encrypted + ':' + authTag.toString('hex'),
      iv: iv.toString('hex')
    };
  }

  static async decryptMessage(encryptedText: string, iv: string): Promise<string> {
    const [encrypted, authTag] = encryptedText.split(':');
    const decipher = crypto.createDecipheriv(
      ALGORITHM,
      Buffer.from(ENCRYPTION_KEY, 'hex'),
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  // Rate limiting
  static async checkRateLimit(userId: string, action: 'message' | 'request'): Promise<boolean> {
    const key = `${action}_limit:${userId}`;
    const limit = action === 'message' ? 100 : 5; // 100 messages or 5 requests per day
    const period = 24 * 60 * 60; // 24 hours in seconds

    const current = await redis.incr(key);
    if (current === 1) {
      await redis.expire(key, period);
    }

    return current <= limit;
  }

  // Spam detection
  static async isSpam(userId: string, content: string): Promise<boolean> {
    // Check for duplicate messages in last hour
    const key = `last_messages:${userId}`;
    const recentMessages = await redis.lrange(key, 0, -1);
    
    // If exact same message was sent recently, consider it spam
    if (recentMessages.includes(content)) {
      return true;
    }

    // Store message for future checks
    await redis.lpush(key, content);
    await redis.ltrim(key, 0, 9); // Keep last 10 messages
    await redis.expire(key, 3600); // Expire after 1 hour

    // Enhanced spam patterns
    const spamPatterns = [
      /\b(viagra|cialis|buy now|click here|win|lottery|casino|bet|gambling)\b/i,
      /\b(http|https|www\.)\b/i,
      /(.)\1{4,}/,  // Repeated characters (e.g., "hellooooo")
      /\b(whatsapp|telegram|instagram|snapchat)\b.*?[0-9]{10}/i, // Social media with phone numbers
      /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, // Email addresses
      /\+?\d{10,}/g, // Phone numbers
      /\b(sex|sexy|hot|adult|dating)\b/i, // Adult content
      /\$\d+|\d+\$/  // Money/price mentions
    ];

    // Check message length
    if (content.length > 1000) {
      return true; // Too long, likely spam
    }

    // Check for excessive capitalization
    const upperCaseRatio = (content.match(/[A-Z]/g) || []).length / content.length;
    if (upperCaseRatio > 0.5) {
      return true; // Too many uppercase letters
    }

    // Check for repetitive messages
    const similarMessages = recentMessages.filter((msg: string) => {
      const similarity = this.calculateSimilarity(content, msg);
      return similarity > 0.8; // 80% similar
    });
    if (similarMessages.length > 0) {
      return true;
    }

    return spamPatterns.some(pattern => pattern.test(content));
  }

  // Helper function to calculate text similarity
  private static calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    if (longer.length === 0) {
      return 1.0;
    }
    
    const editDistance = this.levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }

  private static levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i;
    }
    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j;
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const substitutionCost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + substitutionCost
        );
      }
    }
    return matrix[str2.length][str1.length];
  }

  // Check if user is blocked
  static async canInteract(senderId: string, receiverId: string): Promise<boolean> {
    const blocked = await prisma.userBlock.findFirst({
      where: {
        OR: [
          { blockedById: receiverId, blockedUserId: senderId },
          { blockedById: senderId, blockedUserId: receiverId }
        ]
      }
    });

    return !blocked;
  }

  // Report message
  static async reportMessage(messageId: string, reporterId: string, reason: string): Promise<void> {
    await prisma.messageReport.create({
      data: {
        messageId,
        reporterId,
        reason
      }
    });

    // If message gets reported multiple times, auto-block the sender
    const reportCount = await prisma.messageReport.count({
      where: {
        message: {
          id: messageId
        }
      }
    });

    if (reportCount >= 3) {
      const message = await prisma.message.findUnique({
        where: { id: messageId },
        select: { senderId: true, receiverId: true }
      });

      if (message) {
        // Auto-block user if they get multiple reports
        await prisma.userBlock.create({
          data: {
            blockedById: message.receiverId,
            blockedUserId: message.senderId,
            reason: 'Automatic block due to multiple reports'
          }
        });
      }
    }
  }
} 