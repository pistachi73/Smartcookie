import messages from '../../messages/en-GB.json';
 
declare module 'next-intl' {
  interface AppConfig {
    // ...
    Messages: typeof messages;
  }
}
