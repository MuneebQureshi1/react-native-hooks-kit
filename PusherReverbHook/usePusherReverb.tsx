/**
 * usePusherReverb.tsx
 *
 * This hook is used to handle the Pusher/Reverb connection.
 * It is useful when you need to handle the Pusher/Reverb connection.
 *
 * @param options - The options for the Pusher/Reverb connection.
 * @returns {Object} - An object containing the echo and isConnected functions.
 * @param echo - The echo instance.
 * @param isConnected - Whether the connection is established.
 * packages needed:
 * laravel-echo: npm install laravel-echo
 * pusher-js/react-native: npm install pusher-js/react-native
 */
import Echo from "laravel-echo";
import Pusher from "pusher-js/react-native";
import { useEffect, useState } from "react";

type PusherConfig = {
  /**
   * Pusher/Reverb app key
   */
  appKey: string;
  
  /**
   * WebSocket host
   */
  host: string;
  
  /**
   * WebSocket port (default: 8080)
   */
  port?: number;
  
  /**
   * Scheme for auth endpoint (default: "https")
   */
  scheme?: string;
  
  /**
   * Cluster name (optional)
   */
  cluster?: string;
  
  /**
   * Force TLS (default: false)
   */
  forceTLS?: boolean;
  
  /**
   * Enabled transports (default: ["ws", "wss"])
   */
  enabledTransports?: string[];
};

type ChannelConfig = {
  /**
   * Channel name or pattern (e.g., "booking.{id}" or "private-chat.{id}")
   */
  channelName: string | ((id: number | string) => string);
  
  /**
   * Channel type: "public" or "private" (default: "public")
   */
  channelType?: "public" | "private";
  
  /**
   * Event names to listen for
   */
  eventNames: string[];
  
  /**
   * Callback when message is received
   */
  onMessageReceived: (message: any, eventName: string) => void;
  
  /**
   * Optional callback when channel is subscribed
   */
  onSubscribed?: (channelName: string) => void;
  
  /**
   * Optional callback when channel subscription fails
   */
  onSubscriptionError?: (error: any) => void;
};

type UsePusherReverbOptions = {
  /**
   * Pusher/Reverb configuration
   */
  pusherConfig: PusherConfig;
  
  /**
   * Function to retrieve access token for authentication (optional)
   * Return null if no authentication is needed
   */
  getAccessToken?: () => Promise<string | null>;
  
  /**
   * Channel configuration (optional)
   * If provided, will automatically subscribe to the channel
   */
  channelConfig?: ChannelConfig;
  
  /**
   * Channel identifier (e.g., bookingId, chatId, etc.)
   * Required if channelConfig is provided
   */
  channelId?: number | string;
  
  /**
   * Enable debug logging (default: false)
   */
  enableLogging?: boolean;
  
  /**
   * Custom logger function (optional)
   * If not provided, uses console.log
   */
  logger?: (message: string, ...args: any[]) => void;
  
  /**
   * Callback when connection state changes
   */
  onConnectionStateChange?: (isConnected: boolean, state: string) => void;
};

