/**
 * Usage Example for usePusherReverb Hook
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import usePusherReverb from './usePusherReverb';
import AsyncStorage from '@react-native-async-storage/async-storage'; // or your preferred storage

// Example 1: Basic usage with public channel
const BasicPusherExample = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<string>('disconnected');

  const { echo, isConnected } = usePusherReverb({
    pusherConfig: {
      appKey: 'your-pusher-app-key',
      host: 'your-reverb-host.com',
      port: 8080,
      scheme: 'https',
      cluster: 'mt1', // optional
    },
    
    // Optional: Get access token for authentication
    getAccessToken: async () => {
      // Replace with your token retrieval logic
      const token = await AsyncStorage.getItem('@access_token');
      return token || null;
    },
    
    // Channel configuration
    channelConfig: {
      channelName: 'booking.{id}', // Will be replaced with channelId
      channelType: 'public',
      eventNames: ['message.sent', 'booking.updated'],
      
      onMessageReceived: (message, eventName) => {
        console.log(`Received ${eventName}:`, message);
        setMessages((prev) => [...prev, { ...message, eventName, timestamp: new Date() }]);
      },
      
      onSubscribed: (channelName) => {
        console.log('Subscribed to:', channelName);
        Alert.alert('Success', `Subscribed to ${channelName}`);
      },
      
      onSubscriptionError: (error) => {
        console.error('Subscription error:', error);
        Alert.alert('Error', 'Failed to subscribe to channel');
      },
    },
    
    channelId: 123, // Your booking ID or channel identifier
    
    enableLogging: true, // Enable debug logs
    
    onConnectionStateChange: (connected, state) => {
      setConnectionStatus(state);
      console.log('Connection state:', state, 'Connected:', connected);
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pusher/Reverb Example</Text>
      <Text style={styles.status}>
        Status: {isConnected ? '✅ Connected' : '❌ Disconnected'} ({connectionStatus})
      </Text>
      <Text style={styles.subtitle}>Messages ({messages.length}):</Text>
      <ScrollView style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <View key={index} style={styles.messageItem}>
            <Text style={styles.messageText}>
              {msg.eventName}: {JSON.stringify(msg, null, 2)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

// Example 2: Private channel with custom channel name function
const PrivateChannelExample = () => {
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const chatId = 456;

  const { isConnected } = usePusherReverb({
    pusherConfig: {
      appKey: 'your-pusher-app-key',
      host: 'your-reverb-host.com',
      port: 8080,
      scheme: 'https',
    },
    
    getAccessToken: async () => {
      // Private channels require authentication
      const token = await AsyncStorage.getItem('@access_token');
      return token || null;
    },
    
    channelConfig: {
      // Using function for more complex channel naming
      channelName: (id) => `private-chat.${id}`,
      channelType: 'private',
      eventNames: ['message.sent', 'typing.started', 'typing.stopped'],
      
      onMessageReceived: (data, eventName) => {
        if (eventName === 'message.sent') {
          setChatMessages((prev) => [...prev, data.message]);
        } else if (eventName === 'typing.started') {
          console.log('User is typing...');
        }
      },
    },
    
    channelId: chatId,
    enableLogging: true,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Private Chat Channel</Text>
      <Text style={styles.status}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
      <Text>Chat ID: {chatId}</Text>
      <Text>Messages: {chatMessages.length}</Text>
    </View>
  );
};

// Example 3: Minimal setup without channel subscription
const MinimalExample = () => {
  const { echo, isConnected } = usePusherReverb({
    pusherConfig: {
      appKey: 'your-pusher-app-key',
      host: 'your-reverb-host.com',
      port: 8080,
    },
    enableLogging: false,
  });

  // Manually subscribe to channels using the echo instance
  useEffect(() => {
    if (echo && isConnected) {
      const channel = echo.channel('public-channel');
      
      channel.listen('event.name', (data: any) => {
        console.log('Received:', data);
      });
      
      return () => {
        echo.leave('public-channel');
      };
    }
  }, [echo, isConnected]);

  return (
    <View>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
    </View>
  );
};

// Example 4: Multiple channels with dynamic subscription
const MultipleChannelsExample = () => {
  const [activeChannel, setActiveChannel] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const { echo, isConnected } = usePusherReverb({
    pusherConfig: {
      appKey: 'your-pusher-app-key',
      host: 'your-reverb-host.com',
      port: 8080,
      scheme: 'https',
    },
    
    getAccessToken: async () => {
      return await AsyncStorage.getItem('@access_token') || null;
    },
    
    // Subscribe to notifications channel
    channelConfig: {
      channelName: 'notifications',
      channelType: 'public',
      eventNames: ['notification.received'],
      
      onMessageReceived: (notification) => {
        setNotifications((prev) => [...prev, notification]);
        Alert.alert('New Notification', notification.title || 'You have a new notification');
      },
    },
    
    channelId: 'notifications', // Static channel name
    
    enableLogging: true,
  });

  // Manually subscribe to additional channels based on activeChannel
  useEffect(() => {
    if (echo && isConnected && activeChannel) {
      const channel = echo.channel(`booking.${activeChannel}`);
      
      channel.listen('booking.updated', (data: any) => {
        console.log('Booking updated:', data);
      });
      
      return () => {
        echo.leave(`booking.${activeChannel}`);
      };
    }
  }, [echo, isConnected, activeChannel]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Multiple Channels Example</Text>
      <Text>Connected: {isConnected ? 'Yes' : 'No'}</Text>
      <Text>Notifications: {notifications.length}</Text>
      <Text>Active Channel: {activeChannel || 'None'}</Text>
    </View>
  );
};

// Example 5: Real-time booking updates
const BookingUpdatesExample = () => {
  const bookingId = 789;
  const [bookingStatus, setBookingStatus] = useState<string>('pending');
  const [updates, setUpdates] = useState<string[]>([]);

  const { isConnected } = usePusherReverb({
    pusherConfig: {
      appKey: 'your-pusher-app-key',
      host: 'your-reverb-host.com',
      port: 8080,
      scheme: 'https',
    },
    
    getAccessToken: async () => {
      return await AsyncStorage.getItem('@access_token') || null;
    },
    
    channelConfig: {
      channelName: (id) => `booking.${id}`,
      channelType: 'public',
      eventNames: [
        'booking.status.changed',
        'booking.driver.assigned',
        'booking.location.updated',
      ],
      
      onMessageReceived: (data, eventName) => {
        const updateMessage = `${eventName}: ${JSON.stringify(data)}`;
        setUpdates((prev) => [...prev, updateMessage]);
        
        if (eventName === 'booking.status.changed') {
          setBookingStatus(data.status || bookingStatus);
        }
      },
      
      onSubscribed: (channelName) => {
        console.log(`Listening for updates on ${channelName}`);
      },
    },
    
    channelId: bookingId,
    enableLogging: true,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Updates</Text>
      <Text style={styles.status}>
        Status: {isConnected ? 'Connected' : 'Disconnected'}
      </Text>
      <Text>Booking ID: {bookingId}</Text>
      <Text>Current Status: {bookingStatus}</Text>
      <Text style={styles.subtitle}>Updates:</Text>
      <ScrollView style={styles.messagesContainer}>
        {updates.map((update, index) => (
          <Text key={index} style={styles.messageText}>{update}</Text>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  messagesContainer: {
    maxHeight: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
  },
  messageItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
  },
  messageText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

// Export the main example component
export default BasicPusherExample;

