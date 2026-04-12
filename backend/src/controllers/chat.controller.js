import { getServerClient } from '../../streamchat/serverClient.js';

/**
 * Generate a Stream Chat token for a user
 */
export const getChatToken = async (req, res) => {
  try {
    const { userId, userName } = req.body;

    if (!userId || !userName) {
      return res.status(400).json({
        success: false,
        message: 'userId and userName are required',
      });
    }

    const streamServerClient = getServerClient();

    // Generate token for the user
    const token = streamServerClient.createToken(userId);

    res.status(200).json({
      success: true,
      token,
      message: 'Chat token generated successfully',
    });
  } catch (error) {
    console.error('[getChatToken] Error generating chat token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate chat token',
      error: error.message,
    });
  }
};

/**
 * Connect AI agent to a channel
 */
export const startAIAgent = async (req, res) => {
  try {
    const { channel_id, channel_type } = req.body;

    if (!channel_id || !channel_type) {
      return res.status(400).json({
        success: false,
        message: 'channel_id and channel_type are required',
      });
    }

    const streamServerClient = getServerClient();

    // Channel is ready for chatting - AI agent can respond to messages via webhook
    res.status(200).json({
      success: true,
      message: 'Channel is ready for chatting',
      channel_id,
    });
  } catch (error) {
    console.error('[startAIAgent] Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to prepare channel',
      error: error.message,
    });
  }
};

/**
 * Check agent status
 */
export const getAgentStatus = async (req, res) => {
  try {
    const { channel_id } = req.query;

    if (!channel_id) {
      return res.status(400).json({
        success: false,
        message: 'channel_id is required',
      });
    }

    const streamServerClient = getServerClient();

    // Check if AI bot is in the channel
    const channel = streamServerClient.channel('messaging', channel_id);
    const members = await channel.queryMembers({ user_id: 'ai-bot-assistant' });

    const isConnected = members.members.length > 0;
    const status = isConnected ? 'connected' : 'disconnected';

    res.status(200).json({
      success: true,
      status,
      message: `Agent status: ${status}`,
    });
  } catch (error) {
    console.error('[getAgentStatus] Error checking agent status:', error);
    res.status(200).json({
      success: true,
      status: 'disconnected',
      message: 'Agent not connected',
    });
  }
};

/**
 * Health check for chat service
 */
export const chatHealthCheck = async (req, res) => {
  try {
    const streamServerClient = getServerClient();
    const isConfigured = !!streamServerClient;

    res.status(200).json({
      success: true,
      message: isConfigured
        ? 'Chat service is initialized'
        : 'Chat service not fully configured',
      configured: isConfigured,
    });
  } catch (error) {
    console.error('[chatHealthCheck] Error:', error);
    res.status(500).json({
      success: false,
      message: 'Chat service health check failed',
      error: error.message,
    });
  }
};