const usePusherReverb = (options: UsePusherReverbOptions) => {
  const {
    pusherConfig,
    getAccessToken,
    channelConfig,
    channelId,
    enableLogging = false,
    logger = console.log,
    onConnectionStateChange,
  } = options;

  const [echoInstance, setEchoInstance] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  const log = (message: string, ...args: any[]) => {
    if (enableLogging && logger) {
      logger(message, ...args);
    }
  };

  useEffect(() => {
    let PusherClient: any = null;
    let echo: any = null;

    const initializePusher = async () => {
      try {
        const accessToken = getAccessToken ? await getAccessToken() : null;
        
        const {
          appKey,
          host,
          port = 8080,
          scheme = "https",
          cluster,
          forceTLS = false,
          enabledTransports = ["ws", "wss"],
        } = pusherConfig;

        const pusherClientConfig: any = {
          wsHost: host,
          wsPort: port,
          wssPort: port,
          forceTLS,
          enabledTransports,
          ...(cluster && { cluster }),
        };

        if (accessToken) {
          pusherClientConfig.authEndpoint = `${scheme}://${host}/broadcasting/auth`;
          pusherClientConfig.auth = {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
          };
        }

        PusherClient = new Pusher(appKey, pusherClientConfig);

        // Connection event listeners
        PusherClient.connection.bind("connecting", () => {
          log("Pusher connecting...");
          onConnectionStateChange?.(false, "connecting");
        });

        PusherClient.connection.bind("connected", () => {
          log("Pusher connected successfully");
          setIsConnected(true);
          onConnectionStateChange?.(true, "connected");
        });

        PusherClient.connection.bind("disconnected", () => {
          log("Pusher disconnected");
          setIsConnected(false);
          onConnectionStateChange?.(false, "disconnected");
        });

        PusherClient.connection.bind("error", (error: any) => {
          console.error("Pusher connection error:", error);
          setIsConnected(false);
          onConnectionStateChange?.(false, "error");
        });

        PusherClient.connection.bind("unavailable", () => {
          log("Pusher unavailable - server not reachable");
          setIsConnected(false);
          onConnectionStateChange?.(false, "unavailable");
        });

        PusherClient.connection.bind("failed", () => {
          log("Pusher connection failed - authentication or network issue");
          setIsConnected(false);
          onConnectionStateChange?.(false, "failed");
        });

        echo = new Echo({
          broadcaster: "reverb",
          client: PusherClient,
        });

        setEchoInstance(echo);

        // Monitor connection state
        const checkConnection = () => {
          const state = PusherClient.connection.state;

          if (state === "connected") {
            setIsConnected(true);
            onConnectionStateChange?.(true, state);
          } else if (
            state === "failed" ||
            state === "unavailable" ||
            state === "disconnected"
          ) {
            setIsConnected(false);
            onConnectionStateChange?.(false, state);
          }
        };
        checkConnection();
      } catch (error) {
        console.error("Error setting up Pusher:", error);
        onConnectionStateChange?.(false, "error");
      }
    };

    initializePusher();

    return () => {
      log("Cleaning up Pusher connection...");
      if (echo) {
        try {
          echo.disconnect();
        } catch (error) {
          console.error("Error disconnecting Echo:", error);
        }
      }
      if (PusherClient) {
        try {
          PusherClient.disconnect();
        } catch (error) {
          console.error("Error disconnecting Pusher:", error);
        }
      }
    };
  }, [pusherConfig.appKey, pusherConfig.host, getAccessToken]);

  // Set up channel subscription
  useEffect(() => {
    if (!echoInstance || !channelConfig || !channelId) {
      return;
    }

    // Add a small delay to ensure Echo is fully initialized
    const setupChannel = () => {
      try {
        const {
          channelName,
          channelType = "public",
          eventNames,
          onMessageReceived,
          onSubscribed,
          onSubscriptionError,
        } = channelConfig;

        // Generate channel name (support both string and function)
        const finalChannelName =
          typeof channelName === "function"
            ? channelName(channelId)
            : channelName.replace("{id}", String(channelId));

        // Get channel based on type
        let channel: any;
        if (channelType === "private") {
          channel = echoInstance.private(finalChannelName);
        } else {
          channel = echoInstance.channel(finalChannelName);
        }

        log(`Subscribing to ${channelType} channel:`, finalChannelName);

        // Listen for events
        eventNames.forEach((eventName) => {
          channel.listen(eventName, (e: any) => {
            log(`Message received via Echo (${eventName}):`, e);
            onMessageReceived(e, eventName);
          });
        });

        // Handle channel subscription success
        channel.subscribed(() => {
          log("Channel subscribed successfully:", finalChannelName);
          onSubscribed?.(finalChannelName);
        });

        // Handle channel subscription errors
        channel.error((error: any) => {
          log("Channel subscription error:", error);
          onSubscriptionError?.(error);
        });
      } catch (error) {
        log("Error setting up channel:", error);
        channelConfig.onSubscriptionError?.(error);
      }
    };

    // Set up the channel with a small delay to ensure Echo is ready
    const timeoutId = setTimeout(setupChannel, 100);

    return () => {
      clearTimeout(timeoutId);
      // Cleanup channel subscription
      if (echoInstance && channelConfig && channelId) {
        try {
          const finalChannelName =
            typeof channelConfig.channelName === "function"
              ? channelConfig.channelName(channelId)
              : channelConfig.channelName.replace("{id}", String(channelId));
          echoInstance.leave(finalChannelName);
        } catch (error) {
          log("Error leaving channel in cleanup:", error);
        }
      }
    };
  }, [echoInstance, channelConfig, channelId]);

  return { echo: echoInstance, isConnected };
};

export default usePusherReverb;
